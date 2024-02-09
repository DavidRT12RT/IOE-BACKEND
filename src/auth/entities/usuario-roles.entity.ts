import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "./usuario.entity";
import { Role } from "./role.entity";

@Entity()
export class UsuarioRoles{

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @ManyToOne(
        () => Usuario,
        (usuario) => usuario.usuarioRoles
    )
    usuario:Usuario;

    @ManyToOne(
        () => Role,
        (role) => role.usuarioRoles
    )
    role:Role;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

};