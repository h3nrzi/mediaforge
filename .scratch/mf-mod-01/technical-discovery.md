# MF-MOD-01 — Technical Discovery

**Started:** 2026-10-14.  
**Status:** Complete — all Q1–Q14 approved; final Module 01 readiness review passed on 2026-10-14.  
**Authority:** Approved [Module Plan](../../module-plan.md); [Final PRD](../../final-prd.md).  
**Approved technical decisions:** Q1–Q14, approved by the Product Owner on 2026-10-14; Q6 approved with clarification, all other answers approved exactly as proposed.

This is a discovery record, not an implementation specification or ticket breakdown. No application code, implementation or acceptance execution has begun. Original proposals are preserved below as discussion history; only the separate explicit approval records establish approved decisions. Subsequent approval records must identify the question, approved answer, qualifications and approval date.

## Context and constraints

Read AGENTS.md and its issue-tracker, triage and domain instructions; project-charter.md; relevant final-prd.md requirements, limits, invariants and acceptance cases; module-plan.md; GLOSSARY.md; installed grill-with-docs, grilling and domain-modeling instructions and documentation formats. No application stack, deployment configuration or accepted technical ADR currently constrains these choices. Earlier pending/not-started headings are historical workflow text; the approved Module Plan records the current authority. No genuine product contradiction was identified.

Owned requirements: MF-SCOPE-02, MF-ACCESS-01, MF-ACCESS-03, MF-ACCESS-04 and MF-CLIENT-01. The approved responsibility matrix remains binding: all admitted members have baseline read authority; responsibilities combine without Manager privilege inheritance. Current membership and applicable authority must govern effects. Revocation cannot cancel admitted work or erase attribution/accounting.

## Round 1 — Original independent proposals (approved; preserved verbatim)

### Q1 — Authentication approach

**Problem:** The service must identify an actor without trusting a caller-supplied actor ID. Authentication establishes identity; current membership and responsibilities separately establish authority.

**Recommended proposal:** Individually issued opaque bearer credentials for the documented backend client, bound to stable actor IDs. Keep permissions out of credentials; resolve current authority on the server. Store credential verifiers rather than retrievable credential secrets, and require encrypted transport outside local development. No public signup. Exact issuance, rotation and lifetime policies remain downstream decisions.

**Alternatives:** Local password login adds password/session/recovery handling but offers familiar login. An external identity provider offers centralized login and potentially stronger account controls but adds an external dependency and provider setup. Self-contained credentials carrying responsibilities require an additional freshness/revocation mechanism and offer little benefit for this workspace.

**Trade-off:** Opaque credentials fit a small documented-client workflow with little login machinery, but credential delivery, loss and replacement must be addressed explicitly; possession authenticates the holder.

**Requirements/evidence:** MF-SCOPE-02, MF-ACCESS-01, MF-ACCESS-03, MF-CLIENT-01; actor-specific permitted/denied access for MF-AC-02/03/04. Authentication alone never grants action eligibility.

### Q2 — Stable actors and historical attribution

**Problem:** Membership removal and identity-label edits must not rewrite who performed an action. Later modules need a stable actor reference independent of credentials and current access.

**Recommended proposal:** Separate immutable actor identity from current membership, responsibility assignments and credentials. Record the stable actor ID and action-time display label with attributed facts. Changing a current label does not change historical labels. Removal closes access while preserving the identity required by dependent facts; no cascading deletion of attributed records. Readmission requires an explicit Manager action; matching labels never reconnect identities automatically.

**Alternatives:** Store only an actor ID and resolve its current label on reads: fewer duplicated fields, but historical presentation changes when labels change. Create a new actor for every admission: simpler membership lifecycle but fragments attribution across repeated admissions. Treat labels as identity: human-friendly but ambiguous and mutable, so unsuitable for stable attribution.

**Trade-off:** Action-time label snapshots repeat a small bounded fact but preserve readable historical identity. Apply existing 80-code-point label and 128-code-point public-identifier bounds. Detailed readmission targeting remains downstream.

**Requirements/evidence:** MF-ACCESS-04, MF-CLIENT-01; supporting MF-HISTORY-01/02 and MF-RESOURCE-06 contracts owned by Module 02. MF-AC-04 local before/after attribution; later MF-AC-38 integration.

### Q3 — Documented client and service interface

**Problem:** Actual identified actors must reproducibly exercise the service, including refusals, without manual record editing or a custom browser application.

**Recommended proposal:** An HTTP service with JSON control requests/responses and a version-controlled command-line walkthrough using a standard HTTP client. Separate credentials per demonstrated actor; readable action results; examples and evidence extended by each module. Later modules add their file-transfer operations without changing the actor/authority convention. Select the concrete client tool and route/error details later.

**Alternatives:** A dedicated CLI offers friendlier commands and credential handling but adds client implementation. An API-client collection offers interactive execution but introduces a tool-specific artifact and environment setup. A library-only interface is simple in-process but requires users to write programs to reproduce workflows.

**Trade-off:** HTTP examples minimize additional product code and expose real service behavior; documentation must make actor selection, credential handling and outcomes clear.

**Requirements/evidence:** MF-CLIENT-01, MF-SCOPE-02; respect MF-SCOPE-03's backend boundary. Local starting point and membership workflows contribute to MF-AC-01/02/03; complete media workflows remain later-module evidence.

