import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonsModule } from './modules/persons/persons.module';
import { DbModule } from './common/db/db.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { SubscribersModule } from './modules/subscribers/subscribers.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { AdsModule } from './modules/ads/ads.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './common/auth/auth.module';
import { MasterCategoriesModule } from './modules/master-categories/master-categories.module';
import { SubCategoriesModule } from './modules/sub-categories/sub-categories.module';
import { ShippingChargesModule } from './modules/shipping-charges/shipping-charges.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SupplierRegistrationRequestsModule } from './modules/supplier-registration-requests/supplier-registration-requests.module';
import { MainCategoriesModule } from './modules/main-categories/main-categories.module';
import { FcmModule } from './modules/fcm/fcm.module';
import { ProductsUnverifiedModule } from './modules/products-unverified/products-unverified.module';
import { HttpErrorFilter } from './common/lib/logger-utils';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    DbModule,
    FcmModule,
    AdsModule,
    AuthModule,
    OrdersModule,
    CouponsModule,
    PersonsModule,
    ProductsModule,
    SuppliersModule,
    SubscribersModule,
    SubCategoriesModule,
    MainCategoriesModule,
    ShippingChargesModule,
    MasterCategoriesModule,
    ProductsUnverifiedModule,
    SupplierRegistrationRequestsModule
  ],
  controllers: [AppController],
  providers: [AppService, {
     provide: APP_FILTER,
    useClass: HttpErrorFilter
  }]
})
export class AppModule {}
