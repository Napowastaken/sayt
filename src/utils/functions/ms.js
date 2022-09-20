const names = {
    ms: ['millisecond', 'milliseconds', 'ms', 'millisec', 'millisecs',
    'msecond', 'mseconds', 'msec', 'msecs'],
    s: ['second', 'seconds', 's', 'sec', 'secs'],
    m: ['minute', 'minutes', 'm', 'min', 'mins'],
    h: ['hour', 'hours', 'h', 'hr', 'hrs'],
    d: ['day', 'days', 'd'],
    w: ['week', 'weeks', 'w', 'wk', 'wks'],
    y: ['year', 'years', 'y', 'yr', 'yrs']
}
const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365;

class MillisecondParser {
    constructor(time) {
        this.ms = time;
        this.seconds = this.ms / s;
        this.minutes = this.ms / m;
        this.hours = this.ms / h;
        this.days = this.ms / d;
        this.weeks = this.ms / w;
        this.years = this.ms / y;
        const strs = [];
        if (time >= y) { strs.push(~~(time / y) + 'y'); time %= y; }
        if (time >= d) { strs.push(~~(time / d) + 'd'); time %= d; }
        if (time >= h) { strs.push(~~(time / h) + 'h'); time %= h; }
        if (time >= m) { strs.push(~~(time / m) + 'm'); time %= m; }
        if (time >= s) { strs.push(~~(time / s) + 's'); time %= s; }
        const long = strs.map(s => s.replace(/[a-z]+/, match =>
        ` ${names[match][0]}${~~(this[names[match][1]]) != 1 ? 's' : ''}`))
        this.short = strs.join(' ') || `${this.ms}ms`; 
        this.long = long.join(', ') || `${this.ms} millisecond${this.ms != 1 ? 's' : ''}`;
        this.medium = `${long[0] || `${this.ms} millisecond${this.ms != 1 ? 's' : ''}`}${long[1] ? `, ${long[1]}` : ''}`
    }
}

class TimeStringParser extends MillisecondParser {
    constructor(time) {
        let ms = 0;

        const values = time.match(/\d+\.?\d*/g).map(v => Number(v));
        const timeKeys = time.match(/[a-z]+/gi).map(t => t.toLowerCase());

        for (let num = 0; num < values.length; num++) {
            let timeKey = Object.keys(names).find(n => names[n].includes(timeKeys[num]));
            let value = values[num];
            switch(timeKey) {
                case 'y': { ms += value * y } break;
                case 'w': { ms += value * w } break;
                case 'd': { ms += value * d } break;
                case 'h': { ms += value * h } break;
                case 'm': { ms += value * m } break;
                case 's': { ms += value * s } break;
                case 'ms': { ms += value } break;
            }
        }
        super(ms);
    }
}

module.exports = time => {
    if (typeof(time) == 'string') {
        const values = Object.values(names).map(n => n.join('|')).join('|')
        if (!new RegExp(`^(\\d+(\.\\d+)? ?(${values}),? ?)+$`, 'i').test(time))
        return null;
        return new TimeStringParser(time);
    }
    else if (typeof(time) == 'number') return new MillisecondParser(time);
    else return null;
}