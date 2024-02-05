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
import { InventariosModule } from 'src/inventarios/inventarios.module';
import { ProductoAlmacen } from './entities/producto-almacen.entity';

@Module({
	imports:[
		AuthModule,
		// InventariosModule,
		SucursalModule,
		TypeOrmModule.forFeature([
			Producto,
			Categoria,
			ProductoAlmacen
		]),
	],
  	controllers: [
		ProductosController,
		CategoriasController
	],
  	providers: [
		ProductosService,
		CategoriasService
	],
	exports:[
		ProductosService,
		CategoriasService,
		TypeOrmModule
	],
})
export class ProductosModule {}
