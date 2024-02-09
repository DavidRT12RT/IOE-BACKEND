import { Body, Controller, Get, Post, Query } from "@nestjs/common";

//Decorators
import { Auth, GetUser } from "../decorators";

//Entities
import { Usuario } from "../entities/usuario.entity";

//Dto's
import { CreateDepartmentDto } from "../dto/create-department";
import { PaginationDto } from "src/common/dtos/pagination.dto";

//Service's
import { DepartamentosService } from "../services/departamentos.service";

@Controller("departamentos")
export class DepartamentosController {

    constructor(private readonly departamentosService:DepartamentosService) {}

    @Get()
    @Auth()
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