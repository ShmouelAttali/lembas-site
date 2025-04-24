import {HDate} from "@hebcal/core";

export function getNextMDates(n: number) {
    const out: { date: Date; label: string }[] = [];
    let d = new Date();
    const weekdayFmt = new Intl.DateTimeFormat('he-IL', { weekday: 'long' });
    const gregFmt    = new Intl.DateTimeFormat(undefined, { day: '2-digit', month: '2-digit' });

    while (out.length < n) {
        d = new Date(d.getTime() + 86_400_000);
        if (d.getDay() === 1 || d.getDay() === 4) {
            const weekday = weekdayFmt.format(d).replace(/^יום\s*/, '');
            const hd      = new HDate(d);
            const [dayMon] = hd.renderGematriya(true).split(' תש'); // "כ"ו ניסן"
            const greg    = gregFmt.format(d);
            out.push({ date: d, label: `${weekday} - ${dayMon} (${greg})` });
        }
    }
    return out;
}