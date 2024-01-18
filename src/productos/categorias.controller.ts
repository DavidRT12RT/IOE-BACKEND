import { Body, Controller, Get, Post, Query } from "@nestjs/common";

//Decorator's
import { Auth, GetUser } from "src/auth/decorators";

//Entities
import { Usuario } from "src/auth/entities/usuario.entity";

//Dto's
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CreateCategoriaDto } from "./dto/create-categoria.dto";

//Service's
import { CategoriasService } from "./categorias.service";

@Controller("categorias")
export class CategoriasController{

    constructor(
        private readonly categoriasService:CategoriasService
    ){}

	@Post("categorias")
	@Auth()
	createCategoria(
		@Body() createCategoriaDto:CreateCategoriaDto,
		@GetUser() user:Usuario
	){

		return this.categoriasService.createCategoria(createCategoriaDto,user);
	}

	@Get("categorias")
	@Auth()
	findAllCategorias(
		@Query() paginationDto:PaginationDto
	){

		return this.categoriasService.findAllCategorias(paginationDto);
	}

};