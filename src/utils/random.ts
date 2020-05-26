export function shuffle(a : Array<any>) : Array<any> {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function pickFrom<T>(a : Array<T>, count : number) : Array<T> {
    const shuffled = shuffle(a);
    return shuffled.slice(0, count);
}