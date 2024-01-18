import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Usuario } from "./entities/usuario.entity";
import { CreateUserDTO } from "./dto/create-user.dto";

import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { AuthService } from "./auth.service";
import { handleDBErrors } from "src/common/helpers/db_errors";

@Injectable()
export class UsuariosService {

    constructor(
		@InjectRepository(Usuario) 
		private readonly userRepository:Repository<Usuario>,

		@InjectRepository(Role)
		private readonly roleRepository:Repository<Role>,

        private readonly authService:AuthService
    ){}

	async findAllUsers(
		paginationDto:PaginationDto
	){
		const users = await this.userRepository.createQueryBuilder("user")
		.leftJoinAndSelect("user.roles","roles")
		.leftJoinAndSelect("roles.departamento","departamento")
		.leftJoinAndSelect("user.supervisor","supervisor")
		.leftJoinAndSelect("user.personal","personal")
		.skip(paginationDto.offset)
		.take(paginationDto.limit)
		.getMany()

		return {
			users
		};
	}

	async createUser(createUserDTO: CreateUserDTO) {

		const { roles,...userData } = createUserDTO;

		//Verificar que todos los roles existan primero antes de registrar el usuario
		for(const roleId of roles){
			const roleDB = await this.roleRepository.findOneBy({id:roleId})
			if(!roleDB) throw new BadRequestException(`El rol con id ${roleId} no existe,la creacion fue cancelada!`);
		}

		userData.password = bcrypt.hashSync(createUserDTO.password,10);

		let user = this.userRepository.create({
			...userData,
			roles:[]
		});

		user = await this.userRepository.save(user);

		for(const roleId of roles){

			const roleDB = await this.roleRepository.findOneBy({id:roleId})

			roleDB.usuarios.push(user);
			await this.roleRepository.save(roleDB);

			user.roles.push(roleDB);

		}

		user = await this.userRepository.save(user);
		delete user.password;

		return {
			message:"Usuario creado con exito!",
			user,
            token:this.authService.generateJWT({correo:user.correo,id:user.id})
		};

  	}

	async getUserById(id:string){

		const user = await this.userRepository.createQueryBuilder("user")
		.leftJoinAndSelect("user.roles","roles")
		.leftJoinAndSelect("user.supervisor","supervisor")
		.leftJoinAndSelect("user.personal","personal")
		.where("user.id = :id",{id})
		.getOne();

		if(!user) throw new NotFoundException(`Ningun usuario por ese id ${id}`);

		return user;
	}

	async updateUserById(user:Usuario){
		
	}

	async deleteAllUsers(){
		const query = this.userRepository.createQueryBuilder("user");

		try {
			return query.delete().where({}).execute();
		} catch (error) {
			handleDBErrors(error);
		}
	}



};