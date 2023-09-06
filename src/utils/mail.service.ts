import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendMail(to: string, subject: string, text: string): Promise<boolean> {
    const mailOptions = {
      from: `User-Profile <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      if (info) return true;
    } catch (err) {
      console.log(err.message);
    }
    return false;
  }
}
