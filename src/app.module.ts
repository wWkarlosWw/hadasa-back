import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { DiscountsModule } from './discounts/discounts.module';
import { DonationModule } from './donation/donation.module';
import { EventParticipationModule } from './event-participation/event-participation.module';
import { EventSupervisorModule } from './event-supervisor/event-supervisor.module';
import { ClaimedDiscountModule } from './claimed-discount/claimed-discount.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    OrganizationModule,
    EventModule,
    DiscountsModule,
    DonationModule,
    EventParticipationModule,
    EventSupervisorModule,
    ClaimedDiscountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
