import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UnidadMedidaSat{

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    unidad:string;
   

    @Column()
    descripcion:string;

    @OneToMany(
        () => Producto,
        (producto) => producto.unidadMedidaSat
    )
    productos:Producto[];

};