import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

//Entities
import { Usuario } from "../../auth/entities/usuario.entity";
import { Departamento } from "./departamento.entity";
import { UsuarioRoles } from "src/auth/entities/usuario-roles.entity";

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

    //Relaciones
    @ManyToOne(
        () => Departamento,
        (departamento) => departamento.roles,
    )

    departamento:Departamento;

    @OneToMany(
        () => UsuarioRoles,
        (usuariosRoles) => usuariosRoles.role
    )
    usuarioRoles:UsuarioRoles[];

    @ManyToOne(
        () => Usuario,
        (usuario) => usuario.rolesCreados
    )
    creadoPorUsuario:Usuario;


};