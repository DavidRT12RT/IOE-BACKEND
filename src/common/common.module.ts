import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direccion } from './entities/direccion.entity';
import { CuentaBancaria } from './entities/cuenta-bancaria.entity';
import { Destinatario } from './entities/destinatario.entity';
import { Origen } from './entities/origen.entity';

@Module({
    imports:[
        ConfigModule,
        TypeOrmModule.forFeature([
            Direccion,
            CuentaBancaria,
            Destinatario,
            Origen
        ])
    ],
    exports:[
        TypeOrmModule
    ]
})
export class CommonModule {}
