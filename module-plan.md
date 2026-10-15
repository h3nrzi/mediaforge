# MediaForge — V1 Module Plan

**Status: Explicitly approved by the Product Owner on 2026-10-14; authoritative V1 Module Plan.**  
**Prepared:** 2026-10-14.  
**Product contract:** [final-prd.md](./final-prd.md), explicitly approved by the Product Owner on 2026-10-14.  
**Module 01:** Module-scoped Technical Discovery authorized and started on 2026-10-14. Specification, tickets and implementation have not begun.

## 1. Authority and planning scope

This plan decomposes the approved V1 contract into six product-capability modules and a final integration/release acceptance gate. It introduces no new product policy. The full PRD, including its limits register, lifecycle meanings, seven journeys, 44 acceptance cases and Q1–Q55 traceability, governs every module; summaries here never narrow it.

Context read: [AGENTS.md](./AGENTS.md), all three referenced [project instructions](./docs/agents/), [project-charter.md](./project-charter.md), complete [product-discovery.md](./product-discovery.md), [GLOSSARY.md](./GLOSSARY.md), and complete [final-prd.md](./final-prd.md). Earlier documents' pending-PRD/not-started status statements are historical; this session's explicit PRD approval authorizes Module Planning. Their product content remains intact.

Installed skill descriptions were inspected. The [codebase-design skill](./.agents/skills/codebase-design/SKILL.md) supplies cohesion, locality and observable verification principles, applied only at product-capability scale. The domain-modeling instructions were inspected; this plan consumes the glossary without changing the domain model. The installed `grill-with-docs`, `to-spec`, `to-tickets` and `implement` instructions were inspected to preserve the later workflow, but are not invoked in this phase. No whole-product Technical Discovery, architecture, technical specification, ticket, application code or technical mechanism is selected here.

An ownership assignment identifies the module accountable for implementing and maintaining a product contract. It does not prescribe code packages or deployment structure. Other modules supply their own capability facts and use that contract; they do not independently recreate its policy.

## 2. Ordered capability list and dependencies

| Order / ID | Capability                                             | Product result                                                                                                                  | Direct prerequisites         |
| ---------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| MF-MOD-01  | Private workspace and member authority                 | A Manager establishes team access, combines responsibilities and revokes future authority safely                                | None                         |
| MF-MOD-02  | Dependable source intake and submission recovery       | A Contributor admits an immutable validated source, finds/retrieves it, or recovers an honest refusal/indeterminate submission  | 01                           |
| MF-MOD-03  | Verified publication variants and honest processing    | A Contributor requests fixed variants and retrieves real verified outputs with individual outcomes and truthful summaries       | 02                           |
| MF-MOD-04  | Controlled retry, cancellation and Operations recovery | Authorized actors recover eligible failures, request stopping, and investigate unresolved obligations without inventing results | 03                           |
| MF-MOD-05  | Editorial review and preview evidence                  | Reviewers inspect available evidence and record independent usable selections; retrieval survives preview failure               | 03                           |
| MF-MOD-06  | Safe deletion and history-only expiry                  | Managers close access and confirm cleanup; required provenance survives and expires only when eligible                          | 04, 05                       |
| MF-GATE-07 | V1 integration and release acceptance                  | The complete documented product and its real evidence are reviewed against the entire approved contract                         | 06 (and acceptance of 01–05) |

Modules 01–02 are foundational **product capabilities**, demonstrable through actual membership and source workflows. Module 03 is the first complete source-to-derived-deliverable workflow. Modules 04–06 extend it with operational control, editorial use and managed lifecycle completion. No separate technical-layer or generic infrastructure module is proposed.

Recommended execution is 01 → 02 → 03 → 04 → 05 → 06 → gate 07, one approved module at a time. Module 05 depends on 03, not 04; doing 04 first is a risk-based sequence choice so real recovery exists before preview work expands provisional obligations. Module 06 depends on both because deletion must honor retry/cancellation/reconciliation obligations and preview/review races. Transitive dependencies are omitted from the direct-prerequisite column.

## 3. Completion and evidence rules

Each module's later specification must make its own capability independently demonstrable using completed prerequisites. Module completion requires real authorized/denied actions, readable feedback, applicable boundary/failure/concurrency evidence, actual records/media where relevant, and updated documented-client instructions. Do not postpone permissions, accounting, provenance or interruption honesty until the release gate.

Requirements with a shared owner expand to new product subjects as those subjects arrive. For example, 02 establishes recovery and logical-media accounting for uploads; 03 and 04 use that same contract for requests/retries; 05 uses it for previews; 06 supplies deletion evidence. This is staged integration into one owned contract, not multiple implementations or permission to weaken the PRD.

Acceptance cases often span several modules. Local evidence is labelled with the exercised scope and outstanding integrations. A module may complete its capability before a later capability exists, but must not claim a whole acceptance case passed on partial evidence. The acceptance ledger below names one evidence lead and every planned participant; the release gate requires the complete original scenario for every row. Controlled time/fault methods and verification details are chosen later within the relevant module's approved workflow. Never edit outcomes to manufacture evidence.

### MF-MOD-01 — Private workspace and member authority

**Purpose and capabilities:** Establish one private manager-controlled workspace, initial documented Manager access, membership and combinable responsibilities. Enforce shared read authority versus modification permission, current authority at effect time, anonymous/removed-member denial and last-Manager protection. Preserve action-time actor identity through revocation without implicitly cancelling accepted work.

**Dependencies/order:** First; independently demonstrate initial access, admission, assignment, revocation and competing last-Manager changes. Later modules exercise the same authority contract against their real assets/actions.

**Contract ownership:** Own membership, responsibility evaluation, revocation and stable actor identity. Own the documented-client starting point and workflow-documentation convention (`MF-CLIENT-01`); each subsequent module adds its real actor workflows. Request ownership facts belong to 03, action eligibility belongs to the capability admitting the action, and already-authorized transfer/deletion behavior is completed with 06. No Manager privilege inheritance.

