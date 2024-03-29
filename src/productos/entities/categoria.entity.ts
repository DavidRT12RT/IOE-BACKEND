import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Producto } from "./producto.entity";
import { Usuario } from "src/auth/entities/usuario.entity";

@Entity()
export class Categoria{

    @PrimaryGeneratedColumn("uuid")
    id:string; 

    @Column()
    nombre:string;

    @Column()
    descripcion:string;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

    //Relaciones
    @OneToMany(
        () => Producto,
        (producto) => producto.categoria
    )
    productos:Producto[];

	@ManyToOne(
		() => Usuario,
		(usuario) => usuario.categoriasCreadas
	)
	usuarioCreador:Usuario;

    @ManyToOne(
        () => Categoria,
        categoria => categoria.categorias_hija,
        {nullable:true}
    )
    categoria_padre?:Categoria;

    @OneToMany(
        () => Categoria,
        (categoria) => categoria.categoria_padre,
        {nullable:true}
    )
    categorias_hija?:Categoria;


};