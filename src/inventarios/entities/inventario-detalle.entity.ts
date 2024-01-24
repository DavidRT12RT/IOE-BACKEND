import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Inventario } from "./inventario.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { Usuario } from "src/auth/entities/usuario.entity";
import { Almacen } from "src/sucursales/entities/almacen.entity";

@Entity()
export class InventarioDetalle {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({default:0})
    cantidad_contada:number;

    @UpdateDateColumn()
    fecha_captura:Date;

    //Relaciones
    @ManyToOne(
        () => Inventario,
        (inventario) => inventario.detalles
    )
    inventario:Inventario;
    
    @ManyToOne(
        () => Producto,
        (producto) => producto.detalles
    )
    producto:Producto;

    @ManyToOne(
        () => Usuario
    )
    usuarioCapturador:Usuario;

    @ManyToOne(
        () => Almacen
    )

    almacen:Almacen;

};
