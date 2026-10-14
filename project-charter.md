# Project Charter — P02 — MediaForge: Content Asset Processing Desk

**Domain:** D03  
**Charter status:** Learner-approved educational project direction (D01–D03 authoring phase)  
**Product Discovery / Final PRD / Module Plan:** Not started in the fresh implementation workflow  
**Implementation / demonstrated learner mastery:** Not started / not assessed

> This Charter frames a useful product and authentic Node.js runtime learning challenges. It is **not** a finalized V1 PRD or a predetermined architecture. Scope details are starting constraints for learner-supervised Codex Product Discovery, not immutable technical design.

## Problem and motivation

Creative and editorial teams repeatedly need multiple publication-ready variants of source media. A conversion request can produce a mix of complete and failed outputs, take longer than expected or end in an uncertain state. **MediaForge** offers a deliberately limited asset-processing desk with visible per-request outcomes and retrievable derived deliverables—not a general-purpose compute farm or arbitrary media editor.

## Audience and actors

- **Contributor:** submits an owned source asset and requests an allowed transformation preset.
- **Editor/reviewer:** inspects outputs and failures and selects which completed result to use.
- **Operations user:** sees processing progress and addresses failed/unknown jobs within the workspace's supported policy.
- **Workspace manager:** maintains permitted access to source/output assets and workspace boundaries.

These are product responsibilities, not a requirement for a particular identity, permission or deployment implementation.

## Goals and measurable outcomes

A contributor can request a supported transformation, distinguish running/failed/complete/uncertain outcomes and retrieve a verified complete output. A reviewer knows which source and preset produced which variant. Success is observable through a completed expected output and readable job result; a cancellation or timeout never creates a false 'all outputs delivered' claim.

**Evidence for acceptance:** demonstration on explicitly supported sample cases and negative/failure cases; no invented latency, capacity, retention or success-rate SLA. The first-version numeric boundaries are agreed during separate product discovery before dependent engineering decisions.

## Product boundary: in / out / deferred

**In scope for V1:**
- Submit supported media assets with source identity, metadata and validation feedback.
- Choose from a **small, explicitly published** set of output presets relevant to the initial supported media type(s).
- Create separately identified processing requests showing source, selected preset(s), state and any available progress.
- List and retrieve completed output variants with provenance back to their source and requested preset.
- Describe failed/incomplete results clearly and offer user-visible retry and cancellation requests where eligible.
- Allow an editor to review result previews or metadata and identify final usable variants.

**Out of scope:**
- Arbitrary user-authored executable processing scripts, custom plugins or untrusted code execution.
- A public unlimited transcoding/rendering farm, enterprise compute scheduler or infrastructure management console.
- Full video editing suite, complex collaborative asset annotation or a general DAM marketplace.
- Guarantee that a cancellation reverses output already delivered or effects at external processors.

**Deferred beyond V1 or subject to subsequent explicit scope approval:**
- Automated recurring batch schedules, third-party publishing and content-management integrations.
- User-defined transformation pipelines and compound workflows spanning many media types.
- Professional collaborative approvals, long-term archive/legal retention and large-scale distributed processing.

The above determines **what product is being built**. Any future Product Discovery choices must remain compatible with this initial boundary unless the owner explicitly changes it.

## Explicit non-goals

No enterprise media editing suite, arbitrary script host, guaranteed instant cancellation, unlimited processing, automated rights enforcement or third-party publishing in V1.

No implementation code, technical ADR, architecture or library selections are authorized by this Charter.

## Domain learning outcomes and why this project is valuable

**D03 learning coverage to challenge if the project is later built:** D03-C03–C04, C06–C12 (byte/dataflow and asynchronous/native/parallel work), C14–C18 (resource pressure, attribution, shutdown and diagnosis).

**Distinctness / portfolio rationale:** Unlike P01's intake/handoff, MediaForge creates **new derived assets**; unlike D01's generic large-data workspace it solves a focused creative content publishing workflow rather than arbitrary records/aggregations.

These are *potential* learning challenges, not a mandate to implement a specific Node mechanism or proof of learner proficiency. D01/D02 related project Charters and their scope remain unchanged.

## Educational engineering challenge

Practice the related domain lessons by exploring honest asynchronous outcomes, correctness invariants, resource costs, error and failure behavior, and testable evidence in this product. **Do not force a particular library, storage architecture, process model or platform just to demonstrate the technology.**

## Kickoff and owner approval

When the learner selects this project, Codex authors `product-discovery.md` after a focused PM `grill-with-docs`; after learner approval, Codex consolidates **`final-prd.md`**; then Codex creates a learner-approved **`module-plan.md`**. Implement one approved module at a time using module-scoped technical discovery → `to-spec` → `to-tickets` → `implement` → verification. Original detailed pre-V2 material is available in Git history only; no implementation or technical decisions are inherited automatically.
