import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Sucursal } from "./sucursal.entity";
import { ProductoAlmacen } from "src/productos/entities/producto-almacen.entity";
import { Inventario } from "src/inventarios/entities/inventario.entity";


import { Destinatario } from "src/common/entities/destinatario.entity";
import { Salida } from "src/salidas/entities/salida.entity";

@Entity()
export class Almacen extends Destinatario{
    
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    nombre:string;

    @Column()
    descripcion:string;

    @Column()
    tipo_almacen:string;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;
    
    //Relaciones
    @ManyToOne(
        () => Sucursal,
        (sucursal) => sucursal.almacenes
    )
    sucursal:Almacen;

    @ManyToMany(
        () => Inventario,
        inventario => inventario.almacenes
    )
    inventarios:Inventario[];

    @OneToMany(
        () => ProductoAlmacen,
        (productoAlmacen) => productoAlmacen.almacen
    )
	productosAlmacen:ProductoAlmacen[];

    @OneToMany(
        () => Salida,
        (salida) => salida.destinatario
    )
    salidas:Salida[];

};