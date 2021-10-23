// ################################################################
// ################################ VARIABLES ################################

//  pvz.probability.(plants/zombies).(character) = value (100 - 0)
//  pvz.options.(option name) = value (any)
let pvz = null;

const plants_char_image = new Image(), background_image = new Image(), zombies_char_image = new Image();
plants_char_image.alt = "error";
zombies_char_image.alt = "error";
background_image.alt = "error";

plants_char_image.style.border = "5px solid #63c750";
plants_char_image.draggable = false;

zombies_char_image.style.border = "5px solid #8b5de8";
zombies_char_image.draggable = false;

plants_char_image.classList.add("img-char");
zombies_char_image.classList.add("img-char");

function toggle_set(setnum){
    pvz.options.set_active[setnum] = !pvz.options.set_active[setnum];
}

// ################################################################
// ################################ RESTORE DEFAULT ################################
function default_probability() {
    pvz = null;
    pvz = {
        "probabilities": {
            "plants": {
                "chicharito": 100,
                "carnivora" : 100,
                "elote"     : 100,
                "champi"    : 100,
                "dragon"    : 100,
                "cactus"    : 100,
                "pomelo"    : 100,
                "nuez"      : 100,
                "girasol"   : 100,
                "rosa"      : 100,
                "flor"      : 100
            },
            "zombies": {
                "soldado"   : 100,
                "zombidito" : 100,
                "cerebroz"  : 100,
                "accion"    : 100,
                "patineta"  : 100,
                "pirata"    : 100,
                "allstar"   : 100,
                "cadete"    : 100,
                "cientifico": 100,
                "ingeniero" : 100,
                "mago"      : 100,
                "tele"      : 100
            }
        },
        "options": {
            "can_repeat_prev"    : false,  // Puede repetir el personaje anterior
                "current_char_p" : null,   // Personaje planta actual
                "current_char_z" : null,   // Personaje zombie actual

            "generate_interval" : 0, // Autogenerar tras dicho tiempo

            "set_active" : [true, true, true], // Probabilidades 1 - 3

            "character_image_list" : "none", // Lista de imagenes
            "background_image_list": "none", // Lista de imagenes
        }
    };

    localStorage.setItem("pvz_data", JSON.stringify(pvz));
}

// ################################################################
// ################################ RANDOMIZER SELECTOR ################################
function random_character(is_zombies) {

    let prob_sum = 0;
    let prob_intervals = [];
    let team = pvz.probabilities.plants;
    let prev_char = pvz.options.current_char_p;

    if(is_zombies) {
        team = pvz.probabilities.zombies;
        prev_char = pvz.options.current_char_z;
    }

    for (const charname in team) {
        if (Object.hasOwnProperty.call(team, charname)) {
            
            // Si el personaje no es el anterior, sumar probabilidad
            if(team[charname]) // Si es diferente a 0
            if( pvz.options.can_repeat_prev || charname != prev_char ) {

                prob_intervals.push( [prob_sum + 1, prob_sum + team[charname], charname] );
                prob_sum += team[charname];
            }
    }   }

    const rnd = random_range(1, prob_sum);

    for (let i = 0; i < prob_intervals.length; i++) {
        
        if( prob_intervals[i][0] <= rnd && rnd <= prob_intervals[i][1] ) {

            if(is_zombies) pvz.options.current_char_z = prob_intervals[i][2];
            else pvz.options.current_char_p = prob_intervals[i][2];

            return prob_intervals[i][2];
    }   }
    
    if(is_zombies) {
        if(pvz.probabilities.zombies.soldado) pvz.probabilities.zombies.zombidito = 10;
        pvz.probabilities.zombies.soldado = 10;

        return "soldado";
    }
    
    if(pvz.probabilities.plants.chicharito) pvz.probabilities.plants.carnivora = 10;
    pvz.probabilities.plants.chicharito = 10;

    return "chicharito";
}

// ################################################################
// ################################ SETS RANDOMIZER SELECTOR ################################
function random_set() {
    
    let range = [];

    if(pvz.options.set_active[0]) range.push("1");
    if(pvz.options.set_active[1]) range.push("2");
    if(pvz.options.set_active[2]) range.push("3");

    if(range.length <= 0) return "";

    return range[random_range(0, range.length-1)];
}

