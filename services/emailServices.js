const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: "xmunna079@gmail.com",
        pass: "scmjfonarschmcnf",
    },
});

const sendEmail = async ({ email, subject, OTP, template }) => {
    await transporter.sendMail({
        from: 'Rexify eCommerce',
        to: email,
        subject: subject,
        html: template({ otp: OTP }),
    });
};

module.exports = { sendEmail };
