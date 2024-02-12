import {  Injectable,  InternalServerErrorException,  Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
		try {
			const { correo, password } = { correo: loginUserDto.correo.toLowerCase(), password: loginUserDto.password };

			const usuario = await this.userRepository
			.createQueryBuilder("usuario")
			.leftJoinAndSelect("usuario.usuarioRoles","usuarioRoles")
			.leftJoinAndSelect("usuarioRoles.role","role")
			.addSelect("usuario.password") //Seleccionar el campo de la tabla o entidad
            .where("usuario.correo = :correo", { correo })
			.getOne();

			if(!usuario) throw new NotFoundException("Ningun usuario encontrado por ese correo")

			if(!bcrypt.compareSync(password,usuario.password)) throw new UnauthorizedException("Correo o password incorrectos!")

			return {
				...usuario,
				token:this.generateJWT({correo:usuario.correo,id:usuario.id})
			};
			
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(`Error en el servidor al momento de iniciar secion!`);
		}
	}

	async revalidateToken(
		usuario:Usuario
	){
		//Generar un nuevo token y regresarselo ya que YA paso la validacion del TOKEN
		const token = this.generateJWT({correo:usuario.correo,id:usuario.id});
		return {
			message:"Token revalidado con exito!",
			...usuario,
			token,
		};
	}

	async validateToken(
		usuario:Usuario
	){
		//Validar el token 
		return {
			message:"Token valido!"
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
