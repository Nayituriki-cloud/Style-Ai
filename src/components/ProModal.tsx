import React, { useState } from 'react';
import {
  Crown,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProModal: React.FC = () => {
  const { proModalOpen, setProModalOpen, user, activateProSubscription } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [confirmStep, setConfirmStep] = useState(false);

  if (!proModalOpen) return null;

  const PRO_FEATURES = [
    'Advanced AI Stylist with Haute Couture Reasoning',
    'Unlimited Generative Outfit Combinations',
    'Deep Computer-Vision Fabric & Fit Analysis',
    'Seasonal Wardrobe Audit & Capsule Planner',
    'Personal Style Reports & Archetype Diagnostics',
    'Curated Luxury & Designer Outfit Collections',
    'Infinite Color Matching & Micro-Tone Harmonization',
    'Full Outfit Calendar with Weather Integration',
    'VIP Conversational AI Fashion Concierge',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white space-y-3">
          <button
            onClick={() => setProModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-400">
            <Crown className="w-4 h-4" />
            <span>Private Atelier Membership</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white">
            STYLE AI PRO
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md">
            Elevate your sartorial presence. Gain unlimited AI styling consultations, deep computer-vision photo audits, and seasonal capsule curation.
          </p>

          {/* Pricing Toggle */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex rounded-lg p-1 bg-stone-800/80 border border-stone-700 text-xs">
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  billingCycle === 'annual'
                    ? 'bg-amber-400 text-stone-950 shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Annual ($89/yr · Save 25%)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-amber-400 text-stone-950 shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Monthly ($9.99/mo)
              </button>
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Pro Member Privileges
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRO_FEATURES.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation Notice */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transparent Billing & User Confirmation</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Plan selected: <strong>{billingCycle === 'annual' ? '$89.00 / year' : '$9.99 / month'}</strong>. No hidden renewal surprises. You may cancel anytime from your Style Profile.
            </p>
          </div>

          {/* Action Button */}
          <div className="space-y-2 pt-2">
            {user?.isPro ? (
              <div className="p-3 text-center rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-medium">
                You currently have an active STYLE AI PRO subscription!
              </div>
            ) : !confirmStep ? (
              <button
                onClick={() => setConfirmStep(true)}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs tracking-wider uppercase rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue to Subscription ({billingCycle === 'annual' ? '$89/yr' : '$9.99/mo'})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-3 p-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20">
                <p className="text-xs text-stone-800 dark:text-stone-200 font-medium">
                  Please confirm you want to activate STYLE AI PRO on your account for{' '}
                  <strong>{billingCycle === 'annual' ? '$89.00 billed annually' : '$9.99 billed monthly'}</strong>?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmStep(false)}
                    className="flex-1 py-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  >
                    Back
                  </button>
                  <button
                    onClick={activateProSubscription}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                  >
                    Confirm & Activate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
