import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Salida } from './entities/salida.entity';
import { Repository } from 'typeorm';
import { CreateSalidaDto } from './dto/create-salida.dto';
import { handleDBErrors } from 'src/common/helpers/db_errors';
import { ProductoAlmacen } from 'src/productos/entities/producto-almacen.entity';
import { Almacen } from 'src/sucursales/entities/almacen.entity';

export enum TipoAjuste {
    RESTAR = "RESTAR",
    SUMAR = "SUMAR",
};

export interface AjusteAlmacen {
    productoId:string;
    origen:string;
    destinatario:string;
    cantidad:number;
    tipoAjuste:TipoAjuste
};

@Injectable()
export class SalidasService {

    constructor(
        @InjectRepository(Salida)
        private readonly salidaRepository:Repository<Salida>,

        @InjectRepository(ProductoAlmacen)
        private readonly productoAlmacenRepository:Repository<ProductoAlmacen>,
    ){}

    async createSalida(createSalidaDto:CreateSalidaDto){

        try {
            const { detalles } = createSalidaDto;

            const nuevaSalida = this.salidaRepository.create({
                ...createSalidaDto,
            });

            const salida = await this.salidaRepository.save(nuevaSalida);

            const promises = [];
            for(const detalle of detalles){
                
                //Buscar el origen y restarle la cantidad
                const productoAlmacenOrigen = await this.productoAlmacenRepository.createQueryBuilder("productoAlmacenOrigen")
                .leftJoinAndSelect("productoAlmacenOrigen.almacen","almacen")
                .leftJoinAndSelect("productoAlmacenOrigen.producto","producto")
                .andWhere("productoAlmacenOrigen.almacen = :id",{id:nuevaSalida.origen})
                .where("productoAlmacenOrigen.producto = :id",{id:detalle.productoId})
                .getOne();

                if (!productoAlmacenOrigen) throw new NotFoundException(`Producto no encontrado en el almacén`);

                productoAlmacenOrigen.stock -= detalle.cantidad;

                promises.push(this.productoAlmacenRepository.save(productoAlmacenOrigen));

                //Buscar el destinatario y sumarle la cantidad
                const productoAlmacenDestinatario = await this.productoAlmacenRepository.createQueryBuilder("productoAlmacenDestinatario")
                .leftJoinAndSelect("productoAlmacenDestinatario.almacen","almacen")
                .leftJoinAndSelect("productoAlmacenDestinatario.producto","producto")
                .andWhere("productoAlmacenDestinatario.almacen = :id",{id:nuevaSalida.destinatario})
                .where("productoAlmacenDestinatario.producto = :id",{id:detalle.productoId})
                .getOne();

                if (!productoAlmacenDestinatario) throw new NotFoundException(`Producto no encontrado en el almacén`);

                productoAlmacenDestinatario.stock = productoAlmacenDestinatario.stock + detalle.cantidad;

                promises.push(this.productoAlmacenRepository.save(productoAlmacenDestinatario));

            }

            await Promise.all(promises);


            return {
                message:"Salida creada con exito!",
                salida
            };

        } catch (error) {
            console.log(error);
            return handleDBErrors(error);
        }

    }

};
