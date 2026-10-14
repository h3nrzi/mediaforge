# MediaForge — Final V1 Product Requirements Document

**Document status:** Codex-authored Final PRD; awaiting explicit Product Owner approval.  
**Version:** V1 consolidation, 2026-10-14.  
**Product Discovery:** Q1–Q55 complete and formally approved; consolidated shared understanding explicitly signed off.  
**Module Plan:** Not authorized until this PRD is explicitly approved.  
**Implementation and verification:** Not started or represented as complete by this document.

## 1. Authority, reading rules, and identifiers

Authoritative inputs are the [approved Project Charter](./project-charter.md) and the complete approved decisions, qualifications and owner sign-off in [product-discovery.md](./product-discovery.md). [GLOSSARY.md](./GLOSSARY.md) supplies established product vocabulary. The imported Charter's original “not started” status is historical source text; discovery's recorded approvals establish the current workflow status.

The owner explicitly authorized this consolidation after stating: “Product Discovery Q1–Q55 is complete and formally approved.” This PRD organizes those decisions without introducing product policy or architecture. Earlier discovery statements that a detail awaited later rounds are resolved by the applicable subsequently approved decisions; original discovery records remain unchanged as history.

Requirement IDs `MF-<AREA>-NN` are stable and must not be reassigned or renumbered for later edits. “Shall” expresses a required V1 behavior. An exclusion or guarantee boundary is equally part of the product contract. Journey IDs `MF-J-NN` organize workflows; acceptance IDs `MF-AC-NN` identify required future evidence. They are not tickets, executable tests, or claims of passed verification. Each requirement lists its approved discovery sources; section 11 supplies reverse traceability for every Q1–Q55 decision.

## 2. Product outcome and scope

Creative/editorial teams need several publication-ready variants of source media while understanding partial failures, delays and uncertain outcomes. MediaForge creates derived assets with honest results and provenance, lets the team identify usable variants, and permits retrieval of verified complete files. This is a bounded content-processing desk with one private workspace.

The complete in-scope, exclusion and guarantee requirements follow. Product facts and flows are defined here; protocols, authentication mechanisms, frameworks, processing libraries, storage, process/concurrency models, deployment and architectural patterns remain outside this document.

#### MF-SCOPE-01 — Product purpose and success

MediaForge V1 shall serve a small creative/editorial team preparing owned or permissioned media for publication. It shall create new derived assets, expose honest per-request and per-variant outcomes, preserve source/preset provenance, and let authorized users retrieve verified complete deliverables. One person may perform multiple product responsibilities. Success is observable through real expected outputs and readable results, including negative/failure cases.

**Discovery:** Q1, Q5, Q6, Q21, Q35, Q39.

#### MF-SCOPE-02 — Private workspace and shared visibility

V1 shall provide one private, manager-controlled workspace, without public signup, anonymous asset access, per-asset private collections, or public sharing. All admitted members may list/inspect shared sources, requests, outcomes, completed outputs, and permitted unexpired history, and retrieve assets within that access boundary. Visibility shall not confer modification authority. Every listing, continuation, retrieval, and action shall obey current membership/permissions.

**Discovery:** Q3, Q8, Q9, Q50.

#### MF-SCOPE-03 — Backend deliverable and deferred capabilities

V1 shall deliver a backend service with a documented client demonstrating complete contributor/reviewer/operations/manager workflows. A custom browser application is deferred. Supported intake is user-supplied JPEG/PNG still-image files only; audio, video, animation, vectors, remote URL fetching and third-party imports are deferred. V1 excludes custom preset parameters/editing/revision publishing, partial-byte upload resumption, automatic output restoration/regeneration, preview retries/custom sizes, fuzzy search, embedded-metadata indexing, bulk export, compound reporting, and source replacement/rename/custom titles/tags/descriptions/annotations.

**Discovery:** Q2, Q4, Q10, Q21, Q26, Q37, Q42, Q46, Q50, Q51.

#### MF-SCOPE-04 — Charter exclusions and guarantee boundaries

The Charter's exclusions remain binding: no arbitrary executable scripts/plugins/untrusted code, unlimited public compute farm, enterprise scheduler/infrastructure console, full editing suite or DAM marketplace. Recurring batches, third-party publishing/CMS integrations, custom pipelines/compound cross-media workflows, professional approval chains, long-term archive/legal retention, and large-scale distributed processing are deferred. No automated rights enforcement, guaranteed instant cancellation/cleanup, reversal of delivered files/external effects, permanent archival guarantee, or invented latency/throughput/success-rate SLA is promised. Numeric limits are admission/resource/product boundaries, not measured hosting, Node.js performance, or safety guarantees. No technical mechanisms are selected by this PRD.

**Discovery:** Q7, Q14, Q16, Q17, Q25, Q29, Q31, Q34, Q38, Q41, Q52.

## 3. Actors, access, and ownership

#### MF-ACCESS-01 — Combinable responsibility permissions

The product shall enforce the responsibility matrix below. Responsibilities may be combined; combined assignments provide their permitted actions. Manager alone shall not imply Contributor, Reviewer, or Operations authority. Operations' safe provisional cleanup shall not become deletion of accepted assets or general management authority. Action eligibility remains governed by the relevant lifecycle, quota, source and outcome rules.

**Discovery:** Q9, Q22, Q54, Q55.

#### MF-ACCESS-02 — Request ownership and shared-source processing

Any Contributor may request processing of any accepted shared source, subject to normal admission. The uploader is not an asset-specific permission owner. Own-request retry/cancellation authority follows that request's submitting actor. The original contributor in a retry lineage is the original request submitter, who may differ from the uploader. Each retry records its acting submitter and original contributor. No second rights declaration is required merely to process an accepted source; preserve the original submission declaration.

**Discovery:** Q9, Q12, Q14, Q32, Q54.

#### MF-ACCESS-03 — Revocation and work continuity

Permissions shall be checked when an action takes effect, not only when it was viewed or initiated. Removing membership or a responsibility revokes future authority without automatically cancelling admitted work, changing its attribution, or releasing its unresolved-work accounting. Operations may address that work. A Manager wishing to cancel must separately hold the applicable Operations responsibility and request cancellation. Already downloaded files cannot be erased; previously authorized in-flight downloads may finish under the deletion policy.

**Discovery:** Q9, Q17, Q22, Q41, Q47.

#### MF-ACCESS-04 — Last Manager and stable attribution

Prevent removal or demotion of the last admitted Manager, including competing changes that could leave no Manager. Retain stable historical actor identity and recorded action-time attribution while dependent records remain. Membership changes shall not rewrite source/request/review/deletion attribution or restore a removed member's access.

**Discovery:** Q22, Q38, Q48, Q51.

#### MF-ACCESS-05 — Variant reconciliation authority

Operations shall be able to request evidence-based checks of uncertain variant outcomes and inspect the last check and missing evidence/intervention. This authority shall not force complete, failed, cancelled, or abandoned-as-resolved outcomes, guarantee reconciliation time, or create a retry/processing attempt.

**Discovery:** Q9, Q34, Q40.

#### MF-ACCESS-06 — Non-variant recovery authority

Operations shall inspect unfinished/indeterminate intake, preview attempts and temporary-cleanup blockers workspace-wide, showing actor, linked source/request/output where one exists, current facts, last check, occupied allowance, and safe next action. Operations may request evidence checks and safe cleanup of media known not to be an accepted source or retained deliverable. It shall not adopt another actor's upload, replay it as a new action, resume partial bytes, delete accepted assets, force outcomes, or regenerate completed outputs. Pending deletion is inspectable; Manager authority governs deletion admission/follow-up. Checks update bounded existing facts without creating requests, consuming retries, extending references, or adding an unrestricted operator-log archive. Unproven cleanup remains a visible blocker.

**Discovery:** Q9, Q13, Q22, Q23, Q29, Q34, Q37, Q38, Q40, Q41, Q55.

### Responsibility matrix

Baseline inspection/retrieval belongs to every admitted member; other actions require the listed responsibility and action-specific eligibility. An action's historical attribution never grants future authority.

| Action | Required responsibility | Scope |
| --- | --- | --- |
| Inspect/retrieve accepted shared assets, requests, outcomes and permitted history | Any admitted member | Current permitted workspace access |
| Submit source and new processing request | Contributor | Any accepted shared source for processing; rights declaration on upload |
| Retry/request cancellation | Contributor | Own eligible requests, ownership by request submitter |
| Mark/unmark usable output | Reviewer | Eligible completed variants; stale-change checks |
| Retry/request cancellation | Operations | Any eligible request |
| Variant/intake/preview/temp checks and safe provisional cleanup | Operations | Evidence-based, bounded authority in MF-ACCESS-05/06 |
| Admit/remove members; assign/remove responsibilities | Manager | Preserve at least one admitted Manager |
| Delete accepted source/output and follow up accepted deletion | Manager | Eligibility, cascade warning and confirmed-cleanup rules |

## 4. Functional requirements

### 4.1 Source intake

#### MF-INTAKE-01 — Complete content-based admission

A source shall become accepted and processable only after complete-content validation, rights declaration, field validation, and applicable admission limits pass. Determine actual JPEG/PNG still-image format from contents; filename and declared type are advisory, so a valid supported file is not rejected solely for a misleading label. Reject corrupt, truncated, animated/multiple-frame, unsupported, over-limit, or unsupported/ambiguous-color input with a readable reason. Rejected/interrupted submissions create no accepted source and cannot create processing requests. Acceptance requires sufficient retained allowance for the entire validated source.

**Discovery:** Q2, Q4, Q13, Q15, Q25, Q28, Q40.

#### MF-INTAKE-02 — Rights declaration

Each source submission shall require affirmation that the Contributor owns or has permission to process/use the image. Record the declaration with submitting actor and submission time. It is a submission fact, not verified legal ownership, license management, automated copyright checking, or later automatic rights enforcement.

**Discovery:** Q1, Q14, Q38, Q51, Q54.

#### MF-INTAKE-03 — Immutable distinct source and descriptive facts

Every accepted upload shall have a distinct immutable source identity, including intentional identical-byte re-uploads. Matching filenames shall not replace prior sources; changing content requires a new upload. The original filename is descriptive, not identity. Preserve original source bytes and submission facts. Expose identity, filename, accepted format/dimensions/bytes, submitter/time, declaration fact, request links and bound output/review facts; no user metadata-editing workflow is included. This governs visible identity, not physical byte-sharing implementation.

**Discovery:** Q12, Q23, Q38, Q44, Q51.

#### MF-INTAKE-04 — Source size and unfinished upload boundaries

Apply every source, unfinished-upload, and supplied-text bound in the limits register. File size, pixel area, and both dimensions must each satisfy their inclusive limit. Refuse a new upload if its member/workspace unfinished-upload allowance or affected temporary allowance is unavailable. Do not silently exceed a bound or evict existing sources to admit it.

**Discovery:** Q15, Q29, Q44.

#### MF-INTAKE-05 — Whole upload deadline and abandoned cleanup