**Expected completion evidence:** Actual initial Manager setup and identified actors; alone/combined responsibility assignments; admitted/anonymous/removed-member results; competing changes never leave zero Managers; stable before/after attribution. The 03/04/05/06 action matrix and admitted-work continuity portions remain explicitly scheduled integration evidence.

**Domain 03 challenges:** Attribution and diagnosis within the Charter's D03-C14–C18 challenge group: distinguish the actor responsible for an action from the authority they currently possess. This foundational capability supports later runtime attribution exercises rather than proving runtime mastery itself.

### MF-MOD-02 — Dependable source intake and submission recovery

**Purpose and capabilities:** Upload rights-declared JPEG/PNG still images; validate complete actual contents, supported color interpretation, fields and limits before acceptance; expose immutable distinct identity/facts and unchanged original bytes. Show clear invalid/mislabelled/boundary feedback. Recover lost acknowledgements safely, distinguish deliberate re-upload from same-attempt recovery, and retain unfinished/uncertain cleanup obligations. Provide authorized source retrieval, bounded listings and exact source filters.

**Dependencies/order:** Requires 01. Demonstrable as a complete source-admission/retrieval workflow without processing. Source color eligibility follows the approved PRD; 03 owns the output color/rendering contract, so there is no second conflicting color policy.

**Contract ownership:** Own submission-reference binding, seven-day replay expiry, refused-attempt stability and protected attempt facts for uploads and later requests/retries. Own the common limits/usage contract except request-slot resolution, which belongs to 03: retained logical bytes, temporary/generated-file bounds, record/text protection, no eviction and evidence-based release. Own minimal provenance/dependency protection from the first source and distinguish unaccepted-attempt retention from accepted history. Own listing/continuation semantics, immutable descriptive presentation and feedback categories; later modules supply their applicable fields, filters and reasons. Upload stop/cleanup is part of this workflow; workspace-wide Operations actions arrive in 04 and use its existing facts.

**Expected completion evidence:** Real supported, invalid, mislabeled, corrupt, truncated, animated and ambiguous-color fixtures; rights declaration and immutable byte/fact comparisons; distinct identical re-uploads; all source limits at/over the inclusive boundary; upload concurrency and five-minute reception-plus-validation expiry. Demonstrate same-reference recovery, changed binding/input denial, refused/expired behavior, interruption before/after source admission, uncertainty without free-capacity claims, temporary-to-retained counting exactly once, protected records/text and fixed unaccepted-attempt retention. Exercise source pagination/continuation and current-authority denial. Later output/retry/preview/deletion subjects extend these owned contracts without replacing them.

**Domain 03 challenges:** D03-C03–C04 and C06–C12 group: complete bytes versus partial data, asynchronous reception/validation and interrupted admission. D03-C14–C18 group: retained versus provisional pressure, attribution, cleanup evidence and diagnosis. Numeric media limits are not a general memory or hosting guarantee.

### MF-MOD-03 — Verified publication variants and honest processing

**Purpose and capabilities:** Request one or both fixed Web JPEG v1/Web PNG v1 variants of one shared available source. Reject duplicate/unknown presets and unresolved overlap as a whole request. Bind effective settings, start eligible requests in acceptance order with permitted bypass, and start variants in catalogue order without suppressing eligible siblings. Transform, verify actual retained files, expose six truthful outcomes and available progress, produce accurate mixed summaries, and make each complete available output immediately retrievable with metadata/provenance.

**Dependencies/order:** Requires 02 and its authority, source, reference, quota, feedback and provenance contracts. Independent demonstration uses actual sources and downloaded derived files. Processing is usable without preview or editorial selection; those extend it in 05.

**Contract ownership:** Own immutable preset revisions, rendering/verification rubric, fixed completed output bytes, request ownership by submitter, source/preset overlap, variant outcomes, original clocks, request summaries and request-slot resolution. Own evidence-based lifecycle continuity during downtime and the truthful uncertain-state/check facts. Module 04 adds human control/reconciliation actions against this lifecycle rather than implementing a second one. Module 05 owns ongoing output availability warnings and review evidence; later missing media never changes 03's historical completion. Module 02 remains owner of references/general accounting/provenance; 03 contributes actual request/variant/output facts and consumes those contracts.

**Expected completion evidence:** Actual outputs for both presets and all five exact geometry examples; original-byte preservation, orientation, format, transparency, sRGB/8-bit interpretation and stripped metadata. Applicable PNG samples/alpha are exact, hidden zero-alpha RGB is unconstrained, and applicable JPEG patch interiors meet ±8 per channel. Produce source/reference artifacts and obtain Product Owner review before final rendering acceptance for profiles, higher precision, detail and partial-alpha white compositing. Demonstrate wrong/corrupt deliverables never reported complete, immutable output identities, partial completion/retrieval, counts, overlap refusals, 20/5 request boundaries, order/bypass, independent siblings and generated-file/retention pressure. Show all six meanings with evidence, ten-minute waiting/two-minute processing boundaries including downtime, unavailable-service admission honesty, and preserved identities/clocks without duplicate attempts or unsupported terminal outcomes. Authorized manual actions for these outcomes are added in 04.

**Domain 03 challenges:** D03-C03–C04 and C06–C12 group: derived-byte dataflow, asynchronous transformation/verification and potential native/parallel-work investigation. D03-C14–C18 group: pressure, attributable work, interruption, original deadlines and diagnosis. Technical Discovery may evaluate runtime mechanisms, but this plan mandates none.

### MF-MOD-04 — Controlled retry, cancellation and Operations recovery

