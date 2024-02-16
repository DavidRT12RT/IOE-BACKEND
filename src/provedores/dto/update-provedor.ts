import { PartialType } from '@nestjs/mapped-types';
import { CreateProvedorDto } from './create-provedor.dto';

export class UpdateProvedorDto extends PartialType(CreateProvedorDto) {}
