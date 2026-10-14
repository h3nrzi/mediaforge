# MF-MOD-01 — Private Workspace and Member Authority

Status: ready-for-agent
Specification approval: Explicitly approved by the Product Owner on 2026-10-14 as the authoritative MF-MOD-01 implementation specification.
Implementation readiness: Sufficiently specified for later agent work; readiness is distinct from approval and does not authorize execution.
Ticket generation / implementation: Not authorized; no tickets or application code created.
Executed verification / acceptance: Not executed; no tests or acceptance cases claimed passed, and no capability claimed implemented.
Prepared: 2026-10-14.

## Product Owner Approval Record

On 2026-10-14, the Product Owner explicitly stated: “I explicitly approve `.scratch/mf-mod-01/spec.md` as the authoritative implementation specification for **MF-MOD-01 — Private Workspace and Member Authority**.”

Approval covers the complete specification and its implementation decisions; the HTTP service and operator-command testing seams; the shared authority boundary and cross-module integration obligations; all 17 verification scenarios (M01-V01 through M01-V17); the requirement and acceptance coverage; and the selected Node.js, SQLite, credential, concurrency and documented-client approaches. The approved product requirements, technical decisions and traceability are preserved.

This action records specification approval only. The Product Owner explicitly instructed that `to-tickets` must not be invoked, implementation tickets must not be created, application code must not be written and Module 02 must not be started. Approval and the `ready-for-agent` triage value do not authorize those actions or establish executed verification, implementation completion or acceptance.

## Problem Statement

The team needs a private shared workspace in which access is explicitly admitted, responsibilities can be combined, and removal immediately closes future authority. Managers must not accidentally leave the workspace without an admitted Manager, and changing access must not erase who performed earlier actions or cancel independently admitted work. Initial access, lost credentials, concurrent changes and lost acknowledgements must be understandable and recoverable through supported tools.

Module 01 owns the workspace's membership, responsibility evaluation, revocation, stable actor identity and documented-client starting point. It establishes the authority contract that later real sources, requests, outputs and history must use. It does not implement those capabilities.

## Solution

Provide one private backend workspace with an operator-run, one-time initialization command; Manager-controlled membership and independent responsibility assignments; actor-bound opaque bearer credentials; a constrained operator credential-recovery command; and version-controlled curl workflows. Persist authority in SQLite on one host. Evaluate current authority and competing-change preconditions inside the same durable transaction as each effect, preserve at least one admitted Manager, and report accepted, refused and indeterminate actions accurately.

Technical Discovery Q1–Q14 is complete and explicitly approved; Q6's recipient-identity/secret-ownership clarification is binding. This specification synthesizes those decisions and records the implementation details now explicitly approved by the Product Owner. Its triage label means sufficiently specified for later agent work; approval is recorded separately and ticket generation/implementation remain unauthorized.

## User Stories

1. As a trusted host operator, I want to prepare the first Manager's owner-held credential before initialization, so that interruption cannot strand access solely through a lost secret response.
2. As a trusted host operator, I want to initialize exactly one workspace and one Manager atomically, so that no partial authority boundary exists.
3. As a trusted host operator, I want later or competing bootstrap attempts refused without modification, so that established authority is preserved.
4. As the initial Manager, I want only Manager responsibility, so that other capabilities require explicit assignment.
5. As a Manager, I want to admit an explicitly identified actor with chosen responsibilities, so that access is deliberate and reproducible.
6. As an admitted member, I want shared read authority even with no responsibilities, so that membership and modification permissions remain distinct.
7. As a Manager, I want to combine responsibilities without inheritance, so that one person can carry exactly the required duties.
8. As an admitted member, I want to inspect my stable identity and current authority, so that I know which actor my client represents.
9. As a Manager, I want bounded lookup of admitted and removed actors, so that I can manage exact identities rather than ambiguous labels.
10. As a Manager, I want to edit current display labels, so that identification remains useful without rewriting historical labels.
11. As a Manager, I want stale changes rejected with current permitted facts, so that another Manager's newer decision is not silently overwritten.
12. As a Manager, I want to remove membership and responsibilities safely, so that future authority is revoked without cancelling admitted work.
13. As a Manager, I want concurrent removals/demotions to preserve an admitted Manager, so that the workspace never loses its management boundary.
14. As a Manager, I want readmission to use an exact actor ID, fresh credentials and explicit assignments, so that old access is never restored automatically.
15. As a returning actor, I want my identity and earlier attribution preserved, so that readmission does not rewrite who submitted earlier work.
16. As a credential owner, I want to retain my secret locally and share only registration metadata, so that Managers never need my credential file.
17. As a Manager, I want to register only identity-confirmed, actor-bound verifier material, so that another person's credential is not accidentally registered to the wrong actor.
18. As an admitted member, I want to replace my own credential, so that I can maintain access without gaining management authority.
19. As a Manager, I want another actor's replacement guarded by an observed credential revision, so that I cannot unknowingly invalidate a newer replacement.
20. As an admitted member, I want to revoke my exact credential, so that repetition cannot revoke a replacement.
21. As a Manager, I want to revoke another admitted member's exact credential, so that compromised access can be closed without altering membership.
22. As a credential owner, I want issuance and expiry metadata, so that I can prepare replacement before the 30-day boundary.
23. As a Manager, I want membership removal to invalidate credentials permanently unless new material is explicitly registered, so that readmission does not revive old secrets.
24. As a trusted host operator, I want narrowly scoped recovery for an existing admitted Manager, so that total Manager credential loss does not require workspace reset.
25. As a removed actor, I must be denied new inspection/actions, so that historical participation confers no present access.
26. As a client user, I want bounded contention and clear refusals, so that a busy database does not cause indefinite acquisition attempts.
27. As a client user, I want uncertain outcomes preserved after lost acknowledgements, so that I do not create another effect blindly.
28. As a client user, I want credential recovery to preserve original issuance, expiry and attribution, so that checking an outcome is not another registration.
29. As a future capability owner, I want an atomic authority/admission interface, so that my action cannot use permissions checked before revocation.
30. As an acceptance reviewer, I want reproducible actor-specific evidence with explicit outstanding integrations, so that local tests are not mistaken for whole-product acceptance.