**Purpose and capabilities:** Own-request Contributors and Operations users selectively retry only known failed/confirmed cancelled variants from an available original source at the bound revision. Admit each selected set all-or-nothing, enforce the shared original lineage allowance, and preserve parents/successful siblings. Request cancellation of only unresolved variants of the specified request and show intent separately from confirmation. Operations checks uncertain variants and unfinished intake/preview/temporary obligations, with visible evidence gaps and safe provisional cleanup.

**Dependencies/order:** Requires 03's request ownership, ordering, outcomes and evidence facts plus 02's reference/accounting contracts. Intake/variant recovery is demonstrable now; preview-specific Operations integration occurs when 05 introduces preview attempts; accepted-deletion inspection and Manager follow-up integration occurs with 06.

**Contract ownership:** Own retry/cancellation action eligibility, three accepted retries per original variant, immutable lineage and all-or-nothing retry admission. Own the Operations evidence-check/inspection and safe provisional-cleanup authority. Consume the single 03 lifecycle: checks create no new attempt, clock or forced outcome, and stop intent cannot defeat a verified result. Retry actor supplies the acting-member slot attribution; retry request joins 03's normal ordering/admission. Operations must not adopt uploads, resume bytes, regenerate outputs, extend references or delete accepted assets. Manager deletion/follow-up belongs to 06.

**Expected completion evidence:** Real selective retry requests through the fourth total attempt and refused fifth; branch/actor contenders cannot exceed the original allowance; refused sets consume no partial allowance; replay consumes no extra request/slot/clock/attempt. Demonstrate own/other-request permissions using a request submitter different from the uploader; completed siblings and independent descendants survive cancellation. Show repeated/resolved cancellation, completion/timeout races, evidence-only reconciliation to known active/final outcomes, persistent blockers when evidence is missing, expired-reference/removed-member provisional recovery and denials of unsafe Operations actions. Record last checks, occupied allowance and safe next steps.

**Domain 03 challenges:** D03-C06–C12 group: asynchronous completion/stop races and original-work versus new-attempt reasoning. D03-C14–C18 group: pressure that persists under uncertainty, attributable retry activity, shutdown/recovery and evidence-driven diagnosis. No guaranteed reconciliation time or forced resource reclamation.

### MF-MOD-05 — Editorial review and preview evidence

**Purpose and capabilities:** Provide one best-effort bounded PNG preview per verified output, or truthful pending/unavailable feedback with metadata/download fallback. Let Reviewers independently mark/unmark any number of completed variants, initially none, without gating retrieval. Reject stale changes, preserve accepted-action attribution and distinguish historical completion/selection context from current missing/damaged media.

**Dependencies/order:** Directly requires 03; scheduled after 04. Use 02's media/usage/provenance contracts and integrate preview provisional recovery with 04. No retry feature is required to make a valid output reviewable.

**Contract ownership:** Own editorial selection and its observed-state/stale-change rule, preview appearance/status/one-attempt policy, ongoing output availability checks/warnings and no silent restoration. Use the verified fixed bytes from 03 as preview origin. Preview failure never changes output completion or blocks a valid download. Emit preview obligations to the existing accounting/recovery contracts. Selection/deletion interactions are completed with 06, whose deletion authority closes access and removes active usability while preserving former facts.

**Expected completion evidence:** Initially unselected actual outputs, multiple reversible selections, reviewer/denied/revoked actions, stale contenders and accepted repetition without attribution change. Real PNG previews meet 400 × 400 proportional/halves-up geometry, appearance, alpha, metadata and 1 MiB bounds; one attempt, unavailable allowance and thirty-second expiry leave output complete. Show unknown preview cleanup still charged and inspectable through Operations. Missing/damaged files cannot deliver wrong bytes; historical completion/context remains, with only an eligible deliberate new request producing a new output identity. Complete deleted-output and review/deletion races with 06.

**Domain 03 challenges:** D03-C03–C04 and C06–C12 group: secondary derived data and independent asynchronous outcome/availability. D03-C14–C18 group: bounded preview pressure, competing review attribution, cleanup uncertainty and diagnosis. Review suitability remains human judgment, not processing success.

### MF-MOD-06 — Safe deletion and history-only expiry

**Purpose and capabilities:** Managers delete an individual output or a warned source-plus-all-derived-media cascade, subject to unresolved-work blockers. Accepted deletion immediately closes new access/actions, exposes pending cleanup, and becomes confirmed only with removal evidence. Preserve original deletion attribution on follow-up. End provenance dependencies only when media is gone and work resolved, then expire eligible history after ninety elapsed days.

**Dependencies/order:** Requires 04 and 05: real intake/request/retry/reconciliation/preview obligations and selections must already exist so deletion eligibility and races can be verified end to end. It consumes 02's provenance, listing, attempt-retention and evidence-based accounting contracts rather than taking over their implementation.

**Contract ownership:** Own accepted-asset deletion scope, warnings, eligibility, pending/confirmed cleanup and Manager follow-up; own the fixed accepted-record history-only eligibility/expiry transition. Coordinate effect ordering with request/retry admission and editorial changes. Supply closure/removal/former-selection facts to 02/03/05; only proven cleanup supplies a capacity credit. Previously authorized transfers may finish. Operations can inspect pending deletion but cannot exercise Manager cleanup authority. No undo, automatic media expiry or early history purge.

**Expected completion evidence:** Actual individual/cascade targets and warning; retained source/siblings after individual deletion; denied Operations accepted-asset deletion; active/uncertain/preview blockers without implicit cancellation. Demonstrate both winners of admission/retry/review versus deletion, blocked new retrieval versus an earlier authorized transfer, unknown/pending cleanup without released charges, cascade confirmation only after every target is removed, and same-deletion recovery without new attribution. Real bounded history facts protect live sources/outputs/previews/sibling/retry dependencies and removed actors. Controlled time demonstrates before/at/after eligible +90 days; reads/recovery/rejected changes never extend expiry; expired lookup/listing feedback is clear and live media is not expired.

