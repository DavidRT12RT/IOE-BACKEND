import { Module } from '@nestjs/common';
import { InventariosService } from './inventarios.service';
import { InventariosController } from './inventarios.controller';
import { ProductosModule } from 'src/productos/productos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SucursalModule } from 'src/sucursales/sucursales.module';

@Module({
	controllers: [InventariosController],
  	providers: [InventariosService],
	imports:[
		SucursalModule,
		ProductosModule,
		AuthModule,
		TypeOrmModule.forFeature([
			Inventario,
		]),
	],
	exports:[
		TypeOrmModule
	]
})
export class InventariosModule {}
