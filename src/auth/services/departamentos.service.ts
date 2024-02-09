import { Injectable, NotFoundException } from "@nestjs/common";

//helpers
import { handleDBErrors } from "src/common/helpers/db_errors";

//Dto's
import { CreateDepartmentDto } from "../dto/create-department";

//Entities
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Departamento } from "../entities/departamento.entity";
import { Usuario } from "../entities/usuario.entity";

@Injectable()
export class DepartamentosService {


    constructor(
		@InjectRepository(Departamento)
		private readonly departmentRepository:Repository<Departamento>,
    ){}

	async findAllDepartamentos(
		paginationDto:PaginationDto
	){
		return this.departmentRepository.createQueryBuilder("department")
		.leftJoinAndSelect("department.roles","roles")
		.skip(paginationDto.offset)
		.limit(paginationDto.limit)
		.getMany()
	}

	async findOneDepartamentoById(id:string){

		const departamento = await this.departmentRepository.createQueryBuilder("departamento")
		.leftJoinAndSelect("departamento.roles","roles")
		.getOne();

		if(!departamento) throw new NotFoundException(`Ningun departamento con ese id`);

		return {
			departamento
		};
	}

	async createDepartment(createDepartmentDto:CreateDepartmentDto,user:Usuario){

		try {

			const departamento = this.departmentRepository.create({
				...createDepartmentDto,
				creadoPorUsuario:user
			});

			await this.departmentRepository.save(departamento);

			return {
				departamento,
				message:"Departamento creado!"
			};


		} catch (error) {
			handleDBErrors(error);
		}
	}

	async deleteAllDepartments(){
		const query = this.departmentRepository.createQueryBuilder("department");
		try {
			return query.delete().where({}).execute();
		} catch (error) {
			handleDBErrors(error);
		}
	}



};