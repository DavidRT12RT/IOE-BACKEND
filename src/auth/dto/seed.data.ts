import * as bcrypt from "bcrypt";

interface SeedRole{
    nombre:string;
    descripcion:string;
};

interface SeedUser{
    nombre:string;
    apellido_paterno:string;
    apellido_materno:string;
    correo:string;
    password:string;
    roles:string[];
};

interface SeedDepartment{
    nombre:string;
    descripcion:string;
    roles:SeedDepartment[],
    createdBy:SeedUser | null;
};

interface SeedData {
    SystemUser:SeedUser,
    SystemDepartment:SeedDepartment,
    AdminRole:SeedRole
};

export const initialData:SeedData = {		
    SystemUser:{
		nombre:"System",
		apellido_materno:"system",
		apellido_paterno:"system",
		correo:"system@distribuidoraioe.com",
		password:"admin1234oO",
		roles:[]
	},
	SystemDepartment:{
		nombre:"Sistemas",
		descripcion:"Departamento de sistemas de IOE",
        roles:[],
        createdBy:null
	},
	AdminRole:{
		nombre:"admin",
		descripcion:"Rol de administrador de sistemas IOE",
	}
};