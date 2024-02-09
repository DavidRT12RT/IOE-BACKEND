import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Logger, InternalServerErrorException, UseGuards, Req, Headers, SetMetadata, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

//Dto's
import { LoginUserDto } from '../dto/login-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}


    @Post("login")
    loginUser(@Body() loginUserDto:LoginUserDto){
        return this.authService.loginUser(loginUserDto);
    }


}
