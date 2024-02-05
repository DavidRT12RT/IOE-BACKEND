import { AfterInsert, AfterUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Repository, UpdateDateColumn, getRepository } from "typeorm";
import { Producto } from './producto.entity';
import { Almacen } from "src/sucursales/entities/almacen.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Entity()
export class ProductoAlmacen{

    // constructor(
    //     @InjectRepository(Producto)
    //     private readonly productoRepository:Repository<Producto>
    // ){}

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @ManyToOne(
        () => Producto,
        (producto) => producto.productosAlmacen,
        {
            onDelete:"CASCADE"
        }
    )
    @JoinColumn({ name: "productoId" })
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

    // @AfterInsert()
    // @AfterUpdate()
    // async actualizarStock(): Promise<void> {
    //     const producto = await this.productoRepository.findOneBy({id:this.producto.id});
    //     if (producto) {
    //         producto.stock = producto.getStockTotal();
    //         await this.productoRepository.save(producto);
    //     }
    // }

}