import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const logger = new Logger("Bootstrap");

	app.setGlobalPrefix("api");

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist:true, // -> Remueve todo lo que no esta incluido en los DTO's
			forbidNonWhitelisted:true // -> Retorna bad request si hay propiedad en el objeto no requeridas
		})
	);

	logger.log(`App running on port: ${process.env.PORT}...`);
  	await app.listen(3000);
};

bootstrap();
