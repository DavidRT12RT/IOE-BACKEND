import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({ 
    imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type:"postgres",
			host:process.env.DB_HOST,
			port:+process.env.DB_PORT,
			database: process.env.STAGE === "dev" ? process.env.DB_NAME_DEV : process.env.DB_NAME_PROD,
  	    	username: process.env.DB_USERNAME,
      		password: process.env.DB_PASSWORD,      
			autoLoadEntities:true,
			entities:['dist/src/**/*.entity.js'],
      		synchronize: true,
		}),
		AuthModule,
		CommonModule,
		SeedModule,
		// StoreModule,
	],
})
export class AppModule {

	private readonly logger = new Logger("AppModule");
	constructor(){
		this.logger.log(`\n-----------DB INFO ----------- \nDB HOST:${process.env.DB_HOST}\nDB PORT:${process.env.DB_PORT}\nDB DATABASE:${process.env.STAGE === "dev" ? process.env.DB_NAME_DEV : process.env.DB_NAME_PROD}\n------------------------------ 
		`);
	}

}