## Implementation Decisions

### 1. Scope and implementation units

Build one cohesive workspace-authority service, with HTTP and operator-command adapters, a local credential-preparation helper and a SQLite transaction/persistence adapter. The adapters call the same domain operations and guards. No separate identity microservice, remote permission oracle, generic infrastructure module or processing service is introduced.

Routine stack choice: Node.js 24 LTS, initially pinning the verified current 24.22.0 patch; JavaScript ES modules; built-in HTTP/HTTPS, crypto, filesystem, SQLite and test-runner facilities. This avoids an unnecessary framework/compiler/native third-party addon for this bounded module. Keep SQLite binding calls behind a small persistence adapter: the built-in SQLite API has release-candidate stability and is synchronous, so it is replaceable without changing approved storage or authority semantics. Pin/runtime-check the selected API surface; do not infer compatibility from the developer machine's installed Node 26. Retain existing repository tooling conventions if later implementation discovers additional applicable instructions.

Use immediate, nonblocking writer-acquisition attempts with asynchronous bounded backoff before the mutation body, rather than a long synchronous busy timeout that stalls the HTTP event loop. Once acquired, the short synchronous database body is not interleaved with another request. This is Module 01 scheduling only; it chooses no later worker/process architecture. No package manifest or executable is created during specification authoring.

### 2. Persisted facts and invariants

| Subject | Persisted bounded facts and constraints |
| --- | --- |
| Workspace | Fixed singleton identity, initialization marker/time and initial Manager actor ID; marker is committed with the complete initial authority state |
| Workspace actor | Immutable generated actor ID, current display label, first admission time and immutable first-admission origin/actor-ID/action-time-label facts, admitted/removed status, explicit responsibility set, monotonically increasing membership version and credential revision |
| Latest membership change | Server application time, origin and action-time actor ID/label for authenticated member actions; explicit operator origin for bootstrap; bounded latest-change facts, not an append-only event archive |
| Latest credential registration | Exact credential ID, actor binding, registration revision, SHA-256 verifier bytes, issuance/expiry time, explicit revoked/invalidated status, latest change time/origin and member action-time attribution where applicable |
| Operator credential recovery | Explicit host-operator origin, affected actor/credential, application time and bounded local OS principal identifier; no fabricated authenticated workspace actor |

Initialize actor membership version and credential revision at one during admission. Successful changes increment the affected version once; logical no-ops, refused changes and outcome inspection do not increment it. Credential-only changes do not change membership version. Membership changes that invalidate credentials update the credential revision atomically with membership state. If credentials were already explicitly invalidated and another operation changes no credential state, it must not manufacture another revocation effect. Expiry is computed from current server time, not stored as a background-job transition.

Store responsibility values as a validated set of Contributor, Reviewer, Operations and Manager; reject unknown/duplicate values. An empty set is valid for an admitted member. Removed actors have no current responsibilities and no usable credentials. At least one admitted actor holds Manager after every committed membership mutation. Expired/revoked Manager credentials do not remove that actor from the admitted-Manager count; approved operator recovery addresses credential loss.

Actor labels may duplicate. Validate nonempty, well-formed Unicode labels without silently truncating, replacing or normalizing supplied identity text; reject control characters. Apply the approved 80-code-point label, 128-code-point public identifier and 512-code-point reason-summary bounds. Generated actor IDs are UUIDs. Version/revision values are stored as bounded positive integers and serialized as decimal strings to avoid JSON precision loss; exhausted numeric space fails without wraparound or mutation. These are implementation encodings, not changed product limits.

Only the latest bounded administration/credential facts are retained by this module; do not create an unrestricted actor-action or credential-event archive. Retain removed actor identity because it is needed for exact readmission and dependent attribution. No actor purge API is introduced. Later capability facts retain their own action-time actor ID/label; current label changes never rewrite them. Use foreign keys that prevent deleting referenced actors; no cascades from membership removal into work/media/history.

### 3. Credential material, authentication and replay protection

The owner helper generates independent cryptographic randomness: 32 bytes for the raw secret and a fresh random component for the credential ID. The raw secret is encoded canonically with base64url; the verifier is SHA-256 of its decoded bytes. Bootstrap/new admission prepares the actor ID and initial credential revision locally; replacement prepares against observed non-secret target revision metadata. The private owner file records the actor binding, intended next registration revision, ID, secret and verifier; it is never sent to another member. A separate shareable registration descriptor contains only actor ID, credential ID, expected revisions and verifier. Confirm recipient identity and actor binding out of band before Manager registration; the service does not claim to prove a real person's identity.

