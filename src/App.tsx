/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuditBanner } from './components/AuditBanner';
import { AdvisoryCallout } from './components/AdvisoryCallout';
import { HeroSection } from './components/HeroSection';
import { OnboardingPartnerCard } from './components/OnboardingPartnerCard';
import { SettlementDirectorate } from './components/SettlementDirectorate';
import { RefundCalculationPlan } from './components/RefundCalculationPlan';
import { RefundApplicationForm } from './components/RefundApplicationForm';
import { EvidentiaryDocumentPreviews } from './components/EvidentiaryDocumentPreviews';
import { ImportantNoticeModal } from './components/ImportantNoticeModal';
import { DocketStatusLookupModal } from './components/DocketStatusLookupModal';
import { Footer } from './components/Footer';
import { INITIAL_FORM_DATA, calculatePhases } from './data/settlementData';
import { RefundFormData } from './types/settlement';

export default function App() {
  const [formData, setFormData] = useState<RefundFormData>(INITIAL_FORM_DATA);
  const [activeDocTab, setActiveDocTab] = useState<'assurance' | 'notice'>('assurance');
  const [isNoticeOpen, setIsNoticeOpen] = useState(true);
  const [isDocketLookupOpen, setIsDocketLookupOpen] = useState(false);
  const [submittedDocketId, setSubmittedDocketId] = useState<string>('MG-REF-892415');
  const [activeSection, setActiveSection] = useState<string>('settlement-plan');

  // Compute 35 / 35 / 30 live calculations based on entered refund amount (or 100000 fallback)
  const currentRefund = formData.refundAmount > 0 ? formData.refundAmount : 100000;
  const breakdown = calculatePhases(currentRefund);

  // Track scroll position to update active navbar link
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['refund-form', 'settlement-plan', 'documents'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePreviewDocs = (tab: 'assurance' | 'notice' = 'assurance') => {
    setActiveDocTab(tab);
    scrollToSection('documents');
  };

  const handleFormSubmitSuccess = (docketId: string) => {
    setSubmittedDocketId(docketId);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] flex flex-col font-sans selection:bg-[#002a42] selection:text-white">
      {/* Fixed Sticky Header */}
      <Navbar
        onOpenNotice={() => setIsNoticeOpen(true)}
        onOpenDocketLookup={() => setIsDocketLookupOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Page Layout */}
      <main className="w-full pt-16 flex-1">
        {/* Top Institutional Audit Banner */}
        <AuditBanner />

        {/* Content Container */}
        <div className="max-w-[1160px] mx-auto w-full px-4 sm:px-6 md:px-10 py-8 sm:py-12 flex flex-col gap-10 sm:gap-14">
          {/* Operational Fiduciary Advisory Box */}
          <AdvisoryCallout />

          {/* Hero Section */}
          <HeroSection
            onOpenNotice={() => setIsNoticeOpen(true)}
            onPreviewDocs={() => handlePreviewDocs('assurance')}
            onScrollToForm={() => scrollToSection('refund-form')}
          />

          {/* Welcoming Our Onboarding Partner Highlight Card */}
          <OnboardingPartnerCard />

          {/* Governance & Oversight: Settlement Directorate */}
          <SettlementDirectorate />

          {/* Refund Calculation Plan (35% / 35% / 30%) */}
          <RefundCalculationPlan
            breakdown={breakdown}
            refundAmount={currentRefund}
            onScrollToForm={() => scrollToSection('refund-form')}
          />

          {/* Form MG-F-01: Candidate Refund Application */}
          <RefundApplicationForm
            formData={formData}
            onChange={setFormData}
            onSubmitSuccess={handleFormSubmitSuccess}
            onPreviewDocs={() => handlePreviewDocs('assurance')}
          />

          {/* Evidentiary Documentation: Instrument Previews (Tabbed) */}
          <EvidentiaryDocumentPreviews
            formData={formData}
            breakdown={breakdown}
            activeTab={activeDocTab}
            onTabChange={setActiveDocTab}
          />
        </div>
      </main>

      {/* Institutional Footer */}
      <Footer onOpenNotice={() => setIsNoticeOpen(true)} />

      {/* Modal: Important Settlement Update */}
      <ImportantNoticeModal
        isOpen={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        onContinueToForm={() => {
          setIsNoticeOpen(false);
          scrollToSection('refund-form');
        }}
      />

      {/* Modal: Track Docket Status */}
      <DocketStatusLookupModal
        isOpen={isDocketLookupOpen}
        onClose={() => setIsDocketLookupOpen(false)}
        defaultDocketId={submittedDocketId}
        activeBreakdown={breakdown}
      />
    </div>
  );
}
