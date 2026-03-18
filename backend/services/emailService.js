const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // For development, we'll create a test account on ethereal.email
    this.initializeTransporter();
  }

  async initializeTransporter() {
    if (process.env.NODE_ENV === 'production') {
      // Use real email service in production
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Create ethereal test account for development
      try {
        const testAccount = await nodemailer.createTestAccount();
        console.log('📧 Ethereal Email Test Account Created:');
        console.log('   User:', testAccount.user);
        console.log('   Pass:', testAccount.pass);
        console.log('   Preview URL: https://ethereal.email/login\n');

        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        console.log('✅ Email service initialized with Ethereal');
      } catch (error) {
        console.error('Failed to create ethereal account:', error);
      }
    }
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: '"RideShare Support" <support@rideshare.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">RideShare</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Password Reset Request</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">We received a request to reset your password for your RideShare account. Click the button below to set a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 14px 28px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-size: 16px;
                        font-weight: bold;
                        display: inline-block;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">Or copy this link to your browser:</p>
            <div style="background: #fff; padding: 15px; border-radius: 5px; border: 1px solid #e0e0e0; word-break: break-all; font-size: 14px;">
              ${resetUrl}
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              ⏰ This link will expire in <strong>1 hour</strong>.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #999;">
              If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </p>
            
            <p style="font-size: 14px; color: #999; margin-top: 20px;">
              Best regards,<br>
              The RideShare Team
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RideShare. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </body>
        </html>
      `,
      text: `Reset your password by visiting: ${resetUrl}\n\nThis link will expire in 1 hour.`, // Plain text version
    };

    try {
      if (!this.transporter) {
        await this.initializeTransporter();
      }
      
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent');
      
      // For ethereal, log the preview URL
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      
      return info;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();