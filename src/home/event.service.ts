import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { Events } from 'src/entities/Events';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
  ) {}

  async getEventDDay() {
    const now = moment().tz('Asia/Seoul');

    const nearestEvent = await this.eventsRepository
      .createQueryBuilder('event')
      .where("event.date > :now", { now: now.format('YYYY-MM-DD') })
      .orderBy('event.date', 'ASC')
      .getOne();

    if (!nearestEvent || !nearestEvent.date) {
      throw new Error('No future event found or event has no date');
    }

    // await this.eventsRepository.delete(nearestEvent.id);
    const date = nearestEvent.date;
    const eventDate = moment(nearestEvent.date, 'YYYY-MM-DD').tz('Asia/Seoul');
    const remainingDays = eventDate.diff(now, 'days');

    return {
      title: nearestEvent.title,
      date: date,
      dDay: remainingDays,
    };
  }
}
