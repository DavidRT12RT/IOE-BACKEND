import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Role } from "./role.entity";
import { Usuario } from "../../auth/entities/usuario.entity";

@Entity()
export class Departamento{

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    nombre:string;

    @Column()
    descripcion:string;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

    @ManyToOne(
        () => Usuario,
        (usuario) => usuario
    )
    creadoPorUsuario:Usuario;

    @OneToMany(
        () => Role,
        role => role.departamento,
        {
            cascade:true,
            onDelete:"CASCADE"
        }
    )
    roles:Role[];

};