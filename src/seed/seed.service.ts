import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

//Entities
import { Usuario } from 'src/auth/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { initialData } from './data/seed.data';
import { UsuariosService } from 'src/auth/services/usuarios.service';
import { DepartamentosService } from 'src/auth/services/departamentos.service';
import { RolesService } from 'src/auth/services/roles.service';
import { Departamento } from 'src/auth/entities/departamento.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { UsuarioRoles } from 'src/auth/entities/usuario-roles.entity';

@Injectable()
export class SeedService {

	constructor(
		private readonly authService:AuthService,

		private readonly usuariosService:UsuariosService,

		private readonly departamentosService:DepartamentosService,

		private readonly rolesService:RolesService,

		@InjectRepository(Usuario)
		private readonly userRepository:Repository<Usuario>,

		@InjectRepository(Departamento)
		private readonly departmentRepository:Repository<Departamento>,

		@InjectRepository(UsuarioRoles)
		private readonly usuarioRolesRepository:Repository<UsuarioRoles>

	){}

	async runSeed(){

		//Eliminamos todas las tablas que ya fueron creadas 
		await this.deleteTables();
		
		/*primero creamos el usuario "system" que sera el primer 
		usuario del sistema y el que creara a los otros usuarios y 
		primer departamento que es sistema */

		const { SystemUser,SystemDepartment,AdminRole } = initialData;

		const { usuario:systemUser } = await this.usuariosService.createUser(SystemUser);

		const { departamento:systemDepartment } = await this.departamentosService.createDepartment(SystemDepartment,systemUser);

		const { role:adminRole } = await this.rolesService.createRole({...AdminRole,departamento:systemDepartment.id},systemUser);

		let role = this.usuarioRolesRepository.create({
			usuario:systemUser,
			role:adminRole
		});
		role = await this.usuarioRolesRepository.save(role);

		await this.userRepository.save(systemUser);

		return {
			message:"Seed Executed!"
		};

	}	


	private async deleteTables(){

		// await this.authService.deleteAllDepartments();//Departamentos y roles
		// await this.authService.deleteAllUsers(); //usuarios

	}

};