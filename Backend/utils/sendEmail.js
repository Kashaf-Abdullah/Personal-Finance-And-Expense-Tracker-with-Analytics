const nodemailer = require('nodemailer');
const path = require('path');

// Simple email sending function
const sendEmail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define email options
  const mailOptions = {
    from: 'Finance Tracker <hello@financetracker.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  // 3) Send email
  await transporter.sendMail(mailOptions);
};

// Email templates
const emailTemplates = {
  welcome: (username) => ({
    subject: 'Welcome to Finance Tracker!',
    text: `Hi ${username},\n\nWelcome to Finance Tracker, we're glad to have you!\n\nTrack your expenses and income with ease!\n\n- The Finance Tracker Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hi ${username},</p>
        <p>Welcome to Finance Tracker, we're glad to have you! 🎉🙏</p>
        <p>Track your expenses and income with ease!</p>
        <p>- The Finance Tracker Team</p>
      </div>
    `
  }),

  budgetAlert: (username, utilization, limit, category) => ({
    subject: `Budget Alert: ${category} nearing limit!`,
    text: `Hi ${username},\n\nYour budget for ${category} has reached ${utilization}% of your ${limit} limit!\n\nConsider reviewing your expenses in this category.\n\n- The Finance Tracker Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hi ${username},</p>
        <p>Your budget for <strong>${category}</strong> has reached <strong>${utilization}%</strong> of your <strong>${limit}</strong> limit!</p>
        <p>Consider reviewing your expenses in this category.</p>
        <p>- The Finance Tracker Team</p>
      </div>
    `
  }),

  passwordReset: (username, resetUrl) => ({
    subject: 'Your password reset token (valid for 10 minutes)',
    text: `Hi ${username},\n\nForgot your password? Click this link to reset it: ${resetUrl}\n\nIf you didn't forget your password, please ignore this email.\n\n- The Finance Tracker Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hi ${username},</p>
        <p>Forgot your password? Click the button below to reset it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't forget your password, please ignore this email.</p>
        <p>- The Finance Tracker Team</p>
      </div>
    `
  })
};

// Helper functions for specific email types
const sendWelcomeEmail = async (user) => {
  const template = emailTemplates.welcome(user.username);
  await sendEmail({
    email: user.email,
    ...template
  });
};

const sendBudgetAlertEmail = async (user, utilization, limit, category) => {
  const template = emailTemplates.budgetAlert(user.username, utilization, limit, category);
  await sendEmail({
    email: user.email,
    ...template
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const template = emailTemplates.passwordReset(user.username, resetUrl);
  await sendEmail({
    email: user.email,
    ...template
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBudgetAlertEmail,
  sendPasswordResetEmail
};