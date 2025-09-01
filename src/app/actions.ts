'use server'

import { draftMode } from 'next/headers'
import nodemailer from 'nodemailer'

export async function disableDraftMode() {
  const disable = (await draftMode()).disable()
  const delay = new Promise((resolve) => setTimeout(resolve, 1000))

  await Promise.allSettled([disable, delay])
}

export async function sendContactEmail(formData: {
  name: string
  email: string
  message: string
}) {
  try {
    // Create transporter with environment variables for security
    console.log('Sending email with formData:', formData)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `Contact Form Submission from ${formData.name}`,
      text: `
        Name: ${formData.name}
        Email: ${formData.email}
        Message: ${formData.message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error(process.env.SMTP_USER, process.env.SMTP_HOST)
    console.error('Error sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
