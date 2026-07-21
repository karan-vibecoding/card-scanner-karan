import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

export default function PublicLayout() {
  const { signIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signIn();
    } finally {
      setSigningIn(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && location.pathname === '/') {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileOpen(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: 'var(--color-surface)',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ─── Navbar ─── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          padding: scrolled ? '12px 5%' : '16px 5%',
          background: scrolled ? 'rgba(10, 10, 15, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 no-underline"
            aria-label="Expo Snap Home"
          >
            <img
              src="/logo.png"
              alt="Expo Snap Logo"
              className="h-10 w-auto"
              loading="eager"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-sm font-medium transition-colors duration-200 no-underline"
                style={{ color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#fff')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleSignIn}
              disabled={signingIn}
              className="cta-glow group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
              style={{
                background: 'var(--gradient-brand)',
                opacity: signingIn ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(123,63,242,0.2)',
              }}
            >
              {signingIn ? 'Signing in...' : 'Start Free'}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden mt-4 pb-4 border-t"
            style={{
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="px-4 py-3 rounded-xl text-sm font-medium no-underline transition-colors duration-200"
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div className="px-4 pt-3">
                <button
                  onClick={handleSignIn}
                  disabled={signingIn}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background: 'var(--gradient-brand)',
                    opacity: signingIn ? 0.7 : 1,
                  }}
                >
                  {signingIn ? 'Signing in...' : 'Start Free'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div style={{ height: 64 }} />

      {/* ─── Main Content ─── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ─── Footer ─── */}
      <Footer />
    </div>
  );
}
