import { Controller, ForbiddenException, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ConfigService } from '@nestjs/config';

@Controller('seed')
export class SeedController {

	constructor(
		private readonly seedService: SeedService,
		private readonly configService:ConfigService
	) {}

	@Get()
	executeSeed(){
		//Asegurarse que estamos en ambiente de desarollo		
		const isDevEnviroment = this.configService.get("STAGE") === "dev";
		if(!isDevEnviroment) throw new ForbiddenException("No se puede ejecutar el seed en produccion");

		return this.seedService.runSeed();
	}

};
