const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: Number(process.env.MAILPORT),
    secure: process.env.MAILSECURE === "true",
    service: process.env.MAILSERVICE,
    auth: {
        user: process.env.MAILUSERNAME,
        pass: process.env.MAILPASSWORD,
    },
});

const sendOtpMail = async (email, name, otp) => {

    await transporter.sendMail({

        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,

        to: email,

        subject: "Password Reset OTP",

        html: `
            <div style="font-family:Arial,sans-serif">

                <h2>Hello ${name},</h2>

                <p>You requested to reset your password.</p>

                <p>Your OTP is:</p>

                <h1 style="letter-spacing:5px;color:#0d6efd">
                    ${otp}
                </h1>

                <p>This OTP is valid for <b>10 minutes</b>.</p>

                <p>If you did not request this, please ignore this email.</p>

                <br>

                <p>Thanks,<br>Xpanse Production Team</p>

            </div>
        `,

    });

};
const sendUserCredentialsMail = async (
    email,
    name,
    password
) => {

    await transporter.sendMail({

        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,

        to: email,

        subject: "Your Xpanse Production Account Credentials",

        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">

            <h2>Hello ${name},</h2>

            <p>Your account has been created successfully.</p>

            <p>Please use the following credentials to login.</p>

            <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;border:1px solid #ddd;">
                <tr>
                    <td><b>Username (Email)</b></td>
                    <td>${email}</td>
                </tr>
                <tr>
                    <td><b>Password</b></td>
                    <td>${password}</td>
                </tr>
            </table>

            <br>

            <p>
                <b>Note:</b> Your password will expire in 1 hour.
                Please change your password after your first login.
            </p>

            <br>

            <p>
                Regards,<br>
                Xpanse Production Team
            </p>

        </div>
        `,

    });

};
module.exports = {
    sendOtpMail,
    sendUserCredentialsMail
};