import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type JourneyStep = 'onboarding' | 'eligibility' | 'registration' | 'prep' | 'voting_day' | 'post_vote';

interface JourneyState {
  currentStep: JourneyStep;
  isEligible: boolean | null;
  registered: boolean | null;
  documentsPrep: {
    idChecked: boolean;
    locationChecked: boolean;
  };
  setStep: (step: JourneyStep) => void;
  setEligibility: (eligible: boolean) => void;
  setRegistration: (registered: boolean) => void;
  toggleDocument: (doc: 'idChecked' | 'locationChecked') => void;
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set) => ({
      currentStep: 'onboarding',
      isEligible: null,
      registered: null,
      documentsPrep: {
        idChecked: false,
        locationChecked: false,
      },
      setStep: (step) => set({ currentStep: step }),
      setEligibility: (eligible) => set({ isEligible: eligible }),
      setRegistration: (registered) => set({ registered }),
      toggleDocument: (doc) =>
        set((state) => ({
          documentsPrep: {
            ...state.documentsPrep,
            [doc]: !state.documentsPrep[doc],
          },
        })),
    }),
    {
      name: 'voteflow-journey-storage',
    }
  )
);
