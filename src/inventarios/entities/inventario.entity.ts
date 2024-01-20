import { Usuario } from "src/auth/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Inventario {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    nombre_inventario:string;

    @Column({type:"bool",default:true})
    estatus:boolean;

	@Column("float",{default:0})
    importe_ajustado:number;

    @Column({type:"number",default:0})
    articulos_ajustados:number;

    @Column({type:"number",default:0})
    articulos_contados:number;

    @Column()
    jerarquia:string;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

    @ManyToOne(
        () => Usuario,
        usuario => usuario.inventarios
    )
    supervisor:Usuario;


};