### Q4 — Durable authority and effect-time consistency contract

**Problem:** Two Managers can concurrently demote each other, or a revoked actor can race a modification. Separate reads and writes can acknowledge effects inconsistent with current authority.

**Recommended proposal:** Persist authority in a transactional store. Membership/responsibility changes evaluate the caller's current authority, preserve the last-Manager invariant and commit the change as one atomic operation. For later capability mutations, require current authority checks within the same atomic ordering boundary as the admitted effect. Credentials and earlier permission reads cannot authorize a delayed effect. Reads/retrievals check current membership when access is authorized; already-authorized transfers follow the approved transfer policy.

**Alternatives:** Optimistic authority-version validation can avoid holding a shared lock, but every consuming mutation must validate freshness atomically and handle conflicts. A serialized command executor makes ordering explicit but needs durable recovery and consistent participation by all writers. Cached role checks or a process-local lock alone cannot be the authority contract across independent writers/restarts.

**Trade-off:** Transactional authority imposes a stable integration requirement on later admission paths, but directly supports competing last-Manager changes and effect-time revocation. This selects a consistency approach, not a database engine, schema, isolation level or whole-product process model.

**Requirements/evidence:** MF-ACCESS-01/03/04, MF-SCOPE-02; local real concurrent Manager changes and revocation in MF-AC-04. Work admission/continuity and transfer races require Modules 03/06; other action integrations require their owning modules. Module 01 supplies authority, not their lifecycle eligibility.

### Q5 — Initial Manager bootstrap

**Problem:** The first Manager cannot be admitted by an existing Manager. Initialization must establish access without exposing permanent public registration or bypassing later management rules.

**Recommended proposal:** A documented operator-run bootstrap command that creates the single workspace and first Manager atomically only when no workspace has been initialized. Refuse later or competing bootstrap attempts without changing existing actors/authority. Bootstrap grants Manager responsibility only. Subsequent admissions and assignments use authenticated Manager actions. Credential delivery follows the approved authentication approach and is decided afterward.

**Alternatives:** A one-time network setup endpoint is convenient remotely but adds a setup-secret and endpoint-disable lifecycle. Deployment-provided seed state is convenient for disposable environments but can blur setup versus normal authority changes. Manual database insertion is quick but undermines reproducibility and bypasses invariants.

**Trade-off:** A local command requires operator access for initial setup but avoids an ongoing unauthenticated setup surface. It is initialization, not a recovery bypass for an existing workspace.

**Requirements/evidence:** MF-CLIENT-01, MF-SCOPE-02, MF-ACCESS-01/04; actual initial Manager setup and competing initialization evidence, supporting MF-AC-03/04. No implicit Contributor/Reviewer/Operations assignment.

## Round 1 — Explicit approval record

**Product Owner approval date:** 2026-10-14. The Product Owner stated: “I explicitly approve **all five recommendations, Q1–Q5**, exactly as proposed.” The following records preserve the approved answers and the explicit qualifications supplied with that approval.

| Question | Approved decision | Explicit qualifications / deferred details |
| --- | --- | --- |
| Q1 — Authentication | Individually issued opaque bearer credentials bound to stable actor identities; current membership/responsibilities resolved server-side; no roles embedded in credentials; store verifiers rather than recoverable secrets; encrypted transport outside local development | Secure issuance, delivery, replacement and revocation remain dependent questions |
| Q2 — Actor identity and attribution | Immutable actor identity separate from membership, credentials and editable display labels; stable actor IDs and action-time display labels preserved in attributed facts | Label changes cannot rewrite historical attribution; matching labels cannot reconnect identities or restore access; existing identifier/label bounds apply; precise readmission remains open |
| Q3 — Documented client | HTTP control operations with JSON results, demonstrated through version-controlled command-line HTTP examples | Separate identified actors and actual authorized/denied workflows; each module extends the client; concrete tooling/routes remain open |
| Q4 — Authority consistency | Durable transactions order authority changes and admitted action effects; check current authority when applying changes; atomically commit membership/responsibility changes and preserve at least one admitted Manager under concurrency | Later admissions check current authority in the same atomic ordering boundary as the admitted effect; database engine and specific concurrency mechanism remain open |
| Q5 — Initial Manager | One-time operator-run bootstrap atomically initializes the single workspace and first Manager; rejects later/competing attempts without changing established authority; grants Manager only | Subsequent management uses authenticated Manager actions; initial credential delivery and interrupted-bootstrap recovery remain open |

**Approval scope:** No Round 2 proposal is included in this approval. No implementation, specification, ticket generation or executed acceptance result is authorized by this record.

## Deferred frontier (Round 1 historical planning)

After answers, recompute dependencies before presenting the next round. Authentication choice unlocks credential issuance/delivery/replacement/lifetime. Client choice unlocks concrete client and control-interface conventions. Durable-authority choice unlocks storage engine, supported execution topology and atomic integration mechanics. Actor model unlocks precise readmission and credential invalidation behavior. Bootstrap choice unlocks its initialization inputs and failure/repetition behavior.

No processing, retry, preview or deletion-system design is authorized here. Their concerns appear only as constraints on stable actor and authority contracts. Do not generate to-spec/to-tickets artifacts. Stop discovery once approved decisions suffice for a Module 01 implementation-ready specification; defer reversible implementation details and later-module decisions.

## Approval and domain documentation

