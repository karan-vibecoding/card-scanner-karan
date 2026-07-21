import React from 'react';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/animations';

const audiences = [
  {
    emoji: '👨‍💼',
    title: 'Exhibitors',
    description: 'Capture hundreds of leads without slowing down your booth conversations.',
    gradient: 'linear-gradient(135deg, rgba(123,63,242,0.08), rgba(123,63,242,0.02))',
    border: 'rgba(123,63,242,0.15)',
  },
  {
    emoji: '🚀',
    title: 'Founders',
    description: 'Remember every meaningful conversation with investors, partners, and customers.',
    gradient: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(37,99,235,0.02))',
    border: 'rgba(37,99,235,0.15)',
  },
  {
    emoji: '💼',
    title: 'Sales Teams',
    description: 'Build your pipeline faster. Export leads directly into your CRM after every event.',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))',
    border: 'rgba(245,158,11,0.15)',
  },
  {
    emoji: '🏢',
    title: 'Procurement Teams',
    description: 'Compare vendors and organize supplier information from every exhibition.',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))',
    border: 'rgba(16,185,129,0.15)',
  },
];

export default function BuiltForSection() {
  return (
    <section className="section-padding relative overflow-hidden" style={{ borderTop: '1px solid var(--color-border)' }}>
      <div className="blob blob-blue absolute" style={{ top: '20%', left: '10%', width: 350, height: 350, opacity: 0.4 }} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <p className="section-label">Built For</p>
          <h2 className="section-title">Designed for people who network</h2>
          <p className="section-subtitle mx-auto mt-4">
            Whether you're collecting 10 cards or 1,000 — Expo Snap scales with you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {audiences.map((audience) => (
            <motion.div
              key={audience.title}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-7 cursor-default transition-all duration-300"
              style={{
                background: audience.gradient,
                border: `1px solid ${audience.border}`,
              }}
            >
              <span className="text-4xl mb-5 block">{audience.emoji}</span>
              <h3 className="text-lg font-bold mb-2 text-white">{audience.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {audience.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
