import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Entities
import { User } from './entities/user.entity';

//DTO's
import { CreateUserDTO } from './dto/create-user.dto';

//Bcrypt
import * as bcrypt from "bcrypt";

//DTO's (Data Transfer Object)
import { LoginUserDto } from './dto/login-user.dto';

//JWT
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dto/create-role.dto';


@Injectable()
export class AuthService {
	
    private readonly logger = new Logger("AuthController");

	constructor(
		@InjectRepository(User) 
		private readonly userRepository:Repository<User>,

		@InjectRepository(Role)
		private readonly roleRepository:Repository<Role>,

		private readonly jwtService:JwtService // -> Proporcionado por el JWTMODULE Y LA EXPORTACION
	){}

	async createRole(createRoleDTO:CreateRoleDTO){
		try {
			const role = this.roleRepository.create(createRoleDTO);
			await this.roleRepository.save(role);

			return {
				...role
			};

		} catch (error) {
			this.handleDBErrors(error);
		}
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
			token:this.generateJWT({correo:user.correo,id:user.id})
		};

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

    private handleDBErrors(error:any):never{ //-> never jamas regresara algo
        if(error.code === "23505") throw new BadRequestException(error.detail);

        this.logger.error(error);

        throw new InternalServerErrorException("Please check server logs...");
    }

	private generateJWT(payload:JwtPayload){
		const token = this.jwtService.sign(payload);
		return token;
	}

}
