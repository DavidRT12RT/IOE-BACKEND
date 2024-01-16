import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

//Entities
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { Producto } from './entities/producto.entity';
import { SucursalService } from 'src/sucursales/sucursales.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class ProductosService {

	private readonly logger = new Logger("ProductosService");

	constructor(
		private readonly sucursalService:SucursalService,

		@InjectRepository(Producto)
		private readonly productoRepository:Repository<Producto>,
		
		@InjectRepository(Categoria)
		private readonly categoriaRepository:Repository<Categoria>,

	){}

 	async createProducto(createProductoDto: CreateProductoDto,user:Usuario) {

		try {
			
			const { categoria:categoriaID,almacen:almacenID,...productoDtoData } = createProductoDto;

			//Primero buscamos el almacen y comprobamos que exista
			const { almacen } = await this.sucursalService.findOneAlmacen(almacenID);

			//Despues buscamos la categoria y comprobamos que exista
			const { categoria } = await this.findOneCategoria(categoriaID);
			

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
			this.handleDBErrors(error);
		}

  	}

	async createCategoria(createCategoria:CreateCategoriaDto,user){

		try {

			const categoria = this.categoriaRepository.create({
				...createCategoria,
				usuarioCreador:user
			});

			await this.categoriaRepository.save(categoria);

			return {
				categoria,
				message:"Categoria creada con exito!"
			};

		} catch (error) {
			this.handleDBErrors(error);
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

	async findAllCategorias(
		paginationDto:PaginationDto
	) {

		const { limit = 10, offset = 0 } = paginationDto;

		const categorias = await this.categoriaRepository.createQueryBuilder("categoria")
		.leftJoinAndSelect("categoria.productos","productos")
		.leftJoinAndSelect("productos.almacen","almacen")
		.leftJoinAndSelect("almacen.sucursal","sucursal")
		.skip(offset)
		.limit(limit)
		.getMany()

		return {
			categorias
		}

  	}
	
	async findOneCategoria(id:string){

		const categoria = await this.categoriaRepository.createQueryBuilder("categoria")
		.where("categoria.id = :id",{id})
		.leftJoinAndSelect("categoria.productos","productos")
		.getOne();

		if(!categoria) throw new NotFoundException(`Ninguna categoria encontrada por el id ${id}`);

		return {
			categoria
		};

	}



    private handleDBErrors(error:any):never{ //-> never jamas regresara algo
        if(error.code === "23505") throw new BadRequestException(error.detail);

        this.logger.error(error);

        throw new InternalServerErrorException("Please check server logs...");
    }

}
