# Workspace setup and actor workflows

Use Node.js **24.22.0** from the official [Node distribution](https://nodejs.org/dist/v24.22.0/) and curl **8.x**. Confirm `node --version` and `curl --disable --version`. The CLI checks the exact Node patch and the adapter checks the selected SQLite API. `npm run check` performs JavaScript syntax/runtime checks; no TypeScript compiler was added to the approved JavaScript stack.

## Prepare and initialize

Run commands from the repository root. Database and credential paths must be absolute, with an existing owner-only, owner-controlled parent directory. Keep the database on persistent local disk on one trusted host. Configure its location explicitly on every host command; changing working directory never chooses another database.

```sh
umask 077
mkdir -p "$HOME/.mediaforge/operator" "$HOME/.mediaforge/owner"
chmod 700 "$HOME/.mediaforge/operator" "$HOME/.mediaforge/owner"
MF_DB="$HOME/.mediaforge/operator/workspace.sqlite"
MF_OWNER="$HOME/.mediaforge/owner/manager.owner.json"
node src/cli.js prepare --out "$MF_OWNER"
```

The owner keeps the `.owner.json` and `.owner.json.curl.conf` artifacts. The helper independently generates a UUID actor, 256-bit random secret, SHA-256 verifier and revision-bound random locator. Its normal output gives only identifiers and artifact paths. Files are exclusively created as 0600 and flushed, including the parent directory, before readiness. Existing files and symlink destinations are refused. Failed preparation reports incomplete artifacts; an empty/invalid descriptor is unusable. Preserve known-valid owner files. Inspect incomplete files locally and prepare a distinct destination after establishing their state; do not blindly overwrite or register incomplete material.

Only the separate `.owner.json.registration.json` descriptor goes to a Manager/operator. It has `actorId`, `credentialId`, `expectedCredentialRevision`, `registrationRevision`, and `verifier`; it has no secret. Confirm the recipient's identity and exact actor binding out of band. The service cannot identify a real person. A Manager/operator must never request someone else's owner file or curl config.

The trusted operator receives that descriptor, confirms the intended initial Manager and runs:

```sh
node src/cli.js status --db "$MF_DB"
node src/cli.js bootstrap --db "$MF_DB" \
  --descriptor /absolute/path/to/received.registration.json --label 'Initial Manager'
node src/cli.js serve --db "$MF_DB" --host 127.0.0.1 --port 8080
```

`bootstrap` deliberately creates/schema-initializes an absent store and atomically creates its single Manager-only actor. `setup --db "$MF_DB"` may explicitly prepare an uninitialized schema first. All initialized bootstrap attempts refuse, including identical candidates. `status` distinguishes absent, uninitialized, initialized and unavailable; it does not edit storage. Ordinary `serve` never creates a missing database. Schema version 1 setup is atomic and idempotent; unknown versions/stores refuse rather than being reset. There is no destructive recovery migration.

Loopback HTTP supports local development. Nonlocal binding requires HTTPS:

```sh
node src/cli.js serve --db "$MF_DB" --host 0.0.0.0 --port 8443 \
  --cert /absolute/path/to/server-cert.pem --key /absolute/path/to/server-key.pem
```

Use a properly trusted certificate and the matching HTTPS hostname in clients. No TLS bypass or proxy-termination design is provided. `--budget 1000` sets cumulative writer-acquisition milliseconds; `--body-limit 16384` sets the JSON control-body byte guard. Requests never use a long synchronous busy timeout.

## Actor-specific curl

An owner sets the config to their own private artifact, never a secret literal:

```sh
MF_BASE=http://127.0.0.1:8080
MF_CONFIG="$MF_OWNER.curl.conf"
curl --disable --config "$MF_CONFIG" --silent --show-error --fail-with-body "$MF_BASE/v1/me"
```

Keep `--disable` first, select exactly one owner config, and use `--json @/absolute/request.json` for writes. Do not add redirect-following or trace flags. Keep body files private with `umask 077`. Never put the bearer secret in arguments, shell history, transcripts or version control. `.private/`, owner files/configs and SQLite sidecars are ignored by Git. Optional jq may format public responses; it is not needed by the executable walkthrough.

The bearer wire encoding is `Bearer <credentialId>~<canonical-base64url-32-byte-secret>`. Neither the ID nor verifier authenticates. Only one Authorization header is accepted. Cookies, query tokens and role/actor claims never confer authority.

Every private response has `Cache-Control: no-store`, `result`, `reasonCategory`, `message`, and permitted `data`/`currentState`. Mutations additionally have `actionStatus`. Successful no-ops use `result: already_satisfied`, `effect: none`; they establish current state without claiming a past response was delivered. Reads have no historical `actionStatus`. Versions/revisions are positive decimal strings. Credential issuance/expiry are server ISO timestamps; expiry is at 30 elapsed days, including downtime, and inspection never renews it.

## Admission and edits

The recipient runs `prepare --out /their/private/member.owner.json`, shares only the descriptor and confirms identity. A Manager creates a request file by combining that descriptor with the exact chosen label and complete responsibility set. For example, run this locally on received descriptor material:

```sh
node --input-type=module - /absolute/received.registration.json /absolute/admission.json <<'JS'
import { readFileSync, writeFileSync } from 'node:fs';
const [descriptor, output] = process.argv.slice(2);
const registration = JSON.parse(readFileSync(descriptor, 'utf8'));
writeFileSync(output, JSON.stringify({
  label: 'New member', responsibilities: [], registration
}), { mode: 0o600, flag: 'wx' });
JS
```

Set `MF_ACTOR` to the prepared actor ID (a non-secret). With the Manager's config:

```sh
curl --disable --config "$MF_CONFIG" --silent --show-error --fail-with-body \
  --request PUT --json @/absolute/admission.json "$MF_BASE/v1/actors/$MF_ACTOR"
```

The independent roles are `Contributor`, `Reviewer`, `Operations`, `Manager`. Any combination or `[]` is valid. Manager has no role inheritance. A zero-role member can inspect self and has the shared-read policy contract; actual media/records arrive in Modules 02–06. Switch to that actor by choosing their own config on their client, then call `/v1/me`. `/v1/actors` and other-actor inspection require Manager; zero-role management yields 403.

To edit, put this JSON in a separate private file:

```json
{
  "expectedMembershipVersion": "1",
  "label": "Updated label",
  "responsibilities": ["Contributor", "Reviewer"]
}
```

```sh
curl --disable --config "$MF_CONFIG" --silent --show-error --fail-with-body \
  --request PATCH --json @/absolute/edit.json "$MF_BASE/v1/actors/$MF_ACTOR"
curl --disable --config "$MF_CONFIG" --silent --show-error --fail-with-body \
  "$MF_BASE/v1/actors/$MF_ACTOR"
```

Supply label and/or a full desired assignment set, with the observed version. Incompatible stale versions return 409 and current permitted facts. Reconsider the newer decision before making a deliberate new edit; matching absolute state makes no new version/time/attribution. A Manager may demote/remove themselves only when another admitted Manager remains, even if that other Manager's credential is expired/revoked.

Directory queries use `limit` (default 50, maximum 100), exact `actorId`, `membership=admitted|removed`, and `cursor`. Order is first-admission time descending, then actor ID descending. Use `--get --data-urlencode "cursor=$MF_CURSOR"` with the original filters and endpoint; every page checks current Manager authority. A cursor is an order boundary, never an authority token or snapshot. Readmission keeps first-admission order; current facts can change between pages.

## Removal, readmission and credentials

All bodies use the same curl pattern, adding the method and path below. Table entries show request-file contents; descriptors are embedded as objects, never owner files.

| Method/path relative to `/v1/actors/$MF_ACTOR` | JSON body                                                                                                                    | Guard                                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| POST `/remove`                                 | `{"expectedMembershipVersion":"2"}`                                                                                          | Current Manager; preserves an admitted Manager                |
| POST `/readmit`                                | `{"expectedMembershipVersion":"3","expectedCredentialRevision":"2","responsibilities":[],"registration":<fresh descriptor>}` | Removed exact actor; fresh next-revision material             |
| GET `/credential`                              | None                                                                                                                         | Self or Manager; preparation/current non-secret metadata      |
| POST `/credential`                             | `{"expectedCredentialRevision":"3","registration":<fresh descriptor>}`                                                       | Current self credential or Manager for another admitted actor |
| POST `/credentials/$MF_CREDENTIAL/revoke`      | `{}`                                                                                                                         | Current owner or Manager; exact credential ID                 |

Removal clears assignments and invalidates credentials without deleting identity or admitted consumer facts. Removed callers get 401 on future calls. Readmission preserves the actor ID and historical first-admission snapshot and requires explicit assignments and fresh next-revision credentials. A different person with the same label gets a new ID.

Before replacement/readmission, inspect permitted current metadata. The owner prepares new material with:

```sh
node src/cli.js prepare --out /owner/private/replacement.owner.json \
  --actor "$MF_ACTOR" --revision "$MF_OBSERVED_CREDENTIAL_REVISION"
```

The descriptor carries observed revision and its intended next registration revision. Only the descriptor goes to the administering party. Self replacement needs no Manager role and invalidates the previous credential atomically. The saved candidate's config is used to inspect `/v1/me` after a lost response. A third-party Manager replacement refuses stale revisions. Exact-current non-revoked confirmation preserves original time/expiry/attribution, including an expired candidate inspected by another authorized Manager. Superseded/revoked candidates cannot be registered again.

Exact revocation advances credential revision only once and never targets a replacement. An old-ID revoke after replacement returns 409. Repeating the current invalidation adds no effect. After self-revocation, ask an authorized Manager for current inspection/replacement; the revoked owner cannot authenticate or renew itself.

## Trusted host recovery and uncertain outcomes

For total Manager credential loss, the operator targets an existing admitted Manager:

```sh
node src/cli.js recovery-status --db "$MF_DB" --actor "$MF_ACTOR"
node src/cli.js recover --db "$MF_DB" --actor "$MF_ACTOR" \
  --revision "$MF_OBSERVED_CREDENTIAL_REVISION" --descriptor /absolute/received.registration.json
```

Recovery registers the owner's prepared next-revision material, preserves membership/roles/labels/identity and records host-operator origin plus local OS UID. Removed/non-Manager/unknown/stale targets refuse. It cannot readmit, grant roles or reset bootstrap. There is no HTTP recovery/setup endpoint. The owner verifies the saved candidate with `/v1/me`; recovery confirmation never refreshes expiry.

| Observation                                  | What is established                                                 | Next step                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 400/413 invalid input                        | No effect                                                           | Correct input, retaining exact identities                                                 |
| 401/403                                      | Current authentication/authority denies                             | Use supported current Manager/operator inspection; do not infer a past lost action failed |
| 404 after applicable authorization           | Permitted target/route absent                                       | Recheck exact target and supported route                                                  |
| 409 stale/binding/last-Manager conflict      | This action refused without effect; permitted facts may be supplied | Inspect, reconsider and use newly observed state for deliberate new intent                |
| 503 + `refused_without_effect`, `contention` | No mutation body ran within the cumulative budget                   | Inspect and reconsider once contention clears                                             |
| 503 + `indeterminate`                        | Commit knowledge is unestablished                                   | Inspect exact saved actor/candidate/credential; never blindly create another effect       |
| Disconnection or absent command response     | Client does not know outcome                                        | Use the same exact identities and supported inspection                                    |

Admission recovery looks up the prepared actor ID, not a new ID. Edit/removal recovery inspects current version and latest bounded facts. Credential recovery tries the saved candidate and inspects exact metadata. Bootstrap recovery uses candidate authentication and trusted `status`: initialized stores never reset/rerun successfully. Same-candidate retry requires trustworthy non-initialization and absence of an earlier still-active attempt. If another candidate won, do not adopt its identity. Operator recovery similarly inspects target/revision before reconsidering.

There is no full administration event archive. Subsequent changes can hide proof of an earlier action; current facts cannot reconstruct every historical outcome. Uncertain writable storage is quarantined on that service instance. Inspect established facts and restore storage trust before restarting; a restart does not itself prove a lost action failed. Local WAL/FULL durability assumes functioning storage/flush semantics; process-kill tests do not prove physical power-loss recovery.

## Reproducible walkthrough

```sh
node scripts/walkthrough.js
```

This creates an isolated temporary workspace, uses actual owner preparation/host commands and curl configurations, exercises each role alone/combined/zero, membership edits/denials/stale state/removal/readmission, self/Manager replacement, exact revocation and total-Manager-loss operator recovery, and prints actor/version/status observations without secrets/verifiers. It deletes the private temporary artifacts. The [verification ledger](verification.md) identifies the additional contention/fault/clock/policy tests and future integration obligations.
