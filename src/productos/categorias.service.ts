import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateCategoriaDto } from "./dto/create-categoria.dto";

import { handleDBErrors } from "src/common/helpers/db_errors";

import { Repository } from "typeorm";
import { Categoria } from "./entities/categoria.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { UpdateCategoriaDto } from "./dto/update-categoria.dto";
import { Usuario } from "src/auth/entities/usuario.entity";
import { ProductosService } from "./productos.service";
import { Producto } from "./entities/producto.entity";

@Injectable()
export class CategoriasService{

    constructor(
        @InjectRepository(Categoria)
        private readonly categoriaRepository:Repository<Categoria>,

		@InjectRepository(Producto)
		private readonly productoRepository:Repository<Producto>,
    ){}

	async createCategoria(createCategoriaDto:CreateCategoriaDto,user){

		const { categoria_padre,...toCreate } = createCategoriaDto;

		try {

			const categoriaDB = this.categoriaRepository.create({
				categoria_padre:{id:categoria_padre},
				...toCreate,
				usuarioCreador:user
			});

			await this.categoriaRepository.save(categoriaDB);

			//Buscamos la categoria creada y cargamos las relaciones
			const { categoria } = await this.findOneCategoriaById(categoriaDB.id);

			return {
				categoria,
				message:"Categoria creada con exito!"
			};

		} catch (error) {
			handleDBErrors(error);
		}
	}

	async updateCategoria(id:string,updateCategoriaDto:UpdateCategoriaDto,user:Usuario){

		const { categoria } = await this.findOneCategoriaById(id);

		categoria.nombre = updateCategoriaDto.nombre || categoria.nombre;
		categoria.descripcion = updateCategoriaDto.descripcion || categoria.descripcion;

		//Desasignar productos de la categoria
		const { productosDesvincular,productosVincular} = updateCategoriaDto;

		for(const productoDesvincular of productosDesvincular){
			categoria.productos = categoria.productos.filter(producto => producto.id !== productoDesvincular);
		}

		//Asignar nuevos productos a la categoria
		for(const productoVincularId of productosVincular){
			const producto = await this.productoRepository.createQueryBuilder("producto")
			.where("producto.id = :id",{id:productoVincularId})
			.getOne();
			categoria.productos.push(producto);
		}

		await this.categoriaRepository.save(categoria);

		return {
			categoria,
			message:"Categoria actualizada con exito!"
		};

	}

	async findAllCategorias(
		paginationDto:PaginationDto
	) {

		const { limit = 10, offset = 0 } = paginationDto;

		const categorias = await this.categoriaRepository.createQueryBuilder("categoria")
		.leftJoinAndSelect("categoria.usuarioCreador","usuarioCreador")
		.leftJoinAndSelect("categoria.productos","productos")
		.leftJoinAndSelect("categoria.categoria_padre","categoria_padre")
		.leftJoinAndSelect("categoria_padre.productos","categoria_padre_productos")
		.leftJoinAndSelect("categoria.categorias_hija","categorias_hija")
		.leftJoinAndSelect("categorias_hija.productos","categorias_hija_productos")
		.leftJoinAndSelect("categorias_hija.categoria_padre","categorias_hija_categoria_padre")
		// .skip(offset)
		// .limit(limit)
		.getMany()

		return {
			categorias,
			total:categorias.length
		}

  	}
	
	async findOneCategoriaById(id:string){

		const categoria = await this.categoriaRepository.createQueryBuilder("categoria")
		.where("categoria.id = :id",{id})
		.leftJoinAndSelect("categoria.usuarioCreador","usuarioCreador")
		.leftJoinAndSelect("categoria.productos","productos")
		.leftJoinAndSelect("categoria.categoria_padre","categoria_padre")
		.leftJoinAndSelect("categoria_padre.productos","categoria_padre_productos")
		.leftJoinAndSelect("categoria.categorias_hija","categorias_hija")
		.leftJoinAndSelect("categorias_hija.productos","categorias_hija_productos")
		.leftJoinAndSelect("categorias_hija.categoria_padre","categorias_hija_categoria_padre")
		.getOne();

		if(!categoria) throw new NotFoundException(`Ninguna categoria encontrada por el id ${id}`);

		return {
			categoria
		};

	}



};