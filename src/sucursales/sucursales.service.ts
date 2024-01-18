import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Entities
import { Usuario } from 'src/auth/entities/usuario.entity';
import { Sucursal } from './entities/sucursal.entity';

//DTO's
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { handleDBErrors } from 'src/common/helpers/db_errors';

@Injectable()
export class SucursalService {


	private readonly logger = new Logger("StoreService");

	constructor(

		@InjectRepository(Sucursal)
		private readonly sucursalRepository:Repository<Sucursal>,
	){}

	async createSucursal(createSucursalDto: CreateSucursalDto,user:Usuario) {

		try {
			const sucursal = this.sucursalRepository.create({
				...createSucursalDto,
				usuarioCreador:user
			});

			await this.sucursalRepository.save(sucursal);

			return {
				store: sucursal,
				message:"Sucursal creada con exito!"
			};

		} catch (error) {
			handleDBErrors(error);
		}

  	}


  	async findAllSucursales(
		paginationDto:PaginationDto
	) {

		const { limit = 10, offset = 0 } = paginationDto;

		const sucursales = await this.sucursalRepository.createQueryBuilder("sucursal")
		.leftJoinAndSelect("sucursal.almacenes","almacenes")
		.skip(offset)
		.limit(limit)
		.getMany();


		return {
			sucursales
		};

  	}


  	async findOneById(id: string) {

		const sucursal = await this.sucursalRepository.createQueryBuilder("sucursal")
		.where("sucursal.id = :id",{id})
		.leftJoinAndSelect("sucursal.almacenes","almacenes")
		.getOne();

		if(!sucursal) throw new NotFoundException(`Ninguna sucursal encontrada por id ${id}`);
		return {
			sucursal
		};

  	}


}
