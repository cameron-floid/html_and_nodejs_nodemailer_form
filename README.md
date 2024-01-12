# Simple Node.js Nodemailer Project

## Overview
This project demonstrates a basic implementation using HTML, Node.js, and Nodemailer. It features a simple HTML form that collects user input. Upon form submission, Node.js retrieves the entered data and sends it via email using Nodemailer.

## Configuration
Ensure to set the following environment variables in a `.env` file:

- `EMAIL_USER`: Your email address for sending emails.
- `EMAIL_PASS`: Your email account password.
- `PORT`: Port number for the server (default: 3000).

## Installation
1. Clone the repository: `git clone https://github.com/cameron-floid/html_and_nodejs_nodemailer_form.git`
2. Navigate to the project directory: `cd html_and_nodejs_nodemailer_form`
3. Install dependencies: `npm install`
4. Install `nodemon` globally: `npm install -g nodemon`

## Usage
1. Set the required environment variables in the `.env` file.
2. Start the server using `nodemon`: `npm run dev`
3. Open your browser and go to `http://localhost:3000` (or the specified port).
4. Fill out the form and submit it to see Nodemailer in action.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