Q1–Q14 are explicitly approved in their separate approval records. Accepted ADRs capture stable identity/current authority, atomic authority ordering, client-generated verifier registration, the trusted operator-recovery boundary and SQLite's single-host persistence contract, including approved contention/error and credential-revision behavior. Reversible client/interface conventions remain in this discovery record. GLOSSARY.md distinguishes a workspace actor from an admitted member without implementation details; no further terminology clarification is needed. Create further ADRs only for approved choices satisfying the domain-modeling criteria (costly to reverse, surprising without context, and a real trade-off).

## Round 2 — Original independent proposals (approved; preserved verbatim)

**Original proposal status:** Proposed when presented; subsequently explicitly approved in the separate Round 2 approval record below, with a clarification to Q6. Question numbering continues from Round 1. All seven questions depended only on approved Q1–Q5. SQLite-specific transaction mechanics remained deferred until Q10 approval.

### Q6 — Credential provisioning, replacement and bootstrap acknowledgement loss

**Problem:** Returning a server-generated secret once can strand access if its response is lost. Bootstrap must not commit the only Manager before recoverable credential material exists. Storing recoverable secrets for replay conflicts with approved Q1.

**Recommended proposal:** Use a documented local helper to generate a credential ID and independent 256-bit random secret, durably saved in a newly created owner-only file before registration. Register only its SHA-256 verifier, credential ID and actor binding. The recipient generates/holds the secret; a Manager registers the non-secret verifier for admission or replacement after confirming the recipient through a trusted channel. No public registration, automated invitation/email integration or secret transfer through the Manager is needed. An admitted actor with a valid credential may replace only their own credential; this grants no membership or responsibility modification authority. Replacement atomically invalidates the prior credential and registers the already-saved candidate. A Manager may replace an admitted member's credential; targeting one's own actor uses the same self-replacement flow. One active credential per actor keeps state bounded.

**Recovery proposal:** After an uncertain registration/replacement, use the already-saved candidate to authenticate and inspect the actor/credential ID; an authorized Manager can inspect registration metadata where needed. Do not generate another candidate blindly. A confirmed replacement preserves its candidate ID and issuance time on repetition. Bootstrap likewise saves its candidate first, then atomically initializes the workspace, Manager, credential verifier and initialized marker. After interruption, authenticate with that candidate and inspect identity. A rerun of bootstrap always refuses if initialized and never replaces established authority; if an authoritative check establishes no initialization committed, retry with the same saved candidate. If another bootstrap won, report already-initialized without adopting its actor or replacing its credential. Missing/lost candidate material after committed initialization uses Q8's selected recovery policy, not rebootstrap.

**Alternatives/trade-offs:** Server-generated secrets delivered once over HTTPS are conventional but require a separate lost-response replacement flow and secure Manager-to-recipient delivery. Storing encrypted raw secrets enables redisplay but contradicts approved verifier-only storage. Recipient-generated material adds a small helper and trusted verifier-registration handoff, while keeping raw secrets out of the service and making lost acknowledgements recoverable. The service validates verifier/identifier format; the supported helper guarantees random generation, and arbitrary hand-created credentials are unsupported. No credential file is committed to the repo, printed by default, or included in logs/transcripts. Bootstrap grants Manager only.

**Requirements/evidence:** MF-SCOPE-02, MF-ACCESS-01/03/04, MF-CLIENT-01; existing MF-RESOURCE-06 identifier bounds. MF-AC-02/03/04: real initial access, denied credential use, credential replacement and interruption/concurrent-bootstrap evidence. This is credential/initialization recovery, not Module 02's upload/request submission-reference protocol.

### Q7 — Credential lifetime and invalidation

**Problem:** A stolen bearer credential remains usable until invalidated, and membership/readmission must not revive an old credential. Credential expiry must not remove a Manager's membership or rewrite admitted work.

**Recommended proposal:** Credentials expire after 30 elapsed days from successful registration, at now >= expires-at; expose issuance/expiry metadata. Reads do not extend lifetime. Replacement obtains a new issuance time; recovery of the same registration does not. No idle timeout, refresh token or automatic renewal in this command-line credential model. Membership removal atomically invalidates all credentials; responsibility edits immediately change current authority without requiring credential replacement. Authenticated actors can revoke their own credential, and Managers can revoke another admitted member's credential. Revocation/expiry affects authentication only; it does not demote/remove actors, cancel work or rewrite attribution. The 30-day value is a proposed engineering default, not an existing PRD limit or SLA.

**Alternatives/trade-offs:** Non-expiring credentials minimize renewal and lockout but leave leaked credentials usable until manual action. Short-lived credentials with refresh tokens reduce bearer lifetime but add another recoverable-secret lifecycle. Thirty days limits exposure without requiring login machinery; it creates a renewal/recovery obligation. The choice applies independently of Q6's provisioning mechanism; total credential-loss handling is Q8.

**Requirements/evidence:** MF-SCOPE-02, MF-ACCESS-03/04, MF-CLIENT-01; MF-AC-02/04 with controlled before/at/after expiry, removed-member denial and unchanged attribution. Admitted-work continuity remains later-module evidence.

### Q8 — Total Manager credential loss

**Problem:** An admitted Manager can remain while every usable Manager credential is lost, revoked or expired. Last-Manager protection preserves membership, not a usable secret. Bootstrap may not initialize an existing workspace again.

