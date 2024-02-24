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
    telefono:string;
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
    clavesSat:ClaveSat[],
    unidadesMedidaSat:UnidadMedidaSat[]
};

interface ClaveSat {
    clave:string;
    descripcion:string;
};

interface UnidadMedidaSat {
    unidad:string;
    descripcion:string;
};

export const initialData:SeedData = {		
    SystemUser:{
		nombre:"System",
		apellido_materno:"system",
		apellido_paterno:"system",
		correo:"system@distribuidoraioe.com",
		password:"admin1234oO",
        telefono:"229712025",
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
	},
    clavesSat:[
        {
            clave:"01010101",
            descripcion:"No existe en el catálogo"
        },
        {
            clave:"23151700",
            descripcion:"Maquinaria, equipo y suministros de la industria óptica"
        },
        {
            clave:"23151703",
            descripcion:"Equipo de esmerilado de lentes"
        },
        {
            clave:"24111502",
            descripcion:"Bolsas de papel"
        },
        {
            clave:"27112232",
            descripcion:"Ranuradora"
        },
        {
            clave:"27112722",
            descripcion:"Biseladora"
        },
        {
            clave:"31241700",
            descripcion:"Espejos"
        },
        {
            clave:"40151513",
            descripcion:"Bombas sumerjibles"
        },
        {
            clave:"42142901",
            descripcion:"Anteojos"
        },
        {
            clave:"42142902",
            descripcion:"Lentes para anteojos"
        },
        {
            clave:"42142903",
            descripcion:"Monturas para anteojos"
        },
        {
            clave:"42142905",
            descripcion:"Anteojos de sol"
        },
        {
            clave:"42142906",
            descripcion:"Estuche para anteojos"
        },
        {
            clave:"42142907",
            descripcion:"Pañitos para limpiar anteojos"
        },
        {
            clave:"42142909",
            descripcion:"Retenedores de anteojos"
        },
        {
            clave:"42142913",
            descripcion:"Lentes de contacto"
        },
        {
            clave:"42183001",
            descripcion:"Carteleras para examen de ojos o tarjetas de visión"
        },
        {
            clave:"42183009",
            descripcion:"Lentes de prueba del ojo o sus accesorios para uso oftálmico"
        },
        {
            clave:"42183010",
            descripcion:"Lensómetros para uso oftálmico"
        },
        {
            clave:"42183029",
            descripcion:"Unidades de forópter"
        },
        {
            clave:"42183030",
            descripcion:"Oclusores de ojos"
        },
        {
            clave:"42183033",
            descripcion:"Sets de ajuste de anteojos"
        },
        {
            clave:"42183039",
            descripcion:"Sujetadores de lentes oftálmicos"
        },
        {
            clave:"42183040",
            descripcion:"Herramientas o accesorios para optómetras"
        },
        {
            clave:"42183041",
            descripcion:"Linternas de pruebas de percepción del color"
        },
        {
            clave:"42183046",
            descripcion:"Sets o accesorios de prueba de visión binocular"
        },
        {
            clave:"42183047",
            descripcion:"Soportes miradores para pruebas de agudeza visual"
        },
        {
            clave:"42294515",
            descripcion:"Pulidores de lentes oftálmicos"
        },
        {
            clave:"46181804",
            descripcion:"Gafas protectoras"
        },
        {
            clave:"46181806",
            descripcion:"Limpiadores de lentes"
        },
        {
            clave:"52121507",
            descripcion:"Plumones"
        },
        {
            clave:"53121608",
            descripcion:"Bolsas para compras"
        },
        {
            clave:"56112109",
            descripcion:"Bancos"
        },
        {
            clave:"56131600",
            descripcion:"Exhibidores y accesorios auto soportados para mercancías"
        },
        {
            clave:"60105409",
            descripcion:"Materiales de enseñanza  de publicidad o comercialización de marcas"
        }
    ],
    unidadesMedidaSat:[
        {
            unidad:"H87",
            descripcion:"PIEZA"
        },
        {
            unidad:"PR",
            descripcion:"PAR"
        }
    ]
};