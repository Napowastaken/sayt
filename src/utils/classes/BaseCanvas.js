const Canvas = require('canvas');
module.exports = class BaseCanvas {

    /**
     * @param {string} text The text to fit with newlines.
     * @param {number} space The amount of characters needed to create a newline.
     */
    static fitText(text, space) {
        return text.match(new RegExp(`(.{1,${space}}(\\s|$)|.{${space}})`, 'g')).map(t => t.trim()).join('\n');
    }

    async #init(w, h, bg) {
        const canvas = Canvas.createCanvas(w, h);
        const ctx = canvas.getContext('2d');
        ctx.strokeRect(0, 0, w, h);
        if (bg) {
            if (/#[a-f0-9]{6}/.test(bg)) {
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, w, h);
            } else {
                ctx.drawImage(bg.constructor != Canvas.Canvas ? await Canvas.loadImage(bg) : bg, 0, 0, w, h);
            }
        }
        this.ctx = ctx;
        this.canvas = canvas;
        return this;
    }

    /**
     * @param {number} size 
     * @param {string} image - A path or an URL.
     */
    async circle(size, image) {
        const canvas = Canvas.createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.closePath();
        ctx.drawImage(await Canvas.loadImage(image), 0, 0, size, size);
        return canvas;
    }

    /** 
     * @param {number} width
     * @param {number} height
     * @param {string} [background] - Either a hex code, path, canvas or URL
     */
    constructor(width, height, background) {
        return Promise.resolve(this.#init(width, height, background));
    }
}