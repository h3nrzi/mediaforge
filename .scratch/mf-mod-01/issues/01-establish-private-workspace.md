# 01: Establish durable private workspace and initial Manager access

**What to build:** A credential owner prepares recoverable private material, a trusted host operator initializes the single workspace once, and the initial Manager authenticates over HTTP to inspect their identity and Manager-only authority.

**Blocked by:** None (technical starting frontier after Product Owner ticket-plan approval).

**Status:** ready-for-agent
**Plan approval:** Explicitly approved by the Product Owner on 2026-10-14.
**Execution readiness:** Unblocked; prerequisites and acceptance criteria fully defined. Awaiting a separate explicit implementation instruction.
**Evidence:** Not executed.

## Authoritative context and scope

Parent: MF-MOD-01. Read the [approved specification](../spec.md), particularly Implementation Decisions §§1–3, 6–9 and Testing Decisions; [Technical Discovery](../technical-discovery.md) Q1–7, Q10, Q12–14; accepted ADRs 0001–0004. PRD: MF-SCOPE-02, MF-ACCESS-01/03/04, MF-CLIENT-01; supporting MF-RESOURCE-06 field bounds. Local contributions: MF-AC-01/02/03/04/42.

The repository currently contains planning documents, with no application implementation to prefactor. Establish only the runtime, persistence, helper, command and HTTP facilities needed for this complete first workflow. Use the approved Node.js 24.22.0 / JavaScript ES-module built-ins and a small replaceable SQLite adapter; introduce no framework, identity service or processing infrastructure.

## Acceptance criteria

- [ ] Pin and check the approved runtime/API surface. Provide reproducible service and test entry points using Node's test runner; do not infer compatibility from installed Node 26.
- [ ] The owner helper prepares a UUID actor ID, revision-one descriptor, independently random 32-byte secret and revision-bound random credential locator. Canonical base64url secret and SHA-256 verifier follow the specification. The shareable descriptor contains no secret; document trusted recipient/actor confirmation.
- [ ] Exclusive owner-only private-file creation refuses unsafe ownership, symlinks and existing destinations; flush contents and parent directory before reporting readiness. Interrupted preparation is identified as incomplete and cannot register incomplete material or overwrite valid files. Derive an owner-only curl config locally without printing its bearer value. Exclude private artifacts from version control and redact credential-bearing diagnostics.
- [ ] Host setup/bootstrap and initialization status distinguish absent, uninitialized, initialized and unavailable stores. Bootstrap atomically commits singleton state, initial admitted Manager-only actor, versions/revisions at one, bounded operator-origin attribution and verifier. Every initialized rerun refuses without modifying state, even for the same candidate.
- [ ] Use an explicit local persistent database location independent of working directory, protected database/directory/WAL sidecars, WAL, synchronous=FULL and foreign keys on every connection; parameterized SQL and disabled extension loading. Atomic non-destructive schema setup/migration preserves authority facts. Ordinary startup opens and verifies an existing store; missing/corrupt/unsupported storage never silently creates writable authority. Uninitialized state grants no usable operations.
- [ ] Bootstrap uses an owned BEGIN IMMEDIATE transaction before dependent reads, immediate acquisition attempts with asynchronous backoff and the default configurable 1,000 ms cumulative monotonic budget, one body execution and acknowledgement only after durable commit. Known non-admission/rollback and indeterminate outcomes are distinct; unestablished connection state is discarded and the body is never automatically replayed.
- [ ] GET /v1/me authenticates only the exact registered bearer ID plus raw secret using strict single-header parsing, canonical encoding/length validation and constant-time verifier comparison. IDs, verifiers, cookies, query tokens, supplied identities and role claims cannot authenticate. Fresh reads verify admission and expiry at now >= issuance + 30 elapsed days, including downtime. Responses omit secrets/verifiers and expose exact identity, current label/responsibilities, decimal-string versions and ISO issuance/expiry.
- [ ] Supply the common JSON result/reason/action-status contract, no-store, bounded errors and transport guard: loopback HTTP for local development; configured HTTPS required for nonlocal binding. No public setup/signup or operator-recovery HTTP endpoint exists.
- [ ] Document bootstrap lost-response recovery through the saved candidate and trustworthy host status. Retry only when non-initialization and absence of a still-active prior attempt are established; initialized state is never reset. Loss of committed owner material awaits the separate recovery command from Ticket 05.

## Verification to implement

Primary ownership: **M01-V01, M01-V02**. Establish the bootstrap/self portions of **M01-V03, M01-V09, M01-V12, M01-V13, M01-V14, M01-V15, M01-V17**; later owners complete their matrices.

Automate real helper/host commands and HTTP against temporary on-disk SQLite. Test safe/unsafe preparation and redacted output; wrong/malformed/verifier-only authentication; initial Manager-only facts; expiry before/at/after; failure before bootstrap commit; dropped response after commit; restart and candidate authentication; competing independent bootstrap processes and immutable initialized reruns. Assert exact counts/versions/attribution and no partial initialization. Exercise held-writer non-admission and basic rollback/uncertainty without repeated effects. Test missing/corrupt store and pragma verification. Fault/clock controls are construction-only, never production endpoints or arbitrary callback configuration. Killing a process does not demonstrate physical power-loss durability.

Manual verification: follow the secret-free preparation/bootstrap/self-inspection curl instructions with owner-only configs; inspect filesystem permissions and normal command/log output. Record actual results only during later authorized implementation.

## Local evidence and deferred obligations

This slice demonstrates actual initial authority and recoverable setup. Real shared media, later action permissions, work/counter continuity and in-flight transfers remain Modules 02–06 obligations. No processing endpoint, submission-reference archive, actor-event archive or V1 acceptance claim belongs here. Ticket 08 consolidates local evidence and remaining integrations.

## Comments

2026-10-14 — Product Owner explicitly approved all eight tickets, their scope/dependencies/order, M01-V01–M01-V17 coverage, integration obligations and verification/handoff. Triage updated to `ready-for-agent`; Ticket 01 has no dependency blockers and its prerequisites/acceptance criteria are fully defined. This session records approval only: no implementation or verification executed; all acceptance criteria remain unchecked.