Credential IDs include the actor identity and intended registration revision plus the random component, within the 128-code-point bound. Treat them as opaque outside the helper/service. Enforce that a new registration's intended revision is the actor's next credential revision. This prevents an old credential locator from being reused after replacement/revocation without retaining every historical token. A registration attempt's actor/ID/revision/verifier binding is immutable; mismatched binding is refused. The random secret is independent of locator contents, and locator contents confer no permissions. Generate fresh material for deliberate replacement/readmission.

The Authorization bearer value combines credential ID and owner-held secret in a documented canonical encoding. Enforce one header, strict parsing, expected random-secret byte length and canonical encoding; reject duplicate headers, malformed/oversized credentials and verifier-as-secret use. Locate the matching actor registration, hash the supplied secret and use constant-time verifier comparison. Never accept actor ID, credential ID, verifier, label, role claims, cookies or query-string tokens as authentication. Do not serialize stored verifiers or secrets in normal API responses; registration descriptors are input material, not public roster fields.

The owner helper atomically creates a new private file with exclusive creation and owner-only permissions, confirms safe ownership/non-symlink destination, flushes file contents and parent directory before reporting readiness, and never overwrites an existing credential file silently. Owner curl configuration is also owner-only and contains the bearer secret; the owner helper may derive it locally without displaying the secret. Normal output contains only non-secret metadata and artifact locations. Interrupted preparation never registers incomplete material; incomplete local artifacts are identified as such without overwriting a known valid file. Documentation excludes private credentials/configuration from version control and evidence transcripts. HTTP headers, bodies and SQL parameters carrying credential material are redacted from logs/diagnostics; never enable secret-bearing request/SQL traces.

Credential issuance time is the server's final registration/application-gate time in the successful transaction. Expiry is exactly issuance plus 30 elapsed days, with expiry at now greater than or equal to that value. Use trusted server UTC epoch time including downtime; expose ISO timestamps. Reads/recovery do not extend it. A failed/rolled-back registration establishes no issuance. The one-second contention budget uses a separate monotonic clock. Self-service requires a valid current credential; expired credentials cannot renew themselves. Manager replacement or admitted-Manager operator recovery restores access using new owner-prepared material. No idle timeout, refresh token or automatic renewal exists.

### 4. Membership operations

Manager admission creates the actor, admitted membership, explicitly supplied assignments and first verifier in one transaction using a caller-prepared actor ID. Creating a new person always creates a new ID. Admission requires absence of that ID; replay against an existing ID is either an authorized confirmation of matching current admitted facts with no mutation or a binding/state conflict, never another creation. It cannot reactivate a removed actor.

Manager label/responsibility edits require the observed membership version. Responsibility replacement uses the complete desired set, not toggles. Current Manager authority, precondition and last-Manager invariant are checked in the transaction. A Manager may edit themselves subject to those same guards; self-demotion/removal is allowed only if another admitted Manager remains. A satisfied absolute state causes no new version, timestamp or attribution; stale incompatible state returns current permitted facts for reconsideration.

Removal requires the observed membership version and atomically clears assignments, changes membership to removed and invalidates credentials. It cannot cancel work, delete media, release accounting or rewrite attribution. Exact-ID repeated removal adds no effects; stale removal after readmission is refused rather than removing the newly readmitted actor.

Readmission is a distinct Manager operation targeting an existing removed actor with observed membership and credential revisions, explicit desired assignments and fresh verifier material. It preserves actor ID, first-admission facts and historical attribution, changes current admission state and registers the next credential revision atomically. It does not restore former assignments/credentials. A same-label lookup is never sufficient targeting. A returning original request submitter retains that identity, but later own-request actions require current Contributor authority and the later capability's eligibility.

No historical-state inference grants mutation authority: a caller removed or demoted since initiating an action must fail the current gate even if a previous state would have permitted it. First-admission attribution is an independently retained historical fact; later changes to the admitting Manager's current label/membership do not update that snapshot, providing real local evidence of stable attribution without inventing a media record or maintaining an unrestricted management-event log.

### 5. Credential operations and operator recovery

| Operation | Current caller/target guard | Atomic preconditions and result |
| --- | --- | --- |
| Self replacement | Valid exact current credential and admitted membership; no Manager requirement | Authenticating credential/revision still current; register prepared candidate and invalidate old credential atomically; membership/responsibilities unchanged |
| Manager replacement | Authenticated admitted Manager; target currently admitted | Observed credential revision; next-revision candidate bound to exact target; stale 409; targeting self uses the same self-replacement guard |
| Exact credential revocation | Authenticated owner of the current credential, or admitted Manager for another admitted target | Target exact credential ID; no reinterpretation as current replacement; actual revocation advances credential revision once; repeated old-ID action cannot revoke a newer ID |
| Operator recovery | Local trusted operator; exact existing currently admitted Manager target | Observed credential revision; final target still admitted Manager; prepared next-revision descriptor; change credential only, record operator origin |

When an exact candidate ID/verifier/actor binding is already the current registration, authorized confirmation returns original metadata without changing time, revision, attribution or validity. It never resets expiry. If explicitly revoked or superseded, mutation replay is refused; permitted inspection may show retained latest metadata but grants no authentication or revival. A time-expired latest registration can be inspected by another currently authorized Manager/operator without being renewed. An old self-replacement credential receives 401 after replacement; the saved candidate is used to authenticate/inspect the result.

