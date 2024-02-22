import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProvedoresService } from './provedores.service';
import { CreateProvedorDto } from './dto/create-provedor.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('provedores')
export class ProvedoresController {

    constructor(private readonly provedoresService: ProvedoresService) {}

    @Post()
    @Auth()
    create(
        @Body() createProvedorDto: CreateProvedorDto,
        @GetUser() usuario:Usuario
    ) {
        return this.provedoresService.create(createProvedorDto,usuario);
    }

    @Get()
    @Auth()
    findAll(
        @Query() paginationDto:PaginationDto
    ) {
        return this.provedoresService.findAll(paginationDto);
    }

    @Get(":id")
    @Auth()
    findOne(
        @Param("id",ParseUUIDPipe) id:string
    ) {
        return this.provedoresService.findOneById(id);
    }

}