**Recommended proposal:** Provide a separate explicit operator-only credential-recovery command for an exact existing, currently admitted Manager actor ID. It atomically replaces credentials using prepared secret material, preserving actor ID, membership, responsibilities and historical attribution. Recheck admitted Manager status in the same transaction; never readmit a removed actor or grant Manager responsibility. It cannot delete records, reset the workspace or invoke capability actions. Document this as trusted host-operator access, not an authenticated member action; report recovery method and affected credential metadata without attributing the operator command as an ordinary Manager action. Do not add an unrestricted audit-log archive. Use this command only for documented loss/expiry recovery, including committed bootstrap with lost credential material.

**Alternatives/trade-offs:** Require another authenticated Manager: tighter control, but unrecoverable if all credentials are unavailable. A separately held recovery credential permits remote recovery but adds another powerful secret and lifecycle. The local command is operationally simple but explicitly trusts whoever controls the service host to regain an admitted Manager's access. This is a new proposed trust-boundary decision, not implicitly authorized by Q5; Q5's bootstrap remains initialization-only.

**Requirements/evidence:** MF-ACCESS-04, MF-SCOPE-02, MF-CLIENT-01; MF-AC-04 local Manager continuity and MF-AC-02 removal boundary. Verify exact actor preservation, refusal for removed/non-Manager targets and no responsibility changes.

### Q9 — Membership lifecycle and readmission

**Problem:** Readmission must restore only explicitly authorized access without confusing labels, old credentials or historical ownership. Membership and responsibilities need clear independent states.

**Recommended proposal:** An actor is admitted or removed; an admitted member may have any subset of the four responsibilities, including an empty set with baseline shared read access. Managers create actors/admit them, edit current labels and explicitly change responsibilities. Managers have the management directory/lookup needed to identify admitted and removed actors; every authenticated admitted member can inspect their own identity and current authority. Removal clears current assignments and invalidates credentials, preserving actor identity and attributed facts. Readmission targets the exact existing actor ID, requires explicitly supplied new assignments and newly registered credential material, and restores no former assignment/credential automatically. New-person admission creates a new ID even if its label matches an existing actor. Same-actor readmission retains historical request-submitter identity; later own-request eligibility still requires current Contributor authority and the owning capability's rules.

**Alternatives/trade-offs:** Always create a new actor on return: simple but breaks continuous identity and own-request attribution. Automatically restore former assignments: convenient but can silently restore old powers. Exact-ID readmission needs a deliberate Manager identity check but preserves the approved stable identity without automatic restoration. No actor deletion/early provenance purge workflow is added.

**Requirements/evidence:** MF-ACCESS-01/03/04, MF-SCOPE-02, MF-CLIENT-01; later MF-ACCESS-02 request-ownership contract. MF-AC-02/03/04 local combinations/removal/readmission; real own-request effects remain Modules 03/04 integration.

### Q10 — Persistence engine and supported authority deployment

**Problem:** Q4 needs a real durable transactional store; its deployment assumptions constrain whether later admissions can share the approved atomic boundary.

**Recommended proposal:** SQLite on persistent local disk for a single-host authority deployment, WAL mode with synchronous=FULL and foreign-key enforcement. Keep actors, membership/responsibilities, credential verifiers and bootstrap state in this store; later capability admission facts must participate in its transaction boundary rather than rely on a remote role-check call. Media bytes need not be database contents. Only acknowledge committed mutations. Do not place the live database on a network filesystem or run independent multi-host authority replicas. This establishes the minimum authority deployment contract, not later processing/storage architecture. Use maintained SQLite builds; driver/runtime and migrations can be chosen during specification/implementation as reversible tooling decisions.

**Alternatives/trade-offs:** A server database such as PostgreSQL supports a future multi-host service shape but adds a service and operational setup. File/JSON storage has low initial setup but requires custom durable concurrency and crash-recovery behavior. SQLite fits one bounded private workspace with little operational setup; writes serialize, and multi-host authority would require revisiting this ADR-worthy choice. No performance/capacity claim is inferred from PRD limits.

**Requirements/evidence:** MF-ACCESS-03/04, MF-CLIENT-01, MF-SCOPE-02; MF-AC-04 real competing changes and persistence across process interruption. Later integration verifies actual action admission in the same atomic boundary.

**Documentation checked:** Context7 resolved /websites/sqlite_docs (official SQLite docs, high-reputation result) and queried write transaction isolation plus WAL durability. SQLite allows one simultaneous writer; BEGIN IMMEDIATE acquires write status before dependent reads. WAL requires same-host participants; FULL provides stronger commit durability than NORMAL under OS/power failure, subject to functioning storage. Sources: https://sqlite.org/lang_transaction.html, https://sqlite.org/isolation.html, https://sqlite.org/wal.html, https://sqlite.org/pragma.html#pragma_synchronous. SQLite-specific transaction acquisition and busy handling are a dependent frontier after Q10 approval, not approved here.

### Q11 — Stale administration, repetition and competing edits

**Problem:** Atomic commits alone can allow one Manager's stale responsibility replacement to overwrite another Manager's newer decision. A lost response must not cause duplicate actor admission or repeat revocation against newly issued credentials.

