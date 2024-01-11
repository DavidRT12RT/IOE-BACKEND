import {IsString,IsUUID,MinLength } from "class-validator";

export class CreateRoleDTO {

    @IsString({message:"el nombre debe ser un string"})
    @MinLength(1,{message:"El nombre del rol es necesario!"})
    nombre:string;

    @IsString({message:"la descripcion debe ser un string"})
    @MinLength(1,{message:"La descripcion del rol es necesaria!"})
    descripcion:string;

    @IsUUID("4",{message:"El departamento debe ser un UUID valido!"})
    //"4" -> Valor debe ser un UUID version 4
    departamento:string;

};