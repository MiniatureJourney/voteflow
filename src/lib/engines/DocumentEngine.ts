export interface DocumentRule {
  requires_photo_id: boolean;
  acceptable_ids: string[];
}

export interface UploadedDocument {
  docType: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export class DocumentEngine {
  /**
   * Validates if the user has met the document requirements for their region.
   */
  static validate(uploadedDocs: UploadedDocument[], rule: DocumentRule): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    const verifiedDocs = uploadedDocs.filter(d => d.status === 'VERIFIED');

    if (rule.requires_photo_id) {
      const hasPhotoId = verifiedDocs.some(d => rule.acceptable_ids.includes(d.docType));
      if (!hasPhotoId) {
        errors.push("A valid, verified Photo ID is required.");
      }
    } else {
      if (verifiedDocs.length === 0) {
        errors.push("At least one proof of identity or address is required.");
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
