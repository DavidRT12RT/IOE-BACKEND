import { Injectable, NotFoundException } from "@nestjs/common";

//Service's
import { DepartamentosService } from "./departamentos.service";

//Helpers
import { handleDBErrors } from "src/common/helpers/db_errors";

//Entities
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "../entities/role.entity";
import { Usuario } from "src/auth/entities/usuario.entity";

//Dto's
import { CreateRoleDTO } from "../dto/create-role.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

@Injectable()
export class RolesService {

    constructor(
		@InjectRepository(Role)
		private readonly roleRepository:Repository<Role>,

        private readonly departamentoService:DepartamentosService
    ){}

	async findOneRoleById(id:string){
		const role = await this.roleRepository.createQueryBuilder("role")
		.leftJoinAndSelect("role.departamento","departamento")
		.leftJoinAndSelect("role.usuarios","usuarios")
		.leftJoinAndSelect("role.creadoPorUsuario","usuario")
		.getOne();

		if(!role) throw new NotFoundException(`Role con id ${id} no encontrado!`);

		return {
			role
		}
	}

	async findAllRoles(paginationDto:PaginationDto){

		const roles = await this.roleRepository.createQueryBuilder("roles")
		.leftJoinAndSelect("roles.departamento","departamento")
		.leftJoinAndSelect("roles.usuarios","usuarios")
		.leftJoinAndSelect("roles.creadoPorUsuario","usuario")
		.skip(paginationDto.offset)
		.take(paginationDto.limit)
		.getMany()

		return {
			roles
		};

	}

	async createRole(createRoleDTO:CreateRoleDTO,user:Usuario){

		try {

			const { departamento: departamentoID,...roleData } = createRoleDTO;

			//buscamos el departmento si NO esta no creamos el role
            const { departamento } = await this.departamentoService.findOneDepartamentoById(departamentoID);

			const role = this.roleRepository.create({
				...roleData,
				creadoPorUsuario:user,
                departamento
			});
			await this.roleRepository.save(role);

			return {
				role,
				message:"Rol creado!"
			};

		} catch (error) {
			handleDBErrors(error);
		}

	}

}