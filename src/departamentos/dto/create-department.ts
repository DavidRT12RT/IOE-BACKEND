import { IsString,MinLength } from "class-validator";

export class CreateDepartmentDto {


    @IsString({message:"el nombre debe ser un string"})
    @MinLength(1,{message:"El nombre del departamento es necesario!"})
    nombre:string;

    @IsString({message:"la descripcion debe ser un string"})
    @MinLength(1,{message:"La descripcion del departamento es necesaria!"})
    descripcion:string;

};