The whole-submission deadline is five minutes from upload admission, including reception and validation; it expires at elapsed time greater than or equal to five minutes. Known disconnected, abandoned, invalid or expired unfinished submissions must not become accepted sources. Request provisional work stop and remove temporary media, but release its upload/temporary obligations only when cleanup is confirmed. If acceptance preceded a lost acknowledgement, preserve/recover that accepted source. No partial-offset resumption is supported. An explicit new attempt follows known unsuccessful outcome and release of conflicting allowance.

**Discovery:** Q13, Q23, Q29, Q40, Q41, Q42.

### 4.2 Submission intent and same-attempt recovery

#### MF-SUBMIT-01 — Same-attempt identity and unchanged inputs

Upload and processing-request submissions, including admitted retries, shall support a documented same-attempt submission reference. Bind the reference to one actor/action kind and original upload contents or request parameters on first use. Changed inputs under that reference are rejected. Repetition returns the same accepted, refused, in-progress or indeterminate attempt without duplicate accepted records, admission slots, clocks, retry consumption, or another effect. Intentional new work requires a new reference and gets new identities where admitted.

**Discovery:** Q23, Q32, Q41, Q43.

#### MF-SUBMIT-02 — Seven-day reference expiry

Advertise reference issuance and valid-until time seven days later. Within that window, a refused attempt remains refused even if conditions improve; use a new reference for safe deliberate new work. At or after expiry, refuse action/replay as expired, never reinterpret the old reference as new. Expiry neither deletes accepted records nor resolves uncertainty. Accepted records remain discoverable through normal authorized listings while retained. Keep minimal unresolved acceptance/cleanup evidence after expiry without extending action authority.

**Discovery:** Q23, Q38, Q43, Q44.

#### MF-SUBMIT-03 — Recovery access and indeterminate admission

Recovery shall obey current read authority; new effects require current action authority. A lost acknowledgement does not prove refusal or authorize blind resubmission. State whether the action was accepted, refused without a new accepted record, or cannot yet be established. Preserve admitted identity/outcome and use same-attempt recovery, or evidence-based Operations inquiry when needed, instead of an unauthorized duplicate.

**Discovery:** Q9, Q22, Q23, Q40, Q41, Q43.

#### MF-SUBMIT-04 — Recovery-record obligations

Rejected submissions create no source/request record, but their required attempt records count toward the attempt-record cap while retained. For an unaccepted attempt, preserve bounded facts while its advertised recovery window or unresolved cleanup requires them; remove them once both obligations end. Do not assign accepted-source 90-day history solely to such an attempt. Protected unexpired or unresolved evidence cannot be evicted to admit another submission.

**Discovery:** Q23, Q38, Q43, Q44, Q55.

### 4.3 Published transformations and verified deliverables

#### MF-PRESET-01 — Fixed catalogue and effective revisions

Publish exactly Web JPEG v1 and Web PNG v1. A request may choose one or both without parameter overrides. Bind each variant to an immutable revision at acceptance and retain effective dimension, orientation, format, quality, transparency, metadata and color policies. Historical meaning must not depend on a later mutable preset name. Manager editing/revision publishing is not a V1 capability. Changes require subsequent owner-approved scope and cannot silently alter accepted work or outputs.

**Discovery:** Q5, Q10, Q26.

#### MF-PRESET-02 — Orientation and precise proportional geometry

Normalize visible orientation before sizing the entire image. With oriented width W and height H, use s = min(1, 1600/W, 1600/H). Round each scaled dimension to the nearest whole pixel, exact halves upward, with minimum one. Both output dimensions stay within 1600; sources already within bounds retain oriented dimensions. No enlargement, crop, stretch or added border. Aspect-ratio differences are limited to unavoidable whole-pixel rounding.

**Discovery:** Q10, Q24, Q45.

#### MF-PRESET-03 — Format and transparency

Web JPEG shall produce JPEG at published quality setting 85/100, flattening transparency onto white. Web PNG shall produce PNG and preserve transparency when present. Quality 85 is a preset setting, not equal perceived quality for all source material. Suitability for publication remains editorial judgment.

**Discovery:** Q10, Q25, Q45.

#### MF-PRESET-04 — Color interpretation and precision

Honor valid source color information and normalize supported interpretations to sRGB with 8-bit output channels and necessary rendering information. Interpret untagged RGB/grayscale as sRGB. Reduce supported higher precision without promising archival precision or pixel-identical conversion. Reject ambiguous/unconvertible interpretation, including unprofiled CMYK, rather than guessing. Supported profiled RGB, valid profiled CMYK, and higher-precision PNG cases must meet the approved reference-based rubric. No conversion, resampling or encoder mechanism is selected.

**Discovery:** Q25, Q45.

#### MF-PRESET-05 — Metadata privacy and separate provenance

Derived outputs shall omit nonessential camera/location, author, descriptive and other source metadata, retaining only information needed for correct decoding and agreed visual fidelity. Original sources remain unchanged. Workspace source/request/preset provenance is available separately. This is not detection/removal of sensitive information visible inside image content.

**Discovery:** Q11, Q19, Q25, Q26, Q38, Q45.

#### MF-PRESET-06 — Actual deliverable verification and fixed bytes

Report verified complete only after the actual retained file is entirely decodable, has correct format/exact dimensions, satisfies approved transparency/metadata/rendering checks and correct provenance, and is available for authorized retrieval. A processor's success report is insufficient. A known verification failure is failed and not a completed downloadable deliverable; an indeterminate result is uncertain. Completed output identity binds fixed bytes. Reruns receive new output identities; separate lossy conversions need not be byte-identical. Later availability/deletion does not rewrite historical completion.

**Discovery:** Q18, Q27, Q35, Q37, Q45.

### 4.4 Requests, summaries, and ordering

#### MF-REQUEST-01 — Source/preset grouping and overlap

Each separately identified request shall target exactly one available accepted shared source and one or both distinct published presets. Reject unknown/duplicate presets as a whole-request refusal. If any selected source/preset already has unresolved work, refuse the whole new request and identify existing work within permitted access. Deliberate new requests for resolved source/preset work are permitted with new identities, subject to admission.

**Discovery:** Q5, Q10, Q12, Q23, Q54.

#### MF-REQUEST-02 — Individually visible variants and provenance

Every requested variant shall have an individually visible outcome tied to its source, request and bound preset revision. Expose source, selected presets, actual status, trustworthy available progress, result metadata and provenance. Preserve distinct source/request/output identities and relevant actors/timestamps.

**Discovery:** Q5, Q18, Q19, Q26, Q35, Q38.

#### MF-REQUEST-03 — Honest derived request summaries

Summaries shall show requested presets, counts for all six variant outcomes and currently retrievable outputs. A request is resolved only when every variant has a known final outcome: verified complete, failed or cancelled. Show mixed final results explicitly, without replacing them with a misleading binary flag. Uncertain or unfinished work remains unresolved. Claim all outputs delivered only when every requested variant reached verified complete, separately flagging later deletion/unavailability so historical completion does not imply present retrieval. Linked retries have separate summaries and do not rewrite parents.

**Discovery:** Q5, Q6, Q18, Q20, Q35.

#### MF-REQUEST-04 — Immediate partial deliverables

Each verified complete available output shall be immediately retrievable and reviewable by authorized users even while sibling variants are unfinished or uncertain. Editorial selection does not gate retrieval. Failed/incomplete media shall not be falsely presented as delivered.

**Discovery:** Q6, Q19, Q35, Q37.

#### MF-REQUEST-05 — Order, bypass and independent siblings

Eligible requests shall start in acceptance order. Currently ineligible work may be bypassed by eligible work; newer requests do not displace existing processing. Retries receive new admission positions at the end. Selected variants start in catalogue order, Web JPEG then Web PNG; JPEG failure alone does not suppress eligible PNG, and starting a sibling need not await prior success. Per-member admission limits provide the initial fairness boundary. This governs observable ordering without choosing serial/parallel execution.

**Discovery:** Q17, Q30, Q49.

### 4.5 Admission, resource obligations, and bounds

#### MF-RESOURCE-01 — Published inclusive limits and distinct categories

Enforce and publish the limits register, distinguishing retained media, temporary media, request slots, unfinished uploads, records and text. Refuse creation that would exceed an applicable inclusive bound, and show usage/available allowance and actionable reason. Existing inspection, cancellation, reconciliation, eligible deletion and permitted review remain available despite creation limits. No automatic eviction of media, protected provenance or protected recovery records is allowed.

**Discovery:** Q15, Q16, Q17, Q28, Q29, Q44, Q50, Q53.

#### MF-RESOURCE-02 — Retained logical bytes and admission

Count each retained source, output and preview by actual byte length, including separately visible identical-byte files. Non-media history is outside the 1 GiB allowance. Validated source acceptance requires room for its complete file. Processing admission requires all checks and a workspace not already full. Where required media is known not to fit, refuse admission with capacity feedback; do not reserve/promise unknown future output sizes. Immediately before retaining a media file, its addition must keep the total at or below 1 GiB. Concurrent contenders cannot overspend it; one that no longer fits gets capacity feedback. Provisional work is not reported as retained media. Preserve existing media if a deliverable cannot be retained.

**Discovery:** Q16, Q28, Q29, Q53.

#### MF-RESOURCE-03 — Slots and acting submitter accounting

Count one outstanding request regardless of preset count, against workspace and acting submitter limits. It stays occupied until all variants have known final outcomes. Uncertainty continues to count. Member removal, reference expiry, stop intent and cancellation of another parent/descendant do not release still-unresolved work. Retry admissions use the retry actor's member allowance and workspace allowance, with original contributor/actor attribution retained. Refuse excess requests clearly rather than silently deferring their submission.

**Discovery:** Q17, Q22, Q32, Q35, Q53.

#### MF-RESOURCE-04 — Temporary and generated media pressure

Temporary media comprises unaccepted uploads, intermediate media and not-yet-retained outputs/previews. Apply per-operation/workspace temporary and generated-file bounds. Refuse new uploads when allowance is unavailable; admitted processing may wait within its original waiting deadline. Known output/temporary-limit violations cause actionable failure while preserving existing assets; indeterminate results remain uncertain. Preview size/capacity/resource failure leaves a valid output complete with preview unavailable. No particular storage type, process count or general machine-memory budget is implied.

**Discovery:** Q29, Q31, Q46, Q53.

#### MF-RESOURCE-05 — Evidence-based release and uncertain usage

Release slots and temporary/retained allowance only when obligations are known to have ended. Unknown cleanup does not imply zero bytes or free allowance. Show known usage separately from uncertainty, retain affected charges, and refuse affected new media admission when compliance cannot be established. Recovery actions remain available. Moving one logical file from temporary to retained accounting counts it exactly once, not twice or neither; distinct retained copies still count separately. Removal is credited only after confirmation.

**Discovery:** Q28, Q29, Q34, Q42, Q47, Q53, Q55.

#### MF-RESOURCE-06 — Record protection and bounded fields

