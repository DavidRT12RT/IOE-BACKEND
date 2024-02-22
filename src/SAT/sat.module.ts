import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClavesSat } from './entities/claves-sat.entity';
import { UnidadMedidaSat } from './entities/unidad-medida-sat.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { SatController } from "./sat.controller";
import { SatService } from "./sat.service";

@Module({
    imports:[
        Producto,
        TypeOrmModule.forFeature([
            ClavesSat,
            UnidadMedidaSat
        ])
    ],
    exports:[
        TypeOrmModule,
        SatService,
        TypeOrmModule
    ],
    controllers:[
        SatController
    ],
    providers:[
        SatService
    ]
})
export class SatModule {}
