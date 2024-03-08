import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateCategoriaDto{

	@IsString({message:"El nombre del producto debe ser un string"})
    @Length(1, 20, { message: "El nombre debe tener entre 1 y 20 caracteres" })
	nombre:string;

	@IsOptional()
	@IsString()
    @Length(1, 40, { message: "La descripcion debe tener entre 1 y 20 caracteres" })
	descripcion:string;

	@IsOptional()
	@IsUUID(4,{message:"El id de la categoria padre no es valido!"})
	categoria_padre:string;

};