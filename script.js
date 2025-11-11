const CPicker = {

    // API

    // Variables
    rgba: {
        r: 198,
        g: 14,
        b: 14,
        a: 80,
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
        this.id.inputsliderAlpha = document.querySelector('#inputslider-alpha');
        this.id.inputalpha = document.querySelector('#inputalpha');

        this.id.inputrgbR = document.querySelector('#inputrgb-r');
        this.id.inputrgbG = document.querySelector('#inputrgb-g');
        this.id.inputrgbB = document.querySelector('#inputrgb-b');

        this.id.inputhex = document.querySelector('#inputhex');
    },

    // SV Box
    updateSVBoxBaseColor: function(){
        const hsv = CPicker.rgb2hsv(CPicker.rgba);
        const rgb = CPicker.hueToRGB(hsv.h);
        this.id.cpickerSvbox.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        CPicker.hsv = hsv;      
    },

    updateSVBoxPointer: function(){        
        const hsv = CPicker.rgb2hsv(CPicker.rgba);
        const xy = CPicker.hsvToSVCoordinates(hsv);
        this.id.cpickerSvboxPointer.style.left = xy.x - 6 + 'px';
        this.id.cpickerSvboxPointer.style.top = xy.y - 4 + 'px';
    },

    updateSVBoxPointerUIByPointerEvent: function(e) {
        const rgb = CPicker.getRGBThroughSVBoxXY(e.clientX, e.clientY);        
        Object.assign(CPicker.rgba, rgb);
        const rgbCSS = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, ${CPicker.rgba.a})`;        

        let x = e.clientX - 6;
        let y = e.clientY - 6;
        if (x > CPicker.svBoxWidth - 6) x = CPicker.svBoxWidth - 6;
        if (y > CPicker.svBoxHeight - 6) y = CPicker.svBoxHeight - 6;
        if (x < 0) x = -6;
        if (y < 0) y = -6;

        CPicker.id.cpickerSvboxPointer.style.left = x + 'px';
        CPicker.id.cpickerSvboxPointer.style.top = y + 'px';

        CPicker.updateAlphaSliderColor();
        CPicker.updateRGBInputs();
        CPicker.updateHexInput();  
    },

    getRGBThroughSVBoxXY: function(x, y) {
        const hsv = CPicker.getHSVFromSVBoxThroughXY(x, y);
        const rgb = CPicker.hsv2rgb(hsv);
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

    hsvToSVCoordinates: function(hsv) {
        const x = (hsv.s / 100) * CPicker.svBoxWidth;
        const y = (1 - hsv.v / 100) * CPicker.svBoxHeight;
        return { x, y };
    },


    // Hue Slider
    updateHueSliderPointer() {
        const { r, g, b } = CPicker.rgba;
        // Normalize RGB to [0,1]
        const r1 = r / 255,
            g1 = g / 255,
            b1 = b / 255;
        const max = Math.max(r1, g1, b1);
        const min = Math.min(r1, g1, b1);
        const delta = max - min;

        let hue = 0;
        if (delta !== 0) {
            if (max === r1) {
                hue = ((g1 - b1) / delta) % 6;
            } else if (max === g1) {
                hue = (b1 - r1) / delta + 2;
            } else {
                hue = (r1 - g1) / delta + 4;
            }
            hue *= 60;
            if (hue < 0) hue += 360;
        }

        this.id.inputsliderHue.value = hue;
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

    // Alpha Slider
    updateAlphaSliderColor: function() {
        const rgba = CPicker.rgba;
        this.id.cpickerAlphasliderBg.style.background = `linear-gradient(to right, rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 0) 0%, rgb(${rgba.r}, ${rgba.g}, ${rgba.b}) 100%)`
    },

    // RGB Inputs
    updateRGBInputs: function() {        
        this.id.inputrgbR.value = CPicker.rgba.r;
        this.id.inputrgbG.value = CPicker.rgba.g;
        this.id.inputrgbB.value = CPicker.rgba.b;
    },

    // Hex Input
    updateHexInput: function() {        
        const hexValue = CPicker.rgbToHex(CPicker.rgba);
        this.id.inputhex.value = hexValue;
    },

    // Alpha Input

    // Utility Functions
    rgbaStrint2Object: function(str){
        const rgba = str.split('(')[1].split(')')[0].split(',');
        if (rgba.length === 3) rgba.push('1');
        const rgbaObject = {
            r: +(rgba[0]),
            g: +(rgba[1]),
            b: +(rgba[2]),
            a: +(rgba[3]),
        }
        return rgbaObject;
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

    valueToHex: function(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },

    rgbToHex: function(rgb) {
        return "#" + CPicker.valueToHex(rgb.r) + CPicker.valueToHex(rgb.g) + CPicker.valueToHex(rgb.b);
    },


    // Others

    updateAdditionalData() {
        CPicker.svBoxWidth = this.id.cpickerSvbox.offsetWidth;
        CPicker.svBoxHeight = this.id.cpickerSvbox.offsetHeight;
    },

    init: function() {
        CPicker.collectElements();
        CPicker.updateAdditionalData();
        CPicker.events();
    },

    click: function(e) {
        const rgbaStr = window.getComputedStyle(e.target)['background-color'];
        CPicker.rgba = CPicker.rgbaStrint2Object(rgbaStr);
        CPicker.updateSVBoxBaseColor();
        CPicker.updateSVBoxPointer();
        CPicker.updateHueSliderPointer();
        CPicker.updateRGBInputs();
        CPicker.updateAlphaSliderColor();
        CPicker.updateHexInput();
    },

    events: function() {
        this.id.cpickerCodeswitch.addEventListener('change', this.cpickerCodeswitchEventCallback);
        this.id.colorpalate.addEventListener('click', CPicker.click);
        this.id.cpickerSvbox.addEventListener('pointerdown', CPicker.svBoxPointerDown);
        this.id.cpickerSvbox.addEventListener('pointermove', CPicker.svBoxPointerMove);
        this.id.cpickerSvbox.addEventListener('pointerup', CPicker.svBoxPointerUp);
        this.id.inputsliderHue.addEventListener('input', CPicker.hueSliderInput);
        this.id.inputsliderAlpha.addEventListener('input', CPicker.alphaSliderInput);
    },

    svBoxPointerDown: function(e) {
        CPicker.id.cpickerSvbox.setPointerCapture(e.pointerId);
        CPicker.updateSVBoxPointerUIByPointerEvent(e);
    },

    svBoxPointerMove: function(e) {
        if (!CPicker.id.cpickerSvbox.hasPointerCapture(e.pointerId)) return;
        CPicker.updateSVBoxPointerUIByPointerEvent(e);
    },

    svBoxPointerUp: function(e) {
        CPicker.id.cpickerSvbox.releasePointerCapture(e.pointerId);
        CPicker.updateSVBoxPointerUIByPointerEvent(e);
    },

    hueSliderInput: function(e) {        
        const percent = (CPicker.id.inputsliderHue.value / 360) * 100;
        const rgb = CPicker.getHueGradientColorAt(percent);
        Object.assign(CPicker.rgba, rgb);
        CPicker.updateSVBoxBaseColor();
        CPicker.updateRGBInputs();
        CPicker.updateAlphaSliderColor();
        CPicker.updateHexInput();  
    },

    alphaSliderInput: function(e) {        
        const value = CPicker.id.inputsliderAlpha.value;
        CPicker.id.inputalpha.value = value;
        CPicker.rgba.a = value/100;
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

}

window.addEventListener('load', CPicker.init);
