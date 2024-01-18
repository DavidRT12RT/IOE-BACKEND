import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUsuarioDto extends PartialType(CreateUserDTO) {
}