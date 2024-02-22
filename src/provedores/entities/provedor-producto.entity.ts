import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Provedor } from "./provedor.entity";
import { Producto } from "src/productos/entities/producto.entity";

@Entity()
export class ProvedorProducto{

    @PrimaryGeneratedColumn("uuid")
    id:string;


    @ManyToOne(
        () => Provedor,
        provedor => provedor.provedorProductos
    )
    provedor:Provedor;

    @ManyToOne(
        () => Producto,
        producto => producto.provedorProductos
    )
    producto:Producto;

    @Column({default:0,nullable:true})
    costo:number;

};