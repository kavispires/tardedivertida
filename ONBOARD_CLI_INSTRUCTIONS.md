# ONBOARD GAME CLI INSTRUCTIONS

## Backend/functions instructions

- Greet the user that you will set up the backend of the game
- Prompt user about the `name` of the game (all small caps, single string with no spaces)
- Prompt user about the `code` which is a single capital letter

- Update `GAMES` in `functions/src/utils/constants.ts` with a new object entry with:
```
{
  name: string; // the name given by the user
  code: string; // the code given by the user
  key: string; // convert the name into all uppercase and replace any `-` for `_`
}
```

- In the folder `functions/src/engine/` created a folder using the `name`.
- Inside of this new folder, run `touch actions.ts constants.ts data.ts helpers.ts index.ts setup.ts types.d.ts`


