import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

//Entities
import { Usuario } from 'src/auth/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { initialData } from './data/seed.data';
import { Departamento } from 'src/departamentos/entities/departamento.entity';
import { UsuariosService } from 'src/auth/usuarios.service';
import { DepartamentosService } from 'src/departamentos/departamentos.service';
import { RolesService } from 'src/departamentos/roles.service';

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
		private readonly departmentRepository:Repository<Departamento>

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

		systemUser.roles.push(adminRole);
		this.userRepository.save(systemUser);

		return {
			message:"Seed Executed!"
		};

	}	


	private async deleteTables(){

		// await this.authService.deleteAllDepartments();//Departamentos y roles
		// await this.authService.deleteAllUsers(); //usuarios

	}

};