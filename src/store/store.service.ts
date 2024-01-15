import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { LimitOnUpdateNotSupportedError, Repository } from 'typeorm';

//Entities
import { User } from 'src/auth/entities/user.entity';
import { Store } from './entities/store.entity';

//DTO's
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { Warehouse } from './entities/warehouse.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class StoreService {


	private readonly logger = new Logger("StoreService");

	constructor(

		@InjectRepository(Store)
		private readonly storeRepository:Repository<Store>,

		@InjectRepository(Warehouse)
		private readonly wareHouseRepository:Repository<Warehouse>

	){}

	async createStore(createStoreDto: CreateStoreDto,user:User) {

		try {
			const store = this.storeRepository.create({
				...createStoreDto,
				usuarioCreador:user
			});

			await this.storeRepository.save(store);

			return {
				store,
				message:"Sucursal creada con exito!"
			};

		} catch (error) {
			this.handleDBErrors(error);
		}

  	}

	async createWarehouse(createWarehouse:CreateWarehouseDto,user:User){

		const { sucursal,...wareHouseData } = createWarehouse

		//Checar si existe primero la store (sucursal)
		const store = await this.storeRepository.findOneBy({id:sucursal});
		if(!store) throw new BadRequestException(`Ninguna sucursal por el id ${sucursal}`);

		const wareHouse = this.wareHouseRepository.create({
			...wareHouseData,
			sucursal:store
		});

		await this.wareHouseRepository.save(wareHouse);

		return {
			wareHouse,
			message:"Almacen creado con exito"
		};

	}

  	async findAllStore(
		paginationDto:PaginationDto
	) {
		const { limit = 10, offset = 0 } = paginationDto;

		return await this.storeRepository.createQueryBuilder("store")
		// .leftJoinAndSelect("store.almacenes","almacenes")
		.skip(offset)
		.limit(limit)
		.getMany();

  	}

  	findOne(id: number) {
    	return `This action returns a #${id} store`;
  	}

  	update(id: number, updateStoreDto: UpdateStoreDto) {
    	return `This action updates a #${id} store`;
  	}

  	remove(id: number) {
    	return `This action removes a #${id} store`;
  	}

    private handleDBErrors(error:any):never{ //-> never jamas regresara algo
        if(error.code === "23505") throw new BadRequestException(error.detail);

        this.logger.error(error);

        throw new InternalServerErrorException("Please check server logs...");
    }

}
