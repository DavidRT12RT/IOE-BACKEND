import { IsString } from "class-validator";

export class CreateCategoriaDto{

	@IsString({message:"El nombre del producto debe ser un string"})
	nombre:string;

	@IsString()
	descripcion:string;

};