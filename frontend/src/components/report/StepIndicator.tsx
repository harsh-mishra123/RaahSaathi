import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  onStepClick: (index: number) => void;
}

export const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => {
  return (
    <ol className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={step}>
            <li className="flex items-center">
              <button
                onClick={() => onStepClick(index)}
                className="flex flex-col items-center text-center"
                disabled={!isCompleted && !isCurrent}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2
                    ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
                    ${isCurrent ? 'border-primary' : ''}
                    ${!isCompleted && !isCurrent ? 'border-border' : ''}
                  `}
                >
                  {isCompleted ? <Check size={16} /> : index + 1}
                </div>
                <span className={`mt-2 text-sm ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step}
                </span>
              </button>
            </li>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-border'}`} />
            )}
          </React.Fragment>
        );
      })}
    </ol>
  );
};

export default StepIndicator;