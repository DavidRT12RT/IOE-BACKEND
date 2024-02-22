import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Marca } from "./entities/marca.entity";
import { Repository } from "typeorm";
import { CreateMarcaDto } from "./dto/create-marca.dto";

@Injectable()
export class MarcasService{

    constructor(
        @InjectRepository(Marca)
        private readonly marcaRepository:Repository<Marca>
    ){}

    async getAllMarcas(){

        const marcas = await this.marcaRepository.createQueryBuilder("marcas")
        .leftJoinAndSelect("marcas.productos","producto")
        .getMany();

        return {
            marcas,
            total:marcas.length
        };

    }

    async createMarca(createMarcaDto:CreateMarcaDto){

        const marca = this.marcaRepository.create({...createMarcaDto});
        await this.marcaRepository.save(marca);
        return {
            message:"Marca creada con exito!",
            marca
        };
    }

    async findOneMarcaById(id:string){

        const marca = await this.marcaRepository.createQueryBuilder("marca")
        .leftJoinAndSelect("marca.productos","productos")
        .where("marca := id",{id})
        .getOne()

        if(!marca) throw new NotFoundException(`Ninguna marca con el id ${id} encontrada!`);

        return {
            marca
        };

    }


};