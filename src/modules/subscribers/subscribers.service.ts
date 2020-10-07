import { Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { ISubscribers } from '../../data/interfaces/subscribers.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodeMailer from 'nodemailer'

@Injectable()
export class SubscribersService extends  SimpleService<ISubscribers> {
  constructor(
    @InjectModel('subscribers')
    protected readonly model : Model<ISubscribers>
  )
  {
    super(model);
  }

  async sendEmail(body: string, title: string, subject: string): Promise<any>{
    //Email Sending
    const transporter = nodeMailer.createTransport({
      host: "mail.privateemail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "support@acpshopping.com",
        pass: "aqs442ytm3",
      },
    });

    const subs = (await this.model.find().exec()) as ISubscribers[]

    for (let items of subs){
      const info = await transporter.sendMail({
        from: title + '<marketing@acpshopping.com>', // sender address
        to: items.email, // list of receivers
        subject: subject, // Subject line
        text: "", // plain text body
        html: body, // html body
      });
      // console.log("Message sent: %s", info.messageId);
    }
  }

}
