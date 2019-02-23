class Range{

    constructor(){
        let _this = this;
        this.padding = 7;
        this.pressed = false;
        this.track = document.createElement("div");
        this.track.setAttribute("class","range");
        this.thumb = document.createElement("span");
        this.track.appendChild(this.thumb);
        this.onChange = ()=>{};
        this.value = 50;
        this.thumb.style.left = "50%";
        this._setupEvents();
        return new Proxy(this,{set:(target,prop,val)=>{return _this._onChange(target,prop,val)}});
    }

    _setupEvents(){
        let _this=this;
        this.track.addEventListener("mousedown",(e)=>{return _this.trackStart(e)});
        this.track.addEventListener("touchstart",(e)=>{return _this.trackStart(e)});
        document.addEventListener("mousemove",(e)=>{return _this.trackMove(e)});
        document.addEventListener("touchmove",(e)=>{return _this.trackMove(e)});
        document.addEventListener("touchend",(e)=>{return _this.trackEnd(e);})
        document.addEventListener("mouseup",(e)=>{return _this.trackEnd(e);})
    }

    getRelativePosition(elm,pos){
        let posStartElm = elm.getBoundingClientRect().left;
        let widthElm = elm.offsetWidth;
        return {
            withPadding:(pos - posStartElm - this.padding)*100/(widthElm - (2*this.padding) - 1),
            withoutPadding:(pos - posStartElm)*100/(widthElm - 1),
        };
    }

    getAbsolutePosition(elm,percent){
        let posStartElm = elm.getBoundingClientRect().left;
        let widthElm = elm.offsetWidth;
        return {
            withPadding: (percent*(widthElm - (2*this.padding) - 1)/100) + posStartElm + this.padding,
            withoutPadding: (percent*(widthElm - 1)/100) + posStartElm,
        };
    }

    trackStart(e){
        this.pressed=true;
        // e.preventDefault();
        this.setThumbPos(e);
        return false;
    }


    trackMove(e){
        // e.preventDefault();
    
        if(this.pressed)this.setThumbPos(e);
        return false;
    }


    trackEnd(e){
        // e.preventDefault();
        this.pressed = false;
        return false;
    }


    _onChange(target,property,value){
        target[property] = value;
        if(property == "value"){
            let e = {pageX:(this.getAbsolutePosition(this.track,value).withPadding)};
            target.setThumbPos(e);
        }
        return true;
    }


    setThumbPos(e){      
        let pos = this.getRelativePosition(this.track, e.pageX || e.changedTouches[0].pageX);
        if(pos.withPadding<=100 && pos.withPadding>=0){
            this.thumb.style.left = pos.withoutPadding+"%";
            this.value = pos.withPadding;
            this.onChange(e);
        }else {
            if(pos.withPadding>100)
                pos = this.getRelativePosition(this.track, this.getAbsolutePosition(this.track,100).withPadding);
            else
                pos = this.getRelativePosition(this.track, this.getAbsolutePosition(this.track,0).withPadding);
                
            this.thumb.style.left = pos.withoutPadding+"%";
            this.value = pos.withPadding;
        }
    }
}