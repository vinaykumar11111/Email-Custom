Custom Email Sending Application

This project is a custom email-sending application developed using React.js,Type Script. It provides a user-friendly interface for personalizing and sending emails, integrating several APIs for robust email customization and management. Below is a detailed guide to understanding the features and setting up the project.

Key Features

Reads data from a Google Sheet or CSV file for email customization.

Connects users' email accounts using the Gmail API.

Accepts customizable prompts for personalizing emails using the Gemini AI API.

Customizes and sends emails via Rsend and Email.js APIs.

Displays real-time status and analytics using Supabase and Google Analytics.

Provides email scheduling, throttling, and delivery tracking with Supabase integration.

Stores scheduled emails in Supabase for future reference.

Instructions for Setting Up APIs

1. Google Sheets and CSV File Integration

To read data from a Google Sheet or CSV file, ensure that the file is formatted correctly and accessible through your project. Use CSV parsing libraries such as PapaParse in React.js for seamless CSV file reading.

2. Gmail API Integration

This project uses the Gmail API for connecting user email accounts. Follow these steps to set up the Gmail API:

Step 1: Go to the Google Cloud Console.

Step 2: Create a new project or select an existing one.

Step 3: Navigate to APIs & Services > Library and search for Gmail API.

Step 4: Enable the Gmail API.

Step 5: Go to APIs & Services > Credentials and create OAuth 2.0 credentials.

Step 6: Configure the OAuth consent screen and download the credentials JSON file.

Step 7: Use a package like react-google-login for authentication within your React app.

3. Gemini AI API Integration

The Gemini AI API is used to accept and process customizable prompts for personalizing emails. To set up the Gemini AI API:

Step 1: Register on the Gemini AI website and create an account or go to Google cloud console

Step 2: Go to the Developer Dashboard and create an API key.

Step 3: Integrate the API key in your React project by adding it to your .env file for secure storage.

Step 4: Use axios or fetch to send requests to the Gemini AI endpoint for generating personalized email content.

4. Email Sending with Rsend and Email.js APIs

To send customized emails, follow these steps to set up Rsend and Email.js:

Step 1: Sign up at Rsend and Email.js to create accounts.

Step 2: Obtain the API keys from each service by navigating to their API key section in the dashboard.

Step 3: Install emailjs-com via npm:

npm install emailjs-com

Step 4: Configure the API integration in your React app and pass the required parameters to send emails.

5. Real-time Status and Analytics with Supabase and Google Analytics

To display real-time status and analytics for sent emails, set up Supabase and Google Analytics:

Supabase Setup:

Step 1: Go to Supabase and create an account.

Step 2: Start a new project and configure the database.

Step 3: Obtain the API key from the project settings and integrate it using supabase-js in your React project.

Google Analytics Setup:

Step 1: Create or log in to your Google Analytics account.

Step 2: Set up a new property for your project.

Step 3: Obtain the tracking ID and integrate it with react-ga or gtag.js for analytics tracking.

6. Email Scheduling and Tracking with Supabase

To enable email scheduling and delivery tracking, use Supabase as follows:

Step 1: In your Supabase project, create a table for scheduled emails with columns such as email_id, recipient, scheduled_time, etc.

Step 2: Use Supabase's built-in functions to handle the scheduling logic.

Step 3: Implement serverless functions or API endpoints that periodically check and send scheduled emails using the Email Service Provider.

7. ESP Integration for Delivery Tracking

Ensure seamless tracking and delivery by integrating your chosen ESP (e.g., Supabase or third-party services like SendGrid):

Step 1: Configure webhook endpoints to receive delivery status updates.

Step 2: Use Supabase functions to update and display the delivery status in real-time.

Conclusion

https://github.com/user-attachments/assets/5732b6ed-5a84-47c3-b431-d8365c9c9132



This custom email-sending application leverages the power of modern APIs to provide a seamless and personalized emailing experience. Follow the instructions above to set up the APIs and build a complete, functional app.

