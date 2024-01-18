import { Module } from '@nestjs/common';

import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';

import { AuthModule } from 'src/auth/auth.module';
import { SucursalModule } from 'src/sucursales/sucursales.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from './entities/categoria.entity';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

@Module({
	imports:[
		AuthModule,
		SucursalModule,
		TypeOrmModule.forFeature([
			Producto,
			Categoria
		]),
	],
	exports:[
		TypeOrmModule
	],
  	controllers: [
		ProductosController,
		CategoriasController
	],
  	providers: [
		ProductosService,
		CategoriasService
	],

})
export class ProductosModule {}
