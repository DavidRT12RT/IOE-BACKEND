import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

//Entities
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { initialData } from './data/seed.data';
import { Department } from 'src/auth/entities/department.entity';

@Injectable()
export class SeedService {

	constructor(
		private readonly authService:AuthService,

		@InjectRepository(User)
		private readonly userRepository:Repository<User>,

		@InjectRepository(Department)
		private readonly departmentRepository:Repository<Department>

	){}

	async runSeed(){

		//Eliminamos todas las tablas que ya fueron creadas 
		await this.deleteTables();
		
		/*rimero creamos el usuario "system" que sera el primer 
		usuario del sistema y el que creara a los otros usuarios y 
		primer departamento que es sistema */

		const { SystemUser,SystemDepartment,AdminRole } = initialData;

		const { user:systemUser } = await this.authService.createUser(SystemUser);

		const { department:systemDepartment } = await this.authService.createDepartment(SystemDepartment,systemUser);

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