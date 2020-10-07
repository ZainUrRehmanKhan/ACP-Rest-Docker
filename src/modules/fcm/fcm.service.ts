import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class FcmService{
  constructor(
    private http : HttpService
  )
  {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async notification(data : any): Promise<any> {
    await this.http.post(
      "https://fcm.googleapis.com/fcm/send",
      {
        notification: {
          title: data.title,
          body: data.description
        },
        to: '/topics/news'
      },
      {
        headers: {
          "ContentType": "application/json",
          "Authorization": "key=AAAAPPBmvaY:APA91bHyyXn5tvc8PyvVK9vlIks2Ry9AyzQh32o4a2cEEzOgtk-Xw3SsFW-RkYZNHAd2r82YL4cZiUkPaioDFsYs1wC66VGpscv5kwfXPR2mhqa2esooJO-faaAzh07E4GrsJidlV_FK"
        }
      }
    ).subscribe(asd => console.log(asd));
  }
}
