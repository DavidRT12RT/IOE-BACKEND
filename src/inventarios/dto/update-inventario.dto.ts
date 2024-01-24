import { PartialType } from '@nestjs/mapped-types';
import { CreateInventarioDto } from './create-inventario.dto';
import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class UpdateInventarioDto extends PartialType(CreateInventarioDto) {

    @IsOptional()
    @IsUUID("4",{message:"El ID del supervisor tiene que ser un UUID valido!"})
    supervisor:string;

    @IsOptional()
    @IsBoolean({message:"El estatus tiene que ser un booleano"})
    estatus:boolean;

}
