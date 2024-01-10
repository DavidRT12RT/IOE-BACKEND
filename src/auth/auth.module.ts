import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

//Authentication
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

//Entities
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

@Module({
  	controllers: [AuthController],
  	providers: [AuthService,JwtStrategy],
	imports:[
		ConfigModule,
		TypeOrmModule.forFeature([User,Role]),
		PassportModule.register({defaultStrategy:"jwt"}),
		// JwtModule.register({
		// 	secret:process.env.JWT_SECRET,
		// 	signOptions:{
		// 		expiresIn:"1 days"
		// 	}
		// })
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
		TypeOrmModule,
		JwtStrategy,
		PassportModule,
		JwtModule
	]
})
export class AuthModule {}
