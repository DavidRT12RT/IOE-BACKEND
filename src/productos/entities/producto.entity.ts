import { Usuario } from "src/auth/entities/usuario.entity";
import { Almacen } from "src/sucursales/entities/almacen.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Categoria } from "./categoria.entity";

@Entity()
export class Producto {

	@PrimaryGeneratedColumn("uuid")
	id:string;

	@Column()
	nombre:string;

	@Column()
	descripcion:string;

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

	@ManyToOne(
		() => Usuario,
		(usuario) => usuario.productosCreados
	)
	usuarioCreador:Usuario;

	@ManyToOne(
		() => Almacen,
		(almacen) => almacen.productos
	)
	almacen:Almacen;

	@ManyToOne(
		() => Categoria,
		(categoria) => categoria.productos
	)
	categoria:Categoria;

}