Source/request caps include live, unresolved and retained history-only records; variants are bounded by the two distinct presets. Attempt caps include records still protected by the recovery window or unresolved evidence, even after reference expiry. Refuse new creation beyond a cap without evicting protected records. Publish counts and explain why deleting media does not necessarily free a record slot before history expires. Reject overlong supplied filenames/references/labels before admission; keep reason summaries and facts bounded without unrestricted notes/logs. These are product limits, not a storage schema or machine-size guarantee.

**Discovery:** Q23, Q28, Q38, Q43, Q44, Q48, Q51.

### 4.6 Outcomes, deadlines, and interruptions

#### MF-LIFE-01 — Six truthful variant outcomes

Each variant shall distinguish the six outcomes in the lifecycle table. Final outcomes require their defined evidence; waiting/processing may reach a final outcome only when its meaning holds. Loss of result knowledge may yield uncertain. Evidence may restore uncertain work to known waiting/processing or a known final outcome. Known final attempt outcomes are not rewritten by reruns. Historical completion and current media availability are separate facts.

**Discovery:** Q18, Q27, Q34, Q41.

#### MF-LIFE-02 — Progress without false precision

Show progress percentage only when trustworthy and meaningful. Otherwise show honest status without fabricated percentage, completion estimate or ETA. Unknown progress is not failed work. Request outcome counts and available results remain readable independently of progress precision.

**Discovery:** Q18, Q35, Q40.

#### MF-LIFE-03 — Per-variant deadlines

Waiting expires at ten minutes from request acceptance; processing expires at two minutes from that variant's actual start. Elapsed time includes downtime. Returning from uncertainty does not reset timestamps. Known unstarted work at/beyond its waiting deadline shall not begin; known resumed processing at/beyond its processing deadline receives stop intent. A retry obtains fresh clocks only through explicit new admission, not acknowledgement recovery.

**Discovery:** Q31, Q49.

#### MF-LIFE-04 — Timeout evidence and late valid results

On deadline expiry, request work stop and record a timeout reason. Do not infer inactivity, failure, confirmed cancellation or cleanup from elapsed time. Mark failed only when the attempt is known ended without a verified deliverable; otherwise preserve uncertainty. Keep already completed outputs. A later verified result may resolve uncertainty to complete if it contradicts no established final outcome. Cancellation/timeout intent alone cannot discard it. No automatic retry or completion-time guarantee.

**Discovery:** Q18, Q27, Q31, Q33, Q34, Q49.

#### MF-LIFE-05 — Uncertainty reconciliation and persistent blockers

Recheck uncertain work when status can be established and expose Operations checks. A verified retained result becomes complete; evidence of original work underway/not begun may restore processing/waiting; proof that no deliverable exists and no further output can arrive allows failed or confirmed cancelled as appropriate. Missing evidence leaves uncertainty indefinitely, with request slots and affected overlap/deletion/usage consequences. Show last check and missing evidence/intervention without requiring internal logs. No forced outcome, abandon-as-resolved override, or guaranteed resolution time is included.

**Discovery:** Q17, Q23, Q34, Q40, Q53, Q55.

#### MF-LIFE-06 — Service interruption and admission honesty

While stopping/unavailable, refuse actions that cannot reliably be admitted with service-unavailable feedback. A lost acknowledgement after admission uses same-attempt recovery, not an assumption of refusal. Preserve accepted source/request identities and completed outputs. Known unstarted work may return as waiting subject to its original deadline; interrupted processing becomes uncertain unless its real outcome is established. Never automatically create a duplicate attempt. No instant shutdown, zero interruption or uninterrupted-access guarantee is introduced.

**Discovery:** Q12, Q17, Q18, Q23, Q31, Q41, Q49.

### Variant lifecycle meanings

| Outcome | Required meaning | Final for request-slot resolution? |
| --- | --- | --- |
| Waiting | Accepted work has not begun | No |
| Processing | Original work is underway | No |
| Verified complete | Actual retained deliverable passed verification and was available for authorized retrieval | Yes; later availability is separate |
| Failed | Known unsuccessful attempt; timeout/cleanup ignorance alone is insufficient | Yes |
| Cancelled | Confirmed that the attempt will not deliver a new output | Yes |
| Uncertain | Result cannot be established as a known active or final outcome | No |

Normal work may reach complete/failed/cancelled only with corresponding evidence. Loss of knowledge may yield uncertainty. Evidence can restore uncertain work to known waiting/processing or a known final outcome without resetting its original clocks. Final attempt outcomes are preserved; subsequent deletion/unavailability does not reopen the original processing attempt. Stop intent and deletion pending are separate action/availability facts, not additional variant outcomes.

### 4.7 Selective manual retry

#### MF-RETRY-01 — Manual eligibility and original revision

Retry shall be manual and variant-selective, permitted to the submitting Contributor for their own eligible requests and Operations for any eligible request. Only known failed or confirmed cancelled variants qualify. Require the original accepted source still available and the same bound preset revision. Refuse waiting, processing, uncertain, complete and deleted-source variants. Unavailable formerly complete outputs use deliberate new processing where permitted, not silent/in-place regeneration.

**Discovery:** Q9, Q12, Q18, Q23, Q32, Q54.

#### MF-RETRY-02 — Immutable lineage and capped accepted attempts

An accepted retry creates a separately identified request linked to originally requested variants, preserving original outcomes and successful siblings. Allow at most three accepted retries per original variant, four attempts including the original. All branches share that original lineage allowance; competing admissions cannot exceed it. Refusals and repeated acknowledgement recovery consume no extra attempt. This bounds the retry feature, not all deliberate future requests for resolved source/preset work. Retain original submitter and retry actor, separate summaries, and normal admission/order rules.

**Discovery:** Q17, Q23, Q26, Q32, Q35, Q43, Q49.

#### MF-RETRY-03 — All-or-nothing selective admission

Every variant selected for one retry must pass authority, eligibility, source/preset overlap, lineage allowance and every admission check. If any fails, refuse the entire retry without consuming any selected variant's retry allowance or creating partial admitted work. Safe repetition of the same accepted retry shall not create another request/slot/clock/attempt.

**Discovery:** Q23, Q32, Q49.

### 4.8 Cancellation

#### MF-CANCEL-01 — Whole specified request and authority

Cancellation targets all unresolved variants of one specified request. Contributors may request it for their own requests; Operations may do so for any eligible request. Preserve completed outputs and do not implicitly cancel separately identified retry descendants. Membership removal does not issue cancellation. Deletion is a separate Manager action.

**Discovery:** Q9, Q18, Q22, Q33, Q54.

#### MF-CANCEL-02 — Intent versus confirmed outcome and race

Confirm cancelled waiting work only when known not to have begun or delivered. For processing/uncertain work, record stop intent while retaining actual outcome until confirmation. A result verified complete before cancellation confirmation remains complete/retrievable. A confirmed cancelled attempt must not subsequently deliver a new output. Elapsed time or an accepted cancellation request alone is not confirmation.

**Discovery:** Q18, Q27, Q31, Q33, Q34, Q49.

#### MF-CANCEL-03 — Repeated and resolved cancellation

Repeating the same cancellation shall not add effects. A resolved request shall report nothing remaining eligible rather than manufacturing a cancellation or altering completed/failed outcomes. Preserve readable action status and reason.

**Discovery:** Q33, Q40.

### 4.9 Review and current availability

#### MF-REVIEW-01 — Evidence and independent usable selections

Completed variants shall expose preview or explicit preview-unavailable feedback plus format, dimensions, byte size and source/preset provenance. No usable mark is set by default. Reviewers may independently mark/unmark any number of completed variants without changing processing completion or download eligibility. Record who last changed each selection and when. A usable mark is editorial judgment, not external publication confirmation or a mandatory approval chain.

**Discovery:** Q6, Q9, Q19, Q26, Q35, Q51.

#### MF-REVIEW-02 — Stale edits, repetition and deletion races

Apply an editorial change only if the selection still matches the state last observed by its reviewer; otherwise reject it with current state for reconsideration. Repeating an already accepted action adds no effect or new attribution. A deleted output cannot acquire a new active selection. If deletion takes effect first, refuse review; if review takes effect first, subsequent deletion removes active usability and preserves former-selection facts. Check current authority at the action boundary.

**Discovery:** Q9, Q19, Q20, Q22, Q36, Q47.

#### MF-REVIEW-03 — Availability and non-restoration

A preview failure shall not invalidate a verified downloadable output; provide readable explanation, metadata and download-for-inspection fallback. Missing/damaged formerly completed media shall not deliver wrong/incomplete bytes: show unavailable while preserving historical completion/provenance and selection context with an availability warning. Do not silently regenerate/replace bytes under the same output identity. Offer deliberate new processing from an available source subject to permissions/admission. Deleted media has no V1 restoration feature; no notification or automatic regeneration workflow is included.

**Discovery:** Q18, Q19, Q20, Q27, Q37, Q47.

### 4.10 Preview rendition

#### MF-PREVIEW-01 — Bounded representation

Derive one PNG preview from each verified complete output, fitting within 400 × 400 using the preset's proportional/nearest-integer/halves-up/minimum-one rules with bound 400. Preserve visible orientation, aspect ratio, sRGB rendering and existing transparency; never crop/enlarge. A JPEG-derived preview already has its white flattened background. Strip nonessential metadata and obey the 1 MiB preview and resource/capacity bounds.

**Discovery:** Q19, Q25, Q27, Q29, Q45, Q46.

#### MF-PREVIEW-02 — One best-effort attempt and independent status

Begin one initial preview-generation attempt after output verification, subject to allowance. If allowance is unavailable, report preview unavailable without delaying completion. Expose pending, available or unavailable independently from output outcome. No automatic preview retry/regeneration or user-controlled preview sizes. Users may inspect valid downloads or deliberately create new output through established processing.

**Discovery:** Q19, Q28, Q29, Q37, Q46.

#### MF-PREVIEW-03 — Generation deadline and cleanup evidence

Once preview generation begins, expire it at thirty seconds, request work stop and expose its truthful status/reason. Expiry does not prove cleanup or free temporary media. Keep a valid output complete despite preview failure. Operations may check provisional obligations under its bounded recovery authority; it cannot regenerate the completed output.

**Discovery:** Q29, Q37, Q46, Q53, Q55.

### 4.11 Deletion and cleanup

#### MF-DELETE-01 — Deletion scope, warning and unsafe-work blockers

Managers may delete one output, preserving its source and siblings, or delete one source and all derived outputs/previews. Source cascade requires an explicit warning. Check Manager authority and blockers at effect time. Refuse deletion while related upload, processing, uncertainty or preview-generation obligations make removal unsafe; do not silently cancel them. Operations provisional cleanup must not bypass accepted-asset deletion authority.

**Discovery:** Q7, Q9, Q20, Q22, Q33, Q47, Q55.

#### MF-DELETE-02 — Admission and review race ordering

If source request/retry admission wins before deletion, unresolved work blocks deletion. If deletion wins first, refuse new work and review/retrieval against its targets. Review-first selection is later removed from active usability on deletion with former facts preserved. No inconsistent success from competing authority changes, admissions or stale selections is permitted.

