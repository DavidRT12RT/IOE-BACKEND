import { Controller, Get, Post, Body, Query, Put, Param, ParseUUIDPipe } from '@nestjs/common';
import { InventariosService } from './inventarios.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { UpdateInventarioDetalleDto } from './dto/update-inventario-detalle.dto';

@Controller('inventarios')
export class InventariosController {

 	constructor(private readonly inventariosService: InventariosService) {}

  	@Get()
	@Auth()
  	findAll(
		@Query() paginationDto:PaginationDto
	) {
    	return this.inventariosService.findAllInventarios(paginationDto);
  	}

	@Get("/:id")
	@Auth()
	findOne(
		@Param("id",ParseUUIDPipe) id:string
	){
		return this.inventariosService.findOneInventarioById(id);
	}

  	@Post()
	@Auth()
  	create(
		@Body() createInventarioDto: CreateInventarioDto,
		@GetUser() user:Usuario
	) {
    	return this.inventariosService.create(createInventarioDto,user);
  	}

	@Put("/:id")
	@Auth()
	update(
        @Param("id",ParseUUIDPipe) id:string,
		@Body() updateInventarioDto:UpdateInventarioDto,
		@GetUser() user:Usuario
	){
		return this.inventariosService.update(id,updateInventarioDto,user);
	}

	@Put("/:inventarioId/detalle/:detalleId")
	@Auth()
	updateInventarioDetalle(
		@Param("inventarioId",ParseUUIDPipe) inventarioId:string,
		@Param("detalleId",ParseUUIDPipe) detalleId:string,
		@Body() updateInventarioDetalleDto:UpdateInventarioDetalleDto,
		@GetUser() user:Usuario
	){
		return this.inventariosService.updateInventarioDetalle(inventarioId,detalleId,updateInventarioDetalleDto,user);
	}

}
