import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./producto.entity";

@Entity()
export class Marca {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    nombre:string;

    @OneToMany(
        () => Producto,
        (producto) => producto.marca
    )
    productos:Producto[];

};