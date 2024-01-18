import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Logger, InternalServerErrorException, UseGuards, Req, Headers, SetMetadata, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

//Decorators
import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './decorators';

// import { ValidRoles } from './interfaces';

//Dto's
import { CreateRoleDTO } from './dto/create-role.dto';
import { LoginUserDto } from './dto/login-user.dto';

//Entities
import { Usuario } from './entities/usuario.entity';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}


    @Post("register/role")
    @Auth(ValidRoles.admin)
    createRole(
        @Body() createRoleDTO:CreateRoleDTO,
        @GetUser() user:Usuario
    ) {
        return this.authService.createRole(createRoleDTO,user);
    }


    @Post("login")
    loginUser(@Body() loginUserDto:LoginUserDto){
        return this.authService.loginUser(loginUserDto);
    }


}
