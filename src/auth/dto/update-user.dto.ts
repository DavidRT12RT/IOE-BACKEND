import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDTO } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUsuarioDTO extends PartialType(CreateUsuarioDTO) {


    @IsOptional()
    @IsBoolean()
    activo:boolean;
}