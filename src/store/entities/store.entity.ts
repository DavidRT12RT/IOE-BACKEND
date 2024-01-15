import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Warehouse } from "./warehouse.entity";

@Entity("sucursales")
export class Store {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    zona:string;

    @Column()
    ciudad:string;
    
    @Column()
    calle:string;

    @ManyToOne(
        () => User,
        (user) => user.sucursalesCreadas
    )
    usuarioCreador:User; 

    @OneToMany(
        () => Warehouse,
        (Warehouse) => Warehouse.sucursal
    )
    almacenes:Warehouse[];

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

};
