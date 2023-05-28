import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { VerifyTokenMiddleware } from './middlewares/verifytoken.middleware';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_MONGODB_URI),
    UserModule,
    AuthModule,
    PostModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(
        { path: 'post', method: RequestMethod.POST },
        { path: 'post/:id', method: RequestMethod.PATCH },
        { path: 'post/:id', method: RequestMethod.DELETE },
        { path: 'user/edit/picture', method: RequestMethod.PATCH },
        { path: 'user/update', method: RequestMethod.PATCH },
      );
  }
}
