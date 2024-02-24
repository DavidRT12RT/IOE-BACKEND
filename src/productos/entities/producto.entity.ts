import { Usuario } from "src/auth/entities/usuario.entity";
import { AfterInsert, AfterUpdate, BeforeInsert, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Repository, UpdateDateColumn } from "typeorm";
import { Categoria } from "./categoria.entity";
import { ProductoAlmacen } from "./producto-almacen.entity";
import { Inventario } from "src/inventarios/entities/inventario.entity";
import { ProvedorProducto } from "src/provedores/entities/provedor-producto.entity";
import { Marca } from "./marca.entity";
import { ClavesSat } from "src/SAT/entities/claves-sat.entity";
import { UnidadMedidaSat } from "src/SAT/entities/unidad-medida-sat.entity";

export enum UnidadCompra {
	PIEZA = "PIEZA",
	CAJA = "CAJA",
	PAQUETE = "PAQUETE"
};

export enum UnidadVenta {
	PIEZA = "PIEZA",
	CAJA = "CAJA",
	PAQUETE = "PAQUETE"
};

export enum MetodoReabasto {
	FIJO = "FIJO",
	RESURTIBLE = "RESURTIBLE"
};

export enum Estatus {
	ACTIVO = "ACTIVO",
	"NO ACTIVO" = "NO ACTIVO"
};

@Entity()
export class Producto {

	@PrimaryGeneratedColumn("uuid")
	id:string;

	@Column({nullable:true})
	SKU:string;

	@Column()
	nombre:string;

	@Column()
	descripcion:string;

	@Column({
		enum:Estatus,
		default:Estatus.ACTIVO
	})
	estatus:Estatus;

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

	// @ManyToOne(
	// 	() => Marca,
	// 	(marca) => marca.productos
	// )
	// marca:Marca;

	@Column("float",{default:0})
	stock:number;

	@Column("float")
	stock_minimo:number;

	@Column("float",{nullable:true,default:1})
	dias_reabasto:number;

	@Column("float",{nullable:true})
	costo_promedio:number;

	@Column({
		type:"enum",
		enum:UnidadCompra,
		default:UnidadCompra.PIEZA
	})
	unidad_compra:UnidadCompra;

	@Column({
		type:"enum",
		enum:UnidadVenta,
		default:UnidadVenta.PIEZA
	})
	unidad_venta:UnidadVenta;

	@Column({
		type:"enum",
		enum:MetodoReabasto,
		default:MetodoReabasto.FIJO
	})
	metodo_reabasto:MetodoReabasto;

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

	@OneToMany(
		() => ProvedorProducto,
		(provedorProducto) => provedorProducto.producto
	)
	provedorProductos:ProvedorProducto[];

	@Column({
		type:"jsonb",
		nullable:true,
		default:() => "'{}'"

	})
	detalles:Record<string,any>;

	//SAT
	@ManyToOne(
		() => ClavesSat,
		(clavesSat) => clavesSat.productos
	)
	claveSat:ClavesSat;

	@ManyToOne(
		() => UnidadMedidaSat,
		(unidadMedidaSat) => unidadMedidaSat.productos
	)
	unidadMedidaSat:UnidadMedidaSat;

	// Método para calcular el stock total
  	getStockTotal(): number {
		console.log("Entramos a calcular esto");
      	// return this.productosAlmacen.reduce((total, productoAlmacen) => total + productoAlmacen.stock,0);
		return 20;
  	}

	calcularCostoPromedio():number {
		let costoTotal = 0;
		for(const provedorProducto of this.provedorProductos){
			costoTotal += provedorProducto.costo;
		}
		return (costoTotal / this.provedorProductos.length);
	}
}
