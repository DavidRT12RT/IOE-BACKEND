import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUUID, Min, ValidateNested } from "class-validator";
import { CreateProductoAlmacenDto } from "./create-producto-almacen.dto";

export class CreateProductoDto {

	@IsString({message:"El nombre del producto debe ser un string"})
	nombre:string;

	@IsString()
	descripcion:string;

	@IsInt()
	@Min(1)
	@Transform(({value}) => parseInt(value))
	stock_minimo:number;

	@IsInt()
	@Min(1)
	@Transform(({value}) => parseInt(value))
	costo_promedio:number;

    @IsUUID("4",{message:"La categoria debe ser un UUID valido!"})
    categoria:string;

	@IsOptional()
	@IsString()
	material:string;

	@IsOptional()
	@IsString()
	color:string;

	@IsOptional()
	@IsBoolean()
	inventariable:boolean;

	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({each:true})
	@Type(() => CreateProductoAlmacenDto)
	almacenes:CreateProductoAlmacenDto[];

};

