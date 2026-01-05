const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "xmunna079@gmail.com",
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async ({ email, subject, OTP }) => {
    await transporter.sendMail({
        from: 'Rexify eCommerce',
        to: email,
        subject: subject,
        html: `<b>Please verify your e-commerce account. Your OTP: ${OTP}</b>`,
    });
};

module.exports = { sendEmail };