For actual third-party replacements, observed revision must match current state. For no-effect confirmation of the exact current non-revoked candidate, validate caller authority and binding before recognizing it; confirmation is not a way to skip authorization or freshness for another mutation. After later replacement/revocation/readmission, an old candidate/precondition cannot apply again. Revision conflicts report permitted current IDs/status/times/revisions, not secrets/verifiers.

Operator recovery is a host-only command, not an HTTP endpoint. It receives the identity-confirmed recipient's descriptor, never their raw credential file. Querying preparation/status metadata is read-only and subject to the same trusted-host boundary; actual recovery rechecks target and revision. Record operator origin from local OS principal metadata rather than a caller-asserted workspace actor. It cannot edit labels, assignments, membership, workspace state or other capability facts.

### 6. Bootstrap, startup and storage behavior

Provide local commands for credential preparation, initialization status, bootstrap, admitted-Manager recovery status and admitted-Manager credential recovery. No unauthenticated network setup endpoint or public registration exists. Bootstrap takes a prepared initial actor/registration descriptor and display label; operator input never includes the raw bearer secret. It creates singleton workspace state, initial admitted Manager-only membership and first credential atomically. A committed initialization marker makes every subsequent bootstrap attempt refuse without modification, including a same-candidate rerun. Competing bootstraps cannot both succeed.

After a lost bootstrap response, the owner authenticates with the saved candidate and verifies the actor ID. Host initialization status can establish whether initialization committed. If committed, do not rerun or reset; if another candidate won, report already initialized without adopting that actor. Retry the same prepared candidate only when trustworthy inspection establishes initialization did not commit and no earlier active attempt can later commit; otherwise preserve uncertainty. Lost committed owner material uses separate operator recovery.

Use one explicit persistent local database location configured independently of working directory. Never silently create a fresh workspace because the configured store is missing/corrupt on ordinary service startup. The bootstrap/setup command deliberately creates and migrates a new store; ordinary startup opens an existing store, verifies schema and required pragmas, and refuses service when they cannot be established. Uninitialized service exposes no usable membership/capability operations. Operator status distinguishes absent, uninitialized, initialized and unavailable without editing records.

Enable WAL and FULL synchronization for the database and foreign-key enforcement on every connection; verify rather than assume defaults. Use parameterized statements and disable extension loading. Version migrations are atomic, non-destructive and preserve IDs, revisions, initialization, verifier/expiry and attribution. Do not run a destructive migration or initialize an empty replacement database to recover corruption. The database directory/files and WAL sidecars are protected from untrusted users; durability assumes functioning local storage and correct flush behavior, not an invented availability guarantee.

### 7. Transaction and admission boundary

Every mutating operation has one owned connection/transaction scope. Acquire BEGIN IMMEDIATE before reading decision state, using a configurable default 1,000 ms cumulative monotonic acquisition budget. Reattempt only unsuccessful acquisition, account for prior waiting and stop after exhaustion. No request may execute inside another request's open transaction. Keep external I/O and input/recipient preparation outside the writer; the operation body executes once.

Inside the transaction, revalidate the presented credential, target state, actor's current membership/responsibilities and observed preconditions; then evaluate the last-Manager/binding invariants. At the final application gate, take fresh server time and verify expiry again before writing effects/attribution. This establishes the logical action/application time and ordering inside the atomic transaction; acknowledgement waits for durable commit. A no-effect refusal rolls back/ends the transaction cleanly. Current state wins over request-arrival permission snapshots. No frozen credential cache may authorize effects after replacement/removal.

On failure, inspect connection transaction state and SQLite error semantics; roll back an active uncommitted transaction safely where possible. Never equate autocommit state or an exception alone with a committed/refused action. Discard any connection whose state cannot be established. Do not repeat an executed body or indefinitely retry COMMIT. Admission failures established before any body/effect are refused without effect. Confirmed rollback is refused without effect. Lost commit/response knowledge is indeterminate until trustworthy inspection; do not invent success/refusal because the service restarted. Fail closed for mutations while authority/storage state cannot be trusted, while retaining permitted read/recovery opportunities when their facts can be established.

Reads use fresh short-lived transactions/queries that combine current authentication/membership with the facts returned. They must not reuse a long-lived stale authority snapshot between calls/pages. A read authorized before a concurrent removal can complete; the next call is denied. Future downloads obey the approved already-authorized transfer policy; Module 01 creates no media-transfer system.

### 8. HTTP and documented-client contract

All control responses are JSON with stable fields for result, actionStatus, reasonCategory, message and permitted data/currentState. ActionStatus is accepted, refused_without_effect or indeterminate for actions; reads have no inferred historical action status. An already-satisfied/no-change response explicitly identifies no new effect and does not falsely assert an unproven earlier action occurred. IDs/revisions use exact strings; timestamps are server times. Private responses carry Cache-Control: no-store. Errors do not include raw stack traces, secrets, verifiers or unauthorized target facts.

