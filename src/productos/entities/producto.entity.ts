import { Usuario } from "src/auth/entities/usuario.entity";
import { Almacen } from "src/sucursales/entities/almacen.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Categoria } from "./categoria.entity";
import { InventarioDetalle } from "src/inventarios/entities/inventario-detalle.entity";
import { Inventario } from "src/inventarios/entities/inventario.entity";
import { ProductoAlmacen } from "./producto-almacen.entity";

@Entity()
export class Producto {

	@PrimaryGeneratedColumn("uuid")
	id:string;

	@Column()
	nombre:string;

	@Column()
	descripcion:string;

	@Column("text",{
		array:true,
		default:[],
		nullable:false
	})
	usos:string[];

	@Column({nullable:true})
	material:string;

	@Column({nullable:true})
	color:string;

	@Column("float")
	stock:number;

	@Column("float")
	stock_minimo:number;

	@Column("float")
	costo_promedio:number;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

	//Relaciones
	@ManyToOne(
		() => Usuario,
		(usuario) => usuario.productosCreados
	)
	usuarioCreador:Usuario;

	@OneToMany(
		() => ProductoAlmacen,
		(productoAlmacen) => productoAlmacen.producto
	)
	productosAlmacen:ProductoAlmacen[];

	@ManyToOne(
		() => Categoria,
		(categoria) => categoria.productos
	)
	categoria:Categoria;

	@OneToMany(
		() => InventarioDetalle,
		(detalle) => detalle.producto
	)
	detalles:InventarioDetalle[];


	@ManyToOne(
		() => Producto,
		producto => producto.modelos_secundarios,
		{nullable:true}

	)
	modelo_base?:Producto;

	@OneToMany(
		() => Producto,
		producto => producto.modelo_base,
		{nullable:true}
	)
	modelos_secundarios?:Producto[];

	//Metodo para calcular el stock total
	getStockTotal():number{
		return this.productosAlmacen.reduce(
			(total,productoAlmacen) => total + productoAlmacen.stock,0
		);
	}


}
