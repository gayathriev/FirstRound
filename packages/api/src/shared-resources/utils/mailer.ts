import { createTransport, createTestAccount, getTestMessageUrl } from "nodemailer";
import { google } from "googleapis";

const oathClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

oathClient.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

/**
 * @description
 * Send an account reset email
 * to a given user
 * 
 * @param email: the user's email 
 * @param token: the user's auth token 
 */
export async function sendEmail(email: string, token: string) {
    const accessToken: string = await oathClient.getAccessToken() as string;

    // config transporter
    let transporter = createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GMAIL_SERVICE_ACCOUNT,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            // generate on the fly
            accessToken: accessToken
        }
    });

    try {
        // fire and forget
        await transporter.sendMail({
            from: '"First Round" <firstroundmailer@gmail.com>',
            to: email, // list of receivers
            subject: "Account Reset", // Subject line
            text: `Account Reset Token: ${token}`,
            html: `<div style='width:50%; text-align:center; margin-left:auto; margin-right:auto;'>
                        <h1>First Round Account Reset</h1>
                        <hr />
                        <p align='left'>
                            You, or someone else, requested an account reset for your First Round account. 
                        </p>
                        <h3 align='left'>
                            Here is your reset token 📟
                        </h3>
                        <div style='border:1px solid black; border-radius: 5px; height:150px;'>
                            <h1 style='margin-top:65px;'>${token}</h1>
                        </div>
                        <p align='left'>
                            Enter this token into the form and the little robots 🤖 will reset your account.
                        </p>
                        <p align='left' style='margin-top:35px;'>
                            If you did not request this reset please ignore this email, no further action is acquired.
                        </p>
                    </div>
                `,
        });
    } catch (error) {
        console.error("[>>] Email did not fire 🔥, was the sending limit was reached?", error);
    }

    console.log("[>>] Email send fired 📭");
}

/**
 * @description
 * Send an email to a business user
 * when their venue request has been
 * processed by an admin
 * 
 * @param email: the user's email 
 */
export async function sendVerificationUpdate(email: string) {
    const accessToken: string = await oathClient.getAccessToken() as string;

    // config transporter
    let transporter = createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GMAIL_SERVICE_ACCOUNT,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            // generate on the fly
            accessToken: accessToken
        }
    });

    try {
        // fire and forget
        await transporter.sendMail({
            from: '"First Round" <firstroundmailer@gmail.com>',
            to: email, // list of receivers
            subject: "Venue Verification Request Update", // Subject line
            text: `Congratulations your venue was verified on First Round!`,
            html: `<div style='width:50%; text-align:center; margin-left:auto; margin-right:auto;'>
                        <h1>Venue Verification Request Update</h1>
                        <hr />
                        <p align='left'>
                            Congratulations your venue was verified on First Round!
                        </p>
                    </div>
                `,
        });

    } catch (error) {
        console.error("[>>] Email did not fire 🔥, was the sending limit was reached?", error);
    }

    console.log("[>>] Verification Update Email fired 📭");
}