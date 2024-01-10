import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto{

    @IsNotEmpty({message:"El correo electronico no puede estar vacio!"})
    @IsEmail({},{message:"El correo electronico debe tener un formato valido"})
    correo:string;
    
    @IsString({message:"el password debe ser un string"})
    @MinLength(6,{message:"La longitud minima es de 6 caracteres!"})
    @MaxLength(50,{message:"La longitud maxima es de 50 caracteres!"})
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:"El password tiene que tener mayusculas,minusculas y un numero"
    })
    password:string;
};