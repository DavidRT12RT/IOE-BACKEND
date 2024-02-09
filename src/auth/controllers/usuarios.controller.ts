import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from "@nestjs/common";

//DTO's
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CreateUsuarioDTO } from "../dto/create-user.dto";
import { UpdateUsuarioDTO } from "../dto/update-user.dto";

//Servicie's
import { UsuariosService } from "../services/usuarios.service";

//Entitie's
import { Usuario } from "../entities/usuario.entity";

//Decorators
import { Auth, GetUser } from "../decorators";

//Entities

@Controller("usuarios")
export class UsuariosController {

    constructor(private readonly usuariosService:UsuariosService) {}

    @Get()
    getAllUsers(
        @Query() paginationDto:PaginationDto,
        @Query("rol") rol:string | string[] = ""

    ){
        return this.usuariosService.findAllUsers(paginationDto,rol);
    }

    @Get("/:id")
    @Auth()
    getUsersById(
        @Param("id",ParseUUIDPipe) id:string
    ){
        return this.usuariosService.findOneUserById(id);
    }

    @Post()
    @Auth()
    createUser(
        @Body() createUserDTO: CreateUsuarioDTO,
        @GetUser() user:Usuario
    ) {
          return this.usuariosService.createUser(createUserDTO,user);
    }

    @Put("/:id")
    @Auth()
    updateUserById(
        @Param("id",ParseUUIDPipe) id:string,
        @Body() updateUsuarioDto:UpdateUsuarioDTO,
        @GetUser() user:Usuario,
    ){
        return this.usuariosService.updateUser(id,updateUsuarioDto,user);
    }


};