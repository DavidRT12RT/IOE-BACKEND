import { Usuario } from "src/auth/entities/usuario.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Sucursal } from "src/sucursales/entities/sucursal.entity";
import { Almacen } from "src/sucursales/entities/almacen.entity";
import { Producto } from "src/productos/entities/producto.entity";

interface DetalleInventario {
    productoId:string;
    almacenes:{almacenId:string;cantidad_contada:number,fecha_registro?:Date;}[];
};

@Entity()
export class Inventario {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    nombre_inventario:string;

    @Column({nullable:true})
    descripcion:string;

    @Column("text",{array:true,default:[]})
    observaciones:string[];

    @Column({type:"bool",default:true})
    estatus:boolean;

	@Column("float",{default:0})
    importe_ajustado:number;

	@Column("float",{default:0})
    cantidad_total_articulos_ajustados:number;

    @Column({default:0})
    articulos_ajustados:number;

    @Column({default:0})
    articulos_contados:number;

    @Column()
    tipo_inventario:string;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

    @Column("jsonb",{nullable:true})
    detalles:DetalleInventario[];

    @ManyToOne(
        () => Usuario,
        usuario => usuario.inventarios
    )
    supervisor:Usuario;

    @ManyToOne(
        () => Sucursal,
        sucursal => sucursal.inventarios
    )
    sucursal:Sucursal;

    @ManyToMany(
        () => Almacen,
        almacen => almacen.inventarios
    )
    @JoinTable()
    almacenes:Almacen[];

    @ManyToMany(
        () => Producto,
        (producto) => producto.inventarios
    )
    @JoinTable()
    productos:Producto[];

    @OneToMany(
        () => Usuario,
        (usuario) => usuario.inventariosTrabajados
    )
    auxiliares:Usuario[];


    @BeforeInsert()
    checkFields(){
        this.nombre_inventario = this.nombre_inventario.toUpperCase();
    }


};
