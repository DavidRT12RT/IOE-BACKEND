import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SatModule } from 'src/SAT/sat.module';

@Module({
	controllers: [SeedController],
  	providers: [SeedService],
	imports:[
		ConfigModule,
		AuthModule,
		SatModule
	]
})
export class SeedModule {}
