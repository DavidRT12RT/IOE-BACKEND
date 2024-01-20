import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { Auth, GetUser } from "src/auth/decorators";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { RolesService } from "./roles.service";
import { Usuario } from "src/auth/entities/usuario.entity";
import { CreateRoleDTO } from "./dto/create-role.dto";
import { ValidRoles } from "src/auth/interfaces";

@Controller("roles")
export class RolesController{

    constructor(
        private readonly rolesService:RolesService
    ){}

    @Get("roles")
    @Auth()
    getRoles(
        @Query() paginationDto:PaginationDto,
    ){

        return this.rolesService.findAllRoles(paginationDto);
    }

    @Get("roles/:id")
    @Auth()
    getRole(
        @Param("id",ParseUUIDPipe) id:string
    ){
        return this.rolesService.findOneRole(id);
    }


    @Post("registrar/role")
    @Auth(ValidRoles.admin)
    createRole(
        @Body() createRoleDTO:CreateRoleDTO,
        @GetUser() user:Usuario
    ) {
        return this.rolesService.createRole(createRoleDTO,user);
    }
};