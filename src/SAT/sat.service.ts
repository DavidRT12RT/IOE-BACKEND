import { InjectRepository } from "@nestjs/typeorm";
import { ClavesSat } from "./entities/claves-sat.entity";
import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UnidadMedidaSat } from "./entities/unidad-medida-sat.entity";

@Injectable()
export class SatService{

    constructor(
        @InjectRepository(ClavesSat)
        private readonly clavesSatRepository:Repository<ClavesSat>,
        @InjectRepository(UnidadMedidaSat)
        private readonly unidadMedidaSatRepository:Repository<UnidadMedidaSat>
    ){}


    async getAllClavesSat(){
        const clavesSat = await this.clavesSatRepository.createQueryBuilder("clavesSat")
        .getMany();
        return {
            clavesSat
        };

    }

    async getClaveSatById(id:string){
        const claveSat = await this.clavesSatRepository.createQueryBuilder("claveSat")
        .where("claveSat.id := id",{id})
        .getOne();

        if(!claveSat) throw new NotFoundException(`Ninguna clave SAT encontrada por el id ${id}`);

        return {
            claveSat
        };
    }

    async getAllUnidadesMedidaSat(){
        const unidadesMedidaSat = await this.unidadMedidaSatRepository.createQueryBuilder("unidadesMedidaSat")
        .getMany();

        return {
            unidadesMedidaSat
        };
    }

    async getOneUnidadeMedidaSatById(id:string){

        const unidadMedidaSat = await this.unidadMedidaSatRepository.createQueryBuilder("unidaMedidaSat")
        .where("unidadMedidaSat.id := id",{id})
        .getOne();

        if(!unidadMedidaSat) throw new NotFoundException(`Ninguna unida de medida del sat por el id ${id}`);

        return {
            unidadMedidaSat
        };

    }





};