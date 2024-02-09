import {  Injectable,  Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Entities
import { Usuario } from '../entities/usuario.entity';

//Bcrypt
import * as bcrypt from "bcrypt";

//JWT
import { JwtService } from '@nestjs/jwt';

//DTOS
import { LoginUserDto } from '../dto/login-user.dto';
import { JwtPayload } from '../interfaces';

@Injectable()
export class AuthService {
	
    private readonly logger = new Logger("AuthController");

	constructor(
		@InjectRepository(Usuario) 
		private readonly userRepository:Repository<Usuario>,

		private readonly jwtService:JwtService // -> Proporcionado por el JWTMODULE Y LA EXPORTACION
	){}




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
