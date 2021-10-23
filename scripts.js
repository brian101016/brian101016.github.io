function position_meeting(_x, _y, _obj, _ignore){

    if(typeof _obj === "object"){

        const _obj_coords = _obj.getBoundingClientRect();

        if(_obj_coords.x <= _x && _x <= (_obj_coords.x + _obj_coords.width)){
            if(_obj_coords.y <= _y && _y <= (_obj_coords.y + _obj_coords.height)){
                if(_obj != _ignore){

                    return _obj;
                } 
            }
        }

        return false;
    }

    const _obj_list = document.querySelectorAll(_obj);
    for (const _obj_element of _obj_list) {
        
        const _obj_coords = _obj_element.getBoundingClientRect();

        if(_obj_coords.x <= _x && _x <= (_obj_coords.x + _obj_coords.width)){
            if(_obj_coords.y <= _y && _y <= (_obj_coords.y + _obj_coords.height)){
                if(_obj_element != _ignore){

                    console.log("colisión con " + toString(_obj_element));
                    return _obj_element;
                } 
            }
        }

    }

}

//###############################################################################################################
//###############################################################################################################

function place_meeting(_x, _y, _obj, _ignore){

    const _prev_left = _ignore.style.left;
    const _prev_top = _ignore.style.top;

    _ignore.style.top = `${_x}px`;
    _ignore.style.left = `${_y}px`;

    console.log(_x, _y);

    const _val = check_colision(_obj, _ignore);

    _ignore.style.top = _prev_top;
    _ignore.style.left = _prev_left;

    return _val;

}

//###############################################################################################################
//###############################################################################################################

function check_colision(_obj1, _obj2){

    const _obj_coords2 = _obj2.getBoundingClientRect();
    const _obj_list = document.querySelectorAll(_obj1);

    for (const _obj_element of _obj_list) {
        
        const _obj_coords1 = _obj_element.getBoundingClientRect();

        if( position_meeting(_obj_coords1.x, _obj_coords2.y, _obj_element) && position_meeting(_obj_coords1.x, _obj_coords2.y, _obj2) ){
            if(_obj_element != _obj2){
                return _obj_element;
            } 
        }

        if( position_meeting(_obj_coords2.x, _obj_coords1.y, _obj_element) && position_meeting(_obj_coords2.x, _obj_coords1.y, _obj2) ){
            if(_obj_element != _obj2){
                return _obj_element;
            } 
        }

        if( position_meeting(_obj_coords1.x, _obj_coords1.y, _obj2) || position_meeting(_obj_coords2.x, _obj_coords2.y, _obj_element) ){
            if(_obj_element != _obj2){
                return _obj_element;
            } 
        }

    }
}

//###############################################################################################################
//###############################################################################################################

function random_range(_min, _max) {
    let _diff = _max - _min;
    return Math.round(_min + (_diff * Math.random()) )
}

//###############################################################################################################
//###############################################################################################################

function boundaries(_min, _value, _max, _wrap) {
    
    if(!_wrap){
        if(_value < _min) return _min;
        if(_value > _max) return _max;
        return _value;
    }

    if(_value < _min) return _max;
    if(_value > _max) return _min;
    return _value;
    
}

//###############################################################################################################
//###############################################################################################################

function approach(_start, _end, _amount){

    if(_start < _end)   return Math.min((_start + _amount), _end);
    else                return Math.max((_start - _amount), _end);
}

//###############################################################################################################
//###############################################################################################################

function music_scheme(_action, _value) {

    if(_action == "change"){

        music_queue[current_music].pause();
        
        current_music += _value;
        if(current_music < 0) current_music = music_queue.length - 1;
        if(current_music > music_queue.length - 1) current_music = 0;

        music_queue[current_music].play();
        music_queue[current_music].loop = true;
    }

    if(_action == "start"){
        if(music_queue[current_music].paused) music_queue[current_music].play();
        else music_queue[current_music].pause();
    }

    const obj_music_scheme = document.querySelector("#button-music");
    obj_music_scheme.innerText = music_track[current_music];

    const obj_volume_slider = document.querySelector("#volume-slider");
    music_queue[current_music].volume = (obj_volume_slider.value / 100);

}

//###############################################################################################################
//###############################################################################################################

class Obj_Timer {

    constructor(display, countdown, ejfunction) {
        this.starting_time = 0;
        this.diff_time = 0;
        this.stopping_time = [0, 0, 0, "00:00.000"]; // MIN, SEG, MIL, "00:00.000"

        this.is_playing = false;
        this.interval_id = null;

        this.display = display;
        this.say_time = this.say_time.bind(this);
        this.update_display = this.update_display.bind(this);

        this.countdown = countdown;
        this.ejfunction = ejfunction;
    }

    // INICIAR A CONTAR
    start() {
        if(this.is_playing) return; // Ya está corriendo, entonces salir
        
        this.diff_time = 0;
        this.resume();
    }

    // CONTINUAR EL TIEMPO DESDE DONDE SE QUEDÓ
    resume() {
        if(this.is_playing) return;

        this.starting_time = performance.now();
        this.is_playing = true;

        if(this.display != null) this.interval_id = window.setInterval(this.update_display, 10);
    }