// ################################################################
// ################################ CHARACTER IMAGE LOADER ################################
function character_image(is_zombies) {

    const folder = pvz.options.character_image_list;
    const char = random_character(is_zombies);

    if(is_zombies) {
        zombies_char_image.src = `./images/character/${folder}/${char}.png`;
        zombies_char_image.alt = char;
    }
    else {
        plants_char_image.src = `./images/character/${folder}/${char}.png`;
        plants_char_image.alt = char;
    }
}

// ################################################################
// ################################ BACKGROUND LOADER ################################
function load_background() {

    const image_url = pvz.options.background_image_list;
    background_image.src = `./images/background/${image_url}.png`;
    background_image.alt = "";

    document.querySelector("body").background = `./images/background/${image_url}.png`;
}

// ################################################################
// ################################ START ################################
document.addEventListener("DOMContentLoaded", () => {

    // TEMPORIZADOR
    const obj_timer_display = document.querySelector("#timer-display");
    const timer = new Obj_Timer(obj_timer_display, null, null);

    // LOAD VARIABLES
    pvz = JSON.parse(localStorage.getItem("pvz_data"));
    if(pvz == null) default_probability();

    const plants_set = document.createElement("span");
    const zombies_set = document.createElement("span");
    plants_set.classList.add("normal-text", "text-shadow-x2", "font-size-72", "set-text");
    plants_set.style.color = "white";
    zombies_set.classList.add("normal-text", "text-shadow-x2", "font-size-72", "set-text");
    zombies_set.style.color = "white";

    load_background();

    // default_probability();

    // CLICK EN EQUIPO PLANTAS
    const obj_plants_button = document.querySelector("#plants-btn");
    obj_plants_button.appendChild(plants_set);
    obj_plants_button.addEventListener("click", (event) => {
        event.preventDefault();

        character_image(0);
        plants_set.innerText = random_set();
        obj_plants_button.appendChild(plants_char_image)
    });

    // CLICK EN EQUIPO ZOMBIES
    const obj_zombies_button = document.querySelector("#zombies-btn");
    obj_zombies_button.appendChild(zombies_set);
    obj_zombies_button.addEventListener("click", (event) => {
        event.preventDefault();

        character_image(1);
        zombies_set.innerText = random_set();
        obj_zombies_button.appendChild(zombies_char_image);
    });

    const obj_menu_container = document.querySelector("#menu-container");

    // CLICK EN EL BOTÓN DE SETTINGS
    const obj_settings_button = document.querySelector("#settings-btn");
    obj_settings_button.addEventListener("click", (event) => {
        event.preventDefault();
        obj_menu_container.style.visibility = "visible";

        timer.pause();
    });

    // CLICK EN REGRESAR
    const obj_back_button = document.querySelector("#return-btn");
    obj_back_button.addEventListener("click", (event) => {
        event.preventDefault();
        obj_menu_container.style.visibility = "hidden";

        localStorage.setItem("pvz_data", JSON.stringify(pvz));

        if(pvz.options.generate_interval == 0){
            timer.countdown = null;
            obj_timer_display.innerText = "Next click!";
        }
        else {
            timer.countdown = [pvz.options.generate_interval, 0, 0];
            timer.resume();
        }

    });

    // PROBABILITY INPUTS
    const obj_probability_input_plants_list = document.querySelectorAll(".plants-probability-input");
    const obj_probability_input_zombies_list = document.querySelectorAll(".zombies-probability-input");

    let i = 0;
    for (const charname in pvz.probabilities.plants)
    if (Object.hasOwnProperty.call(pvz.probabilities.plants, charname)) {
        
        const slider = obj_probability_input_plants_list[i];        
        slider.value = pvz.probabilities.plants[charname];

        slider.addEventListener("change", (event) => {
            event.preventDefault();
            pvz.probabilities.plants[charname] = parseInt(slider.value, 10);
        });

        i++;
    }

    i = 0;
    for (const charname in pvz.probabilities.zombies)
    if (Object.hasOwnProperty.call(pvz.probabilities.zombies, charname)) {

        const slider = obj_probability_input_zombies_list[i];        
        slider.value = pvz.probabilities.zombies[charname];

        slider.addEventListener("change", (event) => {
            event.preventDefault();
            pvz.probabilities.zombies[charname] = parseInt(slider.value, 10);
        });

        i++;
    }

    // REPETIR PERSONAJE
    const obj_repetir_personaje = document.querySelector("#repetir-personaje");
    obj_repetir_personaje.checked = pvz.options.can_repeat_prev;
    obj_repetir_personaje.addEventListener("change", (event) => {
        event.preventDefault();
        pvz.options.can_repeat_prev = obj_repetir_personaje.checked;
    });

    // INTERVALO DE AUTOGENERAR
    const obj_generar_intervalo = document.querySelector("#generar-intervalo");
    obj_generar_intervalo.value = `${pvz.options.generate_interval}`;
    obj_generar_intervalo.addEventListener("change", (event) => {
        event.preventDefault();
        pvz.options.generate_interval = obj_generar_intervalo.value;
    });

    // REINICIAR EL TEMPORIZADOR
    const obj_reset_timer = document.querySelector("#reset-timer");
    obj_reset_timer.addEventListener("click", (event) => {
        event.preventDefault();

        if(pvz.options.generate_interval == 0){
            timer.countdown = null;
            obj_timer_display.innerText = "Next click!";
        }
        else timer.countdown = [pvz.options.generate_interval, 0, 0];

        timer.restart();
        timer.pause();
        if(pvz.options.generate_interval != 0) timer.update_display();
    });

    // SETS PROBABILITY
    const obj_set_button_list = document.querySelectorAll("button[name=sets]");
    for (let i = 0; i < obj_set_button_list.length; i++) {
        const element = obj_set_button_list[i];

        if(pvz.options.set_active[i]) element.classList.replace("text-box-desselected", "text-box-selected");
        else element.classList.replace("text-box-selected", "text-box-desselected");
        
        element.addEventListener("click", (event) => {
            event.preventDefault();

            pvz.options.set_active[i] = !pvz.options.set_active[i];
            if(pvz.options.set_active[i]) element.classList.replace("text-box-desselected", "text-box-selected");
            else element.classList.replace("text-box-selected", "text-box-desselected");
        });
    }

    // IMAGENES DE PERSONAJE
    const obj_imagen_personajes = document.querySelector("#imagen-personajes");
    obj_imagen_personajes.value = `${pvz.options.character_image_list}`;
    obj_imagen_personajes.addEventListener("change", (event) => {
        event.preventDefault();
        pvz.options.character_image_list = obj_imagen_personajes.value;

        const folder = pvz.options.character_image_list;
        if(pvz.options.current_char_p != null) {
            plants_char_image.src = `./images/character/${folder}/${pvz.options.current_char_p}.png`;
            plants_char_image.alt = pvz.options.current_char_p;
        }

        if(pvz.options.current_char_z != null) {
            zombies_char_image.src = `./images/character/${folder}/${pvz.options.current_char_z}.png`;
            zombies_char_image.alt = pvz.options.current_char_z;
        }
    });

    // IMAGENES DE FONDO
    const obj_imagen_fondo = document.querySelector("#imagen-fondo");
    obj_imagen_fondo.value = `${pvz.options.background_image_list}`;
    obj_imagen_fondo.addEventListener("change", (event) => {
        event.preventDefault();

        pvz.options.background_image_list = obj_imagen_fondo.value;
        load_background();
    });


    // REESCOGER AL FINAL DE CADA TIMER
    function timer_timeout() {
        obj_plants_button.click();
        obj_zombies_button.click();
        timer.restart();
    }

    timer.ejfunction = timer_timeout;

    if(pvz.options.generate_interval == 0){
        timer.countdown = null;
        obj_timer_display.innerText = "Next click!";
    }
    else {
        timer.countdown = [pvz.options.generate_interval, 0, 0];
        timer.start();
    }

});

