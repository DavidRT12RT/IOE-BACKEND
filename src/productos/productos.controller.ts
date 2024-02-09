import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

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

	@Put("/:id")
	@Auth()
	updateProducto(
		@Param("id",ParseUUIDPipe) id:string,
		@Body() updateProductoDto:UpdateProductoDto,
		@GetUser() user:Usuario
	){
		return this.productosService.updateProducto(id,updateProductoDto,user);
	}

  	@Get()
	// @Auth()
  	findAllProductos(
		@Query() paginationDto:PaginationDto
	) {
    	return this.productosService.findAllProductos(paginationDto);
  	}

    @Get("/:id")
	findOneProducto(
        @Param("id",ParseUUIDPipe) id:string
	){
		return this.productosService.findOneProductoById(id);
	}




}