**Recommended proposal:** Require an observed version for membership, responsibility and label edits; atomically compare it with current state, then check authority/invariants and apply the change. A stale edit is refused with permitted current state for reconsideration. Use absolute desired state rather than toggles. Admission uses a freshly generated actor ID bound to that attempt; a lost response is resolved by authorized lookup, not another ID. Exact-ID credential revocation targets that credential, never whichever credential is current on a later retry. Repeating a satisfied state adds no effect or new attribution; a previously accepted action whose state has since changed is stale and cannot silently reapply. Recovery reads require current access and cannot rescue revoked mutation authority. This bounded resource/version approach does not import Module 02's seven-day submission-reference protocol or add a full management-event archive.

**Alternatives/trade-offs:** Last-write-wins is simpler but silently discards concurrent intent. Automatic merging can help disjoint updates but complicates responsibility removal and repeated actions. Version preconditions require refresh/reconsideration on conflicts but give deterministic, explainable outcomes. Storage-engine-specific locking remains separate from this engine-independent behavior.

**Requirements/evidence:** MF-ACCESS-01/03/04, MF-CLIENT-01; align readable refusal with Module 02-owned MF-CLIENT-03. MF-AC-03/04 real stale/concurrent administrative changes and MF-AC-42 local feedback contribution; these do not claim the full later acceptance scenarios pass.

### Q12 — Concrete documented-client conventions

**Problem:** The approved HTTP walkthrough needs concrete tools, safe actor switching and consistent results, including errors that scripts can display rather than hide.

**Recommended proposal:** curl command examples with JSON request files and separate owner-only per-actor configuration files; Authorization: Bearer only, no credentials in URLs or literal command arguments. Ignore ambient curl configuration, do not follow redirects automatically, and preserve readable error bodies with --fail-with-body; --json supports control bodies. Optional jq may format results, but JSON remains understandable without it. Use a versioned /v1 control namespace, GET for inspection and explicit mutation operations, stable actor IDs in responses and a standard JSON result carrying reason category, readable bounded message, action status where applicable, and permitted current facts. Return 401 for missing/invalid/expired credentials, 403 for denied current authority, 409 for management state conflicts, and 503 for known unavailable admission. A lost response is indeterminate until a documented inspection establishes the result; a 5xx alone does not prove no effect. Responses containing private control facts use Cache-Control: no-store, and secrets are excluded from logs/evidence. Exact endpoint names and internal framework choices can remain specification details.

**Alternatives/trade-offs:** A dedicated CLI can hide protocol details but adds product/client code; an API collection adds another tool-specific workflow. curl exposes actual HTTP outcomes and is easy to version, but the walkthrough must make credential-file selection and recovery explicit. This convention does not design Module 02 listings, record recovery or later media-transfer behavior.

**Requirements/evidence:** MF-CLIENT-01, MF-SCOPE-02; support MF-CLIENT-03 within Module 01 without taking its ownership from Module 02. MF-AC-01/02/03/04 local client evidence and MF-AC-42 permission/conflict feedback contribution.

**Documentation checked:** Context7 resolved /curl/curl (official repository, high reputation) and queried JSON/config/error-body conventions. Sources: https://curl.se/docs/manpage.html, https://github.com/curl/curl/blob/master/docs/cmdline-opts/config.md. The inspected environment provides curl 8.17.0; availability is not a project commitment until Q12 approval.

## Round 2 — Original evidence and stopping boundary

Round 2 recommendations are project proposals, not requirements claimed to originate in external documentation. The credential-generation/verifier principles were checked against OWASP's primary session-token guidance (https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html); the 30-day API-credential lifetime is a project choice, not OWASP's recommended browser-session timeout. No product requirement is reopened.

After Round 2 approval, ask only remaining implementation-blocking dependent questions: transaction acquisition/busy/commit-uncertainty handling for the selected engine, and any branches changed by non-default answers. Assess whether the chosen provisioning/recovery/version/client contracts already settle bootstrap and management interruption behavior before asking again. Reversible driver/framework/schema naming, endpoint spelling and later-module behavior do not justify more discovery. Local evidence must be real membership/credential/bootstrap/concurrency/attribution behavior; asset access, work/accounting continuity and authorized transfer portions remain explicitly scheduled integration evidence under the Module Plan. No acceptance evidence has been executed or claimed complete.

## Round 2 — Explicit approval record

**Product Owner approval date:** 2026-10-14. The Product Owner explicitly approved Q6–Q12, with one clarification to Q6, and instructed that Q7–Q12 be recorded as approved exactly as proposed. Original questions, recommendations, alternatives, trade-offs and references above remain intact.

### Q6 — Approved with clarification

Adopt the full proposed client-generated credential provisioning/replacement and interrupted-bootstrap/uncertain-replacement recovery approach. The Product Owner explicitly clarified:

- Generate an independent 256-bit random secret and credential ID locally; persist the secret in an owner-only file before registering its SHA-256 verifier.
- The credential owner retains the raw secret. A Manager receives only the credential ID and verifier necessary for registration, through a trusted channel, bound to the explicitly identified actor.
- Confirm the recipient's identity before a Manager registers their credential. Do not assume transferring a credential file between members is acceptable.
- Never store or expose raw secrets in server records, application logs, version-controlled files or normal command output.
- Maintain one active credential per actor with atomic replacement. Authenticated admitted members may replace their own credentials without membership-management authority.
- Preserve the proposed interrupted-bootstrap and uncertain-replacement recovery behavior.

