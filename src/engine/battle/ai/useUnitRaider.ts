/*

const PREF = {
    survival: 2,
    kill: 1,
    wincon: 4,
}

A. Pre-processing
A1: assign to player units:
    - threat level
    - bounty value
A2: assign to tiles:
    - total threat of nearby units -> positive value
    - total bounty of nearby units -> negative value
    - wincon proximity -> positive value
A3: apply PREF coeficients to tile values

B. Check attack options
    simulate attack on each potential target, get value (damage * bounty * PREF ?)

C. Compare attack options (attack value + current tile value after attack) to move options (tile value + opportunity attack faced), pick best
    (challenge: evaluate the tile value after player moves, will that juicy target still be there ? bounty value lower if unit can still move ?)


*/