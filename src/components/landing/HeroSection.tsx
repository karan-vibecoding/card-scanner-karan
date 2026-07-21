import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CreditCard, Scan, UserPlus, LayoutDashboard, FileSpreadsheet } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/animations';

const flowSteps = [
  { icon: CreditCard, label: 'Business Card', color: '#7B3FF2' },
  { icon: Scan, label: 'AI Scan', color: '#2563EB' },
  { icon: UserPlus, label: 'Contact Created', color: '#10B981' },
  { icon: LayoutDashboard, label: 'Lead Dashboard', color: '#F59E0B' },
  { icon: FileSpreadsheet, label: 'Export to Excel', color: '#EF4444' },
];

function AnimatedProductFlow() {
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % flowSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-3 py-8">
      {/* Glow behind active card */}
      <div
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-20 transition-all duration-700"
        style={{
          background: flowSteps[activeStep].color,
          top: `${activeStep * 20}%`,
        }}
      />

      {flowSteps.map((step, i) => {
        const Icon = step.icon;
        const isActive = i === activeStep;
        const isPast = i < activeStep;

        return (
          <React.Fragment key={step.label}>
            <motion.div
              animate={{
                scale: isActive ? 1.08 : 0.95,
                opacity: isActive ? 1 : isPast ? 0.4 : 0.5,
                y: isActive ? -4 : 0,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center gap-4 px-5 py-3.5 rounded-2xl w-full max-w-[260px]"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${step.color}18, ${step.color}08)`
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isActive ? `${step.color}40` : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${step.color}30, ${step.color}15)`
                    : 'rgba(255,255,255,0.05)',
                }}
              >
                <Icon
                  size={18}
                  style={{ color: isActive ? step.color : 'rgba(255,255,255,0.3)' }}
                />
              </div>
              <span
                className="text-sm font-semibold"
                style={{
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
                }}
              >
                {step.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute -right-1 w-2 h-2 rounded-full"
                  style={{ background: step.color }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>

            {i < flowSteps.length - 1 && (
              <div className="flex flex-col items-center h-4">
                <motion.div
                  animate={{ opacity: i === activeStep ? 1 : 0.15 }}
                  className="w-px h-full"
                  style={{
                    background: i === activeStep
                      ? `linear-gradient(to bottom, ${step.color}60, ${flowSteps[i + 1].color}60)`
                      : 'rgba(255,255,255,0.1)',
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function HeroSection() {
  const { signIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signIn();
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ padding: 'clamp(80px, 12vh, 140px) 5% clamp(60px, 10vh, 100px)' }}
    >
      {/* Background Blobs */}
      <div className="blob blob-violet absolute animate-glow-pulse" style={{ top: '5%', left: '15%', width: 500, height: 500 }} />
      <div className="blob blob-blue absolute animate-glow-pulse" style={{ top: '15%', right: '10%', width: 400, height: 400, animationDelay: '2s' }} />
      <div className="blob blob-violet absolute" style={{ bottom: '0%', right: '30%', width: 300, height: 300, opacity: 0.5 }} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
      >
        {/* Left — Copy */}
        <div>
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
            style={{
              background: 'rgba(123, 63, 242, 0.1)',
              border: '1px solid rgba(123, 63, 242, 0.25)',
              color: '#a78bfa',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered Lead Capture for Expos
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-black leading-[1.05] tracking-tight mb-6"
          >
            Don't leave your next expo with a pocket full of{' '}
            <span className="gradient-text">forgotten business cards.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Scan business cards in seconds, organize every conversation, and leave
            every event with your follow-up already ready.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <button
              id="cta-hero-start-free"
              onClick={handleSignIn}
              disabled={signingIn}
              className="cta-glow group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-300"
              style={{
                background: 'var(--gradient-brand)',
                opacity: signingIn ? 0.7 : 1,
                boxShadow: '0 8px 40px rgba(123, 63, 242, 0.3)',
              }}
            >
              {signingIn ? 'Signing in...' : 'Start Free'}
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Free to use · No credit card required
          </motion.p>
        </div>

        {/* Right — Animated Product Flow */}
        <motion.div
          variants={fadeUp}
          className="hidden lg:flex justify-center"
        >
          <div
            className="glass rounded-3xl p-8"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <AnimatedProductFlow />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
