import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const data = await req.json()
    const { name, email, mobile, experience, years } = data || {}

    if (!name || !email || !mobile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Read SMTP config from environment variables
    const SMTP_HOST = process.env.SMTP_HOST
    const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
    const SMTP_USER = process.env.SMTP_USER
    const SMTP_PASS = process.env.SMTP_PASS
    const RECEIVER = process.env.CONTACT_RECEIVER || SMTP_USER

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      // If SMTP not configured, return helpful message
      console.error('SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS environment variables.')
      // Fallback: write to logs and return success (so form doesn't break), but indicate email not sent
      console.log('Contact form received:', { name, email, mobile, experience })
      return NextResponse.json({ message: 'Received (email not sent - SMTP not configured).' }, { status: 200 })
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })

    const subject = `New student contact: ${name} (${experience})`
    const html = `
      <h3>New Student Contact</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Mobile:</strong> ${mobile}</li>
        <li><strong>Experience:</strong> ${experience}</li>
        ${years ? `<li><strong>Years:</strong> ${years}</li>` : ''}
      </ul>
    `

    await transporter.sendMail({
      from: SMTP_USER,
      to: RECEIVER,
      subject,
      html,
    })

    return NextResponse.json({ message: 'Email sent' }, { status: 200 })
  } catch (err) {
    console.error('Contact API error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
