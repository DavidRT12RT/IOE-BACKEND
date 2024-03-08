import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoriaDto } from "./create-categoria.dto";
import { IsArray, IsOptional, Min } from 'class-validator';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {

    @IsOptional()
    @IsArray()
    productosDesvincular?:string[];


    @IsOptional()
    @IsArray()
    productosVincular?:string[];

}
