import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DepartamentosModule } from 'src/departamentos/departamentos.module';

@Module({
	controllers: [SeedController],
  	providers: [SeedService],
	imports:[
		ConfigModule,
		AuthModule,
		DepartamentosModule
	]
})
export class SeedModule {}
