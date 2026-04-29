export type JourneyState = 'NOT_REGISTERED' | 'REGISTER' | 'VERIFY' | 'READY' | 'VOTED';

export interface JourneyContext {
  isEligible: boolean;
  isRegistered: boolean;
  documentsVerified: boolean;
  hasVoted: boolean;
}

export class JourneyStateMachine {
  /**
   * Dynamically evaluates the correct current state based on real-time user context.
   */
  static evaluateState(context: JourneyContext): JourneyState {
    if (context.hasVoted) return 'VOTED';
    if (context.isRegistered && context.documentsVerified) return 'READY';
    if (context.isRegistered && !context.documentsVerified) return 'VERIFY';
    if (context.isEligible && !context.isRegistered) return 'REGISTER';
    return 'NOT_REGISTERED';
  }

  /**
   * Determines what action the user needs to take next.
   */
  static getNextAction(currentState: JourneyState): { label: string; href: string; percentage: number } {
    switch (currentState) {
      case 'NOT_REGISTERED':
        return { label: 'Check Eligibility', href: '/dashboard/eligibility', percentage: 10 };
      case 'REGISTER':
        return { label: 'Register to Vote', href: '/dashboard/register', percentage: 30 };
      case 'VERIFY':
        return { label: 'Verify Documents', href: '/dashboard/documents', percentage: 60 };
      case 'READY':
        return { label: 'View Polling Booth', href: '/dashboard/booth', percentage: 90 };
      case 'VOTED':
        return { label: 'View Post-Election Info', href: '/dashboard/results', percentage: 100 };
    }
  }
}
