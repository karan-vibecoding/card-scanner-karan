import React from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, FolderOutput } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/animations';

const steps = [
  {
    number: '01',
    title: 'Snap the card',
    description: 'Take a quick photo of any business card at your expo booth. Works with any layout, language, or design.',
    icon: Camera,
    color: '#7B3FF2',
  },
  {
    number: '02',
    title: 'AI extracts every detail',
    description: 'Gemini AI instantly reads and extracts names, emails, phone numbers, companies, websites, and social links.',
    icon: Sparkles,
    color: '#2563EB',
  },
  {
    number: '03',
    title: 'Organize and export',
    description: 'All your leads in one dashboard. Search, filter, tag, and export to Excel or CSV with a single click.',
    icon: FolderOutput,
    color: '#10B981',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden" style={{ borderTop: '1px solid var(--color-border)' }}>
      <div className="blob blob-blue absolute animate-glow-pulse" style={{ top: '30%', left: '5%', width: 350, height: 350 }} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-5xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-20">
          <p className="section-label">How it works</p>
          <h2 className="section-title">Three steps to capture every lead</h2>
        </motion.div>

        <div className="relative">
          {/* Vertical connecting line — desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, rgba(123,63,242,0.3), rgba(37,99,235,0.3), rgba(16,185,129,0.3))' }} />

          <div className="flex flex-col gap-16 md:gap-24">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
                    isEven ? '' : 'md:direction-rtl'
                  }`}
                >
                  {/* Step number node on the line */}
                  <div
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full items-center justify-center z-10 text-sm font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                      border: `2px solid ${step.color}50`,
                      color: step.color,
                      boxShadow: `0 0 30px ${step.color}20`,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Content side */}
                  <div className={`${isEven ? 'md:text-right md:pr-16' : 'md:col-start-2 md:pl-16'}`}>
                    <div className={`flex items-center gap-3 mb-4 ${isEven ? 'md:justify-end' : ''}`}>
                      <span
                        className="md:hidden text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          background: `${step.color}15`,
                          color: step.color,
                          border: `1px solid ${step.color}30`,
                        }}
                      >
                        Step {step.number}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3">{step.title}</h3>
                    <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {step.description}
                    </p>
                  </div>

                  {/* Illustration side */}
                  <div
                    className={`${isEven ? 'md:col-start-2 md:pl-16' : 'md:col-start-1 md:row-start-1 md:pr-16'} flex ${
                      isEven ? 'md:justify-start' : 'md:justify-end'
                    } justify-center`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}12, ${step.color}05)`,
                        border: `1px solid ${step.color}25`,
                      }}
                    >
                      <Icon size={48} style={{ color: step.color, opacity: 0.8 }} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
