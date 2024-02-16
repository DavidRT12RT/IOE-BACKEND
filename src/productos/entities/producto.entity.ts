import { Usuario } from "src/auth/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Repository, UpdateDateColumn } from "typeorm";
import { Categoria } from "./categoria.entity";
import { ProductoAlmacen } from "./producto-almacen.entity";
import { Inventario } from "src/inventarios/entities/inventario.entity";

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

	@Column("boolean",{default:true})
	inventariable:boolean;

	@Column("float",{default:1})
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
		(productoAlmacen) => productoAlmacen.producto,
	)
	productosAlmacen:ProductoAlmacen[];

	@ManyToMany(
		() => Inventario,
		(inventario) => inventario.productos
	)
	inventarios:Inventario[];

	@ManyToOne(
		() => Categoria,
		(categoria) => categoria.productos
	)
	categoria:Categoria;

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

	// Método para calcular el stock total
  	getStockTotal(): number {
		console.log("Entramos a calcular esto");
      	// return this.productosAlmacen.reduce((total, productoAlmacen) => total + productoAlmacen.stock,0);
		return 20;
  	}

}
