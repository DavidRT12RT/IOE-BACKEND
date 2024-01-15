import { IsString } from "class-validator";

export class CreateStoreDto {
    
    @IsString({message:"La zona de la sucursal es necesaria!"})
    zona:string;

    @IsString({message:"La ciudad de la sucursal es necesaria!"})
    ciudad:string;

    @IsString({message:"La calle de la sucursal es necesaria!"})
    calle:string;

};
