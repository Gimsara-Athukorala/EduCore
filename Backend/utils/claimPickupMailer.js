const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const buildTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
};

const buildEmailHtml = (claim, foundItem, pickupCode, qrDataUrl) => {
  const pickupLocation = foundItem?.location || claim.itemLocation || 'designated pickup area';
  const itemDate = claim.itemDate ? new Date(claim.itemDate).toLocaleDateString() : 'Unknown date';

  return `
    <div style="font-family: Arial, sans-serif; color: #24292f; line-height: 1.5; max-width: 600px;">
      <h2 style="color: #0d4a85;">Your claim has been approved</h2>
      <p>Hi ${claim.claimantFullName},</p>
      <p>Your claim for the following found item has been approved by the EduCore administration team.</p>

      <h3 style="margin-bottom: 4px;">Item details</h3>
      <ul style="padding-left: 20px;">
        <li><strong>Item:</strong> ${claim.itemName}</li>
        <li><strong>Category:</strong> ${claim.itemCategory}</li>
        <li><strong>Found at:</strong> ${pickupLocation}</li>
        <li><strong>Found on:</strong> ${itemDate}</li>
      </ul>

      <h3 style="margin-bottom: 4px;">Pickup instructions</h3>
      <p>Please bring a valid ID along with the pickup code below when collecting your item.</p>

      <div style="background: #f6f8fa; border: 1px solid #d1d5da; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Pickup Code</strong></p>
        <p style="font-size: 18px; letter-spacing: 0.04em; font-weight: 700;">${pickupCode}</p>
      </div>

      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${qrDataUrl}" alt="Pickup QR Code" style="max-width: 240px; width: 100%; height: auto; border: 1px solid #d1d5da; padding: 8px; border-radius: 12px;" />
      </div>

      <p>If you have any questions, reply to this email or contact the administration office.</p>
      <p>Thanks,<br/>EduCore Lost & Found Team</p>
    </div>
  `;
};

const sendClaimApprovalEmail = async (claim, foundItem) => {
  const transporter = buildTransporter();

  if (!transporter) {
    return {
      sent: false,
      reason: 'SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.'
    };
  }

  try {
    const pickupCode = claim.pickupCode || `PICKUP-${claim._id.toString().slice(-6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const qrPayload = {
      claimId: claim._id.toString(),
      pickupCode,
      studentId: claim.claimantStudentId,
      itemName: claim.itemName,
      issuedAt: new Date().toISOString()
    };

    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));
    const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;

    const mailOptions = {
      from: mailFrom,
      to: claim.claimantEmail,
      subject: `EduCore claim approved: ${claim.itemName}`,
      html: buildEmailHtml(claim, foundItem, pickupCode, qrDataUrl)
    };

    await transporter.sendMail(mailOptions);

    return {
      sent: true,
      pickupCode,
      sentAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending claim approval email:', {
      message: error.message,
      stack: error.stack,
      claimId: claim._id?.toString(),
      claimantEmail: claim.claimantEmail,
      smtpHost: process.env.SMTP_HOST,
      smtpUser: process.env.SMTP_USER
    });

    return {
      sent: false,
      error: error.message || 'Unknown error while sending email',
      stack: error.stack
    };
  }
};

module.exports = {
  sendClaimApprovalEmail
};
