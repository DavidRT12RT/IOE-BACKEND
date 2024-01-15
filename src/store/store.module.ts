import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

//Entities
import { Store } from './entities/store.entity';
import { Warehouse } from './entities/warehouse.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	controllers: [StoreController],
  	providers: [StoreService],
	imports:[
		AuthModule,
		TypeOrmModule.forFeature([
			Store,
			Warehouse
		]),
	]
})
export class StoreModule {}