    // DEJAR DE CONTAR
    stop() {
        if(!this.is_playing) return; // No estaba corriendo, entonces salir

        this.pause();
        this.diff_time = 0;
    }

    // PAUSAR TEMPORIZADOR
    pause() {
        if(!this.is_playing) return;

        this.stopping_time = this.say_time();
        this.diff_time = (performance.now() - this.starting_time + this.diff_time);
        this.is_playing = false;

        window.clearInterval(this.interval_id);
        this.interval_id = null;
    }

    // STOP Y START
    restart() {
        this.stop();
        this.start();
    }

    // TOGGLE
    toggle() {
      if(this.is_playing) this.pause();
      else this.resume();
    }

    // IS PLAYING
    is_timer_playing() {
      return this.is_playing;
    }

    // MOSTRAR EL TIEMPO
    say_time() {
        if(!this.is_playing) return this.stopping_time; // SI YA SE DETUVO, REGRESA SU ÚLTIMO TIEMPO

        //                      TIEMPO DE PREGUNTA, INICIO DE CONTAR, EL TIEMPO ANTERIOR
        let _mil = Math.floor( performance.now() - this.starting_time + this.diff_time );

        // SI HAY UNA CUENTA REGRESIVA
        if(this.countdown != null) {
            _mil = ((this.countdown[0] * 60000) + (this.countdown[1] * 1000) + (this.countdown[2])) - _mil;
            if(_mil <= 0) {
                
                this.stopping_time = [0, 0, 0, "00:00.000"];
                this.is_playing = false;
                this.diff_time = 0;

                window.clearInterval(this.interval_id);
                this.interval_id = null;

                if(this.ejfunction != null) this.ejfunction();

                return [0, 0, 0, "Time out!"];
            }
        }

        let _seg = Math.floor((_mil / 1000) % 60);
        let _min = Math.floor((_mil / 1000) / 60);
        _mil = Math.floor(_mil % 1000);

        let _time_string = "";
        _time_string += _min < 10 ? "0"+_min+":" : _min+":";
        _time_string += _seg < 10 ? "0"+_seg+"." : _seg+".";
        _time_string += _mil < 100? "0"      : "";
        _time_string += _mil < 10 ? "0"+_mil : _mil;

        return [_min, _seg, _mil, _time_string]; // MIN, SEG, MIL, "00:00.000"
    }

    // ACTUALIZAR ALGÚN DISPLAY
    update_display() {

        if(this.display === null) return;

        const time = this.say_time();
        this.display.innerText = time[3];
    }
}

//###############################################################################################################
//###############################################################################################################

/**
 * textFit v2.3.1
 * Previously known as jQuery.textFit
 * 11/2014 by STRML (strml.github.com)
 * MIT License
 *
 * To use: textFit(document.getElementById('target-div'), options);
 *
 * Will make the *text* content inside a container scale to fit the container
 * The container is required to have a set width and height
 * Uses binary search to fit text with minimal layout calls.
 * Version 2.0 does not use jQuery.
 */
/*global define:true, document:true, window:true, HTMLElement:true*/

