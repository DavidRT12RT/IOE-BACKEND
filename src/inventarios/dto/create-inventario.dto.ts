import { ArrayMinSize, ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateInventarioDto {

    @IsString({message:"El nombre de inventario tiene que ser un string"})
    @IsNotEmpty({message:"El nombre del inventario es necesario!"})
    nombre_inventario:string;
    
    @IsNotEmpty({message:"El tipo de jerarquia es necesario!"})
    tipo_inventario:string;

    //Solo va a venir si el tipo_inventario es "categoria"
    @IsOptional()
    @IsUUID("4",{message:"La categoria necesita ser un ID valido"})
    categoria?:string;

    //Solo va venir si el tipo_inventario es "personalizado"
    @IsOptional()
    @ArrayNotEmpty({message:"La lista de productos no puede estar vacia!"})
    @ArrayMinSize(1,{message:"Debe haber al menos un producto en la lista"})
    productos?:string[];

};
