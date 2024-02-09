import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";

//Entitie's
import { Usuario } from "src/auth/entities/usuario.entity";

//Dto's
import { CreateRoleDTO } from "../dto/create-role.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { ValidRoles } from "../interfaces";

//Service's
import { RolesService } from "../services/roles.service";

//Decorator's
import { Auth, GetUser } from "src/auth/decorators";

@Controller("roles")
export class RolesController{

    constructor(
        private readonly rolesService:RolesService
    ){}

    @Get()
    @Auth()
    getRoles(
        @Query() paginationDto:PaginationDto,
    ){

        return this.rolesService.findAllRoles(paginationDto);
    }

    @Get("/:id")
    @Auth()
    getRole(
        @Param("id",ParseUUIDPipe) id:string
    ){
        return this.rolesService.findOneRoleById(id);
    }


    @Post()
    @Auth(ValidRoles.admin)
    createRole(
        @Body() createRoleDTO:CreateRoleDTO,
        @GetUser() user:Usuario
    ) {
        return this.rolesService.createRole(createRoleDTO,user);
    }
};