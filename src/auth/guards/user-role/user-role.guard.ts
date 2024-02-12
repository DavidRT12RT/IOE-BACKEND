import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { Usuario } from 'src/auth/entities/usuario.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

    constructor(
        private readonly reflector:Reflector //-> Nos ayuda a ver informacion de la metadata
    ){
    }

    canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {

        const validRoles:string[] = this.reflector.get(META_ROLES,context.getHandler());

        if(!validRoles) return true; // -> Cualquier persona puede entrar
        if(validRoles.length === 0) return true 

        const req = context.switchToHttp().getRequest();
        const user = req.user as Usuario;

        if(!user) throw new BadRequestException("Usuario no encontrado!");  

        for(const usuarioRoles of user.usuarioRoles){
            if(validRoles.includes(usuarioRoles.role.nombre)) {
                return true;
            }
            throw new ForbiddenException(`Usuario ${user.nombre} no tiene un rol valido para esta ruta! \n ${validRoles.join(",")}`);
        }

    }
}
/*
    Para que un guard sea valido necesitas implementar el metodo 
    canActivate
*/
