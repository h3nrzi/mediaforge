# MF-MOD-01 independent implementation review

Fixed point: `ffb6bb1fd905513b5304e539b706cccb0c2542df` (original implementation starting point).
Initial diff: `git diff ffb6bb1fd905513b5304e539b706cccb0c2542df...7020175`.
Implementation commit: `7020175 Implement private workspace and current member authority (MF-MOD-01)`.
Re-review: working-tree correction against that commit, plus the original diff. Two independent sub-agents reviewed Standards and Spec separately. Date: 2026-10-15.

## Standards

Initial report:

1. **Documented-standard breach — P2:** `src/store.js` rethrew `Refusal` even when rollback failed. ADR-0002 Q13 requires distinguishing confirmed rollback from unestablished state. An executed consumer could throw `Refusal`; failed rollback quarantined storage but still reported `refused_without_effect`. Required: classify admitted failures without confirmed rollback as indeterminate and add regression coverage.
2. **Judgement call — possible Duplicated Code:** bootstrap and admission independently constructed the same initial actor shape. A shared initial-actor constructor would keep initial attribution/revision facts consistent.

Re-review: **0 remaining findings.** The rollback fix preserves a domain refusal only before admission or after confirmed rollback; unestablished outcomes become indeterminate and quarantine mutations. The new regression exercises the missed failure combination. `initialActor` resolves duplicated initialization. Route preflight and clarified trusted-consumer docs add no documented-standard breaches or actionable baseline smells.

Initial reproduction used the ambient runtime to inspect the catch branch; it was not counted as pinned-runtime acceptance. The parent reran the regression and full suite on the approved Node.js 24.22.0.

## Spec

Initial report:

- **P1 — Uncertain rollback can be reported as a known refusal:** specification §7 requires “Confirmed rollback is refused without effect” and “Lost commit/response knowledge is indeterminate.” A consumer write followed by `Refusal` and failed rollback could still report `refused_without_effect`. Required: preserve the domain refusal only when rollback/non-admission is established; otherwise return indeterminate 503 and quarantine mutations, with a regression test.

Re-review: **0 remaining findings.** Domain refusals now survive only after established non-admission or confirmed rollback; other outcomes become 503/indeterminate with quarantine. The regression includes a real consumer write before rollback failure. Route preflight and clarified trusted-consumer documentation match the specification. No additional missing requirements, incorrect behavior or scope creep found.

Standards: 0 remaining findings; Spec: 0 remaining findings. The initial highest-severity issue within both axes was incorrect effect certainty after failed rollback, now resolved and covered by the passing full suite.
