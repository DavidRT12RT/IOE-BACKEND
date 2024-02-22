import { Producto } from "src/productos/entities/producto.entity";
import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UnidadMedidaSat{

    @PrimaryGeneratedColumn("uuid")
    id:string;

    unidad:string;

    descripcion:string;

    @OneToMany(
        () => Producto,
        (producto) => producto.unidadMedidaSat
    )
    productos:Producto[];

};