import { Module } from '@nestjs/common';
import { ProvedoresService } from './provedores.service';
import { ProvedoresController } from './provedores.controller';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provedor } from './entities/provedor.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProvedorProducto } from './entities/provedor-producto.entity';

@Module({
    imports:[
        ConfigModule,
        AuthModule,
        TypeOrmModule.forFeature([
            Provedor,
            ProvedorProducto
        ]),
        CommonModule
    ],
    controllers: [ProvedoresController],
    providers: [ProvedoresService],
    exports:[
        TypeOrmModule,
        ProvedoresService
    ]
})
export class ProvedoresModule {}
