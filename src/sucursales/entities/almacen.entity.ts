import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Sucursal } from "./sucursal.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { ProductoAlmacen } from "src/productos/entities/producto-almacen.entity";

@Entity()
export class Almacen{
    
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

    @OneToMany(
        () => ProductoAlmacen,
        (productoAlmacen) => productoAlmacen.almacen
    )
	productosAlmacen:ProductoAlmacen[];

};