The original Q6 alternatives discussing server-generated delivery remain historical alternatives, not authorized delivery practices.

### Q7–Q12 — Approved exactly as proposed

| Question | Status | Approved decision and explicit approval qualifications |
| --- | --- | --- |
| Q7 — Expiration and revocation | Approved exactly as proposed | 30 elapsed days from successful registration, including the exact boundary; no idle timeout/refresh token/automatic renewal; reads/recovery do not extend expiry; removal invalidates credentials; responsibility changes use current authorization; self/Manager revocation as proposed; authentication changes do not change membership, responsibilities, attribution or admitted work |
| Q8 — Manager credential recovery | Approved exactly as proposed | Separate trusted-host operator command targets an exact existing admitted Manager ID; atomically replaces only credentials; refuses removed/non-Manager targets; no roles/readmission/reset/capability actions; record operator origin rather than authenticated-Manager attribution |
| Q9 — Membership/readmission | Approved exactly as proposed | Admitted/removed membership, zero or more responsibilities, Manager-controlled admission/assignments/current labels; exact-ID readmission with fresh credentials and explicit assignments; no automatic restoration; new person/new ID despite label match; preserve historical attribution and request-submitter identity |
| Q10 — SQLite persistence | Approved exactly as proposed | Persistent local disk, WAL, synchronous=FULL, foreign keys; durable authority/bootstrap transactions; acknowledge only after commit; one-host initial authority deployment, no independent multi-host writers/network filesystem; later atomic admission-authority contract preserved without processing-architecture design |
| Q11 — Stale management changes | Approved exactly as proposed | Observed-version preconditions for membership/responsibility/label edits; atomically validate versions/current authority/invariants; stale refusal with permitted current facts; absolute desired states; exact-ID credential revocation; repeated accepted actions add no effect/attribution |
| Q12 — Documented client | Approved exactly as proposed | curl, JSON request files, owner-only actor configs, Authorization bearer header, no ambient config/automatic redirects/unnecessary secret exposure, --fail-with-body, /v1 namespace, consistent JSON and proposed 401/403/409/503 meanings, private no-store responses, indeterminate lost acknowledgements |

**Approval scope:** No Round 3 recommendation is approved by this record. No specification, ticket generation, application code, implementation or executed acceptance result has been authorized or produced.

## Round 3 — Original remaining proposals (approved; preserved verbatim)

**Original proposal status:** Proposed when presented; subsequently explicitly approved in the separate Round 3 approval record below. The two decisions depended on approved Q1–Q12. No new product contradiction was identified. The read-only audit confirmed that bootstrap recovery, provisioning ownership, expiration policy, baseline membership, current authorization, client conventions and local evidence boundaries were already settled. Q13 selected SQLite transaction mechanics; Q14 selected credential-replacement conflict behavior independently of the exact SQLite lock acquisition mechanism.

### Q13 — SQLite acquisition, bounded contention and failed commit handling

**Problem:** Deferred read transactions can observe an authority snapshot and then fail to upgrade after another writer wins. Waiting without a bound can make administrative calls hang. A storage error or lost commit acknowledgement must not become a false claim of refusal or trigger another effect.

**Recommended proposal:** Begin every Module 01 mutation, bootstrap and operator recovery with BEGIN IMMEDIATE before reading authority-dependent state. Use a separately owned connection/transaction scope for each operation; requests may not interleave inside another request's transaction. Hold only short database work in the transaction: prepare files and JSON before acquisition; do not perform network calls or wait for recipient confirmation while holding the writer. After acquisition, authenticate the exact currently registered credential, check admitted status/current responsibilities, expected versions and applicable invariants in that transaction. Use fresh server time at the final authorization/application gate, rather than a request-arrival timestamp; credentials that expire, are replaced or are revoked while waiting cannot authorize the later effect. That gate establishes the logical application time/order within the atomic transaction; acknowledge only after durable commit. Already-authorized transfers and independently admitted work retain the approved product policy.

**Contention proposal:** Permit bounded waiting/retries only to acquire the writer before any mutation body executes. Start with a configurable one-second cumulative contention-wait budget per operation, measured with a monotonic clock; do not reset the budget across attempts. This is a reversible implementation default, not a product deadline, throughput guarantee or end-to-end response SLA. If acquisition exhausts the budget before effects, return 503/refused-without-effect with a readable contention reason. Once acquired, a competing change may instead make a version stale (409) or current authority invalid (401/403); never replay pre-lock permission snapshots. No automatic rerun of an executed mutation body.

**Error/recovery proposal:** Distinguish known non-admission, confirmed rollback and indeterminate commit. A confirmed rollback permits a refusal report; lost acknowledgement or an unestablished commit outcome remains indeterminate. Inspect transaction state after errors, roll back an active transaction where safe, and discard/quarantine a connection whose state cannot be established rather than returning it to other requests. An error alone or autocommit status alone does not prove the action committed or did not commit. Reopen/check committed resource facts where storage is trustworthy; unavailable storage remains unavailable without authorizing unsafe mutation. Do not rerun an uncertain action body or retry a failed commit indefinitely. Use the existing candidate credential/actor ID/observed-version/exact-revocation-ID recovery paths; this adds no operation archive or seven-day submission-reference system.

