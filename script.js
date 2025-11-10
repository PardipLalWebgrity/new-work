const CPicker = {

	/* ---------------------------API ------------------------*/
	getCordinateFromRGB: function (rgb) {
		const xy = CPicker.hsvToSVCoordinates(CPicker.rgb2hsv(rgb.r, rgb.g, rgb.b));
		return xy;
	},

	getRGBThroughSVBoxXY: function (x, y) {
		const hsv = CPicker.getHSVFromSVBoxThroughXY(x, y);
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
		h: 0,
		s: 100,
		v: 100,
	},

	id: {},

	collectElements: function () {
		this.id.cpickerCodeswitch = document.querySelector('#cpicker-codeswitch');
		this.id.cpickerInputsWrapper = document.querySelector('#cpicker-inputs-wrapper');
		this.id.cpickerInputAlpha = document.querySelector('#cpicker-input-alpha');
		this.id.cpickerSvbox = document.querySelector('#cpicker-svbox');	
	},

	updateAdditionalData(){
		CPicker.svBoxWidth = this.id.cpickerSvbox.offsetWidth;
		CPicker.svBoxHeight = this.id.cpickerSvbox.offsetHeight;
	},

	cpickerCodeswitchEventCallback: function (e) {
		const value = CPicker.id.cpickerCodeswitch.value;
		const codeBlockEl = document.querySelector(`.cpicker-inputs-${value}`);
		[...CPicker.id.cpickerInputsWrapper.children].forEach((el) => {
			el.classList.remove('show');
		})
		codeBlockEl.classList.add('show');
		CPicker.id.cpickerInputAlpha.classList.add('show');

	},

	events: function () {
		this.id.cpickerCodeswitch.addEventListener('change', this.cpickerCodeswitchEventCallback);
	},

	rgb2hsv: function (r, g, b) {
		let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
		rabs = r / 255;
		gabs = g / 255;
		babs = b / 255;
		v = Math.max(rabs, gabs, babs),
			diff = v - Math.min(rabs, gabs, babs);
		diffc = c => (v - c) / 6 / diff + 1 / 2;
		percentRoundFn = num => Math.round(num * 100) / 100;
		if (diff == 0) {
			h = s = 0;
		} else {
			s = diff / v;
			rr = diffc(rabs);
			gg = diffc(gabs);
			bb = diffc(babs);

			if (rabs === v) {
				h = bb - gg;
			} else if (gabs === v) {
				h = (1 / 3) + rr - bb;
			} else if (babs === v) {
				h = (2 / 3) + gg - rr;
			}
			if (h < 0) {
				h += 1;
			} else if (h > 1) {
				h -= 1;
			}
		}
		
		return {
			h: Math.round(h * 360),
			s: percentRoundFn(s * 100),
			v: percentRoundFn(v * 100)
		};
	},

	hsv2rgb: function (h, s, v) {
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
			case 0: r = v; g = t; b = p; break;
			case 1: r = q; g = v; b = p; break;
			case 2: r = p; g = v; b = t; break;
			case 3: r = p; g = q; b = v; break;
			case 4: r = t; g = p; b = v; break;
			case 5: r = v; g = p; b = q; break;
		}

		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255)
		};
	},

	hsvToSVCoordinates: function (hsv) {
		const x = (hsv.s / 100) * CPicker.svBoxWidth;
		const y = (1 - hsv.v / 100) * CPicker.svBoxHeight;
		return { x, y };
	},

	getHSVFromSVBoxThroughXY: function (x, y) {
		const h = CPicker.hsv.h;
		x = Math.max(0, Math.min(CPicker.svBoxWidth, x));
		y = Math.max(0, Math.min(CPicker.svBoxHeight, y));

		const s = (x / CPicker.svBoxWidth) * 100;
		const v = (1 - y / CPicker.svBoxHeight) * 100;

		return { h, s, v };
	},

	getHueFromX: function (x) {
		x = Math.max(0, Math.min(CPicker.svBoxWidth, x));
		return (x / CPicker.svBoxWidth) * 360;
	},

	init: function () {		
		CPicker.collectElements();
		CPicker.updateAdditionalData();
		CPicker.events();	
		console.log(CPicker.getCordinateFromRGB({r:66, g:135, b:245}));
		
	},

}

window.addEventListener('load', CPicker.init);