import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';

//Entities
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { Producto } from './entities/producto.entity';

import { SucursalService } from 'src/sucursales/sucursales.service';
import { CategoriasService } from './categorias.service';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AlmacenesService } from 'src/sucursales/almacenes.service';
import { handleDBErrors } from 'src/common/helpers/db_errors';
import { ProductoAlmacen } from './entities/producto-almacen.entity';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {

	private readonly logger = new Logger("ProductosService");

	constructor(
		private readonly almacenService:AlmacenesService,

		@InjectRepository(Producto)
		private readonly productoRepository:Repository<Producto>,

		@InjectRepository(ProductoAlmacen)
		private readonly productoAlmacenRepository:Repository<ProductoAlmacen>,

		private readonly dataSource:DataSource,
		
		private readonly categoriasService:CategoriasService
	){}

 	async createProducto(createProductoDto: CreateProductoDto,user:Usuario) {

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			
			const { categoria:categoriaID,almacenes,...productoDtoData} = createProductoDto;

			//Despues buscamos la categoria y comprobamos que exista
			const { categoria } = await this.categoriasService.findOneCategoriaById(categoriaID);

			const producto = this.productoRepository.create({
				...productoDtoData,
				usuarioCreador:user,
				categoria
			});

			await this.productoRepository.save(producto); // Guardar para tener ID

			if(almacenes.length >= 1){
				//Insertar el producto en cada uno de los almacenes
				for(const almacenInfo of almacenes){
					const { almacen:almacenId,stock } = almacenInfo;
					const { almacen } = await this.almacenService.findOneAlmacenById(almacenId);
					const productoAlmacen = this.productoAlmacenRepository.create({
						producto,
						almacen,
						stock
					});
					await this.productoAlmacenRepository.save(productoAlmacen);
				}
			}

			await queryRunner.commitTransaction();
			
			return {
				producto,
				message:"Producto creado con exito!"
			};

		} catch (error) {
			await queryRunner.rollbackTransaction();
			handleDBErrors(error);
		} finally{
			await queryRunner.release();
		}

  	}

	async updateProducto(
		id:string,
		updateProductoDto:UpdateProductoDto,
		user:Usuario
	){

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {

			const { producto } = await this.findOneProductoById(id);

			const { almacenes,categoria,...toUpdate } = updateProductoDto;

			producto.nombre = toUpdate.nombre || producto.nombre;
			producto.costo_promedio = toUpdate.costo_promedio || producto.costo_promedio;
			producto.material = toUpdate.material || producto.material;
			producto.descripcion = toUpdate.descripcion || producto.descripcion;
			producto.stock_minimo = toUpdate.stock_minimo || producto.stock_minimo;
			producto.color = toUpdate.color || producto.color;

			if(categoria){
				const { categoria:categoriaDB } = await this.categoriasService.findOneCategoriaById(categoria);
				producto.categoria = categoriaDB;
			}

			if(almacenes){
				// Elimino todos las relaciones de almacen
				await queryRunner.manager.delete(ProductoAlmacen,{producto:{id}}); 
				producto.productosAlmacen = [];

				for(const almacenInfo of almacenes){
					const { almacen:almacenId,stock } = almacenInfo;

					const { almacen } = await this.almacenService.findOneAlmacenById(almacenId);
					let productoAlmacen = this.productoAlmacenRepository.create({
						producto,
						almacen,
						stock
					});
					productoAlmacen = await this.productoAlmacenRepository.save(productoAlmacen);
					producto.productosAlmacen.push(productoAlmacen);
				}
			}

			this.productoRepository.save(producto);
			await queryRunner.commitTransaction();

			producto.stock = this.calcularStockTotal(producto);

			return {
				message:"Producto actualizado con exito!",
				producto
			};
			
		} catch (error) {
			await queryRunner.rollbackTransaction();
			handleDBErrors(error);
		} finally{
			await queryRunner.release();
		}
	}



  	async findAllProductos(
		paginationDto:PaginationDto
	) {

		const { limit = 10, offset = 0 } = paginationDto;

		let productos = await this.productoRepository.createQueryBuilder("producto")
		.leftJoinAndSelect("producto.productosAlmacen","productosAlmacen")
		.leftJoinAndSelect("productosAlmacen.almacen","almacen")
		.leftJoinAndSelect("producto.categoria","categoria")
		.skip(offset)
		.limit(limit)
		.getMany()

		productos = productos.map(producto => { 
			producto.stock = this.calcularStockTotal(producto);
			return producto;
		});

		return {
			productos
		}

  	}

  	async findOneProductoById(
		id:string,
	) {

		const producto = await this.productoRepository.createQueryBuilder("producto")
		.leftJoinAndSelect("producto.productosAlmacen","almacenes")
		.leftJoinAndSelect("producto.categoria","categoria")
		.where("producto.id = :id",{id})
		.getOne()
		
		if(!producto) throw new NotFoundException(`El producto con id ${id} no existe!`);

		producto.stock = this.calcularStockTotal(producto);

		return {
			producto
		}

  	}

	async findProductosByCategory(
		categoriaID:string,
		paginationDto?:PaginationDto
	):Promise<{productos: Producto[]}>{

		let productos =  await this.productoRepository.createQueryBuilder("productos")
		.leftJoinAndSelect("productos.almacen","almacen")
		.leftJoinAndSelect("productos.categoria","categoria")
		.where("categoria.id =:categoriaID",{categoriaID})
		// .skip(paginationDto.offset)
		// .limit(paginationDto.limit)
		.getMany();

		productos = productos.map(producto => { 
			producto.stock = this.calcularStockTotal(producto);
			return producto;
		});

		return {
			productos
		}
	}

	calcularStockTotal(producto: Producto): number {
		// Lógica para calcular el stock total, puedes implementarla según tus necesidades
    	if (producto.productosAlmacen && producto.productosAlmacen.length > 0) {

			let stock_total = 0;
			for(const almacenInfo of producto.productosAlmacen){
				stock_total += almacenInfo.stock;
			}
			return stock_total;

    	} else {
      		return producto.stock || 0; // Si no hay productos en almacén, devuelve el stock directo del producto
    	}
	}

}
