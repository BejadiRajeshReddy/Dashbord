import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle, X, HelpCircle, Search, Compass, BookOpen } from 'lucide-react';

interface OnboardingProps {
  onStartAction: (step: number) => void;
}

export default function Onboarding({ onStartAction }: OnboardingProps) {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const tourDismissed = localStorage.getItem('investiq_tour_dismissed');
    if (!tourDismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const steps = [
    {
      title: 'Search a Company Ticker',
      description: 'Press Cmd+K / Ctrl+K anywhere to trigger the global Command Palette, and type any ticker like "RELIANCE" or "TCS" to view live signals.',
      icon: Search,
      cta: 'Open Palette',
      actionCode: 1,
    },
    {
      title: 'Run a Custom Screen',
      description: 'Navigate to the Screener (Analysis Engine) to filter companies by ROCE, debt ratios, and PEG using labeled analyst groups and descriptions.',
      icon: Compass,
      cta: 'Go to Screener',
      actionCode: 2,
    },
    {
      title: 'Generate pre-call Questions',
      description: 'Go to the Question Engine to create editable, drag-reorderable Q&A pre-packs for management calls built directly from concall summaries.',
      icon: BookOpen,
      cta: 'Go to Questions',
      actionCode: 3,
    },
  ];

  const handleDismiss = () => {
    localStorage.setItem('investiq_tour_dismissed', 'true');
    setVisible(false);
  };

  const activeStep = steps[currentStep];
  const StepIcon = activeStep.icon;

  return (
    <div id="onboarding-tour-container" className="fixed bottom-6 right-6 z-40 max-w-sm w-full bg-neutral-900 border border-blue-500/30 rounded-2xl p-4 shadow-2xl animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Analyst Tour — {currentStep + 1} of 3</span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-neutral-500 hover:text-neutral-300 transition-colors p-0.5 rounded-lg hover:bg-neutral-800"
          title="Dismiss Tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3">
        <h4 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
          <StepIcon className="w-4 h-4 text-blue-400" />
          {activeStep.title}
        </h4>
        <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
          {activeStep.description}
        </p>
      </div>

      {/* Progress Bars */}
      <div className="flex items-center gap-1.5 mt-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors ${
              index <= currentStep ? 'bg-blue-500' : 'bg-neutral-800'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handleDismiss}
          className="text-[11px] font-mono hover:underline text-neutral-500 hover:text-neutral-300"
        >
          Skip tour
        </button>

        <div className="flex gap-2">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-2 py-1.5 rounded-lg border border-neutral-800 bg-neutral-850 hover:bg-neutral-800 text-[11px] font-medium text-neutral-350 transition-colors"
            >
              Back
            </button>
          )}

          <button
            onClick={() => {
              onStartAction(activeStep.actionCode);
              if (currentStep < 2) {
                setCurrentStep(prev => prev + 1);
              } else {
                handleDismiss();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-[11px] font-semibold text-white transition-colors"
          >
            <span>{currentStep === 2 ? 'Finish' : activeStep.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
