import { Module } from '@nestjs/common';

//Authentication
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

//Entities
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Role } from './entities/role.entity';
import { UsuarioRoles } from './entities/usuario-roles.entity';

//Controller's
import { AuthController } from './controllers/auth.controller';
import { UsuariosController } from './controllers/usuarios.controller';
import { RolesController } from './controllers/roles.controller';
import { DepartamentosController } from './controllers/departamentos.controller';

//Servicie's
import { AuthService } from './services/auth.service';
import { UsuariosService } from './services/usuarios.service';
import { Departamento } from './entities/departamento.entity';
import { DepartamentosService } from './services/departamentos.service';
import { RolesService } from './services/roles.service';


@Module({
  	controllers: [
		AuthController,
		UsuariosController,
		RolesController,
		DepartamentosController
	],
  	providers: [
		AuthService,
		DepartamentosService,
		RolesService,
		UsuariosService,
		JwtStrategy
	],
	imports:[
		ConfigModule,
		TypeOrmModule.forFeature([
			Usuario,
			Role,
			Departamento,
			UsuarioRoles,
		]),
		PassportModule.register({defaultStrategy:"jwt"}),
		JwtModule.registerAsync({
			imports:[ ConfigModule ],
			inject:[ ConfigService ],
			// Funcion que se ejecuta cuando se monta el modulo sincrono
			useFactory:(configService:ConfigService) => ({
				secret:configService.get("JWT_SECRET"),
				signOptions:{
					expiresIn:"2 days"
				}
			})
		})
	],
	exports:[
		AuthService,
		UsuariosService,
		DepartamentosService,
		RolesService,
		TypeOrmModule,
		JwtStrategy,
		PassportModule,
		JwtModule,
	]
})
export class AuthModule {}
