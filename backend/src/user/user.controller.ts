import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserRole } from '../../generated/prisma/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { CurrentUserType } from '../common/constants/constants';

@Controller('user')
@Roles([UserRole.ADMIN])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.userService.createUser(createUserDto, user);
  }

  

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.userService.updateUser(id, updateUserDto, user);
  }

  @Patch(':id/deactivate')
  async deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.userService.deactivateUser(id, user);
  }
}
