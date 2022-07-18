const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const router = express.Router()
require('dotenv').config()

const PORT = process.env.PORT || 80
const app = express()
app.use(express.json())
app.use(cors())
app.use('/', router)

const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD
    }
})

contactEmail.verify( error => {
    if(error){
        console.log(error)
    }else{
        console.log("Ready to send email")
    }
})

router.post('/contact', (req, res) => {
    const name = req.body.firstname + " " +req.body.lastname
    const email = req.body.email
    const phone = req.body.phone
    const message = req.body.message
    const mail = {
        from: name,
        to: process.env.GMAIL_EMAIL_ADDRESS,
        subject: "CONTACT FORM SUBMISSION - PORTFOLIO "+name,
        html:   `<p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Phone: ${phone}</p>
                <p>Message: ${message}</p>`
    }
    contactEmail.sendMail( mail, error => {
        if(error){
            res.json(error)
        }else{
            res.json({ code: 200, status: "Message sent"})
        }
    })
})


app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})