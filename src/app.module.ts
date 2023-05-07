import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { FavoritesController } from './favorites/favorites.controller';
import { FavoritesModule } from './favorites/favorites.module';
import { MovieModule } from './movie/movie.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    MovieModule,
    FavoritesModule,
    MailModule,
  ],
  controllers: [FavoritesController],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
