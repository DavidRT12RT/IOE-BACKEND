import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PaginationDto } from "src/common/dtos/pagination.dto";
//Decorators
import { Auth, GetUser } from "./decorators";
//Entities
import { Usuario } from "./entities/usuario.entity";

//Dto's
import { CreateDepartmentDto } from "./dto/create-department";

//Service's
import { DepartamentosService } from "./departamentos.service";

@Controller("departamentos")
export class DepartamentoController {

    constructor(private readonly departamentosService:DepartamentosService) {}

    @Get("/departments")
    getAllDepartments(
        @Query() paginationDto:PaginationDto
    ){
        return this.departamentosService.findAllDepartments(paginationDto);
    }

    @Post("register/department")
    @Auth()
    createDepartment(
        @Body() createDepartmentDto:CreateDepartmentDto,
        @GetUser() user:Usuario
    ){
        return this.departamentosService.createDepartment(createDepartmentDto,user);
    }



};