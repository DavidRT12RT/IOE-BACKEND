import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Usuario } from "./entities/usuario.entity";
import { CreateUsuarioDTO } from "./dto/create-user.dto";

import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource,Repository } from "typeorm";
import { Role } from "../departamentos/entities/role.entity";
import { AuthService } from "./auth.service";
import { handleDBErrors } from "src/common/helpers/db_errors";
import { UpdateUsuarioDTO } from "./dto/update-user.dto";

@Injectable()
export class UsuariosService {

    constructor(
		@InjectRepository(Usuario) 
		private readonly userRepository:Repository<Usuario>,

		@InjectRepository(Role)
		private readonly roleRepository:Repository<Role>,

		private readonly dataSource:DataSource,

        private readonly authService:AuthService
    ){}

	async findAllUsers(
		paginationDto:PaginationDto,
		roles?:string | string[]
	){
		const query = await this.userRepository.createQueryBuilder("user")
		.leftJoinAndSelect("user.roles","roles")
		.leftJoinAndSelect("roles.departamento","departamento")
		.leftJoinAndSelect("user.supervisor","supervisor")
		.leftJoinAndSelect("user.personal","personal")

		if(roles) {
			const rolesArray = Array.isArray(roles) ? roles : [roles];
			query.andWhere("roles.nombre IN (:...roles)",{roles:rolesArray});
		}

		const usuarios = await query
			.skip(paginationDto.offset)
			.limit(paginationDto.limit)
			.getMany();

		return {
			usuarios
		};
	}

	async findOneUserById(id:string){

		const user = await this.userRepository.createQueryBuilder("user")
		.leftJoinAndSelect("user.roles","roles")
		.leftJoinAndSelect("user.supervisor","supervisor")
		.leftJoinAndSelect("user.personal","personal")
		.where("user.id = :id",{id})
		.getOne();

		if(!user) throw new NotFoundException(`Ningun usuario por ese id ${id}`);

		return {user};
	}

	async createUser(createUserDTO: CreateUsuarioDTO,usuarioCreador?:Usuario) {

		const { roles,...userData } = createUserDTO;

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();


		userData.password = bcrypt.hashSync(createUserDTO.password,10);

		let usuario = this.userRepository.create({
			...userData,
			usuarioCreador,
			roles:[]
		});

		try {
			for(const roleId of roles){
				const roleDB = await this.roleRepository.findOneBy({id:roleId})
				if(!roleDB) throw new Error(`No existe el rol con id ${roleId}`);
				usuario.roles.push(roleDB);
			}
		} catch (error) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
			throw new BadRequestException(`${error}`);
		}

		usuario = await this.userRepository.save(usuario);
		delete usuario.password;

		await queryRunner.commitTransaction();
		await queryRunner.release();

		return {
			message:"Usuario creado con exito!",
			usuario,
            token:this.authService.generateJWT({correo:usuario.correo,id:usuario.id})
		};

  	}



	async updateUserById(id:string,updateUsuarioDTO:UpdateUsuarioDTO,user:Usuario){


		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			//Verificamos primero que el usuario exista
			const { user } = await this.findOneUserById(id);

			if(updateUsuarioDTO.roles){
				//Actualizamos los roles si vienen

				for(const roleID of updateUsuarioDTO.roles){
					// const roleDB = this.role
				}

			}

			await this.userRepository.save(user);
			await queryRunner.commitTransaction();

			return {
				user
			};

		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally{
			await queryRunner.release();
		}

	}

	async deleteAllUsers(){
		const query = this.userRepository.createQueryBuilder("user");

		try {
			return query.delete().where({}).execute();
		} catch (error) {
			handleDBErrors(error);
		}
	}

	// async deleteUserByID(id:string){

	// 	//Verificar que exista
	// 	const usuario = await this.findOneUserById(id);
	// 	usuario.activo = false;

	// 	await this.userRepository.save(usuario);

	// 	return {
	// 		message:"Usuario desactivo con exito!"
	// 	};


	// }




};