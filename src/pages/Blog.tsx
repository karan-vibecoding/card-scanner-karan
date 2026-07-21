import React from 'react';

export default function Blog() {
  const posts = [
    {
      title: "How to maximize your ROI at your next trade show",
      date: "Oct 15, 2025",
      excerpt: "Attending a trade show is an investment. Learn how capturing leads instantly can increase your post-event conversion rate by up to 40%."
    },
    {
      title: "The problem with manual data entry in sales",
      date: "Sep 22, 2025",
      excerpt: "Manual data entry costs businesses billions in lost productivity. Discover why automation is the key to scaling your sales efforts."
    },
    {
      title: "Introducing Expo Snap: The AI business card scanner",
      date: "Aug 10, 2025",
      excerpt: "We built Expo Snap because we were tired of losing leads. Read our founder's story and see how the app works."
    }
  ];

  return (
    <div style={{ padding: '80px 5%', maxWidth: 900, margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>
      <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: 16, color: '#fff' }}>Blog</h1>
      <p style={{ fontSize: 18, marginBottom: 48, color: 'rgba(255,255,255,0.5)' }}>Insights, tips, and news from the Expo Snap team.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {posts.map((post, i) => (
          <article key={i} style={{ padding: 32, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
            <p style={{ fontSize: 14, color: '#a78bfa', marginBottom: 8, fontWeight: 600 }}>{post.date}</p>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{post.title}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>{post.excerpt}</p>
            <button style={{ background: 'transparent', color: '#fff', border: 'none', padding: 0, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              Read more <span style={{ color: '#6366f1' }}>→</span>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
