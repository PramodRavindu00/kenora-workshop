import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserRole } from '../../generated/prisma/enums';
import { CurrentUserType } from '../common/constants/constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { WorkshopQueryDto } from './dto/workshop-query.dto';
import { WorkshopService } from './workshop.service';

@Controller('workshop')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Post()
  @Roles([UserRole.MANAGER])
  create(
    @Body() dto: CreateWorkshopDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.workshopService.create(dto, user);
  }

  @Get()
  @Roles([UserRole.MANAGER, UserRole.STAFF])
  getAll(@Query() query: WorkshopQueryDto) {
    return this.workshopService.getAll(query);
  }

  @Get(':id')
  @Roles([UserRole.MANAGER, UserRole.STAFF])
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.workshopService.getById(id);
  }

  @Patch(':id')
  @Roles([UserRole.MANAGER])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkshopDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.workshopService.update(id, dto, user);
  }

  @Patch(':id/cancel')
  @Roles([UserRole.MANAGER])
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.workshopService.cancel(id, user);
  }

  @Patch(':id/complete')
  @Roles([UserRole.MANAGER])
  complete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.workshopService.complete(id, user);
  }
}
