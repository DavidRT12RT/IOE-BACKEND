import { IsString, IsUUID } from "class-validator";

export class CreateWarehouseDto{

    @IsString({message:"El nombre del almacen necesita ser un string"})
    nombre:string;

    @IsString({message:"La descripcion del almacen necesita ser un string"})
    descripcion:string;

    @IsString({message:"El tipo del almacen necesita ser un string"})
    tipo_almacen:string;

    @IsUUID("4",{message:"La sucursal debe ser un UUID valido!"})
    sucursal:string;


};