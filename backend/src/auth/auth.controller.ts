import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUserDto';
import { UsersService } from 'src/users/users.service';
import { signUpDto } from './dto/signUpDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { BalanceService } from '../balance/balance.service';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
    private balanceService: BalanceService,
  ) {}

  @Post('signup')
  async signUp(@Body() registrationUserDto: CreateUserDto) {
    const existingUser = await this.userService.findOne({
      where: { email: registrationUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    // Create the user
    const user = await this.userService.create(registrationUserDto);

    // Create the balance for the user
    await this.balanceService.create({ balance: 0 }, user);

    // Remove the password from the response

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return {
      success: true,
      data: result,
    };
  }

  @Post('signin')
  async signIn(@Body() signInUserDto: signUpDto) {
    const user = await this.userService.findOne({
      where: { email: signInUserDto.email },
    });
    const isMatch = await bcrypt.compare(signInUserDto.password, user.password);
    if (!user) throw new UnauthorizedException('Invalid username or password');

    if (!isMatch)
      throw new UnauthorizedException('Invalid username or password');

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { ...user, accessToken };
  }

  @UseGuards(AuthGuard)
  @Get('lol')
  lol(@Req() req: Request) {
    console.log(req);

    return 'lol';
  }
}
