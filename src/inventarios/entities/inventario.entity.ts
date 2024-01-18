import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export class Inventario {

    id:string;

    nombre_inventario:string;

    estatus:boolean;

    importe_ajustado:number;

    articulos_ajustados:number;

    articulos_contados:number;

    @CreateDateColumn()
    fecha_registro:Date;

    @UpdateDateColumn()
    fecha_actualizacion:Date;

};
