import { Module } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from './entities/departamento.entity';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [
        DepartamentosController,
        RolesController
    ],
    providers: [
        DepartamentosService,
        RolesService
    ],
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([
            Departamento,
            Role   
        ])
    ],
    exports:[
        TypeOrmModule,
        DepartamentosService,
        RolesService
    ]
})
export class DepartamentosModule {}
