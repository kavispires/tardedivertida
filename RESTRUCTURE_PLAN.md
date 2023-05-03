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

/meta
/users
/global/usedGameIds
/global/usedArteRuimCards
/global/usedImageCards
/global/usedAliemItems
/global/usedMurderObjects
/global/usedOpposingIdeas
/global/usedContenders
/global/usedChallenges
/global/usedMonsters
/global/usedSuspects
/global/usedGroupQuestions
/global/usedTestimonyQuestions
/global/usedMoviesAndReviews
/global/usedSingleWords

/data/drawings
/data/monsterDrawings
/data/imageCardStoryEn
/data/imageCardStoryPt
/data/cardStoryPt
/data/cardStoryEn
/data/opposingIdeasClues
/data/contenderGlyphs
/data/suspectAnswers

/public/ratings
