import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CreateRoleDTO } from "./dto/create-role.dto";
import { Usuario } from "src/auth/entities/usuario.entity";
import { UsuariosService } from "src/auth/usuarios.service";
import { DepartamentosService } from "./departamentos.service";
import { handleDBErrors } from "src/common/helpers/db_errors";

@Injectable()
export class RolesService {

    constructor(
		@InjectRepository(Role)
		private readonly roleRepository:Repository<Role>,

        private readonly userService:UsuariosService,

        private readonly departamentoService:DepartamentosService
    ){}

	async findOneRole(id:string){
		const role = await this.roleRepository.createQueryBuilder("role")
		.leftJoinAndSelect("role.departamento","departamento")
		.leftJoinAndSelect("role.usuarios","usuarios")
		.leftJoinAndSelect("role.creadoPorUsuario","usuario")
		.getOne();

		if(!role) throw new NotFoundException(`Role con id ${id} no encontrado!`);
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