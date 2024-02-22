import { IsNotEmpty, IsString } from "class-validator";

export class CreateMarcaDto {

    @IsString({message:"El nombre de la marca debe ser un string"})
    @IsNotEmpty({message:"El nombre debe venir en la peticion!"})
    nombre:string;

};