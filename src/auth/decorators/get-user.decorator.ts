import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { Usuario } from "../entities/usuario.entity";

export const GetUser = createParamDecorator((data,ctx:ExecutionContext) => {

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as Usuario;

    if(!user) throw new InternalServerErrorException("Usuario no encontrado en la request,contacta al administrador del sistema!");

    return (data) ? user[data] : user;

});


/* 
    El ctx o ExecutionContext es el estado actual de nuestra
    aplicacion, como nos encontramos ahora y dentro de ese objeto
    tiene la propiedad request que tiene el usuario a su vez.
*/