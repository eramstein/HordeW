import { UNITS } from "../../data/units/units"
import { Pos } from "./model";

export function makeUnit(template : string, faction : string, pos : Pos) {
    const unit = UNITS[template];
    unit.owner = faction;
    unit.position = pos;
    unit.hp = unit.hpMax;
    unit.morale = unit.moraleInit;
    return unit;
}