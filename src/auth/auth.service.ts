import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Entities
import { Usuario } from './entities/usuario.entity';
import { Departamento } from './entities/departamento.entity';
import { Role } from './entities/role.entity';

//DTO's
import { CreateUserDTO } from './dto/create-user.dto';

//Bcrypt
import * as bcrypt from "bcrypt";

//DTO's (Data Transfer Object)
import { LoginUserDto } from './dto/login-user.dto';
import { CreateRoleDTO } from './dto/create-role.dto';

//JWT
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { handleDBErrors } from 'src/common/helpers/db_errors';

@Injectable()
export class AuthService {
	
    private readonly logger = new Logger("AuthController");

	constructor(
		@InjectRepository(Usuario) 
		private readonly userRepository:Repository<Usuario>,

		@InjectRepository(Role)
		private readonly roleRepository:Repository<Role>,

		@InjectRepository(Departamento)
		private readonly departmentRepository:Repository<Departamento>,

		private readonly jwtService:JwtService // -> Proporcionado por el JWTMODULE Y LA EXPORTACION
	){}

	async createRole(createRoleDTO:CreateRoleDTO,user:Usuario){

		try {

			const { departamento,...roleData } = createRoleDTO;

			//Primero buscamos el usuario si NO esta no creamos el departamento
			const userDB = await this.userRepository.findOneBy({id:user.id});
			if(!userDB) throw new BadRequestException("Ningun usuario fue encontrado por ese id!");

			//buscamos el departmento si NO esta no creamos el role
			const department = await this.departmentRepository.findOneBy({id:departamento});
			if(!department) throw new BadRequestException("Ningun departamento fue encontrado por ese id!");

			const role = this.roleRepository.create({
				...roleData,
				departamento:department,
				creadoPorUsuario:user
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



	async loginUser(loginUserDto:LoginUserDto){
		const { correo,password } = loginUserDto;

		const user = await this.userRepository.findOne({
			where:{correo}, // -> Condicion para buscar
			select:{correo:true,password:true,id:true} // -> Atributos que quiero
		});

		if(!user) throw new NotFoundException("Ningun usuario encontrado por ese correo")

		if(!bcrypt.compareSync(password,user.password)) throw new UnauthorizedException("Correo o password incorrectos!")

		return {
			...user,
			token:this.generateJWT({correo:user.correo,id:user.id})
		};
	}



	generateJWT(payload:JwtPayload){
		const token = this.jwtService.sign(payload);
		return token;
	}

}

/* 
	metodos find (find,findOne,findOneBy) y queryBuilder() diferencias

	con el metodo find nosotros podemos hacer busquedas simples en
	nuestras entidades pero con el queryBuilder podemos hacer 
	busquedas muchisimo mas complejas y uniendo con sus relaciones
	Ide una manera mas sencilla.
*/
