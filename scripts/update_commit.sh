#!/bin/bash

echo "⏰ Changing the last commit timestamp..."

# Generate a random number between 180 and 420 (3 to 7 minutes in seconds)
random_time=$(( (RANDOM % 241) + 180 ))

# Get the hash of the previous commit
previous_commit=$(git rev-parse HEAD^)

# Get the timestamp of the previous commit
previous_timestamp=$(git show -s --format=%ct $previous_commit)

# Calculate the new timestamp by adding the random time
new_timestamp=$(($previous_timestamp + $random_time))

# Update the commit timestamp
git rebase --committer-date-is-author-date --exec "git commit --amend --no-edit -n --date=$new_timestamp" $previous_commit
