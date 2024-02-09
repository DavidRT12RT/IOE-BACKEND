import { Usuario } from "src/auth/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Almacen } from './almacen.entity';
import { Inventario } from "src/inventarios/entities/inventario.entity";

@Entity()
export class Sucursal {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    zona:string;

    @Column()
    ciudad:string;
    
    @Column()
    calle:string;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

    @OneToMany(
        () => Inventario,
        inventario => inventario.sucursal
    )
    inventarios:Inventario[];

    @ManyToOne(
        () => Usuario,
        (usuario) => usuario.sucursalesCreadas
    )
    usuarioCreador:Usuario; 

    @OneToMany(
        () => Almacen,
        (almacen) => almacen.sucursal
    )
    almacenes:Almacen[];


};
