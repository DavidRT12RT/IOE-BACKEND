import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../../departamentos/entities/role.entity";
import { Departamento } from "../../departamentos/entities/departamento.entity";
import { Sucursal } from "src/sucursales/entities/sucursal.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { Categoria } from "src/productos/entities/categoria.entity";
import { Inventario } from "src/inventarios/entities/inventario.entity";

@Entity()
export class Usuario{

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
    @ManyToOne( 
        () => Usuario, 
        usuario => usuario.personal,
        {onDelete:"SET NULL",nullable:true}
    )
    supervisor?:Usuario;

    @OneToMany( 
        () => Usuario,
        usuario => usuario.supervisor,
        {nullable:true}
    )
    personal?:Usuario[];

    @ManyToMany(
        () => Role,
        role => role.usuarios,
    )
    roles:Role[];

    @OneToMany(
        () => Role,
        (role) => role.creadoPorUsuario
    )
    rolesCreados:Role[];

    @OneToMany(
        () => Producto,
        (producto) => producto.usuarioCreador
    )
    productosCreados:Producto[];

    @OneToMany(
        () => Departamento,
        (departamento) => departamento.creadoPorUsuario
    )
    departamentosCreados:Departamento[];// -> Solo admins pueden crear departamentos , asi que este campo en la mayoria solo lo tendran los admins que a su vez pertenecen al departamento de sistemas, esto quiere decir que tenemo

    @OneToMany(
        () => Sucursal,
        (sucursal) => sucursal.usuarioCreador
    )
    sucursalesCreadas:Sucursal[];

    @OneToMany(
        () => Categoria,
        (categoria) => categoria.usuarioCreador
    )
    categoriasCreadas:Categoria[];

    @OneToMany(
        () => Inventario,
        (inventario) => inventario.supervisor
    )
    inventarios:Inventario;

    @ManyToOne(
        () => Usuario,
        (usuario) => usuario.id,
        {nullable:true}
    )
    usuarioCreador:Usuario;

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