import { Transform } from "class-transformer";
import { IsInt, IsString, IsUUID, Min } from "class-validator";

export class CreateProductoDto {

	@IsString({message:"El nombre del producto debe ser un string"})
	nombre:string;

	@IsString()
	descripcion:string;

	@IsInt()
	@Min(1)
	@Transform(({value}) => parseInt(value))
	stock:number;

	@IsInt()
	@Min(1)
	@Transform(({value}) => parseInt(value))
	stock_minimo:number;

	@IsInt()
	@Min(1)
	@Transform(({value}) => parseInt(value))
	costo_promedio:number;

    @IsUUID("4",{message:"El almacen debe ser un UUID valido!"})
    almacen:string;

    @IsUUID("4",{message:"La categoria debe ser un UUID valido!"})
    categoria:string;

};

