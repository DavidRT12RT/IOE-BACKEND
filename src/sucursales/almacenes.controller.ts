import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Auth, GetUser } from "src/auth/decorators";
import { CreateAlmacenDto } from "./dto/create-almacen.dto";
import { Usuario } from "src/auth/entities/usuario.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { AlmacenesService } from "./almacenes.service";

@Controller("almacenes")
export class AlmacenesController {

	constructor(
		private readonly almacenesService:AlmacenesService
	){}

	@Get()
	// @Auth()
	getAllAlmacen(
		@Query() paginationDto:PaginationDto
	){
		return this.almacenesService.findAllAlmacenes(paginationDto);
	}

	@Post()
	@Auth()
	createWarehouse(
		@Body() createAlmacenDto: CreateAlmacenDto,
		@GetUser() user:Usuario
	){

		return this.almacenesService.createAlmacen(createAlmacenDto,user);
	}

};