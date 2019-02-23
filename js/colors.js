class Colors{
    static hsl2rgb(color){
        let h = color[0]/360, s=color[1]/100, l=color[2]/100;
        let r, g, b;
        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            let hue2rgb = (p, q, t)=>{
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    static rgb2hsl(color){
        let r = color[0], g=color[1], b=color[2];
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h*360, s*100, l*100];
    }

    static hex2rgb(color){
        let hex = (color+"").toLowerCase();
        let simple=true;
        var re = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})/;
        if(hex.length>4){
          simple=false;
          re=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/;
        }
        let result=[];
        result[0] = hex.replace(re,"$1")
        result[1] = hex.replace(re,"$2");
        result[2] = hex.replace(re,"$3");
        let r = parseInt(result[0]+(simple?result[0]:""), 16);
        let g = parseInt(result[1]+(simple?result[1]:""), 16);
        let b = parseInt(result[2]+(simple?result[2]:""), 16);
        return [r,g,b];
    }
    static rgb2hex(color){
        let toHex = x=>{
            let hex = Math.round(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return "#"+toHex(color[0])+toHex(color[1])+toHex(color[2]);
    }
    static hex2hsl(color){
        return Colors.rgb2hsl(Colors.hex2rgb(color));
    }
    static hsl2hex(color){
        return Colors.rgb2hex(Colors.hsl2rgb(color));
    }
}