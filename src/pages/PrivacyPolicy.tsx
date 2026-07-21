import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: '80px 5%', maxWidth: 800, margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>
      <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: 40, color: '#fff' }}>Privacy Policy</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 16, lineHeight: 1.8 }}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginTop: 16 }}>1. Information We Collect</h2>
        <p>When you use Expo Snap, we may collect information such as your name, email address (via Google Authentication), and the images you upload for business card scanning. We also collect the extracted text data from those cards.</p>
        
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginTop: 16 }}>2. How We Use Your Information</h2>
        <p>We use your information solely to provide and improve the Expo Snap service. The images you upload are processed by our AI to extract contact details. Your extracted contacts are securely stored in your account so you can manage and export them.</p>
        
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginTop: 16 }}>3. Data Sharing</h2>
        <p>We do not sell, rent, or share your personal data or your scanned contacts with third parties for marketing purposes. Images are securely sent to Google Gemini for processing and are not used to train our AI models without your explicit consent.</p>
        
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginTop: 16 }}>4. Security</h2>
        <p>We take security seriously. All data is transmitted over secure connections (HTTPS) and stored in secure databases. We use Google Authentication to ensure your account is protected.</p>
        
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginTop: 16 }}>5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at support@exposnap.app.</p>
      </div>
    </div>
  );
}
