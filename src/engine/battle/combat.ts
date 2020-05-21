/*
Goals:
- computable by humans (small numbers)
- some randomness (compensated by monk/witch ?)
- usual time to kill 2/4 hits

Usual ranges:
ATK, DEF : 1-5
RANGE ATK: 1-5
RANGE DEF : 0-2 (distance will compensate)
RANGE: 1-3 (archers), 4-9 (artillery)
ARMOR: 0-3
HP: 5-20
DAMAGE: 1-8
MORALE: 5-12

Melee
1. hit chance: ATK - DEF
    +3 -> 100%
    +2 -> 90% -> +1 monk point if miss
    +1 -> 66%
     0 -> 50%
    -1 -> 33%
    -2 -> 10% -> +1 witch point if hit
    -3 -> 0%

    if miss, -1 DEF until EOT
    or: morale penalty?

2. damage: damage roll - armor
    if armor absorbs all, 20% chance to lose 1 armor    

Range
1. hit chance: ATK - DEF - distance
2. damage: same

Morale effects: TBD

Disengage while in melee: TBD

Flanking effects: TBD

*/