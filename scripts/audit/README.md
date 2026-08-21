# Game audits

The metadata report runs every `.cjs` module in this directory for each eligible game.

## Trigger an audit

Run `yarn game-metadata`, choose option `3. Run Report`, and enter either a game name or `.` to audit all games. The report is written to `src/games/<game-name>/metadata.md` under `### Report`.

## Add an audit

Create a new `.cjs` file in this directory that exports an `id` and a `run` function:

```js
module.exports = {
  id: 'my-audit',
  run: (gameInfo, gameDir, gameFolderPath) => ({
    label: 'My Audit',
    passed: Boolean(gameInfo.someProperty),
    error: gameInfo.someProperty ? null : 'someProperty is missing',
  }),
};
```

The `run` arguments are:

- `gameInfo`: Parsed `src/games/<game-name>/game-info.json`.
- `gameDir`: The game directory name.
- `gameFolderPath`: Absolute path to the game directory.

Return an object with `label`, `passed`, and an optional `error`. Every `.cjs` file in this directory is loaded automatically on the next report run; no registration step is required.

Built-in audits include `Background Class`, which verifies that `utils/styles.scss` contains a `.background` selector for the game.