| HTTP operation | Authorization and input contract |
| --- | --- |
| GET /v1/me | Valid credential and admitted membership; returns exact actor ID/current label, responsibilities, versions and current credential ID/status/issuance/expiry |
| GET /v1/actors | Manager only; bounded management directory, including admitted/removed actors; no secrets/verifiers |
| GET /v1/actors/{actorId} | Manager only, or exact self for own permitted facts; target identity/status/versions and latest bounded attribution |
| PUT /v1/actors/{actorId} | Manager admission only; prepared new actor ID, label, complete assignments and registration descriptor; must not replace existing actor state |
| PATCH /v1/actors/{actorId} | Manager only; observed membership version and explicit desired label and/or complete responsibility set; cannot change immutable ID or membership implicitly |
| POST /v1/actors/{actorId}/remove | Manager only; observed membership version; exact-state removal guard |
| POST /v1/actors/{actorId}/readmit | Manager only; observed membership/credential revisions, complete assignments and fresh prepared descriptor |
| GET /v1/actors/{actorId}/credential | Authenticated self or Manager; non-secret current/latest registration metadata for permitted inspection/preparation |
| POST /v1/actors/{actorId}/credential | Authenticated self replacement or Manager replacement; prepared descriptor and expected revision, with distinct current guards |
| POST /v1/actors/{actorId}/credentials/{credentialId}/revoke | Authenticated self or Manager for another admitted target; exact-ID targeting, never a current-credential wildcard |

Use authenticated requests only; no role/actor supplied in a body overrides authenticated identity. Return 400 for invalid JSON/fields or missing required preconditions, 401 for absent/invalid/expired/revoked authentication, 403 for insufficient current authority, 404 for unknown permitted targets/routes after applicable authorization, 409 for stale version/binding/last-Manager conflicts, 413 for oversized control bodies, and 503 for unavailable storage/admission. A 503 actionStatus is refused_without_effect only when non-admission/rollback is established; otherwise it is indeterminate with safe inspection guidance. A disconnected client cannot infer outcome from an absent response.

Use a configurable 16 KiB JSON control-body limit as an implementation guard, not a new media/product bound. Validate content type, well-formed JSON, recognized fields, ID/label/reason limits and responsibility sets before entering mutation. No uploads, arbitrary processing commands or raw credential values are accepted in JSON control bodies. Local development binds loopback for unencrypted transport; nonlocal deployments require HTTPS with configured certificate/key and refuse insecure external binding. No TLS bypass in walkthroughs; proxy termination or cloud hosting is not designed by this module.

The actor directory defaults to 50 items, maximum 100, validates exact actor ID/membership filters and orders by immutable first admission time descending then actor ID descending. Continuation follows that order boundary and is validated against the requested filter set; it grants no authority and every page rechecks current Manager authority. Readmission does not rewrite first admission ordering; current status/label may change. This is a bounded management directory only, not Module 02's source/request/history listing implementation or acceptance claim.

Use curl 8.x supporting --json and --fail-with-body, with --disable first to ignore ambient configuration, owner-only per-actor config selection and no automatic redirect following. JSON bodies are separate files with no raw secrets. Raw secrets must not appear in literal command arguments, shell history, trace flags, evidence output or version control. Optional jq formats JSON but is not required. Document all actor preparations and trusted descriptor/identity-confirmation handoffs; never suggest sharing an owner credential file with a Manager.

Document service starting point, configured database/transport, owner preparation, bootstrap and recovery, actor-ID-based switching, Manager-only admission, each responsibility alone/combined and zero-role membership, stale updates, credential operations and lost-response inspection. Show real HTTP results with actor IDs, assignment/version facts and readable permission/conflict feedback. Unsupported later capabilities are explicitly scheduled, not fake demonstration endpoints or successful placeholder actions.

### 9. Administrative uncertainty and permitted recovery

| Interrupted action | Permitted inspection and safe result |
| --- | --- |
| New actor admission | Manager looks up the same prepared actor ID; matching current facts establish admission/current state; no new ID is generated merely because acknowledgement was lost |
| Membership/role/label change | Authorized lookup returns current version and latest bounded change facts; if later changes prevent proof of the earlier outcome, preserve that uncertainty rather than reapply stale intent |
| Credential registration/replacement | Owner tries the saved candidate and inspects identity; Manager/operator may inspect allowed ID/revision/status/time metadata; confirmation never refreshes expiry or re-registers old material |
| Revocation | Authorized lookup/inspection of exact ID confirms current status; repetition never redirects to a newer credential; self may need another Manager after invalidating their own credential |
| Bootstrap | Candidate authentication and host initialization status; initialized bootstrap never changes state; authoritative non-initialization permits same-candidate retry |
| Operator recovery | Operator inspects exact admitted-Manager credential metadata/revision; do not overwrite a newer candidate after uncertain response |

No unlimited receipts/action archive is introduced to prove every superseded historical management action. Return trustworthy current facts and acknowledge when they cannot prove a past result. Any deliberate new change uses newly observed state and appropriate fresh material/preconditions; it is distinct from recovering an unestablished earlier result. Inspection itself always uses current authorization or the narrow approved host-operator boundary.

### 10. Stable integration obligations

