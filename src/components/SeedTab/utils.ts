export const calculateTime = (time: number) => {
    const h = Math.floor(time / (60 * 60 * 1000));
    const hours = h < 0 ? 0 : h;
    const m = Math.floor((time % (60 * 60 * 1000) / (60 * 1000)));
    const minutes = m < 0 ? 0 : m;
    const s = Math.floor((time % (60 * 1000)) / 1000);
    const seconds = s < 0 ? 0 : s;
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

export const calculatePercent = (sumSpan: number, completedSpan: number) => {
    const percent = Math.floor((completedSpan / sumSpan) * 100);

    return percent < 0 ? 0 : percent;
}