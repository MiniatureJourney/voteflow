import { describe, it, expect } from 'vitest';
import { EligibilityEngine } from '../src/lib/engines/EligibilityEngine';

describe('EligibilityEngine', () => {
  it('should validate age correctly and return true for eligible voter', () => {
    const res = EligibilityEngine.evaluate(
      { dob: '1990-01-01', citizenship: true },
      { region_code: 'US-CA', min_age: 18, requires_photo_id: false, allows_mail_in: true },
      '2026-11-03'
    );
    expect(res.eligible).toBe(true);
    expect(res.reasons.length).toBe(0);
  });

  it('should invalidate non-citizens', () => {
    const res = EligibilityEngine.evaluate(
      { dob: '1990-01-01', citizenship: false },
      { region_code: 'US-CA', min_age: 18, requires_photo_id: false, allows_mail_in: true },
      '2026-11-03'
    );
    expect(res.eligible).toBe(false);
    expect(res.reasons).toContain("Must be a citizen to vote.");
  });
});