**Discovery:** Q20, Q22, Q23, Q36, Q47.

#### MF-DELETE-03 — Access closure versus confirmed cleanup

Accepted eligible deletion immediately makes its source/output and all cascade targets inaccessible to new retrieval, selection and processing, but exposes deletion pending until media cleanup is confirmed. Previously authorized downloads may finish; neither deletion nor membership removal recalls transferred/in-flight bytes. Do not credit retained space while removed files remain retained. Confirm source deletion only after the source and all derived outputs/previews are confirmed removed. Unknown cleanup stays pending with charges/provenance. History-only eligibility requires actual removal and resolved supporting work.

**Discovery:** Q7, Q20, Q28, Q38, Q47, Q48, Q53.

#### MF-DELETE-04 — Idempotent follow-up and no undo

Repeated deletion/status recovery preserves original deletion attribution and never restores media. Managers may request follow-up cleanup/status recovery on that same accepted deletion without inventing success. Make pending cascade cleanup readable. Operations may inspect it but Manager authority governs the accepted-media cleanup decision; there is no V1 undo/restore feature.

**Discovery:** Q20, Q37, Q47, Q55.

### 4.12 Provenance and retention

#### MF-HISTORY-01 — Minimum product facts

Retain only the bounded product facts in the history-facts register: source identity/filename/media facts/actor/time/declaration; request identity/admission/submitter/retry linkage/count; bound revision/effective settings; variant outcomes/relevant lifecycle/check times/reason category; output identity/metadata/availability; latest editorial selection actor/time and former-selection facts needed for deletion context; deletion actor/time. Do not retain embedded source metadata, media bytes, unlimited internal logs or a full editorial event log solely as history.

**Discovery:** Q11, Q14, Q19, Q20, Q26, Q32, Q38, Q44, Q48, Q51.

#### MF-HISTORY-02 — Dependency-pinned provenance

Keep provenance while any related source/output/preview remains or supporting work is unresolved, including original request/retry lineage. One request resolving does not expire records still supporting source, sibling or retry results. Pending/uncertain cleanup does not begin history-only eligibility. Removed actors retain stable historical attribution without access. Media has no automatic expiry and no archive guarantee.

**Discovery:** Q20, Q26, Q32, Q35, Q38, Q47, Q48.

#### MF-HISTORY-03 — Fixed ninety-day history-only expiry

When all dependencies requiring a record have ended, set history-only eligibility and expiry at that time plus ninety elapsed days. At expiry, remove it from listing/lookups with history-expired/not-available feedback, not fabricated provenance. Reading, repeated action recovery and rejected changes do not extend expiry. Reference expiry neither expires media nor resolves work. There is no owner-operated early history purge. Do not shorten required history merely to admit new records.

**Discovery:** Q7, Q38, Q43, Q44, Q48.

#### MF-HISTORY-04 — Unaccepted attempt retention distinction

Unaccepted attempts follow their reference-window/unresolved-evidence obligations rather than accepted-source history timing. Required unresolved attempt facts may outlive action-reference expiry and still count toward the cap. Remove unaccepted attempt facts when both recovery protection and unresolved cleanup end. Preserve no media bytes solely for that history; safe provisional media cleanup remains separately confirmed.

**Discovery:** Q23, Q38, Q43, Q44, Q55.

### Minimum history-facts register

This describes observable product facts, not a database or storage schema.

| Subject | Required bounded facts |
| --- | --- |
| Source | Identity, original descriptive filename, actual format/dimensions/byte size, submission actor/time, declaration fact |
| Request | Identity, admission time, submitter, retry links and attempt count |
| Preset | Bound immutable revision and effective geometry/orientation/format/quality/transparency/metadata/color policies |
| Variant | Outcome, relevant start/completion/cancellation/timeout/check times, readable reason category |
| Output | Identity, media metadata, current availability |
| Editorial selection | Latest change actor/time and former-selection facts needed to explain deletion context |
| Deletion | Actor/time, scope, pending/confirmed facts and affected provenance |
| Unaccepted attempt/provisional work | Bounded current facts needed for reference recovery or unresolved acceptance/cleanup, with actor/check/allowance information |

### 4.13 Documented client, listings, and feedback

#### MF-CLIENT-01 — Reproducible actor workflows

Provide a documented starting point, initial Manager/access setup, supported sample files, explicitly identified actors and every responsibility's permitted/denied workflow. Demonstrate actual records, outcomes, review evidence and retrieved media. Human-facing acceptance/refusal/uncertainty/recovery must be understandable without internal-log interpretation or manual record editing. No client tool/protocol/framework or custom browser UI is selected.

**Discovery:** Q9, Q19, Q21, Q39, Q52.

#### MF-CLIENT-02 — Bounded stable listings and filters

List unexpired records newest-accepted first with stable identity tie-break, default fifty per page and maximum one hundred. Label deletion/unavailability/unresolved/history-only facts distinctly; exclude expired history. Provide applicable exact source/request/actor identity, variant outcome, preset revision, availability and usable-selection filters plus explicit live/history-only views. Continuation follows the order boundary: newer insertions appear on refresh without repeating earlier entries; expired records may disappear and current facts may change. No frozen snapshot is promised. Enforce current permission on every page/continuation.

**Discovery:** Q8, Q12, Q19, Q35, Q38, Q40, Q50.

#### MF-CLIENT-03 — Accurate reason categories and safe next steps

Distinguish invalid/unsupported input, permission denial, duplicate/overlapping work, stale selection, retained-capacity exhaustion, temporary/workload pressure, field/size/resource bounds, timeout, cancellation, uncertainty, expired reference/history, and deleted/unavailable media. Identify affected records/variants where access permits. State accepted, refused-without-new-record or indeterminate action status. Suggest correction, Manager cleanup, waiting, eligible retry or Operations checks as appropriate. Never suggest blind repetition of uncertain work, invent recovery times, or make raw internal diagnostics the only explanation. Wording may vary; categories and action status remain consistent.

**Discovery:** Q13, Q16, Q17, Q18, Q21, Q23, Q36, Q37, Q40, Q43, Q48, Q53.

#### MF-CLIENT-04 — Immutable descriptive experience

Present the immutable submission facts required by MF-INTAKE-03, provenance required by MF-PRESET-01 and MF-HISTORY-01, and review facts required by MF-REVIEW-01, within MF-RESOURCE-06 field bounds. The metadata-editing exclusions in MF-SCOPE-03 apply. Identity labels needed for MF-CLIENT-01 access setup remain permitted; editorial selection and Manager-controlled membership/responsibilities retain their approved editability.

**Discovery:** Q12, Q19, Q26, Q38, Q44, Q51.

## 5. User journeys

Journeys combine existing requirements; they add no independent policy.

| Journey | Actor, trigger and flow | Result and alternatives | Requirements |
| --- | --- | --- | --- |
| MF-J-01 — Establish/manage access | Initial documented Manager setup; admit actors and assign combined responsibilities; inspect shared work; revoke authority when needed | Current permissions enforced, last Manager preserved; revocation does not cancel accepted work or erase attribution | MF-ACCESS-01–04, MF-CLIENT-01 |
| MF-J-02 — Submit a source | Contributor starts referenced upload, declares permission, sends complete JPEG/PNG; content/fields/quotas/deadline validated | Distinct immutable accepted source, or clear refusal/indeterminate outcome; no source from incomplete intake; cleanup obligations preserved | MF-INTAKE-01–05, MF-SUBMIT-01–04, MF-RESOURCE-01–06 |
| MF-J-03 — Request variants | Contributor chooses one/both fixed revisions for a shared accepted source; all admission/overlap checks pass; inspect individually visible outcomes | Accepted ordered work, immediate partial completed files, or whole-request refusal; no false all-delivered claim | MF-PRESET-01–06, MF-REQUEST-01–05, MF-LIFE-01–06 |
| MF-J-04 — Review/retrieve | Admitted member inspects/downloads available complete output; Reviewer examines preview/metadata and marks or unmarks usable variants | Multiple independent selections, no retrieval gate; stale edits rejected; missing preview fallback and output unavailability explicit | MF-REVIEW-01–03, MF-PREVIEW-01–03, MF-CLIENT-02–03 |
| MF-J-05 — Recover or stop work | Own-request Contributor or Operations inspects failures/uncertainty, selects eligible retry variants or requests cancellation; Operations seeks evidence/provisional cleanup | New linked retry with counters/clocks only after explicit admission; cancel intent not confirmation; missing evidence keeps blockers | MF-RETRY-01–03, MF-CANCEL-01–03, MF-ACCESS-05–06, MF-LIFE-03–06 |
| MF-J-06 — Delete and retain history | Manager requests output deletion or warned source cascade, subject to unresolved-work blockers; follows pending cleanup | New access closes on accepted deletion; old authorized transfer may finish; capacity released only on proof; dependent history pinned then expires after 90 days | MF-DELETE-01–04, MF-HISTORY-01–04, MF-RESOURCE-05–06 |
| MF-J-07 — Recover acknowledgement/find results | Caller repeats original unchanged reference within its window or finds retained admitted records through authorized bounded listings | Same attempt returned without new effects; mismatched/refused/expired references cannot re-admit; read permissions apply | MF-SUBMIT-01–04, MF-CLIENT-01–03 |

## 6. Authoritative limits register

Size/count bounds are inclusive; exceeding any independently applicable bound refuses admission or causes the defined honest failure. Deadline expiry and stop intent never prove outcome or cleanup. MiB/GiB are binary byte units; “million pixels” means 1,000,000 pixels. These unit clarifications change no approved value.

