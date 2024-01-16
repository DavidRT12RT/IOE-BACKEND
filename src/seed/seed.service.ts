import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

//Entities
import { Usuario } from 'src/auth/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { initialData } from './data/seed.data';
import { Departamento } from 'src/auth/entities/departamento.entity';

@Injectable()
export class SeedService {

	constructor(
		private readonly authService:AuthService,

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

		const { user:systemUser } = await this.authService.createUser(SystemUser);

		const { departamento:systemDepartment } = await this.authService.createDepartment(SystemDepartment,systemUser);

		const { role:adminRole } = await this.authService.createRole({...AdminRole,departamento:systemDepartment.id},systemUser);

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