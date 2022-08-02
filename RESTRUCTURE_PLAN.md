# Current Structure of a Session

/meta -> general information about a game, read on load only
/players -> keeps track of every update about players (observed in the UI)
/state -> keeps track of game state (observed in the UI)
/store -> keeps track of internal game stuff (not used in the UI)

# Proposed structure

/meta -> general information about the game (observed even though few to none changes)
/players -> object inside meta with unchanged player info
id
avatarId
name
gender
/store
/players -> internal information about players like deck, in-game things like vote, etc
/state
/players
