import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('donation')
@UseGuards(JwtAuthGuard)
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  create(
    @Body() createDonationDto: CreateDonationDto,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.donationService.create(createDonationDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string; role: string }) {
    return this.donationService.findAll(user.userId, user.role);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.donationService.findOne(id, user.userId, user.role);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERVISOR', 'ADMIN')
  approve(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.donationService.approve(id, user.userId);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERVISOR', 'ADMIN')
  reject(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.donationService.reject(id, user.userId);
  }
}
