import type { APIRoute } from 'astro';

export const prerender = false;

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitize(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await request.json() as ContactFormData;
    
    // Validate required fields
    const errors: string[] = [];
    
    if (!data.name || data.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    if (!data.email || !validateEmail(data.email)) {
      errors.push('Valid email is required');
    }
    
    if (!data.subject) {
      errors.push('Subject is required');
    }
    
    if (!data.message || data.message.length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Sanitize input
    const sanitizedData = {
      name: sanitize(data.name),
      email: sanitize(data.email),
      subject: sanitize(data.subject),
      message: sanitize(data.message),
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
    };
    
    // In production, integrate with:
    // 1. Email service (SendGrid, Resend, etc.)
    // 2. Discord/Slack webhook for notifications
    // 3. Database for storing inquiries
    
    // For now, log the submission (visible in Cloudflare logs)
    console.log('Contact form submission:', JSON.stringify(sanitizedData, null, 2));
    
    // TODO: Implement actual email/notification logic
    // Example with Resend:
    // const resend = new Resend(import.meta.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'contact@shreyansbhatt.com',
    //   to: 'tech.shreyans@gmail.com',
    //   subject: `Portfolio Contact: ${sanitizedData.subject}`,
    //   html: `...`
    // });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for your message. I will get back to you within 24-48 hours.' 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Reject other methods
export const ALL: APIRoute = async () => {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
};
