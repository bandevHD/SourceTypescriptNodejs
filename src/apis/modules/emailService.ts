import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';
import Handlebars = require('handlebars');
// import from '../../../public/email/email.mjml'
import fs from 'fs-extra';
import path = require('path');
import mjml from 'mjml';
import { MJMLParseResults } from 'mjml-core';
dotenv.config();

export const handlerEmail = async (email: string, html) => {
  const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_APP_NAME, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
      },
    });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Training nodejs 👻" <no-reply@training.com>', // sender address
    to: email, // list of receivers
    subject: 'Đăng ký tài khoản', // Subject line
    html, // html body
  });

  return info;
};

export const handlerEmailMjML = async (email: string, objectTemplate: object) => {
  try {
    const readFile = await fs.readFile(
      path.resolve(__dirname, '../../../../public/email/email.mjml'),
      {
        encoding: 'utf-8',
      },
    );

    const template: HandlebarsTemplateDelegate<any> = Handlebars.compile(readFile);

    const htmlRender: MJMLParseResults = mjml(template(objectTemplate ? objectTemplate : {}));

    // send mail with defined transport object
    await handlerEmail(email, htmlRender.html);
  } catch (error) {
    throw new Error(error);
  }
};