(function(root, factory) {
    "use strict";
  
    // UMD shim
    if (typeof define === "function" && define.amd) {
      // AMD
      define([], factory);
    } else if (typeof exports === "object") {
      // Node/CommonJS
      module.exports = factory();
    } else {
      // Browser
      root.textFit = factory();
    }
  
  }(typeof global === "object" ? global : this, function () {
    "use strict";
  
    var defaultSettings = {
      alignVert: false, // if true, textFit will align vertically using css tables
      alignHoriz: false, // if true, textFit will set text-align: center
      multiLine: false, // if true, textFit will not set white-space: no-wrap
      detectMultiLine: true, // disable to turn off automatic multi-line sensing
      minFontSize: 6,
      maxFontSize: 80,
      reProcess: true, // if true, textFit will re-process already-fit nodes. Set to 'false' for better performance
      widthOnly: false, // if true, textFit will fit text to element width, regardless of text height
      alignVertWithFlexbox: false, // if true, textFit will use flexbox for vertical alignment
    };
  
    return function textFit(els, options) {
  
      if (!options) options = {};
  
      // Extend options.
      var settings = {};
      for(var key in defaultSettings){
        if(options.hasOwnProperty(key)){
          settings[key] = options[key];
        } else {
          settings[key] = defaultSettings[key];
        }
      }
  
      // Convert jQuery objects into arrays
      if (typeof els.toArray === "function") {
        els = els.toArray();
      }
  
      // Support passing a single el
      var elType = Object.prototype.toString.call(els);
      if (elType !== '[object Array]' && elType !== '[object NodeList]' &&
              elType !== '[object HTMLCollection]'){
        els = [els];
      }
  
      // Process each el we've passed.
      for(var i = 0; i < els.length; i++){
        processItem(els[i], settings);
      }
    };
  
    /**
     * The meat. Given an el, make the text inside it fit its parent.
     * @param  {DOMElement} el       Child el.
     * @param  {Object} settings     Options for fit.
     */
    function processItem(el, settings){
      if (!isElement(el) || (!settings.reProcess && el.getAttribute('textFitted'))) {
        return false;
      }
  
      // Set textFitted attribute so we know this was processed.
      if(!settings.reProcess){
        el.setAttribute('textFitted', 1);
      }
  
      var innerSpan, originalHeight, originalHTML, originalWidth;
      var low, mid, high;
  
      // Get element data.
      originalHTML = el.innerHTML;
      originalWidth = innerWidth(el);
      originalHeight = innerHeight(el);
  
      // Don't process if we can't find box dimensions
      if (!originalWidth || (!settings.widthOnly && !originalHeight)) {
        if(!settings.widthOnly)
          throw new Error('Set a static height and width on the target element ' + el.outerHTML +
            ' before using textFit!');
        else
          throw new Error('Set a static width on the target element ' + el.outerHTML +
            ' before using textFit!');
      }
  
      // Add textFitted span inside this container.
      if (originalHTML.indexOf('textFitted') === -1) {
        innerSpan = document.createElement('span');
        innerSpan.className = 'textFitted';
        // Inline block ensure it takes on the size of its contents, even if they are enclosed
        // in other tags like <p>
        innerSpan.style['display'] = 'inline-block';
        innerSpan.innerHTML = originalHTML;
        el.innerHTML = '';
        el.appendChild(innerSpan);
      } else {
        // Reprocessing.
        innerSpan = el.querySelector('span.textFitted');
        // Remove vertical align if we're reprocessing.
        if (hasClass(innerSpan, 'textFitAlignVert')){
          innerSpan.className = innerSpan.className.replace('textFitAlignVert', '');
          innerSpan.style['height'] = '';
          el.className.replace('textFitAlignVertFlex', '');
        }
      }
  
      // Prepare & set alignment
      if (settings.alignHoriz) {
        el.style['text-align'] = 'center';
        innerSpan.style['text-align'] = 'center';
      }
  
      // Check if this string is multiple lines
      // Not guaranteed to always work if you use wonky line-heights
      var multiLine = settings.multiLine;
      if (settings.detectMultiLine && !multiLine &&
          innerSpan.scrollHeight >= parseInt(window.getComputedStyle(innerSpan)['font-size'], 10) * 2){
        multiLine = true;
      }
  
      // If we're not treating this as a multiline string, don't let it wrap.
      if (!multiLine) {
        el.style['white-space'] = 'nowrap';
      }
  
      low = settings.minFontSize + 1;
      high = settings.maxFontSize + 1;
  
      // Binary search for best fit
      while (low <= high) {
        mid = parseInt((low + high) / 2, 10);
        innerSpan.style.fontSize = mid + 'px';
        if(innerSpan.scrollWidth <= originalWidth && (settings.widthOnly || innerSpan.scrollHeight <= originalHeight)){
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      // Sub 1 at the very end, this is closer to what we wanted.
      innerSpan.style.fontSize = (mid - 1) + 'px';
  
      // Our height is finalized. If we are aligning vertically, set that up.
      if (settings.alignVert) {
        addStyleSheet();
        var height = innerSpan.scrollHeight;
        if (window.getComputedStyle(el)['position'] === "static"){
          el.style['position'] = 'relative';
        }
        if (!hasClass(innerSpan, "textFitAlignVert")){
          innerSpan.className = innerSpan.className + " textFitAlignVert";
        }
        innerSpan.style['height'] = height + "px";
        if (settings.alignVertWithFlexbox && !hasClass(el, "textFitAlignVertFlex")) {
          el.className = el.className + " textFitAlignVertFlex";
        }
      }
    }
  
    // Calculate height without padding.
    function innerHeight(el){
      var style = window.getComputedStyle(el, null);
      return el.clientHeight -
        parseInt(style.getPropertyValue('padding-top'), 10) -
        parseInt(style.getPropertyValue('padding-bottom'), 10);
    }
  
    // Calculate width without padding.
    function innerWidth(el){
      var style = window.getComputedStyle(el, null);
      return el.clientWidth -
        parseInt(style.getPropertyValue('padding-left'), 10) -
        parseInt(style.getPropertyValue('padding-right'), 10);
    }
  
    //Returns true if it is a DOM element
    function isElement(o){
      return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
      );
    }
  
    function hasClass(element, cls) {
      return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
  
    // Better than a stylesheet dependency
    function addStyleSheet() {
      if (document.getElementById("textFitStyleSheet")) return;
      var style = [
        ".textFitAlignVert{",
          "position: absolute;",
          "top: 0; right: 0; bottom: 0; left: 0;",
          "margin: auto;",
          "display: flex;",
          "justify-content: center;",
          "flex-direction: column;",
        "}",
        ".textFitAlignVertFlex{",
          "display: flex;",
        "}",
        ".textFitAlignVertFlex .textFitAlignVert{",
          "position: static;",
        "}",].join("");
  
      var css = document.createElement("style");
      css.type = "text/css";
      css.id = "textFitStyleSheet";
      css.innerHTML = style;
      document.body.appendChild(css);
    }
}));