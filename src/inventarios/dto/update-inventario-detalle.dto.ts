import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateInventarioDetalleDto {

    @IsNotEmpty({message:"La cantidad contada debe de venir en la peticion!"})
    @IsNumber({},{message:"La cantidad contada debe ser un numero!"})
    cantidad_contada:number;

};
