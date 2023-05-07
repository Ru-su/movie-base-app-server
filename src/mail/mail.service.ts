import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, url: any) {
    await this.mailerService.sendMail({
      to: 'jovani.torp24@ethereal.email',
      subject: 'Welcome to Movie App! Confirm your Email',
      template: 'confirmation',
      context: {
        name: user.fisrstName ?? user.email,
        url,
      },
    });
  }

  async sendPasswordRefresh(user: User, url: any) {
    await this.mailerService.sendMail({
      to: 'jovani.torp24@ethereal.email',
      subject: 'Password Refreshing Request',
      template: 'refreshing',
      context: {
        name: user.fisrstName ?? user.email,
        url: url,
      },
    });
  }
}
