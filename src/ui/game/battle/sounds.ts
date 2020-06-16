import { Log, LogType, LogResult } from "../../../engine/battle/model";

export const SOUNDS_PATH = '/assets/sounds/';

const FILES = {
    'Damage': 'chtonk.mp3',
    'AttackMiss': 'poc.wav',
};

export function getSoundFileName(log : Log) : string {
    let fileName = null;
    switch (log.type) {        
        case LogType.Attack:            
            if (log.result === LogResult.Miss) {
                fileName = FILES.AttackMiss;
            }
            break;

        case LogType.Damage:            
            fileName = FILES.Damage;
            break;
    
        default:
            break;
    }
    return fileName;
}