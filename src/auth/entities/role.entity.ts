import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Department } from "./department.entity";

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
        {
            eager:true,
            onDelete:"CASCADE"
        }
    )
    @JoinTable()
    usuarios:User[];

    @ManyToOne(
        () => Department,
        (department) => department.roles,
    )
    departamento:Department;

    @ManyToOne(
        () => User,
        (user) => user.createdDepartments
    )
    createdByUser:User;

};