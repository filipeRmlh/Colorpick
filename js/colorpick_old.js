
var Colorpick=function(elm,value,evtClick){
  this.elm;
  this.container=elm;
  this.children={};
  this.evtClick=evtClick||null;
  this.startvalue = value || {h:180,s:50,l:50};
  this.value = value || {h:50,s:50,l:50};
  this.evtChange;
};
Colorpick.prototype["createOut"]=function(){
  var out = document.createElement("input");
  var _this=this;
  this.elm.appendChild(out);
  this.children['out']=out;
  this.children['out'].addEventListener("click",function(e){
    if(typeof(_this.evtClick)=='function')_this.evtClick(e,_this,this);
  });
  out.addEventListener("change",function(e){
    _this.setValue(hexToHsl(this.value),false);
  });
};
Colorpick.prototype["setOutValue"]=function(fireAction){
  if(fireAction){
    this.children.out.value=hslToHex(this.value);
  }else{
    if (this.children.out.value.search(/#/) === -1) this.children.out.value="#"+this.children.out.value;
  }
  this.children.out.style=
  "background-color:hsl("+this.value.h+","+this.value.s+"%,"+this.value.l+"%);"+
  "color:"+(this.value.l>50?"#333":"#fff");
  this.children.out.blur();
  if(typeof (this.evtChange) == "function")this.evtChange(this,this.children.out);
};
Colorpick.prototype["createHue"]=function(){
  var hueRange=new Range();
  this.elm.appendChild(hueRange.track);
  return hueRange;
};
Colorpick.prototype["createSat"]=function(){
  var satRange=new Range();
  this.elm.appendChild(satRange.track);
  return satRange;
};
Colorpick.prototype["createLig"]=function(){
  var ligRange=new Range();
  this.elm.appendChild(ligRange.track);
  return ligRange;
};
Colorpick.prototype['setValue']=function(color,fireAction){
    var _this=this;
    var h=_this.children.color.h;
    var s=_this.children.color.s;
    var l=_this.children.color.l;

    h.setValue(color.h/3.6,fireAction);
    s.setValue(color.s,fireAction);
    l.setValue(color.l,fireAction);
    _this.value=color;
};
Colorpick.prototype['reset']=function(){
    this.setValue(this.startvalue,true);
};
Colorpick.prototype['createHSL']=function(){
  var _this=this;
  _this.elm=document.createElement("div");
  _this.container.appendChild(_this.elm);
  this.createOut();
  var h = _this.createHue();
  var s = _this.createSat();
  var l = _this.createLig();

  _this.children['color']={h:h,s:s,l:l};

  h.action=function(a,b,fireAction){
    var t = l.value>50?0:100;
    l.thumb.style.borderBottomColor="hsl("+0+","+0+"%,"+t+"%)";
    h.thumb.style.borderBottomColor="hsl("+0+","+0+"%,"+t+"%)";
    s.thumb.style.borderBottomColor="hsl("+0+","+0+"%,"+t+"%)";
    _this.value.h = h.value*3.6;
    l.track.style=setCssLig(h.value*3.6,s.value);
    s.track.style=setCssSat(h.value*3.6,l.value);
    _this.setOutValue(fireAction);
  };
  l.action=function(a,b,fireAction){
      var t = l.value>50?0:100;
    l.thumb.style.borderBottomColor="hsl("+0+","+0+"%,"+t+"%)";
    h.thumb.style.borderBottomColor="hsl("+0+","+0+"%,"+t+"%)";
    s.thumb.style.borderBottomColor="hsl("+0+","+0+"%,"+t+"%)";
    _this.value.l = l.value;
    h.track.style=setCssHue(s.value,l.value);
    s.track.style=setCssSat(h.value*3.6,l.value);
    _this.setOutValue(fireAction);
  };
  s.action=function(a,b,fireAction){
    var t = l.value>50?0:100;
    l.thumb.style.borderBottomColor="hsl("+0+","+0+"%,"+t+"%)";
    h.thumb.style.borderBottomColor="hsl("+0+","+0+"%,"+t+"%)";
    s.thumb.style.borderBottomColor="hsl("+0+","+0+"%,"+t+"%)";
    _this.value.s = s.value;
    h.track.style=setCssHue(s.value,l.value);
    l.track.style=setCssLig(h.value*3.6,s.value);
    _this.setOutValue(fireAction);
  };
  setTimeout(function(){_this.reset()},2200);
};

//Funções de inicialização;
startColorpick=function(elm,fn){
  setCssValuePrefix();
  var att = elm.getAttribute("data-value");
  att = (att!=="")?JSON.parse(att):null;
  elm.colorpick=new Colorpick(elm,att,fn);
  elm.colorpick.createHSL();
};

