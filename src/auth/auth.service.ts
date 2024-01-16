import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Entities
import { Usuario } from './entities/usuario.entity';
import { Departamento } from './entities/departamento.entity';
import { Role } from './entities/role.entity';

//DTO's
import { CreateUserDTO } from './dto/create-user.dto';

//Bcrypt
import * as bcrypt from "bcrypt";

//DTO's (Data Transfer Object)
import { LoginUserDto } from './dto/login-user.dto';
import { CreateRoleDTO } from './dto/create-role.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateDepartmentDto } from './dto/create-department';

//JWT
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	
    private readonly logger = new Logger("AuthController");

	constructor(
		@InjectRepository(Usuario) 
		private readonly userRepository:Repository<Usuario>,

		@InjectRepository(Role)
		private readonly roleRepository:Repository<Role>,

		@InjectRepository(Departamento)
		private readonly departmentRepository:Repository<Departamento>,

		private readonly jwtService:JwtService // -> Proporcionado por el JWTMODULE Y LA EXPORTACION
	){}

	async createRole(createRoleDTO:CreateRoleDTO,user:Usuario){

		try {

			const { departamento,...roleData } = createRoleDTO;

			//Primero buscamos el usuario si NO esta no creamos el departamento
			const userDB = await this.userRepository.findOneBy({id:user.id});
			if(!userDB) throw new BadRequestException("Ningun usuario fue encontrado por ese id!");

			//buscamos el departmento si NO esta no creamos el role
			const department = await this.departmentRepository.findOneBy({id:departamento});
			if(!department) throw new BadRequestException("Ningun departamento fue encontrado por ese id!");

			const role = this.roleRepository.create({
				...roleData,
				departamento:department,
				creadoPorUsuario:user
			});
			await this.roleRepository.save(role);

			return {
				role,
				message:"Rol creado!"
			};

		} catch (error) {
			this.handleDBErrors(error);
		}

	}

	async createDepartment(createDepartmentDto:CreateDepartmentDto,user:Usuario){

		try {

			//Primero buscamos el usuario si NO esta no creamos el departamento
			const userDB = await this.userRepository.findOneBy({id:user.id});
			if(!userDB) throw new BadRequestException("Ningun usuario fue encontrado por ese id!");

			const departamento = this.departmentRepository.create({
				...createDepartmentDto,
				creadoPorUsuario:user
			});

			await this.departmentRepository.save(departamento);

			return {
				departamento,
				message:"Departamento creado!"
			};


		} catch (error) {
			this.handleDBErrors(error);
		}
	}

	async createUser(createUserDTO: CreateUserDTO) {

		const { roles,...userData } = createUserDTO;

		//Verificar que todos los roles existan primero antes de registrar el usuario
		for(const roleId of roles){
			const roleDB = await this.roleRepository.findOneBy({id:roleId})
			if(!roleDB) throw new BadRequestException(`El rol con id ${roleId} no existe,la creacion fue cancelada!`);
		}

		userData.password = bcrypt.hashSync(createUserDTO.password,10);

		let user = this.userRepository.create({
			...userData,
			roles:[]
		});

		user = await this.userRepository.save(user);

		for(const roleId of roles){

			const roleDB = await this.roleRepository.findOneBy({id:roleId})

			roleDB.usuarios.push(user);
			await this.roleRepository.save(roleDB);

			user.roles.push(roleDB);

		}

		user = await this.userRepository.save(user);
		delete user.password;

		return {
			message:"Usuario creado con exito!",
			user,
			token:this.generateJWT({correo:user.correo,id:user.id})
		};

  	}

	async loginUser(loginUserDto:LoginUserDto){
		const { correo,password } = loginUserDto;

		const user = await this.userRepository.findOne({
			where:{correo}, // -> Condicion para buscar
			select:{correo:true,password:true,id:true} // -> Atributos que quiero
		});

		if(!user) throw new NotFoundException("Ningun usuario encontrado por ese correo")

		if(!bcrypt.compareSync(password,user.password)) throw new UnauthorizedException("Correo o password incorrectos!")

		return {
			...user,
			token:this.generateJWT({correo:user.correo,id:user.id})
		};
	}

	async findAllUsers(
		paginationDto:PaginationDto
	){
		const users = await this.userRepository.createQueryBuilder("user")
		.leftJoinAndSelect("user.roles","roles")
		.leftJoinAndSelect("roles.departamento","departamento")
		.leftJoinAndSelect("user.supervisor","supervisor")
		.leftJoinAndSelect("user.personal","personal")
		.skip(paginationDto.offset)
		.take(paginationDto.limit)
		.getMany()

		return {
			users
		};
	}

	async getUserById(id:string){

		const user = await this.userRepository.createQueryBuilder("user")
		.leftJoinAndSelect("user.roles","roles")
		.leftJoinAndSelect("user.supervisor","supervisor")
		.leftJoinAndSelect("user.personal","personal")
		.where("user.id = :id",{id})
		.getOne();

		if(!user) throw new NotFoundException(`Ningun usuario por ese id ${id}`);

		return user;
	}

	async deleteAllUsers(){
		const query = this.userRepository.createQueryBuilder("user");

		try {
			return query.delete().where({}).execute();
		} catch (error) {
			this.handleDBErrors(error);
		}
	}

	async deleteAllDepartments(){
		const query = this.departmentRepository.createQueryBuilder("department");
		try {
			return query.delete().where({}).execute();
		} catch (error) {
			this.handleDBErrors(error);
		}
	}

	async findAllDepartments(
		paginationDto:PaginationDto
	){
		return this.departmentRepository.createQueryBuilder("department")
		.leftJoinAndSelect("department.roles","roles")
		.skip(paginationDto.offset)
		.limit(paginationDto.limit)
		.getMany()
	}


    private handleDBErrors(error:any):never{ //-> never jamas regresara algo
        if(error.code === "23505") throw new BadRequestException(error.detail);

        this.logger.error(error);

        throw new InternalServerErrorException("Please check server logs...");
    }

	private generateJWT(payload:JwtPayload){
		const token = this.jwtService.sign(payload);
		return token;
	}

}

/* 
	metodos find (find,findOne,findOneBy) y queryBuilder() diferencias

	con el metodo find nosotros podemos hacer busquedas simples en
	nuestras entidades pero con el queryBuilder podemos hacer 
	busquedas muchisimo mas complejas y uniendo con sus relaciones
	Ide una manera mas sencilla.
*/
