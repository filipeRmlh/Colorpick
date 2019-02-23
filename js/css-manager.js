class CssGradient{
    static getCssValuePrefix(){
        let prefixes = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
        for (let i = 0; i < prefixes.length; i++){
            CssGradient.direction = (i==0?"to right":"left");
            let suporte = CSS.supports('background', prefixes[i]+'linear-gradient('+CssGradient.direction+',hsl(0,0%,0%) 0%,hsl(0,0%,0%) 100%)');
            CssGradient.browserPrefix = prefixes[i];
            if (suporte) return;
        }
    }

    static getCssBackground(){
        return "background-image: "+CssGradient.browserPrefix+"linear-gradient("+CssGradient.direction+", ";
    }
    
    static getCssHue(s,l){
        var hue =  "hsl(0,"+s+"%,"+l+"%) 0%, hsl(61.2,"+s+"%,"+l+"%) 17%, hsl(118.8,"+s+"%,"+l+"%) 33%, hsl(180,"+s+"%,"+l+"%) 50%, hsl(241.2,"+s+"%,"+l+"%) 67%, hsl(298.8,"+s+"%,"+l+"%) 83%, hsl(0,"+s+"%,"+l+"%) 100%);";
        return CssGradient.getCssBackground()+hue;
    }

    static getCssSat(h,l){
        return CssGradient.getCssBackground()+"hsl("+h+",0%,"+l+"%) 0%, hsl("+h+",100%,"+l+"%) 100%);";
    }

    static getCssLig(h,s){
        return CssGradient.getCssBackground()+"hsl("+h+","+s+"%,0%) 0%, hsl("+h+","+s+"%,50%) 50%, hsl("+h+","+s+"%,100%) 100%);";
    }
}
CssGradient.getCssValuePrefix();