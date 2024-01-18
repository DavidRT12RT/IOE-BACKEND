import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateCategoriaDto } from "./dto/create-categoria.dto";

import { handleDBErrors } from "src/common/helpers/db_errors";

import { Repository } from "typeorm";
import { Categoria } from "./entities/categoria.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "src/common/dtos/pagination.dto";

@Injectable()
export class CategoriasService{

    constructor(
        @InjectRepository(Categoria)
        private readonly categoriaRepository:Repository<Categoria>
    ){}

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
			handleDBErrors(error);
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



};