**Domain 03 challenges:** D03-C06–C12 group: asynchronous access closure versus actual cleanup and concurrent action ordering. D03-C14–C18 group: retained pressure, actor attribution, interruption during cleanup and evidence-led diagnosis. Record expiry is separate from byte cleanup and action-reference expiry.

### MF-GATE-07 — V1 integration and release acceptance

**Purpose:** Establish release readiness of the whole bounded product. This is an acceptance gate, not an additional implementation module or a place to defer required behavior.

**Dependencies/order:** All six modules locally accepted, all outstanding cross-module evidence assembled, actual rendering references owner-approved. Integrate and review all seven PRD journeys using actual identified actors and assets.

**Contract ownership:** Own product-wide scope/exclusion conformance, consolidated complete acceptance evidence and educational-coverage reporting. Other modules retain their contract ownership and fix any failed integration evidence. Review the backend/documented-client deliverable without adding a browser application or new guarantees.

**Release criteria and evidence:**

- All 71 requirement owners supply evidence for the full approved behavior, with the PRD's numerical limits, qualifications, failure/recovery semantics and exclusions intact.
- Every MF-AC-01 through MF-AC-44 has its complete real scenario/evidence reviewed, including every participant's integration; unresolved demonstration gaps are explicit and block acceptance. An intentionally demonstrated persistent uncertain product outcome can satisfy its case when required blockers/feedback hold; missing verification evidence cannot.
- The client reproducibly covers all seven journeys, responsibility combinations and denials, source-to-output retrieval/review, retry/cancel/Operations, deletion/history, acknowledgement recovery and exact listings. Reasons and safe next steps remain usable without internal-log interpretation.
- Recheck the PRD section 7 race/invariant matrix across intake, processing, previews, references, authority, accounting, review, deletion and retention. Confirm no duplicate work, cap overspend, invented terminal result, premature release or overwritten fixed bytes.
- Rendering references and final rendering fidelity receive required Product Owner review. Controlled faults/time exercise actual behavior without manual result edits or invented transcripts. No unexecuted test is marked passed.
- Discuss coverage of the Charter's D03-C03–C04, C06–C12 and C14–C18 potential challenges using concrete module evidence. Identify any unexercised learning topics honestly, without prescribing mechanisms or claiming learner mastery or a performance SLA.
- The Product Owner reviews consolidated coverage and explicitly accepts V1. Completing modules or this plan alone does not constitute release acceptance.

## 4. Cross-module contract responsibilities

| Product contract                                                                | Single owner | Consumers / contribution responsibility                                                                                                              |
| ------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current authority, combinations, revocation, stable actor identity              | 01           | 02–06 check authority at each read/action effect; each owns action-specific eligibility                                                              |
| Initial access and reproducible client workflow convention                      | 01           | 02–06 document actual capability workflows as delivered; 07 reviews the complete client                                                              |
| Submission references and attempt protection                                    | 02           | 03/04 bind their original request/retry inputs and return the original admission facts; replay never re-admits                                       |
| General bounds, logical bytes, temporary/retained release and record protection | 02           | 03 supplies output/work facts; 04 supplies safe check evidence; 05 supplies preview facts; 06 supplies confirmed removal/expiry facts                |
| Request-slot accounting, overlap, order, clocks and six outcomes                | 03           | 04's retry/cancel/check actions use that lifecycle; 05/06 use unresolved-work facts without redefining them                                          |
| Minimal provenance and dependency protection                                    | 02           | 01 supplies stable actors; 03/04 supply revisions/lineage/outcomes; 05 supplies latest/former selections; 06 supplies deletion and eligibility facts |
| Ninety-day accepted-record eligibility/expiry                                   | 06           | 02 enforces protected-record counts and listing disappearance from those facts; unaccepted attempts remain under 02's separate obligations           |
| Evidence-check authority and provisional cleanup                                | 04           | 02/03/05 supply inspectable current obligations and evidence; 06 preserves Manager-only accepted-media follow-up                                     |
| Historical verified completion/fixed output bytes                               | 03           | 05 reports present availability separately; 06 closes retrieval on deletion without rewriting completion                                             |
| Preview and editorial selection                                                 | 05           | 03 supplies verified output; 04 checks provisional facts; 06 removes active usability and preserves former-selection context                         |
| Deletion, access closure, pending/confirmed cleanup                             | 06           | 02 credits only proven removal; 03/04/05 refuse actions when deletion wins and expose their blockers when work wins                                  |
| Listings, immutable presentation and feedback semantics                         | 02           | Every later capability contributes applicable exact filters/facts and readable reasons; 01 governs every continuation's authority                    |
| Whole-product evidence, exclusions and educational accounting                   | 07           | 01–06 contribute evidence, never new architecture requirements or unproved success claims                                                            |

These are product responsibilities, not technical interfaces, schemas or synchronization mechanisms. Later module-scoped Technical Discovery determines how each interaction satisfies the approved observable contract.

The full PRD limits register remains normative. In particular, preserve all independently applicable inclusive bounds; upload/request/preview clocks keep their approved origins; downtime does not reset variant clocks. A seven-day expired reference has no mutation authority but may leave protected uncertainty. A ninety-day history timer starts only when every dependency ends. A cleanup deadline, stop intent or absent observation never proves free space. These distinctions apply in every consuming module.

## 5. Coverage ledger

**Planning coverage:** 71/71 requirements have exactly one accountable owner; 44/44 acceptance cases have exactly one evidence lead and named integration participants; 7/7 user journeys are mapped. No unknown identifiers, unowned requirements or unassigned cases. Ownership and planned coverage are not execution results: all product acceptance evidence remains future work, not executed or approved by this document.

