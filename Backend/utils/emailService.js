const {
  emailjsServiceId,
  emailjsTemplateId,
  emailjsPublicKey,
  emailjsPrivateKey,
  emailjsFromName,
  nodeEnv,
} = require('../config/env');

const hasEmailJsConfig = Boolean(emailjsServiceId && emailjsTemplateId && emailjsPublicKey);

const getFromName = () => emailjsFromName || 'EduCore Lost & Found';

const sendClaimApprovedEmail = async ({ to, claimantName, itemName, pickupCode }) => {
  if (!to) {
    return { skipped: true, reason: 'Missing recipient email' };
  }

  if (!hasEmailJsConfig) {
    if (nodeEnv !== 'test') {
      console.warn('EmailJS settings are not configured. Skipping claim approval email.');
    }
    return { skipped: true, reason: 'EmailJS not configured' };
  }

  if (!emailjsPrivateKey) {
    if (nodeEnv !== 'test') {
      console.warn('EmailJS private key is missing. Strict mode requires CLAIMANT_EMAILJS_PRIVATE_KEY.');
    }
    return { skipped: true, reason: 'EmailJS private key missing' };
  }

  const subject = `Your item has been found - ${itemName || 'EduCore Lost & Found'}`;
  const safeClaimantName = claimantName || 'Student';
  const safeItemName = itemName || 'your item';
  const pickupLine = pickupCode ? `<p><strong>Pickup Code:</strong> ${pickupCode}</p>` : '';

  const text = [
    `Hello ${safeClaimantName},`,
    '',
    `Your item has been found: ${safeItemName}.`,
    'Please collect it from the security desk.',
    pickupCode ? `Pickup Code: ${pickupCode}` : '',
    '',
    'Regards,',
    'EduCore Lost & Found Team',
  ].filter(Boolean).join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
      <h2 style="color:#1d4ed8">Your item has been found</h2>
      <p>Hello ${safeClaimantName},</p>
      <p>Your item <strong>${safeItemName}</strong> has been found.</p>
      <p>Please collect it from the security desk.</p>
      ${pickupLine}
      <p>Regards,<br/>EduCore Lost & Found Team</p>
    </div>
  `;

  const templateParams = {
    to_email: to,
    to_name: safeClaimantName,
    claimant_name: safeClaimantName,
    item_name: safeItemName,
    pickup_code: pickupCode || '',
    message: text,
    html_message: html,
    from_name: getFromName(),
    subject,
  };

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: emailjsServiceId,
      template_id: emailjsTemplateId,
      user_id: emailjsPublicKey,
      accessToken: emailjsPrivateKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS send failed: ${response.status} ${errorText}`);
  }

  return { skipped: false };
};

module.exports = {
  sendClaimApprovedEmail,
};