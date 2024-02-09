import { Usuario } from "src/auth/entities/usuario.entity";
import { Categoria } from "src/productos/entities/categoria.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InventarioDetalle } from "./inventario-detalle.entity";
import { Sucursal } from "src/sucursales/entities/sucursal.entity";
import { Almacen } from "src/sucursales/entities/almacen.entity";

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

    // @OneToOne(
    //     () => Categoria,
    //     (categoria) => categoria.id
    // )
    // jerarquia:Categoria;

    @Column()
    tipo_inventario:string;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

    @ManyToOne(
        () => Usuario,
        usuario => usuario.inventarios
    )
    supervisor:Usuario;

    @OneToMany(
        () => InventarioDetalle,
        detalle => detalle.inventario,
        {cascade:true}
    )
    detalles:InventarioDetalle[];

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


    @BeforeInsert()
    checkFields(){
        this.nombre_inventario = this.nombre_inventario.toUpperCase();
    }


};
