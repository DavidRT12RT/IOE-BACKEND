import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name:"role"})
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
        () => User,
        user => user.roles,
        {eager:true}
    )
    @JoinTable()
    usuarios:User[];

};