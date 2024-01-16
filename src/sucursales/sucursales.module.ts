import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SucursalController } from './sucursales.controller';
import { SucursalService } from './sucursales.service';

//Entities
import { AuthModule } from 'src/auth/auth.module';
import { Sucursal } from './entities/sucursal.entity';
import { Almacen } from './entities/almacen.entity';


@Module({
	controllers: [SucursalController],
  	providers: [SucursalService],
	imports:[
		AuthModule,
		TypeOrmModule.forFeature([
			Sucursal,
			Almacen
		]),
	]
})
export class StoreModule {}
