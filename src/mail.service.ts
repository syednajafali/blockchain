import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Initialize the transporter with environment variables for email service
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendAlertEmail(chain: string, currentPrice: number) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'Najaf@wattcharge.io',
      // to: 'hyperhire_assignment@hyperhire.in',
      subject: `${chain} price alert`,
      text: `The price of ${chain} has increased by more than 3%. Current price: ${currentPrice}`,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