Range notation in the per-module index includes every identifier in that range. The detailed requirement table is the definitive single-owner index. Acceptance participants include both owners of the matrix-linked requirements and modules needed by its complete scenario. A case lead coordinates evidence; it does not acquire the participants' implementation responsibilities. Gate 07 reviews every case, even when not listed as a scenario participant.

### MF-MOD-01 — Coverage index

**Included / owned requirements:** MF-SCOPE-02, MF-ACCESS-01, MF-ACCESS-03, MF-ACCESS-04, MF-CLIENT-01.

**Acceptance evidence lead:** MF-AC-02, MF-AC-03, MF-AC-04.

**Relevant acceptance cases (lead or integration participant):** MF-AC-01, MF-AC-02, MF-AC-03, MF-AC-04, MF-AC-29, MF-AC-33, MF-AC-37, MF-AC-38, MF-AC-41, MF-AC-42, MF-AC-44.

### MF-MOD-02 — Coverage index

**Included / owned requirements:** MF-INTAKE-01, MF-INTAKE-02, MF-INTAKE-03, MF-INTAKE-04, MF-INTAKE-05, MF-SUBMIT-01, MF-SUBMIT-02, MF-SUBMIT-03, MF-SUBMIT-04, MF-RESOURCE-01, MF-RESOURCE-02, MF-RESOURCE-04, MF-RESOURCE-05, MF-RESOURCE-06, MF-HISTORY-01, MF-HISTORY-02, MF-HISTORY-04, MF-CLIENT-02, MF-CLIENT-03, MF-CLIENT-04.

**Acceptance evidence lead:** MF-AC-05, MF-AC-06, MF-AC-07, MF-AC-08, MF-AC-09, MF-AC-10, MF-AC-19, MF-AC-21, MF-AC-22, MF-AC-40, MF-AC-41, MF-AC-42.

**Relevant acceptance cases (lead or integration participant):** MF-AC-01, MF-AC-02, MF-AC-03, MF-AC-05, MF-AC-06, MF-AC-07, MF-AC-08, MF-AC-09, MF-AC-10, MF-AC-17, MF-AC-19, MF-AC-20, MF-AC-21, MF-AC-22, MF-AC-24, MF-AC-28, MF-AC-31, MF-AC-32, MF-AC-37, MF-AC-38, MF-AC-39, MF-AC-40, MF-AC-41, MF-AC-42, MF-AC-43, MF-AC-44.

### MF-MOD-03 — Coverage index

**Included / owned requirements:** MF-ACCESS-02, MF-PRESET-01, MF-PRESET-02, MF-PRESET-03, MF-PRESET-04, MF-PRESET-05, MF-PRESET-06, MF-REQUEST-01, MF-REQUEST-02, MF-REQUEST-03, MF-REQUEST-04, MF-REQUEST-05, MF-RESOURCE-03, MF-LIFE-01, MF-LIFE-02, MF-LIFE-03, MF-LIFE-04, MF-LIFE-05, MF-LIFE-06, MF-ACCEPT-01, MF-ACCEPT-02.

**Acceptance evidence lead:** MF-AC-11, MF-AC-12, MF-AC-13, MF-AC-14, MF-AC-15, MF-AC-16, MF-AC-17, MF-AC-18, MF-AC-20, MF-AC-23, MF-AC-24, MF-AC-25, MF-AC-26, MF-AC-32.

**Relevant acceptance cases (lead or integration participant):** MF-AC-02, MF-AC-03, MF-AC-04, MF-AC-06, MF-AC-09, MF-AC-10, MF-AC-11, MF-AC-12, MF-AC-13, MF-AC-14, MF-AC-15, MF-AC-16, MF-AC-17, MF-AC-18, MF-AC-19, MF-AC-20, MF-AC-21, MF-AC-22, MF-AC-23, MF-AC-24, MF-AC-25, MF-AC-26, MF-AC-27, MF-AC-28, MF-AC-29, MF-AC-30, MF-AC-31, MF-AC-32, MF-AC-35, MF-AC-36, MF-AC-37, MF-AC-38, MF-AC-39, MF-AC-41, MF-AC-42, MF-AC-44.

### MF-MOD-04 — Coverage index

**Included / owned requirements:** MF-ACCESS-05, MF-ACCESS-06, MF-RETRY-01, MF-RETRY-02, MF-RETRY-03, MF-CANCEL-01, MF-CANCEL-02, MF-CANCEL-03.

**Acceptance evidence lead:** MF-AC-27, MF-AC-28, MF-AC-29, MF-AC-30, MF-AC-31, MF-AC-43.

**Relevant acceptance cases (lead or integration participant):** MF-AC-03, MF-AC-09, MF-AC-10, MF-AC-21, MF-AC-22, MF-AC-23, MF-AC-24, MF-AC-25, MF-AC-26, MF-AC-27, MF-AC-28, MF-AC-29, MF-AC-30, MF-AC-31, MF-AC-32, MF-AC-34, MF-AC-36, MF-AC-38, MF-AC-39, MF-AC-40, MF-AC-41, MF-AC-42, MF-AC-43, MF-AC-44.

### MF-MOD-05 — Coverage index

**Included / owned requirements:** MF-REVIEW-01, MF-REVIEW-02, MF-REVIEW-03, MF-PREVIEW-01, MF-PREVIEW-02, MF-PREVIEW-03.

**Acceptance evidence lead:** MF-AC-33, MF-AC-34, MF-AC-35.

**Relevant acceptance cases (lead or integration participant):** MF-AC-02, MF-AC-03, MF-AC-17, MF-AC-19, MF-AC-21, MF-AC-25, MF-AC-32, MF-AC-33, MF-AC-34, MF-AC-35, MF-AC-36, MF-AC-37, MF-AC-38, MF-AC-39, MF-AC-41, MF-AC-42, MF-AC-43, MF-AC-44.

### MF-MOD-06 — Coverage index

