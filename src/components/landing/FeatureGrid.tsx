import React from 'react';
import { motion } from 'motion/react';
import { ScanLine, LayoutDashboard, Search, Users, FileSpreadsheet, FileText, Shield, LogIn } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/animations';

const features = [
  {
    icon: ScanLine,
    title: 'AI Business Card Scanner',
    description: 'Snap a photo and let Gemini AI extract every detail automatically.',
    color: '#7B3FF2',
  },
  {
    icon: LayoutDashboard,
    title: 'Lead Dashboard',
    description: 'All your expo contacts organized in one beautiful dashboard.',
    color: '#2563EB',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find any contact instantly by name, company, or email.',
    color: '#F59E0B',
  },
  {
    icon: Users,
    title: 'Contact Organization',
    description: 'Tag, categorize, and manage your leads with ease.',
    color: '#10B981',
  },
  {
    icon: FileSpreadsheet,
    title: 'Excel Export',
    description: 'One-click export to .xlsx files for your CRM or team.',
    color: '#EF4444',
  },
  {
    icon: FileText,
    title: 'CSV Export',
    description: 'Standard CSV format compatible with any tool or platform.',
    color: '#8B5CF6',
  },
  {
    icon: LogIn,
    title: 'Google Sign In',
    description: 'Secure one-click authentication with your Google account.',
    color: '#3B82F6',
  },
  {
    icon: Shield,
    title: 'Secure Cloud Storage',
    description: 'Your data is encrypted and stored securely on Firebase.',
    color: '#06B6D4',
  },
];

export default function FeatureGrid() {
  return (
    <section className="section-padding relative overflow-hidden" style={{ borderTop: '1px solid var(--color-border)' }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-5xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <p className="section-label">Features</p>
          <h2 className="section-title">Everything you need at an expo</h2>
          <p className="section-subtitle mx-auto mt-4">
            A complete toolkit to capture, organize, and export every lead you meet.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -2 }}
                className="glass-card flex items-start gap-5 p-6 cursor-default"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}18, ${feature.color}08)`,
                    border: `1px solid ${feature.color}25`,
                  }}
                >
                  <Icon size={20} style={{ color: feature.color }} />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1 text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
