# MediaForge

MediaForge is a private asset-processing desk for a small creative/editorial team preparing owned media for publication. These terms reflect the approved Charter and Rounds 1–4 decisions; they do not settle outstanding policies.

## Language

**Source asset**:
An accepted, immutable user-supplied JPEG or PNG still image from which publication variants are requested. Each accepted upload has a distinct source identity, including identical re-uploads.
_Avoid_: Input job, output asset

**Preset**:
A published transformation choice for producing an output variant from a source asset.
_Avoid_: Custom pipeline, user script

**Processing request**:
A separately identified request to produce variants from exactly one source asset using one or more published presets.
_Avoid_: Batch of sources

**Output variant**:
A requested derived result associated with one processing request, source asset, and preset revision, with an individually visible outcome. A verified complete variant has a derived media deliverable.
_Avoid_: Source asset

**Editorial selection**:
A recorded choice that a completed output variant is usable for publication, separate from processing completion and retrieval eligibility.
_Avoid_: Processing success, publication confirmation

**Workspace**:
The single private, manager-controlled collaboration boundary containing the team's sources, requests, and output variants.
_Avoid_: Public gallery

**Workspace actor**:
An identified participant to whom workspace actions are attributed, whose identity remains distinct from current membership and responsibilities. Removal from membership does not change the actor's historical identity.
_Avoid_: Display label as identity, current member as historical identity

**Admitted member**:
A workspace actor currently admitted to the private workspace, with shared inspection/retrieval access and any explicitly assigned responsibilities. Historical participation alone does not confer current membership or authority.
_Avoid_: Every actor as a current member, responsibility as membership

**Contributor**:
An admitted member permitted to submit sources and processing requests, and to retry or request cancellation of their own eligible requests.
_Avoid_: Asset owner as a separate permission role

**Reviewer**:
An admitted member permitted to record and reverse editorial selections.
_Avoid_: Required download approver

**Operations user**:
An admitted member permitted to retry or request cancellation of any eligible processing request and perform evidence-based variant, intake, preview, and temporary-cleanup recovery. This responsibility does not confer accepted-asset deletion or forced-outcome authority.
_Avoid_: Workspace manager

**Workspace manager**:
An admitted member permitted to manage membership and responsibilities and delete eligible sources or outputs. This responsibility does not implicitly confer the other responsibilities.
_Avoid_: Automatically all-powerful administrator

**Web JPEG**:
The fixed JPEG preset fitting the oriented full image within 1600 × 1600 pixels without cropping or enlargement, at quality 85/100 with transparency flattened onto white.
_Avoid_: Custom JPEG preset

**Web PNG**:
The fixed PNG preset fitting the oriented full image within 1600 × 1600 pixels without cropping or enlargement, preserving transparency when present.
_Avoid_: Custom PNG preset

**Verified complete**:
A confirmed processing outcome established by verification of a retained, retrievable deliverable matching its requested preset. Historical completion is independent of editorial selection and later media availability.
_Avoid_: Editorial approval

**Uncertain outcome**:
A variant outcome whose result cannot yet be established as complete, failed, or confirmed cancelled.
_Avoid_: Assumed failure, confirmed cancellation

**Retained media**:
Sources, output files, and retained preview files counted toward the workspace's 1 GiB media allowance.
_Avoid_: Unlimited archive

**Preset revision**:
An immutable published definition of a preset's effective transformation settings, bound to a requested variant at acceptance.
_Avoid_: Mutable preset name as provenance

**Submission reference**:
An actor- and action-bound reference identifying one upload or processing-request submission attempt for same-attempt recovery without creating another accepted submission.
_Avoid_: New source identity, deliberate rerun

**Retry lineage**:
The original requested variant and its explicitly accepted retry attempts, linked without replacing earlier outcomes.
_Avoid_: In-place outcome reset

**Cancellation intent**:
A recorded request to stop unresolved variants of one processing request, distinct from a confirmed cancelled outcome.
_Avoid_: Cancellation success

**Reconciliation**:
The evidence-based establishment of uncertain processing, intake, preview, or cleanup facts, without inventing outcomes or creating another processing attempt.
_Avoid_: Forced failure, assumed success

**Preview**:
A visual review representation of a completed output whose availability is separate from output completion and retrieval.
_Avoid_: Required editorial approval

**Temporary media**:
Unaccepted uploads, intermediate media, and outputs or previews not yet retained as workspace media.
_Avoid_: Retained media, general machine-memory budget

**History-only record**:
A minimal product record whose related media is gone and whose related work is resolved.
_Avoid_: Media archive, unlimited diagnostic log

**Request submitter**:
The actor who submitted an accepted processing request and owns it for own-request retry and cancellation authority, distinct from the source uploader when different.
_Avoid_: Source uploader as automatic request owner

**Source uploader**:
The actor recorded with the accepted source submission and its rights declaration, without exclusive processing authority over that shared source.
_Avoid_: Asset-specific permission owner

**Deletion pending**:
An accepted deletion whose targets are closed to new access but whose media cleanup has not yet been confirmed.
_Avoid_: Confirmed cleanup, immediately freed capacity

**Same-attempt recovery**:
Recovery of the outcome of one submission without admitting another source/request or consuming another retry attempt.
_Avoid_: Intentional new work, resumable upload

**Preview unavailable**:
A preview state in which the visual review representation cannot be provided, separate from a verified output's completion or download availability.
_Avoid_: Processing failure
