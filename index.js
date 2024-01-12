const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();
const app = express();

// Set the view engine
app.set("view engine", "ejs");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 587, // Use port 587
  secure: false, // Use TLS, not SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function clearUploads() {
    // Clear the contents of the uploads folder
    const uploadsFolderPath = 'uploads/';
    fs.readdir(uploadsFolderPath, (err, files) => {
      if (err) throw err;
  
      for (const file of files) {
        fs.unlinkSync(path.join(uploadsFolderPath, file));
      }
  
      console.log('Uploads folder cleared.');
    });
}

app.post('/signup', upload.fields([{ name: 'upload-photo', maxCount: 1 }, { name: 'l-thumb', maxCount: 1 }, { name: 'r-thumb', maxCount: 1 }, { name: 'voice-clip', maxCount: 1 }]), (req, res) => {
  const userData = req.body;
  const files = req.files;

  // Validate form data
  if (!userData || !userData['p-email'] || !userData['password'] || !files || Object.keys(files).length === 0) {
    return res.status(400).send('Bad Request: Incomplete form data');
  }

  // Constructing the email text with all form fields
  const emailText = `
    Dear ${userData['f-name']} ${userData['m-name']} ${userData['l-name']},

    Thank you for signing up! Your registration is successful.

    Gender: ${userData['gender']}
    Date of Birth: ${userData['dob-day']}/${userData['dob-month']}/${userData['dob-year']}
    Qualification: ${userData['qualification']}
    Present Address: ${userData['present-address']}
    Permanent Address: ${userData['permanent-address']}
    Primary Contact No. +91: ${userData['p-contact']}
    Secondary Contact No. +91: ${userData['s-contact']}
    Primary Email ID: ${userData['p-email']}
    Secondary Email ID: ${userData['s-email']}
    Date of Joining: ${userData['date-of-joining']}
    Username: ${userData['username']}
    Password: ${userData['password']}
    Confirm Password: ${userData['confirm-password']}
    Upload Photo: ${files['upload-photo'][0].filename}
    Upload Left Thumb: ${files['l-thumb'][0].filename}
    Upload Right Thumb: ${files['r-thumb'][0].filename}
    Employee Personal Profile Link: ${userData['profile-link']}
    Voice Clip: ${files['voice-clip'][0].filename}

    Regards,
    The Website Team
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userData['p-email'],
    subject: 'Welcome to Our Website',
    text: emailText,
    attachments: [
      { filename: 'upload-photo.jpg', path: `uploads/${files['upload-photo'][0].filename}` },
      { filename: 'l-thumb.jpg', path: `uploads/${files['l-thumb'][0].filename}` },
      { filename: 'r-thumb.jpg', path: `uploads/${files['r-thumb'][0].filename}` },
      { filename: 'voice-clip.mp3', path: `uploads/${files['voice-clip'][0].filename}` }
    ]
  };

  // Send the email with error handling
  transporter.sendMail(mailOptions, (error, info) => {

    clearUploads();

    if (error) {
      console.error('Error sending email:', error.message);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });

});

// Handle other routes
app.get('/', (req, res) => {
  res.render("home");
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
