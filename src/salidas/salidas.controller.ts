import { Body, Controller, Post } from '@nestjs/common';
import { SalidasService } from './salidas.service';
import { CreateSalidaDto } from './dto/create-salida.dto';
import { Auth } from 'src/auth/decorators';

@Controller('salidas')
export class SalidasController {

	constructor(private readonly salidasService: SalidasService) {}

	@Auth()
	@Post()
	async createSalida(
		@Body() createSalidaDto:CreateSalidaDto
	){
		return this.salidasService.createSalida(createSalidaDto);
	}

}
