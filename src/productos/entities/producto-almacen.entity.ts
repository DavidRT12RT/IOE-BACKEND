import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,} from "typeorm";
import { Producto } from './producto.entity';
import { Almacen } from "src/sucursales/entities/almacen.entity";

@Entity()
export class ProductoAlmacen{

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @ManyToOne(
        () => Producto,
        (producto) => producto.productosAlmacen,
        {onDelete:"CASCADE"}
    )
    producto:Producto;

    @ManyToOne(
        () => Almacen,
        (almacen) => almacen.productosAlmacen,
        {onDelete:"CASCADE"}
    )
    almacen:Almacen;

    @Column("float")
    stock:number;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

}