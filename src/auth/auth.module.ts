import { Module } from '@nestjs/common';

//Controller's
import { UsuariosController } from './usuarios.controller';
import { AuthController } from './auth.controller';

//Services's
import { UsuariosService } from './usuarios.service';
import { DepartamentosService } from '../departamentos/departamentos.service';
import { AuthService } from './auth.service';

//Authentication
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

//Entities
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../departamentos/entities/role.entity';
import { Usuario } from './entities/usuario.entity';
import { Departamento } from '../departamentos/entities/departamento.entity';


@Module({
  	controllers: [
		AuthController,
		UsuariosController,
	],
  	providers: [
		AuthService,
		UsuariosService,
		JwtStrategy
	],
	imports:[
		ConfigModule,
		TypeOrmModule.forFeature([Usuario,Role,Departamento]),
		PassportModule.register({defaultStrategy:"jwt"}),
		JwtModule.registerAsync({
			imports:[ ConfigModule ],
			inject:[ ConfigService ],
			// Funcion que se ejecuta cuando se monta el modulo sincrono
			useFactory:(configService:ConfigService) => ({
				secret:configService.get("JWT_SECRET"),
				signOptions:{
					expiresIn:"1 days"
				}
			})
		})
	],
	exports:[
		AuthService,
		UsuariosService,
		TypeOrmModule,
		JwtStrategy,
		PassportModule,
		JwtModule,
	]
})
export class AuthModule {}
