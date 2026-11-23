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
    console.error('Error sending email:'); // Generic error message, no sensitive info
    console.error(error)
    return { success: false, error: 'Failed to send email' }
  }
}

export type ApplicationData = {
  name: string
  email: string
  phone?: string
  university: string
  program: string
  semester?: string
  interests: string[]
  motivation: string
  source?: string
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export async function sendApplicationEmail(data: ApplicationData) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const rows: [string, string][] = [
      ['Name', data.name],
      ['Email', data.email],
      ['Phone', data.phone || '-'],
      ['University', data.university],
      ['Degree programme', data.program],
      ['Semester', data.semester || '-'],
      ['Interests', data.interests.length ? data.interests.join(', ') : '-'],
      ['How they heard about us', data.source || '-'],
      ['Motivation', data.motivation],
    ]

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      replyTo: data.email,
      subject: `Membership application from ${data.name.replace(/[\r\n]/g, ' ')}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `<h3>New membership application</h3>${rows
        .map(([k, v]) => `<p><strong>${k}:</strong><br>${escapeHtml(v).replace(/\n/g, '<br>')}</p>`)
        .join('')}`,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending application email:')
    console.error(error)
    return { success: false, error: 'Failed to send application' }
  }
}
