import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPerson } from 'src/data/interfaces/person.interface';
import { SimpleService } from 'src/common/lib/simple.service';
import * as blake2 from 'blake2'
import * as nodeMailer from 'nodemailer'
import { IForgotPassword } from '../../data/interfaces/forgotPassword.interface';
import * as moment from 'moment';

@Injectable()
export class PersonsService extends SimpleService<IPerson> {
  constructor(
    @InjectModel('persons')
    protected readonly model: Model<IPerson>,
    @InjectModel('forgotpassword')
    protected readonly forgotPasswordModel : Model<IForgotPassword>,

    protected readonly http: HttpService
  )
  {
    super(model)
  }

  async create(document: IPerson): Promise<IPerson> {
    if (await this.model.findOne({username: document.username}).exec())
      throw new HttpException('Email Already Exists!',
        HttpStatus.NOT_ACCEPTABLE);
    else
      return super.create(document);
  }

  fetchByUsername(name: string): Promise<IPerson> {
    return this.model.findOne().where('username', name).exec()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async favoriteProducts(personId: string,productId:string){
    const profile = await this.model.findById(personId).exec();
    if(profile.watchList.includes(productId)){
      profile.watchList.splice(profile.watchList.indexOf(productId))
      return await profile.save();
    } else {
      profile.watchList.push(productId)
      return await profile.save()
    }
  }

  async changePassword(data: any): Promise<any>{
    let verify, person;
    if (data.hash){
      verify = await this.forgotPasswordModel.findOne({hash: data.hash}).exec()
      person =  (await this.model.findOne({username: verify.email})) as IPerson
    }
    else {
      person = (await this.model.findOne({_id: data.id})) as IPerson
    }

    if(verify)
      await this.model.findByIdAndDelete(verify._id).exec()
    return await this.model.findByIdAndUpdate(person._id, {password: data.new}).exec()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected getRandomArbitrary() {
    return (Math.random() * (999999 - 100000) + 100000).toFixed(0);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
  async forgotPassword(email : string){
    if (await this.model.findOne({username: email}).exec()){

      const personName = (await this.model.findOne({username: email}).exec()).name

      const code = this.getRandomArbitrary();

      //Hashing
      const h = blake2.createHash('blake2b', {digestLength: 16});
      h.update(Buffer.from(code));
      const hash = h.digest("hex");

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
      const info = await transporter.sendMail({
        from: '"Support - Admin ACP" <support@acpshopping.com>', // sender address
        to: email, // list of receivers
        subject: "ACP Forgot Password", // Subject line
        text: "", // plain text body
        html: `
                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0" lang=en-US >
                     <head> 
                      <meta charset="UTF-8"> 
                      <meta content="width=device-width, initial-scale=1" name="viewport"> 
                      <meta name="x-apple-disable-message-reformatting"> 
                      <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
                      <meta content="telephone=no" name="format-detection"> 
                      <title>Forgot Password</title> 
                    
                      <style type="text/css">
                    @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:20px!important; text-align:center; line-height:120%!important } h2 { font-size:16px!important; text-align:left; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:20px!important } h2 a { font-size:16px!important; text-align:left } h3 a { font-size:20px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:10px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:14px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
                    #outlook a {
                    \tpadding:0;
                    }
                    .ExternalClass {
                    \twidth:100%;
                    }
                    .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                    \tline-height:100%;
                    }
                    .es-button {
                    \tmso-style-priority:100!important;
                    \ttext-decoration:none!important;
                    }
                    a[x-apple-data-detectors] {
                    \tcolor:inherit!important;
                    \ttext-decoration:none!important;
                    \tfont-size:inherit!important;
                    \tfont-family:inherit!important;
                    \tfont-weight:inherit!important;
                    \tline-height:inherit!important;
                    }
                    .es-desk-hidden {
                    \tdisplay:none;
                    \tfloat:left;
                    \toverflow:hidden;
                    \twidth:0;
                    \tmax-height:0;
                    \tline-height:0;
                    \tmso-hide:all;
                    }
                    .es-button-border:hover a.es-button {
                    \tbackground:#ffffff!important;
                    \tborder-color:#ffffff!important;
                    }
                    .es-button-border:hover {
                    \tbackground:#ffffff!important;
                    \tborder-style:solid solid solid solid!important;
                    \tborder-color:#3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3!important;
                    }
                    </style> 
                     </head> 
                     <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
                      <div class="es-wrapper-color" style="background-color:#FAFAFA"> 
                    
                       <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
                         <tr style="border-collapse:collapse"> 
                          <td valign="top" style="padding:0;Margin:0"> 
                           <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                             <tr style="border-collapse:collapse"> 
                              <td class="es-adaptive" align="center" style="padding:0;Margin:0"> 
                               <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
                                 <tr style="border-collapse:collapse"> 
                                  <td align="left" style="padding:10px;Margin:0"> 
                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                     <tr style="border-collapse:collapse"> 
                                      <td valign="top" align="center" style="padding:0;Margin:0;width:580px"> 
                                       <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" class="es-infoblock" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:14px;color:#CCCCCC"></p></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                   </table></td> 
                                 </tr> 
                               </table></td> 
                             </tr> 
                           </table> 
                           <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
                             <tr style="border-collapse:collapse"> 
                              <td class="es-adaptive" align="center" style="padding:0;Margin:0"> 
                               <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#3D5CA3;width:600px" cellspacing="0" cellpadding="0" bgcolor="#3d5ca3" align="center"> 
                                 <tr style="border-collapse:collapse"> 
                                  <td align="left" bgcolor="#0b5394" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-color:#0B5394"> 
                                   <table cellspacing="0" cellpadding="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="left" style="padding:0;Margin:0;width:560px"> 
                                       <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td class="es-m-p0l" align="center" style="padding:0;Margin:0;font-size:0px"><a href="https://viewstripo.email" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:14px;text-decoration:none;color:#1376C8"><img src="https://hjzckt.stripocdn.email/content/guids/CABINET_b8cbc62383cc384f0908975bb7d9d335/images/72701597298880538.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="155" height="72"></a></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                   </table></td> 
                                 </tr> 
                               </table></td> 
                             </tr> 
                           </table> 
                           <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                             <tr style="border-collapse:collapse"> 
                              <td style="padding:0;Margin:0;background-color:#FAFAFA" bgcolor="#fafafa" align="center"> 
                               <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
                                 <tr style="border-collapse:collapse"> 
                                  <td style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;background-color:transparent" bgcolor="transparent" align="left"> 
                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                     <tr style="border-collapse:collapse"> 
                                      <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                       <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top" width="100%" cellspacing="0" cellpadding="0" role="presentation"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0"><img src="https://hjzckt.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="175" height="208"></td> 
                                         </tr> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><h1 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#333333"><strong>FORGOT YOUR </strong></h1><h1 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#333333"><strong>&nbsp;PASSWORD?</strong></h1></td> 
                                         </tr> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" style="padding:0;Margin:0;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666">HI,&nbsp;${personName}</p></td> 
                                         </tr> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="left" style="padding:0;Margin:0;padding-right:35px;padding-left:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666;text-align:center">There was a request to change your password!</p></td> 
                                         </tr> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" style="padding:0;Margin:0;padding-top:25px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666">If you did not make this request, please ignore this email. </p></td> 
                                         </tr> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:40px;padding-bottom:40px"><span class="es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#FFFFFF;border-width:2px;display:inline-block;border-radius:10px;width:auto"><a href="https://admin.acpshopping.com/reset-password/${hash}" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;color:#3D5CA3;border-style:solid;border-color:#FFFFFF;border-width:15px 20px 15px 20px;display:inline-block;background:#FFFFFF;border-radius:10px;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">RESET PASSWORD</a></span></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                   </table></td> 
                                 </tr> 
                                 <tr style="border-collapse:collapse"> 
                                  <td style="Margin:0;padding-top:5px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-position:left top" align="left"> 
                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                     <tr style="border-collapse:collapse"> 
                                      <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                       <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:21px;color:#666666"> <a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:14px;text-decoration:none;color:#666666" href=""></a> <a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:14px;text-decoration:none;color:#666666"></a></p></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                   </table></td> 
                                 </tr>
                                 <tr style="border-collapse:collapse"> 
                                  <td style="Margin:0;padding-top:5px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-position:left top" align="left"> 
                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                     <tr style="border-collapse:collapse"> 
                                      <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                       <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:21px;color:#666666">Contact us: <a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:14px;text-decoration:none;color:#666666" href="tel:123456789">+</a>968-71371372 | <a target="_blank" href="mailto:your@mail.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:14px;text-decoration:none;color:#666666">support@acpshopping.com</a></p></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                   </table></td> 
                                 </tr> 
                               </table></td> 
                             </tr> 
                           </table> 
                           <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
                             <tr style="border-collapse:collapse"> 
                              <td style="padding:0;Margin:0;background-color:#FAFAFA" bgcolor="#fafafa" align="center"> 
                               <table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"> 
                                 <tr style="border-collapse:collapse"> 
                                  <td style="Margin:0;padding-top:10px;padding-left:20px;padding-right:20px;padding-bottom:30px;background-color:#0B5394;background-position:left top" bgcolor="#0b5394" align="left"> 
                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                     <tr style="border-collapse:collapse"> 
                                      <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                       <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px"><h2 style="Margin:0;line-height:19px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:16px;font-style:normal;font-weight:normal;color:#FFFFFF"><strong>Have questions?</strong></h2></td> 
                                         </tr> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="left" style="padding:0;Margin:0;padding-bottom:5px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:21px;color:#FFFFFF">We are here to help!<a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:14px;text-decoration:none;color:#FFFFFF" href=""></a></p></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                   </table></td> 
                                 </tr> 
                               </table></td> 
                             </tr> 
                           </table> 
                           </td> 
                         </tr> 
                       </table> 
                      </div>  
                     </body>
                    </html>
                `, // html body
      });
      // console.log("Message sent: %s", info.messageId);

      //Store in DB
      const document = {
        hash : hash,
        email : email
      }
      return this.forgotPasswordModel.create(document);
    }else {
      throw new HttpException(
        "Email Don't exists!",
        HttpStatus.NOT_ACCEPTABLE
      )
    }
  }

  async verify(hash : string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return moment().diff((await this.forgotPasswordModel.findOne({hash: hash}).exec()).createdAt, 'hours') < 1
  }

  async socialSignIn(data: any): Promise<IPerson>{
    const person = await this.model.findOne({username: data.username}).exec()
    if (person){
      return person
    }else {
      return await super.create(data);
    }
  }

  async AdminChangePassword(data: any):Promise<any>{
    const admin = await this.model.findOne({ _id: data.id, password: data.old }).exec()
    if (admin){
      admin.password = data.new
      return await this.model.findByIdAndUpdate(admin._id, admin).exec()
    }else
      throw new HttpException(
        'Old Password Not matched!',
        HttpStatus.NOT_ACCEPTABLE
      )
  }

  async getCustomer(): Promise<IPerson[]>{
    return await this.model.find({scope: 'customer'}).exec()
  }

  //Using in orders schema
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async addingWalletPoints(id: string, walletPoints: number, status: boolean){
    const person = await this.model.findOne({_id: id}).exec()
    if (status){
      person.walletPoints += walletPoints
    }else {
      person.walletPoints -= walletPoints
    }
    return await super.change(person)
  }

  //used in order service
  async sendSingle(profileId: string, remarks: string): Promise<any>{
    const person = await this.model.findById(profileId).exec()
    console.log(person.token)
    if (person){
      await this.http.post(
        "https://fcm.googleapis.com/fcm/send",
        {
          notification: {
            body: remarks,
            title: 'Important Notice!'
          },
          to: person.token
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
}
