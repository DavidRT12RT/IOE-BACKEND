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
    roles:SeedRole[];
};

interface SeedDepartment{
    nombre:string;
    descripcion:string;
    roles:SeedDepartment[],
    createdBy:SeedUser | null;
};

interface SeedData {
    users:SeedUser[],
    roles:SeedRole[];
    departments:SeedDepartment[];
};

export const initialData:SeedData = {
    users:[
        {
            nombre:"admin",
            apellido_paterno:"admin",
            apellido_materno:"admin",
            correo:"admin@distribuidoraioe.com",
            password:bcrypt.hashSync("Cambio.2019",10),
            roles:[]
        },
        {
            nombre:"user",
            apellido_paterno:"user",
            apellido_materno:"user",
            correo:"user@distribuidoraioe.com",
            password:bcrypt.hashSync("1234oO",10),
            roles:[]
        },
    ],
    roles:[
        {
            nombre:"admin",
            descripcion:"Usuario admin del sistema",
        },
        {
            nombre:"user",
            descripcion:"Usuario user del sistema"
        }
    ],
    departments:[
        {
            nombre:"Sistemas",
            descripcion:"Departamento de sistemas de IOE",
            roles:[],
            createdBy:null
        }
    ]
};