| Category | Boundary / timing origin | Requirement and discovery sources |
| --- | --- | --- |
| Source byte size | 20 MiB | MF-INTAKE-04; Q15 |
| Source area | 40,000,000 pixels | MF-INTAKE-04; Q15 |
| Source width and height | Each at most 12,000 pixels | MF-INTAKE-04; Q15 |
| Output geometry | Fit within 1600 × 1600 using exact orientation/scale/rounding rules | MF-PRESET-02; Q10, Q24 |
| Web JPEG quality | 85/100; white transparency flattening | MF-PRESET-03; Q10 |
| Color output | sRGB, 8-bit channels | MF-PRESET-04; Q25 |
| Retained media | 1 GiB of logical source/output/preview bytes | MF-RESOURCE-02; Q16, Q28 |
| Outstanding requests | 20 workspace-wide; 5 per acting submitter | MF-RESOURCE-03; Q17, Q32 |
| Unfinished uploads | 4 workspace-wide; 1 per submitting member | MF-INTAKE-04; Q29 |
| Temporary media | 256 MiB per active operation; 512 MiB workspace-wide | MF-RESOURCE-04–05; Q29, Q53 |
| Generated output | 32 MiB per file | MF-RESOURCE-04; Q29 |
| Preview bytes | 1 MiB per preview | MF-PREVIEW-01; Q29 |
| Source records | 5,000 including protected live/unresolved/history-only records | MF-RESOURCE-06; Q44 |
| Request records | 10,000 including retries/protected history | MF-RESOURCE-06; Q44 |
| Required attempt records | 10,000 while recovery window or unresolved evidence requires them | MF-RESOURCE-06; Q44 |
| Original filename | 255 UTF-8 bytes | MF-RESOURCE-06; Q44 |
| Submission reference / opaque public identifier | 128 Unicode code points | MF-RESOURCE-06; Q44 |
| Display label, where used | 80 Unicode code points | MF-RESOURCE-06; Q44 |
| Readable reason summary | 512 Unicode code points | MF-RESOURCE-06; Q44 |
| Whole upload | 5 minutes from admission, reception plus validation; expiry at ≥5 minutes | MF-INTAKE-05; Q42 |
| Variant waiting | 10 minutes from request acceptance | MF-LIFE-03; Q31, Q49 |
| Variant processing | 2 minutes from that variant's actual start | MF-LIFE-03; Q31, Q49 |
| Accepted retries | At most 3 per original variant lineage plus the initial attempt | MF-RETRY-02; Q32 |
| Submission-reference recovery | 7 days from advertised issuance; expired at valid-until | MF-SUBMIT-02; Q43 |
| Preview geometry / attempts | PNG within 400 × 400; one best-effort initial attempt | MF-PREVIEW-01–02; Q46 |
| Preview generation | 30 seconds from generation start | MF-PREVIEW-03; Q46 |
| History-only retention | 90 elapsed days from all-dependencies-ended eligibility; expired at eligibility +90 days | MF-HISTORY-03; Q38, Q48 |
| Listing page | 50 default; 100 maximum | MF-CLIENT-02; Q50 |
| Applicable JPEG acceptance tolerance | ±8 per decoded interior-patch channel on 0–255 scale | MF-ACCEPT-01; Q45 |

## 7. Cross-cutting invariants, races, and failure behavior

These are explicit combinations of approved requirements, not additional architecture choices.

| Invariant / race | Required result | Requirements |
| --- | --- | --- |
| Admission acknowledgement lost | Do not assume refusal or re-admit; recover same attempt | MF-SUBMIT-01–03, MF-LIFE-06 |
| Invalid or overlapping selected preset | Whole request refused; no partial accepted work | MF-REQUEST-01 |
| Multiple capacity contenders | No retained allowance overspend; loser gets actionable feedback; preserve existing files | MF-RESOURCE-02 |
| Member removed while work remains | Revoke future authority, keep admitted identity/counters/attribution; no implicit cancel | MF-ACCESS-03–04, MF-RESOURCE-03 |
| Timeout/stop requested with missing evidence | Remain uncertain; do not release obligations or assert terminal success | MF-LIFE-04–05, MF-RESOURCE-05 |
| Valid result discovered after timeout | May resolve uncertainty to complete unless a confirmed final outcome would be contradicted | MF-LIFE-04 |
| Cancellation races with verified completion | Prior verified completion preserved; confirmed cancelled attempt delivers no later new output | MF-CANCEL-02 |
| Partial success | Available complete outputs exposed independently; truthful counts; no false all-delivered | MF-REQUEST-03–04 |
| Multiple retry contenders/selected variants | Shared root limit enforced; any failed check refuses whole selected retry; repeated recovery consumes no attempt | MF-RETRY-02–03 |
| Reference expired or prior refusal | Never re-admit under it; protect unresolved evidence; retained admitted identities survive | MF-SUBMIT-02–04 |
| Stale reviewer or repeat action | Stale change rejected with current facts; accepted repetition adds no attribution | MF-REVIEW-02 |
| Request/retry vs source deletion | Admission-first blocks deletion; deletion-first blocks admission | MF-DELETE-01–02 |
| Review vs deletion | Delete-first rejects review; review-first becomes former selection with deletion context | MF-REVIEW-02, MF-DELETE-02 |
| Accepted deletion vs old download | Block new access; previously authorized transfer may finish; no recall promise | MF-ACCESS-03, MF-DELETE-03 |
| Pending media cleanup | No confirmed deletion/free-space claim until evidence; source cascade requires all targets removed | MF-DELETE-03–04, MF-RESOURCE-05 |
| Preview cannot be provided | Explicit pending/unavailable reason, valid output remains complete/downloadable | MF-PREVIEW-02–03, MF-REVIEW-03 |
| Formerly complete output missing/damaged | Block wrong/incomplete delivery; preserve historical outcome; no silent replacement | MF-REVIEW-03 |
| History needed by live source/sibling/retry or unresolved work | Preserve provenance; no timer yet and no cap-driven eviction | MF-HISTORY-02–03, MF-RESOURCE-06 |
| History-only expiry | Remove record at fixed eligible expiry; no media expiry or read extension | MF-HISTORY-03 |
| Resource usage unknown | Keep affected obligations visible; refuse unsafe new admission, keep recovery available | MF-RESOURCE-05, MF-ACCESS-05–06 |

Feedback shall distinguish the cause and accepted/refused/indeterminate action status and identify permitted affected records. Correction, safe new reference, waiting, eligible manual retry, Manager deletion/follow-up, or Operations evidence checks are offered only when the approved rules make them safe. No fabricated recovery time, automatic uncertain rerun, or internal-log-only explanation is acceptable.

## 8. Acceptance requirements

#### MF-ACCEPT-01 — Structural rendering and precision rubric

Acceptance shall exercise both presets against the exact geometry cases below and verify orientation, no crop/border/enlargement, 8-bit outputs, metadata policy and unchanged source bytes. Applicable unscaled sRGB 8-bit PNG solid patches preserve nontransparent color samples and alpha exactly; hidden RGB under fully transparent pixels is unconstrained. Opaque unscaled sRGB JPEG patch interiors must be within eight channel values of the reference on the 0–255 scale, excluding patch boundaries. This is the approved V1 tolerance, not an industry standard or universal JPEG equivalence guarantee.

**Discovery:** Q10, Q11, Q15, Q24, Q25, Q27, Q39, Q45, Q52.

#### MF-ACCEPT-02 — Owner-reviewed visual references

For converted profiled RGB, valid profiled CMYK, supported higher-precision PNG, resized detail and partial-transparency JPEG flattening, compare source/reference/output side by side for expected orientation/content, intended sRGB appearance, continuous tones, expected precision reduction and white compositing, without unexplained hue inversion, gross clipping, missing content or dark edges. Reject unprofiled CMYK/invalid or unsupported interpretation with the stated reason. Actual reference artifacts require owner approval before final rendering acceptance. Neither reference artifacts nor implementation fidelity are claimed already produced/approved.

**Discovery:** Q25, Q39, Q45, Q52.

#### MF-ACCEPT-03 — Complete product evidence matrix

The complete acceptance matrix below shall cover real actors/assets/actions, all roles and denials, supported/invalid workflows, boundaries, concurrency, resource preservation, six outcomes, partial delivery, deadlines, retries, cancellation, interruption, persistent uncertainty/reconciliation, review, unavailable media, deletion/cleanup, references, provenance/retention, listings and safe feedback. Review concrete coverage before final product acceptance. Approval of this PRD defines required evidence, not execution or acceptance of that evidence.

**Discovery:** Q9, Q13, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q23, Q29, Q31, Q32, Q33, Q34, Q35, Q36, Q37, Q38, Q39, Q40, Q41, Q42, Q43, Q44, Q45, Q46, Q47, Q48, Q49, Q50, Q51, Q52, Q53, Q54, Q55.

#### MF-ACCEPT-04 — Future evidence and controlled scenarios

Use actual product records, media, attribution, counts and visible actions. Controlled fault/time scenarios are permitted in an isolated acceptance setting to demonstrate deadlines and ninety-day expiry reproducibly, exercising real behavior rather than editing results or presenting invented transcripts. The demonstration method belongs to later authorized module-scoped work. Do not introduce a performance SLA or production-scale benchmark target. No tests, application code, or acceptance demonstrations are produced as part of this PRD.

**Discovery:** Q15, Q29, Q39, Q45, Q52.

### Exact rendering examples

| Source / orientation condition | Required output dimensions, both presets |
| --- | --- |
| Oriented 4000 × 3000 | 1600 × 1200 |
| Oriented 100 × 50 | 100 × 50 |
| Oriented 3200 × 1001 | 1600 × 501 |
| Oriented 1 × 12000 | 1 × 1600 |
| Stored 4000 × 3000 with 90-degree visible rotation | 1200 × 1600 |

## 9. Complete product acceptance matrix — Future evidence

Every row is a required acceptance obligation. **Evidence status for all rows: Not executed; not approved.** Approval of this document or discovery is not proof of implementation or a passed case. Actual visual reference artifacts also require separate future owner review. Scope/document reviews, user-visible demonstrations and controlled boundary/fault/time cases together supply the agreed matrix; implementation methods are not selected here.

