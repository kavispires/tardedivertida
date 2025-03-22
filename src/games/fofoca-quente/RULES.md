# Setup

- Query students, locations, teachers, motives
- Build board with teachers
- Get 20 random students
- Chose 1 student from the selected to be the Gossip
- Shuffle civilians and place 2 on teach of the corner locations and then 1 on each other location
- Shuffle motives, choose 1 to be the motive
- Shuffle social-groups
- From 3 random ones, the gossip-bot chooses 1, the other 2 are removed from the game
- Shuffle remaining social groups

# Phase Pre-Game Setup

- Investigator chooses their starting position

# Gossip Phase

- Gossip intimidates 2 students if any, those students can not be in the same location of investigator

# Victimization phase

- The gossip strikes and victimizes one student if possible

# Reaction phase

- The investigator automatically moves to the location the student was just victimized if any.
- The investigator must move all students in the "crime scene" to adjacent locations that are not "crime scenes" and that have less than 3 students (if not possible, expand range by 1).

# Investigation phase

- May use surveillance if any
- May move up to 2 spaces
- Select one action
- Gossip-bot reacts to it
- May use surveillance if any
- May move up to 2 spaces (if any left)
- Select one action (not the first one)
- Gossip-bot reacts to it
- May use surveillance if any

- ACTIONS
  - Question student in the investigators location: ask 'is the gossip... ' (gender, socialGroup, build, height)
    - Gossip-bot may lie if the student is from the secret social group or if it is the gossip
  - Principal Action: place the surveillance token
    - No gossip-bot response
  - Lunch lady: question a student
    - Same as question student
  - Counselor: make an intimidated student unintimated
    - No gossip-bot response
  - Librarian: get a random social group and move the students in the group, one space
