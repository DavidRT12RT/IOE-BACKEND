import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from "@nestjs/common";

//DTO's
import { CreateUserDTO } from "./dto/create-user.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

//Decorators
import { Auth, GetUser } from "./decorators";

//Entities
import { Usuario } from "./entities/usuario.entity";

import { UsuariosService } from "./usuarios.service";

@Controller("usuarios")
export class UsuariosController {

    constructor(private readonly usuariosService:UsuariosService) {}

    @Post("register/user")
    createUser(@Body() createUserDTO: CreateUserDTO) {
          return this.usuariosService.createUser(createUserDTO);
    }

    @Get("/users")
    getAllUsers(
        @Query() paginationDto:PaginationDto
    ){
        return this.usuariosService.findAllUsers(paginationDto);
    }

    @Get("/user/:id")
    @Auth()
    getUsersById(
        @Param("id",ParseUUIDPipe) id:string
    ){
        return this.usuariosService.getUserById(id);
    }

    @Put("/user/:id")
    @Auth()
    editUserById(
        @Param("id",ParseUUIDPipe) id:string,
        @GetUser() user:Usuario,
    ){
        return;
    }


};