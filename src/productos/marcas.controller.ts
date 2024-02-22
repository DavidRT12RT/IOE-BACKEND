import { Body, Controller, Get, Post } from "@nestjs/common";
import { Auth, GetUser } from "src/auth/decorators";
import { Usuario } from "src/auth/entities/usuario.entity";
import { CreateMarcaDto } from "./dto/create-marca.dto";
import { MarcasService } from "./marcas.service";

@Controller("marcas")
export class MarcasController{

    constructor(
        private readonly marcasService:MarcasService
    ){}

    @Get()
    @Auth()
    getAllMarcas(
        @GetUser() usuario:Usuario,
    ){
        return this.marcasService.getAllMarcas();
    }

    @Post()
    @Auth()
    createMarca(
        @GetUser() usuario:Usuario,
        @Body() createMarcaDto:CreateMarcaDto
    ){
        return this.marcasService.createMarca(createMarcaDto);
    }

};