import React from 'react';
import { motion } from 'motion/react';
import { Building2, Users, Rocket, Briefcase, Handshake, Target } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/animations';

const events = [
  { icon: Building2, title: 'Trade Shows' },
  { icon: Users, title: 'Conferences' },
  { icon: Rocket, title: 'Startup Events' },
  { icon: Briefcase, title: 'B2B Exhibitions' },
  { icon: Handshake, title: 'Networking Meetups' },
  { icon: Target, title: 'Sales Teams' },
];

export default function WorksPerfectFor() {
  return (
    <section className="section-padding relative overflow-hidden" style={{ borderTop: '1px solid var(--color-border)' }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <p className="section-label">Perfect For</p>
          <h2 className="section-title">Perfect for every networking event</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {events.map((event, i) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={event.title}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="glass-card flex flex-col items-center gap-4 p-6 text-center cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(123,63,242,0.15), rgba(37,99,235,0.15))',
                    border: '1px solid rgba(123,63,242,0.2)',
                  }}
                >
                  <Icon size={22} style={{ color: '#a78bfa' }} />
                </div>
                <span className="text-sm font-semibold text-white">{event.title}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
