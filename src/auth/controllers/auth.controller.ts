import { Controller,Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

//Dto's
import { LoginUserDto } from '../dto/login-user.dto';
import { Auth, GetUser } from '../decorators';
import { Usuario } from '../entities/usuario.entity';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}


    @Post("login")
    loginUser(@Body() loginUserDto:LoginUserDto){
        return this.authService.loginUser(loginUserDto);
    }

    @Post("renew")
    @Auth()
    renewToken(
        @GetUser() usuario:Usuario
    ){
        return this.authService.revalidateToken(usuario);
    }

    @Post("validate")
    @Auth()
    validateToken(
        @GetUser() usuario:Usuario
    ){
        return this.authService.validateToken(usuario);
    }

    @Post("private")
    @Auth()
    privateRoute(
        @GetUser() usuario:Usuario
    ){
        return usuario;
    }






}
