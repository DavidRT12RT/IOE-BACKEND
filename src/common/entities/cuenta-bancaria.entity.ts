import { Provedor } from "src/provedores/entities/provedor.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CuentaBancaria {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    numero_cuenta:string;

    @Column()
    banco:string;

    @Column()
    tipo:string;
    
    @Column()
    CLABE:string;

    @ManyToOne(
        () => Provedor,
        provedor => provedor.cuentasBancarias
    )
    provedor:Provedor;

};