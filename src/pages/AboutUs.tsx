import React from 'react';

export default function AboutUs() {
  return (
    <div style={{ padding: '80px 5%', maxWidth: 800, margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>
      <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: 40, color: '#fff' }}>About Us</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 16, lineHeight: 1.8 }}>
        <p>
          Welcome to <strong>Expo Snap</strong>, the ultimate tool for capturing and managing leads at your events.
        </p>
        
        <p>
          We built Expo Snap out of frustration. After attending countless trade shows, conferences, and expos, we always came home with pockets full of business cards. Days later, we'd spend hours manually typing those names and emails into our CRM, inevitably making typos or completely forgetting who certain people were.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginTop: 16 }}>Our Mission</h2>
        <p>
          Our mission is to eliminate manual data entry for sales professionals and founders. We believe your time at an event should be spent networking and building relationships, not doing data entry.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginTop: 16 }}>How We Do It</h2>
        <p>
          By leveraging the power of Google's Gemini Vision AI, Expo Snap can instantly read any business card, no matter how complex the layout, and extract perfectly structured data. We've optimized the app to be lightning-fast on mobile, so you can snap a card while still talking to the prospect.
        </p>
        
        <p style={{ marginTop: 20 }}>
          Thank you for trusting us with your leads. Happy networking!
        </p>
      </div>
    </div>
  );
}
