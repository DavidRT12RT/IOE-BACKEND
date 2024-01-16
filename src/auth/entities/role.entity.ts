import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

//Entities
import { Usuario } from "./usuario.entity";
import { Departamento } from "./departamento.entity";

@Entity()
export class Role {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({nullable:false})
    nombre:string;

    @Column()
    descripcion:string;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

    @ManyToMany(
        () => Usuario,
        usuario => usuario.roles,
        {
            eager:true,
            onDelete:"CASCADE"
        }
    )
    @JoinTable()
    usuarios:Usuario[];

    @ManyToOne(
        () => Usuario,
        (usuario) => usuario.rolesCreados
    )
    creadoPorUsuario:Usuario;

    @ManyToOne(
        () => Departamento,
        (departamento) => departamento.roles,
    )
    departamento:Departamento;


};