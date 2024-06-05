import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

@Injectable()
export class MailerService {
  transport: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    this.transport = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }
  sendEmailWithTemplate(
    from: string,
    to: string,
    subject: string,
    html: string,
  ) {
    const mailingOptions: MailOptions = {
      from,
      to,
      subject,
      html,
    };
    this.transport.sendMail(mailingOptions);
  }
}
