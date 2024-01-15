import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { StoreService } from './store.service';

//Auth
import { Auth, GetUser } from 'src/auth/decorators';

//Entities
import { User } from 'src/auth/entities/user.entity';

//DTO's
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('store')
export class StoreController {

	constructor(private readonly storeService: StoreService) {}

  	@Post()
	@Auth()
  	createStore(
		@Body() createStoreDto: CreateStoreDto,
		@GetUser() user:User
	) {
    	return this.storeService.createStore(createStoreDto,user);
  	}

	@Post("warehouse")
	@Auth()
	createWarehouse(
		@Body() createWarehouseDto: CreateWarehouseDto,
		@GetUser() user:User
	){

		return this.storeService.createWarehouse(createWarehouseDto,user);
	}

	@Get()
	@Auth()
	getAllStore(
		paginationDto:PaginationDto
	){
		return this.storeService.findAllStore(paginationDto);
	}

}
