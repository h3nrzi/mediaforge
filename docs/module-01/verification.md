# Module 01 verification and integration handoff

Implementation authorization: `$implement .scratch/mf-mod-01`, continued on 2026-10-15. The approval-only statements in the specification and tickets describe the earlier authoring sessions. This instruction authorizes these eight tickets together; it does not authorize Module 02 or whole-product acceptance.

Local state: implementation and individually executed feature checks are present; final suite and independent review results will be recorded below. Human Product Owner acceptance remains separate.

Runtime: Node.js 24.22.0, downloaded from the official release distribution and matched against its SHA-256 release manifest. curl 8.17.0. JavaScript ES modules and built-in HTTP/HTTPS, crypto, filesystem, SQLite and test runner; no application dependencies or compiler added. `npm run check` verifies the pinned runtime and JavaScript syntax. All tests use actual temporary on-disk SQLite. Clocks, storage faults, barriers and dropped acknowledgements exist only as trusted test-construction arguments, never HTTP/env override endpoints.

## Executed local scenarios

Each row names executed automated evidence and its limits. Test names carry their M01-V identifiers. The final suite report below establishes the settled revision's result; these are Module 01 local scenarios, not whole-case product acceptance.

| Scenario | Method and actual observation | Evidence |
| --- | --- | --- |
| M01-V01 | Real helper commands create owner-only files/configs and verifier-only descriptors; existing/symlink/unsafe paths refuse. Walkthrough evidence checks generated secrets/verifiers are absent. | `test/workspace.test.js`, `test/validation.test.js`, `scripts/walkthrough.js` |
| M01-V02 | Real bootstrap commands and competing independent processes establish one initial Manager. Pre-commit failure leaves uninitialized state; post-commit SIGKILL preserves the saved candidate. Initialized reruns refuse. | `test/workspace.test.js`, `test/persistence.test.js` |
| M01-V03 | Anonymous, duplicate/malformed/wrong-secret/verifier-only, replaced/removed/expired callers deny; zero-role self works; unauthorized target facts remain concealed. | `test/validation.test.js`, `test/membership.test.js`, `test/credentials.test.js`, `test/expiry.test.js` |
| M01-V04 | Actual assigned members exercise all sixteen combinations and every kind; Manager has no inheritance. Own-request submitter differs from source uploader. This is local policy-contract verification. | `test/policy.test.js`, curl walkthrough |
| M01-V05 | Independent writer barriers order competing self-demotions and removal; one admitted Manager remains; waiting removed/demoted callers deny. | `test/concurrency.test.js`, `test/membership.test.js` |
| M01-V06 | Stale/incompatible edits refuse with current facts; matching replay changes no version/attribution; queued edits cannot overwrite; stale removal cannot remove a readmission. | `test/membership.test.js`, `test/concurrency.test.js` |
| M01-V07 | Removal clears assignments/invalidation; exact-ID fresh readmission preserves identity/first admission. Earlier labels survive relabel/removal. Minimal consumer retains its earlier attributed effect without cascade; policy-contract scope only. | `test/membership.test.js`, `test/policy.test.js` |
| M01-V08 | Zero-role self replacement, denied other replacement, Manager replacement, current confirmation, superseded/revoked replay and independent operator/Manager revision conflict. | `test/credentials.test.js`, `test/concurrency.test.js` |
| M01-V09 | Controlled before/exact/after 30-day expiry; no inspection/confirmation extension. Expiry/replacement/removal/demotion while waiting and expiry at final application gate deny. | `test/expiry.test.js`, `test/concurrency.test.js` |
| M01-V10 | Exact/repeated revoke advances only once; old-ID replay cannot revoke a replacement; removal of already-invalid material adds no credential revision. | `test/credentials.test.js`, `test/membership.test.js` |
| M01-V11 | Actual host recovery after total Manager credential loss preserves identity/roles/version and host origin. Unknown/non-Manager/removed/stale/misbound targets refuse. Controlled expired credentials cannot self-renew. | `test/credentials.test.js`, `test/expiry.test.js`, `test/persistence.test.js`, curl walkthrough |
| M01-V12 | Independent process holds writer. Configured cumulative exhaustion returns known 503/refused before body, with responsive HTTP reads; in-budget release admits exactly one execution per queued action. | `test/concurrency.test.js` |
| M01-V13 | Real bodies/SQLite distinguish pre-effect failure, confirmed rollback, uncertain commit and post-commit acknowledgement loss. Every HTTP mutation has rollback/drop coverage; bootstrap/recovery have process/fault evidence. No body replay; uncertain instances quarantine mutations; reads assert current facts only. | `test/faults.test.js`, `test/transport.test.js`, `test/persistence.test.js`, `test/policy.test.js` |
| M01-V14 | Actual post-commit process termination/restart retains original candidate/facts; absent/corrupt ordinary startup fails closed; explicit repeated setup preserves state. | `test/persistence.test.js` |
| M01-V15 | Maximum Unicode labels pass; excess/controls/malformed/unknown/duplicate/body/ID/revision input refuses. Exhaustion-only construction fixtures demonstrate no partial changes/wraparound; errors are bounded and redacted. | `test/validation.test.js` |
| M01-V16 | More than 100 actual admissions exercise default/max pages, tied order, filter-bound continuation, current status/readmission order and demotion between pages. | `test/directory.test.js` |
| M01-V17 | Agent-operated executable walkthrough uses actual CLI/HTTP/curl with owner configs; actor-specific observations include 200/401/403/409/no-store and host recovery. Additional HTTP tests provide 400/404/413/503/indeterminate. Ambient curl config and redirects cannot send credentials onward. | `scripts/walkthrough.js`, `.scratch/mf-mod-01/walkthrough-evidence.json`, `test/walkthrough.test.js`, `test/transport.test.js`, `test/validation.test.js`, `test/concurrency.test.js`, `test/faults.test.js` |

