const nodeMailer = require("nodemailer")

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host : "smpt.gmail.com",
        port : 465,
        service : "gmail",
        auth:{
            user : "yourorganisationmailid@gmail.com",
            pass : "your mail id's passcode"
        }
    })
    const mailOptions = {
        from : "yourorganisationmailid@gmail.com",
        to : options.email,
        subject : options.subject,
        text : options.message
    }
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail