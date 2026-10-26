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
    // API Key validation
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.PETER_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, slug, description } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const db = getDB();

    const subscribers = await db.collection("subscribers").find().toArray();

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers to notify" }, { status: 200 });
    }

    const blogUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${slug}`;

    const emailPromises = subscribers.map((subscriber) =>
      transporter.sendMail({
        from: `"Peter Shaan Blog" <${process.env.EMAIL_USER}>`,
        to: subscriber.email,
        subject: `📝 New Blog Post: ${title}`,
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
                          <h1 style="color: #E4FF76; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">New Blog Post</h1>
                          <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 28px; font-weight: 700;">${title}</h2>
                          ${description ? `<p style="color: #a1a1b3; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">${description}</p>` : ""}
                          <a href="${blogUrl}" style="display: inline-block; background-color: #E4FF76; color: #10101a; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Read Article →</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 24px 0 0 0; text-align: center;">
                          <p style="color: #666; font-size: 12px; margin: 0;">You received this email because you subscribed to Peter Shaan's blog.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json(
      { message: `Notified ${subscribers.length} subscribers` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}

