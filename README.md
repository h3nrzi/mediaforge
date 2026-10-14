# Mediaforge

Module 01 provides a private single workspace, current member responsibilities, owner-held bearer credentials and host-only Manager recovery. Media intake and processing belong to later modules.

Install **Node.js 24.22.0** (pinned in `.nvmrc`; the CLI refuses other versions) and curl 8.x. There are no application dependencies or compiler requirements.

```sh
node --version
npm run check
npm test
node scripts/walkthrough.js
```

The walkthrough runs an isolated real HTTP/SQLite/command workflow and prints non-secret evidence. It removes its temporary credential files and database afterward.

For a persistent workspace, follow [setup and actor workflows](docs/module-01/client.md). Future modules must use the [atomic consumer contract](docs/module-01/authority.md). [Verification and integration handoff](docs/module-01/verification.md) tracks local evidence and outstanding product acceptance.
