import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClavesSat {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    clave:string;
    
    @Column()
    tipo:string;

    @Column()
    nombre:string;

    @OneToMany(
        () => Producto,
        (producto) => producto.claveSat
    )
    productos:Producto[];

};