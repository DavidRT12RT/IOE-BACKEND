import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


//Entities
import { AuthModule } from 'src/auth/auth.module';
import { Sucursal } from './entities/sucursal.entity';
import { Almacen } from './entities/almacen.entity';

import { AlmacenesController } from './almacenes.controller';
import { SucursalController } from './sucursales.controller';

import { SucursalService } from './sucursales.service';
import { AlmacenesService } from './almacenes.service';
import { Destinatario } from 'src/common/entities/destinatario.entity';
import { CommonModule } from 'src/common/common.module';
import { SalidasModule } from 'src/salidas/salidas.module';


@Module({
	controllers: [
		SucursalController,
		AlmacenesController
	],
  	providers: [
		SucursalService,
		AlmacenesService
	],
	imports:[
		AuthModule,
		CommonModule,
		SalidasModule,
		TypeOrmModule.forFeature([
			Sucursal,
			Almacen,
		]),
	],
	exports:[
		SucursalService,
		AlmacenesService,
		TypeOrmModule
	]
})
export class SucursalesModule {}
