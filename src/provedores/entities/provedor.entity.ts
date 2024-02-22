import { CuentaBancaria } from "src/common/entities/cuenta-bancaria.entity";
import { Direccion } from "src/common/entities/direccion.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProvedorProducto } from "./provedor-producto.entity";

export enum CondicionesComerciales {
    CONTADO = "CONTADO",
    CREDITO = "CREDITO"
};


export enum TipoDePersona {
    MORAL = "MORAL",
    FISICA = "FISICA"
};

export enum CondicionesPago {
    PAGO_INMEDIATO = "PAGO_INMEDIATO",
    "15 DIAS" = "15 DIAS",
    "21 DIAS" = "21 DIAS",
    "30 DIAS" = "30 DIAS",
    "45 DIAS" = "45 DIAS",
    "FIN DE MES" = "FIN DE MES"
};

@Entity()
export class Provedor {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    nombre:string;

    @Column({nullable:true})
    alias:string;

    @Column()
    RFC:string;

    @Column()
    telefono:string;

    @Column({nullable:true})
    movil:string;

    @Column({nullable:true})
    correo:string;

    @Column({nullable:true})
    sitio_web:string;

    @Column("text",{array:true,nullable:true})
    etiquetas:string[];

    //Compra
    @Column("simple-array")
    condicionesComerciales: CondicionesComerciales[];

    @Column("simple-array")
    condicionesPago:CondicionesPago[];

    @Column("simple-array")
    tarifas:string[];

    @Column("boolean",{default:true})
    recordatorio_recibo:boolean;

    @Column()
    notas:string;

    @OneToMany(
        () => CuentaBancaria,
        (cuentaBancaria) => cuentaBancaria.provedor,
        {cascade:true}
    )
    cuentasBancarias:CuentaBancaria[];

    //Direcciones
    @OneToMany(
        () => Direccion,
        direccion => direccion.provedor,
        {cascade:true}
    )
    direcciones:Direccion[];

    @Column({
        type:"enum",
        enum:TipoDePersona,
        default:TipoDePersona.MORAL
    })
    tipoDePersona:TipoDePersona;

    @OneToMany(
        () => ProvedorProducto,
        (provedorProducto) => provedorProducto.provedor
    )
    provedorProductos:ProvedorProducto[];

};
