import { Module } from '@nestjs/common';
import { ClaimedDiscountService } from './claimed-discount.service';
import { ClaimedDiscountController } from './claimed-discount.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClaimedDiscountController],
  providers: [ClaimedDiscountService],
  exports: [ClaimedDiscountService],
})
export class ClaimedDiscountModule {}
