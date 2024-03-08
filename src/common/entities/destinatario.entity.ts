import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Destinatario {

    @PrimaryGeneratedColumn("uuid")
    id:string;

};