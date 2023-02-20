import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';

dotenv.config();

export const handlerEmail = async (email: string, html: string) => {
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
