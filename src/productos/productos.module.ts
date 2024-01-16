import { Module } from '@nestjs/common';

import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';

import { AuthModule } from 'src/auth/auth.module';
import { SucursalModule } from 'src/sucursales/sucursales.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from './entities/categoria.entity';

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
  	controllers: [ProductosController],
  	providers: [ProductosService],

})
export class ProductosModule {}
