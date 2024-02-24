import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsUUID } from "class-validator";

export class CreateProductoAlmacenDto{

    @IsUUID()
    almacen:string;

    @IsNumber()
	@Transform(({value}) => parseInt(value))
    stock:number;

    @IsOptional()
    @IsUUID()
    producto:string;

};