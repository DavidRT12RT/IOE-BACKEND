import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { DataSource, Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { ProductosService } from 'src/productos/productos.service';
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
        .leftJoinAndSelect("inventarios.supervisor","supervisor")
        .leftJoinAndSelect("inventarios.productos","productos")
        .leftJoinAndSelect("productos.categoria","categoria")
        .leftJoinAndSelect("inventarios.sucursal","sucursal")
        .leftJoinAndSelect("sucursal.almacenes","almacenes")
        // .skip(paginationDto.offset)
        // .limit(paginationDto.limit)
        .getMany();
        

        return {
            inventarios
        };
    }

    async findOneInventarioById(
        id:string,
    ):Promise<{inventario:Inventario}>{

        const inventario = await this.inventarioRepository.createQueryBuilder("inventario")
        .leftJoinAndSelect("inventario.auxiliares","auxiliares")
        .leftJoinAndSelect("inventario.sucursal","sucursal")
        .leftJoinAndSelect("inventario.productos","productos")
        .leftJoinAndSelect("productos.categoria","categoria")
        .leftJoinAndSelect("sucursal.almacenes","almacenes")
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

            const { sucursal:sucursalId,categoria } = createInventarioDto;

            //Sucursales y almacenes
            const { sucursal } = await this.sucursalService.findOneById(sucursalId);

            const inventario = this.inventarioRepository.create({
                ...createInventarioDto,
                supervisor:user,
                sucursal,
                almacenes:sucursal.almacenes,
                auxiliares:[],
                productos:[]
            });

            let detalles = [];
            let productos = [];
            switch (createInventarioDto.tipo_inventario) {
                case "categoria":

                    //Cargar todo los productos del inventario en la otra tabla inventario-detalle
                    const productosDB = await this.productoRepository.createQueryBuilder("producto")
                    .leftJoinAndSelect("producto.categoria","categoria")
                    .leftJoinAndSelect("producto.productosAlmacen","productosAlmacen")
                    .leftJoinAndSelect("productosAlmacen.almacen","almacen")
                    .leftJoinAndSelect("almacen.sucursal","sucursal")
                    .where("sucursal.id = :sucursalId",{sucursalId:sucursal.id})
                    .andWhere("categoria.id = :categoriaId",{categoriaId:categoria})
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

            //Crear detalles del invetario por cada producto en cada almacen de la sucursal
            for(const producto of productos){

                const detalle = {productoId:producto.id,almacenes:[] };
                for(const almacen of sucursal.almacenes){
                    detalle.almacenes.push({almacenId:almacen.id,cantidad_contada:0});
                }
                detalles.push(detalle);

            }

            //Asociar productos y detalles
            inventario.productos = productos;
            inventario.detalles = detalles;

            //Asociar auxiliares del inventario
            const usuariosAuxiliares:Usuario[] = [];
            for(const usuarioID of createInventarioDto.auxiliares){
                const { usuario } = await this.usuariosService.findOneUserById(usuarioID);
                usuariosAuxiliares.push(usuario);
            }
            inventario.auxiliares = usuariosAuxiliares;
            
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

            //Actualizamos informacion basica
            inventario.descripcion = updateInventarioDto.descripcion || inventario.descripcion;
            inventario.nombre_inventario = updateInventarioDto.nombre_inventario || inventario.nombre_inventario;
            
            //Actualizamos el supervisor del inventario
            if(updateInventarioDto.supervisor){
                const { usuario:supervisor } = await this.usuariosService.findOneUserById(updateInventarioDto.supervisor);
                inventario.supervisor = supervisor; //Asignamos a el nuevo supervisor
            }

            //Actualizamos los auxiliares que vienen
            if(updateInventarioDto.auxiliares){
                const usuariosAuxiliares:Usuario[] = [];
                for(const usuarioID of updateInventarioDto.auxiliares){
                    const { usuario } = await this.usuariosService.findOneUserById(usuarioID);
                    usuariosAuxiliares.push(usuario);
                }
                inventario.auxiliares = usuariosAuxiliares;
            }

            //Actualizamos los detalles del inventario
            if(updateInventarioDto.detalles){
                for(const detalleUpdated of updateInventarioDto.detalles){
                    inventario.detalles = inventario.detalles.map(detalleDB => {
                        if(detalleDB.productoId === detalleUpdated.productoId){
                            detalleDB.almacenes = detalleUpdated.almacenes;
                        }
                        return detalleDB;
                    });
                }
            }

            if(updateInventarioDto.estatus){
                inventario.estatus = updateInventarioDto.estatus;
                inventario.articulos_contados = inventario.productos.length;
            }

            // Guardamos la nueva informacion del inventario
            await this.inventarioRepository.save(inventario);
            await queryRunner.commitTransaction();

            return {
                message:"Inventario actualizado con exito",
                inventario
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            throw new InternalServerErrorException(`Error al actualizar el inventario`);
        } finally {
            await queryRunner.release();
        }

    }



}