**Alternatives/trade-offs:** BEGIN DEFERRED plus optimistic upgrade/retry can reduce writer holding time but requires handling stale snapshots and rebuilding the entire transaction with fresh authorization. A process-local queue simplifies one-process contention but cannot be the correctness guard against bootstrap/operator/other local connections. Immediate acquisition makes last-Manager and revocation ordering explicit at the cost of serializing short mutations. Indefinite waiting avoids some contention refusals but supplies no bounded operational behavior; blindly treating storage errors as refusal makes recovery unsafe.

**Requirements/evidence:** MF-SCOPE-02, MF-ACCESS-03/04, MF-CLIENT-01; align with MF-CLIENT-03 feedback owned by Module 02. MF-AC-04 local last-Manager/concurrency/attribution evidence; MF-AC-02 expired/replaced/revoked caller denial; MF-AC-42 local readable contention/uncertainty feedback. Controlled evidence must cover contention before mutation, credential expiry/removal while waiting, competing Manager changes and interruptions before/after commit without duplicate effects.

**Primary documentation:** Context7 resolved /websites/sqlite_docs and separately queried writer acquisition and transaction-error state. SQLite documents BEGIN IMMEDIATE's writer acquisition, SQLITE_BUSY on contention, bounded busy handlers and possible automatic rollback after storage/resource errors; choosing the wait budget and conservative action classification is a project proposal. Sources: https://sqlite.org/lang_transaction.html, https://sqlite.org/isolation.html, https://sqlite.org/c3ref/busy_timeout.html, https://sqlite.org/c3ref/get_autocommit.html, https://sqlite.org/c3ref/txn_state.html.

### Q14 — Credential registration authority and competing replacements

**Problem:** Q11 protects membership/responsibility/label edits and exact-ID revocation, but does not explicitly require an observed credential revision for Manager replacement or operator recovery. Two otherwise authorized replacements could silently invalidate the newly confirmed candidate. Recovery of a prior registration must not revive a superseded/revoked credential or reset its expiry.

**Recommended proposal:** Track a monotonically increasing per-actor credential revision alongside the latest bounded credential metadata. Require the observed credential revision for third-party Manager replacement and operator recovery; compare it atomically with current state and target membership. Revocation/replacement/membership invalidation advance the revision when they change credential state. The passage of expiry is checked against current server time, not by relying on a background job to change the revision. A stale replacement returns 409 with current facts only to an authorized caller; it changes no credential. Self-replacement is bound to the exact current authenticating credential and applies the same atomic current-state guard; it grants no authority over another actor. Apply an observed membership precondition to admission/readmission as already approved, and initialize identity/membership/assignments/initial verifier atomically.

**Authorization boundary:** Ordinary registration/replacement for another actor requires a currently authenticated admitted Manager and a currently admitted target, except for the Manager's explicit atomic admission/readmission action. Operator recovery has the separately approved host-operator boundary and may target only an existing admitted Manager. Authentication always verifies the raw owner-held secret against the stored verifier; a credential ID, verifier, caller-supplied actor ID or identity-confirmation assertion alone cannot authenticate. Managers receive only recipient-confirmed ID/verifier material; no credential-file transfer or server-secret delivery is added. Local recovery receives the confirmed target's owner-prepared registration material and does not require sharing their raw secret with the operator.

**Repetition/recovery:** If the exact candidate ID/verifier/actor binding is already the current registered candidate, authorized recovery confirms its existing metadata with no update to issuance, expiry, revision or attribution. A conflicting ID/binding is refused. A superseded/revoked candidate is not re-registered by replay; stale preconditions are refused. When the old self-replacement credential is invalidated, use the saved candidate for authentication/inspection rather than letting the old credential authorize another action. Use fresh candidates for deliberate replacement/readmission. A rejected stale operation is not evidence that an earlier lost-acknowledgement operation never committed; return permitted current facts and preserve uncertainty about unestablished historical outcomes.

**Alternatives/trade-offs:** Last-write-wins lets Managers/operators intentionally override the latest credential state but can immediately invalidate someone else's just-confirmed replacement. Compare only membership status: prevents removed-member restoration but does not detect credential-only races. Credential revision preconditions add a read/reconsider step after a conflict and avoid accidental replacement of newer credentials. This requires no unrestricted credential/action event archive; exact internal representations and helper/file encoding are specification details.

**Requirements/evidence:** MF-SCOPE-02, MF-ACCESS-01/03/04, MF-CLIENT-01; supporting MF-RESOURCE-06 bounds and MF-CLIENT-03 feedback. MF-AC-02/03/04 local actor binding, self-versus-other authority, replacement/recovery races, removed/non-Manager refusals and unchanged attribution; local MF-AC-42 conflict feedback. Later admitted-work/accounting continuity remains integration evidence, not credential-system implementation scope.

## Module 01 — Specification readiness assessment and minimum evidence

**Final readiness:** Ready for specification. Q13 and Q14 were explicitly approved on 2026-10-14; the known discovery frontier is empty. The Product Owner separately authorized creating the Module 01 specification using to-spec and requires explicit specification approval before to-tickets. Technical Discovery is complete; no further discovery round is needed for routine implementation details.

The following minimum verification obligations come from the approved contract and all fourteen approved decisions. Listing them is not a claim of execution:

