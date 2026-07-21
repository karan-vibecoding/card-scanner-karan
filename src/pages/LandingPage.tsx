import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import HeroSection from '../components/landing/HeroSection';
import WorksPerfectFor from '../components/landing/WorksPerfectFor';
import ProblemSection from '../components/landing/ProblemSection';
import BeforeAfterSection from '../components/landing/BeforeAfterSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import WhyExpoSnap from '../components/landing/WhyExpoSnap';
import FeatureGrid from '../components/landing/FeatureGrid';
import BuiltForSection from '../components/landing/BuiltForSection';
import ROICalculator from '../components/landing/ROICalculator';
import FAQSection from '../components/landing/FAQSection';
import FinalCTASection from '../components/landing/FinalCTASection';

export default function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <HeroSection />
      <WorksPerfectFor />
      <ProblemSection />
      <BeforeAfterSection />
      <HowItWorksSection />
      <WhyExpoSnap />
      <FeatureGrid />
      <BuiltForSection />
      <ROICalculator />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
