import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { PaginationDto } from "src/common/dtos/pagination.dto";
//Decorators
import { Auth, GetUser } from "../auth/decorators";
//Entities
import { Usuario } from "../auth/entities/usuario.entity";

//Dto's
import { CreateDepartmentDto } from "./dto/create-department";

//Service's
import { DepartamentosService } from "./departamentos.service";

@Controller("departamentos")
export class DepartamentosController {

    constructor(private readonly departamentosService:DepartamentosService) {}

    @Get()
    getAllDepartments(
        @Query() paginationDto:PaginationDto
    ){
        return this.departamentosService.findAllDepartamentos(paginationDto);
    }

    @Post()
    @Auth()
    createDepartment(
        @Body() createDepartmentDto:CreateDepartmentDto,
        @GetUser() user:Usuario
    ){
        return this.departamentosService.createDepartment(createDepartmentDto,user);
    }



};