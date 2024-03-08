import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Origen {

    @PrimaryGeneratedColumn("uuid")
    id:string;

};