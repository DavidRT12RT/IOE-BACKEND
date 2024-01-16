import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Sucursal } from "./sucursal.entity";

@Entity("almacen")
export class Almacen{
    
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    nombre:string;

    @Column()
    descripcion:string;

    @Column()
    tipo_almacen:string;

    // @ManyToOne(
    //     () => User,
    //     (user) => user.almacenes,
    //     {
    //         nullable:true
    //     }
    // )
    // responsable:User;

    @ManyToOne(
        () => Sucursal,
        (sucursal) => sucursal.almacenes
    )
    sucursal:Almacen;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

};