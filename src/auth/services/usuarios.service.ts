import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import * as bcrypt from "bcrypt";
//Helper's
import { handleDBErrors } from "src/common/helpers/db_errors";

//Entitie's
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource,Repository } from "typeorm";
import { Usuario } from "../entities/usuario.entity";
import { UsuarioRoles } from "../entities/usuario-roles.entity";

//Services
import { RolesService } from "./roles.service";
import { AuthService } from "./auth.service";

//Dto's
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CreateUsuarioDTO } from "../dto/create-user.dto";
import { UpdateUsuarioDTO } from "../dto/update-user.dto";

@Injectable()
export class UsuariosService {

    constructor(
		@InjectRepository(Usuario) 
		private readonly userRepository:Repository<Usuario>,

		@InjectRepository(UsuarioRoles)
		private readonly usuarioRoleRepository:Repository<UsuarioRoles>,

		private readonly roleService:RolesService,

		private readonly dataSource:DataSource,

        private readonly authService:AuthService
    ){}

	async findAllUsers(
		paginationDto:PaginationDto,
		roles?:string | string[]
	){
		const query = await this.userRepository.createQueryBuilder("user")
        .leftJoinAndSelect('user.usuarioRoles', 'usuarioRoles')
        .leftJoinAndSelect('usuarioRoles.role', 'role')
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

		const usuario = await this.userRepository.createQueryBuilder("user")
        .leftJoinAndSelect('user.usuarioRoles', 'usuarioRoles')
        .leftJoinAndSelect('usuarioRoles.role', 'role')
		.leftJoinAndSelect("user.supervisor","supervisor")
		.leftJoinAndSelect("user.personal","personal")
		.where("user.id = :id",{id})
		.getOne();

		if(!usuario) throw new NotFoundException(`Ningun usuario por ese id ${id}`);

		return {
			usuario
		};
	}

	async createUser(createUserDTO: CreateUsuarioDTO,usuarioCreador?:Usuario) {

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {

			const { roles,...userData } = createUserDTO;
			userData.password = bcrypt.hashSync(createUserDTO.password,10);

			let usuario = this.userRepository.create({
				...userData,
				usuarioCreador,
			});
			usuario = await this.userRepository.save(usuario);

			for(const roleId of roles){
				const { role } = await this.roleService.findOneRoleById(roleId);
				const usuarioRole = this.usuarioRoleRepository.create({
					usuario,
					role
				});
				await this.usuarioRoleRepository.save(usuarioRole);
			}

			delete usuario.password;

			await queryRunner.commitTransaction();

			return {
				message:"Usuario creado con exito!",
				usuario,
            	token:this.authService.generateJWT({correo:usuario.correo,id:usuario.id})
			};
			
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new BadRequestException(`${error}`);
		} finally {
			await queryRunner.release();
		}


  	}


	async updateUser(id:string,updateUsuarioDTO:UpdateUsuarioDTO,user:Usuario){


		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {

			const { usuario } = await this.findOneUserById(id);

			const { roles,...toUpdate} = updateUsuarioDTO;

			usuario.nombre = toUpdate.nombre || usuario.nombre;
			usuario.apellido_materno = toUpdate.apellido_materno || usuario.apellido_materno;
			usuario.apellido_paterno = toUpdate.apellido_paterno || usuario.apellido_paterno;
			usuario.correo = toUpdate.correo || usuario.correo;
			usuario.telefono = toUpdate.telefono || usuario.telefono;

			if(toUpdate.password){
				usuario.password = bcrypt.hashSync(toUpdate.password,10);
			}

			if(roles){
				//Elimino todas las relaciones del usuario y los roles y despues se las vuelvo a asignar
				await queryRunner.manager.delete(UsuarioRoles,{usuario:{id}});
				usuario.usuarioRoles = [];

				for(const roleID of roles){
					const { role } = await this.roleService.findOneRoleById(roleID);
					let usuarioRole = this.usuarioRoleRepository.create({
						usuario,
						role
					});
					usuarioRole = await this.usuarioRoleRepository.save(usuarioRole);
					usuario.usuarioRoles.push(usuarioRole);
				}

			}

			await this.userRepository.save(usuario);
			await queryRunner.commitTransaction();

			return {
				usuario,
				message:"Usuario actualizado con exito!"
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