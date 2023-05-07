import * as argon from 'argon2';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import {
  AuthDto,
  ChangePasswordDto,
  ConfirmDto,
  ForgotPasswordDto,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  private readonly serverUrl: string;
  readonly ERROR_MESSAGE = {
    P2002: 'Email is already registered',
  };

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {
    this.serverUrl = this.config.get('SERVER_URL') || 'http://localhost:8000';
  }

  async signup({ password, email }: AuthDto) {
    // add the hash
    const hash = await argon.hash(password);

    // save the user
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          hash,
          verificationStatus: false,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          verificationStatus: true,
        },
      });

      const token = this.getConfirmationToken();
      await this.saveToken(user, token);
      await this.sendConfirEmail(user, token);

      return this.signIn(user.id, user.email);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new ForbiddenException({
          statusCode: 401,
          message:
            this.ERROR_MESSAGE[error.code] || 'PrismaClientKnownRequestError',
          error: error.code,
        });
      }

      throw new Error(error);
    }
  }

  async signin({ password, email }: AuthDto) {
    // find user
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    // throw error
    if (!user) {
      throw new HttpException(
        {
          statusCode: 401,
          message: 'Account does not exist',
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!user.verificationStatus) {
      throw new HttpException(
        {
          statusCode: 401,
          message: 'Account is not verified',
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // compre pass
    const passMatches = await argon.verify(user.hash, password);
    // throw error
    if (!passMatches) {
      throw new HttpException(
        {
          statusCode: 401,
          message: 'Password incorrect',
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.signIn(user.id, user.email);
  }

  async signIn(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const options = {
      expiresIn: '20m',
      secret: this.config.get('JWT_SECRET'),
    };

    return {
      access_token: await this.jwt.signAsync(payload, options),
    };
  }

  private async saveToken(user, token) {
    try {
      const tok = await this.prisma.token.create({
        data: {
          userId: user.id,
          token: parseInt(token, 10),
        },
        select: {
          userId: true,
          token: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  private getConfirmationToken() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private async sendConfirEmail(user, token) {
    const confirmLink = `${this.serverUrl}/auth/confirm?token=${token}`;
    await this.mailService.sendUserConfirmation(user, confirmLink);
  }

  async confirm({ token }: ConfirmDto) {
    try {
      const confimedUser = await this.prisma.token.findUnique({
        where: {
          token: parseInt(token, 10),
        },
      });
      await this.prisma.token.delete({
        where: {
          token: parseInt(token, 10),
        },
      });
      const user = await this.prisma.user.update({
        where: {
          id: confimedUser.userId,
        },
        data: {
          verificationStatus: true,
        },
      });
      return this.signIn(user.id, user.email);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Token do not exist',
          error: 'Not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    console.log(email);
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Account does not exist',
          error: 'Not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const token = this.getConfirmationToken();
    await this.saveToken(user, token);
    console.log(11);
    await this.sendchangePasswordEmail(user, token);
  }

  private async sendchangePasswordEmail(user, token) {
    console.log(12);
    const refreshLink = `${this.serverUrl}/auth/changePassword?token=${token}`;
    await this.mailService.sendPasswordRefresh(user, refreshLink);
  }

  async changePassword({ password, token }: ChangePasswordDto) {
    try {
      const changedPasswordUser = await this.prisma.token.findUnique({
        where: {
          token: parseInt(token, 10),
        },
      });
      await this.prisma.token.delete({
        where: {
          token: parseInt(token, 10),
        },
      });
      const hash = await argon.hash(password);
      const user = await this.prisma.user.update({
        where: {
          id: changedPasswordUser.userId,
        },
        data: {
          hash,
        },
      });
      return this.signIn(user.id, user.email);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Token do not exist',
          error: 'Not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
