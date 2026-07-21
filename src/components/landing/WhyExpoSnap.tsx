import React from 'react';
import { motion } from 'motion/react';
import { Zap, Brain, FolderSearch, Upload } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/animations';

const features = [
  {
    icon: Zap,
    emoji: '⚡',
    title: 'Scan in Seconds',
    description: 'No manual typing. Just snap and go.',
    color: '#F59E0B',
  },
  {
    icon: Brain,
    emoji: '🧠',
    title: 'AI Powered',
    description: 'Automatically extracts names, emails, phones, companies, websites.',
    color: '#7B3FF2',
  },
  {
    icon: FolderSearch,
    emoji: '📂',
    title: 'Stay Organized',
    description: 'Search every contact instantly. Never lose a lead again.',
    color: '#2563EB',
  },
  {
    icon: Upload,
    emoji: '📤',
    title: 'Export Anywhere',
    description: 'Download clean Excel or CSV files ready for your CRM.',
    color: '#10B981',
  },
];

export default function WhyExpoSnap() {
  return (
    <section id="features" className="section-padding relative overflow-hidden" style={{ borderTop: '1px solid var(--color-border)' }}>
      <div className="blob blob-violet absolute" style={{ bottom: '10%', right: '10%', width: 400, height: 400, opacity: 0.5 }} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <p className="section-label">Why Expo Snap</p>
          <h2 className="section-title">Everything you need. Nothing you don't.</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="gradient-border-card p-7 cursor-default group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}18, ${feature.color}08)`,
                    border: `1px solid ${feature.color}30`,
                  }}
                >
                  <Icon size={24} style={{ color: feature.color }} />
                </div>

                <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
