import { IsNotEmpty, IsString } from "class-validator";

export class CreateInventarioDto {

    @IsString({message:"El nombre de inventario tiene que ser un string"})
    @IsNotEmpty({message:"El nombre del inventario es necesario!"})
    nombre_inventario:string;
    

    @IsString({message:"La jerarquia del inventario tiene que ser un string"})
    @IsNotEmpty({message:"La jerarquia del inventario es necesario!"})
    jerarquia:string;

};
