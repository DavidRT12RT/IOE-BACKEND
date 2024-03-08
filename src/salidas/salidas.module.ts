import { Module } from '@nestjs/common';
import { SalidasService } from './salidas.service';
import { SalidasController } from './salidas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salida } from './entities/salida.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProductoAlmacen } from 'src/productos/entities/producto-almacen.entity';

@Module({
	controllers: [SalidasController],
  	providers: [SalidasService],
	imports:[
		AuthModule,
		CommonModule,
		TypeOrmModule.forFeature([
			Salida,
			ProductoAlmacen
		])
	],
	exports:[
		TypeOrmModule
	]
})
export class SalidasModule {}
