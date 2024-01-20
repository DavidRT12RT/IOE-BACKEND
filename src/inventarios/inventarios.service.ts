import { Injectable } from '@nestjs/common';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { DataSource, Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/auth/entities/usuario.entity';

@Injectable()
export class InventariosService {

    constructor(
        @InjectRepository(Inventario)
        private readonly inventarioRepository:Repository<Inventario>,

		private readonly dataSource:DataSource,
    ){}

    async create(createInventarioDto: CreateInventarioDto,user:Usuario) {

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

        try {

            createInventarioDto.nombre_inventario = createInventarioDto.nombre_inventario.toUpperCase();

            let inventario = this.inventarioRepository.create({
                ...createInventarioDto,
                supervisor:user
            });
            inventario = await this.inventarioRepository.save(inventario);

            //Cargar todo los productos del inventario en la otra tabla inventario-detalle
            switch (createInventarioDto.jerarquia) {
                case "categoria":
                    
                    break;
                
                default:
                    break;
            }

            await queryRunner.commitTransaction();


            return {
                message:"Inventario creado con exito!",
                inventario
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally{
            await queryRunner.release();
        }

    }

    findAll() {
        return `This action returns all inventarios`;
    }

}
