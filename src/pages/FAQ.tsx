import React from 'react';

export default function FAQ() {
  const faqs = [
    {
      q: "How accurate is the AI scanner?",
      a: "Our scanner is powered by Google's Gemini Vision AI, one of the most advanced models available. It boasts a 99%+ accuracy rate and can handle complex layouts, multiple languages, and unusual fonts."
    },
    {
      q: "Is my data secure?",
      a: "Yes. All data is transmitted securely via HTTPS and stored in a secure Google Firebase database. We do not sell your leads or share them with any third parties."
    },
    {
      q: "Can I export my contacts to my CRM?",
      a: "Absolutely! You can export all your scanned cards to a CSV or Excel file with a single click from your dashboard. These files can easily be imported into HubSpot, Salesforce, Pipedrive, or any other CRM."
    },
    {
      q: "Is there a mobile app?",
      a: "Expo Snap is a Progressive Web App (PWA) optimized for mobile browsers. You don't need to download anything from an app store. Simply open exposnap.app on your phone's browser, sign in, and start scanning!"
    }
  ];

  return (
    <div style={{ padding: '80px 5%', maxWidth: 800, margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>
      <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: 16, color: '#fff' }}>Frequently Asked Questions</h1>
      <p style={{ fontSize: 18, marginBottom: 48, color: 'rgba(255,255,255,0.5)' }}>Everything you need to know about Expo Snap.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{faq.q}</h3>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