| Acceptance ID / area | Requirements | Scenario | Required result | Evidence to collect later |
| --- | --- | --- | --- | --- |
| MF-AC-01 — Release scope and workflow entry | MF-SCOPE-01, MF-SCOPE-03, MF-SCOPE-04, MF-CLIENT-01, MF-CLIENT-04 | Review published capabilities and use the documented client starting point. | One private backend desk exposes required actor workflows; excluded/deferred features and guarantees are not advertised as V1 capabilities. | Client documentation and actual permitted/denied workflow records; later release-scope review. |
| MF-AC-02 — Private shared access | MF-SCOPE-02, MF-ACCESS-01, MF-CLIENT-02 | Admitted member, anonymous caller and removed member inspect/retrieve shared accepted records and media. | Admitted members have shared read/retrieval access; anonymous/removed callers cannot access new actions/pages/media. Read authority alone allows no modifications. | Actor-specific real listings, retrieved artifacts and denials. |
| MF-AC-03 — Responsibility combinations | MF-ACCESS-01, MF-ACCESS-02, MF-CLIENT-01 | Exercise each responsibility alone and combined, on own/other requests and another uploader’s source. | Permissions match matrix; any Contributor can process a shared source; request submitter owns own-request actions; Manager alone cannot upload/review/retry/cancel. | Actors, assignments, submitted identities, action attribution and denial records. |
| MF-AC-04 — Revocation and last Manager | MF-ACCESS-03, MF-ACCESS-04, MF-RESOURCE-03 | Remove responsibility/membership during admitted work; compete to remove the last Managers. | Future authority is revoked; admitted work/attribution/counters remain; no automatic cancellation or orphaned Manager boundary. Authorized earlier downloads follow transfer policy. | Before/after authority, counters, outcomes and historical actor facts. |
| MF-AC-05 — Valid source, declaration and original bytes | MF-INTAKE-01, MF-INTAKE-02, MF-INTAKE-03, MF-CLIENT-04 | Submit supported JPEG/PNG with declaration, including intentionally identical re-uploads and matching filenames. | Complete validation precedes acceptance; each deliberate accepted upload is distinct; declaration/metadata/attribution persist; original bytes unchanged. | Actual source files, recorded facts and original-byte comparison. |
| MF-AC-06 — Invalid and misleading inputs | MF-INTAKE-01, MF-INTAKE-02, MF-PRESET-04, MF-CLIENT-03 | Corrupt, truncated, unsupported, animated/multiple-frame files; missing declaration; valid JPEG/PNG with misleading name/type; unsupported color. | Invalid cases create no accepted source/request; valid supported contents survive advisory label mismatch; ambiguous/unprofiled CMYK is rejected with clear category. | Input fixtures and actual refusal/acceptance records. |
| MF-AC-07 — Inclusive source boundaries | MF-INTAKE-04, MF-RESOURCE-01 | Exercise 20 MiB, 40 million pixels, and 12,000-pixel dimensions exactly, then exceed each independently. | Within/all-exact boundaries pass size checks; any exceeded bound is rejected, without implying other checks or eventual processing are guaranteed. | Valid boundary files, actual bytes/dimensions and intake feedback. |
| MF-AC-08 — Upload concurrency and expiry | MF-INTAKE-04, MF-INTAKE-05, MF-RESOURCE-04, MF-RESOURCE-05 | Four unfinished workspace uploads; one member’s second; fifth workspace upload; stalled/disconnected intake and five-minute boundary. | Excess uploads refused; reception/validation share deadline; unaccepted failures create no source; unknown cleanup retains slots/allowance; no partial resumption. | Attempt records, timing, upload counts, provisional usage and cleanup evidence. |
| MF-AC-09 — Same-attempt replay and acknowledgement loss | MF-SUBMIT-01, MF-SUBMIT-03, MF-LIFE-06 | Lose acknowledgement of an admitted upload/request/retry and repeat its unchanged reference, including repeated recovery while pending. | Original identity/status recovered with no duplicate accepted record, slot, clock, effect or retry consumption; uncertainty is not assumed refusal. | References, actor/action bindings, original records and counters. |
| MF-AC-10 — Changed, refused and expired references | MF-SUBMIT-01, MF-SUBMIT-02, MF-SUBMIT-04 | Reuse with changed payload/actor/action; repeat refused attempt after improvement; recover before/exactly at/after seven-day expiry. | Changed inputs/bindings rejected; refusal stays refusal; expired action cannot become new; accepted records remain ordinarily accessible; unresolved evidence remains protected. | Advertised times, original outcomes, refusals, retained identities/evidence. |
| MF-AC-11 — One-source distinct presets and overlap | MF-REQUEST-01, MF-ACCESS-02 | Submit one/both presets, duplicate/unknown presets, multi-source input and overlapping unresolved source/preset work. | Only one source and one/both distinct published presets admitted; invalid/overlapping request refused as whole with existing-work reference; new resolved-work request gets new identity. | Request records, source/preset references and rejection feedback. |
| MF-AC-12 — Fixed immutable presets | MF-PRESET-01, MF-REQUEST-02 | Inspect catalogue, bind a request and inspect its output/history; attempt parameter override or Manager preset edit. | Only two v1 revisions; effective settings/provenance stable; no override/edit capability or mutable-name-only historical meaning. | Catalogue, accepted bindings and retained effective settings. |
| MF-AC-13 — Geometry and orientation | MF-PRESET-02, MF-ACCEPT-01 | Exercise all exact dimension cases in rendering table through both presets. | Exact expected dimensions, orientation/content preserved; no upscaling/crop/border; halves round upward and minimum dimension is one. | Actual decodable outputs, dimensions and visual source comparisons. |
| MF-AC-14 — Format, alpha and PNG fidelity | MF-PRESET-03, MF-PRESET-04, MF-ACCEPT-01 | Unscaled sRGB 8-bit PNG solid patches with opaque/partial/zero alpha; JPEG and PNG presets. | Correct formats; PNG applicable samples/alpha exact; hidden zero-alpha RGB unconstrained; JPEG white flattening and quality 85 setting; 8-bit sRGB output. | Decoded files, settings, samples and white-compositing reference evidence. |
| MF-AC-15 — JPEG interior tolerance | MF-PRESET-03, MF-ACCEPT-01 | Opaque unscaled sRGB solid-patch source, excluding patch boundaries. | Each decoded interior channel differs from reference by at most eight values on 0–255 scale. | Actual JPEG samples and approved fixture/reference values. |
| MF-AC-16 — Profiles, precision and visual detail | MF-PRESET-04, MF-ACCEPT-02 | Supported profiled RGB/CMYK, higher-precision PNG, resized detail and partial-alpha JPEG against approved references. | Owner-reviewed rubric passes; intended appearance/precision reduction and compositing hold; unsupported interpretation rejected rather than guessed. | Owner-approved source/reference artifacts and later side-by-side output review. |
| MF-AC-17 — Metadata and source preservation | MF-PRESET-05, MF-INTAKE-03, MF-HISTORY-01, MF-ACCEPT-01 | Process sources with camera/location/author/descriptive and rendering metadata. | Nonessential embedded metadata absent from outputs/previews; necessary rendering information and separate provenance present; original source bytes unchanged. | Actual metadata inspection, source comparison and recorded provenance. |
| MF-AC-18 — Verify before completion and immutable output | MF-PRESET-06, MF-LIFE-01 | Processor reports success but file is corrupt/wrong-format/wrong-dimension/wrong-provenance; repeat valid conversions. | Invalid known result not complete/retrievable; unknown result uncertain; actual valid file verified before complete; repeated conversions get new identities without replacing fixed bytes. | Actual retained files, verification records, outcomes and identities. |
| MF-AC-19 — Retained allowance and contenders | MF-RESOURCE-01, MF-RESOURCE-02, MF-RESOURCE-05 | Fill logical media exactly to 1 GiB, attempt further source/request admission or output retention, and compete for remaining space. | Inclusive cap enforced; no physical-dedup discount, overspend or eviction; full workspace rejects new processing; admitted outputs may later fail capacity; existing assets preserved. | Actual logical file sizes, usage, contender results and preserved artifacts. |
| MF-AC-20 — Workload/member slots | MF-RESOURCE-01, MF-RESOURCE-03 | 20 workspace requests, 5 for a submitter, excess admissions, multi-preset requests and removed-member uncertain work. | Each request counts once; excess refused; all-known-final required for release; uncertainty/removal/expiry/parent cancellation does not release another unresolved slot. | Actor/request counters, refusals and resolution evidence. |
| MF-AC-21 — Temporary and generated-file limits | MF-RESOURCE-01, MF-RESOURCE-04, MF-RESOURCE-05 | At/over 256 MiB per operation, 512 MiB workspace temporary media, 32 MiB output, 1 MiB preview; unknown cleanup and temporary-to-retained transitions. | Known violations fail safely; preview failure does not invalidate output; unknown allowance not credited; files neither double-counted nor omitted; existing assets remain. | Controlled boundary/fault evidence, real product outcomes and accounting transitions. |
| MF-AC-22 — Record caps and fields | MF-RESOURCE-06, MF-SUBMIT-04, MF-HISTORY-04 | At/over 5,000 source, 10,000 request and 10,000 protected attempt records; exact/over text bounds. | Creation beyond caps refused; history and unresolved expired-reference evidence count; protected records retained; recovery actions remain; overlong supplied text rejected. | Counts, expiry facts, bounded-field inputs and clear record-limit feedback. |
| MF-AC-23 — Order and bypass | MF-REQUEST-05, MF-RETRY-02 | Eligible and ineligible older requests, newer work, explicit retries and both presets with JPEG failure. | Eligible acceptance order, allowed bypass, no displacement; retry joins end; catalogue start order preserved and eligible PNG not suppressed. No serial/parallel promise inferred. | Acceptance/start facts and sibling outcomes. |
| MF-AC-24 — Six outcomes and honest progress | MF-LIFE-01, MF-LIFE-02, MF-LIFE-05, MF-CLIENT-03 | Controlled circumstances establish every outcome and both known/unknown progress. | Meanings hold; percentages only trustworthy; no invented ETA or final outcome; uncertainty distinguishes missing knowledge and last evidence. | Actual state/evidence records and client presentation. |
| MF-AC-25 — Partial success and summaries | MF-REQUEST-02, MF-REQUEST-03, MF-REQUEST-04 | One variant complete with another waiting/failed/uncertain; later deletion/unavailability and separate retry. | Immediate available output/review; exact outcome counts; mixed results explicit; unresolved count retained; historical delivery distinguished from present availability; parent unchanged by retry. | Counts, artifacts, provenance and parent/retry summaries. |
| MF-AC-26 — Waiting/processing deadlines and downtime | MF-LIFE-03, MF-LIFE-04, MF-LIFE-06 | Just before/at/after ten-minute waiting and two-minute processing boundaries, including downtime and uncertainty-to-known restoration. | No clock reset; expired known waiting work does not begin; processing gets stop intent; only evidence gives failure/confirmation; late valid result may resolve uncertainty without contradicting final outcome. | Original timestamps, deadline reasons, stop evidence and actual final/pending results. |
| MF-AC-27 — Selective retry eligibility and lineage | MF-RETRY-01, MF-RETRY-02, MF-ACCESS-02 | Retry failed/cancelled subsets; try waiting/processing/uncertain/complete/deleted-source cases; exercise three retries and a refused fourth retry. | Only eligible source/revision-preserving variants admitted; fourth total attempt allowed, fifth refused; lineage shared across actors/branches; successful siblings and originals retained; acting actor’s slots used. | Original/retry linkage, actors, counters, admissions and preserved outputs. |
| MF-AC-28 — Atomic retry and repeated recovery | MF-RETRY-03, MF-SUBMIT-01 | A selected retry set contains an ineligible/exhausted/conflicting variant; simultaneous final-allowance retries; replay accepted retry reference. | Whole retry refused without partial consumption when any check fails; contenders cannot exceed lineage allowance; repeated recovery creates no extra attempt/clock/slot. | Retry counts before/after and actual competing action results. |
| MF-AC-29 — Cancellation scope and repeated action | MF-CANCEL-01, MF-CANCEL-03, MF-ACCESS-03 | Cancel own/other requests as permitted, repeat it, target resolved work, and inspect separate descendants/completed outputs. | Only specified unresolved variants targeted; descendants/completed outputs preserved; repeated action adds no effect; resolved request reports no eligible remainder. | Permission records, cancel intent/attribution and unchanged artifacts/descendants. |
| MF-AC-30 — Cancellation/completion/deadline race | MF-CANCEL-02, MF-LIFE-04 | Waiting cancellation, processing stop intent, unknown stop, completion before confirmation and timeout at the boundary. | No intent-as-success; evidence confirms cancellation; prior verified output remains; confirmed cancelled attempt cannot later deliver; deadlines do not fabricate cleanup/failure. | Ordered action/evidence facts, actual output and confirmed/pending outcomes. |
| MF-AC-31 — Reconciliation and persistent uncertainty | MF-ACCESS-05, MF-LIFE-05, MF-RESOURCE-03, MF-RESOURCE-05 | Check with/without sufficient evidence; inspect work discovered active/not begun/complete/stopped, including reference expiry. | Only evidence resolves; no forced outcomes or new attempt; unresolved state/slots/overlap/deletion consequences persist; last check and missing intervention visible. | Evidence checks, unchanged counters and permitted/denied Operations actions. |
| MF-AC-32 — Interruption continuity | MF-LIFE-06, MF-SUBMIT-03, MF-PRESET-06 | Stop/unavailable service before/after admission and during processing; restore with known/unknown outcome. | Unreliably admitted actions refused honestly; accepted identities/files persist; unknown processing uncertain; no duplicate attempt or terminal-outcome rewrite; original clocks retained. | Admission acknowledgements/recovery, identities, real media and outcome facts. |
| MF-AC-33 — Review selection and stale changes | MF-REVIEW-01, MF-REVIEW-02 | Multiple initially unselected completed variants; mark/unmark; competing stale reviewer and repeated accepted action; authority removal. | Multiple reversible selections, no default/gate; attribution retained; stale edit returns current state; repetition adds no change; revoked edits refused. | Selections, observed/current facts, timestamps and unchanged downloads. |
| MF-AC-34 — Preview rendition and bounded attempt | MF-PREVIEW-01, MF-PREVIEW-02, MF-PREVIEW-03, MF-REVIEW-03 | Preview from JPEG/PNG outputs, small/large/transparent cases; unavailable allowance, thirty-second expiry and over-size generation. | PNG within 400 × 400, correct rounding/appearance/alpha, no crop/enlargement; one attempt; truthful pending/unavailable state; valid output remains complete; no automatic retry or unproven cleanup credit. | Actual preview files, metadata, generation facts and output download. |
| MF-AC-35 — Missing/damaged output and no silent restoration | MF-REVIEW-03, MF-PRESET-06 | Previously completed selected output becomes missing/damaged/deleted; attempt recovery. | Wrong/incomplete bytes not delivered; historical completion/selection context preserved with warning; no replacement/regeneration under old identity; deliberate new processing only where eligible. | Availability facts, refusal, old provenance and separately identified recovery output. |
| MF-AC-36 — Deletion scope, authority and admission race | MF-DELETE-01, MF-DELETE-02, MF-REVIEW-02 | Manager individual/cascade deletion; Operations accepted-asset deletion attempt; blocked active/uncertain/preview work; competing request/retry/review. | Correct scope/warning/authority; no implicit cancellation; one consistent winner; individual deletion retains source/siblings; review-first former facts preserved and delete-first new actions refused. | Targets, warnings, blockers, actor denials and competing action outcomes. |
| MF-AC-37 — Deletion pending, downloads and capacity | MF-DELETE-03, MF-DELETE-04, MF-RESOURCE-05 | Accepted deletion with incomplete/unknown cleanup and previously authorized download; repeated status/cleanup recovery. | New access closed; existing transfer may finish; pending shown and bytes charged until evidence; cascade only confirmed after all targets removed; attribution unchanged, no restore. | Access results, cleanup evidence, actual remaining media/accounting and follow-up actor facts. |
| MF-AC-38 — Provenance facts and live protection | MF-HISTORY-01, MF-HISTORY-02, MF-ACCESS-04 | Resolve requests while source/output/retry dependencies remain; remove actors and delete selected media. | Required source/preset/lineage/outcome/selection/deletion facts remain with stable attribution; no embedded metadata, media archive or unlimited event/internal-log history solely for records. | Bounded history facts and actual live dependencies. |
| MF-AC-39 — Ninety-day eligibility and expiry | MF-HISTORY-02, MF-HISTORY-03, MF-DELETE-03 | Media gone/work resolved versus live or pending-cleanup dependencies; before/at/after eligible time +90 days; repeated reads/recovery. | Timer starts only after all dependencies end; no read extension or early manual purge; eligible expiry removes lookup/listing with clear feedback; media not auto-expired. | Controlled-time real lifecycle records, eligibility/expiry and preserved media cases. |
| MF-AC-40 — Attempt retention versus accepted history | MF-HISTORY-04, MF-SUBMIT-02, MF-SUBMIT-04, MF-RESOURCE-06 | Refused/unaccepted attempt inside/outside recovery window with known/unknown cleanup. | No accepted-source history invented; attempt record removed only after both obligations end; expired uncertainty still protected/counts; no expired mutation or media retained solely as history. | Attempt facts, expiry, cleanup evidence and cap counts. |
| MF-AC-41 — Listing continuation and exact filters | MF-CLIENT-02, MF-SCOPE-02 | 50-default/100-max pages, over-limit request, all applicable filters, insertions/expiry between pages, membership removal between pages. | Bounded stable order/boundary, no duplicate earlier entries from insertions, newer on refresh, expired absent, current facts labelled; revoked continuation denied; no snapshot/fuzzy/export promise. | Actual pages/identities, filters, updates and denied continuation. |
| MF-AC-42 — Actionable feedback | MF-CLIENT-03 | Exercise every specified refusal/failure/uncertainty/expiry/availability category through the client. | Consistent category/action status/affected permitted records and safe next step; no fabricated recovery time, blind uncertain retry or internal-log-only explanation. | Actual readable action results and authorized recovery workflow. |
| MF-AC-43 — Non-variant Operations and Manager follow-up | MF-ACCESS-06, MF-DELETE-04, MF-RESOURCE-05 | Removed-member intake/expired reference, uncertain preview/temp cleanup and pending accepted deletion. | Operations inspects/checks and safely cleans only provisional media; cannot adopt/replay/create retry/regenerate/delete accepted assets; Manager governs deletion follow-up; unresolved blocker retained. | Actors, attempt/check facts, limits, denials and safe cleanup evidence. |
| MF-AC-44 — Evidence review and educational boundary | MF-SCOPE-04, MF-ACCEPT-02, MF-ACCEPT-03, MF-ACCEPT-04, MF-EDU-01 | Review complete matrix, actual reference artifacts, controlled fault/time demonstrations and later learner evidence. | Actual evidence reviewed, no edited outcomes/fake transcript or unexecuted pass claims; owner approves rendering references/coverage; D03 direction preserved without mandatory mechanisms or mastery/performance claims. | Later owner reference/evidence review and documented educational coverage discussion. |

