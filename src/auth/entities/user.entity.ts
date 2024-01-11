import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { Department } from "./department.entity";

@Entity({name:"usuario"})
export class User{

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column('text')
    nombre: string;

    @Column('text')
    apellido_materno: string;

    @Column('text')
    apellido_paterno: string;

    @Column('text', {select: false})
    password: string;

    @Column("text")
    correo: string;

    @Column("text",{
        nullable:true
    })
    telefono:string;

    @Column('bool', {default: true})
    activo: boolean;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;
   
    //Relaciones
    // -> Self refering
    @ManyToOne( // ->Many user can have one supervisor
        () => User, 
        user => user.personal,
        {onDelete:"SET NULL",nullable:true}
    )
    supervisor?:User;

    
    @OneToMany( //->One user (supervisor) can have multiple users
        ()=> User,
        user => user.supervisor,
        {nullable:true}
    )
    personal?:User[];

    @ManyToMany(
        () => Role,
        role => role.usuarios,
    )
    roles:Role[];

    @OneToMany(
        () => Department,
        (department) => department.createdByUser
    )
    createdDepartments:Department[]; // -> Solo admins pueden crear departamentos , asi que este campo en la mayoria solo lo tendran los admins que a su vez pertenecen al departamento de sistemas, esto quiere decir que tenemo

    @OneToMany(
        () => Role,
        (role) => role.createdByUser
    )
    createdRoles:Role[];

    //Triggers 
    @BeforeInsert()
    checkFieldsBeforeInsert(){ 
        this.correo = this.correo.toLowerCase().trim();
        this.nombre = this.nombre.toLowerCase().trim();
        this.apellido_materno = this.apellido_materno.toLocaleLowerCase().trim();
        this.apellido_paterno = this.apellido_paterno.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }

};

/* 
    notas:
    El decorador @JoinTable es requerido
    para relaciones ManyToMany
    lo debemos de poner en uno de los
    lados de la relacion de pertencia.

    cuando hacemos delete en uno de las entidades ManyToMany 
    automaticamente se elimina el registra la entidad 1 con la 2.
*/