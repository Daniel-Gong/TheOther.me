# Oria.me Docs

This folder contains the website-local docs for `oria.me`.

Backend contract internals are canonical in the sibling backend repo:

- [TheOtherME backend docs](../../TheOtherME/docs/backend/README.md)
- [TheOtherME integration docs](../../TheOtherME/docs/integrations/oria-me.md)

## Start Here

- [Architecture Overview](./architecture/overview.md)
- [Page and Module Map](./architecture/page-and-module-map.md)
- [Firestore Data Model](./architecture/firestore-data-model.md)
- [Firebase Project Setup](./setup/firebase-project.md)
- [Admin Access Setup](./setup/admin-access.md)
- [HTTP Endpoints Reference](./reference/http-endpoints.md)
- [Deploy and Verify](./operations/deploy-and-verify.md)

## Ownership Split

- `oria.me` docs own website runtime config, pages, JS modules, and deploy/ops.
- `TheOtherME` docs own backend contracts, backend internals, and shared Firebase function behavior.

## Quick map

- Need to configure Firebase or local runtime values? See `setup/`.
- Need page ownership or JS entrypoints? See `architecture/page-and-module-map.md`.
- Need endpoint payloads from the web client side? See `reference/`.
- Need deploy checklists? See `operations/`.
- Need backend contract behavior? Read the sibling `TheOtherME` docs first.

## Local dev note

If `js/config/runtime-config.js` is missing locally, copy `js/config/runtime-config.example.js` and fill your values.