## 10. Domain 03 educational direction

#### MF-EDU-01 — Domain 03 learning direction

Preserve the approved Charter's potential D03-C03–C04, C06–C12 and C14–C18 learning challenges: byte/dataflow and asynchronous/native/parallel work, resource pressure, attribution, shutdown and diagnosis. The product's derived assets, honest outcomes, resource limits, interruption behavior and evidence-based recovery provide authentic later learning cases. Do not force a library, storage architecture, process model or platform for coverage; these are potential challenges, not demonstrated learner mastery or predetermined Node mechanisms. D01/D02 project boundaries remain unchanged.

**Discovery:** Q1, Q18, Q27, Q29, Q31, Q34, Q39, Q41, Q52, Q53.

## 11. Requirement-to-discovery traceability

Forward traceability is attached to every normative requirement. Reverse traceability below accounts for **every approved Q1–Q55**, including later clarifications. The acceptance matrix links future evidence directly to requirement IDs; each case covers its stated scenario, not every aspect of a discovery question. Charter-only exclusions and educational direction are additionally captured in MF-SCOPE-04 and MF-EDU-01.

| Discovery decision | Consolidated requirements |
| --- | --- |
| Q1 | MF-SCOPE-01, MF-INTAKE-02, MF-EDU-01 |
| Q2 | MF-SCOPE-03, MF-INTAKE-01 |
| Q3 | MF-SCOPE-02 |
| Q4 | MF-SCOPE-03, MF-INTAKE-01 |
| Q5 | MF-SCOPE-01, MF-PRESET-01, MF-REQUEST-01, MF-REQUEST-02, MF-REQUEST-03 |
| Q6 | MF-SCOPE-01, MF-REQUEST-03, MF-REQUEST-04, MF-REVIEW-01 |
| Q7 | MF-SCOPE-04, MF-DELETE-01, MF-DELETE-03, MF-HISTORY-03 |
| Q8 | MF-SCOPE-02, MF-CLIENT-02 |
| Q9 | MF-SCOPE-02, MF-ACCESS-01, MF-ACCESS-02, MF-ACCESS-03, MF-ACCESS-05, MF-ACCESS-06, MF-SUBMIT-03, MF-RETRY-01, MF-CANCEL-01, MF-REVIEW-01, MF-REVIEW-02, MF-DELETE-01, MF-CLIENT-01, MF-ACCEPT-03 |
| Q10 | MF-SCOPE-03, MF-PRESET-01, MF-PRESET-02, MF-PRESET-03, MF-REQUEST-01, MF-ACCEPT-01 |
| Q11 | MF-PRESET-05, MF-HISTORY-01, MF-ACCEPT-01 |
| Q12 | MF-ACCESS-02, MF-INTAKE-03, MF-REQUEST-01, MF-LIFE-06, MF-RETRY-01, MF-CLIENT-02, MF-CLIENT-04 |
| Q13 | MF-ACCESS-06, MF-INTAKE-01, MF-INTAKE-05, MF-CLIENT-03, MF-ACCEPT-03 |
| Q14 | MF-SCOPE-04, MF-ACCESS-02, MF-INTAKE-02, MF-HISTORY-01 |
| Q15 | MF-INTAKE-01, MF-INTAKE-04, MF-RESOURCE-01, MF-ACCEPT-01, MF-ACCEPT-03, MF-ACCEPT-04 |
| Q16 | MF-SCOPE-04, MF-RESOURCE-01, MF-RESOURCE-02, MF-CLIENT-03, MF-ACCEPT-03 |
| Q17 | MF-SCOPE-04, MF-ACCESS-03, MF-REQUEST-05, MF-RESOURCE-01, MF-RESOURCE-03, MF-LIFE-05, MF-LIFE-06, MF-RETRY-02, MF-CLIENT-03, MF-ACCEPT-03 |
| Q18 | MF-PRESET-06, MF-REQUEST-02, MF-REQUEST-03, MF-LIFE-01, MF-LIFE-02, MF-LIFE-04, MF-LIFE-06, MF-RETRY-01, MF-CANCEL-01, MF-CANCEL-02, MF-REVIEW-03, MF-CLIENT-03, MF-ACCEPT-03, MF-EDU-01 |
| Q19 | MF-PRESET-05, MF-REQUEST-02, MF-REQUEST-04, MF-REVIEW-01, MF-REVIEW-02, MF-REVIEW-03, MF-PREVIEW-01, MF-PREVIEW-02, MF-HISTORY-01, MF-CLIENT-01, MF-CLIENT-02, MF-CLIENT-04, MF-ACCEPT-03 |
| Q20 | MF-REQUEST-03, MF-REVIEW-02, MF-REVIEW-03, MF-DELETE-01, MF-DELETE-02, MF-DELETE-03, MF-DELETE-04, MF-HISTORY-01, MF-HISTORY-02, MF-ACCEPT-03 |
| Q21 | MF-SCOPE-01, MF-SCOPE-03, MF-CLIENT-01, MF-CLIENT-03, MF-ACCEPT-03 |
| Q22 | MF-ACCESS-01, MF-ACCESS-03, MF-ACCESS-04, MF-ACCESS-06, MF-SUBMIT-03, MF-RESOURCE-03, MF-CANCEL-01, MF-REVIEW-02, MF-DELETE-01, MF-DELETE-02 |
| Q23 | MF-ACCESS-06, MF-INTAKE-03, MF-INTAKE-05, MF-SUBMIT-01, MF-SUBMIT-02, MF-SUBMIT-03, MF-SUBMIT-04, MF-REQUEST-01, MF-RESOURCE-06, MF-LIFE-05, MF-LIFE-06, MF-RETRY-01, MF-RETRY-02, MF-RETRY-03, MF-DELETE-02, MF-HISTORY-04, MF-CLIENT-03, MF-ACCEPT-03 |
| Q24 | MF-PRESET-02, MF-ACCEPT-01 |
| Q25 | MF-SCOPE-04, MF-INTAKE-01, MF-PRESET-03, MF-PRESET-04, MF-PRESET-05, MF-PREVIEW-01, MF-ACCEPT-01, MF-ACCEPT-02 |
| Q26 | MF-SCOPE-03, MF-PRESET-01, MF-PRESET-05, MF-REQUEST-02, MF-RETRY-02, MF-REVIEW-01, MF-HISTORY-01, MF-HISTORY-02, MF-CLIENT-04 |
| Q27 | MF-PRESET-06, MF-LIFE-01, MF-LIFE-04, MF-CANCEL-02, MF-REVIEW-03, MF-PREVIEW-01, MF-ACCEPT-01, MF-EDU-01 |
| Q28 | MF-INTAKE-01, MF-RESOURCE-01, MF-RESOURCE-02, MF-RESOURCE-05, MF-RESOURCE-06, MF-PREVIEW-02, MF-DELETE-03 |
| Q29 | MF-SCOPE-04, MF-ACCESS-06, MF-INTAKE-04, MF-INTAKE-05, MF-RESOURCE-01, MF-RESOURCE-02, MF-RESOURCE-04, MF-RESOURCE-05, MF-PREVIEW-01, MF-PREVIEW-02, MF-PREVIEW-03, MF-ACCEPT-03, MF-ACCEPT-04, MF-EDU-01 |
| Q30 | MF-REQUEST-05 |
| Q31 | MF-SCOPE-04, MF-RESOURCE-04, MF-LIFE-03, MF-LIFE-04, MF-LIFE-06, MF-CANCEL-02, MF-ACCEPT-03, MF-EDU-01 |
| Q32 | MF-ACCESS-02, MF-SUBMIT-01, MF-RESOURCE-03, MF-RETRY-01, MF-RETRY-02, MF-RETRY-03, MF-HISTORY-01, MF-HISTORY-02, MF-ACCEPT-03 |
| Q33 | MF-LIFE-04, MF-CANCEL-01, MF-CANCEL-02, MF-CANCEL-03, MF-DELETE-01, MF-ACCEPT-03 |
| Q34 | MF-SCOPE-04, MF-ACCESS-05, MF-ACCESS-06, MF-RESOURCE-05, MF-LIFE-01, MF-LIFE-04, MF-LIFE-05, MF-CANCEL-02, MF-ACCEPT-03, MF-EDU-01 |
| Q35 | MF-SCOPE-01, MF-PRESET-06, MF-REQUEST-02, MF-REQUEST-03, MF-REQUEST-04, MF-RESOURCE-03, MF-LIFE-02, MF-RETRY-02, MF-REVIEW-01, MF-HISTORY-02, MF-CLIENT-02, MF-ACCEPT-03 |
| Q36 | MF-REVIEW-02, MF-DELETE-02, MF-CLIENT-03, MF-ACCEPT-03 |
| Q37 | MF-SCOPE-03, MF-ACCESS-06, MF-PRESET-06, MF-REQUEST-04, MF-REVIEW-03, MF-PREVIEW-02, MF-PREVIEW-03, MF-DELETE-04, MF-CLIENT-03, MF-ACCEPT-03 |
| Q38 | MF-SCOPE-04, MF-ACCESS-04, MF-ACCESS-06, MF-INTAKE-02, MF-INTAKE-03, MF-SUBMIT-02, MF-SUBMIT-04, MF-PRESET-05, MF-REQUEST-02, MF-RESOURCE-06, MF-DELETE-03, MF-HISTORY-01, MF-HISTORY-02, MF-HISTORY-03, MF-HISTORY-04, MF-CLIENT-02, MF-CLIENT-04, MF-ACCEPT-03 |
| Q39 | MF-SCOPE-01, MF-CLIENT-01, MF-ACCEPT-01, MF-ACCEPT-02, MF-ACCEPT-03, MF-ACCEPT-04, MF-EDU-01 |
| Q40 | MF-ACCESS-05, MF-ACCESS-06, MF-INTAKE-01, MF-INTAKE-05, MF-SUBMIT-03, MF-LIFE-02, MF-LIFE-05, MF-CANCEL-03, MF-CLIENT-02, MF-CLIENT-03, MF-ACCEPT-03 |
| Q41 | MF-SCOPE-04, MF-ACCESS-03, MF-ACCESS-06, MF-INTAKE-05, MF-SUBMIT-01, MF-SUBMIT-03, MF-LIFE-01, MF-LIFE-06, MF-ACCEPT-03, MF-EDU-01 |
| Q42 | MF-SCOPE-03, MF-INTAKE-05, MF-RESOURCE-05, MF-ACCEPT-03 |
| Q43 | MF-SUBMIT-01, MF-SUBMIT-02, MF-SUBMIT-03, MF-SUBMIT-04, MF-RESOURCE-06, MF-RETRY-02, MF-HISTORY-03, MF-HISTORY-04, MF-CLIENT-03, MF-ACCEPT-03 |
| Q44 | MF-INTAKE-03, MF-INTAKE-04, MF-SUBMIT-02, MF-SUBMIT-04, MF-RESOURCE-01, MF-RESOURCE-06, MF-HISTORY-01, MF-HISTORY-03, MF-HISTORY-04, MF-CLIENT-04, MF-ACCEPT-03 |
| Q45 | MF-PRESET-02, MF-PRESET-03, MF-PRESET-04, MF-PRESET-05, MF-PRESET-06, MF-PREVIEW-01, MF-ACCEPT-01, MF-ACCEPT-02, MF-ACCEPT-03, MF-ACCEPT-04 |
| Q46 | MF-SCOPE-03, MF-RESOURCE-04, MF-PREVIEW-01, MF-PREVIEW-02, MF-PREVIEW-03, MF-ACCEPT-03 |
| Q47 | MF-ACCESS-03, MF-RESOURCE-05, MF-REVIEW-02, MF-REVIEW-03, MF-DELETE-01, MF-DELETE-02, MF-DELETE-03, MF-DELETE-04, MF-HISTORY-02, MF-ACCEPT-03 |
| Q48 | MF-ACCESS-04, MF-RESOURCE-06, MF-DELETE-03, MF-HISTORY-01, MF-HISTORY-02, MF-HISTORY-03, MF-CLIENT-03, MF-ACCEPT-03 |
| Q49 | MF-REQUEST-05, MF-LIFE-03, MF-LIFE-04, MF-LIFE-06, MF-RETRY-02, MF-RETRY-03, MF-CANCEL-02, MF-ACCEPT-03 |
| Q50 | MF-SCOPE-02, MF-SCOPE-03, MF-RESOURCE-01, MF-CLIENT-02, MF-ACCEPT-03 |
| Q51 | MF-SCOPE-03, MF-ACCESS-04, MF-INTAKE-02, MF-INTAKE-03, MF-RESOURCE-06, MF-REVIEW-01, MF-HISTORY-01, MF-CLIENT-04, MF-ACCEPT-03 |
| Q52 | MF-SCOPE-04, MF-CLIENT-01, MF-ACCEPT-01, MF-ACCEPT-02, MF-ACCEPT-03, MF-ACCEPT-04, MF-EDU-01 |
| Q53 | MF-RESOURCE-01, MF-RESOURCE-02, MF-RESOURCE-03, MF-RESOURCE-04, MF-RESOURCE-05, MF-LIFE-05, MF-PREVIEW-03, MF-DELETE-03, MF-CLIENT-03, MF-ACCEPT-03, MF-EDU-01 |
| Q54 | MF-ACCESS-01, MF-ACCESS-02, MF-INTAKE-02, MF-REQUEST-01, MF-RETRY-01, MF-CANCEL-01, MF-ACCEPT-03 |
| Q55 | MF-ACCESS-01, MF-ACCESS-06, MF-SUBMIT-04, MF-RESOURCE-05, MF-LIFE-05, MF-PREVIEW-03, MF-DELETE-01, MF-DELETE-04, MF-HISTORY-04, MF-ACCEPT-03 |


