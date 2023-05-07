import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const { hash, ...user } = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    return user;
  }

  async deleteUser(userId: number) {
    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
      return { message: 'User delited' };
    } catch (error) {
      throw new Error(error);
    }
  }
}
