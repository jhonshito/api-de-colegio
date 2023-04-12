
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'caicedojhon957@gmail.com', // generated ethereal user
      pass: 'zgsiyoqeasgbbssa', // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify().then(() => {
    console.log('ready for send email')
})

module.exports = transporter