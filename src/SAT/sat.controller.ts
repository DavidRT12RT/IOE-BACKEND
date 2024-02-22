import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { SatService } from "./sat.service";


@Controller("sat")
export class SatController{

    constructor(
        private readonly satService:SatService
    ){}

    @Get("claves")
    getAllClavesSat(){
        return this.satService.getAllClavesSat();
    }

    @Get("claves/:id")
    getOneClaveSat(
		@Param("id",ParseUUIDPipe) id:string,
    ){
        return this.satService.getClaveSatById(id);
    }

    @Get("unidades")
    getAllUnidadesMedidaSat(){
        return this.satService.getAllUnidadesMedidaSat();
    }

    @Get("unidades/:id")
    getOneUnidadMedidaSat(
		@Param("id",ParseUUIDPipe) id:string,
    ){
        return this.satService.getOneUnidadeMedidaSatById(id);
    }

}