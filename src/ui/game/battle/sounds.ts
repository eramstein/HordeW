import { Log, LogType, LogResult } from "../../../engine/battle/model";

const SOUDNDS_PATH = '/assets/sounds/';
const FILES = {
    'Damage': 'chtonk.mp3',
    'AttackMiss': 'poc.wav',
};

export function playSounds(logs : Log[]) {
    const audioElement = document.querySelector('#audio') as HTMLMediaElement;
    logs.forEach(log => {
        const src = getFileName(log);        
        if (src) {
            audioElement.src = SOUDNDS_PATH + src;
            audioElement.play();
        }
    });
}

function getFileName(log : Log) : string {
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