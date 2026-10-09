import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserType } from '../common/constants/constants';
import { LoginDto } from './dto/login.dto';
import { PublicRoute } from '../common/decorators/public-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  @PublicRoute()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('/logout')
  logout() {}

  @Get('/me')
  getCurrentUser(@CurrentUser() user: CurrentUserType) {
    return user;
  }
}
