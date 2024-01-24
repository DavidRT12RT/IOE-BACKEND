import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';

//Entities
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { Producto } from './entities/producto.entity';

import { SucursalService } from 'src/sucursales/sucursales.service';
import { CategoriasService } from './categorias.service';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AlmacenesService } from 'src/sucursales/almacenes.service';
import { handleDBErrors } from 'src/common/helpers/db_errors';

@Injectable()
export class ProductosService {

	private readonly logger = new Logger("ProductosService");

	constructor(
		private readonly almacenService:AlmacenesService,

		@InjectRepository(Producto)
		private readonly productoRepository:Repository<Producto>,
		
		private readonly categoriasService:CategoriasService
	){}

 	async createProducto(createProductoDto: CreateProductoDto,user:Usuario) {

		try {
			
			const { categoria:categoriaID,almacen:almacenID,...productoDtoData } = createProductoDto;

			//Primero buscamos el almacen y comprobamos que exista
			const { almacen } = await this.almacenService.findOneAlmacen(almacenID);

			//Despues buscamos la categoria y comprobamos que exista
			const { categoria } = await this.categoriasService.findOneCategoriaById(categoriaID);
			

			const producto = this.productoRepository.create({
				...productoDtoData,
				usuarioCreador:user,
				almacen,
				categoria
			});

			await this.productoRepository.save(producto);

			return {
				producto,
				message:"Producto creado con exito!"
			};

		} catch (error) {
			handleDBErrors(error);
		}

  	}



  	async findAllProductos(
		paginationDto:PaginationDto
	) {

		const { limit = 10, offset = 0 } = paginationDto;

		const productos = await this.productoRepository.createQueryBuilder("producto")
		.leftJoinAndSelect("producto.almacen","almacen")
		.leftJoinAndSelect("producto.categoria","categoria")
		.skip(offset)
		.limit(limit)
		.getMany()

		return {
			productos
		}

  	}

  	async findOneProductoById(
		id:string,
	) {

		const producto = await this.productoRepository.createQueryBuilder("producto")
		.leftJoinAndSelect("producto.almacen","almacen")
		.leftJoinAndSelect("producto.categoria","categoria")
		.where("producto.id = :id",{id})
		.getOne()
		
		if(!producto) throw new NotFoundException(`El producto con id ${id} no existe!`);

		return {
			producto
		}

  	}

	async findProductosByCategory(
		categoriaID:string,
		paginationDto?:PaginationDto
	):Promise<{productos: Producto[]}>{

		const productos =  await this.productoRepository.createQueryBuilder("productos")
		.leftJoinAndSelect("productos.almacen","almacen")
		.leftJoinAndSelect("productos.categoria","categoria")
		.where("categoria.id =:categoriaID",{categoriaID})
		// .skip(paginationDto.offset)
		// .limit(paginationDto.limit)
		.getMany();


		return {
			productos
		}
	}



}