**Included / owned requirements:** MF-DELETE-01, MF-DELETE-02, MF-DELETE-03, MF-DELETE-04, MF-HISTORY-03.

**Acceptance evidence lead:** MF-AC-36, MF-AC-37, MF-AC-38, MF-AC-39.

**Relevant acceptance cases (lead or integration participant):** MF-AC-02, MF-AC-03, MF-AC-04, MF-AC-19, MF-AC-22, MF-AC-25, MF-AC-27, MF-AC-31, MF-AC-35, MF-AC-36, MF-AC-37, MF-AC-38, MF-AC-39, MF-AC-41, MF-AC-42, MF-AC-43, MF-AC-44.

### MF-GATE-07 — Coverage index

**Included / owned requirements:** MF-SCOPE-01, MF-SCOPE-03, MF-SCOPE-04, MF-ACCEPT-03, MF-ACCEPT-04, MF-EDU-01.

**Acceptance evidence lead:** MF-AC-01, MF-AC-44.

**Relevant acceptance cases (lead or integration participant):** MF-AC-01, MF-AC-44.

### Requirement ownership — 71 requirements

| Requirement    | Approved purpose                                   | Accountable owner |
| -------------- | -------------------------------------------------- | ----------------- |
| MF-SCOPE-01    | Product purpose and success                        | MF-GATE-07        |
| MF-SCOPE-02    | Private workspace and shared visibility            | MF-MOD-01         |
| MF-SCOPE-03    | Backend deliverable and deferred capabilities      | MF-GATE-07        |
| MF-SCOPE-04    | Charter exclusions and guarantee boundaries        | MF-GATE-07        |
| MF-ACCESS-01   | Combinable responsibility permissions              | MF-MOD-01         |
| MF-ACCESS-02   | Request ownership and shared-source processing     | MF-MOD-03         |
| MF-ACCESS-03   | Revocation and work continuity                     | MF-MOD-01         |
| MF-ACCESS-04   | Last Manager and stable attribution                | MF-MOD-01         |
| MF-ACCESS-05   | Variant reconciliation authority                   | MF-MOD-04         |
| MF-ACCESS-06   | Non-variant recovery authority                     | MF-MOD-04         |
| MF-INTAKE-01   | Complete content-based admission                   | MF-MOD-02         |
| MF-INTAKE-02   | Rights declaration                                 | MF-MOD-02         |
| MF-INTAKE-03   | Immutable distinct source and descriptive facts    | MF-MOD-02         |
| MF-INTAKE-04   | Source size and unfinished upload boundaries       | MF-MOD-02         |
| MF-INTAKE-05   | Whole upload deadline and abandoned cleanup        | MF-MOD-02         |
| MF-SUBMIT-01   | Same-attempt identity and unchanged inputs         | MF-MOD-02         |
| MF-SUBMIT-02   | Seven-day reference expiry                         | MF-MOD-02         |
| MF-SUBMIT-03   | Recovery access and indeterminate admission        | MF-MOD-02         |
| MF-SUBMIT-04   | Recovery-record obligations                        | MF-MOD-02         |
| MF-PRESET-01   | Fixed catalogue and effective revisions            | MF-MOD-03         |
| MF-PRESET-02   | Orientation and precise proportional geometry      | MF-MOD-03         |
| MF-PRESET-03   | Format and transparency                            | MF-MOD-03         |
| MF-PRESET-04   | Color interpretation and precision                 | MF-MOD-03         |
| MF-PRESET-05   | Metadata privacy and separate provenance           | MF-MOD-03         |
| MF-PRESET-06   | Actual deliverable verification and fixed bytes    | MF-MOD-03         |
| MF-REQUEST-01  | Source/preset grouping and overlap                 | MF-MOD-03         |
| MF-REQUEST-02  | Individually visible variants and provenance       | MF-MOD-03         |
| MF-REQUEST-03  | Honest derived request summaries                   | MF-MOD-03         |
| MF-REQUEST-04  | Immediate partial deliverables                     | MF-MOD-03         |
| MF-REQUEST-05  | Order, bypass and independent siblings             | MF-MOD-03         |
| MF-RESOURCE-01 | Published inclusive limits and distinct categories | MF-MOD-02         |
| MF-RESOURCE-02 | Retained logical bytes and admission               | MF-MOD-02         |
| MF-RESOURCE-03 | Slots and acting submitter accounting              | MF-MOD-03         |
| MF-RESOURCE-04 | Temporary and generated media pressure             | MF-MOD-02         |
| MF-RESOURCE-05 | Evidence-based release and uncertain usage         | MF-MOD-02         |
| MF-RESOURCE-06 | Record protection and bounded fields               | MF-MOD-02         |
| MF-LIFE-01     | Six truthful variant outcomes                      | MF-MOD-03         |
| MF-LIFE-02     | Progress without false precision                   | MF-MOD-03         |
| MF-LIFE-03     | Per-variant deadlines                              | MF-MOD-03         |
| MF-LIFE-04     | Timeout evidence and late valid results            | MF-MOD-03         |
| MF-LIFE-05     | Uncertainty reconciliation and persistent blockers | MF-MOD-03         |
| MF-LIFE-06     | Service interruption and admission honesty         | MF-MOD-03         |
| MF-RETRY-01    | Manual eligibility and original revision           | MF-MOD-04         |
| MF-RETRY-02    | Immutable lineage and capped accepted attempts     | MF-MOD-04         |
| MF-RETRY-03    | All-or-nothing selective admission                 | MF-MOD-04         |
| MF-CANCEL-01   | Whole specified request and authority              | MF-MOD-04         |
| MF-CANCEL-02   | Intent versus confirmed outcome and race           | MF-MOD-04         |
| MF-CANCEL-03   | Repeated and resolved cancellation                 | MF-MOD-04         |
| MF-REVIEW-01   | Evidence and independent usable selections         | MF-MOD-05         |
| MF-REVIEW-02   | Stale edits, repetition and deletion races         | MF-MOD-05         |
| MF-REVIEW-03   | Availability and non-restoration                   | MF-MOD-05         |
| MF-PREVIEW-01  | Bounded representation                             | MF-MOD-05         |
| MF-PREVIEW-02  | One best-effort attempt and independent status     | MF-MOD-05         |
| MF-PREVIEW-03  | Generation deadline and cleanup evidence           | MF-MOD-05         |
| MF-DELETE-01   | Deletion scope, warning and unsafe-work blockers   | MF-MOD-06         |
| MF-DELETE-02   | Admission and review race ordering                 | MF-MOD-06         |
| MF-DELETE-03   | Access closure versus confirmed cleanup            | MF-MOD-06         |
| MF-DELETE-04   | Idempotent follow-up and no undo                   | MF-MOD-06         |
| MF-HISTORY-01  | Minimum product facts                              | MF-MOD-02         |
| MF-HISTORY-02  | Dependency-pinned provenance                       | MF-MOD-02         |
| MF-HISTORY-03  | Fixed ninety-day history-only expiry               | MF-MOD-06         |
| MF-HISTORY-04  | Unaccepted attempt retention distinction           | MF-MOD-02         |
| MF-CLIENT-01   | Reproducible actor workflows                       | MF-MOD-01         |
| MF-CLIENT-02   | Bounded stable listings and filters                | MF-MOD-02         |
| MF-CLIENT-03   | Accurate reason categories and safe next steps     | MF-MOD-02         |
| MF-CLIENT-04   | Immutable descriptive experience                   | MF-MOD-02         |
| MF-ACCEPT-01   | Structural rendering and precision rubric          | MF-MOD-03         |
| MF-ACCEPT-02   | Owner-reviewed visual references                   | MF-MOD-03         |
| MF-ACCEPT-03   | Complete product evidence matrix                   | MF-GATE-07        |
| MF-ACCEPT-04   | Future evidence and controlled scenarios           | MF-GATE-07        |
| MF-EDU-01      | Domain 03 learning direction                       | MF-GATE-07        |

