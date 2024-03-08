import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from "@nestjs/common";

//Decorator's
import { Auth, GetUser } from "src/auth/decorators";

//Entities
import { Usuario } from "src/auth/entities/usuario.entity";

//Dto's
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CreateCategoriaDto } from "./dto/create-categoria.dto";

//Service's
import { CategoriasService } from "./categorias.service";
import { UpdateCategoriaDto } from "./dto/update-categoria.dto";

@Controller("categorias")
export class CategoriasController{

    constructor(
        private readonly categoriasService:CategoriasService
    ){}

	@Get()
	// @Auth()
	findAllCategorias(
		@Query() paginationDto:PaginationDto
	){

		return this.categoriasService.findAllCategorias(paginationDto);
	}

	@Get("/:id")
	@Auth()
	findOneCategoriaById(
		@Param("id",ParseUUIDPipe) id:string,
	){
		return this.categoriasService.findOneCategoriaById(id);
	}

	@Post()
	@Auth()
	createCategoria(
		@Body() createCategoriaDto:CreateCategoriaDto,
		@GetUser() user:Usuario
	){

		return this.categoriasService.createCategoria(createCategoriaDto,user);
	}

	@Put("/:id")
	@Auth()
	updateCategoria(
		@Param("id",ParseUUIDPipe) id:string,
		@Body() updateCategoriaDto:UpdateCategoriaDto,
		@GetUser() user:Usuario
	){
		return this.categoriasService.updateCategoria(id,updateCategoriaDto,user);
	}


};