- Actual one-time initialization, candidate saved before commit, interruption recovery, competing bootstrap and refusal to alter an initialized workspace; initial Manager has only Manager responsibility.
- Identified actors, individual/combined responsibilities and zero-responsibility membership; actual management permissions/denials, self credential administration without management authority, current identity/authority inspection and Manager-controlled actor lookup.
- Membership removal/readmission, old credential invalidation, label changes, exact actor identity and stable action-time labels; no automatic prior powers restored or admitted-work side effects introduced by removal.
- Credential registration/binding, owner-only secret handling, one active credential, 30-day before/at/after boundaries, revocation/replacement, lost acknowledgement and unchanged issuance/expiry on recovery; no verifier-only authentication.
- Concurrent last-Manager removal/demotion, stale administration, repeated actions, credential replacement/recovery conflicts and expired/revoked authority after lock waiting; every refusal preserves invariants and adds no effect/attribution.
- Exact admitted-Manager operator recovery with explicit operator origin, refusal for removed/non-Manager targets and no membership/role/reset/capability changes.
- Durable committed facts across process interruption, distinguish known refusal/rollback from unestablished outcomes, readable HTTP/client results and recovery without manual record editing or secret-bearing transcripts.

Local membership and authority behavior can be demonstrated now when implementation is later authorized. Real asset read/retrieval, own/other processing actions, admitted-work continuity/accounting, preview/review/deletion actions and previously authorized transfer races remain the named later-module integrations in the approved Module Plan. A tested policy function for a future action does not count as that future real workflow. MF-AC-02/03/04 remain partial local evidence until all required participants exercise their full scenarios; gate 07 reviews the complete cases. No evidence has yet been executed or passed.

Driver/runtime/framework choice, SQL column names, route spelling, helper/config file encoding and concrete test harness selection remain reversible specification/implementation details. No full processing, retry, preview or deletion design is needed to close this discovery.

## Round 3 — Explicit approval record and discovery closure

**Product Owner approval date:** 2026-10-14. The Product Owner stated: “I explicitly approve **Q13 and Q14 exactly as recommended**.” Original recommendations, alternatives, trade-offs and references are preserved above.

| Question | Status | Approved decision and explicit qualifications |
| --- | --- | --- |
| Q13 — SQLite acquisition, contention and failures | Approved exactly as recommended | BEGIN IMMEDIATE for mutations/bootstrap/operator recovery; short transactions and prepared external inputs; current credential/membership/responsibility/version/invariant checks after writer acquisition; fresh time at final application gate; configurable one-second cumulative acquisition budget with retries only before mutation; 503/refused only on established non-admission; distinguish confirmed rollback/known non-admission/indeterminate commit; no automatic rerun of executed body; inspect transaction state, safely roll back and discard indeterminate connections; recover lost acknowledgements through permitted inspection |
| Q14 — Credential revision and replacement conflicts | Approved exactly as recommended | Monotonic per-actor credential revision; observed revision for Manager replacement/operator recovery; atomic target/credential validation; stale 409 with permitted facts; exact current credential guards self-replacement; advance revision on actual registration/replacement/revocation/membership invalidation; time-based expiry without background job; current Manager/admitted target except atomic admission/readmission; admitted-Manager operator boundary; actor ID/credential ID/verifier never sufficient authentication; exact-current-candidate recovery preserves issuance/expiry/revision/attribution; no revival through replay; preserve uncertainty after lost acknowledgement |

### Final readiness review

| Reviewed obligation | Finding |
| --- | --- |
| MF-SCOPE-02 | One private workspace, baseline shared access, no public registration/sharing, current authorization for every future page/retrieval/action; later real subjects integrate the same contract |
| MF-ACCESS-01 | Four independent combinable responsibilities, zero-role admitted membership, no Manager inheritance; capability eligibility stays with its owner |
| MF-ACCESS-03 | Current authority at the atomic application gate, expiry/revocation while waiting, no cancellation/accounting side effects from access changes, approved transfer distinction preserved |
| MF-ACCESS-04 | Concurrent last-Manager protection, stable actor identity/action-time labels, explicit readmission and no credential revival; operator recovery preserves rather than grants Manager authority |
| MF-CLIENT-01 | Reproducible owner-secret preparation, initial Manager setup, actor-specific curl workflows, understandable refusal/uncertainty and recovery; later modules add sample media and actual capability workflows |
| MF-AC-02/03/04 | Local membership/credential/management/concurrency evidence is fully defined; asset/action/work/accounting/transfer subjects remain explicitly scheduled integration evidence, not local whole-case passes |
| Approved Module Plan | Ownership/dependencies and final gate preserved; stable actors and authority/admission boundary are the only necessary shared contracts; no future processing/retry/preview/deletion architecture selected |
| Q1–Q14 and ADRs | All decisions approved, Q6 clarification retained, no unresolved implementation-blocking contradiction; ADRs updated to remove obsolete pending statements |

**Conclusion:** Module 01 Technical Discovery is formally complete on 2026-10-14. No genuine implementation-blocking contradiction found. Final PRD and Module Plan require no changes. Specification authoring is authorized; specification approval remains pending and ticket generation/implementation/Module 02 are not authorized. Discovery closure is not module implementation acceptance or a claim that tests passed.

**Specification outcome:** The implementation-ready [Module 01 specification](./spec.md) has been authored using the installed to-spec skill. It covers all five owned requirements, local portions of MF-AC-02/03/04 and scheduled later integrations. Its ready-for-agent triage status indicates decomposition readiness, not authorization to generate tickets or implement. Explicit Product Owner specification approval remains required.