| Consumer | Contract supplied by Module 01 | Responsibility retained by the consumer |
| --- | --- | --- |
| Module 02 | Current read authority on every listing/continuation/retrieval, authenticated actor identity and action-time label, Contributor admission guard in the same transaction boundary | Actual sources/media, submission references/recovery, quotas, provenance dependency retention, common listing/feedback semantics |
| Module 03 | Current Contributor guard and stable actor references; shared admitted-member retrieval authority; no Manager inheritance | Source/request ownership facts, processing eligibility/admission, preset/outcome/deliverable verification and outstanding-request accounting |
| Module 04 | Contributor-own or Operations-any permission evaluation using supplied authoritative request submitter ID; Operations policy guard; no Manager-only retry/cancel power | Request eligibility, retry/cancellation/reconciliation facts, Operations checks and provisional-cleanup safety |
| Module 05 | Current Reviewer guard and stable attributed identity; shared read authority independent of selection | Preview/selection eligibility, stale selection state and actual review evidence |
| Module 06 | Current Manager deletion/follow-up guard and actor attribution; already-authorized transfer distinction | Deletion closure, blockers, actual cleanup, capacity credit, former-selection context and history-only expiry |
| Gate 07 | Labeled local evidence, outstanding integration ledger and documented actor/client convention | Complete MF-AC-02/03/04 and all other whole-product cases, release evidence and Product Owner acceptance |

Expose one authority operation boundary that takes authenticated proof plus an action kind and authoritative subject facts, evaluates current membership/responsibility/ownership at the consuming admission's final gate, supplies stable attribution and allows the consumer's admitted state change in the same owned transaction. Never return a reusable authorized boolean after closing the transaction. Keep the credential proof confined to this boundary; consumers use authenticated actor facts, not caller-asserted identities. A later consumer must not implement its own role semantics or independently commit an effect after a remote/preliminary permission check.

Policy kinds cover admitted-member shared read; Contributor source/new-request submission; Contributor own-request or Operations any-request retry/cancellation; Reviewer selection; Operations evidence checks/provisional cleanup; Manager membership/responsibilities and accepted-media deletion/follow-up. The consumer supplies a request's submitting actor ID; source uploader identity grants no own-request power. Unknown action kinds deny. Combining responsibilities unions their permitted actions and never bypasses the consuming capability's eligibility, quota or lifecycle rules. Policy coverage can be verified locally without implementing future endpoints, but is not evidence that those real workflows pass.

Revocation does not cascade into work, stop intent, accounting release or history expiry. Already-admitted work survives regardless of actor membership; later modules demonstrate its actual accounting/outcomes. Every continuation/retrieval checks current read authority; possession of a cursor, output ID or historical attribution confers none. Historical actor snapshots remain stable, but their dependency lifetimes and accepted-history expiry stay with Modules 02/06.

## Testing Decisions

### Primary seams and prior art

The highest feature seam is the running Module 01 service boundary: real HTTP operations plus the supported local operator/helper commands, sharing the same authority implementation and a real temporary on-disk SQLite store. Assert external results, identities, versions, attribution and persistence; do not mirror SQL statement order or implementation functions. HTTP and host commands are necessarily distinct entry points, not separate policy systems. No existing application tests or test framework constrain this repository.

Use Node's test runner and child processes for HTTP/CLI/restart/concurrency verification. Prefer this single feature boundary; narrowly inject a trusted test clock and persistence fault/transaction checkpoint controls only where expiry/commit uncertainty cannot be induced deterministically from outside. Controls are available only through test construction, never production HTTP, environment-selected arbitrary remote callbacks or operator override endpoints. Run the real mutation body against real SQLite; no tests edit outcomes or fabricate accepted records to manufacture passes. Fault controls can pause/drop acknowledgements or raise a storage-interface failure without inventing final product facts.

For policy kinds whose real workflows do not exist yet, use the shared authority boundary with a minimal test consumer and authoritative ownership facts. Label this policy-contract verification, not media/request/preview/deletion acceptance. No fake production capability endpoint is added to satisfy a case.

### Verifiable scenarios

