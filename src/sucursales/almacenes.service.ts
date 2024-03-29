import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Almacen } from "./entities/almacen.entity";
import { CreateAlmacenDto } from "./dto/create-almacen.dto";
import { Usuario } from "src/auth/entities/usuario.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SucursalService } from "./sucursales.service";
import { Destinatario } from "src/common/entities/destinatario.entity";

@Injectable()
export class AlmacenesService {

    constructor(
		@InjectRepository(Almacen)
		private readonly almacenRepository:Repository<Almacen>,

        private readonly sucursalService:SucursalService,

		@InjectRepository(Destinatario)
		private readonly destinatarioRepository:Repository<Destinatario>

    ){}

	async createAlmacen(createAlmacenDto:CreateAlmacenDto,user:Usuario){

		const { sucursal:sucursalId,...almacenData } = createAlmacenDto;

		//Checar si existe primero la store (sucursal)
        const { sucursal } = await this.sucursalService.findOneById(sucursalId);

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

	async findAllAlmacenes(
		paginationDto:PaginationDto
	){

		const { limit = 10, offset = 0 } = paginationDto;

		const almacenes = await this.almacenRepository.createQueryBuilder("almacen")
		.leftJoinAndSelect("almacen.sucursal","sucursal")
		.leftJoinAndSelect("almacen.productosAlmacen","productosAlmacen")
		.leftJoinAndSelect("productosAlmacen.producto","producto")
		.skip(offset)
		.limit(limit)
		.getMany();


		return {
			almacenes
		};

	}

  	async findOneAlmacenById(
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



};