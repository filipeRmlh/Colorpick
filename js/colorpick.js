let uuid = ()=>{
    return Math.random().toString(36).substr(2, 16);
}
class Colorpick {
    constructor(container,value,displayType){
        let _this=this;
        this._applyThumbFilter = true;
        this.container = container;
        this.content = document.createElement("div");
        this.outercontent = document.createElement("div");

        this.input = document.createElement("input");
        this.radio = document.createElement('div');
        let idhex = uuid(), idhsl = uuid(), idrgb = uuid();
        let name=uuid();
        this.displayType=displayType || 'hsl';
        this.value = value || [180,50,50];
        this.fireEvents=[];
        this.radio.innerHTML = `
            <div class="chooseType"><input ${this.displayType==='hex'?'checked':''} id='radio-${idhex}' name='tipo-${name}' type='radio' value='hex'><label for='radio-${idhex}'>hex</label></div>
            <div class="chooseType"><input ${this.displayType==='hsl'?'checked':''} id='radio-${idhsl}' name='tipo-${name}' type='radio' value='hsl'><label for='radio-${idhsl}'>hsl</label></div>
            <div class="chooseType"><input ${this.displayType==='rgb'?'checked':''} id='radio-${idrgb}' name='tipo-${name}' type='radio' value='rgb'><label for='radio-${idrgb}'>rgb</label></div>
        `;
        this.input.setAttribute("type",'text');
        this.hRange = new Range();
        this.sRange = new Range();
        this.lRange = new Range();
        this.setUpElements();
        this.setUpEvents();
        return new Proxy(this,{set:(target,prop,val)=>{return _this._onChange(target,prop,val)}})
    }

    _changeHandleCallback(e){
        if(this.fireEvents['_changeHandleCallback']!==undefined){
            for(let i=0; i< this.fireEvents['_changeHandleCallback'].length;i++){
                if(this.fireEvents['_changeHandleCallback'][i]!==undefined)this.fireEvents['_changeHandleCallback'][i](e);
            }
        }

    }
    
    _onChange(target,property,value){
        target[property] = value;
        if(property === "value"){
            this.setRangesValues(value);
        }
        return true;
    }

    addEventListener(evt,callback){
        if(this.fireEvents[`_${evt}HandleCallback`]===undefined)this.fireEvents[`_${evt}HandleCallback`]=[];
        this.fireEvents[`_${evt}HandleCallback`].push(callback);
    }

    setThumbsColors(){
        let lum = this.lRange.value < 50?"invert(100%)":"";
        this.lRange.thumb.style.filter = lum;
        this.sRange.thumb.style.filter = lum;
        this.hRange.thumb.style.filter = lum;    
    }

    setInputValue(){
        let out = this.value = [Math.round(this.hRange.value*3.6), Math.round(this.sRange.value), Math.round(this.lRange.value)];
        let e={outbox:this.outercontent,target:this,value:this.value};
        this._changeHandleCallback(e);

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
        this.setInputValue()
    }


    sRangeChangeHandle(e){
        this.setInputColors();
        this.setRangesColors();
        this.setInputValue()
    }


    lRangeChangeHandle(e){
        this.setInputColors();
        this.setThumbsColors();
        this.setRangesColors();
        this.setInputValue()
    }


    changeType(e){
        this.displayType = e.target.value;
        this.setInputValue();
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