// ###################################################################################################################################
// ###################################################################################################################################
// ###################################################################################################################################
// ###################################################################################################################################
// ###################################################################################################################################
// ###################################################################################################################################
// ###################################################################################################################################
// ###################################################################################################################################

/*! NoSleep.js v0.12.0 - git.io/vfn01 - Rich Tibbett - MIT license */
(function webpackUniversalModuleDefinition(root, factory) {

	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["NoSleep"] = factory();
	else
		root["NoSleep"] = factory();

})(this, function() {
  
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(1),
    webm = _require.webm,
    mp4 = _require.mp4;

// Detect iOS browsers < version 10


var oldIOS = function oldIOS() {
  return typeof navigator !== "undefined" && parseFloat(("" + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) < 10 && !window.MSStream;
};

// Detect native Wake Lock API support
var nativeWakeLock = function nativeWakeLock() {
  return "wakeLock" in navigator;
};

var NoSleep = function () {
  function NoSleep() {
    var _this = this;

    _classCallCheck(this, NoSleep);

    this.enabled = false;
    if (nativeWakeLock()) {
      this._wakeLock = null;
      var handleVisibilityChange = function handleVisibilityChange() {
        if (_this._wakeLock !== null && document.visibilityState === "visible") {
          _this.enable();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      document.addEventListener("fullscreenchange", handleVisibilityChange);
    } else if (oldIOS()) {
      this.noSleepTimer = null;
    } else {
      // Set up no sleep video element
      this.noSleepVideo = document.createElement("video");

      this.noSleepVideo.setAttribute("title", "No Sleep");
      this.noSleepVideo.setAttribute("playsinline", "");

      this._addSourceToVideo(this.noSleepVideo, "webm", webm);
      this._addSourceToVideo(this.noSleepVideo, "mp4", mp4);

      this.noSleepVideo.addEventListener("loadedmetadata", function () {
        if (_this.noSleepVideo.duration <= 1) {
          // webm source
          _this.noSleepVideo.setAttribute("loop", "");
        } else {
          // mp4 source
          _this.noSleepVideo.addEventListener("timeupdate", function () {
            if (_this.noSleepVideo.currentTime > 0.5) {
              _this.noSleepVideo.currentTime = Math.random();
            }
          });
        }
      });
    }
  }

  _createClass(NoSleep, [{
    key: "_addSourceToVideo",
    value: function _addSourceToVideo(element, type, dataURI) {
      var source = document.createElement("source");
      source.src = dataURI;
      source.type = "video/" + type;
      element.appendChild(source);
    }
  }, {
    key: "enable",
    value: function enable() {
      var _this2 = this;

      if (nativeWakeLock()) {
        return navigator.wakeLock.request("screen").then(function (wakeLock) {
          _this2._wakeLock = wakeLock;
          _this2.enabled = true;
          console.log("Wake Lock active.");
          _this2._wakeLock.addEventListener("release", function () {
            // ToDo: Potentially emit an event for the page to observe since
            // Wake Lock releases happen when page visibility changes.
            // (https://web.dev/wakelock/#wake-lock-lifecycle)
            console.log("Wake Lock released.");
          });
        }).catch(function (err) {
          _this2.enabled = false;
          console.error(err.name + ", " + err.message);
          throw err;
        });
      } else if (oldIOS()) {
        this.disable();
        console.warn("\n        NoSleep enabled for older iOS devices. This can interrupt\n        active or long-running network requests from completing successfully.\n        See https://github.com/richtr/NoSleep.js/issues/15 for more details.\n      ");
        this.noSleepTimer = window.setInterval(function () {
          if (!document.hidden) {
            window.location.href = window.location.href.split("#")[0];
            window.setTimeout(window.stop, 0);
          }
        }, 15000);
        this.enabled = true;
        return Promise.resolve();
      } else {
        var playPromise = this.noSleepVideo.play();
        return playPromise.then(function (res) {
          _this2.enabled = true;
          return res;
        }).catch(function (err) {
          _this2.enabled = false;
          throw err;
        });
      }
    }
  }, {
    key: "disable",
    value: function disable() {
      if (nativeWakeLock()) {
        if (this._wakeLock) {
          this._wakeLock.release();
        }
        this._wakeLock = null;
      } else if (oldIOS()) {
        if (this.noSleepTimer) {
          console.warn("\n          NoSleep now disabled for older iOS devices.\n        ");
          window.clearInterval(this.noSleepTimer);
          this.noSleepTimer = null;
        }
      } else {
        this.noSleepVideo.pause();
      }
      this.enabled = false;
    }
  }, {
    key: "isEnabled",
    get: function get() {
      return this.enabled;
    }
  }]);

  return NoSleep;
}();

var noSleep = new NoSleep();

document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
}, false);

// module.exports = NoSleep;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  webm: "data:video/webm;base64,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",
  mp4: "data:video/mp4;base64,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"
};

/***/ })
/******/ ]);
});