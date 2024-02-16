import { Module } from '@nestjs/common';
import { ProvedoresService } from './provedores.service';
import { ProvedoresController } from './provedores.controller';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provedor } from './entities/provedor.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports:[
        ConfigModule,
        AuthModule,
        TypeOrmModule.forFeature([
            Provedor
        ]),
        CommonModule
    ],
    controllers: [ProvedoresController],
    providers: [ProvedoresService],
})
export class ProvedoresModule {}
