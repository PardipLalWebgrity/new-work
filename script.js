const CPicker = {

    /* ---------------------------API ------------------------*/
    getCordinateFromRGB: function(rgb) {
        const hsv = CPicker.rgb2hsv(rgb);
        const xy = CPicker.hsvToSVCoordinates(hsv);
        return xy;
    },

    getRGBThroughSVBoxXY: function(x, y) {
        const hsv = CPicker.getHSVFromSVBoxThroughXY(x, y);
        const rgb = CPicker.hsv2rgb(hsv);
        return rgb;
    },

    updateUIByCSSRGBA(cssRGBA) {
        const rgba = cssRGBA.split('(')[1].split(')')[0].split(',');
        if (rgba.length === 3) rgba.push('1');
        CPicker.rgba.r = rgba[0];
        CPicker.rgba.g = rgba[1];
        CPicker.rgba.b = rgba[2];
        CPicker.rgba.a = rgba[3];

        // SV Box Pointer
        const xy = CPicker.getCordinateFromRGB(CPicker.rgba);
        this.id.cpickerSvboxPointer.style.left = xy.x - 6 + 'px';
        this.id.cpickerSvboxPointer.style.top = xy.y - 4 + 'px';

        // SV Box Color
        const hsv = CPicker.rgb2hsv(CPicker.rgba);
        const rgb = CPicker.hueToRGB(hsv.h);
        this.id.cpickerSvbox.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        CPicker.hsv = hsv;
    },


    updateUIs: function(uis) {

        // SV Box        
        // Hue Slider
        // Alpha Slider
        // RGB Inputs
        // Alpha Input

    },

    updateAlphaSliderUI: function(rgba) {
        this.id.cpickerAlphasliderBg.style.background = `linear-gradient(to right, rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 0) 0%, rgb(${rgba.r}, ${rgba.g}, ${rgba.b}) 100%)`
    },    

    updateRGBAInputs: function(rgb) {
        this.id.inputrgbR.value = rgb.r;
        this.id.inputrgbG.value = rgb.g;
        this.id.inputrgbB.value = rgb.b;
    },

    updateHexInput: function(rgb) {
        const hexValue = CPicker.rgbToHex(rgb);
        this.id.inputhex.value = hexValue;
    },

    updateAlphaInput: function(){

    },

    updateSVBoxPointerUIByPointerEvent: function(e) {
        const rgb = CPicker.getRGBThroughSVBoxXY(e.clientX, e.clientY);
        const rgbCSS = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        result.style.backgroundColor = rgbCSS;

        let x = e.clientX - 6;
        let y = e.clientY - 6;
        if (x > CPicker.svBoxWidth - 6) x = CPicker.svBoxWidth - 6;
        if (y > CPicker.svBoxHeight - 6) y = CPicker.svBoxHeight - 6;
        if (x < 0) x = -6;
        if (y < 0) y = -6;

        CPicker.id.cpickerSvboxPointer.style.left = x + 'px';
        CPicker.id.cpickerSvboxPointer.style.top = y + 'px';

        CPicker.updateAlphaSliderUI(rgb);
        CPicker.updateRGBAInputs(rgb);
        CPicker.updateHexInput(rgb);        
    },


    /* -------------------------------------------------------*/

    rgba: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
    },

    hsv: {
        h: 0,
        s: 0,
        v: 100,
    },

    id: {},

    svBoxWidth: 0,
    svBoxHeight: 0,

    collectElements: function() {
        this.id.cpicker = document.querySelector('#cpicker');
        this.id.cpickerCodeswitch = document.querySelector('#cpicker-codeswitch');
        this.id.cpickerInputsWrapper = document.querySelector('#cpicker-inputs-wrapper');
        this.id.cpickerInputAlpha = document.querySelector('#cpicker-input-alpha');
        this.id.cpickerSvbox = document.querySelector('#cpicker-svbox');
        this.id.cpickerSvboxPointer = document.querySelector('#cpicker-svbox-pointer');
        this.id.colorpalate = document.querySelector('#colorpalate');
        this.id.cpickerAlphasliderBg = document.querySelector('#cpicker-alphaslider-bg');

        this.id.inputsliderHue = document.querySelector('#inputslider-hue');

        this.id.inputrgbR = document.querySelector('#inputrgb-r');
        this.id.inputrgbG = document.querySelector('#inputrgb-g');
        this.id.inputrgbB = document.querySelector('#inputrgb-b');

        this.id.inputhex = document.querySelector('#inputhex');
    },

    updateAdditionalData() {
        CPicker.svBoxWidth = this.id.cpickerSvbox.offsetWidth;
        CPicker.svBoxHeight = this.id.cpickerSvbox.offsetHeight;
    },

    cpickerCodeswitchEventCallback: function(e) {
        const value = CPicker.id.cpickerCodeswitch.value;
        const codeBlockEl = document.querySelector(`.cpicker-inputs-${value}`);
        [...CPicker.id.cpickerInputsWrapper.children].forEach((el) => {
            el.classList.remove('show');
        })
        codeBlockEl.classList.add('show');
        CPicker.id.cpickerInputAlpha.classList.add('show');

    },

    events: function() {
        this.id.cpickerCodeswitch.addEventListener('change', this.cpickerCodeswitchEventCallback);
        this.id.colorpalate.addEventListener('click', CPicker.click);
        this.id.cpickerSvbox.addEventListener('pointerdown', CPicker.pointerDown);
        this.id.cpickerSvbox.addEventListener('pointermove', CPicker.pointerMove);
        this.id.cpickerSvbox.addEventListener('pointerup', CPicker.pointerUp);
        this.id.inputsliderHue.addEventListener('input', CPicker.hueSliderInput)
    },

    rgb2hsv: function(rgb) {
        // Step 1 - Normalize
        const normRGB = {
            r: rgb.r / 255,
            g: rgb.g / 255,
            b: rgb.b / 255,
        }

        // Step 2 - Min, Max, Delta
        const min = Math.min(...Object.values(normRGB));
        const max = Math.max(...Object.values(normRGB));
        const delta = (max - min);

        // Step 3 - V & S
        const v = Math.round(max * 100);
        const s = Math.round((max == 0 ? 0 : delta / max) * 100);

        // Step 4 - H
        let h = 0;
        if (max == normRGB.r) h = 60 * ((normRGB.g - normRGB.b) / delta);
        if (max == normRGB.g) h = 60 * ((normRGB.b - normRGB.r) / delta + 2);
        if (max == normRGB.b) h = 60 * ((normRGB.r - normRGB.g) / delta + 4);
        if (delta == 0) h = 0;
        if (h < 0) h += 360;
        h = Math.round(h)

        return { h, s, v };
    },

    hsv2rgb: function(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s;
            v = h.v;
            h = h.h;
        }

        h = h / 360;
        s = s / 100;
        v = v / 100;

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    },

    hsvToSVCoordinates: function(hsv) {
        const x = (hsv.s / 100) * CPicker.svBoxWidth;
        const y = (1 - hsv.v / 100) * CPicker.svBoxHeight;
        return { x, y };
    },

    valueToHex: function(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },

    rgbToHex: function(rgb) {
        return "#" + CPicker.valueToHex(rgb.r) + CPicker.valueToHex(rgb.g) + CPicker.valueToHex(rgb.b);
    },

    getHueGradientColorAt: function(percent) {
        let rgb = null;
        const stops = [
            { pct: 0, color: [255, 0, 0] }, // red
            { pct: 16.66, color: [255, 255, 0] }, // yellow
            { pct: 33.33, color: [0, 255, 0] }, // green
            { pct: 50.00, color: [0, 255, 255] }, // cyan
            { pct: 66.66, color: [0, 0, 255] }, // blue
            { pct: 83.33, color: [255, 0, 255] }, // magenta
            { pct: 100.0, color: [255, 0, 0] } // red again
        ];

        // Clamp percentage
        percent = Math.max(0, Math.min(100, percent));

        // Find the two surrounding stops
        for (let i = 0; i < stops.length - 1; i++) {
            const stop1 = stops[i];
            const stop2 = stops[i + 1];

            if (percent >= stop1.pct && percent <= stop2.pct) {
                const range = stop2.pct - stop1.pct;
                const ratio = (percent - stop1.pct) / range;

                const r = Math.round(stop1.color[0] + (stop2.color[0] - stop1.color[0]) * ratio);
                const g = Math.round(stop1.color[1] + (stop2.color[1] - stop1.color[1]) * ratio);
                const b = Math.round(stop1.color[2] + (stop2.color[2] - stop1.color[2]) * ratio);

                rgb = { r, g, b };
            }
        }

        // Fallback
        return rgb;
    },

    getHSVFromSVBoxThroughXY: function(x, y) {
        const h = CPicker.hsv.h;
        x = Math.max(0, Math.min(CPicker.svBoxWidth, x));
        y = Math.max(0, Math.min(CPicker.svBoxHeight, y));

        const s = (x / CPicker.svBoxWidth) * 100;
        const v = (1 - y / CPicker.svBoxHeight) * 100;

        return { h, s, v };
    },

    hueToRGB: function(H) {
        let S = 1;
        let V = 1;

        let h = H / 60;
        let i = Math.floor(h);
        let f = h - i;
        let p = V * (1 - S);
        let q = V * (1 - f * S);
        let t = V * (1 - (1 - f) * S);

        let r, g, b;
        switch (i % 6) {
            case 0:
                r = V;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = V;
                b = p;
                break;
            case 2:
                r = p;
                g = V;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = V;
                break;
            case 4:
                r = t;
                g = p;
                b = V;
                break;
            case 5:
                r = V;
                g = p;
                b = q;
                break;
        }

        // Convert 0-1 to 0-255
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);

        return { r, g, b };
    },

    init: function() {
        CPicker.collectElements();
        CPicker.updateAdditionalData();
        CPicker.events();
    },

    /* Events Callback */

    click: function(e) {
        const rgba = window.getComputedStyle(e.target)['background-color'];
        CPicker.updateUIByCSSRGBA(rgba);
    },

    pointerDown: function(e) {
        CPicker.id.cpickerSvbox.setPointerCapture(e.pointerId);
        CPicker.updateSVBoxPointerUIByPointerEvent(e);
    },

    pointerMove: function(e) {
        if (!CPicker.id.cpickerSvbox.hasPointerCapture(e.pointerId)) return;
        CPicker.updateSVBoxPointerUIByPointerEvent(e);
    },

    pointerUp: function(e) {
        CPicker.id.cpickerSvbox.releasePointerCapture(e.pointerId);
        CPicker.updateSVBoxPointerUIByPointerEvent(e);
    },

    inputChange: function(e) {

    },

    hueSliderInput: function(e) {        
        const percent = (CPicker.id.inputsliderHue.value / 360) * 100;
        const rgb = CPicker.getHueGradientColorAt(percent);
        CPicker.updateRGBAInputs(rgb);
        CPicker.updateHexInput(rgb);
    },

}

window.addEventListener('load', CPicker.init);