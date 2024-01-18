import { Controller, Get, Post, Body } from '@nestjs/common';
import { InventariosService } from './inventarios.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';

@Controller('inventarios')
export class InventariosController {

 	constructor(private readonly inventariosService: InventariosService) {}

  	@Post()
  	create(@Body() createInventarioDto: CreateInventarioDto) {
    	return this.inventariosService.create(createInventarioDto);
  	}

  	@Get()
  	findAll() {
    	return this.inventariosService.findAll();
  	}


}
