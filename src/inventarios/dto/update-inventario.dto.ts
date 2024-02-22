import { PartialType } from '@nestjs/mapped-types';
import { CreateInventarioDto } from './create-inventario.dto';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DetalleInventarioDTO {
    @IsString()
    productoId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AlmacenDetalleDTO)
    almacenes: AlmacenDetalleDTO[];
}

class AlmacenDetalleDTO {
    @IsString()
    almacenId: string;

    @IsNumber()
    cantidad_contada: number;

    @IsOptional()
    fecha_registro?: Date;
}

export class UpdateInventarioDto extends PartialType(CreateInventarioDto) {

    @IsOptional()
    @IsUUID("4",{message:"El ID del supervisor tiene que ser un UUID valido!"})
    supervisor:string;

    @IsOptional()
    @IsBoolean({message:"El estatus tiene que ser un booleano"})
    estatus:boolean;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleInventarioDTO)
    detalles?: DetalleInventarioDTO[];

}
