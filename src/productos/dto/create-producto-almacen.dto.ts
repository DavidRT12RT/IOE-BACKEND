import { IsNumber, IsOptional, IsUUID } from "class-validator";

export class CreateProductoAlmacenDto{

    @IsUUID()
    almacen:string;

    @IsNumber()
    stock:number;

    @IsOptional()
    @IsUUID()
    producto:string;

};