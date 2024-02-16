import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direccion } from './entities/direccion.entity';
import { CuentaBancaria } from './entities/cuenta-bancaria.entity';

@Module({
    imports:[
        ConfigModule,
        TypeOrmModule.forFeature([
            Direccion,
            CuentaBancaria
        ])
    ],
    exports:[
        TypeOrmModule
    ]
})
export class CommonModule {}
