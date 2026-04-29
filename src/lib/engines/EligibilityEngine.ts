export interface ElectionRule {
  region_code: string;
  min_age: number;
  requires_photo_id: boolean;
  allows_mail_in: boolean;
}

export interface UserProfileData {
  dob: string;
  citizenship: boolean;
  is_felon?: boolean;
}

export class EligibilityEngine {
  /**
   * Evaluates if a user is eligible to vote in an upcoming election.
   * Handles edge cases: citizenship, felon status, and turning 18 BEFORE election day.
   */
  static evaluate(user: UserProfileData, rule: ElectionRule, electionDate: string): { eligible: boolean; reasons: string[] } {
    const reasons: string[] = [];
    
    if (!user.citizenship) {
      reasons.push("Must be a citizen to vote.");
    }
    
    if (user.is_felon) {
      reasons.push("Voting rights may be restricted due to felony status in this region.");
    }

    const ageOnElectionDay = this.calculateAgeAtDate(user.dob, electionDate);
    if (ageOnElectionDay < rule.min_age) {
      reasons.push(`Must be at least ${rule.min_age} years old by election day (${electionDate}) in ${rule.region_code}.`);
    }

    return {
      eligible: reasons.length === 0,
      reasons
    };
  }

  private static calculateAgeAtDate(dob: string, targetDate: string): number {
    const birthDate = new Date(dob);
    const target = new Date(targetDate);
    let age = target.getFullYear() - birthDate.getFullYear();
    const m = target.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && target.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
