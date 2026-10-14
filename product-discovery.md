# MediaForge — V1 Product Discovery

Status: Product Discovery Q1–Q55 complete and formally approved; Final PRD authored for owner review; Final PRD approval pending.
Started: 2026-10-14.
Decision authority: The Product Owner is the final decision-maker.

## Sources and authority

- [Imported approved Project Charter](./project-charter.md), copied without changes from the [Handbook source](https://github.com/h3nrzi/nodejs-backend-engineering-handbook/blob/main/domains/03-nodejs-internals/projects/p02-mediaforge-asset-processing-charter.md).
- Import provenance: retrieved 2026-10-14; source revision `ff865378bcc0b084a082384a91f57609541c0d22`; [immutable Charter source](https://github.com/h3nrzi/nodejs-backend-engineering-handbook/blob/ff865378bcc0b084a082384a91f57609541c0d22/domains/03-nodejs-internals/projects/p02-mediaforge-asset-processing-charter.md); SHA-256 `44ea0c6c721962e7bc302dee5598deae34db1f7cf92cd42c26da6064b8ea4361`. The imported file matches that revision byte for byte. Status statements inside the Charter are preserved as source history; current discovery status is recorded here.
- The Charter is the approved educational direction and initial product boundary. Its import does not approve any new V1 recommendation, finalize a PRD, or authorize technical design.
- Repository instructions: `AGENTS.md` and `docs/agents/{issue-tracker,triage-labels,domain}.md`.
- Installed Matt Pocock skills inspected through their names/descriptions and `skills-lock.json`. The invoked [grill-with-docs](./.agents/skills/grill-with-docs/SKILL.md) composes [grilling](./.agents/skills/grilling/SKILL.md) and [domain-modeling](./.agents/skills/domain-modeling/SKILL.md); their instructions were read.

## Discovery rules

- Ask all currently independent product decisions together. Questions that depend on unanswered decisions wait for a later round.
- Every recommendation remains proposed until the Product Owner explicitly accepts it. Silence is not approval. A numbered “yes” accepts that question's stated recommendation only; “approve all recommendations” for a named round accepts that round only.
- Record the owner's response and the exact approved scope for each decision. Preserve superseded decisions and their replacement links rather than silently rewriting history.
- Resolve ambiguous or conflicting answers before treating them as settled. Any departure from the Charter boundary requires explicit owner approval.
- Capture settled product terminology in `GLOSSARY.md` as it emerges. No architecture ADRs during discovery.
- Complete discovery and obtain confirmation of shared understanding before generating `final-prd.md`. Generate `module-plan.md` only after owner approval of the consolidated Final PRD. Module-scoped Technical Discovery follows approval of the Module Plan.
- No architecture, specifications, tickets, implementation, library choices, storage choices, or process-model decisions in this phase.

## Educational direction to preserve

The Charter identifies D03-C03–C04, C06–C12, and C14–C18 as potential learning coverage. Product discovery should create meaningful cases involving derived bytes, asynchronous work, resource boundaries, attribution, interruption, and diagnosis. These are educational motivations, not implementation prescriptions or evidence of mastery. Numeric operating limits and acceptance evidence must be agreed rather than invented.

## Approved discovery decisions

The Product Owner explicitly stated: “I explicitly approve all seven recommendations, Q1–Q7, as proposed.” Approval recorded on 2026-10-14. Original questions, recommendations, and alternatives are preserved below.

- **Q1:** V1 serves a small creative/editorial team preparing owned media for publication.
- **Q2:** V1 supports JPEG and PNG still-image sources only.
- **Q3:** One private, manager-controlled workspace without public signup or anonymous asset access.
- **Q4:** User-supplied file uploads only; remote fetching and third-party imports are deferred.
- **Q5:** Each processing request handles one source and one or more published presets, with an individually visible outcome for every requested variant.
- **Q6:** Verified complete outputs are immediately retrievable by authorized users. Editorial selection is recorded separately and does not gate retrieval.
- **Q7:** Sources and completed outputs remain available until explicitly deleted by an authorized user, subject to workspace limits, without automatic expiration.

**Q7 clarification:** No unlimited storage or permanent archival guarantee. At Round 1 approval, capacity limits, storage exhaustion, deletion rules, and related policies remained open. Round 2 subsequently settled their initial boundaries; the owner-preserved unresolved details below remain open. Round 1 approval did not itself approve Round 2 recommendations.


**Round 2 approval:** The Product Owner explicitly stated: “I explicitly approve all fourteen recommendations, Q8–Q21, exactly as proposed, including their numeric limits, qualifications, and deferred policy details.” Recorded on 2026-10-14.

- **Q8:** All admitted workspace members can inspect shared sources, processing requests, outcomes, and completed outputs. Visibility does not imply modification permission.
- **Q9:** Adopt the proposed combinable Contributor, Reviewer, Operations, and Manager responsibilities and action permissions. Management does not automatically grant other responsibilities.
- **Q10:** Offer exactly two fixed presets: Web JPEG and Web PNG, following the proposed 1600 × 1600 bounding rules, orientation normalization, no upscaling/cropping, JPEG quality 85, white transparency flattening, and PNG transparency preservation.
- **Q11:** Omit nonessential embedded metadata from derived outputs while preserving necessary rendering information and original source bytes.
- **Q12:** Each accepted upload creates a distinct immutable source identity, including identical re-uploads.
- **Q13:** Complete content-based validation before accepting a source for processing.
- **Q14:** Require and record an ownership-or-permission declaration for each submission without automated rights verification.
- **Q15:** Apply inclusive source limits of 20 MiB, 40 million pixels, and 12,000 pixels per dimension.
- **Q16:** Apply a 1 GiB retained-media workspace allowance without automatic eviction, including retained sources, outputs, and previews. Preserve existing assets when capacity is insufficient.
- **Q17:** Limit outstanding processing requests to 20 per workspace and 5 per submitting member.
- **Q18:** Distinguish waiting, processing, verified complete, failed, cancelled, and uncertain outcomes for each variant. Do not invent progress percentages, ETAs, or cancellation success.
- **Q19:** Provide previews and metadata for completed outputs, with independent, reversible usable selections. Allow multiple selections, initially none.
- **Q20:** Support individual-output deletion and source-plus-derived-output deletion, preserving minimal non-media history. Block deletion when related unresolved work makes it unsafe.
- **Q21:** Deliver V1 as a backend service with a documented client demonstrating all required product workflows; defer a custom browser UI.

**Owner-preserved unresolved areas after Round 2:**

- Exact capacity admission behavior and temporary-resource boundaries.
- Color fidelity, pixel rounding, and preset-version provenance.
- Request lifecycle, timeout, retry, cancellation, and reconciliation rules.
- Concurrent editorial selections and deletion interactions.
- Minimal history fields and retention policy.
- Acceptance expectations for the documented client.

At Round 2 approval these areas remained unresolved except where an earlier approved recommendation established a boundary. Round 3 subsequently settled the policies recorded below; its deferred details remain open. Round 2 approval did not itself approve Round 3 recommendations or authorize technical architecture choices.


**Round 3 approval:** The Product Owner explicitly stated: “I explicitly approve all twenty recommendations, Q22–Q41, exactly as proposed, including their numerical limits, trade-offs, qualifications, and deferred policy details.” Recorded on 2026-10-14.

- **Q22:** Membership or responsibility removal revokes future authority without automatically cancelling accepted work. Preserve attribution and prevent removal or demotion of the last Manager.
- **Q23:** Distinguish same-attempt recovery from intentional new work. Reject changed payloads under reused references, duplicate or unknown presets, and overlapping unresolved source/preset work.
- **Q24:** Apply the proposed proportional scaling and pixel-rounding formula, without enlargement, cropping, or borders.
- **Q25:** Normalize supported color interpretation to sRGB and 8-bit outputs. Reject unsupported or ambiguous interpretations, including unprofiled CMYK.
- **Q26:** Bind requests to immutable Web JPEG v1 and Web PNG v1 preset revisions and effective settings.
- **Q27:** Require verification of actual retained deliverables before reporting completion. Preserve immutable output identity and distinguish failed from uncertain verification.
- **Q28:** Count each retained logical media file by its actual byte length against the inclusive 1 GiB workspace allowance, including retained previews.
- **Q29:** Apply the proposed limits: four unfinished uploads per workspace, one per member, 256 MiB temporary media per active operation, 512 MiB temporary media workspace-wide, 32 MiB per final output, and 1 MiB per preview.
- **Q30:** Start eligible requests in acceptance order, allow bypassing currently ineligible work, and process selected presets in published catalogue order.
- **Q31:** Apply ten-minute waiting and two-minute processing deadlines per variant, without automatic retries. Do not fabricate definitive failure from uncertain timeout outcomes.
- **Q32:** Allow manual selective retries only for known failed or confirmed cancelled variants, up to three accepted retries per originally requested variant, preserving lineage and admission limits.
- **Q33:** Cancellation targets unresolved variants of the specified request, preserving completed outputs and independently linked retry requests. Cancellation intent is not confirmation of cancellation.
- **Q34:** Resolve uncertain outcomes only using evidence. Preserve uncertainty and its capacity/overlap/deletion consequences when evidence remains insufficient; do not introduce forced outcomes or guaranteed reconciliation times.
- **Q35:** Derive request summaries from individual variant outcomes, expose partial success immediately, and preserve historical results independently of later availability.
- **Q36:** Reject stale editorial selection changes and preserve correct attribution across concurrent actions and deletion.
- **Q37:** Keep preview and output availability separate from historical processing completion. Do not silently regenerate, replace, or restore missing or damaged outputs.
- **Q38:** Preserve minimum necessary provenance while related media or unresolved work exists, followed by 90 days of history-only retention after those dependencies end.
- **Q39:** Require reproducible documented-client acceptance using actual actors, assets, authorized and denied operations, failures, boundaries, and recovery scenarios.
- **Q40:** Provide actionable and accurate feedback distinguishing refusals, accepted actions, uncertain outcomes, and safe recovery options.
- **Q41:** Preserve accepted identities and confirmed outcomes through service interruptions. Do not automatically create duplicate attempts or invent terminal processing outcomes.

**Important approval boundaries, preserved from the Product Owner:**

1. **Q25:** Color compatibility establishes product behavior, not a choice of image-processing library.
2. **Q29:** Numeric limits are product boundaries, not measured hosting or Node.js performance guarantees.
3. **Q31:** Deadline expiry does not automatically establish that processing stopped or failed.
4. **Q32:** Retry limits apply to the original variant's retry lineage; repeated acknowledgment recovery must not consume another attempt.
5. **Q34:** Indeterminate work may remain unresolved and continue occupying capacity until reliable evidence becomes available.
6. **Q38:** The 90-day history period begins only after related media is gone and work is resolved; it does not introduce automatic media expiration.
7. **Q41:** Interrupted work must be reconciled based on evidence rather than assumed success or failure.

Round 3 approval does not approve Round 4 recommendations. Deferred details remain open until explicitly decided.


**Round 4 approval:** The Product Owner explicitly stated: “I explicitly approve all fourteen recommendations, Q42–Q55, exactly as proposed, including their numerical limits, qualifications, alternatives, and deferred details.” Recorded on 2026-10-14.

- **Q42:** Five-minute whole-submission deadline, including reception and validation. No resumable uploads. Do not release uncertain upload slots or temporary allowance before cleanup is confirmed.
- **Q43:** Seven-day same-attempt submission-reference recovery, bound to actor, action, and original inputs. Expired or previously refused references cannot create new effects.
- **Q44:** Workspace limits of 5,000 source records, 10,000 processing-request records, and 10,000 required submission-attempt records. Apply the proposed inclusive text-field limits and preserve required history.
- **Q45:** Adopt the complete structural and visual-fidelity acceptance rubric, including example dimensions, PNG sample fidelity, JPEG interior-patch tolerance of ±8, and separately approved visual reference artifacts where required.
- **Q46:** One best-effort 400 × 400 PNG preview per completed output, with a 30-second generation deadline, no enlargement or cropping, and no automatic regeneration.
- **Q47:** Separate immediate closure of future access from confirmed physical cleanup. Preserve deletion-pending states, correct race ordering, attribution, and capacity accounting.
- **Q48:** Retain linked provenance while required by media, unresolved work, and retry lineage. Start the 90-day history-only period only after all dependencies end.
- **Q49:** Include downtime in existing deadlines; never reset clocks during recovery. Multi-variant retry admission is all-or-nothing, with independent sibling outcomes.
- **Q50:** Bounded listings with 50 records per page by default and 100 maximum, stable continuation, approved exact filters, and live permission checks.
- **Q51:** Keep original submission facts immutable. Defer custom metadata editing, renaming, descriptions, tags, and annotations.
- **Q52:** Adopt the complete proposed product acceptance matrix covering valid and invalid workflows, roles, concurrency, failures, uncertainty, recovery, deletion, retention, and retrieval.
- **Q53:** Release workload slots and temporary/retained allowances only when their obligations are known to have ended. Keep uncertain usage visible and recovery available.
- **Q54:** Any Contributor may process a shared accepted source. Request ownership belongs to the submitting Contributor, not necessarily the source uploader.
- **Q55:** Operations may inspect and reconcile unfinished intake, preview attempts, and temporary cleanup without bypassing Manager permissions, forcing results, or creating additional work.

**Important Round 4 boundaries, preserved from the Product Owner:**

1. Deadline expiry does not prove inactivity, failure, cancellation, or completed cleanup.
2. Accepted deletion blocks new access, but physical cleanup and capacity release require separate confirmation.
3. Previously accepted downloads may finish under the approved deletion policy.
4. Preview failure must not invalidate an otherwise verified completed output.
5. Reference expiry must never turn replay into a new mutation.
6. History retention must preserve necessary provenance without storing media bytes solely for history.
7. Acceptance examples and visual reference artifacts do not imply that tests have already been executed or approved.
8. Operational reconciliation must not become an unauthorized retry, forced terminal outcome, or general asset-deletion capability.

All Q1–Q55 are explicitly approved. Final Product Discovery sign-off was subsequently given on 2026-10-14, as recorded below. The separate Final PRD and Module Plan approval gates remain in force.

## Round 1 — Independent product foundations

All seven questions have only the approved Charter as their prerequisite. Detailed choices such as exact presets, permissions, limits, retry units, and deletion behavior depend on these answers and are deliberately held for later rounds.

### Q1 — Primary user and job to be done

Should V1 primarily serve a small creative/editorial team preparing owned media for publication, with contributors requesting variants and reviewers choosing usable results?

**Recommendation:** Yes. Optimize for that team workflow; one person may perform several of the Charter's responsibilities. This does not yet settle permission rules or separate user roles.

**Alternatives and trade-offs:** A solo creator reduces collaboration needs but offers less evidence for handoff and review. A processing desk for other software emphasizes automated consumption and changes the primary user experience. A professional media operations team brings stronger expectations around formats, control, and throughput, increasing discovery scope.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q1 — Yes: V1 serves a small creative/editorial team preparing owned media for publication.” **Approved decision:** The original recommendation above, accepted as proposed; V1 serves a small creative/editorial team preparing owned media for publication.

### Q2 — Initial media family

Should V1 support still images only, starting with JPEG and PNG source files, with audio, video, animation, and vector input deferred?

**Recommendation:** Yes. This gives a bounded set of publishing use cases and still allows meaningful derived-output, resource, and failure scenarios. Exact presets and output formats remain open.

**Alternatives and trade-offs:** Video only gives richer duration and cancellation scenarios but substantially expands format and acceptance cases. Audio only focuses on listening deliverables rather than visual publishing. Multiple media families increase usefulness and multiply validation, preset, and review policies. Choosing images narrows the initial learning surface; later evidence must still challenge the Charter's runtime learning objectives honestly.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q2 — Yes: V1 supports JPEG and PNG still-image sources only.” **Approved decision:** The original recommendation above, accepted as proposed; V1 supports JPEG and PNG still-image sources only.

### Q3 — Workspace and access boundary

Should V1 serve one private, manager-controlled workspace, with access limited to admitted users and no public signup or anonymous access to source/output assets?

**Recommendation:** Yes. Establish a clear private collaboration boundary first. This does not settle whether every member may see every asset, how users authenticate, or who may retry, cancel, or delete.

**Alternatives and trade-offs:** Multiple private workspaces add useful separation but require cross-workspace isolation acceptance cases. A personal private desk simplifies access but reduces team workflow coverage. Public sharing adds distribution convenience and requires separate exposure, revocation, and abuse policies; it would need explicit scope approval.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q3 — Yes: One private, manager-controlled workspace without public signup or anonymous asset access.” **Approved decision:** The original recommendation above, accepted as proposed; One private, manager-controlled workspace without public signup or anonymous asset access.

### Q4 — Source intake channels

Should V1 accept user-supplied files only, with remote URL fetching and third-party imports deferred?

**Recommendation:** Yes. File submission creates a clear ownership and validation boundary without remote-source availability questions. This does not settle file limits, duplicate treatment, metadata, rights declarations, or incomplete-submission behavior.

**Alternatives and trade-offs:** URL intake reduces manual file handling but adds unreachable, changing, redirected, and inaccessible-source cases. Supporting both channels is more convenient but requires two intake policies and broader acceptance evidence. Third-party imports are already deferred by the Charter.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q4 — Yes: User-supplied file uploads only; remote fetching and third-party imports are deferred.” **Approved decision:** The original recommendation above, accepted as proposed; User-supplied file uploads only; remote fetching and third-party imports are deferred.

### Q5 — Processing request scope

Should a processing request cover exactly one source asset and one or more published presets, with a separate visible outcome for every requested variant?

**Recommendation:** Yes. A contributor can request several publication variants together and see that two succeeded while one failed. This approves only the product grouping and per-variant visibility; retry eligibility, duplicate preset handling, request summaries, and cancellation behavior remain open.

**Alternatives and trade-offs:** Exactly one preset per request simplifies the request result but makes a set of publication variants harder to follow. Multiple sources per request ease bulk submission but add source-by-preset partial outcomes and more complicated recovery policies.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q5 — Yes: Each processing request handles one source and one or more published presets, with an individually visible outcome for every requested variant.” **Approved decision:** The original recommendation above, accepted as proposed; Each processing request handles one source and one or more published presets, with an individually visible outcome for every requested variant.

### Q6 — Meaning of review and selection

Should verified complete outputs be retrievable immediately by authorized users, while reviewers can explicitly mark usable variants without a mandatory approval gate?

**Recommendation:** Yes. Keep processing completion separate from editorial suitability: a valid output may still be unsuitable for publication. A usable marker records a review choice, not a guarantee that an external publication happened. Detailed selection rules remain open.

**Alternatives and trade-offs:** Review without a recorded selection is smaller but loses the visible choice of final usable variants described by the Charter. Mandatory approval before retrieval provides stronger editorial control but introduces reviewer permissions, blocking, and reversal cases and approaches the Charter's deferred professional approval workflows.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q6 — Yes: Verified complete outputs are immediately retrievable by authorized users. Editorial selection is recorded separately and does not gate retrieval.” **Approved decision:** The original recommendation above, accepted as proposed; Verified complete outputs are immediately retrievable by authorized users. Editorial selection is recorded separately and does not gate retrieval.

### Q7 — Asset lifetime policy

Should V1 keep accepted sources and completed outputs until an authorized user explicitly deletes them, within agreed workspace limits, with no automatic expiry?

**Recommendation:** Yes. This avoids an unexpected disappearance during review and retrieval. It is not a long-term archive guarantee. Capacity limits, deletion authority, active-request conflicts, provenance after deletion, and behavior when capacity is exhausted must be agreed in later rounds.

**Alternatives and trade-offs:** A published expiry period bounds accumulation but requires expiry visibility and rules for active work and near-expiry retrieval. User-selected retention adds flexibility but expands policy choices. Automatic removal when capacity is exhausted risks losing deliverables unexpectedly and would require explicit prioritization and notice rules.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q7 — Yes: Sources and completed outputs remain available until explicitly deleted by an authorized user, subject to workspace limits, without automatic expiration.” **Approved decision:** The original recommendation above, accepted as proposed; Sources and completed outputs remain available until explicitly deleted by an authorized user, subject to workspace limits, without automatic expiration.

**Owner clarification:** “This approval does not establish unlimited storage or permanent archival guarantees. Workspace capacity limits, storage exhaustion behavior, deletion rules, and related product policies remain open for subsequent Product Discovery.”

## Round 2 — Product behavior and policy frontier

**Status:** Explicitly approved by the Product Owner on 2026-10-14. Original Round 2 proposals are preserved below.

These questions depend on approved Round 1 decisions and the Charter, not on another unanswered Round 2 question. Where policies interact, each question establishes its own rule; their intersections will be tested after the rules are approved. Numbered “yes” accepts the entire stated recommendation for that question, including its numbers and explicit exclusions. Partial approval or amended values are welcome and will be recorded exactly.

### Q8 — Asset visibility

**Settled prerequisites:** Q1, Q3.

Should every admitted workspace member be able to list and inspect all workspace sources, requests, outcomes, and completed outputs?

**Recommendation:** Yes. Use shared team visibility within the private workspace. No per-asset private collections in V1. Visibility does not itself grant permission to change or delete anything.

**Alternatives and trade-offs:** Owner-only visibility protects individual submissions but complicates editorial handoff. Per-asset sharing offers finer control but adds grants, revocation, and inaccessible-result cases.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q8 — Yes: All admitted workspace members can inspect shared sources, processing requests, outcomes, and completed outputs. Visibility does not imply modification permission.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q9 — Action permissions

**Settled prerequisites:** Q1, Q3, Q6, Q7.

Should V1 use assignable, combinable contributor, reviewer, operations, and manager responsibilities with the following action permissions, within whatever visibility policy is approved?

**Recommendation:** Yes. Contributors upload and create requests, and may retry or request cancellation of their own requests when eligible. Reviewers record and reverse editorial selections. Operations users may retry or request cancellation of any eligible request. Managers admit/remove members, assign responsibilities, and delete sources or outputs. Every member may inspect and retrieve assets they are allowed to access. A person may hold multiple responsibilities. Manager responsibility does not implicitly grant contributor/reviewer/operations actions; those can also be assigned. Removing membership blocks subsequent workspace access and actions; it does not erase previously downloaded files.

**Alternatives and trade-offs:** All members having all actions is simpler but allows accidental deletion and interference. Ownership-only control reduces interference but makes operational recovery harder. More granular custom permissions expand V1 policy and acceptance scope. Eligibility and effects of retry/cancellation remain open.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q9 — Yes: Adopt the proposed combinable Contributor, Reviewer, Operations, and Manager responsibilities and action permissions. Management does not automatically grant other responsibilities.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q10 — Published preset catalogue

**Settled prerequisites:** Q1, Q2, Q5.

Should V1 publish exactly two fixed presets: Web JPEG and Web PNG, each fitting the full image within a 1600 × 1600 pixel box without enlargement or cropping?

**Recommendation:** Yes. Preserve aspect ratio and normalize the visible orientation before resizing. Web JPEG produces JPEG at a published quality setting of 85/100, flattening transparency onto white. Web PNG produces PNG and preserves transparency when present. Users cannot override preset parameters. Publication suitability remains an editorial judgment; quality 85 is a preset setting, not a promise of equal perceived quality across images. Exact rounding, color-fidelity expectations, and preset-change provenance need later acceptance decisions.

**Alternatives and trade-offs:** A single PNG preset simplifies output policy but can produce larger photographic files. Adding thumbnails or square crops supports more placements but introduces crop choices and further acceptance cases. Editable dimensions and quality offer flexibility but weaken the small, published-preset boundary.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q10 — Yes: Offer exactly two fixed presets: Web JPEG and Web PNG, following the proposed 1600 × 1600 bounding rules, orientation normalization, no upscaling/cropping, JPEG quality 85, white transparency flattening, and PNG transparency preservation.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q11 — Embedded metadata privacy

**Settled prerequisites:** Q2, Q6.

Should derived outputs omit embedded camera/location, author, descriptive, and other nonessential source metadata, while the source file remains unchanged?

**Recommendation:** Yes. Strip nonessential embedded metadata from deliverables; retain only information needed for correct decoding and agreed visual fidelity. Workspace provenance must remain available separately. This is not a promise to detect or remove sensitive information visible in the image itself. Rules for color information and exact output verification follow later.

**Alternatives and trade-offs:** Copying all metadata improves continuity but can expose location or personal information in downloads. User-selectable preservation offers control but adds policies and output variants. Removing essential rendering information as well could change the intended appearance.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q11 — Yes: Omit nonessential embedded metadata from derived outputs while preserving necessary rendering information and original source bytes.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q12 — Source identity and reuse

**Settled prerequisites:** Q2, Q4, Q5, Q7.

Should every accepted upload create a distinct, immutable source identity that can be reused for multiple processing requests?

**Recommendation:** Yes. Re-uploading identical bytes still creates a separate source identity; matching filenames do not mean replacement. To change image content, upload a new source. The original filename is descriptive, not its identity. This defines user-visible identity and does not prescribe how identical bytes are stored.

**Alternatives and trade-offs:** Replacing sources in place is convenient but can make old outputs appear to come from changed content. Merging duplicate submissions reduces visible clutter but raises ownership, metadata, and deletion ambiguity.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q12 — Yes: Each accepted upload creates a distinct immutable source identity, including identical re-uploads.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q13 — Validation and incomplete intake

**Settled prerequisites:** Q2, Q4, Q5.

Should a source become available for processing only after its complete contents pass the supported-file and intake-limit checks?

**Recommendation:** Yes. Accept actual JPEG/PNG still-image content, not a filename alone. Reject corrupt, truncated, animated/multiple-frame, unsupported, or over-limit inputs with a readable reason. Treat a misleading filename or declared type as advisory: valid supported contents determine the accepted format. Rejected or interrupted submissions are not accepted sources and cannot create processing requests; the user may submit again. Exact limit values are a separate decision.

**Alternatives and trade-offs:** Accepting first and discovering invalid content during processing shortens intake feedback but leaves unusable sources and avoidable requests. Requiring exact filename/type agreement is stricter but rejects valid files that users can safely identify by contents.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q13 — Yes: Complete content-based validation before accepting a source for processing.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q14 — Rights declaration

**Settled prerequisites:** Q1, Q4 and Charter owned-source boundary.

Should each submission require the contributor to affirm ownership or permission to process and use the image, without automated rights enforcement?

**Recommendation:** Yes. Record that affirmation with the contributor and submission. It is a user declaration, not a verified legal conclusion, license-management feature, or automated copyright check.

**Alternatives and trade-offs:** A general workspace policy requires fewer repeated actions but makes submission-specific accountability weaker. Evidence upload and license verification add administration and move toward rights-management scope beyond the Charter.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q14 — Yes: Require and record an ownership-or-permission declaration for each submission without automated rights verification.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q15 — Source size boundaries

**Settled prerequisites:** Q2, Q4.

Should the published V1 source limits be 20 MiB per file, 40 million pixels per image, and 12,000 pixels on either dimension, inclusive at each boundary?

**Recommendation:** Yes. An upload must meet all three limits; reject it if any is exceeded. These are proposed product admission limits for a bounded first release, not measured throughput or safety guarantees. Later acceptance evidence must cover exact-boundary and just-over-boundary cases.

**Alternatives and trade-offs:** Lower limits reduce the range of editorial source material. Higher limits support larger photographs and artwork but increase processing pressure and the range of failure demonstrations. File bytes alone do not bound image dimensions.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q15 — Yes: Apply inclusive source limits of 20 MiB, 40 million pixels, and 12,000 pixels per dimension.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q16 — Workspace capacity and exhaustion

**Settled prerequisites:** Q3, Q7 and explicit Q7 clarification.

Should V1 have a published 1 GiB workspace allowance for retained media, with no automatic eviction when it fills?

**Recommendation:** Yes. Count retained sources, outputs, and any retained media previews toward the allowance; show used and available capacity. Refuse an upload or new request when known capacity requirements cannot fit, with actionable capacity feedback. If an accepted transformation later cannot retain a deliverable within the allowance, show a capacity-related failure for that deliverable and preserve existing sources and completed outputs. Users free capacity through authorized deletion. Capacity is not a promise that every admitted request will finish; exact admission accounting and temporary-resource boundaries remain open.

**Alternatives and trade-offs:** A larger allowance delays cleanup but increases retained-media obligations. Automatic eviction frees space but contradicts predictable availability until explicit deletion and would require changing Q7. An unlimited allowance would remove a necessary V1 boundary.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q16 — Yes: Apply a 1 GiB retained-media workspace allowance without automatic eviction, including retained sources, outputs, and previews. Preserve existing assets when capacity is insufficient.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q17 — Outstanding workload limits

**Settled prerequisites:** Q1, Q3, Q5.

Should V1 admit at most 20 processing requests awaiting a final, resolved outcome across the workspace, and at most 5 per submitting member?

**Recommendation:** Yes. A request counts once regardless of its preset count. Unresolved uncertainty continues to count until resolved. If admitting a request would exceed either limit, refuse it clearly rather than silently deferring submission; keep existing requests intact. These are admission limits, not a choice of parallelism or a completion-time SLA. Request ordering and exact resolution rules remain open.

**Alternatives and trade-offs:** Lower limits make overload easier to manage but restrict collaboration. Higher limits permit more bursts while increasing delay and interruption cases. Workspace-only limits are simpler but allow one contributor to occupy all available work slots.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q17 — Yes: Limit outstanding processing requests to 20 per workspace and 5 per submitting member.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q18 — Observable variant outcomes and progress

**Settled prerequisites:** Q5 and Charter honest-outcome requirement.

Should each requested variant distinguish waiting, processing, verified complete, failed, cancelled, and uncertain outcomes, with progress shown only when it is trustworthy?

**Recommendation:** Yes. Waiting means accepted work has not begun; processing means work is underway; verified complete requires a retrievable deliverable matching its preset. Failed means a known unsuccessful outcome; cancelled means the product can confirm that variant will not deliver a new output from that work. Uncertain means the product cannot establish the result yet and must not claim success, failure, or confirmed cancellation. A cancellation request alone does not prove cancellation. Show a percentage only when meaningful; otherwise show truthful status without an invented percentage or ETA. Aggregate request summaries, timeout rules, transitions, and reconciliation remain later decisions.

**Alternatives and trade-offs:** A binary done/not-done view obscures failure and cancellation. Treating uncertainty as failure makes summaries simpler but can lead users to repeat work whose result already exists. Always displaying a percentage implies precision the product may not have.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q18 — Yes: Distinguish waiting, processing, verified complete, failed, cancelled, and uncertain outcomes for each variant. Do not invent progress percentages, ETAs, or cancellation success.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q19 — Review evidence and selection granularity

**Settled prerequisites:** Q2, Q5, Q6.

Should completed variants offer a visual preview plus format, dimensions, byte size, and source/preset provenance, with independent, reversible usable marks on any number of variants?

**Recommendation:** Yes. No variant is selected by default. A reviewer can mark or unmark a completed variant without changing processing completion or download eligibility. Record who last changed each mark and when. This allows several publication sizes/formats to be usable simultaneously. Preview failures must not falsely imply that a valid downloadable output failed; detailed preview and concurrent-review behavior remain open.

**Alternatives and trade-offs:** Metadata-only review reduces scope but cannot reveal visual defects. One winning variant per source simplifies final selection but conflicts with using multiple publication variants. A mandatory approval chain introduces the professional approval workflow deferred by the Charter.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q19 — Yes: Provide previews and metadata for completed outputs, with independent, reversible usable selections. Allow multiple selections, initially none.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q20 — Deletion and historical traceability

**Settled prerequisites:** Q3, Q5, Q6, Q7.

Should authorized users be able to delete an individual output, or delete a source together with all its derived outputs, while retaining minimal readable request history?

**Recommendation:** Yes. Source deletion requires an explicit warning that it removes derived outputs too. Block source deletion while any related work has no final, resolved outcome; block output deletion while unresolved work may still alter its outcome. Individual output deletion retains the source and other outputs. Remove retrieval/preview access to deleted media and show it as deleted in history, including any former editorial selection. Retain source identity, preset provenance, actors/timestamps, and outcome/deletion facts; do not retain media bytes merely for history. Deletion cannot revoke files already downloaded. Detailed history limits and simultaneous-action behavior remain open.

**Alternatives and trade-offs:** Keeping outputs after source deletion preserves deliverables but gives users a less intuitive deletion boundary. Erasing all request history reduces traceability and makes missing outputs harder to explain. Cancelling active work and deleting immediately adds races and uncertain-result policies.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q20 — Yes: Support individual-output deletion and source-plus-derived-output deletion, preserving minimal non-media history. Block deletion when related unresolved work makes it unsafe.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

### Q21 — V1 delivery and demonstration scope

**Settled prerequisites:** Q1 and educational Charter.

Should V1 be a backend service whose contributor, reviewer, operations, and manager workflows can be demonstrated through a documented client, with a custom browser UI deferred?

**Recommendation:** Yes. Acceptance must still demonstrate the complete human-facing product actions, readable outcomes, approved review evidence, and retrieval; a browser application is not a V1 deliverable. This decides product delivery scope only. It does not select protocols, frameworks, client tools, deployment, or architecture.

**Alternatives and trade-offs:** A complete browser desk makes the workflow easier for editorial users to try but adds frontend scope beyond the backend learning project. Demonstrating internal processing alone is smaller but would fail to establish the required end-to-end product behavior.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q21 — Yes: Deliver V1 as a backend service with a documented client demonstrating all required product workflows; defer a custom browser UI.” **Approved decision:** The full original recommendation above, including its numeric values, qualifications, and deferred policy details, accepted exactly as proposed.

## Round 3 — Detailed behavior, recovery, and acceptance frontier

**Status:** Explicitly approved by the Product Owner on 2026-10-14. Original Round 3 proposals are preserved below.

Each question depends only on the Charter and explicitly approved Rounds 1–2. Related proposals are designed to coexist but do not presume each other's approval; amended answers will reshape later interaction questions. Numbers in this round are proposed product boundaries, not measured service capability or architecture choices. A “yes” accepts the full recommendation for that question. No response or prior-round approval implies acceptance.

### Q22 — Membership changes and admitted work

**Settled prerequisites:** Q9, Q17.

Should membership or responsibility removal affect future actions without implicitly cancelling already accepted work?

**Recommendation:** Yes. Permission is checked when an action takes effect, not merely when an asset was first viewed. Removing a member or Contributor responsibility blocks new contributor actions; previously admitted work keeps its source, attribution, and outstanding-work accounting until it resolves. Operations may address that work. The manager must separately request cancellation through an assigned Operations responsibility if cancellation is desired. Prevent removal or demotion of the last admitted Manager so the workspace cannot lose all management authority.

**Alternatives and trade-offs:** Automatically cancelling on removal reduces continued activity but conflates access changes with processing policy. Allowing previously opened clients to keep acting weakens revocation. Allowing the last manager to leave requires a separate recovery/bootstrap policy.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q22 — Yes: Membership or responsibility removal revokes future authority without automatically cancelling accepted work. Preserve attribution and prevent removal or demotion of the last Manager.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q23 — Submission intent, duplicate presets, and overlapping work

**Settled prerequisites:** Q5, Q10, Q12, Q17, Q18.

Should submissions distinguish safe repetition of the same attempt from an intentional new upload or processing request?

**Recommendation:** Yes. A documented submission reference lets a caller recover or repeat the same upload/request attempt without creating duplicate accepted records or consuming admission slots twice; reusing that reference with changed content or parameters is rejected. Deliberate new uploads retain their distinct identities, even for identical files. A request contains one or both distinct published presets; repeated or unknown presets cause rejection of the whole request. Reject a new request if any selected source/preset already has unresolved work, and identify the existing request. Deliberate new requests for resolved source/preset work are allowed and have new identities. Exact submission-reference recovery lifetime follows the history-policy decision; no new records may be silently created merely because recovery is uncertain.

**Alternatives and trade-offs:** Blind resubmission is simpler but can duplicate work after a lost acknowledgement. Merging all similar requests obscures intentional reruns. Allowing concurrent identical source/preset work gives flexibility but increases accidental duplication and uncertain-result recovery cases.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q23 — Yes: Distinguish same-attempt recovery from intentional new work. Reject changed payloads under reused references, duplicate or unknown presets, and overlapping unresolved source/preset work.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q24 — Exact pixel dimensions

**Settled prerequisites:** Q10.

Should dimensions use a published proportional scale and nearest-integer rounding after visible orientation is applied?

**Recommendation:** Yes. For oriented source dimensions W and H, use s = min(1, 1600/W, 1600/H). Each output dimension is its scaled dimension rounded to the nearest whole pixel, with exact halves rounded upward and a minimum of one pixel. Both dimensions stay within 1600; a source already within bounds keeps its oriented dimensions. Aspect-ratio differences are limited to unavoidable whole-pixel rounding. For example, 4000 × 3000 becomes 1600 × 1200. No crop or added border.

**Alternatives and trade-offs:** Always rounding down is predictable but may deviate farther from the proportional target. Stretching to exactly 1600 × 1600 distorts the image and would change Q10. Preserving fractional dimensions is not a usable output contract.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q24 — Yes: Apply the proposed proportional scaling and pixel-rounding formula, without enlargement, cropping, or borders.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q25 — Color and precision compatibility

**Settled prerequisites:** Q2, Q10, Q11.

Should publication outputs use standard sRGB appearance and 8-bit color channels, with unsupported source-color interpretation rejected clearly?

**Recommendation:** Yes. Honor valid source color information and visible orientation; normalize outputs to sRGB with necessary rendering information, preserving PNG transparency and applying the approved white background for JPEG. Untagged RGB/grayscale inputs are interpreted as sRGB. Reduce supported higher-precision inputs to 8-bit output channels; make no promise of archival precision or pixel-identical color values. Reject inputs whose color interpretation cannot be established or converted, including unprofiled CMYK, instead of guessing. This explicitly adds a color-compatibility restriction to the JPEG/PNG intake policy. Later acceptance must approve representative color/precision reference cases and tolerances; this does not choose a conversion algorithm or library.

**Alternatives and trade-offs:** Preserving every source color space and precision improves fidelity options but broadens publishing compatibility and verification. Guessing ambiguous color interpretation accepts more files but risks visibly incorrect output. Supporting only untagged RGB is smaller but rejects ordinary profiled material.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q25 — Yes: Normalize supported color interpretation to sRGB and 8-bit outputs. Reject unsupported or ambiguous interpretations, including unprofiled CMYK.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q26 — Preset revisions and immutable provenance

**Settled prerequisites:** Q10, Q12, Q19, Q20.

Should every request bind to an immutable preset revision and retain its effective settings in provenance?

**Recommendation:** Yes. Publish Web JPEG v1 and Web PNG v1 with the already approved settings. Bind each requested variant to the selected revision at acceptance; retain revision identity and the effective dimension, orientation, format, quality, transparency, and metadata/color policies as those policies become approved. Historical records must not obtain their meaning from a subsequently changed preset definition. V1 offers no manager editing or revision publishing feature. Changes require subsequent owner-approved scope, and cannot silently alter accepted requests or historical outputs.

**Alternatives and trade-offs:** Keeping only a preset name simplifies records but makes old results ambiguous after changes. Editable workspace presets provide flexibility but conflict with the fixed published catalogue and add revision-selection policies.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q26 — Yes: Bind requests to immutable Web JPEG v1 and Web PNG v1 preset revisions and effective settings.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q27 — Verification and immutable completed bytes

**Settled prerequisites:** Q10, Q11, Q18, Q19.

Should verified complete mean that the actual retained file has passed the published output checks and is available for authorized retrieval?

**Recommendation:** Yes. Check that the entire output is decodable, its actual format and exact dimensions match the preset, its transparency/metadata/rendering requirements pass the approved expectations, and its source/request/preset provenance is correct. A processor merely reporting success is insufficient. An output failing known verification is failed, not retrievable as a completed deliverable. When the result cannot be established, show uncertain. Once complete, the output identity refers to fixed bytes; later reruns produce different output identities. Deletion and later availability problems remain separately visible. No byte-for-byte equivalence is promised between separate lossy conversions.

**Alternatives and trade-offs:** Trusting only a completion report reduces checks but permits false success and wrong-file delivery. Requiring pixel identity to the source would contradict resizing and lossy JPEG. Replacing completed files in place weakens review and provenance.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q27 — Yes: Require verification of actual retained deliverables before reporting completion. Preserve immutable output identity and distinguish failed from uncertain verification.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q28 — Exact retained-media admission accounting

**Settled prerequisites:** Q13, Q15, Q16, Q17.

Should the 1 GiB allowance count logical retained file bytes, with no guarantee of future output space at request admission?

**Recommendation:** Yes. Count each retained source, output, and preview file by its actual byte length, even when separate visible records have identical bytes. Non-media history is outside this allowance and needs its own boundary. Source acceptance requires validation and sufficient room for the complete source; otherwise reject it without creating an accepted source. A processing request must pass all eligibility/permission/workload checks and the workspace must not already be full, but admission does not reserve or promise the unknown future output size. Immediately before a new media file becomes retained, the total including that file must remain at or below 1 GiB. Concurrent submissions cannot overspend the allowance: a contender that no longer fits gets clear capacity feedback. Existing media remains intact. A preview that cannot fit is unavailable without invalidating an otherwise retained, verified output. Show current retained usage; provisional work is not presented as retained media.

**Alternatives and trade-offs:** Reserving a worst-case allowance for every requested output gives more predictable admission but rejects some requests whose real outputs would fit. Counting only unique physical bytes makes visible usage depend on implementation sharing. Permitting temporary retained overage would weaken the published cap.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q28 — Yes: Count each retained logical media file by its actual byte length against the inclusive 1 GiB workspace allowance, including retained previews.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q29 — Temporary-media and generated-file limits

**Settled prerequisites:** Q15, Q16, Q19.

Should V1 publish additional bounds for temporary media and generated files?

**Recommendation:** Yes. Allow at most four unfinished uploads workspace-wide and one per submitting member. Limit temporary media to 256 MiB per active media operation and 512 MiB workspace-wide, covering unaccepted uploads, intermediate media, and not-yet-retained outputs/previews. These figures do not specify storage type, process count, or a general machine-memory budget. Limit each final output to 32 MiB and each preview to 1 MiB. Refuse a new upload when its upload/temporary allowance is unavailable. Accepted requests may wait for allowance within the separately proposed waiting deadline. Known output/temporary-limit violations cause actionable failure without deleting existing media; preview-limit failures leave a valid output complete with preview unavailable. If the actual result cannot be established, uncertainty remains honest. These are product boundaries, not measured capacity claims.

**Alternatives and trade-offs:** Only bounding retained media leaves unfinished work without a product resource boundary. Lower temporary limits may reject valid large sources during processing; higher limits broaden operating demands. Unbounded previews can consume capacity that users expect to hold deliverables.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q29 — Yes: Apply the proposed limits: four unfinished uploads per workspace, one per member, 256 MiB temporary media per active operation, 512 MiB temporary media workspace-wide, 32 MiB per final output, and 1 MiB per preview.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q30 — Order and fairness

**Settled prerequisites:** Q17, Q18.

Should accepted requests become eligible to start in acceptance order, with retries joining the end?

**Recommendation:** Yes. Use acceptance order for eligible work and publish the catalogue order Web JPEG then Web PNG for a request's variants. Work that cannot currently proceed may be bypassed by eligible work; existing processing is not displaced by newer requests. Retries receive their own admission position. Per-member admission limits provide the initial fairness boundary. This describes user-visible ordering, not whether work runs serially or concurrently. Waiting is bounded by the separately proposed timeout policy.

**Alternatives and trade-offs:** Strictly blocking everything behind an ineligible request wastes available progress. Priority by responsibility gives operators control but creates starvation and priority-management policies. Per-member turn-taking may improve fairness but adds another ordering rule.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q30 — Yes: Start eligible requests in acceptance order, allow bypassing currently ineligible work, and process selected presets in published catalogue order.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q31 — Waiting and processing deadlines

**Settled prerequisites:** Q18.

Should each variant have a ten-minute waiting deadline and a two-minute processing deadline, without automatic retries?

**Recommendation:** Yes. Waiting time starts at request acceptance; processing time starts when that variant actually begins. If the relevant deadline expires, request that work stop and report a timeout reason. Mark failed only when the product can establish that the attempt ended without a verified deliverable; otherwise mark uncertain pending evidence. Preserve outputs already verified complete. No automatic retry and no invented completion guarantee. A later explicitly admitted retry receives fresh deadlines. Cancellation and completion near a deadline must still obey the confirmed-outcome rules rather than treating elapsed time as proof that work stopped.

**Alternatives and trade-offs:** No deadlines permit indefinite waiting or resource use. Shorter deadlines limit waiting but may fail useful work; longer deadlines reduce premature termination but delay recovery. Automatically retrying timeouts can duplicate uncertain work.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q31 — Yes: Apply ten-minute waiting and two-minute processing deadlines per variant, without automatic retries. Do not fabricate definitive failure from uncertain timeout outcomes.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q32 — Explicit retry eligibility and lineage

**Settled prerequisites:** Q9, Q12, Q18.

Should retry be manual, variant-selective, and limited to known failed or confirmed cancelled results?

**Recommendation:** Yes. A contributor may retry eligible variants of their own requests; Operations may retry any eligible variants. Require the original accepted source to remain available and retry the same bound preset revision. Refuse retries of waiting, processing, uncertain, complete, or deleted-source results. Create a new processing request linked to the original variants; do not overwrite original outcomes or repeat successful variants. Allow at most three accepted retries per originally requested variant, for four attempts including the original; refusals and safe repetitions of one accepted retry do not consume extra attempts. All retry admissions use the acting submitter's member limit and workspace limits, and record both the original contributor and retry actor. This bounds the retry feature, not all deliberate future new processing requests. Unavailable formerly completed outputs can instead be addressed through a deliberate new request where permitted.

**Alternatives and trade-offs:** Retrying the whole request repeats successful work. In-place retries obscure attempt history. Automatic or uncertain-result retries may duplicate effects. Unlimited retries offer flexibility but lack a clear recovery boundary.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q32 — Yes: Allow manual selective retries only for known failed or confirmed cancelled variants, up to three accepted retries per originally requested variant, preserving lineage and admission limits.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q33 — Cancellation scope and races

**Settled prerequisites:** Q9, Q18, Q20.

Should a cancellation request target all unresolved variants of one processing request, preserving completed outputs and separate retry requests?

**Recommendation:** Yes. Contributors may request cancellation of their own requests; Operations may do so for any request. Confirm cancellation of waiting work only when it is known not to have begun or delivered. For processing or uncertain work, record the stop intent and keep the actual outcome visible until confirmed. An output verified complete before cancellation confirmation remains complete and retrievable. Confirmed cancelled work must not later deliver a new output from that attempt. Repeating the same cancellation does not create another effect; a resolved request reports that nothing remains eligible. Cancelling a parent request does not implicitly cancel its separately identified retries. Deletion remains a separate authorized action.

**Alternatives and trade-offs:** Immediate cancelled labels give quick feedback but can falsely claim success. Per-variant cancellation offers finer control but adds selection and eligibility complexity. Cancelling every descendant request surprises users operating on one visible request.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q33 — Yes: Cancellation targets unresolved variants of the specified request, preserving completed outputs and independently linked retry requests. Cancellation intent is not confirmation of cancellation.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q34 — Evidence-based uncertainty reconciliation

**Settled prerequisites:** Q9, Q17, Q18, Q20.

Should uncertain results be resolved only from evidence, with Operations able to request reconciliation but unable to force an unsupported outcome?

**Recommendation:** Yes. Recheck uncertain work when the service can establish its status again, and expose an Operations action to request another check. A verified retained result becomes complete; evidence that the original work is still underway or has not begun may restore processing or waiting; proof that no deliverable exists and no further output can arrive permits failed or confirmed cancelled as appropriate. Missing evidence leaves the result uncertain. Uncertain work continues to consume its admission slot and block affected deletion and overlapping source/preset work. V1 has no force-success, force-failure, or abandon-as-resolved override and no guaranteed resolution time. Expose the last check and what evidence or intervention remains missing without requiring users to inspect internal logs.

**Alternatives and trade-offs:** Treating every interruption as failure makes slots easier to reclaim but permits duplicate work and false claims. A forced abandonment feature could restore capacity but would require explicitly changing the unresolved-work boundary and explaining its risks. Indefinite uncertainty can block capacity; that limitation is visible rather than hidden.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q34 — Yes: Resolve uncertain outcomes only using evidence. Preserve uncertainty and its capacity/overlap/deletion consequences when evidence remains insufficient; do not introduce forced outcomes or guaranteed reconciliation times.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q35 — Request summaries and partial success

**Settled prerequisites:** Q5, Q6, Q18, Q20.

Should request summaries be derived from individual variant outcomes and show partial results immediately?

**Recommendation:** Yes. Show requested presets, a count for each of the six variant outcomes, and currently retrievable outputs. Claim all outputs delivered only when every requested variant reached verified complete; separately flag any later deletion or unavailability so that this historical fact does not imply present retrieval. A request is resolved only when all variants have known final outcomes: complete, failed, or cancelled. Mixed final outcomes are shown as mixed, with explicit counts; uncertain or unfinished variants keep it unresolved. Completed variants remain independently retrievable and reviewable while other variants are unfinished. Linked retries have their own summaries and do not rewrite the parent.

**Alternatives and trade-offs:** One overall success/failure flag hides partial deliverables. Waiting for every variant before exposing completed outputs slows editorial use. Folding retries into the parent makes it harder to distinguish original and recovery results.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q35 — Yes: Derive request summaries from individual variant outcomes, expose partial success immediately, and preserve historical results independently of later availability.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q36 — Concurrent editorial changes and deletion

**Settled prerequisites:** Q9, Q19, Q20.

Should stale editorial changes be refused rather than silently overwriting another reviewer's decision?

**Recommendation:** Yes. Apply a mark/unmark action only if the selection still matches the state the reviewer last observed; otherwise return the current selection and ask the reviewer to reconsider. Repeating an already accepted action has no extra effect or new change attribution. A deleted output cannot receive a new active selection. If deletion takes effect first, reject the review action; if selection takes effect first, subsequent deletion removes its active usability and preserves the former selection in history. Apply current permission checks at the action boundary.

**Alternatives and trade-offs:** Last-write-wins is simpler but can silently discard a reviewer's work. Exclusive review ownership avoids competing changes but adds locks and assignment policy. Preserving active usable marks on deleted outputs would misrepresent available deliverables.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q36 — Yes: Reject stale editorial selection changes and preserve correct attribution across concurrent actions and deletion.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q37 — Preview failure and later output unavailability

**Settled prerequisites:** Q18, Q19, Q20.

Should preview availability and current download availability be shown separately from the historical processing outcome?

**Recommendation:** Yes. Preview failure shows a readable reason and leaves metadata and a valid output download available; a reviewer may inspect the downloaded file. For a missing or damaged formerly complete output, block delivery of incorrect/incomplete bytes, show unavailable, and preserve the historical completion/provenance. Keep previous editorial selection visible as historical context with the unavailability warning, not as a claim of a currently usable file. Do not silently regenerate or replace bytes under the same output identity. If the source remains available, offer a deliberate new processing request as recovery subject to normal permissions and admission. Deleted outputs remain deleted, with no restoration feature in V1. No notifications or automatic regeneration are added by this decision.

**Alternatives and trade-offs:** Changing every preview failure into processing failure hides usable outputs. Replacing completed files silently invalidates prior review. Automatically regenerating missing outputs consumes capacity and needs another recovery policy.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q37 — Yes: Keep preview and output availability separate from historical processing completion. Do not silently regenerate, replace, or restore missing or damaged outputs.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q38 — Minimal history and retention

**Settled prerequisites:** Q11, Q14, Q19, Q20.

Should V1 retain a defined minimal record while it supports live media or unresolved work, then retain history-only records for ninety days?

**Recommendation:** Yes. Keep source identity, original descriptive filename, actual format/dimensions/byte size, submission actor/time and rights-declaration fact; request identity, admission time, submitter, retry linkage and attempt count; preset revision/effective settings; variant outcome and relevant start/completion/cancellation/timeout/check times and readable reason category; output identity/metadata/availability; latest selection actor/time and deletion actor/time. Preserve facts needed to explain former selections and deleted outputs. Do not retain source embedded metadata, media bytes, unlimited internal logs, or a full editorial event log solely as history. Keep the linked provenance while any related media remains or work is unresolved. Once the related media is gone and all related work is resolved, keep its history for 90 days from that eligibility point, then remove it; merely reading history does not extend retention. Source/output media itself still has no automatic expiry. Exact history record-count/field-size bounds and submission-reference recovery lifetime follow this decision and remain open.

**Alternatives and trade-offs:** Indefinite history preserves context but creates an unbounded obligation. Immediate erasure makes deletion and recovery hard to explain. Keeping only the latest status loses attribution and lineage; recording every low-level event expands the product into an audit/log archive.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q38 — Yes: Preserve minimum necessary provenance while related media or unresolved work exists, followed by 90 days of history-only retention after those dependencies end.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q39 — Documented-client acceptance contract

**Settled prerequisites:** Q9, Q19, Q21.

Should acceptance require reproducible, documented end-to-end workflows performed as explicitly identified workspace actors?

**Recommendation:** Yes. Provide a documented starting point, initial manager/access setup, sample supported files, each responsibility's workflow, actual record/result inspection, preview viewing or clear preview-unavailable feedback, and retrieval of the actual output files. Demonstrate denied actions as well as permitted ones. The client must make acceptance, refusal, unresolved outcomes, and safe recovery understandable without internal logs or manual record editing. Include representative image/orientation/transparency/metadata cases and controlled partial-failure, capacity, deadline, cancellation, interruption, concurrency, and boundary cases as their exact policies are approved. Use evidence from actual behavior and artifacts, not a prewritten success transcript. No custom browser application or particular client tool is selected. Concrete fixture values and the final acceptance matrix follow policy approval.

**Alternatives and trade-offs:** Happy-path instructions are smaller but leave failure and permission behavior unproven. Operator-only demonstrations omit contributor/reviewer use. Requiring a polished browser interface would change the approved delivery scope.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q39 — Yes: Require reproducible documented-client acceptance using actual actors, assets, authorized and denied operations, failures, boundaries, and recovery scenarios.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q40 — Actionable feedback

**Settled prerequisites:** Q13, Q16, Q17, Q18, Q21.

Should every refusal or failure expose an understandable reason, action status, and safe next step?

**Recommendation:** Yes. Distinguish invalid/unsupported input, permission denial, duplicate/overlapping work, stale selection, retained-capacity exhaustion, temporary workload pressure, size/resource limits, timeout, cancellation, uncertainty, and deleted/unavailable media. Identify affected records and variants where access permits. State whether the action was accepted, refused without a new accepted record, or cannot yet be established. Suggest correction, capacity cleanup by a manager, waiting, permitted retry, or Operations reconciliation as appropriate; never suggest repeating uncertain work blindly. Do not invent retry-after times or expose internal diagnostics as the only explanation. Exact wording can vary, but reason categories and action status must be consistent.

**Alternatives and trade-offs:** A generic error is easier to implement but leaves users unable to recover safely. Raw diagnostic output helps developers but is insufficient product feedback. Promising a recovery action irrespective of permissions or outcome can mislead users.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q40 — Yes: Provide actionable and accurate feedback distinguishing refusals, accepted actions, uncertain outcomes, and safe recovery options.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

### Q41 — Service interruption and lifecycle continuity

**Settled prerequisites:** Q12, Q17, Q18, Q20.

Should accepted identities and confirmed outcomes survive service interruption, with interrupted work kept honest rather than silently restarted as a new attempt?

**Recommendation:** Yes. When the service is unavailable or stopping, refuse new actions it cannot reliably admit with readable service-unavailable feedback; an acknowledgement lost after admission uses the same-attempt recovery policy rather than assuming refusal. Preserve accepted source/request identities and completed outputs. Known not-yet-started admitted work may resume as waiting when service returns; interrupted processing becomes uncertain unless its actual outcome can be established. Never automatically create a duplicate processing attempt. Normal waiting/processing work may reach complete, failed, or cancelled only when their approved meanings hold; any loss of result knowledge may become uncertain. Uncertain work may return to a known active or final outcome only with evidence. Known final attempt outcomes are not rewritten by reruns; later deletion or availability changes are reported separately. No instant shutdown, zero-interruption, or uninterrupted-access guarantee is introduced.

**Alternatives and trade-offs:** Marking all interrupted work failed releases slots but may deny real completed outputs. Blindly rerunning it can duplicate work. Resetting request identities or clearing the workspace loses provenance and contradicts retained-media availability.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q41 — Yes: Preserve accepted identities and confirmed outcomes through service interruptions. Do not automatically create duplicate attempts or invent terminal processing outcomes.” **Approved decision:** The full original recommendation above, including its numerical limits, trade-offs, qualifications, and deferred policy details, accepted exactly as proposed.

## Round 4 — Remaining product boundaries and acceptance frontier

**Status:** Explicitly approved by the Product Owner on 2026-10-14. Original Round 4 proposals are preserved below.

Each question lists settled prerequisites from approved Rounds 1–3. No question requires accepting another Round 4 recommendation: record caps apply independently of reference lifetime; deletion rules apply independently of preview rendition; acceptance coverage uses the already approved policies and adopts new values only when independently approved. Related rules will be reconciled against the owner's exact answers. Numbered “yes” accepts the full recommendation for that question. Proposed bounds and tolerances are V1 product decisions, not measured platform capability or technical design.

### Q42 — Abandoned intake and upload deadlines

**Settled prerequisites:** Q13, Q23, Q29, Q40–Q41.

Should an unfinished upload have a five-minute whole-submission deadline, without resumable uploads in V1?

**Recommendation:** Yes. Start the five minutes when the upload is admitted, include reception and validation, and expire at elapsed time greater than or equal to five minutes. A known disconnected, abandoned, invalid, or expired submission must not become an accepted source. Request its provisional work stop and remove its temporary media; do not claim cleanup or release its occupied upload/temporary allowance until confirmed. If source acceptance actually preceded a lost acknowledgement, preserve it and recover the same accepted source instead of assuming failure. V1 supports same-attempt outcome recovery, but no continuation from a partial byte offset. The caller may make an explicit new attempt after the old attempt is known unsuccessful and its conflicting allowance is released.

**Alternatives and trade-offs:** A resumable upload workflow improves poor-connection handling but adds offset, partial-content, and expiry policies. No deadline can leave one member or the workspace blocked by abandoned submissions. A sliding activity deadline permits arbitrarily long occupancy.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q42 — Yes: Five-minute whole-submission deadline, including reception and validation. No resumable uploads. Do not release uncertain upload slots or temporary allowance before cleanup is confirmed.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q43 — Submission-reference recovery window

**Settled prerequisites:** Q9, Q22–Q23, Q38, Q40–Q41.

Should each submission reference have a published seven-day recovery window and remain unusable for new effects after expiry?

**Recommendation:** Yes. Give each reference an advertised issuance time and valid-until time seven days later. Bind it to one actor and action kind, and to the original upload content or request parameters on first use. Within that window, repeated uses return the same accepted, refused, in-progress, or indeterminate attempt rather than another admission. A refused attempt does not turn into a new accepted attempt after conditions improve; use a new reference for deliberate new work once safe. At or after expiry, refuse action/replay under that reference as expired; never reinterpret it as a fresh submission. Already accepted assets/requests retain their identities, ordinary access, and history. Recovery must obey current read authority; creating new effects requires current action authority. After expiry, admitted records can still be found through authorized normal listings where retained. Outstanding uncertainty is not resolved by reference expiry; retain the minimal attempt evidence needed to establish acceptance or temporary cleanup until resolved, without extending the expired reference's action authority. This sets behavior without selecting reference encoding, transport, or persistence.

**Alternatives and trade-offs:** A shorter window reduces recovery-record obligations but is less forgiving after outages. An indefinite window conflicts with bounded history. Expiry that silently re-admits an old attempt defeats safe recovery. Retrying a previously refused attempt under the same reference would make one attempt have multiple admission meanings.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q43 — Yes: Seven-day same-attempt submission-reference recovery, bound to actor, action, and original inputs. Expired or previously refused references cannot create new effects.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q44 — Non-media record and text boundaries

**Settled prerequisites:** Q23, Q28, Q38, Q40.

Should V1 bound non-media records separately from its 1 GiB media allowance?

**Recommendation:** Yes. Limit each workspace to 5,000 accepted-source records, 10,000 processing-request records including retries, and 10,000 submission-reference/attempt records still within their advertised recovery window or needed for unresolved submission/temporary-cleanup evidence, including unresolved records after reference expiry. Source/request limits count live, unresolved, and retained history-only records until eligible history expires; per-request variant records are bounded by the two distinct published presets. Rejected submissions do not create source/request records but their recovery/attempt records count while retained. For an unaccepted attempt, retain its bounded attempt facts while the recovery window or unresolved cleanup requires them; remove them once both obligations end, rather than treating them as accepted-source 90-day history. Refuse creation requiring a record beyond its inclusive limit; do not evict protected provenance, media, or unexpired recovery records. Existing inspection, cancellation, reconciliation, eligible deletion, and permitted review actions remain available. Publish counts and the relevant expiration/cleanup explanation; deleting media does not immediately erase its 90-day history or necessarily free a record slot. Bound original filenames to 255 UTF-8 bytes, submission references/opaque public identifiers to 128 Unicode code points, display labels where used to 80 code points, and readable reason summaries to 512 code points. Reject overlong user-supplied fields before admission; use bounded structured facts rather than unrestricted notes or embedded logs. These are product bounds, not a storage schema or machine-size guarantee.

**Alternatives and trade-offs:** Media-only quotas leave numerous tiny assets and retry histories unbounded. Earlier history eviction weakens the approved retention guarantee. Higher record/text limits improve scale at a larger product obligation; lower limits cause earlier refusal even with free media bytes.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q44 — Yes: Workspace limits of 5,000 source records, 10,000 processing-request records, and 10,000 required submission-attempt records. Apply the proposed inclusive text-field limits and preserve required history.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q45 — Concrete rendering acceptance cases

**Settled prerequisites:** Q10–Q11, Q15, Q24–Q27, Q39.

Should rendering acceptance combine exact structural cases with a small, explicit visual-fidelity rubric?

**Recommendation:** Yes. Require dimension cases 4000 × 3000 → 1600 × 1200, 100 × 50 unchanged, 3200 × 1001 → 1600 × 501, and 1 × 12000 → 1 × 1600, plus a 90-degree-oriented 4000 × 3000 source → 1200 × 1600. Check both presets, no crop/border/enlargement, 8-bit outputs, correct metadata stripping, and unchanged original source bytes. For unscaled sRGB 8-bit PNG solid-patch fixtures, preserve nontransparent color samples and alpha values exactly; hidden RGB values under fully transparent pixels are not constrained. For unscaled opaque sRGB solid-patch JPEG fixtures, require each decoded interior channel within eight values of its reference on the 0–255 scale, excluding patch boundaries. This is a proposed V1 acceptance tolerance, not an industry standard. For converted profiled RGB, valid profiled CMYK, supported higher-precision PNG, resized detail, and partial-transparency JPEG flattening, the owner reviews source/reference/output side by side for expected orientation/content, intended sRGB appearance, continuous tones, expected precision reduction, and white-background compositing, without unexplained hue inversion, gross clipping, missing content, or dark edge artifacts. Reject unprofiled CMYK and invalid/unsupported color interpretation with the published reason. The owner approves the actual reference artifacts before using them for final rendering acceptance; no conversion, resampling, or encoder implementation is selected.

**Alternatives and trade-offs:** Exact pixel identity for every case conflicts with resizing, color conversion, and JPEG. Purely subjective review misses reproducible structural defects. A comprehensive perceptual metric suite would broaden V1 acceptance and require additional metric/reference decisions.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q45 — Yes: Adopt the complete structural and visual-fidelity acceptance rubric, including example dimensions, PNG sample fidelity, JPEG interior-patch tolerance of ±8, and separately approved visual reference artifacts where required.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q46 — Preview rendition and attempt scope

**Settled prerequisites:** Q19, Q25, Q27–Q29, Q37.

Should each completed output receive one best-effort PNG preview fitting within 400 × 400 pixels, with a thirty-second preview-generation deadline?

**Recommendation:** Yes. Derive it from the verified completed output, preserve its visible orientation/aspect ratio, never crop or enlarge, use the approved nearest-integer, halves-up rounding with minimum dimension one and a 400-pixel bound instead of 1600, and retain sRGB rendering and existing transparency. Thus JPEG-derived previews show the already flattened white background. Keep preview metadata nonessential information stripped and apply the already approved 1 MiB preview and resource/capacity limits. Begin one initial preview-generation attempt after output verification, subject to available allowance; if allowance is unavailable, report preview unavailable without holding up completion. Once it begins, expire at thirty seconds. Expose pending, available, or unavailable preview status independently; expiry requests work stop and does not prove cleanup. No automatic preview retries, regeneration, or user-controlled preview sizes in V1. Users can inspect valid downloads or deliberately request a new output through the established workflow.

**Alternatives and trade-offs:** Full-size previews improve detail but consume more capacity and are redundant with download. JPEG-only previews lose transparency evidence. Unlimited attempts or retry controls add a separate recovery workflow. Smaller previews hide more visual detail; larger ones increase media obligations.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q46 — Yes: One best-effort 400 × 400 PNG preview per completed output, with a 30-second generation deadline, no enlargement or cropping, and no automatic regeneration.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q47 — Deletion admission, completion, and download races

**Settled prerequisites:** Q20, Q22, Q27–Q28, Q33–Q38.

Should deletion distinguish removing future access from confirmed media cleanup, with explicit race behavior?

**Recommendation:** Yes. Check manager authority and blockers when deletion takes effect. Reject deletion while related upload/processing/uncertain/preview-generation work makes removal unsafe; do not silently cancel it. If request or retry admission wins first, the source deletion is blocked; if deletion wins first, the new request/retry is refused. Once an eligible deletion is accepted, make the source/output and all cascade targets inaccessible to new retrieval, selection, and processing actions, and expose deletion pending until their media cleanup is confirmed. Previously authorized downloads may finish; neither deletion nor membership removal promises recall of already transferred or in-flight bytes. Do not credit media space while removed files are still retained pending cleanup. Confirm deletion only with evidence; uncertainty leaves cleanup pending and preserves its accounting and provenance. Repeated deletion/status recovery does not create a new deletion attribution, and never restores media. Source deletion is confirmed only when the source and all its derived outputs/previews are confirmed removed; any pending cleanup remains visible. Manager follow-up on that same deletion can request cleanup/status recovery without inventing success. History eligibility starts only after actual media removal and all related work resolution.

**Alternatives and trade-offs:** Immediate success with immediate capacity credit can misrepresent unfinished cleanup. Refusing every deletion during an authorized download unnecessarily couples cleanup to a slow reader. Allowing active derived-media work to continue after deletion can recreate inaccessible orphan media. An undo window would change retention and restoration scope.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q47 — Yes: Separate immediate closure of future access from confirmed physical cleanup. Preserve deletion-pending states, correct race ordering, attribution, and capacity accounting.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q48 — History dependency and expiry semantics

**Settled prerequisites:** Q26, Q32, Q35, Q38.

Should history retention follow linked source/request/retry dependencies and use a fixed expiry once eligible?

**Recommendation:** Yes. Keep provenance needed by a retained source/output/preview or unresolved request, including original request and retry lineage; resolving one request does not expire records still supporting that source or sibling/retry results. Set history-only eligibility only when all dependencies that need those records have ended; compute expiry as that time plus 90 elapsed days, inclusive at expiry. A pending or uncertain removal does not start the timer. Reads, repeated action recovery, and rejected changes do not extend it. Removed members retain stable historical actor identity and recorded attribution while related records remain; this does not restore workspace access. After eligible expiry, remove the record from listings/lookups and return clear history-expired/not-available feedback rather than fabricated provenance. Media itself is not expired by this policy, and submission-reference expiry does not expire an asset or settle work. No owner-operated early history purge is added.

**Alternatives and trade-offs:** Expiring each request immediately after it resolves can break live output/retry provenance. Resetting the timer on reads makes retention unpredictable. A full editorial history or manual purge would add policy beyond the minimum retained facts.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q48 — Yes: Retain linked provenance while required by media, unresolved work, and retry lineage. Start the 90-day history-only period only after all dependencies end.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q49 — Deadline, retry, and catalogue interactions

**Settled prerequisites:** Q23, Q30–Q35, Q41.

Should interruption and reconciliation preserve original deadlines, and should multi-variant recovery remain all-or-nothing at admission?

**Recommendation:** Yes. Waiting and processing elapsed time includes service downtime; returning from uncertainty does not reset acceptance/start times. Known unstarted work at or beyond ten minutes must not start, and known resumed processing at or beyond two minutes receives stop intent and honest outcome handling. A retry gets new clocks only through new explicit admission. A valid result found after a deadline may resolve uncertainty to complete if it does not contradict a previously established final outcome; timeout/cancellation intent alone cannot discard it. Repeated acknowledgement recovery never creates clocks, slots, or attempts. For a selective retry containing several variants, require every selected variant to pass permission, eligibility, source/preset overlap, lineage limit, and other admission checks; otherwise refuse the whole retry without consuming any retry count. Competing retries cannot both exceed a lineage limit. Catalogue order determines variant start order; JPEG failure alone does not suppress an otherwise eligible PNG variant. Starting the next variant need not await success of the previous one; this permits honest independent outcomes without selecting an execution model.

**Alternatives and trade-offs:** Resetting clocks after interruption permits unbounded attempt lifetimes. Partial retry admission surprises a caller who requested a particular set. Suppressing PNG after JPEG failure loses otherwise usable outputs. Treating every late result as failure contradicts evidence-based outcomes.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q49 — Yes: Include downtime in existing deadlines; never reset clocks during recovery. Multi-variant retry admission is all-or-nothing, with independent sibling outcomes.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q50 — Listings and finding results

**Settled prerequisites:** Q8, Q12, Q19, Q35, Q38–Q40.

Should the documented client support bounded, predictable listings with a small set of exact filters?

**Recommendation:** Yes. Default to 50 records per page, allow at most 100, and list unexpired records newest-accepted first with a stable identity tie-break. Label deleted, unavailable, unresolved, and history-only records distinctly; exclude expired history. Support exact source/request/actor identity filters, variant outcome, preset revision, current availability, and usable selection where applicable, plus explicit live/history-only views. Continuation follows the established order boundary: newer insertions appear on refresh rather than causing repeated earlier entries; records that expire may disappear, and current facts may change, without promising a frozen historical snapshot. All listings and continuation access obey current membership and expose no anonymous/private alternate path. No fuzzy search, embedded-metadata indexing, bulk export, or compound reporting in V1.

**Alternatives and trade-offs:** Unbounded lists become impractical at approved record limits. Fuzzy/full-text search helps larger catalogues but expands input, indexing, and ranking behavior. A fully frozen listing snapshot adds another consistency/lifetime policy.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q50 — Yes: Bounded listings with 50 records per page by default and 100 maximum, stable continuation, approved exact filters, and live permission checks.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q51 — Descriptive metadata and editing scope

**Settled prerequisites:** Q11–Q12, Q14, Q19, Q26, Q38.

Should V1 use immutable submission metadata and preset/output facts without user-authored titles, tags, or annotations?

**Recommendation:** Yes. Show the original filename, identity, accepted format/dimensions/bytes, submitter/time, rights-declaration fact, request links, and bound preset/output/review facts. Keep source image bytes and submission facts unchanged. Do not expose a source replacement, rename, custom title/tag/description, or annotation workflow in V1. Rights declarations are submission facts, not subsequently verified ownership claims. Display stable actor identities and preserve action-time attribution rather than rewriting it when membership changes. Selection remains the approved editable product fact; membership/responsibilities remain manager-controlled. This does not prohibit the identity labels required by the documented access setup.

**Alternatives and trade-offs:** Titles and tags improve organization but add editing, concurrency, validation, and history requirements. Renaming source submission facts obscures original intake context. A general metadata editor approaches broader asset-management scope.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q51 — Yes: Keep original submission facts immutable. Defer custom metadata editing, renaming, descriptions, tags, and annotations.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q52 — Concrete end-to-end acceptance matrix

**Settled prerequisites:** Q9–Q41.

Should V1 acceptance require the following full product evidence matrix rather than happy-path conversion alone?

**Recommendation:** Yes. Require demonstrations of: (1) valid JPEG/PNG intake, both presets, actual previews/downloads and source-byte preservation; (2) exact dimension/area/file-size boundaries and just-over cases, corrupt/truncated/animated/mislabeled inputs, missing declaration and unsupported color interpretation; (3) all combined-role permissions, denied/anonymous/removed-member actions and last-manager protection; (4) same-attempt acknowledgement recovery, changed-payload refusal, deliberate re-upload identities, duplicate presets and unresolved overlap; (5) every published admission/resource/generated-file limit, concurrent contenders and existing-asset preservation; (6) all six outcomes, mixed partial success, truthful progress and independently retrievable completions; (7) waiting/processing deadline boundaries, cancellation/completion races and no invented terminal outcome; (8) selective retries through the fourth total attempt, a refused fifth, shared lineage counters and acknowledgement replay consuming no attempt; (9) interruption, evidence-based reconciliation, persistent uncertainty and its continued blockers; (10) stale selections, preview failure, missing/damaged output, deletion races and no silent restoration; (11) live-provenance protection, history eligibility/expiry, bounded listings and understandable refusal/recovery feedback. Include Round 4-specific values only if separately approved. Use actual records, media, attribution, counts, and user-visible actions as evidence. Controlled fault and time scenarios are permitted in an isolated acceptance setting so deadlines/90-day expiry can be demonstrated reproducibly, but must exercise real product behavior rather than edit result records or present invented transcripts. The method is left to later module-scoped technical work. The owner reviews concrete rendering reference artifacts and consolidated acceptance coverage before final product acceptance; no latency/throughput/success-rate SLA is added.

**Alternatives and trade-offs:** Happy-path-only acceptance is quicker but cannot establish interruption and partial-result correctness. Waiting real ninety-day intervals is impractical for iteration. Requiring production-scale load benchmarks would invent a performance target and exceed the educational product boundary.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q52 — Yes: Adopt the complete proposed product acceptance matrix covering valid and invalid workflows, roles, concurrency, failures, uncertainty, recovery, deletion, retention, and retrieval.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q53 — Resource release under uncertainty

**Settled prerequisites:** Q17, Q23, Q28–Q29, Q34–Q35, Q40–Q41.

Should resource and admission slots be released only when their actual obligations are known to have ended?

**Recommendation:** Yes. A processing request occupies one workspace/member slot until every variant has a known final outcome; member removal, reference expiry, timeout intent, and cancelled-parent lineage do not release another still-unresolved request. Unknown temporary-media or unfinished-upload cleanup continues to occupy its affected allowance; do not claim zero usage or free slots merely because work disappeared from observation. Expose known usage and any uncertainty separately, and refuse new media admission against an affected allowance if compliance cannot be established. Reads, reconciliation, cancellation requests, and otherwise eligible manager actions remain available. Moving a file from temporary to retained accounting does not count that same logical file twice or omit it from both; distinct visible retained copies still count separately. No media credit is given until removal is known. This is observable accounting behavior, not a choice of reservation/storage/concurrency mechanism.

**Alternatives and trade-offs:** Releasing on timeout or loss of observation improves apparent availability but can exceed quotas or admit overlapping work. Treating all known and unknown usage as an exact number creates false precision. Freezing every unrelated user action prevents the recovery actions needed to establish evidence.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q53 — Yes: Release workload slots and temporary/retained allowances only when their obligations are known to have ended. Keep uncertain usage visible and recovery available.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q54 — Request ownership versus source submission

**Settled prerequisites:** Q8–Q9, Q12, Q14, Q22, Q32.

Should any Contributor be able to request processing of any accepted shared source, with request ownership defined by its submitting actor?

**Recommendation:** Yes. Shared source visibility plus Contributor responsibility permits creating a request against that source, subject to normal admission rules. The upload submitter is not a separate permission owner. No new rights declaration is required for processing an already accepted source; preserve the original submission declaration. For own-request retry/cancellation checks, use the request submitter; the original contributor in a retry lineage is the original request submitter, not necessarily the uploader. A retry also records its acting submitter and links to that original request. Operations retains its approved any-request authority. Combining responsibilities provides their combined actions, while Manager alone does not provide them.

**Alternatives and trade-offs:** Restricting processing to the uploader impedes shared editorial handoff and adds source-specific permissions. Treating uploader identity as request ownership obscures who actually requested work. Requiring another declaration on every conversion adds friction beyond per-submission accountability.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q54 — Yes: Any Contributor may process a shared accepted source. Request ownership belongs to the submitting Contributor, not necessarily the source uploader.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

### Q55 — Operations visibility and non-variant recovery authority

**Settled prerequisites:** Q9, Q13, Q22–Q23, Q29, Q34, Q37–Q41.

Should Operations be able to inspect unfinished/uncertain intake and preview/temporary-cleanup obligations and request evidence checks or safe provisional cleanup?

**Recommendation:** Yes. Provide workspace-wide inspection of unfinished or indeterminate upload attempts, preview attempts, and temporary-cleanup blockers, with actor, linked source/request/output where one exists, current facts, last check, occupied allowance, and safe next action. Operations may request evidence-based status checks and safe cleanup of media known not to be an accepted source or retained deliverable; it cannot adopt an upload as its own, replay another actor's submission as a new action, resume partial bytes, delete accepted assets, force an uncertain result, or regenerate a completed output. Pending deletion is inspectable; Manager authority is required for deletion admission or follow-up on the accepted-media cleanup decision. Non-variant checks update bounded current attempt/record facts and do not create a processing request, consume a retry, extend an expired reference, or add an unrestricted operator-log archive. If safe cleanup cannot be established, preserve the blocker and explain it. This explicitly extends Operations recovery authority beyond variant reconciliation; it does not imply broader management authority.

**Alternatives and trade-offs:** Restricting recovery to the submitting member leaves removed-member or expired-reference obligations difficult to address. Giving Operations arbitrary deletion bypasses the Manager boundary. Hiding non-variant blockers behind internal logs fails the documented-client recovery goal.

**Status:** Explicitly approved by the Product Owner on 2026-10-14. **Owner response:** “Q55 — Yes: Operations may inspect and reconcile unfinished intake, preview attempts, and temporary cleanup without bypassing Manager permissions, forcing results, or creating additional work.” **Approved decision:** The full original recommendation above, including its numerical limits, qualifications, alternatives, and deferred details, accepted exactly as proposed.

## Consolidated product shared understanding — Formally approved

This is a review summary of explicitly approved Q1–Q55 inside the discovery record, not `final-prd.md`. The original approved recommendations, qualifications, and owner responses above remain authoritative. The Product Owner explicitly approved this consolidated shared understanding and gave final Product Discovery sign-off on 2026-10-14.

### Product and actors

MediaForge V1 is a backend asset-processing desk for a small creative/editorial team in one private workspace. A documented client demonstrates the complete workflows; a custom browser application is deferred. Every admitted member can inspect shared sources, requests, outcomes, outputs, and permitted history; there is no public signup or anonymous media access.

Contributor, Reviewer, Operations, and Manager responsibilities are combinable. Contributors upload and request transformations on any accepted shared source and may retry/cancel their own eligible requests. Reviewers mark/unmark usable outputs. Operations may retry/cancel any eligible request and perform evidence-based intake/variant/preview/temporary-cleanup recovery. Managers manage membership/responsibilities and delete accepted media, including deletion follow-up. Manager authority alone does not grant the other responsibilities. Permissions are current at the action boundary; removing authority does not automatically cancel accepted work. Preserve attribution and prevent removal/demotion of the last Manager.

### Intake and publication variants

Accept completely validated, rights-declared JPEG/PNG still-image uploads only. Actual content determines format despite advisory filename/type mismatches. Reject unsupported, corrupt, truncated, animated/multi-frame, over-limit, or uninterpretable-color sources. Each accepted upload gets a distinct immutable identity, including identical re-uploads. Preserve original source bytes and submission facts; no replacement, rename, custom metadata editor, titles/tags/descriptions, or annotation workflow.

A request selects one or both distinct presets for one source. Reject repeated/unknown presets and unresolved overlap for the same source/preset; deliberate new resolved-work requests are allowed. Ownership follows the request submitter, not the uploader. Bind variants to immutable Web JPEG v1 / Web PNG v1 definitions with their effective settings. No preset editing/version-publishing feature in V1.

Both presets normalize visible orientation and fit the whole image within 1600 × 1600 without crop, border, or enlargement. With oriented dimensions W,H, scale by min(1,1600/W,1600/H), round each dimension to nearest whole pixel with halves up and minimum one. Normalize supported color interpretation to sRGB and 8-bit channels. Interpret untagged RGB/grayscale as sRGB; reject ambiguous/unsupported interpretation including unprofiled CMYK. Web JPEG uses quality 85/100 and white transparency flattening; Web PNG preserves transparency. Strip nonessential embedded metadata while preserving necessary rendering information and separate workspace provenance.

Completion requires verification of the actual decodable, retained, retrievable output against its preset, dimensions, metadata/rendering requirements, and provenance. Completed output identity binds fixed bytes; reruns create new identities. Preview availability and later output availability do not rewrite historical completion.

### Numeric boundaries

| Boundary | Approved value and rule |
| --- | --- |
| Source file | At most 20 MiB, 40 million pixels, and 12,000 pixels per dimension; all inclusive |
| Retained media | At most 1 GiB of logical source/output/preview bytes; distinct visible copies count separately; no automatic eviction or promised future output space |
| Outstanding requests | At most 20 per workspace and 5 per acting submitter; each request counts once until all variants have known final outcomes |
| Unfinished uploads | At most 4 per workspace and 1 per submitting member |
| Temporary media | At most 256 MiB per active media operation and 512 MiB workspace-wide; not a general machine-memory or process-count guarantee |
| Final output / preview | At most 32 MiB per output / 1 MiB per preview |
| Source / request records | At most 5,000 source records / 10,000 processing-request records including retries and required history |
| Attempt records | At most 10,000 records protected by the reference-recovery window or unresolved acceptance/cleanup evidence |
| Text | Filename 255 UTF-8 bytes; references/public identifiers 128 Unicode code points; display labels where used 80 code points; reason summaries 512 code points |
| Whole upload | 5 minutes from admission, including reception and validation; no partial-byte resumption |
| Variant waiting / processing | 10 minutes from request acceptance / 2 minutes from actual variant start; downtime counts and reconciliation does not reset clocks |
| Retry lineage | 3 accepted retries plus the original attempt per originally requested variant; refusals and same-attempt recovery consume no extra attempt |
| Preview | One best-effort PNG within 400 × 400, same rounding/orientation/no-crop/no-enlargement rules; 30-second generation deadline; no automatic regeneration/retries |
| Submission reference | 7 days from advertised issuance; actor/action/input bound; expired or refused references cannot become new effects |
| History-only retention | 90 elapsed days only after related media is actually gone and all supporting work/dependencies are resolved |
| Listings | Default 50 records per page, maximum 100; stable ordering/continuation with approved exact filters and current permission checks |

Admission and retention may fail honestly even for a supported source. Media, record, workload, and temporary limits remain distinct; protected history cannot be evicted to make room. Temporary-to-retained transitions count a logical file exactly once. Unknown cleanup/usage cannot be credited as free capacity; deny affected new admissions when compliance cannot be established while preserving inspection/recovery actions. These values are product boundaries, not measured hosting, runtime performance, or success-rate guarantees.

### Outcomes, recovery, and concurrency

Each variant distinguishes waiting, processing, verified complete, failed, cancelled, and uncertain. Progress percentages are optional and must be trustworthy; no invented ETA. Summaries show outcome counts and currently retrievable outputs. Mixed final outcomes remain explicit; partial completed results are immediately usable. Uncertain or unfinished variants keep a request unresolved and occupying its slot.

Same-attempt recovery creates no second source/request, attempt, slot, clock, or effect. Bind references to actor/action/original inputs, refuse changed inputs, and preserve refused attempts as refused. Recovery obeys current read authority; expiry never re-admits an old action. Keep unresolved evidence even after action authority expires.

Eligible requests start in acceptance order, permitting bypass of currently ineligible work. Selected presets start in catalogue order; one variant's failure does not suppress an eligible sibling. Retry requests join the end. This does not prescribe serial or parallel execution.

Manual selective retries require known failed/confirmed cancelled results, the available original source, same bound revision, permitted actor, available lineage allowance, and all admission checks. Multi-variant retry admission is all-or-nothing. Retain original results and successful variants; linked retries have new request identities and their own summaries. The retry-lineage cap does not ban deliberate future new requests for resolved source/preset work.

Cancellation affects unresolved variants of the named request, not its separate descendants or completed outputs. Deadline/cancellation intent is not proof of stopping, failure, cancellation, or cleanup. Confirm outcomes only from evidence. A valid result may resolve uncertainty to complete after a deadline if it contradicts no established final outcome. No automatic retries or forced outcomes. Missing evidence can leave uncertainty indefinitely, retaining slot/overlap/deletion consequences.

Reject stale selection changes rather than silently overwriting another reviewer's state. No variant is selected by default; multiple independently reversible selections are allowed with attribution. Selection does not gate retrieval. Output unavailability preserves historical completion/selection context with an explicit warning; no silent replacement/regeneration/restoration. Preview failure leaves a valid completed output available with metadata and download fallback.

### Deletion and provenance

Managers may delete one output or a source with all derived outputs/previews. Block unsafe deletion involving unresolved work, including active/uncertain derived-media obligations. Admission and deletion races have one consistent winner. Accepted deletion closes new access/actions immediately; previous authorized transfers may finish. Expose deletion pending, retain capacity charges until media removal is confirmed, and preserve original attribution on repeated recovery. Never equate accepted deletion with confirmed physical cleanup.

Preserve minimal source/request/preset/output facts, declaration, actors/times, retry lineage, outcome/reason/check facts, latest/former selection facts needed for deletion context, and deletion attribution. No media bytes or unrestricted logs retained solely for history. Live media or unresolved dependencies pin required provenance; then the fixed 90-day history-only timer starts. Reads/recovery/rejected changes do not extend it. Unaccepted attempt records instead follow their recovery/evidence obligations. Expired history disappears with clear feedback; retained media has no automatic expiry.

### Acceptance and exclusions

The approved rendering rubric includes exact dimension/orientation examples, exact applicable unscaled PNG samples/alpha, JPEG interior-patch tolerance of ±8 per channel, and owner-reviewed reference artifacts for profiles, precision, resizing, and transparency compositing. The full product evidence matrix covers all roles, valid/invalid intake, every limit and boundary, concurrency, partial success, six outcomes, deadlines, retries, cancellation, interruption, uncertainty, unavailable media, deletion, history, recovery, and client feedback. Controlled faults/time may demonstrate real behavior in an isolated acceptance setting; no manual result editing or invented transcripts. Actual reference artifacts remain to be produced/reviewed, and acceptance evidence remains to be executed/reviewed later. None is represented as already run or accepted.

The documented client must expose real actor/actions, media/artifacts, records and understandable reasons/safe next steps without internal-log interpretation. Bounded listings expose exact identity/actor/outcome/preset/availability/selection and live/history filters, without fuzzy search, embedded-metadata indexing, bulk export, or compound reporting.

Exclude/defer audio/video/animation/vector intake, remote fetching/imports, arbitrary scripts/plugins, custom pipelines/preset editing, public sharing/signup, multiple workspaces, a custom browser UI, professional approval chains, metadata editing/annotation, automatic schedules/publishing/integrations, archive guarantees, unlimited processing/storage, instant cancellation/cleanup, automatic output restoration, and general infrastructure management. Preserve D03's potential runtime learning challenges through honest derived-data, asynchronous, resource, attribution, interruption, and diagnostic behavior; mechanism/library/platform choices and demonstrated mastery are not assumed.

## Product-policy decision tree audit — Q1–Q55

| Branch | Approved coverage | Audit outcome |
| --- | --- | --- |
| Audience, workspace, authority and ownership | Q1, Q3, Q8–Q9, Q22, Q54–Q55 | Closed; current authority, shared sources, request ownership, management and recovery boundaries explicit |
| Intake, identity, rights and safe recovery | Q2, Q4, Q11–Q15, Q23, Q25, Q42–Q44, Q51 | Closed; validation, compatibility, immutable submissions, attempt expiry and uncertainty obligations explicit |
| Presets, dimensions, color, verification and previews | Q10–Q11, Q24–Q27, Q45–Q46 | Closed; actual reference-artifact approval is later acceptance work, not an unanswered product policy |
| Admission, quotas, ordering and resource release | Q16–Q17, Q28–Q30, Q44, Q49, Q53 | Closed; known limits, record protection, overlap, ordering and unknown occupancy reconciled |
| Lifecycle, deadlines, retries, cancellation and interruption | Q5, Q18, Q23, Q31–Q35, Q41–Q43, Q49 | Closed; final outcomes require evidence, clocks survive downtime, retry counters and parent/child separation explicit |
| Review, availability, action races and deletion | Q6–Q7, Q19–Q20, Q36–Q37, Q46–Q47, Q53, Q55 | Closed; historical outcome versus present availability, stale changes, downloads, safe cleanup and authority explicit |
| History and attribution | Q26, Q32, Q38, Q43–Q44, Q47–Q48, Q51 | Closed; dependency-pinned records, 90-day timer, recovery records, caps and media non-expiry consistent |
| Client, feedback, acceptance and education | Q21, Q39–Q40, Q45, Q50–Q52 and Charter | Closed; delivery, representative rubric, failure/boundary evidence and educational direction explicit |

**Remaining product-policy frontier:** Empty. No Round 5 proposed. No unapproved recommendation is being promoted to a decision.

**Remaining authorized-work gates:** Final Product Discovery sign-off is granted. Codex is authorized to author `final-prd.md`, then must wait for separate owner approval before authoring `module-plan.md`; the Module Plan also needs separate owner approval before module-scoped Technical Discovery. Reference-artifact production/review and actual acceptance execution belong to later approved work. Whole-product Technical Discovery, architecture, specifications, tickets, and implementation have not been authorized by this audit.

**Sign-off requested:** Does the Product Owner confirm this consolidated shared understanding of approved Q1–Q55 and give final Product Discovery sign-off, authorizing Codex to author `final-prd.md` for separate review?

**Owner response:** “I explicitly confirm and approve the consolidated V1 product shared understanding.” “Product Discovery Q1–Q55 is complete and formally approved.”

**Final Product Discovery sign-off:** Explicitly granted on 2026-10-14.

**Final PRD deliverable:** [final-prd.md](./final-prd.md), authored from the approved Charter and Q1–Q55 for separate owner review. Final PRD approval is pending; Module Planning remains unauthorized.

**Authorization:** “You are now authorized to create the consolidated `final-prd.md`.” The approved product contract includes all previously accepted questions, recommendations, numerical boundaries, qualifications, invariants, failure behaviors, and acceptance requirements. Codex must stop after producing the Final PRD and wait for explicit owner approval. Module Planning, whole-product Technical Discovery, architecture selection, specifications, tickets, tests, and application code are not authorized at this stage.

## Discovery completion gate

Discovery remains incomplete while any material branch is unresolved. Before PRD generation, present a consolidated product decision summary with explicit exclusions, invariants, limits, failure policies, and acceptance expectations. Ask the Product Owner to confirm shared understanding. That confirmation permits consolidation into the Final PRD; the consolidated Final PRD has its own approval gate before Module Plan generation.
