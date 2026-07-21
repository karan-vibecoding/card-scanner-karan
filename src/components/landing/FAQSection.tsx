import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/animations';

const faqs = [
  {
    question: 'How accurate is the AI scanner?',
    answer: 'Our scanner is powered by Google\'s Gemini Vision AI, one of the most advanced models available. It boasts a 99%+ accuracy rate and can handle complex layouts, multiple languages, and unusual fonts with ease.',
  },
  {
    question: 'Can I export my contacts?',
    answer: 'Absolutely! You can export all your scanned cards to CSV or Excel files with a single click from your dashboard. These files can easily be imported into HubSpot, Salesforce, Pipedrive, or any other CRM.',
  },
  {
    question: 'Can I scan multiple cards at once?',
    answer: 'You can scan cards one at a time for maximum accuracy. The process is incredibly fast — snap a photo, and the AI extracts all details in under 3 seconds. You can scan dozens of cards in just a few minutes.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. All data is transmitted securely via HTTPS and stored in Google Firebase with enterprise-grade security. We do not sell your data or share it with third parties. Your leads belong to you.',
  },
  {
    question: 'Do I need to install anything?',
    answer: 'No! Expo Snap is a Progressive Web App (PWA) that works directly in your browser. Simply open exposnap.app on your phone or laptop, sign in with Google, and start scanning. No app store download required.',
  },
  {
    question: 'Can teams use Expo Snap?',
    answer: 'Each team member can sign in with their own Google account to capture leads individually. After the event, everyone can export their leads and combine them in your CRM or a shared spreadsheet.',
  },
];

interface FAQItemProps {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isOpen ? 'rgba(123,63,242,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isOpen ? 'rgba(123,63,242,0.2)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className={`text-base font-semibold pr-4 ${isOpen ? 'gradient-text' : 'text-white'}`}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0"
        >
          <ChevronDown
            size={18}
            style={{ color: isOpen ? '#a78bfa' : 'rgba(255,255,255,0.3)' }}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-6 pb-6">
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding relative overflow-hidden" style={{ borderTop: '1px solid var(--color-border)' }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <p className="section-label">FAQ</p>
          <h2 className="section-title">Frequently asked questions</h2>
          <p className="section-subtitle mx-auto mt-4">
            Everything you need to know about Expo Snap.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen ? 'rgba(123,63,242,0.04)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isOpen ? 'rgba(123,63,242,0.2)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  <span className={`text-base font-semibold pr-4 ${isOpen ? 'gradient-text' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0"
                  >
                    <ChevronDown
                      size={18}
                      style={{ color: isOpen ? '#a78bfa' : 'rgba(255,255,255,0.3)' }}
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6">
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
