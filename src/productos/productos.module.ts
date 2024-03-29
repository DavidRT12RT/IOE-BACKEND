import { Module } from '@nestjs/common';

import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';

import { AuthModule } from 'src/auth/auth.module';
import { SucursalesModule } from 'src/sucursales/sucursales.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from './entities/categoria.entity';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { ProductoAlmacen } from './entities/producto-almacen.entity';
import { ProvedoresModule } from 'src/provedores/provedores.module';
import { MarcasController } from './marcas.controller';
import { Marca } from './entities/marca.entity';
import { MarcasService } from './marcas.service';
import { SatModule } from 'src/SAT/sat.module';
import { Salida } from 'src/salidas/entities/salida.entity';
import { SalidasModule } from 'src/salidas/salidas.module';

@Module({
	imports:[
		ProvedoresModule,
		AuthModule,
		SucursalesModule,
		SatModule,
		SalidasModule,
		TypeOrmModule.forFeature([
			ProductoAlmacen,
			Producto,
			Categoria,
			Marca,
		]),
	],
  	controllers: [
		ProductosController,
		CategoriasController,
		MarcasController
	],
  	providers: [
		ProductosService,
		CategoriasService,
		MarcasService
	],
	exports:[
		TypeOrmModule,
		ProductosService,
		CategoriasService,
	],
})
export class ProductosModule {}