## 12. Consistency assessment, future evidence, and approval gate

**Unresolved product contradictions or essential product omissions identified:** None. Consolidation preserves all approved decisions and owner qualifications. No policy was invented to fill a gap. Apparent tensions are resolved by already approved distinctions:

- Deadline/stop intent versus evidence of termination, outcome and resource release.
- Historical verified completion versus current download/preview availability.
- Deletion access closure versus pending physical cleanup and later capacity credit.
- Seven-day action-reference recovery versus accepted identity/history and longer unresolved evidence protection. Reference expiry controls new action/replay authority; it does not itself abort or resolve previously admitted work.
- Unlimited-in-time media availability until authorized deletion versus explicit capacity/record limits and absence of archival guarantees.
- Three retries per original variant lineage versus separately intentional new resolved-work requests.
- Ninety-day history-only expiry versus dependency-pinned provenance while media/work remains.
- Accepted-request ordering and catalogue start order versus no prescribed parallelism.
- Operations provisional/evidence recovery versus Manager-only accepted-asset deletion.

Actual rendering reference files, their owner approval, demonstration fixtures, implementation, executed verification and final product acceptance remain future work. Their absence is not an unresolved product policy and must never be described as executed/passed evidence. Any contradiction discovered during later work must be reported explicitly rather than resolved by silently changing this contract.

**Readiness:** Product scope, actors, observable requirements, limits, recovery/concurrency rules and acceptance obligations are sufficient for Module Planning. **Authorization:** Module Planning is blocked until the Product Owner explicitly approves this `final-prd.md`. This document is awaiting that approval, regardless of prior discovery sign-off.

After PRD approval, Codex may author `module-plan.md` for separate owner approval. After that approval, proceed one approved module at a time through module-scoped Technical Discovery → `to-spec` → `to-tickets` → `implement` → verification. No whole-product Technical Discovery, frameworks/databases/processing libraries/platforms, architecture patterns, module specifications/tickets, tests or application code are selected/generated by this PRD.

**Final PRD owner approval:** Pending. Codex stops here for review.
