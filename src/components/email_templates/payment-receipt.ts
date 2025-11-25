import { LOGO_URL } from "./config";

export function paymentReceiptEmail({
  name,
  itemName,
  totalPrice,
  orderId,
  paymentMethod,
}: {
  name: string;
  itemName: string;
  totalPrice: string;
  orderId: string;
  paymentMethod: "bank" | "cash";
}) {
  const isBank = paymentMethod === "bank";

  // --- HTML CONTENT BLOCKS ---

  const bankDetailsHTML = `
    <div style="background:#f8f9fa;border:1px solid #e9ecef;border-radius:6px;padding:15px;margin-bottom:20px;">
      <h3 style="margin-top:0;font-size:16px;color:#333;border-bottom:1px solid #ddd;padding-bottom:10px;">🏦 Bank Account Details</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#555;">
        <tr><td style="padding:5px 0;">Bank Name:</td><td style="text-align:right;font-weight:bold;color:#333;">Allied Bank Limited</td></tr>
        <tr><td style="padding:5px 0;">Account Name:</td><td style="text-align:right;font-weight:bold;color:#333;">Umaid Shafiq</td></tr>
        <tr><td style="padding:5px 0;">Account Number:</td><td style="text-align:right;font-weight:bold;color:#333;">0010149534160019</td></tr>
        <tr><td style="padding:5px 0;">IBAN:</td><td style="text-align:right;font-weight:bold;color:#333;">PK13ABPA0010149534160019</td></tr>
        <tr><td style="padding:5px 0;">Branch:</td><td style="text-align:right;font-weight:bold;color:#333;">Wapda Town, Lahore</td></tr>
      </table>
    </div>
    
    <div style="margin-top:20px;padding:12px;background:#e8f0ff;border-left:4px solid #0b6efd;font-size:14px;color:#0b377d;">
      <strong>Next Step:</strong> Please send a screenshot of the payment receipt along with your Order ID <strong>(${orderId})</strong> to our WhatsApp number: +92 332 4040614.
    </div>
  `;

  const cashDetailsHTML = `
    <h3 style="margin-top:25px;margin-bottom:15px;font-size:16px;border-bottom:2px solid #eee;padding-bottom:10px;">📍 Visit Any Center Below</h3>
    
    <!-- Center 1 -->
    <div style="margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #f0f0f0;">
      <p style="margin:0 0 4px 0;font-weight:bold;color:#333;">Vision Academy - Johar Town</p>
      <p style="margin:0 0 8px 0;font-size:13px;color:#555;">10, Block L, Johar Town, Lahore</p>
      <a href="https://www.google.com/maps/dir//Vision+Academy,+10,+Block+L+Johar+Town,+Lahore/" style="color:#0b6efd;font-size:13px;text-decoration:none;">Get Directions &rarr;</a>
    </div>

    <!-- Center 2 -->
    <div style="margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #f0f0f0;">
      <p style="margin:0 0 4px 0;font-weight:bold;color:#333;">Vision Academy - Gulberg</p>
      <p style="margin:0 0 8px 0;font-size:13px;color:#555;">47-A, Chaudhary Muhammad Yousaf Rd, Block A-2, Gulberg III, Lahore</p>
      <a href="https://www.google.com/maps/dir/?api=1&destination=47+A+Chaudhary+Muhammad+Yousaf+Rd+Block+A-2+Gulberg+III+Lahore" style="color:#0b6efd;font-size:13px;text-decoration:none;">Get Directions &rarr;</a>
    </div>

    <!-- Center 3 -->
    <div style="margin-bottom:15px;">
      <p style="margin:0 0 4px 0;font-weight:bold;color:#333;">Vision Academy - Bankers Town</p>
      <p style="margin:0 0 8px 0;font-size:13px;color:#555;">Block B, Bankers Town, Lahore</p>
      <a href="https://www.google.com/maps/dir//C9XV%2BVFQ,+Bankers+Co-operative+Society+Block+B+Bankers+Town,+Lahore/" style="color:#0b6efd;font-size:13px;text-decoration:none;">Get Directions &rarr;</a>
    </div>

    <div style="margin-top:25px;padding:12px;background:#fff3cd;border:1px solid #ffeeba;border-radius:4px;color:#856404;font-size:13px;">
      <strong>Note:</strong> Please show your Order ID <strong>(${orderId})</strong> at the counter when making the payment.
    </div>
  `;

  return `
  <div style="background:#f4f6f9;padding:20px;font-family:Arial,sans-serif;">
    <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow: 0 2px 8px rgba(0,0,0,0.05);">

      <!-- Logo -->
      <tr>
        <td align="center" style="padding:25px 20px;">
          <img src="${LOGO_URL}" width="120" alt="CSWithBari Logo" style="display:block;margin:auto;" />
        </td>
      </tr>

      <!-- Header -->
      <tr>
        <td style="background:#0b6efd;color:#fff;text-align:center;padding:25px;">
          <h2 style="margin:0;font-size:22px;font-weight:600;">Payment Instructions</h2>
          <p style="margin:5px 0 0 0;opacity:0.9;font-size:14px;">${isBank ? 'Bank Transfer Details' : 'Cash Payment at Center'}</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px;color:#333;font-size:15px;line-height:1.6;">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for your order. To complete your purchase of <strong>${itemName}</strong>, please ${isBank ? 'transfer the amount to the bank account below' : 'visit one of our Vision Academy centers to make the cash payment'}.</p>

          <!-- Order Summary Box -->
          <div style="background:#f8f9fa;border:1px solid #e9ecef;border-radius:6px;padding:15px;margin:20px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr>
                <td style="color:#6c757d;padding-bottom:5px;">Order ID:</td>
                <td style="text-align:right;font-weight:bold;color:#0b6efd;padding-bottom:5px;">${orderId}</td>
              </tr>
              <tr>
                <td style="color:#6c757d;padding-top:5px;border-top:1px solid #e9ecef;">Total Amount:</td>
                <td style="text-align:right;font-weight:bold;font-size:16px;padding-top:5px;border-top:1px solid #e9ecef;">${totalPrice}</td>
              </tr>
            </table>
          </div>

          <!-- Dynamic Content Based on Method -->
          ${isBank ? bankDetailsHTML : cashDetailsHTML}

          <p style="margin-top:30px;font-size:14px;color:#555;">Regards,<br>The CSWithBari Team</p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f8f9fa;text-align:center;padding:20px;font-size:12px;color:#868e96;border-top:1px solid #e9ecef;">
          &copy; ${new Date().getFullYear()} CSWithBari. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `;
}