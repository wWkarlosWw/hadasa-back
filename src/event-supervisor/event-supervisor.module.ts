import { Module } from '@nestjs/common';
import { EventSupervisorService } from './event-supervisor.service';
import { EventSupervisorController } from './event-supervisor.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventSupervisorController],
  providers: [EventSupervisorService],
  exports: [EventSupervisorService],
})
export class EventSupervisorModule {}
