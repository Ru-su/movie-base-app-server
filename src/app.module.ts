import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
// import { FavoritesController } from './favorites/favorites.controller';
import { FavoritesModule } from './favorites/favorites.module';
import { MoviesModule } from './movies/movies.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    MoviesModule,
    FavoritesModule,
    MailModule,
  ],
  // controllers: [FavoritesController],
})
export class AppModule {}