### Acceptance coordination — 44 cases

Numbers in participant columns refer to the ordered module/gate IDs above. Every complete case is required at gate 07.

| Acceptance case                                             | Evidence lead | Other integration participants |
| ----------------------------------------------------------- | ------------- | ------------------------------ |
| MF-AC-01 — Release scope and workflow entry                 | 07            | 01, 02                         |
| MF-AC-02 — Private shared access                            | 01            | 02, 03, 05, 06                 |
| MF-AC-03 — Responsibility combinations                      | 01            | 02, 03, 04, 05, 06             |
| MF-AC-04 — Revocation and last Manager                      | 01            | 03, 06                         |
| MF-AC-05 — Valid source, declaration and original bytes     | 02            | None                           |
| MF-AC-06 — Invalid and misleading inputs                    | 02            | 03                             |
| MF-AC-07 — Inclusive source boundaries                      | 02            | None                           |
| MF-AC-08 — Upload concurrency and expiry                    | 02            | None                           |
| MF-AC-09 — Same-attempt replay and acknowledgement loss     | 02            | 03, 04                         |
| MF-AC-10 — Changed, refused and expired references          | 02            | 03, 04                         |
| MF-AC-11 — One-source distinct presets and overlap          | 03            | None                           |
| MF-AC-12 — Fixed immutable presets                          | 03            | None                           |
| MF-AC-13 — Geometry and orientation                         | 03            | None                           |
| MF-AC-14 — Format, alpha and PNG fidelity                   | 03            | None                           |
| MF-AC-15 — JPEG interior tolerance                          | 03            | None                           |
| MF-AC-16 — Profiles, precision and visual detail            | 03            | None                           |
| MF-AC-17 — Metadata and source preservation                 | 03            | 02, 05                         |
| MF-AC-18 — Verify before completion and immutable output    | 03            | None                           |
| MF-AC-19 — Retained allowance and contenders                | 02            | 03, 05, 06                     |
| MF-AC-20 — Workload/member slots                            | 03            | 02                             |
| MF-AC-21 — Temporary and generated-file limits              | 02            | 03, 04, 05                     |
| MF-AC-22 — Record caps and fields                           | 02            | 03, 04, 06                     |
| MF-AC-23 — Order and bypass                                 | 03            | 04                             |
| MF-AC-24 — Six outcomes and honest progress                 | 03            | 02, 04                         |
| MF-AC-25 — Partial success and summaries                    | 03            | 04, 05, 06                     |
| MF-AC-26 — Waiting/processing deadlines and downtime        | 03            | 04                             |
| MF-AC-27 — Selective retry eligibility and lineage          | 04            | 03, 06                         |
| MF-AC-28 — Atomic retry and repeated recovery               | 04            | 02, 03                         |
| MF-AC-29 — Cancellation scope and repeated action           | 04            | 01, 03                         |
| MF-AC-30 — Cancellation/completion/deadline race            | 04            | 03                             |
| MF-AC-31 — Reconciliation and persistent uncertainty        | 04            | 02, 03, 06                     |
| MF-AC-32 — Interruption continuity                          | 03            | 02, 04, 05                     |
| MF-AC-33 — Review selection and stale changes               | 05            | 01                             |
| MF-AC-34 — Preview rendition and bounded attempt            | 05            | 04                             |
| MF-AC-35 — Missing/damaged output and no silent restoration | 05            | 03, 06                         |
| MF-AC-36 — Deletion scope, authority and admission race     | 06            | 03, 04, 05                     |
| MF-AC-37 — Deletion pending, downloads and capacity         | 06            | 01, 02, 03, 05                 |
| MF-AC-38 — Provenance facts and live protection             | 06            | 01, 02, 03, 04, 05             |
| MF-AC-39 — Ninety-day eligibility and expiry                | 06            | 02, 03, 04, 05                 |
| MF-AC-40 — Attempt retention versus accepted history        | 02            | 04                             |
| MF-AC-41 — Listing continuation and exact filters           | 02            | 01, 03, 04, 05, 06             |
| MF-AC-42 — Actionable feedback                              | 02            | 01, 03, 04, 05, 06             |
| MF-AC-43 — Non-variant Operations and Manager follow-up     | 04            | 02, 05, 06                     |
| MF-AC-44 — Evidence review and educational boundary         | 07            | 01, 02, 03, 04, 05, 06         |

