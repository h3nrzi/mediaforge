---
status: accepted
---

# Credential owners retain secrets; trusted operators can recover admitted Managers

Approved by the Product Owner on 2026-10-14 in Module 01 discovery Q6 with clarification and Q8 exactly as proposed: owners generate an independent 256-bit random secret and credential ID locally, save the secret in an owner-only file before registration, and retain it; Managers confirm recipient identity and receive only the ID/verifier for explicitly actor-bound registration. The service stores only the SHA-256 verifier, maintains one active credential per actor with atomic replacement, and permits authenticated admitted members to replace their own credentials without membership-management authority; server records, logs, version control and normal command output never contain raw secrets, and credential-file transfer between members is not an approved delivery practice. This avoids unrecoverable one-time secret-response delivery while adding a supported local helper and trusted recipient confirmation; bootstrap and uncertain replacement recover through already-saved material without reinitializing existing authority.

A separate trusted-host operator command may replace credentials only for an exact existing currently admitted Manager, preserving identity, membership and responsibilities and recording operator origin. This deliberately trusts host operators to recover total Manager credential loss rather than making a workspace unrecoverable; it cannot readmit removed actors, grant roles, reset the workspace or perform other capability actions, and it never reuses bootstrap as recovery.

Q14 was explicitly approved on the same date: maintain a monotonic credential revision, require its observed value for Manager replacement/operator recovery, and guard self-replacement with the exact current credential in the same transaction. Stale replacements are refused instead of silently invalidating a newer confirmed candidate; revision changes follow actual registration/replacement/revocation/membership invalidation, while expiry is evaluated against current time. Exact-current-candidate recovery changes no issuance, expiry, revision or attribution, and replay never revives superseded/revoked credentials; actor IDs, credential IDs and verifiers alone never authenticate. Q13 supplies the approved transaction/error boundary.

Requirements: MF-SCOPE-02, MF-ACCESS-01/03/04, MF-CLIENT-01; acceptance MF-AC-02/03/04. [Approval and original trade-offs](../../.scratch/mf-mod-01/technical-discovery.md).
