# Release Prep Instructions

Use these steps when preparing `@accretion-ui/react` and `@accretion-ui/angular` for npm publishing.

## Versioning

1. Update the root workspace version in `package.json`.
2. Update package versions in:
   - `packages/react/package.json`
   - `packages/angular/package.json`
   - `packages/core/package.json`
   - `chromatic/react/package.json`
   - `chromatic/angular/package.json`
   - `smoke-apps/react-next/package.json`
   - `smoke-apps/angular-ssr/package.json`
3. Keep the smoke app package dependencies aligned with the new package versions.

## Build And Validation

1. Run `npm run build`.
2. Run `npm test`.
3. Run `npm run smoke`.
4. Run `npm run validate:ssr`.
5. Verify Angular package consumption in a real Angular SSR app if the package assembly or entry-point exports changed.

## Chromatic

1. Ensure `CHROMATIC_PROJECT_TOKEN_REACT_MITOSIS` and `CHROMATIC_PROJECT_TOKEN_ANGULAR_MITOSIS` are available in the environment.
2. Run `npm run chromatic:react`.
3. Run `npm run chromatic:angular`.
4. Update Storybook links in:
   - `README.md`
   - `packages/react/README.md`
   - `packages/angular/README.md`

## Publish Artifact Checks

1. Run `npm pack --dry-run` in `packages/react`.
2. Run `npm pack --dry-run` in `dist/packages/angular`.
3. Confirm the Angular dist package contains the assembled `core/src` files and the correct rewritten import paths.

## npm Publish

1. Publish React from `packages/react`:
   - `npm publish --access public`
2. Publish Angular from `dist/packages/angular`:
   - `npm publish --access public`
3. Verify the published version with:
   - `npm view @accretion-ui/react version`
   - `npm view @accretion-ui/angular version`

## Developer Application Testing

The folder `DEVELOPER_APPLICATION_TESTING` contains disposable consumer apps for human review:

This is a separate manual review workflow. It is not part of the standard npm
build, validation, Chromatic, or publish process unless someone explicitly
chooses to run it.

- `DEVELOPER_APPLICATION_TESTING/next-ssr-app`
- `DEVELOPER_APPLICATION_TESTING/angular-ssr-app`

Use the latest published packages when refreshing those apps:

- `@accretion-ui/react@latest`
- `@accretion-ui/angular@latest`

### Build And Run The Existing Apps

Use this section only when a human wants to manually review the published
packages in standalone framework apps.

1. For the Next.js app:
   - `cd DEVELOPER_APPLICATION_TESTING/next-ssr-app`
   - `npm install`
   - `npm install @accretion-ui/react@latest`
   - `npm run dev -- --hostname 127.0.0.1 --port 3005`
2. For the Angular SSR app:
   - `cd DEVELOPER_APPLICATION_TESTING/angular-ssr-app`
   - `npm install`
   - `npm install @accretion-ui/angular@latest`
   - `npm start -- --host 127.0.0.1 --port 4405`

### Human Review Checklist

1. Open the Next.js routes:
   - `http://127.0.0.1:3005/`
   - `http://127.0.0.1:3005/live`
2. Open the Angular routes:
   - `http://127.0.0.1:4405/`
   - `http://127.0.0.1:4405/live`
3. On each home route, verify:
   - the package version line shows the expected package
   - the multi-select accordion supports the expand and collapse controls
   - the custom trigger content item opens correctly with the default indicator hidden
   - the disabled item remains disabled
   - the single-select accordion updates the active section summary
4. On each live route, verify:
   - the route loads successfully
   - the server-rendered timestamp is present
   - the accordion is interactive after hydration

### Delete The Apps

1. Stop the running dev servers.
2. Remove the app folders:
   - `rm -rf DEVELOPER_APPLICATION_TESTING/next-ssr-app`
   - `rm -rf DEVELOPER_APPLICATION_TESTING/angular-ssr-app`