### Journey coverage — seven workflows

| Journey                                        | Owning capabilities and integration                                                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| MF-J-01 — Establish/manage access              | 01 owns authority; 02–06 exercise it with their real actions and records                                                         |
| MF-J-02 — Submit a source                      | 02 owns intake/recovery/accounting; 01 provides current authority; 04 adds Operations inquiry                                    |
| MF-J-03 — Request variants                     | 03 owns processing/verification; 02 provides shared source/recovery/resource contracts                                           |
| MF-J-04 — Review/retrieve                      | 03 first delivers verified downloads; 05 adds preview/selection/availability; 06 adds deletion interactions                      |
| MF-J-05 — Recover or stop work                 | 04 owns manual controls and Operations actions; 02/03/05 provide original facts/obligations; 06 governs accepted-media follow-up |
| MF-J-06 — Delete and retain history            | 06 owns deletion/expiry; 02 owns minimal protected provenance/accounting; 03–05 provide blockers and context                     |
| MF-J-07 — Recover acknowledgement/find results | 02 owns references/listing; 03/04 integrate new-request/retry facts; 01 enforces current access                                  |

All seven journeys receive complete end-to-end acceptance at gate 07.

## 6. Planning risks and unresolved contradictions

**Genuine unresolved product contradictions identified: None.** The apparent conflicts between intent/outcome, historical completion/availability, access closure/cleanup, reference expiry/protected evidence and media/history lifetime are already resolved by the approved PRD. Historical status text does not reopen discovery.

| Planning risk                                                       | Consequence                                                              | Planned treatment                                                                                                                                            |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Modules 02 and 03 contain substantial cross-cutting behavior        | Happy-path delivery could leave admission/recovery invariants unfinished | Keep their cohesive product workflows; later module-scoped tickets may subdivide work without creating technical-layer modules or dropping required behavior |
| Partial module evidence mistaken for a whole case pass              | Later subjects/races escape verification                                 | Record exercised scope and remaining participants explicitly; every full case is reviewed at gate 07                                                         |
| Shared policies drift between capabilities                          | Different quota, authority, expiry or outcome meanings                   | Single-owner ledger; integrate facts through existing contracts; cross-module fixes stay with the responsible owner                                          |
| Rendering references are not yet produced/approved                  | Final fidelity cannot be accepted                                        | Schedule artifact production and owner review within 03's later authorized work; reuse references for 05; block final rendering acceptance until approved    |
| Uncertainty can indefinitely occupy capacity                        | Recovery may establish no safe release                                   | Demonstrate the approved persistent-blocker behavior and permitted checks; no forced outcome, SLA or automatic rerun                                         |
| Preview work adds provisional obligations after Operations delivery | Incomplete visibility or unsafe deletion                                 | 05 must integrate its facts into 04's checks; 06 cannot complete without preview blocker/cleanup/race evidence                                               |
| Deleting media does not immediately free record allowance           | Confusing capacity feedback or premature provenance erasure              | 02 owns separate protected counts; 06 supplies actual eligibility/expiry; demonstrate caps and history timing together                                       |
| Educational goals become mechanism mandates                         | Product planning prematurely locks runtime design                        | Carry challenge groups and concrete learning questions forward; defer mechanisms to module-scoped discovery and report actual learner evidence honestly      |

These are sequencing and verification risks, not unanswered product policies. Any genuine contradiction discovered later must be identified against the exact PRD requirement and brought to the Product Owner rather than silently resolved through an implementation choice.

## 7. Readiness and approval gate

**Product readiness for Module 01:** Sufficient. Its purpose, authority rules, prerequisites, shared responsibilities and expected local evidence are defined. No upstream capability or unresolved product decision prevents module-scoped Technical Discovery after approval. Initial Manager/access setup and verification mechanisms are questions for that future discovery, not decisions made here. Rendering-reference approval belongs to later work and does not block Module 01.

**Authorization readiness:** Explicit Product Owner approval of this `module-plan.md` recorded on 2026-10-14. The approved scope includes all six capability modules, their ownership boundaries, dependencies, requirement coverage, acceptance responsibilities and final integration gate. The Product Owner separately authorized starting MF-MOD-01 Technical Discovery — Round 1. Plan approval authorizes entering the agreed module workflow; it does not approve an architecture, specification, ticket breakdown, executed acceptance result or V1 release.

After approval, proceed one module at a time through **module-scoped Technical Discovery using `grill-with-docs` → `to-spec` → `to-tickets` → `implement` → verification and acceptance**, honoring the relevant later review gates. Issue/spec artifacts then follow the local `.scratch/` conventions; none are generated during this planning session. Only after the six capabilities and gate 07 satisfy their acceptance obligations may V1 be presented for final product acceptance.

**Product Owner plan approval: Explicitly approved on 2026-10-14.** The Product Owner stated: “I explicitly approve `module-plan.md` as the authoritative V1 Module Plan, including all six capability modules, their ownership boundaries, dependencies, requirement coverage, acceptance responsibilities, and final integration gate.” Module 01 Technical Discovery may proceed within the separately authorized scope; proposed technical decisions require explicit approval before being recorded as approved.