| Verification ID | Scenario and externally observable result | Requirement / acceptance contribution |
| --- | --- | --- |
| M01-V01 | Owner-only material preparation precedes registration; public descriptor contains no secret; server/logs/evidence/config version control contain none; unsafe existing/symlink file destinations refused | MF-CLIENT-01; MF-AC-01/02 local |
| M01-V02 | Atomic Manager-only bootstrap, failure before commit, dropped acknowledgement after commit, competing independent processes, initialized rerun; exactly one workspace/initial Manager and stable candidate recovery | MF-ACCESS-01/04, MF-CLIENT-01; MF-AC-03/04 local |
| M01-V03 | Anonymous, malformed, wrong-secret, verifier-only, expired and removed callers denied; valid zero-role member inspects self but cannot manage actors; no target facts leaked to unauthorized callers | MF-SCOPE-02, MF-ACCESS-01/03; MF-AC-02 local |
| M01-V04 | Each responsibility alone, combinations and all roles; only Manager controls membership, no Manager inheritance; policy contract checks own/other request submitters and shared-source distinctions | MF-ACCESS-01; MF-AC-03 local policy, later real workflows pending |
| M01-V05 | Two Managers attempt competing demotions/removals, including self-actions; one ordered result preserves at least one admitted Manager; versions/attribution reflect only committed changes | MF-ACCESS-03/04; MF-AC-04 local |
| M01-V06 | Stale label/assignment/removal, exact desired no-op, repeat after subsequent change and readmission; no overwrite, extra version or attribution; readable permitted current facts | MF-ACCESS-03/04, MF-CLIENT-01; MF-AC-04/42 local |
| M01-V07 | Removal clears assignments/invalidates credential; exact-ID readmission with fresh material; duplicate labels/new person; old locator cannot revive; earlier action-time actor/label facts unchanged | MF-ACCESS-03/04; MF-AC-02/04/38 local identity |
| M01-V08 | Self replacement without Manager power, denied other-actor replacement, valid Manager replacement, concurrent Manager/operator revisions, exact current confirmation and superseded/revoked replay | MF-ACCESS-01/03/04; MF-AC-02/03/04 local |
| M01-V09 | Before/exactly at/after 30-day expiry using a controlled clock; reads/no-op confirmation do not extend expiry; candidate expiring while waiting cannot mutate; role removal/replacement while waiting honored | MF-ACCESS-03, MF-CLIENT-01; MF-AC-02/04 local |
| M01-V10 | Exact-ID revoke, repeated revoke and later replacement; old-ID replay does not revoke current ID; credential-only changes preserve membership and roles | MF-ACCESS-03/04; MF-AC-02/04 local |
| M01-V11 | Recovery of lost/expired admitted Manager credential preserves identity/roles and records operator origin; removed/non-Manager/stale target refused; bootstrap not used as recovery | MF-ACCESS-04, MF-CLIENT-01; MF-AC-02/04 local |
| M01-V12 | Independent connection/process holds writer; acquisition succeeds within budget or returns known 503/refused without body execution; cumulative wait budget not reset; no request interleaves inside another transaction | MF-ACCESS-03/04, MF-CLIENT-01; MF-AC-04/42 local |
| M01-V13 | Known pre-effect failure, confirmed rollback, indeterminate commit-interface failure and lost response; no automatic body rerun; unusable connection discarded; inspection reports only established facts | MF-ACCESS-03/04, MF-CLIENT-01; MF-AC-04/42 local |
| M01-V14 | Process interruption/restart preserves initialized state, actor IDs, versions, verifier status, original expiry and attribution; absent/corrupt store does not silently initialize or serve writable authority | MF-ACCESS-04, MF-CLIENT-01; MF-AC-04 local |
| M01-V15 | Exact label/ID/reason bounds, excess and invalid fields, unknown/duplicate responsibilities, revision overflow; clear refusal/no effect; no silent truncation | MF-CLIENT-01; supporting MF-RESOURCE-06, MF-AC-42 local |
| M01-V16 | Directory default/max/invalid page sizes, exact filters/order/tie-break, continuation with current status and Manager demotion between pages; denied next page and no cursor authority | MF-SCOPE-02, MF-CLIENT-01; MF-AC-02 local; MF-AC-41 later record listings pending |
| M01-V17 | Documented curl walkthrough executes real admission/assignment/self inspection/denial/removal/recovery; readable 401/403/409/503 and no-store; no redirect/ambient-config/secret-transcript leakage | MF-CLIENT-01; MF-AC-01/02/03/04/42 local |

Test races with barriers and independent processes/connections rather than hoping concurrent HTTP calls happen to collide. After failed/competing actions, assert invariant preservation, exact versions/current credentials and absence of duplicate attributed effects. Test actual post-commit restart and dropped transport acknowledgement separately from simulated storage-interface uncertainty. Do not claim to have tested physical power-loss durability merely by killing a process; configuration and functioning storage assumptions remain explicit.

Field-boundary evidence distinguishes maximum-length validation from format validity: valid 80-code-point labels pass, overlong labels fail, generated identifiers always obey the 128-code-point bound and overlong supplied identifiers are refused. An arbitrary 128-character value is not promised to be a valid UUID or credential locator. Bounded readable reasons preserve their category/action status instead of making raw internal diagnostics necessary.

### Acceptance coverage and local completion gate

| Owned PRD requirement | Specification coverage | Required local evidence |
| --- | --- | --- |
| MF-SCOPE-02 | Private singleton, baseline admitted-member read, authenticated current-call boundary and consumer contracts | M01-V02/03/04/07/09/16/17; later real records/media/continuations |
| MF-ACCESS-01 | Independent responsibility set, zero-role membership, Manager-only management and consumer policy kinds | M01-V02/03/04/08/11; later actual permitted/denied capability actions |
| MF-ACCESS-03 | Final transaction gate, invalidation/expiry, current state after contention, no access-change side effects | M01-V05/06/07/08/09/10/12/13; later admitted-work/accounting/transfer |
| MF-ACCESS-04 | Last-Manager invariant, stable actor/snapshots, revision guards, readmission and operator recovery | M01-V02/05/06/07/08/11/14; later dependency-pinned attribution |
| MF-CLIENT-01 | Owner preparation, initial setup, identified curl actors, human-readable outcomes/recovery and extension convention | M01-V01/02/11/13/15/17; later sample files/real processing/review/Operations/Manager media workflows |

| Primary acceptance responsibility | Module 01 evidence | Outstanding full-scenario participants |
| --- | --- | --- |
| MF-AC-02 — Private shared access | Real actor/current-authority/management boundary and shared-read policy verification | Modules 02/03/05/06 provide actual shared sources/requests/outputs/history/media and denials |
| MF-AC-03 — Responsibility combinations | Real assignments/management denials, zero roles/combinations and own/other policy contract | Modules 02/03/04/05/06 exercise actual Contributor, Reviewer, Operations and deletion actions; Module 03 supplies request ownership |
| MF-AC-04 — Revocation and last Manager | Real competing membership changes, credential gates, stable identities/labels, interruption/recovery | Module 03 demonstrates admitted-work/counters/outcomes; Module 06 demonstrates previously authorized transfers/deletion interactions |

