import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CreateDepartmentDto } from "./dto/create-department";
import { Usuario } from "../auth/entities/usuario.entity";
import { handleDBErrors } from "src/common/helpers/db_errors";
import { InjectRepository } from "@nestjs/typeorm";
import { Departamento } from "./entities/departamento.entity";
import { Role } from "./entities/role.entity";
import { Repository } from "typeorm";

@Injectable()
export class DepartamentosService {


    constructor(
		@InjectRepository(Usuario) 
		private readonly userRepository:Repository<Usuario>,

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

			//Primero buscamos el usuario si NO esta no creamos el departamento
			const userDB = await this.userRepository.findOneBy({id:user.id});

			if(!userDB) throw new BadRequestException("Ningun usuario fue encontrado por ese id!");

			const departamento = this.departmentRepository.create({
				...createDepartmentDto,
				creadoPorUsuario:userDB
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