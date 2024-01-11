import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { User } from "./user.entity";

@Entity("departamentos")
export class Department{

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    nombre:string;

    @Column()
    descripcion:string;

    @OneToMany(
        () => Role,
        role => role.departamento,
        {
            cascade:true,
            onDelete:"CASCADE"
        }
    )
    roles:Role[];


    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

    @ManyToOne(
        () => User,
        (user) => user.createdDepartments
    )
    createdByUser:User;

};