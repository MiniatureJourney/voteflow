import { describe, it, expect } from 'vitest';
import { EligibilityEngine } from '../src/lib/engines/EligibilityEngine';
import { JourneyStateMachine, JourneyContext } from '../src/lib/engines/JourneyStateMachine';
import { DeadlineEngine, ElectionDeadlines } from '../src/lib/engines/DeadlineEngine';
import { DocumentEngine, DocumentRule, UploadedDocument } from '../src/lib/engines/DocumentEngine';
import { BoothMappingEngine } from '../src/lib/engines/BoothMappingEngine';
import { CivicInsightsEngine } from '../src/lib/engines/CivicInsightsEngine';

describe('EligibilityEngine', () => {
  const rule = { region_code: 'US-CA', min_age: 18, requires_photo_id: false, allows_mail_in: true };
  
  it('should return eligible for 18+ citizen', () => {
    const res = EligibilityEngine.evaluate({ dob: '2000-01-01', citizenship: true }, rule, '2026-11-03');
    expect(res.eligible).toBe(true);
  });

  it('should return ineligible for non-citizen', () => {
    const res = EligibilityEngine.evaluate({ dob: '2000-01-01', citizenship: false }, rule, '2026-11-03');
    expect(res.eligible).toBe(false);
    expect(res.reasons).toContain('Must be a citizen to vote.');
  });

  it('should handle age exactly 18 on election day', () => {
    // Born Nov 3, 2008. Election Nov 3, 2026. Age = 18.
    const res = EligibilityEngine.evaluate({ dob: '2008-11-03', citizenship: true }, rule, '2026-11-03');
    expect(res.eligible).toBe(true);
  });

  it('should be ineligible if 18 a day AFTER election day', () => {
    // Born Nov 4, 2008. Election Nov 3, 2026. Age = 17 on election day.
    const res = EligibilityEngine.evaluate({ dob: '2008-11-04', citizenship: true }, rule, '2026-11-03');
    expect(res.eligible).toBe(false);
  });
});

describe('JourneyStateMachine', () => {
  it('evaluates NOT_REGISTERED', () => {
    const ctx: JourneyContext = { isEligible: true, isRegistered: false, documentsVerified: false, hasVoted: false };
    expect(JourneyStateMachine.evaluateState(ctx)).toBe('REGISTER');
  });

  it('evaluates READY', () => {
    const ctx: JourneyContext = { isEligible: true, isRegistered: true, documentsVerified: true, hasVoted: false };
    expect(JourneyStateMachine.evaluateState(ctx)).toBe('READY');
  });

  it('evaluates VOTED', () => {
    const ctx: JourneyContext = { isEligible: true, isRegistered: true, documentsVerified: true, hasVoted: true };
    expect(JourneyStateMachine.evaluateState(ctx)).toBe('VOTED');
  });
  
  it('returns proper action payload', () => {
    const action = JourneyStateMachine.getNextAction('READY');
    expect(action.label).toBe('View Polling Booth');
    expect(action.href).toBe('/dashboard/booth');
  });
});

describe('DeadlineEngine', () => {
  const deadlines: ElectionDeadlines = {
    election_date: '2026-11-03',
    voter_reg_deadline: '2026-10-15',
    mail_in_request_deadline: '2026-10-20',
    mail_in_return_deadline: '2026-11-03'
  };

  it('generates critical reminders when close', () => {
    // Current date: 2026-10-13 (2 days before reg deadline)
    const reminders = DeadlineEngine.generateReminders(deadlines, new Date('2026-10-13'));
    const regReminder = reminders.find(r => r.message.includes('Voter Registration'));
    expect(regReminder).toBeDefined();
    expect(regReminder?.type).toBe('CRITICAL');
  });

  it('ignores past deadlines', () => {
    // Current date: 2026-10-16 (1 day past reg deadline)
    const reminders = DeadlineEngine.generateReminders(deadlines, new Date('2026-10-16'));
    const regReminder = reminders.find(r => r.message.includes('Voter Registration'));
    expect(regReminder).toBeUndefined();
  });
});

describe('DocumentEngine', () => {
  const rule: DocumentRule = { requires_photo_id: true, acceptable_ids: ['state_id', 'passport'] };
  
  it('validates correct photo ID', () => {
    const docs: UploadedDocument[] = [{ docType: 'state_id', status: 'VERIFIED' }];
    const res = DocumentEngine.validate(docs, rule);
    expect(res.isValid).toBe(true);
  });

  it('invalidates pending documents', () => {
    const docs: UploadedDocument[] = [{ docType: 'state_id', status: 'PENDING' }];
    const res = DocumentEngine.validate(docs, rule);
    expect(res.isValid).toBe(false);
  });
});

describe('BoothMappingEngine', () => {
  it('returns sorted booths by distance', async () => {
    const booths = await BoothMappingEngine.locateNearestBooths('10001');
    expect(booths.length).toBeGreaterThan(0);
    expect(booths[0].distance_miles).toBeLessThanOrEqual(booths[1].distance_miles!);
  });
});

describe('CivicInsightsEngine', () => {
  it('predicts crowd density properly', () => {
    const peak = CivicInsightsEngine.predictCrowdDensity(18); // 6 PM
    expect(peak.level).toBe('CRITICAL');
    
    const offPeak = CivicInsightsEngine.predictCrowdDensity(10); // 10 AM
    expect(offPeak.level).toBe('LOW');
  });
});
