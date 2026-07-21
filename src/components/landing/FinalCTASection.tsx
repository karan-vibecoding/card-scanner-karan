import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/animations';

export default function FinalCTASection() {
  const { signIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    setSigningIn(true);
    try { await signIn(); } finally { setSigningIn(false); }
  };

  return (
    <section className="relative overflow-hidden" style={{ padding: 'clamp(80px, 12vh, 140px) 5%' }}>
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0c0515 0%, #0a0a1a 40%, #070d1a 100%)',
        }}
      />

      {/* Glow blobs */}
      <div className="blob blob-violet absolute animate-glow-pulse" style={{ top: '20%', left: '25%', width: 500, height: 500 }} />
      <div className="blob blob-blue absolute animate-glow-pulse" style={{ bottom: '10%', right: '20%', width: 400, height: 400, animationDelay: '2s' }} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight mb-6"
        >
          Your next opportunity is already waiting{' '}
          <span className="gradient-text">at the expo.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-lg sm:text-xl mb-10"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          Don't let it become another forgotten business card.
        </motion.p>

        <motion.div variants={fadeUp}>
          <button
            id="cta-final-start-free"
            onClick={handleSignIn}
            disabled={signingIn}
            className="cta-glow group inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold text-white transition-all duration-300"
            style={{
              background: 'var(--gradient-brand)',
              opacity: signingIn ? 0.7 : 1,
              boxShadow: '0 12px 48px rgba(123, 63, 242, 0.35)',
            }}
          >
            {signingIn ? 'Signing in...' : 'Start Free'}
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Free forever · No credit card required · Setup in 30 seconds
        </motion.p>
      </motion.div>
    </section>
  );
}
