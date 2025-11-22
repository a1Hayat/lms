import { LOGO_URL } from "./config";

export function paymentReceiptEmail({
  name,
  itemName,
  totalPrice,
  orderId
}: {
  name: string;
  itemName: string;
  totalPrice: string;
  orderId: string;
}) {
  return `
  <div style="background:#f4f6f9;padding:20px;font-family:Arial,sans-serif;">
    <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">

      <!-- Logo -->
      <tr>
        <td align="center" style="padding:20px;">
          <img src="${LOGO_URL}" width="120" alt="CSWithBari Logo" style="display:block;margin:auto;" />
        </td>
      </tr>

      <!-- Header -->
      <tr>
        <td style="background:#0b6efd;color:#fff;text-align:center;padding:20px;">
          <h2 style="margin:0;font-size:20px;">Your Payment Receipt</h2>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px;color:#333;font-size:15px;line-height:1.6;">
          <p>Hello ${name},</p>
          <p>Thank you for placing an order with <strong>CSWithBari</strong>.</p>
          <p>You selected <strong>Cash Payment</strong>.  
          Please visit any <strong>Vision Academy Center</strong> to complete the payment.</p>

          <h3 style="margin-top:25px;">🧾 Order Details</h3>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;font-size:14px;">
            <tr>
              <td style="padding:8px 0;color:#555;">Item Name:</td>
              <td style="padding:8px 0;text-align:right;font-weight:bold;">${itemName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#555;">Total Price:</td>
              <td style="padding:8px 0;text-align:right;font-weight:bold;">${totalPrice}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#555;">Order ID:</td>
              <td style="padding:8px 0;text-align:right;font-weight:bold;color:#0b6efd;">${orderId}</td>
            </tr>
          </table>

          <div style="margin:25px 0;padding:15px;background:#e8f0ff;border-left:4px solid #0b6efd;">
            <p style="margin:0;color:#0b377d;font-size:14px;">
              <strong>Important:</strong>  
              Please take this order receipt to your nearest <strong>Vision Academy Center</strong> and make the cash payment to activate your service.
            </p>
          </div>

          <p>If you have questions, reply to this email or contact our support team.</p>

          <p style="margin-top:30px;">Regards,<br>The CSWithBari Team</p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f1f3f5;text-align:center;padding:15px;font-size:12px;color:#777;">
          © ${new Date().getFullYear()} CSWithBari • Payment Receipt Email
        </td>
      </tr>

    </table>
  </div>
  `;
}
