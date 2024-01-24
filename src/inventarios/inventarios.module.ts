import { Module } from '@nestjs/common';
import { InventariosService } from './inventarios.service';
import { InventariosController } from './inventarios.controller';
import { ProductosModule } from 'src/productos/productos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { InventarioDetalle } from './entities/inventario-detalle.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	controllers: [InventariosController],
  	providers: [InventariosService],
	imports:[
		AuthModule,
		ProductosModule,
		TypeOrmModule.forFeature([
			Inventario,
			InventarioDetalle
		])
	],
	exports:[
		TypeOrmModule
	]
})
export class InventariosModule {}
