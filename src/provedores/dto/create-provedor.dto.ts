import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateDireccionDto } from "src/common/dtos/create-direccion.dto";
import { CondicionesComerciales, CondicionesPago, TipoDePersona } from "../entities/provedor.entity";
import { CreateCuentaBancariaDto } from "src/common/dtos/create-cuenta-bancaria.dto";

export class CreateProvedorDto {


    @IsNotEmpty({message:"El nombre del provedor debe venir en la peticion"})
    @IsString({message:"El nombre del provedor debe ser un string"})
    nombre:string;

    @IsNotEmpty({message:"El alias del provedor debe venir en la peticion"})
    @IsString({message:"El alias del provedor debe ser un string"})
    alias:string;

    @IsNotEmpty({message:"El RFC debe venir en la peticion"})
    @IsString({message:"El RFC del provedor debe ser un string"})
    RFC:string;

    @IsNotEmpty({message:"El telefono del provedor debe venir en la peticion"})
    @IsString({message:"El telefono del provedor debe ser un string"})
    telefono:string;

    @IsNotEmpty({message:"El correo del provedor debe venir en la peticion"})
    @IsString({message:"El correo del provedor debe ser un string"})
    correo:string;

    @IsOptional()
    @IsString({message:"El correo del provedor debe ser un string"})
    sitio_web?:string;

    @IsOptional()
    @IsArray({message:"Las etiquetas del provedor deben ser un array de strings"})
    @IsString({each:true,message:"Cada etiqeuta debe ser un string"})
    etiquetas?:string[];

    @IsOptional()
    @IsArray({message:"Las direcciones del provedor deben ser un array"})
    @ValidateNested({each:true})
    @Type(() => CreateDireccionDto)
    direcciones?:CreateDireccionDto[];

    @IsOptional()
    @IsArray({ message: "Las condiciones comerciales del proveedor deben ser un array" })
    @IsEnum(CondicionesComerciales, { each: true, message: "Cada condición comercial debe ser válida" })
    condicionesComerciales?: CondicionesComerciales[];

    @IsOptional()
    @IsArray({ message: "Las condiciones de pago del proveedor deben ser un array" })
    @IsEnum(CondicionesPago, { each: true, message: "Cada condición de pago debe ser válida" })
    condicionesPago?: CondicionesPago[];

    @IsOptional()
    @IsArray({ message: "La tarifa del proveedor debe ser un array de strings" })
    @IsString({ each: true, message: "Cada tarifa debe ser un string" })
    tarifas?: string[];

    @IsOptional()
    @IsBoolean({ message: 'El recordatorio de recibo del proveedor debe ser un booleano' })
    recordatorio_recibo?: boolean;

    @IsOptional()
    @IsString({ message: 'Cada nota debe ser un string' })
    notas: string;

    @IsOptional()
    @IsArray({ message: 'Las cuentas bancarias del proveedor deben ser un array' })
    cuentasBancarias?: CreateCuentaBancariaDto[];

    @IsOptional()
    @IsEnum(TipoDePersona, { message: 'El tipo de persona deben ser válidas (MORALES O FISICAS)' })
    tipoPersona?:TipoDePersona;

};
