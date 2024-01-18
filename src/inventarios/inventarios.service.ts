import { Injectable } from '@nestjs/common';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Injectable()
export class InventariosService {

     create(createInventarioDto: CreateInventarioDto) {
        return 'This action adds a new inventario';
    }

    findAll() {
        return `This action returns all inventarios`;
    }

}