The retained walkthrough artifact contains 39 actual sanitized observations, including IDs, assignments, revisions, issuance/expiry and feedback categories. Generated credential/private request artifacts were deleted afterward. Permission checks use real files; descriptor handoff and recovery guidance were reviewed against the approved identity/secret-ownership contract. No human-owner manual acceptance is claimed. Future users can rerun the documented starting point.

Resolved implementation/test failures included the initially absent command/HTTP slices, final-gate expiry, empty directory filters, and an early HTTP-drop harness that destroyed a completed IncomingMessage rather than its socket. Competing host startup can safely refuse storage admission before observing the winning marker; subsequent trusted status/reruns establish initialization. A HTTP library's normal whitespace trimming is not treated as a wire secret-encoding test; interior malformed encoding is rejected. These fixes and observations did not change approved product policy.

## Owned requirements and remaining acceptance

| Owned requirement | Delivered local evidence | Remaining real-subject evidence |
| --- | --- | --- |
| MF-SCOPE-02 | Private singleton, current authentication, zero-role shared-read contract, bounded management directory | Modules 02/03/05/06 actual records, media and each continuation |
| MF-ACCESS-01 | Independent/combined roles, Manager-only management, self credential maintenance and full local policy matrix | Modules 02–06 actual role actions and Module 03 request ownership |
| MF-ACCESS-03 | Atomic current gate, revocation/expiry, competing versions, no membership cascade into minimal consumer facts | Module 03 real admitted work/accounting; Module 06 already-authorized transfers |
| MF-ACCESS-04 | Last Manager, stable actor/label snapshots, readmission/recovery, durable versions/credentials | Later dependency-pinned media/request/output/history facts |
| MF-CLIENT-01 | Pinned starting point, owner material, identified curl workflows and conservative recovery | Later sample files, processing, previews, review and Operations/Manager media workflows |

MF-AC-02/03/04 have **partial local evidence**, not whole-case passes. MF-AC-01/42/44 have Module 01 setup/client/error/verification contributions; complete release/educational/acceptance review is Gate 07. MF-AC-29/33/37/38/41 await their actual processing/review/deletion/history/listing subjects; actor snapshots and management pagination do not substitute for those cases.

| Participant | Delivered boundary/client convention | Outstanding integration scenario |
| --- | --- | --- |
| Module 02 | Current shared read and Contributor source admission; actor configs, bounded JSON feedback | Actual source admission/read/retrieval/each continuation, quotas/references/provenance/common feedback |
| Module 03 | Contributor request admission and stable actor attribution | Actual shared-source requests and authoritative submitter, retained work/counters/outcomes after removal; no Manager inheritance |
| Module 04 | Contributor-own/Operations-any retry/cancel and Operations guards | Eligible retry/cancel, evidence checks and safe provisional cleanup; MF-AC-29/combinations |
| Module 05 | Reviewer policy and stable attribution/current reads | Actual review/stale edits/revocation/output/preview reads; MF-AC-33 |
| Module 06 | Manager deletion/follow-up; current read versus authorized transfer distinction | Real deletion/cleanup/capacity/dependency lifetimes/history-only expiry and in-flight transfers; MF-AC-37/38 |
| MF-GATE-07 | Local evidence, reproducible workflow and explicit handoff | Full original MF-AC-02/03/04 and MF-AC-01/29/33/37/38/41/42/44, release/educational evidence and owner V1 acceptance |

Storage assumptions: persistent local disk, one authority host, protected DB/directory/sidecars, functioning WAL/FULL flush behavior and trusted OS operators. There is no network-filesystem/multi-host authority, damaged-storage recovery, backup platform, performance SLA or physical power-loss claim. The built-in SQLite adapter remains replaceable; its verified Node surface is pinned. There are no real media/work endpoints, unlimited action receipts or new product quotas.

## Final checks and review

Pending final full-suite run and the two independent review axes. This section will be updated with actual results before delivery.
