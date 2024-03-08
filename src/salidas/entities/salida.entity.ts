import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

//Entities
import { Destinatario } from "src/common/entities/destinatario.entity";
import { Origen } from "src/common/entities/origen.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { Usuario } from "src/auth/entities/usuario.entity";

export enum TipoSalida {
    TRANSFERENCIA_ALMACEN = "TRANSFERENCIA ALMACEN",
    TRANSFERENCIA_SUCURSAL = "TRANSFERENCIA SUCURSAL",
    MERMA = "MERMA",
    DEVOLUCION = "DEVOLUCION"
};

export interface DetalleSalida {
    productoId:string;
    cantidad:number;
};

@Entity()
export class Salida {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @ManyToOne(() => Destinatario)
    destinatario:Destinatario;
    
    @ManyToOne(() => Origen)
    origen:Origen;

    @Column({
        type:"enum",
        enum:TipoSalida
    })
    tipo:TipoSalida;

    @ManyToMany(
        () => Producto,
        (producto) => producto.salidas
    )
    @JoinTable()
    productos:Producto[];

    @Column("jsonb",{nullable:true})
    detalles:DetalleSalida[];

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

};