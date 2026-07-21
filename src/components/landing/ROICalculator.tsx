import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, Clock, Calculator } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/animations';

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayValue(v));
    return unsubscribe;
  }, [display]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export default function ROICalculator() {
  const { signIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [cardsCollected, setCardsCollected] = useState(50);
  const [entryTime, setEntryTime] = useState(120); // seconds per card

  const handleSignIn = async () => {
    setSigningIn(true);
    try { await signIn(); } finally { setSigningIn(false); }
  };

  const totalSeconds = cardsCollected * entryTime;
  const hoursSaved = totalSeconds / 3600;
  const minutesSaved = Math.round(totalSeconds / 60);

  return (
    <section className="section-padding relative overflow-hidden" style={{ borderTop: '1px solid var(--color-border)' }}>
      <div className="blob blob-violet absolute animate-glow-pulse" style={{ top: '20%', right: '15%', width: 400, height: 400 }} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-4xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <p className="section-label">ROI Calculator</p>
          <h2 className="section-title">See how much time you'll save</h2>
          <p className="section-subtitle mx-auto mt-4">
            Calculate the hours you spend manually typing business card details.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="glass-card p-8 sm:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Inputs */}
            <div className="space-y-8">
              {/* Cards Collected */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-white">Business cards collected</label>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-lg"
                    style={{
                      background: 'rgba(123,63,242,0.12)',
                      color: '#a78bfa',
                      border: '1px solid rgba(123,63,242,0.2)',
                    }}
                  >
                    {cardsCollected}
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={500}
                  step={5}
                  value={cardsCollected}
                  onChange={(e) => setCardsCollected(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #7B3FF2 ${(cardsCollected / 500) * 100}%, rgba(255,255,255,0.08) ${(cardsCollected / 500) * 100}%)`,
                    accentColor: '#7B3FF2',
                  }}
                  aria-label="Number of business cards collected"
                />
                <div className="flex justify-between text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <span>5</span>
                  <span>500</span>
                </div>
              </div>

              {/* Entry Time */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-white">Seconds per card (manual entry)</label>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-lg"
                    style={{
                      background: 'rgba(37,99,235,0.12)',
                      color: '#60a5fa',
                      border: '1px solid rgba(37,99,235,0.2)',
                    }}
                  >
                    {entryTime}s
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={300}
                  step={10}
                  value={entryTime}
                  onChange={(e) => setEntryTime(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #2563EB ${((entryTime - 30) / 270) * 100}%, rgba(255,255,255,0.08) ${((entryTime - 30) / 270) * 100}%)`,
                    accentColor: '#2563EB',
                  }}
                  aria-label="Average manual entry time per card in seconds"
                />
                <div className="flex justify-between text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <span>30s</span>
                  <span>5min</span>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="flex flex-col items-center justify-center text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(123,63,242,0.15), rgba(37,99,235,0.15))',
                  border: '1px solid rgba(123,63,242,0.25)',
                }}
              >
                <Clock size={28} style={{ color: '#a78bfa' }} />
              </div>

              <p className="text-sm font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                You'll save approximately
              </p>

              <div className="mb-2">
                {hoursSaved >= 1 ? (
                  <div>
                    <span className="text-6xl sm:text-7xl font-black gradient-text">
                      <AnimatedNumber value={parseFloat(hoursSaved.toFixed(1))} />
                    </span>
                    <span className="text-2xl font-bold ml-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      hours
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-6xl sm:text-7xl font-black gradient-text">
                      <AnimatedNumber value={minutesSaved} />
                    </span>
                    <span className="text-2xl font-bold ml-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      minutes
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs mb-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
                of tedious manual data entry
              </p>

              <button
                id="cta-roi-start-saving"
                onClick={handleSignIn}
                disabled={signingIn}
                className="cta-glow group inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
                style={{
                  background: 'var(--gradient-brand)',
                  opacity: signingIn ? 0.7 : 1,
                  boxShadow: '0 8px 32px rgba(123,63,242,0.25)',
                }}
              >
                {signingIn ? 'Signing in...' : 'Start Saving Time'}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
