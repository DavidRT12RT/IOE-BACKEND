import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Logger, InternalServerErrorException, UseGuards, Req, Headers, SetMetadata, Query, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { CreateRoleDTO } from './dto/create-role.dto';
import { Auth } from './decorators';
import { ValidRoles } from './interfaces';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateDepartmentDto } from './dto/create-department';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post("register/user")
    createUser(@Body() createUserDTO: CreateUserDTO) {
		  return this.authService.createUser(createUserDTO);
    }

    @Post("register/role")
    @Auth()
    createRole(
        @Body() createRoleDTO:CreateRoleDTO,
        @GetUser() user:User
    ) {
        return this.authService.createRole(createRoleDTO,user);
    }

    @Post("register/department")
    @Auth()
    createDepartment(
        @Body() createDepartmentDto:CreateDepartmentDto,
        @GetUser() user:User
    ){
        return this.authService.createDepartment(createDepartmentDto,user);
    }

    @Post("login")
    loginUser(@Body() loginUserDto:LoginUserDto){
        return this.authService.loginUser(loginUserDto);
    }

    @Get("/users")
    getAllUsers(
        @Query() paginationDto:PaginationDto
    ){
        return this.authService.findAllUsers(paginationDto);
    }

    @Get("/user/:id")
    getUsersById(
        @Param("id",ParseUUIDPipe) id:string
    ){
        return this.authService.getUserById(id);
    }

    @Get("/departments")
    getAllDepartments(
        @Query() paginationDto:PaginationDto
    ){
        return this.authService.findAllDepartments(paginationDto);
    }

    // @Get("private")
    // @UseGuards(AuthGuard()) // AuthGuard -> Es un guard propio que usa la configuracion que definimos, la estrategia que definimosm,etc.
    // testingPrivateRoute(
    //     @Req() request:Express.Request,
    //     @GetUser() user:User,
    //     @GetUser("correo") user1:User,

    //     @RawHeaders() rawHeaders:string[],
    //     @Headers() headers:IncomingHttpHeaders
    // ) {
    //     console.log(user);
    //     console.log(user1);
    //     return {
    //         message:"Ok"
    //     };
    // }

    // @Get("private2")
    // // @SetMetadata("roles",["kaka"])
    // // @SetMetadata("roles",["admin","user"])
    // @UseGuards(AuthGuard(),UserRoleGuard) // AuthGuard -> Es un guard propio que usa la configuracion que definimos, la estrategia que definimosm,etc.
    // testingPrivateRoute2(
    //     @GetUser() user:User
    // ) {

    //     return "Bienvenido!";
    // }

    // @Get("private3")
    // @RoleProtected(ValidRoles.superUser,ValidRoles.admin)
    // @UseGuards(AuthGuard(),UserRoleGuard)
    // testingPrivateRoute3(
    //     @GetUser() user:User
    // ) {

    //     return "Bienvenido!";
    // }

    @Get("private4")
    @Auth(ValidRoles.admin,ValidRoles.user)
    testingPrivateRoute4(
        @GetUser() user:User
    ) {

        return "Bienvenido!";
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
	// 	return this.authService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
	// 	return this.authService.update(+id, updateAuthDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
	// 	return this.authService.remove(+id);
    // }


}
