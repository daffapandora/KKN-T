import React from 'react';
import { LandingHero } from '../components/landing/LandingHero';
import { AccessModeCards } from '../components/landing/AccessModeCards';
import { CoverageStatement } from '../components/landing/CoverageStatement';
import { ProofMetrics } from '../components/landing/ProofMetrics';
import { CapabilitySections } from '../components/landing/CapabilitySections';
import { TeaserOffline } from '../components/landing/TeaserOffline';
import { IntegrationsGrid } from '../components/landing/IntegrationsGrid';
import { TestimonialCard } from '../components/landing/TestimonialCard';
import { CtaCallout } from '../components/landing/CtaCallout';

export const LandingPage: React.FC = () => {
  return (
    <main>
      <LandingHero />
      <AccessModeCards />
      <CoverageStatement />
      <ProofMetrics />
      <CapabilitySections />
      <TeaserOffline />
      <IntegrationsGrid />
      <TestimonialCard />
      <CtaCallout />
    </main>
  );
};
