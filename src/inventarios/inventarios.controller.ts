import { Controller, Get, Post, Body } from '@nestjs/common';
import { InventariosService } from './inventarios.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { Usuario } from 'src/auth/entities/usuario.entity';

@Controller('inventarios')
export class InventariosController {

 	constructor(private readonly inventariosService: InventariosService) {}

  	@Post()
	@Auth()
  	create(
		@Body() createInventarioDto: CreateInventarioDto,
		@GetUser() user:Usuario
	) {
    	return this.inventariosService.create(createInventarioDto,user);
  	}

  	@Get()
  	findAll() {
    	return this.inventariosService.findAll();
  	}


}
