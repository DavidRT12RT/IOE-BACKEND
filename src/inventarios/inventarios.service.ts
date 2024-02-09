import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { DataSource, Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { ProductosService } from 'src/productos/productos.service';
import { InventarioDetalle } from './entities/inventario-detalle.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Producto } from 'src/productos/entities/producto.entity';
import { CategoriasService } from 'src/productos/categorias.service';
import { UpdateInventarioDetalleDto } from './dto/update-inventario-detalle.dto';
import { UsuariosService } from 'src/auth/services/usuarios.service';
import { SucursalService } from 'src/sucursales/sucursales.service';

@Injectable()
export class InventariosService {

    constructor(
        @InjectRepository(Inventario)
        private readonly inventarioRepository:Repository<Inventario>,

        @InjectRepository(InventarioDetalle)
        private readonly inventarioDetalleRepository:Repository<InventarioDetalle>,

        @InjectRepository(Producto)
        private readonly productoRepository:Repository<Producto>,

        private readonly usuariosService:UsuariosService,

        private readonly productosService:ProductosService,

        private readonly sucursalService:SucursalService,

		private readonly dataSource:DataSource,
    ){}

    async findAllInventarios(
        paginationDto?:PaginationDto
    ):Promise<{inventarios:Inventario[]}>{

        const inventarios = await this.inventarioRepository.createQueryBuilder("inventarios")
        .leftJoinAndSelect("inventarios.detalles","detalles")
        .leftJoinAndSelect("detalles.producto","producto")
        .leftJoinAndSelect("inventarios.supervisor","supervisor")
        .skip(paginationDto.offset)
        .limit(paginationDto.limit)
        .getMany();
        

        return {
            inventarios
        };
    }

    async findOneInventarioById(
        id:string,
    ):Promise<{inventario:Inventario}>{

        const inventario = await this.inventarioRepository.createQueryBuilder("inventario")
        .leftJoinAndSelect("inventario.detalles","detalles")
        .leftJoinAndSelect("detalles.producto","producto")
        .leftJoinAndSelect("producto.categoria","categoria")
        .leftJoinAndSelect("inventario.supervisor","supervisor")
        .where("inventario.id = :id",{id})
        .getOne();

        if(!inventario) throw new NotFoundException(`Ningun inventario con ese id encontrado ${id}`);

        return {
            inventario
        };

    }

    async create(createInventarioDto: CreateInventarioDto,user:Usuario) {

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

        try {

            const { sucursal:sucursalId } = createInventarioDto;
            const { sucursal } = await this.sucursalService.findOneById(sucursalId);

            const inventario = this.inventarioRepository.create({
                ...createInventarioDto,
                supervisor:user,
                sucursal,
                almacenes:sucursal.almacenes
            });

            let productos = [];
            switch (createInventarioDto.tipo_inventario) {
                case "categoria":
                    //Cargar todo los productos del inventario en la otra tabla inventario-detalle
                    const productosDB = await this.productoRepository.createQueryBuilder("producto")
                    .leftJoinAndSelect("producto.productosAlmacen","productosAlmacen")
                    .leftJoinAndSelect("productosAlmacen.almacen","almacen")
                    .leftJoinAndSelect("almacen.sucursal","sucursal")
                    .leftJoinAndSelect("producto.categoria","categoria")
                    .getMany();

                    productos = productosDB;
                    break;

                case "personalizado":
                    //Filtramos los productos que aun existen en la peticion y borramos los que no vinieron antes
                    const { productos:productosID } = createInventarioDto;
                    for(const productoID of productosID){
                        const { producto } = await this.productosService.findOneProductoById(productoID);
                        productos.push(producto);
                    }
                    break
                default:
                    break;
            }


            //asociar detalles al inventario 
            inventario.detalles = productos.map(producto => this.inventarioDetalleRepository.create({
                cantidad_contada:0,
                producto,
            }));
            
            await this.inventarioRepository.save(inventario);

            await queryRunner.commitTransaction();


            return {
                message:"Inventario creado con exito!",
                inventario
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(`Error en el servidor al crear el inventario!`);
        } finally{
            await queryRunner.release();
        }
    }


    async update(
        id:string,
        updateInventarioDto:UpdateInventarioDto,
        user:Usuario
    ):Promise<{message:string;inventario:Inventario} | {}>{

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

        try {

            //Obtener el inventario existe
            const { inventario } = await this.findOneInventarioById(id);
            
            //Actualizamos el supervisor del inventario
            if(updateInventarioDto.supervisor){
                const { usuario:supervisor } = await this.usuariosService.findOneUserById(updateInventarioDto.supervisor);
                inventario.supervisor  = supervisor;
            }

            //Actualizamos propiedades generales del inventario
            inventario.estatus = updateInventarioDto?.estatus || inventario.estatus;
            inventario.nombre_inventario = updateInventarioDto.nombre_inventario || inventario.nombre_inventario;


            //Si viene el tipo de inventario actualizamos el tipo de inventario y los productos 
            // // if(updateInventarioDto.tipo_inventario){

            //     inventario.tipo_inventario = updateInventarioDto.tipo_inventario; 

            //     let productos:Producto[] = [];

            //     if(updateInventarioDto.tipo_inventario === "categoria"){

            //             await this.inventarioDetalleRepository.delete({inventario});

            //             //Cargar los nuevos productos de la nueva categoria 
            //             const { productos:productosDB } = await this.productosService.findProductosByCategory(updateInventarioDto.categoria);
            //             productos = productosDB;

            //     }

            //     if(updateInventarioDto.tipo_inventario === "personalizado"){

            //         if(updateInventarioDto.productos.length === 0){
            //             throw new BadRequestException(`No puedes actualizar un inventario a 0 productos!`);
            //         }

            //         const productosIds: string[] = updateInventarioDto.productos;

            //         // Obtener los IDs de los productos existentes en el inventario
            //         const productosEnInventarioIds: string[] = inventario.detalles.map((detalle) => detalle.producto.id);

            //         // Filtrar los IDs de los nuevos productos para obtener solo los que no están en el inventario existente
            //         const nuevosProductosIds: string[] = productosIds.filter(
            //             (productoId) => !productosEnInventarioIds.includes(productoId)
            //         );

            //         // Elimina relaciones con productos que no vinieron en el request
            //         const productosAQuitar: InventarioDetalle[] = inventario.detalles.filter(
            //             (detalle) => !productosIds.includes(detalle.producto.id)
            //         );

            //         await Promise.all(
            //             productosAQuitar.map(async (detalle) => {
            //                 await this.inventarioDetalleRepository.remove(detalle);
            //             })
            //         );

            //         // Cargar todos los productos nuevos que el usuario eligió y que no estaban en el inventario existente
            //         for (const productoId of nuevosProductosIds) {
            //             const { producto } = await this.productosService.findOneProductoById(productoId);
            //             productos.push(producto);
            //         }
            //     }

            //     //Asociar los nuevos tipos de productos
            //     inventario.detalles = productos.map(producto => this.inventarioDetalleRepository.create({
            //         cantidad_contada:0,
            //         producto,
            //     }));
            // }
           
            // Guardamos la nueva informacion del inventario
            await this.inventarioRepository.save(inventario);
            await queryRunner.commitTransaction();

            return {
                message:"Inventario actualizado con exito",
                inventario
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(`Error al actualizar el inventario`);
        } finally {
            await queryRunner.release();
        }

    }

    async findOneInventarioDetalleById(id:string){

        const inventarioDetalle = await this.inventarioDetalleRepository.findOneBy({id});

        if(!inventarioDetalle) throw new NotFoundException(`El inventario detalle con el id ${id} no existe!`);


        return {
            inventarioDetalle
        }

    }

    async updateInventarioDetalle(
        inventarioId:string,
        detalleId:string,
        updateInventarioDetalleDto:UpdateInventarioDetalleDto,
        user:Usuario
    ){
        const { inventarioDetalle } = await this.findOneInventarioDetalleById(detalleId);

        inventarioDetalle.cantidad_contada = updateInventarioDetalleDto.cantidad_contada;
        inventarioDetalle.usuarioCapturador = user;

        await this.inventarioDetalleRepository.save(inventarioDetalle);

        return {
            message:"El inventario detalle fue actualizado con exito!",
            inventarioDetalle
        };

    }


}
