import { Controller, Post, Body, Get, Query, Patch } from '@nestjs/common/';
import { AuthService } from './auth.service';
import {
  AuthDto,
  ChangePasswordDto,
  ConfirmDto,
  ForgotPasswordDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authServise: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authServise.signup(dto);
  }

  @Get('confirm')
  confirm(@Query() query: ConfirmDto) {
    // this.authServise.confirm(query);
    return this.authServise.confirm(query);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authServise.signin(dto);
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authServise.forgotPassword(dto);
  }

  @Patch('changePassword')
  // @UseGuards()
  async changePassword(@Body() dto: ChangePasswordDto) {
    return this.authServise.changePassword(dto);
  }
}
