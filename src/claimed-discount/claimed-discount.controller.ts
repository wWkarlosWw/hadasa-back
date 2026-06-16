import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ClaimedDiscountService } from './claimed-discount.service';
import { CreateClaimedDiscountDto } from './dto/create-claimed-discount.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('claimed-discount')
@UseGuards(JwtAuthGuard)
export class ClaimedDiscountController {
  constructor(
    private readonly claimedDiscountService: ClaimedDiscountService,
  ) {}

  @Post()
  create(
    @Body() createClaimedDiscountDto: CreateClaimedDiscountDto,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.claimedDiscountService.create(
      createClaimedDiscountDto,
      user.userId,
    );
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string; role: string }) {
    return this.claimedDiscountService.findAll(user.userId, user.role);
  }
}
