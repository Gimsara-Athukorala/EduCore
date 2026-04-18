# Claim Approval Flow (No SMTP)

This document describes the current claim flow from frontend submission to admin approval and pickup-code generation without SMTP.

## 1. Frontend claim submission
- Source: `frontend/src/Components/Lost&Found/claimItmes.js`
- The user fills in a claim form with:
  - `claimantFullName`
  - `claimantStudentId`
  - `claimantEmail`
  - `claimantContactNumber`
  - `idProofType`
  - `idProofNumber`
  - `additionalNotes`
- The frontend sends a request to `POST http://localhost:5000/api/claims`.
- Request body is JSON with the claim fields.

## 2. Backend claim creation
- Source: `Backend/controllers/claimController.js`
- The backend validates the incoming claim data.
- It checks that the found item exists and is available, validates the email and student ID format, and prevents duplicate claims.
- A new `Claim` document is created and the found item is marked as `claimed`.
- No outbound email is sent at this initial claim submission stage.

## 3. Pickup code generation on approval
- Source: `Backend/controllers/claimController.js`
- When an admin approves a claim, the backend updates the claim status to `approved`.
- It generates a pickup code and saves it to `claim.pickupCode`.

## 4. Approval details
- Approval stores:
  - `claim.status = approved`
  - `claim.verifiedBy`
  - `claim.verifiedAt`
  - `claim.pickupCode`
- The found item remains in `claimed` status until collection is completed.

## 5. Result
- The claimant can use the generated pickup code during item collection.
- The system does not depend on SMTP or outbound email configuration.
