import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';


//Auth
import { Auth, GetUser } from 'src/auth/decorators';

//Entities
import { Sucursal } from './entities/sucursal.entity';

//DTO's
import { CreateAlmacenDto } from './dto/create-almacen.dto';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Usuario } from 'src/auth/entities/usuario.entity';

import { SucursalService } from './sucursales.service';

@Controller('sucursal')
export class SucursalController {

	constructor(private readonly sucursalService: SucursalService) {}

  	@Post()
	@Auth()
  	createSucursal(
		@Body() createSucursalDto: CreateSucursalDto,
		@GetUser() user:Usuario
	) {
    	return this.sucursalService.createSucursal(createSucursalDto,user);
  	}

	@Post("almacen")
	@Auth()
	createWarehouse(
		@Body() createAlmacenDto: CreateAlmacenDto,
		@GetUser() user:Usuario
	){

		return this.sucursalService.createAlmacen(createAlmacenDto,user);
	}

	@Get()
	@Auth()
	getAllSucursales(
		@Query() paginationDto:PaginationDto
	){
		return this.sucursalService.findAllSucursales(paginationDto);
	}

}
