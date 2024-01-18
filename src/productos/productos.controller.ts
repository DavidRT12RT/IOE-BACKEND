import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Controller('productos')
export class ProductosController {
	
	constructor(private readonly productosService: ProductosService) {}

  	@Post()
	@Auth()
  	createProducto(
		@Body() createProductoDto: CreateProductoDto,
		@GetUser() user:Usuario

	) {
    	return this.productosService.createProducto(createProductoDto,user);
  	}

  	@Get()
	@Auth()
  	findAllProductos(
		@Query() paginationDto:PaginationDto
	) {
    	return this.productosService.findAllProductos(paginationDto);
  	}




}
