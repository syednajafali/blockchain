import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from './price.entity';
import axios from 'axios';
import { MailService } from './mail.service';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private mailService: MailService, // Inject MailService
  ) {}

  async fetchAndSavePrices() {
    const prices = await this.fetchPrices();

    for (const [chain, price] of Object.entries(prices) as [string, number][]) {
      await this.priceRepository.save({ chain, price });

      // Logic to check if price increased by more than 3%
      const previousPrice = await this.getPriceOneHourAgo(chain);
      if (previousPrice && price > previousPrice * 1.03) {
        await this.mailService.sendAlertEmail(chain, price); // Send email if price increase > 3%
      }
    }
  }

  async fetchPrices(): Promise<Record<string, number>> {
    const response = await axios.get('https://api.moralis.io/prices', {
      headers: { 'X-API-Key': process.env.MORALIS_API_KEY },
    });
    return response.data;
  }

  async getPriceOneHourAgo(chain: string): Promise<number | null> {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    const priceRecord = await this.priceRepository.findOne({
      where: { chain, timestamp: oneHourAgo },
    });
    return priceRecord ? priceRecord.price : null;
  }
}
