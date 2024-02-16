import { Provedor } from "src/provedores/entities/provedor.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Direccion{

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    calle:string;

    @Column()
    estado:string;

    @Column()
    ciudad:string;

    @Column()
    CP:string;

    @ManyToOne(
        () => Provedor,
        (provedor) => provedor.direcciones
    )
    provedor:Provedor;

};