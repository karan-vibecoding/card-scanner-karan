import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, BookOpen, Coffee, Laptop, Smartphone, Brain } from 'lucide-react';
import { fadeUp, slideInLeft, slideInRight, staggerContainer, staggerContainerSlow, viewportOnce } from '../../lib/animations';

const bullets = [
  'You forgot who needed a quote.',
  'You forgot which founder wanted a demo.',
  'You forgot which investor asked to reconnect.',
  'You forgot who was actually interested.',
];

const overwhelmItems = [
  { icon: CreditCard, label: 'Cards', x: '15%', y: '20%', delay: 0 },
  { icon: BookOpen, label: 'Notes', x: '70%', y: '15%', delay: 0.5 },
  { icon: Coffee, label: 'Coffee', x: '10%', y: '65%', delay: 1 },
  { icon: Laptop, label: 'Laptop', x: '60%', y: '60%', delay: 1.5 },
  { icon: Smartphone, label: 'Phone', x: '40%', y: '75%', delay: 2 },
];

export default function ProblemSection() {
  return (
    <section className="section-padding relative overflow-hidden" style={{ borderTop: '1px solid var(--color-border)' }}>
      {/* Background blob */}
      <div className="blob blob-violet absolute animate-glow-pulse" style={{ top: '20%', right: '5%', width: 400, height: 400 }} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <p className="section-label">The Problem</p>
          <h2 className="section-title">Every Expo Ends The Same Way</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Illustration */}
          <motion.div
            variants={slideInLeft}
            className="relative aspect-square max-w-md mx-auto w-full"
          >
            {/* Center person silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(123,63,242,0.15), rgba(37,99,235,0.1))',
                  border: '1px solid rgba(123,63,242,0.2)',
                }}
              >
                <Brain size={36} style={{ color: 'rgba(255,255,255,0.3)' }} />
              </div>
            </div>

            {/* Floating overwhelm items */}
            {overwhelmItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  className="absolute animate-float"
                  style={{
                    left: item.x,
                    top: item.y,
                    animationDelay: `${item.delay}s`,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ delay: item.delay * 0.3, duration: 0.5 }}
                >
                  <div
                    className="glass-card p-3 flex flex-col items-center gap-1.5"
                    style={{ borderRadius: 16 }}
                  >
                    <Icon size={20} style={{ color: '#a78bfa' }} />
                    <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Connecting dotted lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
              <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="white" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="75%" y2="20%" stroke="white" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="15%" y2="70%" stroke="white" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="65%" y2="65%" stroke="white" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="45%" y2="80%" stroke="white" strokeDasharray="4 4" />
            </svg>
          </motion.div>

          {/* Right — Copy */}
          <motion.div variants={slideInRight}>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
              You met dozens of incredible people.
            </h3>
            <p className="text-xl font-semibold mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              But by Monday...
            </p>

            <motion.div
              variants={staggerContainerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex flex-col gap-5 mb-10"
            >
              {bullets.map((bullet, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                    style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                    }}
                  >
                    <span className="text-xs" style={{ color: '#f87171' }}>✕</span>
                  </div>
                  <p className="text-base sm:text-lg" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {bullet}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl font-semibold leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Every forgotten conversation is a{' '}
              <span className="gradient-text font-bold">missed opportunity.</span>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
