let uuid = ()=>{
    return Math.random().toString(36).substr(2, 16);
}
class Colorpick {
    constructor(container,value,displayType){
        let _this=this;
        this._applyThumbFilter = true;
        this.container = container;
        this.content = document.createElement("div");
        this.content.setAttribute("unselectable","on");
        this.outercontent = document.createElement("div");
        this.outercontent.setAttribute("unselectable","on");
        this.onChange=()=>{};
        this.input = document.createElement("input");
        this.radio = document.createElement('div');
        this.radio.setAttribute("unselectable","on");
        let idhex = uuid(), idhsl = uuid(), idrgb = uuid();
        let name=uuid();

        this.displayType=displayType || 'hsl';
        this.value = value || [180,50,50];

        this.radio.innerHTML = `
            <div unselectable="on" class="chooseType"><input unselectable="on" ${this.displayType === 'hex' ? 'checked' : ''} id='radio-${idhex}' name='tipo-${name}' type='radio' value='hex'><label unselectable="on" for='radio-${idhex}'>hex</label></div>
            <div unselectable="on" class="chooseType"><input unselectable="on" ${this.displayType === 'hsl' ? 'checked' : ''} id='radio-${idhsl}' name='tipo-${name}' type='radio' value='hsl'><label unselectable="on" for='radio-${idhsl}'>hsl</label></div>
            <div unselectable="on" class="chooseType"><input unselectable="on" ${this.displayType === 'rgb' ? 'checked' : ''} id='radio-${idrgb}' name='tipo-${name}' type='radio' value='rgb'><label unselectable="on" for='radio-${idrgb}'>rgb</label></div>
        `;
        this.input.setAttribute("type",'text');
        
        this.init();        
        
    }
 
    async init(){
        this.hRange = new Range();
        this.sRange = new Range();
        this.lRange = new Range();
        this.setUpElements();
        this.setUpEvents();
        await this.hRange.init();
        await this.sRange.init();
        await this.lRange.init();
        this.setValue(this.value);   
    }

    _onChange(){
        let e = {
            value:this.value,
            input:this.input,
            typeView:this.radio.querySelector("[checked]").value,
            outbox:this.container
        };
        this.onChange(e);
    }

    setValue(value){
        this.value = value;
        this.setRangesValues(value);
    }

    setThumbsColors(){
        let lum = this.lRange.value < 50?"invert(100%)":"";
        this.lRange.thumb.style.filter = lum;
        this.sRange.thumb.style.filter = lum;
        this.hRange.thumb.style.filter = lum;    
    }

    setInputValue(){
        let out = this.value = [Math.round(this.hRange.value*3.6), Math.round(this.sRange.value), Math.round(this.lRange.value)];
        switch(this.displayType){
            case 'hex': out = Colors.hsl2hex(out);
            break;
            case 'rgb': out = `rgb(${Colors.hsl2rgb(out)})`; break;
            default: out = `hsl(${out[0]}, ${out[1]}%, ${out[2]}%)`
        }

        this.input.value=out;
    }

    setInputColors(){
        let h = this.hRange.value;
        let s = this.sRange.value;
        let l = this.lRange.value;
        this.input.style.color = l < 50 ?"white":"black";
        this.input.style.backgroundColor = `hsl(${3.6*h}, ${s}%, ${l}%)`;
    }

    matchRegex(val){       
        let regexhex = /^(\#?)([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
        let regexhsl = /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\)/
        let regexrgb = /rgb\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/
        
        let res = val.match(regexhex);
        if(!res){
            res = val.match(regexhsl);
            if(!res){
                res = val.match(regexrgb);
                if(!res)  return {tipo:error, out:this.value};
                return {
                    value : [parseInt(res[1]),parseInt(res[2]),parseInt(res[3])],
                    tipo: 'rgb'
                }
            }
            return {
                value : [parseInt(res[1]),parseInt(res[2]),parseInt(res[3])],
                tipo :'hsl'
            }
        }
        return {
            value : res[2],
            tipo : 'hex'
        }
        
    }

    inputChangeHandle(e){
        let val = this.input.value;
        let out = this.matchRegex(val);
        switch(out.tipo){
            case 'hsl':
                this.setRangesValues(out.value);
                break;
            case 'rgb':
                this.setRangesValues(Colors.rgb2hsl(out.value));
                break;
            case 'hex':
                this.setRangesValues(Colors.hex2hsl(out.value));
                break;
        }
        this._onChange();
    }


    setUpElements(){
        this.outercontent.appendChild(this.input);
        this.content.appendChild(this.hRange.track);
        this.content.appendChild(this.sRange.track);
        this.content.appendChild(this.lRange.track);
        this.content.appendChild(this.radio);
        this.outercontent.appendChild(this.content);
        this.container.appendChild(this.outercontent);
    }

    setRangesValues(hsl){
            this.hRange.setValue(hsl[0]/3.6);
            this.sRange.setValue(hsl[1]);
            this.lRange.setValue(hsl[2]);
    }

    setRangesColors(){
        let h = this.hRange;
        let s = this.sRange;
        let l = this.lRange;
        h.track.style = CssGradient.getCssHue(s.value,l.value);
        s.track.style = CssGradient.getCssSat(h.value*3.6,l.value);
        l.track.style = CssGradient.getCssLig(h.value*3.6,s.value);
    }


    hRangeChangeHandle(e){
        this.setInputColors();
        this.setRangesColors();
        this.setInputValue();
        this._onChange();
    }


    sRangeChangeHandle(e){
        this.setInputColors();
        this.setRangesColors();
        this.setInputValue();
        this._onChange();
    }


    lRangeChangeHandle(e){
        this.setInputColors();
        this.setThumbsColors();
        this.setRangesColors();
        this.setInputValue();
        this._onChange();
    }


    changeType(e){
        this.displayType = e.target.value;
        this.setInputValue();
        this._onChange();
    }


    setUpEvents(){
        let _this = this;
        this.hRange.onChange = (e)=>{ return _this.hRangeChangeHandle(e); };
        this.sRange.onChange = (e)=>{ return _this.sRangeChangeHandle(e); };
        this.lRange.onChange = (e)=>{ return _this.lRangeChangeHandle(e); };
        this.input.addEventListener("change",(e)=>{_this.inputChangeHandle(e)});
        this.content.querySelectorAll('[type=radio]').forEach((elm)=>{
            elm.addEventListener("change",(e)=>{ return _this.changeType(e)})
        })
    }

}
