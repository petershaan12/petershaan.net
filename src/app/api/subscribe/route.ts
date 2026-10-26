import { NextRequest, NextResponse } from "next/server";
import { connectDB, getDB } from "@/lib/mongodb";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const email = body?.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    await connectDB();
    const db = getDB();

    // Check if already subscribed
    const existing = await db.collection("subscribers").findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "You're already subscribed! 😊" }, { status: 200 });
    }

    // Add new subscriber
    await db.collection("subscribers").insertOne({
      email,
      subscribedAt: new Date(),
    });

    // Send welcome email
    try {
      await transporter.sendMail({
        from: `"Peter Shaan" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🎉 Thanks for subscribing!",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #10101a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #10101a; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #1a1a24 0%, #10101a 100%); border-radius: 16px; border: 1px solid rgba(172, 172, 172, 0.2); padding: 40px;">
                          <img src="${process.env.NEXT_PUBLIC_APP_URL}/me.webp" alt="Peter Shaan" width="48" height="48" style="border-radius: 50%; margin-bottom: 16px;" />
                          <h1 style="color: #E4FF76; margin: 0 0 16px 0; font-size: 24px;">Hello! 👋</h1>
                          <p style="color: #ffffff; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Thanks for subscribing to my blog!</p>
                          <p style="color: #a1a1b3; margin: 0 0 24px 0; font-size: 14px; line-height: 1.6;">You'll receive notifications whenever I publish new articles about web development, design, and my life.</p>
                          <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog" style="display: inline-block; background-color: #E4FF76; color: #10101a; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">View Blog →</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 24px 0 0 0; text-align: center;">
                          <p style="color: #666; font-size: 12px; margin: 0;">Peter Shaan - petershaan.net</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({ message: "Thank you! for subscribing! 🎉" }, { status: 201 });
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

