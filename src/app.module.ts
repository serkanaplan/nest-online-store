import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import  dbconfig  from './config/db.config';
import Product from './models/product/product.entity';
import { ProductsService } from './models/product/product.service';
import { AdminModule } from './admin/admin.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.modeule';
import { UsersService } from './models/user/users.service';
import { User } from './models/user/user.entity';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,load: [dbconfig],}),

    TypeOrmModule.forRootAsync({useFactory: async () =>  dbconfig(),}),
    
    TypeOrmModule.forFeature([Product,User]),
    
    AdminModule,
    AuthModule
  ],
  controllers: [AppController, ProductsController, AuthController],
  providers: [ProductsService,UsersService],
  exports: [ProductsService,UsersService],
})
export class AppModule { }
