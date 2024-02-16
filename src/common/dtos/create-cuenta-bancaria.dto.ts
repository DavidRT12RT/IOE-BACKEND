import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCuentaBancariaDto {

    @IsNotEmpty({ message: 'El número de cuenta debe estar presente' })
    @IsString({ message: 'El número de cuenta debe ser un string' })
    numero_cuenta: string;

    @IsNotEmpty({ message: 'El banco debe estar presente' })
    @IsString({ message: 'El banco debe ser un string' })
    banco: string;

    @IsNotEmpty({ message: 'El tipo de cuenta debe estar presente' })
    @IsString({ message: 'El tipo de cuenta debe ser un string' })
    tipo: string;

    @IsNotEmpty({ message: 'La CLABE debe estar presente' })
    @IsString({ message: 'La CLABE debe ser un string' })
    CLABE: string;

}
