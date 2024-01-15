import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity("almacen")
export class Warehouse {
    
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    nombre:string;

    @Column()
    descripcion:string;

    @Column()
    tipo_almacen:string;

    @ManyToOne(
        () => User,
        (user) => user.almacenes,
        {
            nullable:true
        }
    )
    responsable:User;

    @ManyToOne(
        () => Store,
        (store) => store.almacenes
    )
    sucursal:Store;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

};