import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '../../actions';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Send email using nodemailer
    const result = await sendContactEmail({ name, email, message });
    
    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully!' });
    } else {
      return NextResponse.json(
        { error: result.error}, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
