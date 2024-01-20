import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Usuario } from "./entities/usuario.entity";
import { CreateUsuarioDTO } from "./dto/create-user.dto";

import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, DataSource, DeepPartial, Repository } from "typeorm";
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

	async findOneById(id:string){

		const user = await this.userRepository.createQueryBuilder("user")
		.leftJoinAndSelect("user.roles","roles")
		.leftJoinAndSelect("user.supervisor","supervisor")
		.leftJoinAndSelect("user.personal","personal")
		.where("user.id = :id",{id})
		.getOne();

		if(!user) throw new NotFoundException(`Ningun usuario por ese id ${id}`);

		return user;
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

		//Verificamos primero que el usuario exista
		await this.findOneById(id);

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {

			await queryRunner.manager
			.createQueryBuilder()
			.update(Usuario)
			.set(updateUsuarioDTO)
			.where("id = :id",{id})
			.execute();


			await queryRunner.commitTransaction();

			//Recupera el usuario actualizado
			const usuarioActualizado = await this.findOneById(id);

			return usuarioActualizado;


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



};