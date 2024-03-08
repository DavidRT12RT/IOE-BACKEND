import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Destinatario } from "src/common/entities/destinatario.entity";
import { Origen } from "src/common/entities/origen.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { TipoSalida, DetalleSalida } from '../entities/salida.entity';

export class CreateSalidaDto {
    
    @IsNotEmpty()
    destinatario:Destinatario;

    @IsNotEmpty()
    origen:Origen;

    @IsArray()
    @IsNotEmpty()
    @Type(() => Producto)
    productos:Producto[]

    @IsEnum(TipoSalida)
    tipo:TipoSalida;

    @IsArray()
    @IsNotEmpty()
    detalles?: DetalleSalida[];

};