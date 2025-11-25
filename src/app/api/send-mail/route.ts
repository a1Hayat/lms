import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Import templates
import { welcomeEmail } from "@/components/email_templates/welcome";
import { resetPasswordEmail } from "@/components/email_templates/resetPassword";
import { successRegistrationEmail } from "@/components/email_templates/sucessRegistration";
import { generalEnrollmentEmail } from "@/components/email_templates/courseEnrollment";
import { toPlainText } from "@/components/email_templates/plainText";
import { paymentReceiptEmail } from "@/components/email_templates/payment-receipt";

export async function POST(req: Request) {
  try {
    const { to, subject, type, payload } = await req.json();

    if (!to || !subject || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Choose the template
    let html = "";

    switch (type) {
      case "welcome":
        html = welcomeEmail(payload);
        break;

      // case "verify":
      //   html = verifyEmail(payload);
      //   break;

      case "resetPassword":
        html = resetPasswordEmail(payload);
        break;

      case "paymentReceipt":
        html = paymentReceiptEmail(payload);
        break;

      case "successRegistration":
        html = successRegistrationEmail(payload);
        break;

      case "Enrollment":
        html = generalEnrollmentEmail(payload);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email template type" },
          { status: 400 }
        );
    }

    const text = toPlainText(html);

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"CS With Bari" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text, // Plain text fallback
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email API error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
