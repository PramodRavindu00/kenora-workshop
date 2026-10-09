import { Injectable } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';


@Injectable()
export class RegistrationService {
  create(createRegistrationDto: CreateRegistrationDto) {
    return 'This action adds a new registration';
  }

  findAll() {
    return `This action returns all registration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registration`;
  }

 

  remove(id: number) {
    return `This action removes a #${id} registration`;
  }
}
