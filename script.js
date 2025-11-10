const CPicker = {

    /* ---------------------------API ------------------------*/
    getCordinateFromRGB: function(rgb) {
        const hsv = CPicker.rgb2hsv(rgb);       
        const xy = CPicker.hsvToSVCoordinates(hsv);       
        return xy;
    },

    getRGBThroughSVBoxXY: function(x, y) {
        const hsv = CPicker.getHSVFromSVBoxThroughXY(x, y);
        console.log(hsv);
        const rgb = CPicker.hsv2rgb(hsv);
        return rgb;
    },

    /* -------------------------------------------------------*/

    rgba: {
        r: 255,
        g: 0,
        b: 0,
        a: 1,
    },

    hsv: {
        h: 162,
        s: 71,
        v: 60,
    },

    id: {},

    collectElements: function() {
        this.id.cpickerCodeswitch = document.querySelector('#cpicker-codeswitch');
        this.id.cpickerInputsWrapper = document.querySelector('#cpicker-inputs-wrapper');
        this.id.cpickerInputAlpha = document.querySelector('#cpicker-input-alpha');
        this.id.cpickerSvbox = document.querySelector('#cpicker-svbox');
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
    },

    rgb2hsv: function(rgb){
       // Step 1 - Normalize
       const normRGB = {
         r: rgb.r/255,
         g: rgb.g/255,
         b: rgb.b/255,
       }

       // Step 2 - Min, Max, Delta
       const min = Math.min(...Object.values(normRGB));
       const max = Math.max(...Object.values(normRGB));
       const delta = (max-min);

       // Step 3 - V & S
       const v = Math.round(max*100);
       const s = Math.round((max == 0 ? 0 : delta/max)*100);

       // Step 4 - H
       let h = 0;
       if(max == normRGB.r) h = 60*((normRGB.g-normRGB.b)/delta);
       if(max == normRGB.g) h = 60*((normRGB.b-normRGB.r)/delta+2);
       if(max == normRGB.b) h = 60*((normRGB.r-normRGB.g)/delta+4);
       if(delta == 0) h = 0;
       if(h < 0) h += 360;
       h = Math.round(h)

       return {h,s,v};
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

    getHSVFromSVBoxThroughXY: function(x, y) {
        const h = CPicker.hsv.h;
        x = Math.max(0, Math.min(CPicker.svBoxWidth, x));
        y = Math.max(0, Math.min(CPicker.svBoxHeight, y));

        const s = (x / CPicker.svBoxWidth) * 100;
        const v = (1 - y / CPicker.svBoxHeight) * 100;

        return { h, s, v };
    },

    getHueFromX: function(x) {
        x = Math.max(0, Math.min(CPicker.svBoxWidth, x));
        return (x / CPicker.svBoxWidth) * 360;
    },

    init: function() {
        CPicker.collectElements();
        CPicker.updateAdditionalData();
        CPicker.events();    

        let a = CPicker.getRGBThroughSVBoxXY(136,74);    
        console.log(a);
    },

}

window.addEventListener('load', CPicker.init);