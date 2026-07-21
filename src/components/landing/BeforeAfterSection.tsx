import React from 'react';
import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';
import { fadeUp, slideInLeft, slideInRight, staggerContainer, staggerContainerSlow, viewportOnce } from '../../lib/animations';

const beforeItems = [
  'Messy stack of cards',
  'Manual typing',
  'Lost context',
  'Cold leads',
  'Forgotten conversations',
];

const afterItems = [
  'Organized contacts',
  'Instant AI scanning',
  'Everything searchable',
  'CRM-ready exports',
  'Follow-up on time',
];

export default function BeforeAfterSection() {
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
          <p className="section-label">The Difference</p>
          <h2 className="section-title">Before vs After Expo Snap</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 relative">
          {/* Before Column */}
          <motion.div
            variants={slideInLeft}
            className="glass-card p-8 sm:p-10 md:rounded-r-none"
            style={{
              background: 'rgba(239, 68, 68, 0.03)',
              borderColor: 'rgba(239, 68, 68, 0.1)',
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <X size={18} style={{ color: '#f87171' }} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: '#f87171' }}>
                Before Expo Snap
              </h3>
            </div>

            <motion.div
              variants={staggerContainerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex flex-col gap-5"
            >
              {beforeItems.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-center gap-4"
                >
                  <div
                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(239, 68, 68, 0.15)' }}
                  >
                    <X size={11} style={{ color: '#f87171' }} />
                  </div>
                  <span className="text-sm sm:text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Center Divider — Desktop only */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-10">
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(to bottom, rgba(239,68,68,0.3), rgba(123,63,242,0.4), rgba(16,185,129,0.3))',
              }}
            />
            {/* VS Badge */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: 'var(--gradient-brand)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(123,63,242,0.4)',
              }}
            >
              VS
            </div>
          </div>

          {/* After Column */}
          <motion.div
            variants={slideInRight}
            className="glass-card p-8 sm:p-10 md:rounded-l-none"
            style={{
              background: 'rgba(16, 185, 129, 0.03)',
              borderColor: 'rgba(16, 185, 129, 0.1)',
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <Check size={18} style={{ color: '#34d399' }} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: '#34d399' }}>
                After Expo Snap
              </h3>
            </div>

            <motion.div
              variants={staggerContainerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex flex-col gap-5"
            >
              {afterItems.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-center gap-4"
                >
                  <div
                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(16, 185, 129, 0.15)' }}
                  >
                    <Check size={11} style={{ color: '#34d399' }} />
                  </div>
                  <span className="text-sm sm:text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