For Module 01 completion, execute the applicable local scenarios against the implemented service, retain secret-free evidence with exercised scope, document failures/resolutions, and record outstanding integrations. Demonstrate current authority through actual membership/credential operations rather than only mocked policy tests. No local whole-case MF-AC-02/03/04 pass is claimed before the named participants exercise the complete original scenario. Also supply the Module 01 portions of MF-AC-01/29/33/37/38/41/42/44 when their subjects become available; acceptance gate 07 coordinates the final complete evidence.

## Out of Scope

- Application code, ticket generation or implementation in this specification-authoring session; beginning Module 02.
- Public signup/sharing, per-asset private collections, custom browser UI, password login, identity-provider integration or transferable member credential files.
- Multi-workspace or independent multi-host authority deployment; network-filesystem SQLite; cloud/hosting or backup/restore architecture.
- Real source intake, upload/request submission references, resource accounting, processing/presets, retry/cancellation execution, reconciliation, previews, editorial selection, media transfer/deletion/cleanup or history-only expiry.
- New product quotas, SLAs, forced runtime learning mechanisms, unlimited management/operator logs or fabricated acceptance/mastery/performance claims.
- Any policy change to the approved PRD or Module Plan. Shared contracts do not transfer later capability ownership to Module 01.

## Further Notes

### Authority and traceability

Authoritative context: [Final PRD](../../final-prd.md), [approved Module Plan](../../module-plan.md), [Charter](../../project-charter.md), [glossary](../../GLOSSARY.md) and [complete Technical Discovery/approval records](./technical-discovery.md). Historical pending headings in earlier documents do not reopen approved policy. ADRs: [stable actor/current authority](../../docs/adr/0001-actor-identity-and-current-authority.md), [atomic application boundary](../../docs/adr/0002-atomic-authority-and-admitted-effects.md), [credential provisioning/operator trust](../../docs/adr/0003-credential-provisioning-and-operator-recovery.md), [SQLite single-host persistence](../../docs/adr/0004-sqlite-single-host-authority.md).

| Approved discovery | Specification realization |
| --- | --- |
| Q1–Q2 | Verifier-backed opaque credentials; stable actor/current membership distinction and action-time labels |
| Q3/Q12 | HTTP/JSON /v1 control operations and protected actor-specific curl conventions |
| Q4/Q10/Q13 | Shared durable application boundary, SQLite WAL/FULL/foreign keys, immediate acquisition, bounded contention and conservative error classification |
| Q5/Q6 | One-time bootstrap, owner-held prepared material, verifier-only identity-confirmed registration and candidate-first interruption recovery |
| Q7 | Fixed 30-day expiry, current-time checks, revocation without membership/work changes |
| Q8 | Exact admitted-Manager host-operator credential-only recovery and explicit origin |
| Q9 | Explicit combinations/zero roles, removal/readmission and immutable identity |
| Q11/Q14 | Membership/version and credential/revision preconditions, exact-ID revocation, unchanged no-op attribution and no revival through replay |

### Documentation consulted for routine implementation choices

Context7 resolved official Node.js v24 documentation and queried the SQLite connection/state API and HTTP/test facilities. Node 24 is an LTS line; its built-in SQLite adapter is synchronous and has release-candidate stability. Pinning it and using nonblocking acquisition/backoff avoids a long busy-handler wait on the HTTP event loop; adapter behavior still requires actual tests. [Node release schedule](https://nodejs.org/en/about/previous-releases), [Node v24 SQLite](https://nodejs.org/docs/latest-v24.x/api/sqlite.html), [Node v24 HTTP](https://nodejs.org/docs/latest-v24.x/api/http.html), [Node v24 testing](https://nodejs.org/docs/latest-v24.x/api/test.html). SQLite's transaction/state references and curl's checked documentation remain linked in Technical Discovery. No external documentation creates a new product requirement.

### Risks and readiness

There is no known implementation-blocking contradiction. Important implementation risks are stale authorization after waiting, uncertain commits being mislabeled as refusal, recipient/actor misbinding, private file/log leakage, revision/no-op handling, the host-operator trust boundary and the replaceable built-in SQLite API's release-candidate stability. The scenario matrix supplies concrete verification for these risks; proper SQLite configuration cannot promise recovery from damaged storage or an unavailable host.

Technical Discovery is complete. The Product Owner explicitly approved this authoritative specification on 2026-10-14, including its implementation decisions and HTTP/CLI testing seams. It is sufficiently specified for later ticket decomposition and implementation, but those actions remain unauthorized under the approval-only instruction. Reversible stack/encoding/routes/body guard/testing selections here are approved specification choices, not retroactively recorded as additional approved discovery answers. Specification review included the HTTP/CLI testing seams required by to-spec; the user requested the complete reviewable specification before the approval gate, so no separate preliminary seam interview was conducted. No application tests have been executed, no acceptance case has passed, and no capability has been implemented as part of this action. The ready-for-agent triage value records readiness only; it does not establish execution authorization or acceptance.
