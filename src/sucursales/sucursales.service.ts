import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Entities
import { Usuario } from 'src/auth/entities/usuario.entity';
import { Sucursal } from './entities/sucursal.entity';
import { Almacen } from './entities/almacen.entity';

//DTO's
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { CreateAlmacenDto } from './dto/create-almacen.dto';

@Injectable()
export class SucursalService {


	private readonly logger = new Logger("StoreService");

	constructor(

		@InjectRepository(Sucursal)
		private readonly sucursalRepository:Repository<Sucursal>,

		@InjectRepository(Almacen)
		private readonly almacenRepository:Repository<Almacen>

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
			this.handleDBErrors(error);
		}

  	}

	async createAlmacen(createAlmacenDto:CreateAlmacenDto,user:Usuario){

		const { sucursal:sucursalId,...almacenData } = createAlmacenDto;

		//Checar si existe primero la store (sucursal)
		const sucursal = await this.sucursalRepository.findOneBy({id:sucursalId});
		if(!sucursal) throw new BadRequestException(`Ninguna sucursal por el id ${sucursal}`);

		const almacen = this.almacenRepository.create({
			...almacenData,
			sucursal,
		});

		await this.almacenRepository.save(almacen);

		return {
			almacen,
			message:"Almacen creado con exito"
		};

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

	async findAllAlmacenes(
		paginationDto:PaginationDto
	){

		const { limit = 10, offset = 0 } = paginationDto;

		const almacenes = await this.almacenRepository.createQueryBuilder("almacen")
		.leftJoinAndSelect("almacen.productos","productos")
		.skip(offset)
		.limit(limit)
		.getMany();


		return {
			almacenes
		};

	}

  	async findOneSucursal(
		id: string
	) {
		const sucursal = await this.sucursalRepository.createQueryBuilder("sucursal")
		.where("sucursal.id = :id",{id})
		.leftJoinAndSelect("sucursal.almacenes","almacenes")
		.getOne();

		if(!sucursal) throw new NotFoundException(`Ninguna sucursal encontrada por id ${id}`);
		return {
			sucursal
		};

  	}

  	async findOneAlmacen(
		id: string
	) {
		const almacen = await this.almacenRepository.createQueryBuilder("almacen")
		.where("almacen.id = :id",{id})
		.leftJoinAndSelect("almacen.sucursal","sucursal")
		.getOne();

		if(!almacen) throw new NotFoundException(`Ningun almacen encontrado por id ${id}`);

		return {
			almacen
		};
  	}


    private handleDBErrors(error:any):never{ //-> never jamas regresara algo
        if(error.code === "23505") throw new BadRequestException(error.detail);

        this.logger.error(error);

        throw new InternalServerErrorException("Please check server logs...");
    }

}
