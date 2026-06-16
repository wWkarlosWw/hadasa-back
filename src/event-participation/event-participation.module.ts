import { Module } from '@nestjs/common';
import { EventParticipationService } from './event-participation.service';
import { EventParticipationController } from './event-participation.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventParticipationController],
  providers: [EventParticipationService],
  exports: [EventParticipationService],
})
export class EventParticipationModule {}
