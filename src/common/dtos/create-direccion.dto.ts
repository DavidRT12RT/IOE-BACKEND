import { IsString } from "class-validator";

export class CreateDireccionDto {
    
    @IsString()
    calle:string;

    @IsString()
    estado:string;

    @IsString()
    ciudad:string;

    @IsString()
    CP:string;

};