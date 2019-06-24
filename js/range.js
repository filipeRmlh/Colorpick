<<<<<<< Updated upstream
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
class Range{

    constructor(value){
        let _this = this;
        this.padding = 7;
        this.pressed = false;
        this.track = document.createElement("div");
        this.track.setAttribute("class","range");
<<<<<<< Updated upstream
        this.thumb = document.createElement("span");
=======
        this.track.setAttribute("unselectable","on");
        this.thumb = document.createElement("span");
        this.thumb.setAttribute("unselectable", "on");
>>>>>>> Stashed changes
        this.track.appendChild(this.thumb);
        this.onChange = ()=>{};
        this.value = value || 50;
        this.thumb.style.left = `${value || 50}%`;
        this._setupEvents();
<<<<<<< Updated upstream
       // return new Proxy(this,{set:(target,prop,val)=>{return _this._onChange(target,prop,val)}});
=======
>>>>>>> Stashed changes
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

    setValue(value){
<<<<<<< Updated upstream
=======
        this.value = value;
>>>>>>> Stashed changes
        let pos = this.getAbsolutePosition(this.track,value);
        let e = {pageX:(pos.withPadding)};
        this.setThumbPos(e);
    }

    trackMove(e){
        // e.preventDefault();
    
        if(this.pressed)this.setThumbPos(e);
        return false;
    }

<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    trackEnd(e){
        // e.preventDefault();
        this.pressed = false;
        return false;
    }

<<<<<<< Updated upstream

   _onChange(target,property,value){
        target[property] = value;
        if(property === "value"){
            let pos = this.getAbsolutePosition(this.track,value)
            let e = {pageX:(pos.withPadding)};
            target.setThumbPos(e);
        }
        return true;
    }


=======
>>>>>>> Stashed changes
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
            this.onChange(e);
        }
    }
<<<<<<< Updated upstream
=======
class Range{

    constructor(value){
        let _this = this;
        this.padding = 7;
        this.pressed = false;
        this.track = document.createElement("div");
        this.track.setAttribute("class","range");
        this.thumb = document.createElement("span");
        this.track.appendChild(this.thumb);
        this.onChange = ()=>{};
        this.value = value || 50;
        this.thumb.style.left = `${value || 50}%`;
        this._setupEvents();
       // return new Proxy(this,{set:(target,prop,val)=>{return _this._onChange(target,prop,val)}});
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

    setValue(value){
        let pos = this.getAbsolutePosition(this.track,value);
        let e = {pageX:(pos.withPadding)};
        this.setThumbPos(e);
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
        if(property === "value"){
            let pos = this.getAbsolutePosition(this.track,value)
            let e = {pageX:(pos.withPadding)};
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
            this.onChange(e);
        }
    }
>>>>>>> 5172970057af984f012ace920b6dfa91fbb9f0a8
=======
>>>>>>> Stashed changes
}