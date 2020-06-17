import { State } from '../../../stores';
import { Log, LogType, LogResult } from "../../../engine/battle/model";
import { getSoundFileName, SOUNDS_PATH } from "./sounds";
import { ActionLabel } from "../../model";
export const LOG_ANIMATION_DURATION = 750;

export function animateLog(logs : Log[]) : number {
    let animationsTime = logs.length * LOG_ANIMATION_DURATION; // TODO: specific duration depending on log type
    const audioElement = document.querySelector('#audio') as HTMLMediaElement;
    //console.log('animateLog', JSON.parse(JSON.stringify(logs)), new Date().getTime());
    logs.forEach((log, i) => {
        // SOUND
        const soundSrc = getSoundFileName(log);        
        if (soundSrc) {
            setTimeout((soundSrc) => {
                audioElement.src = SOUNDS_PATH + soundSrc;
                audioElement.play();
            }, i * LOG_ANIMATION_DURATION, soundSrc);
        }
        // ACTION LABEL
        const labels = getActionLabels(log);        
        setTimeout(() => {
            //console.log('SET LABELS', labels.map(l => l.text), new Date().getTime());
            State.setActionLabels(labels);
        }, i * LOG_ANIMATION_DURATION);
    });
    setTimeout(() => {
        //console.log('RESET LABELS', new Date().getTime());
        State.setActionLabels([]);
    }, animationsTime);
    return animationsTime;
}

export function getActionLabels(log : Log) : ActionLabel[] {
    const labels : ActionLabel[] = [];

    if (log.type === LogType.Attack) {        
        if (log.result === LogResult.Miss) {
            labels.push({
                unit: log.target,
                color: 'green',
                text: 'MISS',
                isPlayer: log.currentFaction === 0,
            });
        } else {
            labels.push({
                unit: log.entity,
                color: 'black',
                text: 'WHAAAG',
                isPlayer: log.currentFaction === 0,
            });
        }
    }
    if (log.type === LogType.Damage) {
        labels.push({
            unit: log.entity,
            color: 'red',
            text: log.data.damage,
            isPlayer: log.currentFaction === 0,
        });
    }
    if (log.type === LogType.Ability) {
        labels.push({
            unit: log.entity,
            color: 'black',
            text: log.data.name,
            isPlayer: log.currentFaction === 0,
        });
    }
    if (log.type === LogType.Pass) {
        labels.push({
            unit: log.entity,
            color: 'black',
            text: 'PASS',
            isPlayer: log.currentFaction === 0,
        });
    }

    return labels;
}