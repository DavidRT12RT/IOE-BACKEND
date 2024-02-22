import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProvedorDto } from './dto/create-provedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Provedor } from './entities/provedor.entity';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { Direccion } from 'src/common/entities/direccion.entity';
import { CuentaBancaria } from 'src/common/entities/cuenta-bancaria.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProvedoresService {

    constructor(

		private readonly dataSource:DataSource,

        @InjectRepository(Provedor)
        private readonly provedorRepository:Repository<Provedor>,

        @InjectRepository(Direccion)
        private readonly direccionRepository:Repository<Direccion>,

        @InjectRepository(CuentaBancaria)
        private readonly cuentaBancariaRepository:Repository<CuentaBancaria>

    ){}

    async create(createProvedorDto: CreateProvedorDto,usuario:Usuario) {

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

        let { direcciones,cuentasBancarias,...toCreate } = createProvedorDto;

        try {
            let provedor = this.provedorRepository.create({
                ...toCreate,
                direcciones:[],
                cuentasBancarias:[]
            });

            provedor = await this.provedorRepository.save(provedor);

            if(direcciones){
                //Crear entidad direcciones
                direcciones.map(async(direccionDto) => {
                    let direccionDB = this.direccionRepository.create({
                        ...direccionDto,
                        provedor:provedor
                    });
                    direccionDB = await this.direccionRepository.save(direccionDB);
                    provedor.direcciones.push(direccionDB);
                })
            }

            if(cuentasBancarias){
                //Crear entidad cuentas bancarias
                cuentasBancarias.map(async(cuentaBancariaDto) => {
                    let cuentaBancariaDB= this.cuentaBancariaRepository.create({
                        ...cuentaBancariaDto,
                        provedor:provedor
                    });
                    cuentaBancariaDB = await this.cuentaBancariaRepository.save(cuentaBancariaDB);
                    provedor.cuentasBancarias.push(cuentaBancariaDB);
                });
            }

            await this.provedorRepository.save(provedor);
            await queryRunner.commitTransaction();


            return {
                message:"Provedor creado con exito!",
                provedor
            };
            
        } catch (error) {
            queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(`Error al crear el provedor`);
        } finally {
            queryRunner.release();
        }
    }


    async findAll(paginationDto:PaginationDto){

        const provedores = await this.provedorRepository.createQueryBuilder("provedores")
        .leftJoinAndSelect("provedores.direcciones","direcciones")
        .leftJoinAndSelect("provedores.cuentasBancarias","cuentasBancarias")
        .leftJoinAndSelect("provedores.provedorProductos","provedorProductos")
        .leftJoinAndSelect("provedorProductos.producto","producto")
        .leftJoinAndSelect("producto.categoria","categoria")
		.leftJoinAndSelect("producto.productosAlmacen","productosAlmacen")
		.leftJoinAndSelect("productosAlmacen.almacen","almacen")
        .getMany();


        return {
            provedores
        }

    }

    async findOneById(id:string){

        const provedor = await this.provedorRepository.createQueryBuilder("provedor")
        .leftJoinAndSelect("provedor.direcciones","direcciones")
        .leftJoinAndSelect("provedor.cuentasBancarias","cuentasBancarias")
        .leftJoinAndSelect("provedor.provedorProductos","provedorProductos")
        .leftJoinAndSelect("provedorProductos.producto","producto")
        .leftJoinAndSelect("producto.categoria","categoria")
		.leftJoinAndSelect("producto.productosAlmacen","productosAlmacen")
		.leftJoinAndSelect("productosAlmacen.almacen","almacen")
		.where("provedor.id = :id",{id})
        .getOne();

        if(!provedor) throw new NotFoundException(`Ningun provedor encontrado por el id ${id}`);

        return {
            provedor
        }
    }

}
