/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/mini.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {


var noop = function() {};

Tiny.App = function(states)
{
    this.callbackContext = this;
    this.state = 0;
    this.timeScale = 1;
    this.width = 0;
    this.height = 0;
    this.systems = [];
    this.updatable = [];
    this.paused = false;
    this.pauseDuration = 0;
    this.inputView = document.body;

    states = states || {};
    this.boot = states.boot || this.boot || noop;
    this.preload = states.preload || this.preload || noop;
    this.create = states.create || this.create || noop;
    this.update = states.update || this.update || noop;
    this.render = states.render || this.render || noop;
    this._resize_cb = states.resize || noop;
    this._destroy_cb = states.destroy || noop;

    var self = this;
    setTimeout(function()
    {
        self._boot();
    }, 0);
}

Tiny.App.prototype._boot = function()
{

    for (var i = 0; i < Tiny.systems.length; i++)
    {
        var system = Tiny.systems[i];

        var _sys_ = new system._class_(this);
        this.systems.push(_sys_);
        if (_sys_.update) this.updatable.push(_sys_);

        if (system.name) this[system.name] = _sys_;
    }

    if (Tiny.RAF) 
    {
        this.raf = new Tiny.RAF(this);
    }

    this.boot.call(this.callbackContext);

    var self = this;
    setTimeout(function()
    {
        if (self.load) self._preload();
        else self._create();
    }, 0)
}

Tiny.App.prototype._preload = function()
{
    this.preload.call(this.callbackContext);
    this.state = 1;
    this.load.start(this._create);
};

Tiny.App.prototype._create = function() 
{
    this.create.call(this.callbackContext);

    if (this.raf) 
    {
        this.raf.start();
    }

    this.state = 2;
}


Tiny.App.prototype.pause = function() 
{
    if (this.raf) 
    {
        this.raf.reset();
    }

    if (!this.paused)
    {
        for (var i = 0; i < this.systems.length; i++)
        {
            if (this.systems[i].pause) this.systems[i].pause();
        }

        this.paused = true;
    }
}

Tiny.App.prototype.resume = function()
{
    if (this.raf) 
    {
        this.raf.reset();
    }
    
    if (this.paused)
    {
        for (var i = 0; i < this.systems.length; i++)
        {
            if (this.systems[i].resume) this.systems[i].resume();
        }

        this.paused = false;
    }
}

Tiny.App.prototype._update = function(time, delta)
{
    if (!this.paused)
    {
        this.update.call(this.callbackContext, time, delta);

        for (var i = 0; i < this.updatable.length; i++)
        {
            this.updatable[i].update(delta);
        }
    }
    else
    {
        this.pauseDuration += delta
    }

    this.render();
}


Tiny.App.prototype.resize = function(width, height)
{
    this.width = width || this.width;
    this.height = height || this.height;

    if (this.state > 0) 
    {
        this._resize_cb.call(this.callbackContext, this.width, this.height);
    }

    var self = this;
    setTimeout(function()
    {
        if (self.input) self.input.updateBounds();
    }, 0)
}

Tiny.App.prototype.destroy = function(clearCache)
{
    for (var i = 0; i < this.systems.length; i++)
    {
        if (this.systems[i].destroy) this.systems[i].destroy(clearCache);
    }

    this.paused = true;

    if (clearCache) 
    {
        this.load.clearCache();
    }

    if (this.raf) 
    {
        this.raf.stop();
    }

    this._destroy_cb.call(this.callbackContext);
}


/***/ }),

/***/ "./src/base.js":
/*!*********************!*\
  !*** ./src/base.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./utils/polyfill.js */ "./src/utils/polyfill.js");

window.Tiny = {};

__webpack_require__(/*! ./App.js */ "./src/App.js");
__webpack_require__(/*! ./global.js */ "./src/global.js");
__webpack_require__(/*! ./math/Math.js */ "./src/math/Math.js"); // 1 Kb
__webpack_require__(/*! ./math/Point.js */ "./src/math/Point.js");      //
__webpack_require__(/*! ./math/Matrix.js */ "./src/math/Matrix.js");     //
__webpack_require__(/*! ./math/Rectangle.js */ "./src/math/Rectangle.js");  //  8 Kb

__webpack_require__(/*! ./objects/BaseObject2D.js */ "./src/objects/BaseObject2D.js");             //
__webpack_require__(/*! ./objects/Object2D.js */ "./src/objects/Object2D.js");    //
__webpack_require__(/*! ./objects/Scene.js */ "./src/objects/Scene.js");                     // 10 Kb

__webpack_require__(/*! ./renderer/CanvasRenderer.js */ "./src/renderer/CanvasRenderer.js"); // 3 Kb

/***/ }),

/***/ "./src/global.js":
/*!***********************!*\
  !*** ./src/global.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {


Tiny.VERSION = "1.4.9";

Tiny.systems = [];

Tiny.registerSystem = function(name, system) {
    Tiny.systems.push({
        name: name,
        _class_: system
    });
}

Tiny.Primitives = {
    POLY: 0,
    RECT: 1, 
    CIRC: 2,
    ELIP: 3,
    RREC: 4,
    RREC_LJOIN: 5
}

Tiny.rnd = function(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
};

Tiny.color2rgb = function(style) {
    return Tiny.hex2rgb(Tiny.style2hex(style));
}

Tiny.color2style = function(style) {
    return style;
};

Tiny.style2hex = function(style) {
    return +style.replace('#', '0x');
};

Tiny.hex2style = function(hex) {
    return "#" + ("00000" + ( hex | 0).toString(16)).substr(-6);
}

Tiny.hex2rgb = function(hex) {
    return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF)/ 255];
};

Tiny.rgb2hex = function(rgb) {
    return ((rgb[0]*255 << 16) + (rgb[1]*255 << 8) + rgb[2]*255);
};

/***/ }),

/***/ "./src/math/Math.js":
/*!**************************!*\
  !*** ./src/math/Math.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {


Tiny.Math = {

    distance: function (x1, y1, x2, y2) {

        var dx = x1 - x2;
        var dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);

    }
};

var degreeToRadiansFactor = Math.PI / 180;
var radianToDegreesFactor = 180 / Math.PI;

Tiny.Math.degToRad = function degToRad (degrees) {
    return degrees * degreeToRadiansFactor;
};

Tiny.Math.radToDeg = function radToDeg (radians) {
    return radians * radianToDegreesFactor;
};

/***/ }),

/***/ "./src/math/Matrix.js":
/*!****************************!*\
  !*** ./src/math/Matrix.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {


Tiny.Matrix = function()
{

    this.a = 1;

    this.b = 0;

    this.c = 0;

    this.d = 1;

    this.tx = 0;

    this.ty = 0;

    this.type = Tiny.MATRIX;

};

Tiny.Matrix.prototype.fromArray = function(array)
{
    this.a = array[0];
    this.b = array[1];
    this.c = array[3];
    this.d = array[4];
    this.tx = array[2];
    this.ty = array[5];
};


Tiny.Matrix.prototype.toArray = function(transpose)
{
    if (!this.array)
    {
        this.array = new Float32Array(9);
    }

    var array = this.array;

    if (transpose)
    {
        array[0] = this.a;
        array[1] = this.b;
        array[2] = 0;
        array[3] = this.c;
        array[4] = this.d;
        array[5] = 0;
        array[6] = this.tx;
        array[7] = this.ty;
        array[8] = 1;
    }
    else
    {
        array[0] = this.a;
        array[1] = this.c;
        array[2] = this.tx;
        array[3] = this.b;
        array[4] = this.d;
        array[5] = this.ty;
        array[6] = 0;
        array[7] = 0;
        array[8] = 1;
    }

    return array;
};

Tiny.Matrix.prototype.apply = function(pos, newPos)
{
    newPos = newPos || new Tiny.Point();

    var x = pos.x;
    var y = pos.y;

    newPos.x = this.a * x + this.c * y + this.tx;
    newPos.y = this.b * x + this.d * y + this.ty;

    return newPos;
};

Tiny.Matrix.prototype.applyInverse = function(pos, newPos)
{
    newPos = newPos || new Tiny.Point();

    var id = 1 / (this.a * this.d + this.c * -this.b);
    var x = pos.x;
    var y = pos.y;

    newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
    newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;

    return newPos;
};

Tiny.Matrix.prototype.translate = function(x, y)
{
    this.tx += x;
    this.ty += y;
    
    return this;
};

Tiny.Matrix.prototype.scale = function(x, y)
{
    this.a *= x;
    this.d *= y;
    this.c *= x;
    this.b *= y;
    this.tx *= x;
    this.ty *= y;

    return this;
};

Tiny.Matrix.prototype.rotate = function(angle)
{
    var cos = Math.cos( angle );
    var sin = Math.sin( angle );

    var a1 = this.a;
    var c1 = this.c;
    var tx1 = this.tx;

    this.a = a1 * cos-this.b * sin;
    this.b = a1 * sin+this.b * cos;
    this.c = c1 * cos-this.d * sin;
    this.d = c1 * sin+this.d * cos;
    this.tx = tx1 * cos - this.ty * sin;
    this.ty = tx1 * sin + this.ty * cos;
 
    return this;
};

Tiny.Matrix.prototype.append = function(matrix)
{
    var a1 = this.a;
    var b1 = this.b;
    var c1 = this.c;
    var d1 = this.d;

    this.a  = matrix.a * a1 + matrix.b * c1;
    this.b  = matrix.a * b1 + matrix.b * d1;
    this.c  = matrix.c * a1 + matrix.d * c1;
    this.d  = matrix.c * b1 + matrix.d * d1;

    this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
    this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;
    
    return this;
};

Tiny.Matrix.prototype.identity = function()
{
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;

    return this;
};

Tiny.identityMatrix = new Tiny.Matrix();

/***/ }),

/***/ "./src/math/Point.js":
/*!***************************!*\
  !*** ./src/math/Point.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

Tiny.Point = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Tiny.Point.prototype = {
	 set: function (x, y) {
        this.x = x || 0;
        this.y = y || ( (y !== 0) ? this.x : 0 );

        return this;
    }
};

/***/ }),

/***/ "./src/math/Rectangle.js":
/*!*******************************!*\
  !*** ./src/math/Rectangle.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {


Tiny.Rectangle = function (x, y, width, height) {

    x = x || 0;
    y = y || 0;
    width = width || 0;
    height = height || 0;

    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.type = Tiny.Primitives.RECT
};

Tiny.Rectangle.prototype = {

    setTo: function (x, y, width, height) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;

    },

    contains: function (x, y) {

        return Tiny.Rectangle.contains(this, x, y);

    },

    intersects: function (b) {

        return Tiny.Rectangle.intersects(this, b);

    }

};

Object.defineProperty(Tiny.Rectangle.prototype, "bottom", {

    get: function () {
        return this.y + this.height;
    },

    set: function (value) {
        if (value <= this.y) {
            this.height = 0;
        } else {
            this.height = value - this.y;
        }
    }

});

Object.defineProperty(Tiny.Rectangle.prototype, "right", {

    get: function () {
        return this.x + this.width;
    },

    set: function (value) {
        if (value <= this.x) {
            this.width = 0;
        } else {
            this.width = value - this.x;
        }
    }

});

Object.defineProperty(Tiny.Rectangle.prototype, "volume", {

    get: function () {
        return this.width * this.height;
    }

});

Tiny.Rectangle.prototype.constructor = Tiny.Rectangle;

Tiny.Rectangle.contains = function (a, x, y) {

    if (a.width <= 0 || a.height <= 0)
    {
        return false;
    }

    return (x >= a.x && x < a.right && y >= a.y && y < a.bottom);

};

Tiny.Rectangle.containsPoint = function (a, point) {

    return Tiny.Rectangle.contains(a, point.x, point.y);

};

Tiny.Rectangle.containsRect = function (a, b) {

    //  If the given rect has a larger volume than this one then it can never contain it
    if (a.volume > b.volume)
    {
        return false;
    }

    return (a.x >= b.x && a.y >= b.y && a.right < b.right && a.bottom < b.bottom);

};

Tiny.Rectangle.intersects = function (a, b) {

    if (a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0)
    {
        return false;
    }

    return !(a.right < b.x || a.bottom < b.y || a.x > b.right || a.y > b.bottom);

};

Tiny.EmptyRectangle = new Tiny.Rectangle(0, 0, 0, 0);

/***/ }),

/***/ "./src/mini.js":
/*!*********************!*\
  !*** ./src/mini.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./base.js */ "./src/base.js")


__webpack_require__(/*! ./systems/RAF.js */ "./src/systems/RAF.js"); // 2 Kb
// require('./systems/ObjectCreator.js'); // 1 Kb
__webpack_require__(/*! ./systems/Loader.js */ "./src/systems/Loader.js"); // 3 Kb
__webpack_require__(/*! ./systems/Input.js */ "./src/systems/Input.js"); // 1 Kb
__webpack_require__(/*! ./systems/Timer.js */ "./src/systems/Timer.js"); // 1 Kb

__webpack_require__(/*! ./utils/EventEmitter.js */ "./src/utils/EventEmitter.js");

__webpack_require__(/*! ./textures/Texture.js */ "./src/textures/Texture.js");		// 4 Kb

__webpack_require__(/*! ./objects/Sprite.js */ "./src/objects/Sprite.js"); // 3 Kb
__webpack_require__(/*! ./objects/Text.js */ "./src/objects/Text.js"); // 5 Kb




/***/ }),

/***/ "./src/objects/BaseObject2D.js":
/*!*************************************!*\
  !*** ./src/objects/BaseObject2D.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {


var pi2 = Math.PI * 2;

Tiny.BaseObject2D = function()
{
    this.position = new Tiny.Point(0, 0);
    this.scale = new Tiny.Point(1, 1);
    this.pivot = new Tiny.Point(0, 0);
    this.rotation = 0;
    this.alpha = 1;
    this.visible = true;
    this.renderable = false;
    this.parent = null;
    this.worldAlpha = 1;
    this.worldTransform = new Tiny.Matrix();
    this._sr = 0;
    this._cr = 1;
    this._cacheAsBitmap = false;
};


Tiny.BaseObject2D.prototype.constructor = Tiny.BaseObject2D;


Tiny.BaseObject2D.prototype.destroy = function()
{
    if (this.parent)
        this.parent.remove( this )

    this.parent = null;
    this.worldTransform = null;
    this.visible = false;
    this.renderable = false;
    this._destroyCachedSprite();
};

Object.defineProperty(Tiny.BaseObject2D.prototype, 'worldVisible', {

    get: function() {

        var item = this;

        do
        {
            if (!item.visible) return false;
            item = item.parent;
        }
        while(item);

        return true;
    }

});

Object.defineProperty(Tiny.BaseObject2D.prototype, 'cacheAsBitmap', {

    get: function() {
        return  this._cacheAsBitmap;
    },

    set: function(value) {

        if (this._cacheAsBitmap === value) return;

        if (value)
        {
            this._generateCachedSprite();
        }
        else
        {
            this._destroyCachedSprite();
        }

        this._cacheAsBitmap = value;
    }
});

Tiny.BaseObject2D.prototype.updateTransform = function()
{
    if (!this.parent)
    {
        return;
    }

    // create some matrix refs for easy access
    var pt = this.parent.worldTransform;
    var wt = this.worldTransform;

    // temporary matrix variables
    var a, b, c, d, tx, ty;

    // so if rotation is between 0 then we can simplify the multiplication process..
    if (this.rotation % pi2)
    {
        // check to see if the rotation is the same as the previous render. This means we only need to use sin and cos when rotation actually changes
        if (this.rotation !== this.rotationCache)
        {
            this.rotationCache = this.rotation;
            this._sr = Math.sin(this.rotation);
            this._cr = Math.cos(this.rotation);
        }

        // get the matrix values of the displayobject based on its transform properties..
        a  =  this._cr * this.scale.x;
        b  =  this._sr * this.scale.x;
        c  = -this._sr * this.scale.y;
        d  =  this._cr * this.scale.y;
        tx =  this.position.x;
        ty =  this.position.y;
        
        // check for pivot.. not often used so geared towards that fact!
        if (this.pivot.x || this.pivot.y)
        {
            tx -= this.pivot.x * a + this.pivot.y * c;
            ty -= this.pivot.x * b + this.pivot.y * d;
        }

        // concat the parent matrix with the objects transform.
        wt.a  = a  * pt.a + b  * pt.c;
        wt.b  = a  * pt.b + b  * pt.d;
        wt.c  = c  * pt.a + d  * pt.c;
        wt.d  = c  * pt.b + d  * pt.d;
        wt.tx = tx * pt.a + ty * pt.c + pt.tx;
        wt.ty = tx * pt.b + ty * pt.d + pt.ty;
    }
    else
    {
        // lets do the fast version as we know there is no rotation..
        a  = this.scale.x;
        d  = this.scale.y;

        tx = this.position.x - this.pivot.x * a;
        ty = this.position.y - this.pivot.y * d;

        wt.a  = a  * pt.a;
        wt.b  = a  * pt.b;
        wt.c  = d  * pt.c;
        wt.d  = d  * pt.d;
        wt.tx = tx * pt.a + ty * pt.c + pt.tx;
        wt.ty = tx * pt.b + ty * pt.d + pt.ty;
    }

    // multiply the alphas..
    this.worldAlpha = this.alpha * this.parent.worldAlpha;

};

// performance increase to avoid using call.. (10x faster)
Tiny.BaseObject2D.prototype.displayObjectUpdateTransform = Tiny.BaseObject2D.prototype.updateTransform;

Tiny.BaseObject2D.prototype.getBounds = function(matrix)
{
    matrix = matrix;//just to get passed js hinting (and preserve inheritance)
    return Tiny.EmptyRectangle;
};

Tiny.BaseObject2D.prototype.getLocalBounds = function()
{
    return this.getBounds(Tiny.identityMatrix);
};

Tiny.BaseObject2D.prototype.generateTexture = function(resolution, renderer)
{
    var bounds = this.getLocalBounds();

    var renderTexture = new Tiny.RenderTexture(bounds.width | 0, bounds.height | 0, renderer, resolution);
    
    Tiny.BaseObject2D._tempMatrix.tx = -bounds.x;
    Tiny.BaseObject2D._tempMatrix.ty = -bounds.y;
    
    renderTexture.render(this, Tiny.BaseObject2D._tempMatrix);

    return renderTexture;
};

Tiny.BaseObject2D.prototype.updateCache = function()
{
    this._generateCachedSprite();
};


Tiny.BaseObject2D.prototype.toGlobal = function(position)
{
    // don't need to u[date the lot
    this.displayObjectUpdateTransform();
    return this.worldTransform.apply(position);
};

Tiny.BaseObject2D.prototype.toLocal = function(position, from)
{
    if (from)
    {
        position = from.toGlobal(position);
    }

    // don't need to u[date the lot
    this.displayObjectUpdateTransform();

    return this.worldTransform.applyInverse(position);
};

Tiny.BaseObject2D.prototype._renderCachedSprite = function(renderSession)
{
    this._cachedSprite.worldAlpha = this.worldAlpha;

    Tiny.Sprite.prototype.render.call(this._cachedSprite, renderSession);
    
};

Tiny.BaseObject2D.prototype._generateCachedSprite = function()
{
    this._cachedSprite = null
    this._cacheAsBitmap = false;

    var bounds = this.getLocalBounds();

    if (!this._cachedSprite)
    {
        var renderTexture = new Tiny.RenderTexture(bounds.width | 0, bounds.height | 0);//, renderSession.renderer);

        this._cachedSprite = new Tiny.Sprite(renderTexture);
        this._cachedSprite.worldTransform = this.worldTransform;
    }
    else
    {
        this._cachedSprite.texture.resize(bounds.width | 0, bounds.height | 0);
    }


    Tiny.BaseObject2D._tempMatrix.tx = -bounds.x;
    Tiny.BaseObject2D._tempMatrix.ty = -bounds.y;
    
    this._cachedSprite.texture.render(this, Tiny.BaseObject2D._tempMatrix, true);

    this._cachedSprite.anchor.x = -( bounds.x / bounds.width );
    this._cachedSprite.anchor.y = -( bounds.y / bounds.height );

    this._cacheAsBitmap = true;
};

Tiny.BaseObject2D.prototype._destroyCachedSprite = function()
{
    if (!this._cachedSprite) return;

    this._cachedSprite.texture.destroy(true);

    this._cachedSprite = null;
};


Tiny.BaseObject2D.prototype.render = function(renderSession)
{
    
};

Object.defineProperty(Tiny.BaseObject2D.prototype, 'x', {

    get: function() {
        return this.position.x;
    },

    set: function(value) {
        this.position.x = value;
    }

});

Object.defineProperty(Tiny.BaseObject2D.prototype, 'y', {

    get: function() {
        return this.position.y;
    },

    set: function(value) {
        this.position.y = value;
    }

});

Tiny.BaseObject2D._tempMatrix = new Tiny.Matrix();

/***/ }),

/***/ "./src/objects/Object2D.js":
/*!*********************************!*\
  !*** ./src/objects/Object2D.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {


Tiny.Object2D = function()
{
    Tiny.BaseObject2D.call(this);

    this.children = [];
    this._bounds = new Tiny.Rectangle(0, 0, 1, 1);
    this._currentBounds = null;
    this._mask = null;
};

Tiny.Object2D.prototype = Object.create( Tiny.BaseObject2D.prototype );
Tiny.Object2D.prototype.constructor = Tiny.Object2D;

// Object.defineProperty(Tiny.Object2D.prototype, 'inputEnabled', {

//     get: function() {
//         return (this.input && this.input.enabled)
//     },

//     set: function(value) {
//         if (value) {
//             if (this.input === null) {
//                 this.input = {enabled: true, parent: this}
//                 Tiny.EventTarget.mixin(this.input)
//             } else 
//                 this.input.enabled = true
//         } else {
//             this.input !== null && (this.input.enabled = false)
//         }
//     }

// });

Object.defineProperty(Tiny.Object2D.prototype, 'width', {

    get: function() {
        return this.scale.x * this.getLocalBounds().width;
    },

    set: function(value) {
        
        var width = this.getLocalBounds().width;

        if(width !== 0)
        {
            this.scale.x = value / width;
        }
        else
        {
            this.scale.x = 1;
        }

        
        this._width = value;
    }
});

Object.defineProperty(Tiny.Object2D.prototype, 'height', {

    get: function() {
        return  this.scale.y * this.getLocalBounds().height;
    },

    set: function(value) {

        var height = this.getLocalBounds().height;

        if (height !== 0)
        {
            this.scale.y = value / height ;
        }
        else
        {
            this.scale.y = 1;
        }

        this._height = value;
    }

});

Object.defineProperty(Tiny.Object2D.prototype, 'mask', {

    get: function() {
        return this._mask;
    },

    set: function(value) {

        if (this._mask) this._mask.isMask = false;

        this._mask = value;

        if (this._mask) this._mask.isMask = true;
    }

});

Tiny.Object2D.prototype.destroy = function()
{
    var i = this.children.length;

    while (i--)
    {
        this.children[i].destroy();
    }

    this.children = [];
    
    Tiny.BaseObject2D.prototype.destroy.call(this);

    this._bounds = null;
    this._currentBounds = null;
    this._mask = null;
    
    if (this.input) this.input.system.remove(this);
};

Tiny.Object2D.prototype.add = function(child)
{
    return this.addChildAt(child, this.children.length);
};

Tiny.Object2D.prototype.addChildAt = function(child, index)
{
    if(index >= 0 && index <= this.children.length)
    {
        if(child.parent)
        {
            child.parent.remove(child);
        }

        child.parent = this;

        child.game = this.game;

        this.children.splice(index, 0, child);

        return child;
    }
    else
    {
        throw new Error(child + 'addChildAt: The index '+ index +' supplied is out of bounds ' + this.children.length);
    }
};

Tiny.Object2D.prototype.swapChildren = function(child, child2)
{
    if(child === child2) {
        return;
    }

    var index1 = this.getChildIndex(child);
    var index2 = this.getChildIndex(child2);

    if(index1 < 0 || index2 < 0) {
        throw new Error('swapChildren: Both the supplied Objects must be a child of the caller.');
    }

    this.children[index1] = child2;
    this.children[index2] = child;

};

Tiny.Object2D.prototype.getChildIndex = function(child)
{
    var index = this.children.indexOf(child);
    if (index === -1)
    {
        throw new Error('The supplied Object must be a child of the caller');
    }
    return index;
};

Tiny.Object2D.prototype.setChildIndex = function(child, index)
{
    if (index < 0 || index >= this.children.length)
    {
        throw new Error('The supplied index is out of bounds');
    }
    var currentIndex = this.getChildIndex(child);
    this.children.splice(currentIndex, 1); //remove from old position
    this.children.splice(index, 0, child); //add at new position
};

Tiny.Object2D.prototype.getChildAt = function(index)
{
    if (index < 0 || index >= this.children.length)
    {
        throw new Error('getChildAt: Supplied index '+ index +' does not exist in the child list, or the supplied Object must be a child of the caller');
    }
    return this.children[index];
    
};

Tiny.Object2D.prototype.remove = function(child)
{
    var index = this.children.indexOf( child );
    if(index === -1)return;
    
    return this.removeChildAt( index );
};

Tiny.Object2D.prototype.removeChildAt = function(index)
{
    var child = this.getChildAt( index );
    child.parent = undefined;
    this.children.splice( index, 1 );
    return child;
};

Tiny.Object2D.prototype.removeChildren = function(beginIndex, endIndex)
{
    var begin = beginIndex || 0;
    var end = typeof endIndex === 'number' ? endIndex : this.children.length;
    var range = end - begin;

    if (range > 0 && range <= end)
    {
        var removed = this.children.splice(begin, range);
        for (var i = 0; i < removed.length; i++) {
            var child = removed[i];
            child.parent = undefined;
        }
        return removed;
    }
    else if (range === 0 && this.children.length === 0)
    {
        return [];
    }
    else
    {
        throw new Error( 'removeChildren: Range Error, numeric values are outside the acceptable range' );
    }
};

Tiny.Object2D.prototype.updateTransform = function()
{
    if(!this.visible)return;

    this.displayObjectUpdateTransform();

    if(this._cacheAsBitmap)return;

    for(var i=0,j=this.children.length; i<j; i++)
    {
        this.children[i].updateTransform();
    }
};

// performance increase to avoid using call.. (10x faster)
Tiny.Object2D.prototype.displayObjectContainerUpdateTransform = Tiny.Object2D.prototype.updateTransform;

Tiny.Object2D.prototype.getBounds = function()
{
    if(this.children.length === 0)return Tiny.EmptyRectangle;
    if (this._cachedSprite) return this._cachedSprite.getBounds()

    // TODO the bounds have already been calculated this render session so return what we have

    var minX = Infinity;
    var minY = Infinity;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var childBounds;
    var childMaxX;
    var childMaxY;

    var childVisible = false;

    for(var i=0,j=this.children.length; i<j; i++)
    {
        var child = this.children[i];
        
        if(!child.visible)continue;

        childVisible = true;

        childBounds = this.children[i].getBounds();
     
        minX = minX < childBounds.x ? minX : childBounds.x;
        minY = minY < childBounds.y ? minY : childBounds.y;

        childMaxX = childBounds.width + childBounds.x;
        childMaxY = childBounds.height + childBounds.y;

        maxX = maxX > childMaxX ? maxX : childMaxX;
        maxY = maxY > childMaxY ? maxY : childMaxY;
    }

    if(!childVisible)
        return Tiny.EmptyRectangle;

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.y = minY;
    bounds.width = maxX - minX;
    bounds.height = maxY - minY;

    // TODO: store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    //this._currentBounds = bounds;
   
    return bounds;
};

Tiny.Object2D.prototype.getLocalBounds = function()
{
    var matrixCache = this.worldTransform;

    this.worldTransform = Tiny.identityMatrix;

    for(var i=0,j=this.children.length; i<j; i++)
    {
        this.children[i].updateTransform();
    }

    var bounds = this.getBounds();

    this.worldTransform = matrixCache;

    return bounds;
};

Tiny.Object2D.prototype.render = function(renderSession)
{
    if (this.visible === false || this.alpha === 0) return;

    if (this._cacheAsBitmap)
    {
        this._renderCachedSprite(renderSession);
        return;
    }

    if (this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession);
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i].render(renderSession);
    }

    if (this._mask)
    {
        renderSession.maskManager.popMask(renderSession);
    }
};

/***/ }),

/***/ "./src/objects/Scene.js":
/*!******************************!*\
  !*** ./src/objects/Scene.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

Tiny.Scene = function(game)
{
    Tiny.Object2D.call( this );
    this.worldTransform = new Tiny.Matrix();
    this.game = game;
};

Tiny.Scene.prototype = Object.create( Tiny.Object2D.prototype );
Tiny.Scene.prototype.constructor = Tiny.Scene;

Tiny.Scene.prototype.updateTransform = function()
{
    this.worldAlpha = 1;

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i].updateTransform();
    }
};

/***/ }),

/***/ "./src/objects/Sprite.js":
/*!*******************************!*\
  !*** ./src/objects/Sprite.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {


Tiny.Sprite = function(texture, key)
{
    Tiny.Object2D.call(this);

    this.anchor = new Tiny.Point();

    this.setTexture(texture, key, false);

    this._width = 0;

    this._height = 0;

    this._frame = 0;

    this.tint = "#FFFFFF";

    this.blendMode = "source-over";

    if (this.texture.hasLoaded)
    {
        this.onTextureUpdate();
    }

    this.renderable = true;
};


Tiny.Sprite.prototype = Object.create(Tiny.Object2D.prototype);
Tiny.Sprite.prototype.constructor = Tiny.Sprite;

Object.defineProperty(Tiny.Sprite.prototype, 'frameName', {

    get: function() {
        return this.texture.frame.name
    },

    set: function(value) {
        if (this.texture.frame.name) 
        {
            this.setTexture(Tiny.Cache.texture[this.texture.key + "." + value])
        }
    }

});

Object.defineProperty(Tiny.Sprite.prototype, 'frame', {

    get: function() {
        return this._frame
    },

    set: function(value) {
        if (this.texture.lastFrame) {
            this._frame = value
            if (this._frame > this.texture.lastFrame)
                this._frame = 0
            this.setTexture(Tiny.Cache.texture[this.texture.key + "." + this._frame])
        }
    }

});

Object.defineProperty(Tiny.Sprite.prototype, 'width', {

    get: function() {
        return this.scale.x * this.texture.frame.width;
    },

    set: function(value) {
        this.scale.x = value / this.texture.frame.width;
        this._width = value;
    }

});

Object.defineProperty(Tiny.Sprite.prototype, 'height', {

    get: function() {
        return  this.scale.y * this.texture.frame.height;
    },

    set: function(value) {
        this.scale.y = value / this.texture.frame.height;
        this._height = value;
    }

});

Tiny.Sprite.prototype.setTexture = function(texture, key, updateDimension)
{
    if (typeof texture == "string") 
    {
        var imagePath = texture;

        if (key != undefined) 
        {
            imagePath = imagePath + "." + key;
        }

        texture = Tiny.Cache.texture[imagePath];

        if (!texture) 
        {
            texture = new Tiny.Texture(imagePath);
            // throw new Error('Cache Error: image ' + imagePath + ' does`t found in cache');
        }
    }

    if (this.texture === texture) return false;

    this.texture = texture;
    this.cachedTint = 0xFFFFFF;

    if (updateDimension === true) 
    {
        this.onTextureUpdate();
    }

    return true;
};

Tiny.Sprite.prototype.onTextureUpdate = function()
{
    // so if _width is 0 then width was not set..
    if (this._width) this.scale.x = this._width / this.texture.frame.width;
    if (this._height) this.scale.y = this._height / this.texture.frame.height;
};

Tiny.Sprite.prototype.animate = function(timer, delay)
{
    if (this.texture.lastFrame && this.texture.frame.index != undefined) 
    {
        delay = delay || (this.texture.frame.duration || 100);

        if (!this.animation) 
        {
            this.animation = timer.loop(delay, function() {
                this.frame += 1;
                this.animation.delay = delay || (this.texture.frame.duration || 100);
            }.bind(this));
            
            this.animation.start();
        }
        else
        {
            this.animation.delay = delay;
            this.animation.start();
        }
    }
};

Tiny.Sprite.prototype.getBounds = function(matrix)
{
    var width = this.texture.frame.width / this.texture.resolution;
    var height = this.texture.frame.height / this.texture.resolution;

    var w0 = width * (1-this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1-this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = matrix || this.worldTransform;

    var a = worldTransform.a;
    var b = worldTransform.b;
    var c = worldTransform.c;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    if (b === 0 && c === 0)
    {
        // // scale may be negative!
        // if (a < 0) a *= -1;
        // if (d < 0) d *= -1;

        // // this means there is no rotation going on right? RIGHT?
        // // if thats the case then we can avoid checking the bound values! yay         
        // minX = a * w1 + tx;
        // maxX = a * w0 + tx;
        // minY = d * h1 + ty;
        // maxY = d * h0 + ty;

        if (a < 0) {
            minX = a * w0 + tx;
            maxX = a * w1 + tx;
        } else {
            minX = a * w1 + tx;
            maxX = a * w0 + tx;
        }

        if (d < 0) {
            minY = d * h0 + ty;
            maxY = d * h1 + ty;
        } else {
            minY = d * h1 + ty;
            maxY = d * h0 + ty;
        }
    }
    else
    {
        var x1 = a * w1 + c * h1 + tx;
        var y1 = d * h1 + b * w1 + ty;

        var x2 = a * w0 + c * h1 + tx;
        var y2 = d * h1 + b * w0 + ty;

        var x3 = a * w0 + c * h0 + tx;
        var y3 = d * h0 + b * w0 + ty;

        var x4 =  a * w1 + c * h0 + tx;
        var y4 =  d * h0 + b * w1 + ty;

        minX = x1 < minX ? x1 : minX;
        minX = x2 < minX ? x2 : minX;
        minX = x3 < minX ? x3 : minX;
        minX = x4 < minX ? x4 : minX;

        minY = y1 < minY ? y1 : minY;
        minY = y2 < minY ? y2 : minY;
        minY = y3 < minY ? y3 : minY;
        minY = y4 < minY ? y4 : minY;

        maxX = x1 > maxX ? x1 : maxX;
        maxX = x2 > maxX ? x2 : maxX;
        maxX = x3 > maxX ? x3 : maxX;
        maxX = x4 > maxX ? x4 : maxX;

        maxY = y1 > maxY ? y1 : maxY;
        maxY = y2 > maxY ? y2 : maxY;
        maxY = y3 > maxY ? y3 : maxY;
        maxY = y4 > maxY ? y4 : maxY;
    }

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    this._currentBounds = bounds;

    return bounds;
};


Tiny.Sprite.prototype.render = function(renderSession)
{
    // If the sprite is not visible or the alpha is 0 then no need to render this element
    if (this.visible === false || this.alpha === 0 || this.renderable === false || this.texture.crop.width <= 0 || this.texture.crop.height <= 0) return;

    if (this.blendMode !== renderSession.currentBlendMode)
    {
        renderSession.currentBlendMode = this.blendMode;
        renderSession.context.globalCompositeOperation = renderSession.currentBlendMode;
    }

    if (this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession);
    }

    //  Ignore null sources
    if (this.texture.valid)
    {
        var resolution = this.texture.resolution / renderSession.resolution;

        renderSession.context.globalAlpha = this.worldAlpha;


        //  If the texture is trimmed we offset by the trim x/y, otherwise we use the frame dimensions
        var dx = (this.texture.trim) ? this.texture.trim.x - this.anchor.x * this.texture.trim.width : this.anchor.x * -this.texture.frame.width;
        var dy = (this.texture.trim) ? this.texture.trim.y - this.anchor.y * this.texture.trim.height : this.anchor.y * -this.texture.frame.height;

        //  Allow for pixel rounding
        if (renderSession.roundPixels)
        {
            renderSession.context.setTransform(
                this.worldTransform.a,
                this.worldTransform.b,
                this.worldTransform.c,
                this.worldTransform.d,
                (this.worldTransform.tx * renderSession.resolution) | 0,
                (this.worldTransform.ty * renderSession.resolution) | 0);
            dx = dx | 0;
            dy = dy | 0;
        }
        else
        {
            renderSession.context.setTransform(
                this.worldTransform.a,
                this.worldTransform.b,
                this.worldTransform.c,
                this.worldTransform.d,
                this.worldTransform.tx * renderSession.resolution,
                this.worldTransform.ty * renderSession.resolution);
        }

        if (this.tint !== "#FFFFFF")
        {
            if (this.cachedTint !== this.tint)
            {
                this.cachedTint = this.tint;
                this.tintedTexture = Tiny.CanvasTinter.getTintedTexture(this, this.tint);
            }

            renderSession.context.drawImage(
                                this.tintedTexture,
                                0,
                                0,
                                this.texture.crop.width,
                                this.texture.crop.height,
                                dx / resolution,
                                dy / resolution,
                                this.texture.crop.width / resolution,
                                this.texture.crop.height / resolution);
        }
        else
        {
            renderSession.context.drawImage(
                                this.texture.source,
                                this.texture.crop.x,
                                this.texture.crop.y,
                                this.texture.crop.width,
                                this.texture.crop.height,
                                dx / resolution,
                                dy / resolution,
                                this.texture.crop.width / resolution,
                                this.texture.crop.height / resolution);
        }
    }

    // OVERWRITE
    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i].render(renderSession);
    }

    if (this._mask)
    {
        renderSession.maskManager.popMask(renderSession);
    }
};

/***/ }),

/***/ "./src/objects/Text.js":
/*!*****************************!*\
  !*** ./src/objects/Text.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {


Tiny.Text = function(text, style)
{
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.resolution = 1;

    Tiny.Sprite.call(this, Tiny.Texture.fromCanvas(this.canvas));

    this.setText(text);
    this.setStyle(style);

};

Tiny.Text.prototype = Object.create(Tiny.Sprite.prototype);
Tiny.Text.prototype.constructor = Tiny.Text;

Object.defineProperty(Tiny.Text.prototype, 'width', {
    get: function() {

        if(this.dirty)
        {
            this.updateText();
            this.dirty = false;
        }


        return this.scale.x * this.texture.frame.width;
    },
    set: function(value) {
        this.scale.x = value / this.texture.frame.width;
        this._width = value;
    }
});

Object.defineProperty(Tiny.Text.prototype, 'height', {
    get: function() {

        if(this.dirty)
        {
            this.updateText();
            this.dirty = false;
        }


        return  this.scale.y * this.texture.frame.height;
    },
    set: function(value) {
        this.scale.y = value / this.texture.frame.height;
        this._height = value;
    }
});

Tiny.Text.prototype.setStyle = function(style)
{
    style = style || {};
    style.font = style.font || 'bold 20pt Arial';
    style.fill = style.fill || 'black';
    style.align = style.align || 'left';
    style.stroke = style.stroke || 'black';
    style.strokeThickness = style.strokeThickness || 0;
    style.wordWrap = style.wordWrap || false;
    style.lineSpacing = style.lineSpacing || 0
    style.wordWrapWidth = style.wordWrapWidth !== undefined ? style.wordWrapWidth : 100;
    
    style.dropShadow = style.dropShadow || false;
    style.dropShadowAngle = style.dropShadowAngle !== undefined ? style.dropShadowAngle : Math.PI / 6;
    style.dropShadowDistance = style.dropShadowDistance !== undefined ? style.dropShadowDistance : 4;
    style.dropShadowColor = style.dropShadowColor || 'black';

    this.style = style;
    this.dirty = true;
};

Tiny.Text.prototype.setText = function(text)
{
    this.text = text.toString() || ' ';
    this.dirty = true;
};

Tiny.Text.prototype.updateText = function()
{
    this.texture.resolution = this.resolution;

    this.context.font = this.style.font;

    var outputText = this.text;

    // word wrap
    // preserve original text
    if(this.style.wordWrap)outputText = this.wordWrap(this.text);

    //split text into lines
    var lines = outputText.split(/(?:\r\n|\r|\n)/);

    //calculate text width
    var lineWidths = [];
    var maxLineWidth = 0;
    var fontProperties = this.determineFontProperties(this.style.font);
    for (var i = 0; i < lines.length; i++)
    {
        var lineWidth = this.context.measureText(lines[i]).width;
        lineWidths[i] = lineWidth;
        maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }

    var width = maxLineWidth + this.style.strokeThickness;
    if(this.style.dropShadow)width += this.style.dropShadowDistance;

    this.canvas.width = ( width + this.context.lineWidth ) * this.resolution;
    
    //calculate text height
    var lineHeight = fontProperties.fontSize + this.style.strokeThickness + this.style.lineSpacing;
 
    var height = lineHeight * lines.length;
    if(this.style.dropShadow)height += this.style.dropShadowDistance;

    this.canvas.height = (height - this.style.lineSpacing) * this.resolution;

    this.context.scale( this.resolution, this.resolution);

    if(navigator.isCocoonJS) this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    
    // used for debugging..
    //this.context.fillStyle ="#FF0000"
    //this.context.fillRect(0, 0, this.canvas.width,this.canvas.height);

    this.context.font = this.style.font;
    this.context.strokeStyle = this.style.stroke;
    this.context.lineWidth = this.style.strokeThickness;
    this.context.textBaseline = 'alphabetic';
    this.context.miterLimit = 2;

    //this.context.lineJoin = 'round';

    var linePositionX;
    var linePositionY;

    if(this.style.dropShadow)
    {
        this.context.fillStyle = this.style.dropShadowColor;

        var xShadowOffset = Math.sin(this.style.dropShadowAngle) * this.style.dropShadowDistance;
        var yShadowOffset = Math.cos(this.style.dropShadowAngle) * this.style.dropShadowDistance;

        for (i = 0; i < lines.length; i++)
        {
            linePositionX = this.style.strokeThickness / 2;
            linePositionY = (this.style.strokeThickness / 2 + i * lineHeight) + fontProperties.ascent;

            if(this.style.align === 'right')
            {
                linePositionX += maxLineWidth - lineWidths[i];
            }
            else if(this.style.align === 'center')
            {
                linePositionX += (maxLineWidth - lineWidths[i]) / 2;
            }

            if(this.style.fill)
            {
                this.context.fillText(lines[i], linePositionX + xShadowOffset, linePositionY + yShadowOffset);
            }

          //  if(dropShadow)
        }
    }

    //set canvas text styles
    this.context.fillStyle = this.style.fill;
    
    //draw lines line by line
    for (i = 0; i < lines.length; i++)
    {
        linePositionX = this.style.strokeThickness / 2;
        linePositionY = (this.style.strokeThickness / 2 + i * lineHeight) + fontProperties.ascent;

        if(this.style.align === 'right')
        {
            linePositionX += maxLineWidth - lineWidths[i];
        }
        else if(this.style.align === 'center')
        {
            linePositionX += (maxLineWidth - lineWidths[i]) / 2;
        }

        if(this.style.stroke && this.style.strokeThickness)
        {
            this.context.strokeText(lines[i], linePositionX, linePositionY);
        }

        if(this.style.fill)
        {
            this.context.fillText(lines[i], linePositionX, linePositionY);
        }

      //  if(dropShadow)
    }

    this.updateTexture();
};

Tiny.Text.prototype.updateTexture = function()
{
    this.texture.width = this.canvas.width;
    this.texture.height = this.canvas.height;
    this.texture.crop.width = this.texture.frame.width = this.canvas.width;
    this.texture.crop.height = this.texture.frame.height = this.canvas.height;

    this._width = this.canvas.width;
    this._height = this.canvas.height;
};

Tiny.Text.prototype.render = function(renderSession)
{
    if(this.dirty)
    {
        this.resolution = renderSession.resolution;

        this.updateText();
        this.dirty = false;
    }
     
    Tiny.Sprite.prototype.render.call(this, renderSession);
};

Tiny.Text.prototype.determineFontProperties = function(fontStyle)
{
    var properties = Tiny.Text.fontPropertiesCache[fontStyle];

    if(!properties)
    {
        properties = {};
        
        var canvas = Tiny.Text.fontPropertiesCanvas;
        var context = Tiny.Text.fontPropertiesContext;

        context.font = fontStyle;

        var width = Math.ceil(context.measureText('|MÉq').width);
        var baseline = Math.ceil(context.measureText('|MÉq').width);
        var height = 2 * baseline;

        baseline = baseline * 1.4 | 0;

        canvas.width = width;
        canvas.height = height;

        context.fillStyle = '#f00';
        context.fillRect(0, 0, width, height);

        context.font = fontStyle;

        context.textBaseline = 'alphabetic';
        context.fillStyle = '#000';
        context.fillText('|MÉq', 0, baseline);

        var imagedata = context.getImageData(0, 0, width, height).data;
        var pixels = imagedata.length;
        var line = width * 4;

        var i, j;

        var idx = 0;
        var stop = false;

        // ascent. scan from top to bottom until we find a non red pixel
        for(i = 0; i < baseline; i++)
        {
            for(j = 0; j < line; j += 4)
            {
                if(imagedata[idx + j] !== 255)
                {
                    stop = true;
                    break;
                }
            }
            if(!stop)
            {
                idx += line;
            }
            else
            {
                break;
            }
        }

        properties.ascent = baseline - i;

        idx = pixels - line;
        stop = false;

        // descent. scan from bottom to top until we find a non red pixel
        for(i = height; i > baseline; i--)
        {
            for(j = 0; j < line; j += 4)
            {
                if(imagedata[idx + j] !== 255)
                {
                    stop = true;
                    break;
                }
            }
            if(!stop)
            {
                idx -= line;
            }
            else
            {
                break;
            }
        }

        properties.descent = i - baseline;
        //TODO might need a tweak. kind of a temp fix!
        properties.descent += 6;
        properties.fontSize = properties.ascent + properties.descent;

        Tiny.Text.fontPropertiesCache[fontStyle] = properties;
    }

    return properties;
};

Tiny.Text.prototype.wordWrap = function(text)
{
    // Greedy wrapping algorithm that will wrap words as the line grows longer
    // than its horizontal bounds.
    var result = '';
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++)
    {
        var spaceLeft = this.style.wordWrapWidth;
        var words = lines[i].split(' ');
        for (var j = 0; j < words.length; j++)
        {
            var wordWidth = this.context.measureText(words[j]).width;
            var wordWidthWithSpace = wordWidth + this.context.measureText(' ').width;
            if(j === 0 || wordWidthWithSpace > spaceLeft)
            {
                // Skip printing the newline if it's the first word of the line that is
                // greater than the word wrap width.
                if(j > 0)
                {
                    result += '\n';
                }
                result += words[j];
                spaceLeft = this.style.wordWrapWidth - wordWidth;
            }
            else
            {
                spaceLeft -= wordWidthWithSpace;
                result += ' ' + words[j];
            }
        }

        if (i < lines.length-1)
        {
            result += '\n';
        }
    }
    return result;
};

Tiny.Text.prototype.getBounds = function(matrix)
{
    if(this.dirty)
    {
        this.updateText();
        this.dirty = false;
    }

    return Tiny.Sprite.prototype.getBounds.call(this, matrix);
};

Tiny.Text.prototype.destroy = function()
{
    // make sure to reset the the context and canvas.. dont want this hanging around in memory!
    this.context = null;
    this.canvas = null;

    this.texture.destroy();

    Tiny.Sprite.prototype.destroy.call(this);
};

Tiny.Text.fontPropertiesCache = {};
Tiny.Text.fontPropertiesCanvas = document.createElement('canvas');
Tiny.Text.fontPropertiesContext = Tiny.Text.fontPropertiesCanvas.getContext('2d');

/***/ }),

/***/ "./src/renderer/CanvasRenderer.js":
/*!****************************************!*\
  !*** ./src/renderer/CanvasRenderer.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {


Tiny.CanvasRenderer = function(width, height, options)
{   
    options = options || {}

    this.resolution = (options.resolution != undefined ? options.resolution : 1);

    this.clearBeforeRender = (options.clearBeforeRender != undefined ? options.clearBeforeRender : true);

    this.transparent = (options.transparent != undefined ? options.transparent : false);

    this.autoResize = options.autoResize || false;

    // this.width = width || 800;
    // this.height = height || 600;

    // this.width *= this.resolution;
    // this.height *= this.resolution;

    if (!Tiny.defaultRenderer) Tiny.defaultRenderer = this;

    var view = this.domElement = options.domElement || document.createElement( "canvas" );

    this.context = view.getContext( "2d", { alpha: this.transparent } );

    // view.width = this.width * this.resolution;
    // view.height = this.height * this.resolution;

    this.setSize(width || 800, height || 600);

    this.setClearColor("#ffffff");

    if (Tiny.CanvasMaskManager)
        this.maskManager = new Tiny.CanvasMaskManager();

    this.renderSession = {
        context: this.context,
        maskManager: this.maskManager,
        smoothProperty: null,
        /**
         * If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation.
         * Handy for crisp pixel art and speed on legacy devices.
         *
         */
        roundPixels: false
    };


    if("imageSmoothingEnabled" in this.context)
        this.renderSession.smoothProperty = "imageSmoothingEnabled";
    else if("webkitImageSmoothingEnabled" in this.context)
        this.renderSession.smoothProperty = "webkitImageSmoothingEnabled";
    else if("mozImageSmoothingEnabled" in this.context)
        this.renderSession.smoothProperty = "mozImageSmoothingEnabled";
    else if("oImageSmoothingEnabled" in this.context)
        this.renderSession.smoothProperty = "oImageSmoothingEnabled";
    else if ("msImageSmoothingEnabled" in this.context)
        this.renderSession.smoothProperty = "msImageSmoothingEnabled";
};

Tiny.CanvasRenderer.prototype.constructor = Tiny.CanvasRenderer;

Tiny.CanvasRenderer.prototype.setClearColor = function(color)
{   
    this.clearColor = color;
    
    // if (color === null) {
    //     this.clearColor = null;
    //     return;
    // }

    // this.clearColor = color || 0x000000;
    // // this.backgroundColorSplit = Tiny.hex2rgb(this.backgroundColor);
    // var hex = this.clearColor.toString(16);
    // hex = '000000'.substr(0, 6 - hex.length) + hex;
    // this._clearColor = '#' + hex;

};

// Tiny.CanvasRenderer.prototype.setPixelArt = function() {

//     var canvas = this.domElement;
    
//     var types = [ 'optimizeSpeed', '-moz-crisp-edges', '-o-crisp-edges', '-webkit-optimize-contrast', 'optimize-contrast', 'crisp-edges', 'pixelated' ];

//     types.forEach(function (type)
//     {
//         canvas.style['image-rendering'] = type;
//     });

//     canvas.style.msInterpolationMode = 'nearest-neighbor';
//     this.renderSession.roundPixels = true;
// }

Tiny.CanvasRenderer.prototype.render = function(scene)
{
    
    this.context.setTransform(1,0,0,1,0,0);

    this.context.globalAlpha = 1;

    this.renderSession.currentBlendMode = "source-over";
    this.context.globalCompositeOperation = "source-over";

    if (navigator.isCocoonJS && this.domElement.screencanvas)
    {
        this.context.fillStyle = "black";
        this.context.clear();
    }
    
    if (this.clearBeforeRender)
    {
        if (this.transparent)
        {
            this.context.clearRect(0, 0, this.width * this.resolution, this.height * this.resolution);
        }
        else
        {
            this.context.fillStyle = this.clearColor;
            this.context.fillRect(0, 0, this.width * this.resolution, this.height * this.resolution);
        }
    }
    
    this.renderObject(scene);

};

Tiny.CanvasRenderer.prototype.destroy = function(removeView)
{   
    if (typeof removeView === "undefined") { removeView = true; }

    if (removeView && this.domElement.parentNode)
    {
        this.domElement.parentNode.removeChild(this.domElement);
    }

    this.domElement = null;
    this.context = null;
    this.maskManager = null;
    this.renderSession = null;

    if (Tiny.defaultRenderer === this) Tiny.defaultRenderer = null;

};

Tiny.CanvasRenderer.prototype.setSize = function(width, height)
{
    this.width = width;
    this.height = height;

    var view = this.domElement;

    view.width = Math.floor(this.width * this.resolution);
    view.height = Math.floor(this.height * this.resolution);

    if (this.autoResize) {
        view.style.width = width + "px";
        view.style.height = height + "px";
    }
};

Tiny.CanvasRenderer.prototype.setPixelRatio = function(resolution)
{
    this.resolution = resolution;

    var view = this.domElement;

    view.width = Math.floor(this.width * this.resolution);
    view.height = Math.floor(this.height * this.resolution);
};

Tiny.CanvasRenderer.prototype.renderObject = function(displayObject, context)
{
    displayObject.updateTransform();
    this.renderSession.context = context || this.context;
    this.renderSession.resolution = this.resolution;
    displayObject.render(this.renderSession);
};

/***/ }),

/***/ "./src/systems/Input.js":
/*!******************************!*\
  !*** ./src/systems/Input.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

var listeningToTouchEvents;

Tiny.Input = function(game)
{
    this.game = game;
    var view = this.domElement = game.inputView;

    this.bounds = {x: 0, y: 0, width: 0, height: 0};
    this.candidates = [];
    this.list = [];

    this.lastMove = null;
    this.isDown = false;

    this.downHandler = this.downHandler.bind(this);
    this.moveHandler = this.moveHandler.bind(this);
    this.upHandler = this.upHandler.bind(this);
    // this.clickHandler.bind(this);

    view.addEventListener('touchstart', this.downHandler);
    view.addEventListener('touchmove', this.moveHandler);
    view.addEventListener('touchend', this.upHandler);
    view.addEventListener('touchcancel', this.upHandler);

    // view.addEventListener('click', this.clickHandler);

    view.addEventListener('mousedown', this.downHandler);
    view.addEventListener('mousemove', this.moveHandler);
    view.addEventListener('mouseup', this.upHandler);

    Tiny.EventEmitter.mixin(this);

    for (var i = 0; i < Tiny.Input.systems.length; i++) {
        Tiny.Input.systems[i].init.call(this);
    }

    this.updateBounds();
};

Tiny.Input.prototype = {


    add: function(object, options) {
        object.inputEnabled = true;

        options = options || {};
        options.system = this;

        object.input = options;

        Tiny.EventEmitter.mixin(object.input)

        this.list.push(object);
    },

    remove: function(object) {
        var index = this.list.indexOf(object);

        if (index > -1) {
            var removed = this.list[index];
            removed.input = null;
            removed.inputEnabled = false;

            this.list.splice(index, 1);

            return removed;
        }
    },

    inputHandler: function(name, event)
    {
        // console.log(name)
        var coords = this.getCoords(event);

        if (coords !== null)
        {
            if (name != "move")
            {
                this.candidates.length = 0;

                for (var i = 0; i < Tiny.Input.systems.length; i++) {
                    Tiny.Input.systems[i].preHandle.call(this, coords.x, coords.y);
                }

                var isGood, obj;

                for (var t = 0; t < this.list.length; t++) 
                {
                    obj = this.list[t];

                    if (!obj.inputEnabled || !obj.parent) continue;

                    if (obj.input.checkBounds) isGood = obj.input.checkBounds.call(this, obj, coords.x, coords.y);
                    else isGood = Tiny.Input.checkBounds.call(this, obj, coords.x, coords.y);

                    if (isGood) this.candidates.push(obj);
                }

                //var i = this.candidates.length

                for (var i = this.candidates.length - 1; i >= 0; i--)
                {
                    var obj = this.candidates[i]
                    obj.input["last_" + name] = {
                        x: coords.x,
                        y: coords.y
                    }

                    obj.input.emit(name,
                    {
                        x: coords.x,
                        y: coords.y
                    })

                    if (name == "up")
                    {
                        var point = obj.input["last_down"]
                        if (point && Tiny.Math.distance(point.x, point.y, coords.x, coords.y) < 30)
                            obj.input.emit("click",
                            {
                                x: coords.x,
                                y: coords.y
                            })
                    }

                    if (!obj.input.transparent) 
                    {
                        break
                    }
                }

                // if (i > 0) {
                //     var obj = this.candidates[i - 1]
                //     obj.input["last_" + name] = {x: coords.x, y: coords.y}

                //     obj.input.emit(name, {x: coords.x, y: coords.y})

                //     if (name == "up") {
                //         var point = obj.input["last_down"]
                //         if (point && Tiny.Math.distance(point.x, point.y, coords.x, coords.y) < 30)
                //             obj.input.emit("click", {x: coords.x, y: coords.y})
                //     }
                // }
            }

            this.emit(name,
            {
                x: coords.x,
                y: coords.y
            });
        }
    },

    moveHandler: function(event)
    {
        this.lastMove = event;
        this.inputHandler("move", event);
    },

    upHandler: function(event)
    {
        this.isDown = false;
        this.inputHandler("up", this.lastMove);
    },

    downHandler: function(event)
    {
        this.isDown = true;
        this.lastMove = event;
        this.inputHandler("down", event);
    },

    clickHandler: function(event)
    {
        this.inputHandler("click", event);
    },

    getCoords: function(event)
    {
        var coords = null;

        if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent)
        {
            listeningToTouchEvents = true;

            if (event.touches.length > 0)
            {
                coords = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
            }
            else if (event.clientX && event.clientY)
            {
                coords = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
            else
            {
                // listeningToTouchEvents = false;
            }
        }
        else
        {
            // Mouse event
            coords = {
                x: event.clientX,
                y: event.clientY
            };
        }

        if (listeningToTouchEvents && event instanceof MouseEvent || coords === null) return null;

        coords = {
            x: (coords.x - this.bounds.x),
            y: (coords.y - this.bounds.y),
        };

        return coords;
    },

    updateBounds: function() 
    {
        bounds = this.bounds;

        var clientRect = this.domElement.getBoundingClientRect();

        bounds.x = clientRect.left;
        bounds.y = clientRect.top;
        bounds.width = clientRect.width;
        bounds.height = clientRect.height;
    },

    destroy: function()
    {
        var view = this.domElement;

        view.removeEventListener('touchstart', this.downHandler);
        view.removeEventListener('touchmove', this.moveHandler);
        view.removeEventListener('touchend', this.upHandler);
        view.removeEventListener('touchcancel', this.upHandler);

        // view.removeEventListener('click', this.clickHandler);

        view.removeEventListener('mousedown', this.downHandler);
        view.removeEventListener('mousemove', this.moveHandler);
        view.removeEventListener('mouseup', this.upHandler);
    }
};

Tiny.Input.checkBounds = function(obj, x, y)
{
    if (obj.worldVisible)
    {
        if (obj.getBounds().contains(x, y)) 
        {
            return true;
        }
    }

    // if (obj.children && obj.children.length > 0)
    // {
    //     for (var t = 0; t < obj.children.length; t++) 
    //     {
    //         _checkOnActiveObjects(obj.children[t], x, y);
    //     }
    // }
}

Tiny.Input.systems = [];

Tiny.registerSystem("input", Tiny.Input);

/***/ }),

/***/ "./src/systems/Loader.js":
/*!*******************************!*\
  !*** ./src/systems/Loader.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {


Tiny.Cache = {
    image: {},
    texture: {}
};

Tiny.Loader = function(game)
{
    game.cache = Tiny.Cache;

    this.game = game;
    this.list = [];
};

Tiny.Loader.prototype = {

    clearCache: function() {

        for (var y in Tiny.Cache.texture) Tiny.Cache.texture[y].destroy();

        for (var y in Tiny.Cache) Tiny.Cache[y] = {};
    },

    all: function(array) {

        this.list = this.list.concat(array); 
    },

    image: function(key, source)
    {
        this.list.push(
        {
            src: source,
            key: key,
            type: "image"
        });
    },

    spritesheet: function(key, source, arg_1, arg_2, totalFrames, duration)
    {
        var res = {
            src: source,
            key: key,
            type: "spritesheet"
        };

        if (typeof arg_1 == "number")
        {
            res.width = arg_1;
            res.height = arg_2;
            res.total = totalFrames;
            res.duration = duration;
        }
        else if (arg_1.length > 0)
        {
            res.data = arg_1;
        }

        this.list.push(res);
    },

    atlas: function(key, source, atlasData)
    {
        this.list.push(
        {
            src: source,
            key: key,
            data: atlasData,
            type: "atlas"
        });
    },

    start: function(callback)
    {
        var game = this.game;
        var list = this.list;

        if (list.length == 0)
        {
            callback.call(game);
            return;
        }

        function loadNext()
        {
            // var done = false;
            var resource = list.shift();

            var loader = Tiny.Loader[resource.type];

            if (loader) {
                loader(resource, loaded);
            }
            else {
                console.warn("Cannot find loader for " + resource.type);
                loaded();
            }
        }

        function loaded(resource, data) 
        {
            if (list.length != 0) 
            {
                loadNext();
            }
            else 
            {
                callback.call(game);
            }
        }

        loadNext();
    }
};

Tiny.Loader.atlas = function(resource, cb)
{
    var key = resource.key;

    Tiny.Loader.image(resource, function(resource, image) {
        
        for (var i = 0; i < resource.data.length; i++)
        {
            var uuid = key + "." + resource.data[i].name;
            var texture = new Tiny.Texture(image, resource.data[i]);
            texture.key = key;

            Tiny.Cache.texture[uuid] = texture;
        }

        cb();
    });
}

Tiny.Loader.spritesheet = function(resource, cb)
{
    var key = resource.key;

    Tiny.Loader.image(resource, function(resource, image) {
        
        if (resource.data) {

            var frameData = resource.data;
            var lastFrame = (frameData.length - 1);

            for (var i = 0; i <= lastFrame; i++)
            {
                var uuid = key + "." + i;

                var texture = new Tiny.Texture(image, {
                    index: i,
                    x: Math.floor(frameData[i].x),
                    y: Math.floor(frameData[i].y),
                    width: Math.floor(frameData[i].width),
                    height: Math.floor(frameData[i].height),
                    duration: frameData[i].duration
                });

                texture.key = key;
                texture.lastFrame = lastFrame;

                Tiny.Cache.texture[uuid] = texture;
            }
        }
        else 
        {
            var width = image.naturalWidth || image.width;
            var height = image.naturalHeight || image.height;

            var frameWidth = resource.width;
            var frameHeight = resource.height;

            if (!frameWidth) frameWidth = Math.floor(width / (resource.cols || 1));
            if (!frameHeight) frameHeight = Math.floor(height / (resource.rows || 1));

            var cols = Math.floor(width / frameWidth);
            var rows = Math.floor(height / frameHeight);

            var total = cols * rows;

            if (total === 0) 
            {
                return cb();
            }

            if (resource.total) total = Math.min(total, resource.total);

            var x = 0;
            var y = 0;
            var lastFrame = total - 1;

            for (var i = 0; i < total; i++)
            {
                var uuid = key + "." + i;
                var texture = new Tiny.Texture(image, {
                    index: i,
                    x: x,
                    y: y,
                    width: frameWidth,
                    height: frameHeight,
                    duration: resource.duration
                });
                texture.key = key;
                texture.lastFrame = lastFrame;
                Tiny.Cache.texture[uuid] = texture;

                x += frameWidth;

                if (x + frameWidth > width)
                {
                    x = 0;
                    y += frameHeight;
                }
            }
        }

        cb();
    });
}


Tiny.Loader.image = function(resource, cb) 
{
    // if (Tiny.Cache["image"][resource.key]) return cb(resource, Tiny.Cache["image"][resource.key]);

    const image = new Image();

    image.addEventListener('load', function()
    {
        Tiny.Cache.image[resource.key] = image;
        
        cb(resource, image);
    });

    // image.addEventListener('error', function()
    // {
    //     cb(resource, image);
    // })

    image.src = resource.src;
}

Tiny.registerSystem("load", Tiny.Loader);

/***/ }),

/***/ "./src/systems/RAF.js":
/*!****************************!*\
  !*** ./src/systems/RAF.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var _isSetTimeOut, _onLoop, _timeOutID, _prevTime, _lastTime;

var now = function() {
    return new Date().getTime();
}

if (self.performance !== undefined && self.performance.now !== undefined) {
    now = self.performance.now.bind(self.performance);
} else if (Date.now !== undefined) {
    now = Date.now;
}

Tiny.RAF = function (game, forceSetTimeOut)
{

    if (forceSetTimeOut === undefined) { forceSetTimeOut = false; }
    this.game = game;

    this.isRunning = false;
    this.forceSetTimeOut = forceSetTimeOut;

    var vendors = [
        'ms',
        'moz',
        'webkit',
        'o'
    ];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++)
    {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    _isSetTimeOut = false;
    _onLoop = null;
    _timeOutID = null;

    _prevTime = 0
    _lastTime = 0
};

Tiny.RAF.prototype = {

    start: function ()
    {

        _prevTime = now();

        this.isRunning = true;

        var _this = this;

        if (!window.requestAnimationFrame || this.forceSetTimeOut)
        {
            _isSetTimeOut = true;

            _onLoop = function ()
            {
                return _this.updateSetTimeout();
            };

            _timeOutID = window.setTimeout(_onLoop, 0);
        }
        else
        {
            _isSetTimeOut = false;

            _onLoop = function ()
            {
                
                return _this.updateRAF();
            };

            _timeOutID = window.requestAnimationFrame(_onLoop);
        }
    },

    updateRAF: function ()
    {
        _lastTime = now()

        if (this.isRunning)
        {
            this.game._update(Math.floor(_lastTime), _lastTime - _prevTime);

            _timeOutID = window.requestAnimationFrame(_onLoop);
        }

        _prevTime = _lastTime

    },

    updateSetTimeout: function ()
    {
        _lastTime = now()
        if (this.isRunning)
        {
            this.game._update(Math.floor(_lastTime), _lastTime - _prevTime);

            _timeOutID = window.setTimeout(_onLoop, Tiny.RAF.timeToCall);
        }
        _prevTime = _lastTime
    },

    reset: function() 
    {
        _prevTime = now();
    },

    stop: function ()
    {
        if (_isSetTimeOut)
        {
            clearTimeout(_timeOutID);
        }
        else
        {
            window.cancelAnimationFrame(_timeOutID);
        }

        this.isRunning = false;
    }
};

Tiny.RAF.timeToCall = 15;

/***/ }),

/***/ "./src/systems/Timer.js":
/*!******************************!*\
  !*** ./src/systems/Timer.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

var noop = function() {};

var Timer = function(status, autoRemove, game, cb, delay, loop, n, oncomplete)
{
    this.game = game;
    this._cb_ = cb || noop;
    this.delay = (delay == undefined ? 1000 : delay);
    this.loop = loop;
    this._count = n || 0;
    this._repeat = (this._count > 0);
    this.status = status;
    this._lastFrame = 0;
    this.autoRemove = autoRemove;
    this._oncomplete = oncomplete || noop;
}

Timer.prototype = {
    start: function()
    {
        this.status = 1;
    },
    pause: function()
    {
        this.status = 0;
    },
    stop: function()
    {
        this.status = 0;
        this._lastFrame = 0;
    },
    update: function(deltaTime)
    {
        if (this.status)
        {
            this._lastFrame += deltaTime
            if (this._lastFrame >= this.delay)
            {
                this._cb_();
                this._lastFrame = 0;
                if (this._repeat)
                {
                    this._count--;
                    if (this._count === 0)
                    {
                        this.status = 0;
                        this.autoRemove && this.game.timer.remove(this);
                        this._oncomplete();
                    }
                }
                else if (!this.loop)
                {
                    this.status = 0;
                    this.autoRemove && this.game.timer.remove(this);
                }
            }
        }
    }
}

Tiny.Timer = Timer;

Tiny.TimerCreator = function(game)
{
    this.game = game;
    this.list = [];
    this.autoStart = true;
    this.autoRemove = true;
};

Tiny.TimerCreator.prototype = {

    update: function(delta) 
    {
        this.list.forEach(function(tm)
        {
            tm.update(delta);
        })
    },
    removeAll: function()
    {
        this.list.forEach(function(tm)
        {
            tm.stop();
        });

        this.list = [];
    },
    remove: function(tm)
    {
        var indexOf = this.list.indexOf(tm);
        if (indexOf > -1)
        {
            tm.stop();
            this.list.splice(indexOf, 1);
        }
    },
    add: function(delay, cb, autostart, autoremove)
    {
        if (autostart == undefined) 
        {
            autostart = this.autoStart;
        }
        var timer = new Timer((autostart ? 1 : 0), (autoremove != undefined ? autoremove : this.autoRemove), this.game, cb, delay);
        this.list.push(timer);
        return timer;
    },
    loop: function(delay, cb, autostart, autoremove)
    {
        if (autostart == undefined) 
        {
            autostart = this.autoStart;
        }
        var timer = new Timer((autostart ? 1 : 0), (autoremove != undefined ? autoremove : this.autoRemove), this.game, cb, delay, true);
        this.list.push(timer);
        return timer;
    },
    repeat: function(delay, n, cb, complete)
    {
        var timer = new Timer((this.autoStart ? 1 : 0), this.autoRemove, this.game, cb, delay, false, n, complete);
        this.list.push(timer);
        return timer;
    },
    destroy: function() {
        this.removeAll();
    }
};

Tiny.registerSystem("timer", Tiny.TimerCreator);

/***/ }),

/***/ "./src/textures/Texture.js":
/*!*********************************!*\
  !*** ./src/textures/Texture.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {


// Tiny.TextureCache = {};
// Tiny.FrameCache = {};
Tiny.TextureCacheIdGenerator = 0;
Tiny.TextureSilentFail = false;

Tiny.Texture = function(source, frame, crop, trim)
{
    // console.log(this);
    this.noFrame = false;

    this.resolution = 1;

    this.hasLoaded = false;

    if (!frame)
    {
        this.noFrame = true;
        frame = new Tiny.Rectangle(0,0,1,1);
    }

    if (typeof source == "string") 
    {
        var key = source;

        source = Tiny.Cache.image[key];

        if (!source) throw new Error('Cache Error: image ' + key + ' does`t found in cache');

        Tiny.Cache.texture[key] = this;
    
        this.key = key;
    }

    this.source = source;

    this.frame = frame;

    this.trim = trim;

    this.valid = false;

    this.width = 0;

    this.height = 0;

    this.crop = crop || new Tiny.Rectangle(0, 0, 1, 1);

    if((this.source.complete || this.source.getContext) && this.source.width && this.source.height)
    {
        this.onSourceLoaded();
    }
    else
    {
        var scope = this;
        this.source.onload = function() {
            scope.onSourceLoaded();
        };
    }
};

Tiny.Texture.prototype.constructor = Tiny.Texture;

Tiny.Texture.prototype.onSourceLoaded = function()
{
    this.hasLoaded = true;
    this.width = this.source.naturalWidth || this.source.width;
    this.height = this.source.naturalHeight || this.source.height;

    if (this.noFrame) this.frame = new Tiny.Rectangle(0, 0, this.width, this.height);

    this.setFrame(this.frame);
};

Tiny.Texture.prototype.addToCache = function(key)
{
    Tiny.Cache.texture[key] = this;
    this.key = key;
};

Tiny.Texture.prototype.destroy = function()
{
    if (this.key) {
        delete Tiny.Cache.texture[this.key];
    }

    this.source = null;
    this.valid = false;
};

Tiny.Texture.prototype.setFrame = function(frame)
{
    this.noFrame = false;

    this.frame = frame;
    // this.width = frame.width;
    // this.height = frame.height;

    this.crop.x = frame.x;
    this.crop.y = frame.y;
    this.crop.width = frame.width;
    this.crop.height = frame.height;

    if (!this.trim && (frame.x + frame.width > this.width || frame.y + frame.height > this.height))
    {
        if (!Tiny.TextureSilentFail)
        {
            throw new Error('Texture Error: frame does not fit inside the base Texture dimensions ' + this);
        }

        this.valid = false;
        return;
    }

    this.valid = frame && frame.width && frame.height && this.source && this.hasLoaded;

    if (this.trim)
    {
        // this.width = this.trim.width;
        // this.height = this.trim.height;
        this.frame.width = this.trim.width;
        this.frame.height = this.trim.height;
    }
};

// Tiny.Texture.fromImage = function(key, imageUrl, crossorigin)
// {
//     var texture = Tiny.TextureCache[key];

//     if(!texture)
//     {
//         texture = new Tiny.Texture(Tiny.BaseTexture.fromImage(key, imageUrl, crossorigin));
//         texture.key = key
//         Tiny.TextureCache[key] = texture;
//     }

//     return texture;
// };

// Tiny.Texture.fromFrame = function(frameId)
// {
//     var texture = Tiny.TextureCache[frameId];
//     if(!texture) throw new Error('The frameId "' + frameId + '" does not exist in the texture cache ');
//     return texture;
// };

Tiny.Texture.fromCanvas = function(canvas)
{
    // if(!canvas._tinyId)
    // {
    //     canvas._tinyId = '_from_canvas_' + Tiny.TextureCacheIdGenerator++;
    // }

    // var texture = Tiny.Cache.texture[canvas._tinyId];

    // if(!texture)
    // {
    //     texture = new Tiny.Texture( canvas );
    //     Tiny.Cache.texture[canvas._tinyId] = texture;
    // }

    // return texture;
    return new Tiny.Texture( canvas );
};

// Tiny.Texture.addTextureToCache = function(texture, id)
// {
//     Tiny.TextureCache[id] = texture;
// };


// Tiny.Texture.removeTextureFromCache = function(id)
// {
//     var texture = Tiny.TextureCache[id];
//     delete Tiny.TextureCache[id];
//     delete Tiny.BaseTextureCache[id];
//     return texture;
// };

/***/ }),

/***/ "./src/utils/EventEmitter.js":
/*!***********************************!*\
  !*** ./src/utils/EventEmitter.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {


function EventListeners() 
{
    this.a = [];
    this.n = 0;
}

Tiny.EventEmitter = {

    call: function(obj) 
    {
        if (obj) 
        {
            obj = obj.prototype || obj;
            Tiny.EventEmitter.mixin(obj);
        }
    },

    mixin: function(obj) 
    {
        const listeners_events = {};

        function pushListener(event, fn, context, once)
        {
            var listeners = listeners_events[event]

            if (!listeners)
            {
                listeners = listeners_events[event] = new EventListeners();
            }

            listeners.a.push(fn, context || null, once || false);
            listeners.n += 3;
        }

        obj.once = function(event, fn, context)
        {
            pushListener(event, fn, context, true);
        }

        obj.on = pushListener;

        obj.off = function(event, fn, context)
        {
            var listeners = listeners_events[event]

            if (!listeners) return;

            var fnArray = listeners_events[event].a;

            if (!fn) 
            {
                fnArray.length = 0;
            }
            else if (!context) 
            {
                for (var i = 0; i < fnArray.length; i += 3)
                {
                    if (fnArray[i] == fn)
                    {
                        fnArray.splice(i, 3);
                        i -= 3;
                    }
                }
            }
            else 
            {
                for (var i = 0; i < fnArray.length; i += 3)
                {
                    if (fnArray[i] == fn && fnArray[i + 1] == context)
                    {
                        fnArray.splice(i, 3);
                        i -= 3;
                    }
                }
            }

            if (fnArray.length == 0) 
            {
                delete listeners_events[event];
            }
        }

        obj.emit = function(event, a1, a2, a3)
        {
            var listeners = listeners_events[event];

            if (!listeners) return;

            var fnArray = listeners.a;
            listeners.n = 0;

            var len = arguments.length;

            for (var i = 0; i < fnArray.length - listeners.n; i += 3)
            {
                if (len <= 1)
                    fnArray[i].call(fnArray[i + 1]);
                else if (len == 2)
                    fnArray[i].call(fnArray[i + 1], a1);
                else if (len == 3)
                    fnArray[i].call(fnArray[i + 1], a1, a2);
                else
                    fnArray[i].call(fnArray[i + 1], a1, a2, a3);

                if (fnArray[i + 2])
                {
                    fnArray.splice(i, 3);
                    i -= 3;
                }
            }

            if (fnArray.length == 0) 
            {
                delete listeners_events[event];
            }
        }
    }
};

/***/ }),

/***/ "./src/utils/polyfill.js":
/*!*******************************!*\
  !*** ./src/utils/polyfill.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

if (typeof(Float32Array) == 'undefined')
{
	window.Float32Array = Array
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRoL01hdGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hdGgvTWF0cml4LmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRoL1BvaW50LmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRoL1JlY3RhbmdsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWluaS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9CYXNlT2JqZWN0MkQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvT2JqZWN0MkQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvU2NlbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvU3ByaXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL1RleHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlbmRlcmVyL0NhbnZhc1JlbmRlcmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9zeXN0ZW1zL0lucHV0LmpzIiwid2VicGFjazovLy8uL3NyYy9zeXN0ZW1zL0xvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3lzdGVtcy9SQUYuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N5c3RlbXMvVGltZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RleHR1cmVzL1RleHR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL0V2ZW50RW1pdHRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvcG9seWZpbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2pGQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQix5QkFBeUI7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsMkJBQTJCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQix5QkFBeUI7QUFDNUM7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzlLQSxtQkFBTyxDQUFDLG9EQUFxQjs7QUFFN0I7O0FBRUEsbUJBQU8sQ0FBQyw4QkFBVTtBQUNsQixtQkFBTyxDQUFDLG9DQUFhO0FBQ3JCLG1CQUFPLENBQUMsMENBQWdCLEVBQUU7QUFDMUIsbUJBQU8sQ0FBQyw0Q0FBaUIsRUFBRTtBQUMzQixtQkFBTyxDQUFDLDhDQUFrQixFQUFFO0FBQzVCLG1CQUFPLENBQUMsb0RBQXFCLEVBQUU7O0FBRS9CLG1CQUFPLENBQUMsZ0VBQTJCLEVBQUU7QUFDckMsbUJBQU8sQ0FBQyx3REFBdUIsRUFBRTtBQUNqQyxtQkFBTyxDQUFDLGtEQUFvQixFQUFFOztBQUU5QixtQkFBTyxDQUFDLHNFQUE4QixFQUFFLFE7Ozs7Ozs7Ozs7OztBQ2R4Qzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7Ozs7QUM5Q0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7Ozs7QUNyQkE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHdDOzs7Ozs7Ozs7OztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRTs7Ozs7Ozs7Ozs7O0FDWEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxxRDs7Ozs7Ozs7Ozs7QUM5SEEsbUJBQU8sQ0FBQyxnQ0FBVzs7O0FBR25CLG1CQUFPLENBQUMsOENBQWtCLEVBQUU7QUFDNUIseUNBQXlDO0FBQ3pDLG1CQUFPLENBQUMsb0RBQXFCLEVBQUU7QUFDL0IsbUJBQU8sQ0FBQyxrREFBb0IsRUFBRTtBQUM5QixtQkFBTyxDQUFDLGtEQUFvQixFQUFFOztBQUU5QixtQkFBTyxDQUFDLDREQUF5Qjs7QUFFakMsbUJBQU8sQ0FBQyx3REFBdUIsRUFBRTs7QUFFakMsbUJBQU8sQ0FBQyxvREFBcUIsRUFBRTtBQUMvQixtQkFBTyxDQUFDLGdEQUFtQixFQUFFOzs7Ozs7Ozs7Ozs7Ozs7QUNiN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esd0ZBQXdGOztBQUV4RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQsa0Q7Ozs7Ozs7Ozs7OztBQ3RSQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxRQUFROztBQUVSO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBLGdCQUFnQjtBQUNoQjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUEsSUFBSTs7QUFFSjs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQywwQ0FBMEM7QUFDMUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixvQkFBb0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsdUNBQXVDLEtBQUs7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLHVDQUF1QyxLQUFLO0FBQzVDO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsdUNBQXVDLEtBQUs7QUFDNUM7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLDBCQUEwQjtBQUM3QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7OztBQy9WQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLDBCQUEwQjtBQUM3QztBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7Ozs7QUNqQkE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQiwwQkFBMEI7QUFDN0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7Ozs7Ozs7O0FDaFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGVBQWUsa0JBQWtCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGNBQWM7QUFDaEM7QUFDQSxzQkFBc0IsVUFBVTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLGNBQWM7QUFDckM7QUFDQSxzQkFBc0IsVUFBVTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtGOzs7Ozs7Ozs7Ozs7QUNuWUE7QUFDQSxDO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLDJDQUEyQywwQkFBMEI7O0FBRXJFO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTs7QUFFUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsQztBQUNBLDRDQUE0QyxtQkFBbUI7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7Ozs7Ozs7O0FDakxBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLG1CQUFtQiwrQkFBK0I7QUFDbEQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQkFBK0IsK0JBQStCO0FBQzlEO0FBQ0E7O0FBRUE7O0FBRUEsK0JBQStCLHNCQUFzQjtBQUNyRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSx3REFBd0QsUUFBUTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0RBQW9EOztBQUVwRCw2Q0FBNkMseUJBQXlCOztBQUV0RTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QseUJBQXlCO0FBQ2pGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLHlCQUF5QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHlDOzs7Ozs7Ozs7Ozs7QUNoUkE7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQSw0QztBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx1QkFBdUIsMEJBQTBCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsMkJBQTJCLGdCQUFnQjtBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsV0FBVztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxRQUFROztBQUVSO0FBQ0E7O0FBRUEseUM7Ozs7Ozs7Ozs7O0FDbFBBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx3Q0FBd0MseUJBQXlCO0FBQ2pFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixxREFBcUQ7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx5Qjs7Ozs7Ozs7Ozs7QUM3SEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdEOzs7Ozs7Ozs7Ozs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEs7Ozs7Ozs7Ozs7OztBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG9CQUFvQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixvQkFBb0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLDJCQUEyQixrQ0FBa0M7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7OztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEMiLCJmaWxlIjoidGlueS5taW5pLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWluaS5qc1wiKTtcbiIsIlxyXG52YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XHJcblxyXG5UaW55LkFwcCA9IGZ1bmN0aW9uKHN0YXRlcylcclxue1xyXG4gICAgdGhpcy5jYWxsYmFja0NvbnRleHQgPSB0aGlzO1xyXG4gICAgdGhpcy5zdGF0ZSA9IDA7XHJcbiAgICB0aGlzLnRpbWVTY2FsZSA9IDE7XHJcbiAgICB0aGlzLndpZHRoID0gMDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gMDtcclxuICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xyXG4gICAgdGhpcy51cGRhdGFibGUgPSBbXTtcclxuICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XHJcbiAgICB0aGlzLnBhdXNlRHVyYXRpb24gPSAwO1xyXG4gICAgdGhpcy5pbnB1dFZpZXcgPSBkb2N1bWVudC5ib2R5O1xyXG5cclxuICAgIHN0YXRlcyA9IHN0YXRlcyB8fCB7fTtcclxuICAgIHRoaXMuYm9vdCA9IHN0YXRlcy5ib290IHx8IHRoaXMuYm9vdCB8fCBub29wO1xyXG4gICAgdGhpcy5wcmVsb2FkID0gc3RhdGVzLnByZWxvYWQgfHwgdGhpcy5wcmVsb2FkIHx8IG5vb3A7XHJcbiAgICB0aGlzLmNyZWF0ZSA9IHN0YXRlcy5jcmVhdGUgfHwgdGhpcy5jcmVhdGUgfHwgbm9vcDtcclxuICAgIHRoaXMudXBkYXRlID0gc3RhdGVzLnVwZGF0ZSB8fCB0aGlzLnVwZGF0ZSB8fCBub29wO1xyXG4gICAgdGhpcy5yZW5kZXIgPSBzdGF0ZXMucmVuZGVyIHx8IHRoaXMucmVuZGVyIHx8IG5vb3A7XHJcbiAgICB0aGlzLl9yZXNpemVfY2IgPSBzdGF0ZXMucmVzaXplIHx8IG5vb3A7XHJcbiAgICB0aGlzLl9kZXN0cm95X2NiID0gc3RhdGVzLmRlc3Ryb3kgfHwgbm9vcDtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICBzZWxmLl9ib290KCk7XHJcbiAgICB9LCAwKTtcclxufVxyXG5cclxuVGlueS5BcHAucHJvdG90eXBlLl9ib290ID0gZnVuY3Rpb24oKVxyXG57XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBUaW55LnN5c3RlbXMubGVuZ3RoOyBpKyspXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHN5c3RlbSA9IFRpbnkuc3lzdGVtc1tpXTtcclxuXHJcbiAgICAgICAgdmFyIF9zeXNfID0gbmV3IHN5c3RlbS5fY2xhc3NfKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKF9zeXNfKTtcclxuICAgICAgICBpZiAoX3N5c18udXBkYXRlKSB0aGlzLnVwZGF0YWJsZS5wdXNoKF9zeXNfKTtcclxuXHJcbiAgICAgICAgaWYgKHN5c3RlbS5uYW1lKSB0aGlzW3N5c3RlbS5uYW1lXSA9IF9zeXNfO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChUaW55LlJBRikgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5yYWYgPSBuZXcgVGlueS5SQUYodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5ib290LmNhbGwodGhpcy5jYWxsYmFja0NvbnRleHQpO1xyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChzZWxmLmxvYWQpIHNlbGYuX3ByZWxvYWQoKTtcclxuICAgICAgICBlbHNlIHNlbGYuX2NyZWF0ZSgpO1xyXG4gICAgfSwgMClcclxufVxyXG5cclxuVGlueS5BcHAucHJvdG90eXBlLl9wcmVsb2FkID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLnByZWxvYWQuY2FsbCh0aGlzLmNhbGxiYWNrQ29udGV4dCk7XHJcbiAgICB0aGlzLnN0YXRlID0gMTtcclxuICAgIHRoaXMubG9hZC5zdGFydCh0aGlzLl9jcmVhdGUpO1xyXG59O1xyXG5cclxuVGlueS5BcHAucHJvdG90eXBlLl9jcmVhdGUgPSBmdW5jdGlvbigpIFxyXG57XHJcbiAgICB0aGlzLmNyZWF0ZS5jYWxsKHRoaXMuY2FsbGJhY2tDb250ZXh0KTtcclxuXHJcbiAgICBpZiAodGhpcy5yYWYpIFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucmFmLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IDI7XHJcbn1cclxuXHJcblxyXG5UaW55LkFwcC5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpIFxyXG57XHJcbiAgICBpZiAodGhpcy5yYWYpIFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucmFmLnJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLnBhdXNlZClcclxuICAgIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3lzdGVtcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN5c3RlbXNbaV0ucGF1c2UpIHRoaXMuc3lzdGVtc1tpXS5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wYXVzZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5UaW55LkFwcC5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBpZiAodGhpcy5yYWYpIFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucmFmLnJlc2V0KCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICh0aGlzLnBhdXNlZClcclxuICAgIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3lzdGVtcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN5c3RlbXNbaV0ucmVzdW1lKSB0aGlzLnN5c3RlbXNbaV0ucmVzdW1lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5UaW55LkFwcC5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUsIGRlbHRhKVxyXG57XHJcbiAgICBpZiAoIXRoaXMucGF1c2VkKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudXBkYXRlLmNhbGwodGhpcy5jYWxsYmFja0NvbnRleHQsIHRpbWUsIGRlbHRhKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnVwZGF0YWJsZS5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRhYmxlW2ldLnVwZGF0ZShkZWx0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucGF1c2VEdXJhdGlvbiArPSBkZWx0YVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbn1cclxuXHJcblxyXG5UaW55LkFwcC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodClcclxue1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IHRoaXMud2lkdGg7XHJcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCB0aGlzLmhlaWdodDtcclxuXHJcbiAgICBpZiAodGhpcy5zdGF0ZSA+IDApIFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3Jlc2l6ZV9jYi5jYWxsKHRoaXMuY2FsbGJhY2tDb250ZXh0LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHNlbGYuaW5wdXQpIHNlbGYuaW5wdXQudXBkYXRlQm91bmRzKCk7XHJcbiAgICB9LCAwKVxyXG59XHJcblxyXG5UaW55LkFwcC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKGNsZWFyQ2FjaGUpXHJcbntcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zeXN0ZW1zLmxlbmd0aDsgaSsrKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnN5c3RlbXNbaV0uZGVzdHJveSkgdGhpcy5zeXN0ZW1zW2ldLmRlc3Ryb3koY2xlYXJDYWNoZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wYXVzZWQgPSB0cnVlO1xyXG5cclxuICAgIGlmIChjbGVhckNhY2hlKSBcclxuICAgIHtcclxuICAgICAgICB0aGlzLmxvYWQuY2xlYXJDYWNoZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJhZikgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5yYWYuc3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2Rlc3Ryb3lfY2IuY2FsbCh0aGlzLmNhbGxiYWNrQ29udGV4dCk7XHJcbn1cclxuIiwicmVxdWlyZSgnLi91dGlscy9wb2x5ZmlsbC5qcycpO1xyXG5cclxud2luZG93LlRpbnkgPSB7fTtcclxuXHJcbnJlcXVpcmUoJy4vQXBwLmpzJyk7XHJcbnJlcXVpcmUoJy4vZ2xvYmFsLmpzJyk7XHJcbnJlcXVpcmUoJy4vbWF0aC9NYXRoLmpzJyk7IC8vIDEgS2JcclxucmVxdWlyZSgnLi9tYXRoL1BvaW50LmpzJyk7ICAgICAgLy9cclxucmVxdWlyZSgnLi9tYXRoL01hdHJpeC5qcycpOyAgICAgLy9cclxucmVxdWlyZSgnLi9tYXRoL1JlY3RhbmdsZS5qcycpOyAgLy8gIDggS2JcclxuXHJcbnJlcXVpcmUoJy4vb2JqZWN0cy9CYXNlT2JqZWN0MkQuanMnKTsgICAgICAgICAgICAgLy9cclxucmVxdWlyZSgnLi9vYmplY3RzL09iamVjdDJELmpzJyk7ICAgIC8vXHJcbnJlcXVpcmUoJy4vb2JqZWN0cy9TY2VuZS5qcycpOyAgICAgICAgICAgICAgICAgICAgIC8vIDEwIEtiXHJcblxyXG5yZXF1aXJlKCcuL3JlbmRlcmVyL0NhbnZhc1JlbmRlcmVyLmpzJyk7IC8vIDMgS2IiLCJcclxuVGlueS5WRVJTSU9OID0gXCIxLjQuOVwiO1xyXG5cclxuVGlueS5zeXN0ZW1zID0gW107XHJcblxyXG5UaW55LnJlZ2lzdGVyU3lzdGVtID0gZnVuY3Rpb24obmFtZSwgc3lzdGVtKSB7XHJcbiAgICBUaW55LnN5c3RlbXMucHVzaCh7XHJcbiAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICBfY2xhc3NfOiBzeXN0ZW1cclxuICAgIH0pO1xyXG59XHJcblxyXG5UaW55LlByaW1pdGl2ZXMgPSB7XHJcbiAgICBQT0xZOiAwLFxyXG4gICAgUkVDVDogMSwgXHJcbiAgICBDSVJDOiAyLFxyXG4gICAgRUxJUDogMyxcclxuICAgIFJSRUM6IDQsXHJcbiAgICBSUkVDX0xKT0lOOiA1XHJcbn1cclxuXHJcblRpbnkucm5kID0gZnVuY3Rpb24obWluLCBtYXgpIHtcclxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xyXG59O1xyXG5cclxuVGlueS5jb2xvcjJyZ2IgPSBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgcmV0dXJuIFRpbnkuaGV4MnJnYihUaW55LnN0eWxlMmhleChzdHlsZSkpO1xyXG59XHJcblxyXG5UaW55LmNvbG9yMnN0eWxlID0gZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgIHJldHVybiBzdHlsZTtcclxufTtcclxuXHJcblRpbnkuc3R5bGUyaGV4ID0gZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgIHJldHVybiArc3R5bGUucmVwbGFjZSgnIycsICcweCcpO1xyXG59O1xyXG5cclxuVGlueS5oZXgyc3R5bGUgPSBmdW5jdGlvbihoZXgpIHtcclxuICAgIHJldHVybiBcIiNcIiArIChcIjAwMDAwXCIgKyAoIGhleCB8IDApLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KTtcclxufVxyXG5cclxuVGlueS5oZXgycmdiID0gZnVuY3Rpb24oaGV4KSB7XHJcbiAgICByZXR1cm4gWyhoZXggPj4gMTYgJiAweEZGKSAvIDI1NSwgKCBoZXggPj4gOCAmIDB4RkYpIC8gMjU1LCAoaGV4ICYgMHhGRikvIDI1NV07XHJcbn07XHJcblxyXG5UaW55LnJnYjJoZXggPSBmdW5jdGlvbihyZ2IpIHtcclxuICAgIHJldHVybiAoKHJnYlswXSoyNTUgPDwgMTYpICsgKHJnYlsxXSoyNTUgPDwgOCkgKyByZ2JbMl0qMjU1KTtcclxufTsiLCJcclxuVGlueS5NYXRoID0ge1xyXG5cclxuICAgIGRpc3RhbmNlOiBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIpIHtcclxuXHJcbiAgICAgICAgdmFyIGR4ID0geDEgLSB4MjtcclxuICAgICAgICB2YXIgZHkgPSB5MSAtIHkyO1xyXG5cclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgZGVncmVlVG9SYWRpYW5zRmFjdG9yID0gTWF0aC5QSSAvIDE4MDtcclxudmFyIHJhZGlhblRvRGVncmVlc0ZhY3RvciA9IDE4MCAvIE1hdGguUEk7XHJcblxyXG5UaW55Lk1hdGguZGVnVG9SYWQgPSBmdW5jdGlvbiBkZWdUb1JhZCAoZGVncmVlcykge1xyXG4gICAgcmV0dXJuIGRlZ3JlZXMgKiBkZWdyZWVUb1JhZGlhbnNGYWN0b3I7XHJcbn07XHJcblxyXG5UaW55Lk1hdGgucmFkVG9EZWcgPSBmdW5jdGlvbiByYWRUb0RlZyAocmFkaWFucykge1xyXG4gICAgcmV0dXJuIHJhZGlhbnMgKiByYWRpYW5Ub0RlZ3JlZXNGYWN0b3I7XHJcbn07IiwiXHJcblRpbnkuTWF0cml4ID0gZnVuY3Rpb24oKVxyXG57XHJcblxyXG4gICAgdGhpcy5hID0gMTtcclxuXHJcbiAgICB0aGlzLmIgPSAwO1xyXG5cclxuICAgIHRoaXMuYyA9IDA7XHJcblxyXG4gICAgdGhpcy5kID0gMTtcclxuXHJcbiAgICB0aGlzLnR4ID0gMDtcclxuXHJcbiAgICB0aGlzLnR5ID0gMDtcclxuXHJcbiAgICB0aGlzLnR5cGUgPSBUaW55Lk1BVFJJWDtcclxuXHJcbn07XHJcblxyXG5UaW55Lk1hdHJpeC5wcm90b3R5cGUuZnJvbUFycmF5ID0gZnVuY3Rpb24oYXJyYXkpXHJcbntcclxuICAgIHRoaXMuYSA9IGFycmF5WzBdO1xyXG4gICAgdGhpcy5iID0gYXJyYXlbMV07XHJcbiAgICB0aGlzLmMgPSBhcnJheVszXTtcclxuICAgIHRoaXMuZCA9IGFycmF5WzRdO1xyXG4gICAgdGhpcy50eCA9IGFycmF5WzJdO1xyXG4gICAgdGhpcy50eSA9IGFycmF5WzVdO1xyXG59O1xyXG5cclxuXHJcblRpbnkuTWF0cml4LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24odHJhbnNwb3NlKVxyXG57XHJcbiAgICBpZiAoIXRoaXMuYXJyYXkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5hcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoOSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFycmF5ID0gdGhpcy5hcnJheTtcclxuXHJcbiAgICBpZiAodHJhbnNwb3NlKVxyXG4gICAge1xyXG4gICAgICAgIGFycmF5WzBdID0gdGhpcy5hO1xyXG4gICAgICAgIGFycmF5WzFdID0gdGhpcy5iO1xyXG4gICAgICAgIGFycmF5WzJdID0gMDtcclxuICAgICAgICBhcnJheVszXSA9IHRoaXMuYztcclxuICAgICAgICBhcnJheVs0XSA9IHRoaXMuZDtcclxuICAgICAgICBhcnJheVs1XSA9IDA7XHJcbiAgICAgICAgYXJyYXlbNl0gPSB0aGlzLnR4O1xyXG4gICAgICAgIGFycmF5WzddID0gdGhpcy50eTtcclxuICAgICAgICBhcnJheVs4XSA9IDE7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgYXJyYXlbMF0gPSB0aGlzLmE7XHJcbiAgICAgICAgYXJyYXlbMV0gPSB0aGlzLmM7XHJcbiAgICAgICAgYXJyYXlbMl0gPSB0aGlzLnR4O1xyXG4gICAgICAgIGFycmF5WzNdID0gdGhpcy5iO1xyXG4gICAgICAgIGFycmF5WzRdID0gdGhpcy5kO1xyXG4gICAgICAgIGFycmF5WzVdID0gdGhpcy50eTtcclxuICAgICAgICBhcnJheVs2XSA9IDA7XHJcbiAgICAgICAgYXJyYXlbN10gPSAwO1xyXG4gICAgICAgIGFycmF5WzhdID0gMTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXJyYXk7XHJcbn07XHJcblxyXG5UaW55Lk1hdHJpeC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbihwb3MsIG5ld1Bvcylcclxue1xyXG4gICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBUaW55LlBvaW50KCk7XHJcblxyXG4gICAgdmFyIHggPSBwb3MueDtcclxuICAgIHZhciB5ID0gcG9zLnk7XHJcblxyXG4gICAgbmV3UG9zLnggPSB0aGlzLmEgKiB4ICsgdGhpcy5jICogeSArIHRoaXMudHg7XHJcbiAgICBuZXdQb3MueSA9IHRoaXMuYiAqIHggKyB0aGlzLmQgKiB5ICsgdGhpcy50eTtcclxuXHJcbiAgICByZXR1cm4gbmV3UG9zO1xyXG59O1xyXG5cclxuVGlueS5NYXRyaXgucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uKHBvcywgbmV3UG9zKVxyXG57XHJcbiAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFRpbnkuUG9pbnQoKTtcclxuXHJcbiAgICB2YXIgaWQgPSAxIC8gKHRoaXMuYSAqIHRoaXMuZCArIHRoaXMuYyAqIC10aGlzLmIpO1xyXG4gICAgdmFyIHggPSBwb3MueDtcclxuICAgIHZhciB5ID0gcG9zLnk7XHJcblxyXG4gICAgbmV3UG9zLnggPSB0aGlzLmQgKiBpZCAqIHggKyAtdGhpcy5jICogaWQgKiB5ICsgKHRoaXMudHkgKiB0aGlzLmMgLSB0aGlzLnR4ICogdGhpcy5kKSAqIGlkO1xyXG4gICAgbmV3UG9zLnkgPSB0aGlzLmEgKiBpZCAqIHkgKyAtdGhpcy5iICogaWQgKiB4ICsgKC10aGlzLnR5ICogdGhpcy5hICsgdGhpcy50eCAqIHRoaXMuYikgKiBpZDtcclxuXHJcbiAgICByZXR1cm4gbmV3UG9zO1xyXG59O1xyXG5cclxuVGlueS5NYXRyaXgucHJvdG90eXBlLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uKHgsIHkpXHJcbntcclxuICAgIHRoaXMudHggKz0geDtcclxuICAgIHRoaXMudHkgKz0geTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5UaW55Lk1hdHJpeC5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbih4LCB5KVxyXG57XHJcbiAgICB0aGlzLmEgKj0geDtcclxuICAgIHRoaXMuZCAqPSB5O1xyXG4gICAgdGhpcy5jICo9IHg7XHJcbiAgICB0aGlzLmIgKj0geTtcclxuICAgIHRoaXMudHggKj0geDtcclxuICAgIHRoaXMudHkgKj0geTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcblRpbnkuTWF0cml4LnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbihhbmdsZSlcclxue1xyXG4gICAgdmFyIGNvcyA9IE1hdGguY29zKCBhbmdsZSApO1xyXG4gICAgdmFyIHNpbiA9IE1hdGguc2luKCBhbmdsZSApO1xyXG5cclxuICAgIHZhciBhMSA9IHRoaXMuYTtcclxuICAgIHZhciBjMSA9IHRoaXMuYztcclxuICAgIHZhciB0eDEgPSB0aGlzLnR4O1xyXG5cclxuICAgIHRoaXMuYSA9IGExICogY29zLXRoaXMuYiAqIHNpbjtcclxuICAgIHRoaXMuYiA9IGExICogc2luK3RoaXMuYiAqIGNvcztcclxuICAgIHRoaXMuYyA9IGMxICogY29zLXRoaXMuZCAqIHNpbjtcclxuICAgIHRoaXMuZCA9IGMxICogc2luK3RoaXMuZCAqIGNvcztcclxuICAgIHRoaXMudHggPSB0eDEgKiBjb3MgLSB0aGlzLnR5ICogc2luO1xyXG4gICAgdGhpcy50eSA9IHR4MSAqIHNpbiArIHRoaXMudHkgKiBjb3M7XHJcbiBcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVGlueS5NYXRyaXgucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG1hdHJpeClcclxue1xyXG4gICAgdmFyIGExID0gdGhpcy5hO1xyXG4gICAgdmFyIGIxID0gdGhpcy5iO1xyXG4gICAgdmFyIGMxID0gdGhpcy5jO1xyXG4gICAgdmFyIGQxID0gdGhpcy5kO1xyXG5cclxuICAgIHRoaXMuYSAgPSBtYXRyaXguYSAqIGExICsgbWF0cml4LmIgKiBjMTtcclxuICAgIHRoaXMuYiAgPSBtYXRyaXguYSAqIGIxICsgbWF0cml4LmIgKiBkMTtcclxuICAgIHRoaXMuYyAgPSBtYXRyaXguYyAqIGExICsgbWF0cml4LmQgKiBjMTtcclxuICAgIHRoaXMuZCAgPSBtYXRyaXguYyAqIGIxICsgbWF0cml4LmQgKiBkMTtcclxuXHJcbiAgICB0aGlzLnR4ID0gbWF0cml4LnR4ICogYTEgKyBtYXRyaXgudHkgKiBjMSArIHRoaXMudHg7XHJcbiAgICB0aGlzLnR5ID0gbWF0cml4LnR4ICogYjEgKyBtYXRyaXgudHkgKiBkMSArIHRoaXMudHk7XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVGlueS5NYXRyaXgucHJvdG90eXBlLmlkZW50aXR5ID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLmEgPSAxO1xyXG4gICAgdGhpcy5iID0gMDtcclxuICAgIHRoaXMuYyA9IDA7XHJcbiAgICB0aGlzLmQgPSAxO1xyXG4gICAgdGhpcy50eCA9IDA7XHJcbiAgICB0aGlzLnR5ID0gMDtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcblRpbnkuaWRlbnRpdHlNYXRyaXggPSBuZXcgVGlueS5NYXRyaXgoKTsiLCJUaW55LlBvaW50ID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgIHRoaXMueCA9IHggfHwgMDtcclxuICAgIHRoaXMueSA9IHkgfHwgMDtcclxufTtcclxuXHJcblRpbnkuUG9pbnQucHJvdG90eXBlID0ge1xyXG5cdCBzZXQ6IGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgdGhpcy54ID0geCB8fCAwO1xyXG4gICAgICAgIHRoaXMueSA9IHkgfHwgKCAoeSAhPT0gMCkgPyB0aGlzLnggOiAwICk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59OyIsIlxyXG5UaW55LlJlY3RhbmdsZSA9IGZ1bmN0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcblxyXG4gICAgeCA9IHggfHwgMDtcclxuICAgIHkgPSB5IHx8IDA7XHJcbiAgICB3aWR0aCA9IHdpZHRoIHx8IDA7XHJcbiAgICBoZWlnaHQgPSBoZWlnaHQgfHwgMDtcclxuXHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuXHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICB0aGlzLnR5cGUgPSBUaW55LlByaW1pdGl2ZXMuUkVDVFxyXG59O1xyXG5cclxuVGlueS5SZWN0YW5nbGUucHJvdG90eXBlID0ge1xyXG5cclxuICAgIHNldFRvOiBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG5cclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAoeCwgeSkge1xyXG5cclxuICAgICAgICByZXR1cm4gVGlueS5SZWN0YW5nbGUuY29udGFpbnModGhpcywgeCwgeSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBpbnRlcnNlY3RzOiBmdW5jdGlvbiAoYikge1xyXG5cclxuICAgICAgICByZXR1cm4gVGlueS5SZWN0YW5nbGUuaW50ZXJzZWN0cyh0aGlzLCBiKTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuUmVjdGFuZ2xlLnByb3RvdHlwZSwgXCJib3R0b21cIiwge1xyXG5cclxuICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnkgKyB0aGlzLmhlaWdodDtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICBpZiAodmFsdWUgPD0gdGhpcy55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IHZhbHVlIC0gdGhpcy55O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuUmVjdGFuZ2xlLnByb3RvdHlwZSwgXCJyaWdodFwiLCB7XHJcblxyXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGg7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlIDw9IHRoaXMueCkge1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gdmFsdWUgLSB0aGlzLng7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5SZWN0YW5nbGUucHJvdG90eXBlLCBcInZvbHVtZVwiLCB7XHJcblxyXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLmhlaWdodDtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuVGlueS5SZWN0YW5nbGUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVGlueS5SZWN0YW5nbGU7XHJcblxyXG5UaW55LlJlY3RhbmdsZS5jb250YWlucyA9IGZ1bmN0aW9uIChhLCB4LCB5KSB7XHJcblxyXG4gICAgaWYgKGEud2lkdGggPD0gMCB8fCBhLmhlaWdodCA8PSAwKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKHggPj0gYS54ICYmIHggPCBhLnJpZ2h0ICYmIHkgPj0gYS55ICYmIHkgPCBhLmJvdHRvbSk7XHJcblxyXG59O1xyXG5cclxuVGlueS5SZWN0YW5nbGUuY29udGFpbnNQb2ludCA9IGZ1bmN0aW9uIChhLCBwb2ludCkge1xyXG5cclxuICAgIHJldHVybiBUaW55LlJlY3RhbmdsZS5jb250YWlucyhhLCBwb2ludC54LCBwb2ludC55KTtcclxuXHJcbn07XHJcblxyXG5UaW55LlJlY3RhbmdsZS5jb250YWluc1JlY3QgPSBmdW5jdGlvbiAoYSwgYikge1xyXG5cclxuICAgIC8vICBJZiB0aGUgZ2l2ZW4gcmVjdCBoYXMgYSBsYXJnZXIgdm9sdW1lIHRoYW4gdGhpcyBvbmUgdGhlbiBpdCBjYW4gbmV2ZXIgY29udGFpbiBpdFxyXG4gICAgaWYgKGEudm9sdW1lID4gYi52b2x1bWUpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoYS54ID49IGIueCAmJiBhLnkgPj0gYi55ICYmIGEucmlnaHQgPCBiLnJpZ2h0ICYmIGEuYm90dG9tIDwgYi5ib3R0b20pO1xyXG5cclxufTtcclxuXHJcblRpbnkuUmVjdGFuZ2xlLmludGVyc2VjdHMgPSBmdW5jdGlvbiAoYSwgYikge1xyXG5cclxuICAgIGlmIChhLndpZHRoIDw9IDAgfHwgYS5oZWlnaHQgPD0gMCB8fCBiLndpZHRoIDw9IDAgfHwgYi5oZWlnaHQgPD0gMClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICEoYS5yaWdodCA8IGIueCB8fCBhLmJvdHRvbSA8IGIueSB8fCBhLnggPiBiLnJpZ2h0IHx8IGEueSA+IGIuYm90dG9tKTtcclxuXHJcbn07XHJcblxyXG5UaW55LkVtcHR5UmVjdGFuZ2xlID0gbmV3IFRpbnkuUmVjdGFuZ2xlKDAsIDAsIDAsIDApOyIsInJlcXVpcmUoJy4vYmFzZS5qcycpXHJcblxyXG5cclxucmVxdWlyZSgnLi9zeXN0ZW1zL1JBRi5qcycpOyAvLyAyIEtiXHJcbi8vIHJlcXVpcmUoJy4vc3lzdGVtcy9PYmplY3RDcmVhdG9yLmpzJyk7IC8vIDEgS2JcclxucmVxdWlyZSgnLi9zeXN0ZW1zL0xvYWRlci5qcycpOyAvLyAzIEtiXHJcbnJlcXVpcmUoJy4vc3lzdGVtcy9JbnB1dC5qcycpOyAvLyAxIEtiXHJcbnJlcXVpcmUoJy4vc3lzdGVtcy9UaW1lci5qcycpOyAvLyAxIEtiXHJcblxyXG5yZXF1aXJlKCcuL3V0aWxzL0V2ZW50RW1pdHRlci5qcycpO1xyXG5cclxucmVxdWlyZSgnLi90ZXh0dXJlcy9UZXh0dXJlLmpzJyk7XHRcdC8vIDQgS2JcclxuXHJcbnJlcXVpcmUoJy4vb2JqZWN0cy9TcHJpdGUuanMnKTsgLy8gMyBLYlxyXG5yZXF1aXJlKCcuL29iamVjdHMvVGV4dC5qcycpOyAvLyA1IEtiXHJcblxyXG5cclxuIiwiXHJcbnZhciBwaTIgPSBNYXRoLlBJICogMjtcclxuXHJcblRpbnkuQmFzZU9iamVjdDJEID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRpbnkuUG9pbnQoMCwgMCk7XHJcbiAgICB0aGlzLnNjYWxlID0gbmV3IFRpbnkuUG9pbnQoMSwgMSk7XHJcbiAgICB0aGlzLnBpdm90ID0gbmV3IFRpbnkuUG9pbnQoMCwgMCk7XHJcbiAgICB0aGlzLnJvdGF0aW9uID0gMDtcclxuICAgIHRoaXMuYWxwaGEgPSAxO1xyXG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgIHRoaXMucmVuZGVyYWJsZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG4gICAgdGhpcy53b3JsZEFscGhhID0gMTtcclxuICAgIHRoaXMud29ybGRUcmFuc2Zvcm0gPSBuZXcgVGlueS5NYXRyaXgoKTtcclxuICAgIHRoaXMuX3NyID0gMDtcclxuICAgIHRoaXMuX2NyID0gMTtcclxuICAgIHRoaXMuX2NhY2hlQXNCaXRtYXAgPSBmYWxzZTtcclxufTtcclxuXHJcblxyXG5UaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUaW55LkJhc2VPYmplY3QyRDtcclxuXHJcblxyXG5UaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgaWYgKHRoaXMucGFyZW50KVxyXG4gICAgICAgIHRoaXMucGFyZW50LnJlbW92ZSggdGhpcyApXHJcblxyXG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG4gICAgdGhpcy53b3JsZFRyYW5zZm9ybSA9IG51bGw7XHJcbiAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuICAgIHRoaXMucmVuZGVyYWJsZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5fZGVzdHJveUNhY2hlZFNwcml0ZSgpO1xyXG59O1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuQmFzZU9iamVjdDJELnByb3RvdHlwZSwgJ3dvcmxkVmlzaWJsZScsIHtcclxuXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGRvXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIWl0ZW0udmlzaWJsZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpdGVtID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlKGl0ZW0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuQmFzZU9iamVjdDJELnByb3RvdHlwZSwgJ2NhY2hlQXNCaXRtYXAnLCB7XHJcblxyXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gIHRoaXMuX2NhY2hlQXNCaXRtYXA7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NhY2hlQXNCaXRtYXAgPT09IHZhbHVlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRlQ2FjaGVkU3ByaXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lDYWNoZWRTcHJpdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NhY2hlQXNCaXRtYXAgPSB2YWx1ZTtcclxuICAgIH1cclxufSk7XHJcblxyXG5UaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBpZiAoIXRoaXMucGFyZW50KVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjcmVhdGUgc29tZSBtYXRyaXggcmVmcyBmb3IgZWFzeSBhY2Nlc3NcclxuICAgIHZhciBwdCA9IHRoaXMucGFyZW50LndvcmxkVHJhbnNmb3JtO1xyXG4gICAgdmFyIHd0ID0gdGhpcy53b3JsZFRyYW5zZm9ybTtcclxuXHJcbiAgICAvLyB0ZW1wb3JhcnkgbWF0cml4IHZhcmlhYmxlc1xyXG4gICAgdmFyIGEsIGIsIGMsIGQsIHR4LCB0eTtcclxuXHJcbiAgICAvLyBzbyBpZiByb3RhdGlvbiBpcyBiZXR3ZWVuIDAgdGhlbiB3ZSBjYW4gc2ltcGxpZnkgdGhlIG11bHRpcGxpY2F0aW9uIHByb2Nlc3MuLlxyXG4gICAgaWYgKHRoaXMucm90YXRpb24gJSBwaTIpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gY2hlY2sgdG8gc2VlIGlmIHRoZSByb3RhdGlvbiBpcyB0aGUgc2FtZSBhcyB0aGUgcHJldmlvdXMgcmVuZGVyLiBUaGlzIG1lYW5zIHdlIG9ubHkgbmVlZCB0byB1c2Ugc2luIGFuZCBjb3Mgd2hlbiByb3RhdGlvbiBhY3R1YWxseSBjaGFuZ2VzXHJcbiAgICAgICAgaWYgKHRoaXMucm90YXRpb24gIT09IHRoaXMucm90YXRpb25DYWNoZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRpb25DYWNoZSA9IHRoaXMucm90YXRpb247XHJcbiAgICAgICAgICAgIHRoaXMuX3NyID0gTWF0aC5zaW4odGhpcy5yb3RhdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuX2NyID0gTWF0aC5jb3ModGhpcy5yb3RhdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBnZXQgdGhlIG1hdHJpeCB2YWx1ZXMgb2YgdGhlIGRpc3BsYXlvYmplY3QgYmFzZWQgb24gaXRzIHRyYW5zZm9ybSBwcm9wZXJ0aWVzLi5cclxuICAgICAgICBhICA9ICB0aGlzLl9jciAqIHRoaXMuc2NhbGUueDtcclxuICAgICAgICBiICA9ICB0aGlzLl9zciAqIHRoaXMuc2NhbGUueDtcclxuICAgICAgICBjICA9IC10aGlzLl9zciAqIHRoaXMuc2NhbGUueTtcclxuICAgICAgICBkICA9ICB0aGlzLl9jciAqIHRoaXMuc2NhbGUueTtcclxuICAgICAgICB0eCA9ICB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdHkgPSAgdGhpcy5wb3NpdGlvbi55O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNoZWNrIGZvciBwaXZvdC4uIG5vdCBvZnRlbiB1c2VkIHNvIGdlYXJlZCB0b3dhcmRzIHRoYXQgZmFjdCFcclxuICAgICAgICBpZiAodGhpcy5waXZvdC54IHx8IHRoaXMucGl2b3QueSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR4IC09IHRoaXMucGl2b3QueCAqIGEgKyB0aGlzLnBpdm90LnkgKiBjO1xyXG4gICAgICAgICAgICB0eSAtPSB0aGlzLnBpdm90LnggKiBiICsgdGhpcy5waXZvdC55ICogZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbmNhdCB0aGUgcGFyZW50IG1hdHJpeCB3aXRoIHRoZSBvYmplY3RzIHRyYW5zZm9ybS5cclxuICAgICAgICB3dC5hICA9IGEgICogcHQuYSArIGIgICogcHQuYztcclxuICAgICAgICB3dC5iICA9IGEgICogcHQuYiArIGIgICogcHQuZDtcclxuICAgICAgICB3dC5jICA9IGMgICogcHQuYSArIGQgICogcHQuYztcclxuICAgICAgICB3dC5kICA9IGMgICogcHQuYiArIGQgICogcHQuZDtcclxuICAgICAgICB3dC50eCA9IHR4ICogcHQuYSArIHR5ICogcHQuYyArIHB0LnR4O1xyXG4gICAgICAgIHd0LnR5ID0gdHggKiBwdC5iICsgdHkgKiBwdC5kICsgcHQudHk7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgLy8gbGV0cyBkbyB0aGUgZmFzdCB2ZXJzaW9uIGFzIHdlIGtub3cgdGhlcmUgaXMgbm8gcm90YXRpb24uLlxyXG4gICAgICAgIGEgID0gdGhpcy5zY2FsZS54O1xyXG4gICAgICAgIGQgID0gdGhpcy5zY2FsZS55O1xyXG5cclxuICAgICAgICB0eCA9IHRoaXMucG9zaXRpb24ueCAtIHRoaXMucGl2b3QueCAqIGE7XHJcbiAgICAgICAgdHkgPSB0aGlzLnBvc2l0aW9uLnkgLSB0aGlzLnBpdm90LnkgKiBkO1xyXG5cclxuICAgICAgICB3dC5hICA9IGEgICogcHQuYTtcclxuICAgICAgICB3dC5iICA9IGEgICogcHQuYjtcclxuICAgICAgICB3dC5jICA9IGQgICogcHQuYztcclxuICAgICAgICB3dC5kICA9IGQgICogcHQuZDtcclxuICAgICAgICB3dC50eCA9IHR4ICogcHQuYSArIHR5ICogcHQuYyArIHB0LnR4O1xyXG4gICAgICAgIHd0LnR5ID0gdHggKiBwdC5iICsgdHkgKiBwdC5kICsgcHQudHk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbXVsdGlwbHkgdGhlIGFscGhhcy4uXHJcbiAgICB0aGlzLndvcmxkQWxwaGEgPSB0aGlzLmFscGhhICogdGhpcy5wYXJlbnQud29ybGRBbHBoYTtcclxuXHJcbn07XHJcblxyXG4vLyBwZXJmb3JtYW5jZSBpbmNyZWFzZSB0byBhdm9pZCB1c2luZyBjYWxsLi4gKDEweCBmYXN0ZXIpXHJcblRpbnkuQmFzZU9iamVjdDJELnByb3RvdHlwZS5kaXNwbGF5T2JqZWN0VXBkYXRlVHJhbnNmb3JtID0gVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybTtcclxuXHJcblRpbnkuQmFzZU9iamVjdDJELnByb3RvdHlwZS5nZXRCb3VuZHMgPSBmdW5jdGlvbihtYXRyaXgpXHJcbntcclxuICAgIG1hdHJpeCA9IG1hdHJpeDsvL2p1c3QgdG8gZ2V0IHBhc3NlZCBqcyBoaW50aW5nIChhbmQgcHJlc2VydmUgaW5oZXJpdGFuY2UpXHJcbiAgICByZXR1cm4gVGlueS5FbXB0eVJlY3RhbmdsZTtcclxufTtcclxuXHJcblRpbnkuQmFzZU9iamVjdDJELnByb3RvdHlwZS5nZXRMb2NhbEJvdW5kcyA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0Qm91bmRzKFRpbnkuaWRlbnRpdHlNYXRyaXgpO1xyXG59O1xyXG5cclxuVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLmdlbmVyYXRlVGV4dHVyZSA9IGZ1bmN0aW9uKHJlc29sdXRpb24sIHJlbmRlcmVyKVxyXG57XHJcbiAgICB2YXIgYm91bmRzID0gdGhpcy5nZXRMb2NhbEJvdW5kcygpO1xyXG5cclxuICAgIHZhciByZW5kZXJUZXh0dXJlID0gbmV3IFRpbnkuUmVuZGVyVGV4dHVyZShib3VuZHMud2lkdGggfCAwLCBib3VuZHMuaGVpZ2h0IHwgMCwgcmVuZGVyZXIsIHJlc29sdXRpb24pO1xyXG4gICAgXHJcbiAgICBUaW55LkJhc2VPYmplY3QyRC5fdGVtcE1hdHJpeC50eCA9IC1ib3VuZHMueDtcclxuICAgIFRpbnkuQmFzZU9iamVjdDJELl90ZW1wTWF0cml4LnR5ID0gLWJvdW5kcy55O1xyXG4gICAgXHJcbiAgICByZW5kZXJUZXh0dXJlLnJlbmRlcih0aGlzLCBUaW55LkJhc2VPYmplY3QyRC5fdGVtcE1hdHJpeCk7XHJcblxyXG4gICAgcmV0dXJuIHJlbmRlclRleHR1cmU7XHJcbn07XHJcblxyXG5UaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUudXBkYXRlQ2FjaGUgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIHRoaXMuX2dlbmVyYXRlQ2FjaGVkU3ByaXRlKCk7XHJcbn07XHJcblxyXG5cclxuVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLnRvR2xvYmFsID0gZnVuY3Rpb24ocG9zaXRpb24pXHJcbntcclxuICAgIC8vIGRvbid0IG5lZWQgdG8gdVtkYXRlIHRoZSBsb3RcclxuICAgIHRoaXMuZGlzcGxheU9iamVjdFVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXMud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zaXRpb24pO1xyXG59O1xyXG5cclxuVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLnRvTG9jYWwgPSBmdW5jdGlvbihwb3NpdGlvbiwgZnJvbSlcclxue1xyXG4gICAgaWYgKGZyb20pXHJcbiAgICB7XHJcbiAgICAgICAgcG9zaXRpb24gPSBmcm9tLnRvR2xvYmFsKHBvc2l0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkb24ndCBuZWVkIHRvIHVbZGF0ZSB0aGUgbG90XHJcbiAgICB0aGlzLmRpc3BsYXlPYmplY3RVcGRhdGVUcmFuc2Zvcm0oKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UocG9zaXRpb24pO1xyXG59O1xyXG5cclxuVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLl9yZW5kZXJDYWNoZWRTcHJpdGUgPSBmdW5jdGlvbihyZW5kZXJTZXNzaW9uKVxyXG57XHJcbiAgICB0aGlzLl9jYWNoZWRTcHJpdGUud29ybGRBbHBoYSA9IHRoaXMud29ybGRBbHBoYTtcclxuXHJcbiAgICBUaW55LlNwcml0ZS5wcm90b3R5cGUucmVuZGVyLmNhbGwodGhpcy5fY2FjaGVkU3ByaXRlLCByZW5kZXJTZXNzaW9uKTtcclxuICAgIFxyXG59O1xyXG5cclxuVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLl9nZW5lcmF0ZUNhY2hlZFNwcml0ZSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5fY2FjaGVkU3ByaXRlID0gbnVsbFxyXG4gICAgdGhpcy5fY2FjaGVBc0JpdG1hcCA9IGZhbHNlO1xyXG5cclxuICAgIHZhciBib3VuZHMgPSB0aGlzLmdldExvY2FsQm91bmRzKCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLl9jYWNoZWRTcHJpdGUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJlbmRlclRleHR1cmUgPSBuZXcgVGlueS5SZW5kZXJUZXh0dXJlKGJvdW5kcy53aWR0aCB8IDAsIGJvdW5kcy5oZWlnaHQgfCAwKTsvLywgcmVuZGVyU2Vzc2lvbi5yZW5kZXJlcik7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhY2hlZFNwcml0ZSA9IG5ldyBUaW55LlNwcml0ZShyZW5kZXJUZXh0dXJlKTtcclxuICAgICAgICB0aGlzLl9jYWNoZWRTcHJpdGUud29ybGRUcmFuc2Zvcm0gPSB0aGlzLndvcmxkVHJhbnNmb3JtO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2NhY2hlZFNwcml0ZS50ZXh0dXJlLnJlc2l6ZShib3VuZHMud2lkdGggfCAwLCBib3VuZHMuaGVpZ2h0IHwgMCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIFRpbnkuQmFzZU9iamVjdDJELl90ZW1wTWF0cml4LnR4ID0gLWJvdW5kcy54O1xyXG4gICAgVGlueS5CYXNlT2JqZWN0MkQuX3RlbXBNYXRyaXgudHkgPSAtYm91bmRzLnk7XHJcbiAgICBcclxuICAgIHRoaXMuX2NhY2hlZFNwcml0ZS50ZXh0dXJlLnJlbmRlcih0aGlzLCBUaW55LkJhc2VPYmplY3QyRC5fdGVtcE1hdHJpeCwgdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5fY2FjaGVkU3ByaXRlLmFuY2hvci54ID0gLSggYm91bmRzLnggLyBib3VuZHMud2lkdGggKTtcclxuICAgIHRoaXMuX2NhY2hlZFNwcml0ZS5hbmNob3IueSA9IC0oIGJvdW5kcy55IC8gYm91bmRzLmhlaWdodCApO1xyXG5cclxuICAgIHRoaXMuX2NhY2hlQXNCaXRtYXAgPSB0cnVlO1xyXG59O1xyXG5cclxuVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLl9kZXN0cm95Q2FjaGVkU3ByaXRlID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBpZiAoIXRoaXMuX2NhY2hlZFNwcml0ZSkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuX2NhY2hlZFNwcml0ZS50ZXh0dXJlLmRlc3Ryb3kodHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5fY2FjaGVkU3ByaXRlID0gbnVsbDtcclxufTtcclxuXHJcblxyXG5UaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24ocmVuZGVyU2Vzc2lvbilcclxue1xyXG4gICAgXHJcbn07XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLCAneCcsIHtcclxuXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuQmFzZU9iamVjdDJELnByb3RvdHlwZSwgJ3knLCB7XHJcblxyXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi55O1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcblRpbnkuQmFzZU9iamVjdDJELl90ZW1wTWF0cml4ID0gbmV3IFRpbnkuTWF0cml4KCk7IiwiXHJcblRpbnkuT2JqZWN0MkQgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIFRpbnkuQmFzZU9iamVjdDJELmNhbGwodGhpcyk7XHJcblxyXG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgdGhpcy5fYm91bmRzID0gbmV3IFRpbnkuUmVjdGFuZ2xlKDAsIDAsIDEsIDEpO1xyXG4gICAgdGhpcy5fY3VycmVudEJvdW5kcyA9IG51bGw7XHJcbiAgICB0aGlzLl9tYXNrID0gbnVsbDtcclxufTtcclxuXHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlICk7XHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVGlueS5PYmplY3QyRDtcclxuXHJcbi8vIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUaW55Lk9iamVjdDJELnByb3RvdHlwZSwgJ2lucHV0RW5hYmxlZCcsIHtcclxuXHJcbi8vICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4vLyAgICAgICAgIHJldHVybiAodGhpcy5pbnB1dCAmJiB0aGlzLmlucHV0LmVuYWJsZWQpXHJcbi8vICAgICB9LFxyXG5cclxuLy8gICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuLy8gICAgICAgICBpZiAodmFsdWUpIHtcclxuLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXQgPT09IG51bGwpIHtcclxuLy8gICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQgPSB7ZW5hYmxlZDogdHJ1ZSwgcGFyZW50OiB0aGlzfVxyXG4vLyAgICAgICAgICAgICAgICAgVGlueS5FdmVudFRhcmdldC5taXhpbih0aGlzLmlucHV0KVxyXG4vLyAgICAgICAgICAgICB9IGVsc2UgXHJcbi8vICAgICAgICAgICAgICAgICB0aGlzLmlucHV0LmVuYWJsZWQgPSB0cnVlXHJcbi8vICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgdGhpcy5pbnB1dCAhPT0gbnVsbCAmJiAodGhpcy5pbnB1dC5lbmFibGVkID0gZmFsc2UpXHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG5cclxuLy8gfSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5PYmplY3QyRC5wcm90b3R5cGUsICd3aWR0aCcsIHtcclxuXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlLnggKiB0aGlzLmdldExvY2FsQm91bmRzKCkud2lkdGg7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmdldExvY2FsQm91bmRzKCkud2lkdGg7XHJcblxyXG4gICAgICAgIGlmKHdpZHRoICE9PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY2FsZS54ID0gdmFsdWUgLyB3aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY2FsZS54ID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuT2JqZWN0MkQucHJvdG90eXBlLCAnaGVpZ2h0Jywge1xyXG5cclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICB0aGlzLnNjYWxlLnkgKiB0aGlzLmdldExvY2FsQm91bmRzKCkuaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblxyXG4gICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmdldExvY2FsQm91bmRzKCkuaGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAoaGVpZ2h0ICE9PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY2FsZS55ID0gdmFsdWUgLyBoZWlnaHQgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjYWxlLnkgPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShUaW55Lk9iamVjdDJELnByb3RvdHlwZSwgJ21hc2snLCB7XHJcblxyXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWFzaztcclxuICAgIH0sXHJcblxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbWFzaykgdGhpcy5fbWFzay5pc01hc2sgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5fbWFzayA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbWFzaykgdGhpcy5fbWFzay5pc01hc2sgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB2YXIgaSA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xyXG5cclxuICAgIHdoaWxlIChpLS0pXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgXHJcbiAgICBUaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuX2JvdW5kcyA9IG51bGw7XHJcbiAgICB0aGlzLl9jdXJyZW50Qm91bmRzID0gbnVsbDtcclxuICAgIHRoaXMuX21hc2sgPSBudWxsO1xyXG4gICAgXHJcbiAgICBpZiAodGhpcy5pbnB1dCkgdGhpcy5pbnB1dC5zeXN0ZW0ucmVtb3ZlKHRoaXMpO1xyXG59O1xyXG5cclxuVGlueS5PYmplY3QyRC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oY2hpbGQpXHJcbntcclxuICAgIHJldHVybiB0aGlzLmFkZENoaWxkQXQoY2hpbGQsIHRoaXMuY2hpbGRyZW4ubGVuZ3RoKTtcclxufTtcclxuXHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlLmFkZENoaWxkQXQgPSBmdW5jdGlvbihjaGlsZCwgaW5kZXgpXHJcbntcclxuICAgIGlmKGluZGV4ID49IDAgJiYgaW5kZXggPD0gdGhpcy5jaGlsZHJlbi5sZW5ndGgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYoY2hpbGQucGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2hpbGQucGFyZW50LnJlbW92ZShjaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG5cclxuICAgICAgICBjaGlsZC5nYW1lID0gdGhpcy5nYW1lO1xyXG5cclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xyXG5cclxuICAgICAgICByZXR1cm4gY2hpbGQ7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGNoaWxkICsgJ2FkZENoaWxkQXQ6IFRoZSBpbmRleCAnKyBpbmRleCArJyBzdXBwbGllZCBpcyBvdXQgb2YgYm91bmRzICcgKyB0aGlzLmNoaWxkcmVuLmxlbmd0aCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5zd2FwQ2hpbGRyZW4gPSBmdW5jdGlvbihjaGlsZCwgY2hpbGQyKVxyXG57XHJcbiAgICBpZihjaGlsZCA9PT0gY2hpbGQyKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpbmRleDEgPSB0aGlzLmdldENoaWxkSW5kZXgoY2hpbGQpO1xyXG4gICAgdmFyIGluZGV4MiA9IHRoaXMuZ2V0Q2hpbGRJbmRleChjaGlsZDIpO1xyXG5cclxuICAgIGlmKGluZGV4MSA8IDAgfHwgaW5kZXgyIDwgMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc3dhcENoaWxkcmVuOiBCb3RoIHRoZSBzdXBwbGllZCBPYmplY3RzIG11c3QgYmUgYSBjaGlsZCBvZiB0aGUgY2FsbGVyLicpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2hpbGRyZW5baW5kZXgxXSA9IGNoaWxkMjtcclxuICAgIHRoaXMuY2hpbGRyZW5baW5kZXgyXSA9IGNoaWxkO1xyXG5cclxufTtcclxuXHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlLmdldENoaWxkSW5kZXggPSBmdW5jdGlvbihjaGlsZClcclxue1xyXG4gICAgdmFyIGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNoaWxkKTtcclxuICAgIGlmIChpbmRleCA9PT0gLTEpXHJcbiAgICB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc3VwcGxpZWQgT2JqZWN0IG11c3QgYmUgYSBjaGlsZCBvZiB0aGUgY2FsbGVyJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5kZXg7XHJcbn07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5zZXRDaGlsZEluZGV4ID0gZnVuY3Rpb24oY2hpbGQsIGluZGV4KVxyXG57XHJcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHN1cHBsaWVkIGluZGV4IGlzIG91dCBvZiBib3VuZHMnKTtcclxuICAgIH1cclxuICAgIHZhciBjdXJyZW50SW5kZXggPSB0aGlzLmdldENoaWxkSW5kZXgoY2hpbGQpO1xyXG4gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoY3VycmVudEluZGV4LCAxKTsgLy9yZW1vdmUgZnJvbSBvbGQgcG9zaXRpb25cclxuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZCk7IC8vYWRkIGF0IG5ldyBwb3NpdGlvblxyXG59O1xyXG5cclxuVGlueS5PYmplY3QyRC5wcm90b3R5cGUuZ2V0Q2hpbGRBdCA9IGZ1bmN0aW9uKGluZGV4KVxyXG57XHJcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0Q2hpbGRBdDogU3VwcGxpZWQgaW5kZXggJysgaW5kZXggKycgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGNoaWxkIGxpc3QsIG9yIHRoZSBzdXBwbGllZCBPYmplY3QgbXVzdCBiZSBhIGNoaWxkIG9mIHRoZSBjYWxsZXInKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2luZGV4XTtcclxuICAgIFxyXG59O1xyXG5cclxuVGlueS5PYmplY3QyRC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oY2hpbGQpXHJcbntcclxuICAgIHZhciBpbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZiggY2hpbGQgKTtcclxuICAgIGlmKGluZGV4ID09PSAtMSlyZXR1cm47XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzLnJlbW92ZUNoaWxkQXQoIGluZGV4ICk7XHJcbn07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5yZW1vdmVDaGlsZEF0ID0gZnVuY3Rpb24oaW5kZXgpXHJcbntcclxuICAgIHZhciBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGRBdCggaW5kZXggKTtcclxuICAgIGNoaWxkLnBhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKCBpbmRleCwgMSApO1xyXG4gICAgcmV0dXJuIGNoaWxkO1xyXG59O1xyXG5cclxuVGlueS5PYmplY3QyRC5wcm90b3R5cGUucmVtb3ZlQ2hpbGRyZW4gPSBmdW5jdGlvbihiZWdpbkluZGV4LCBlbmRJbmRleClcclxue1xyXG4gICAgdmFyIGJlZ2luID0gYmVnaW5JbmRleCB8fCAwO1xyXG4gICAgdmFyIGVuZCA9IHR5cGVvZiBlbmRJbmRleCA9PT0gJ251bWJlcicgPyBlbmRJbmRleCA6IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgdmFyIHJhbmdlID0gZW5kIC0gYmVnaW47XHJcblxyXG4gICAgaWYgKHJhbmdlID4gMCAmJiByYW5nZSA8PSBlbmQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJlbW92ZWQgPSB0aGlzLmNoaWxkcmVuLnNwbGljZShiZWdpbiwgcmFuZ2UpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVtb3ZlZC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSByZW1vdmVkW2ldO1xyXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZW1vdmVkO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocmFuZ2UgPT09IDAgJiYgdGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDApXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ3JlbW92ZUNoaWxkcmVuOiBSYW5nZSBFcnJvciwgbnVtZXJpYyB2YWx1ZXMgYXJlIG91dHNpZGUgdGhlIGFjY2VwdGFibGUgcmFuZ2UnICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm0gPSBmdW5jdGlvbigpXHJcbntcclxuICAgIGlmKCF0aGlzLnZpc2libGUpcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuZGlzcGxheU9iamVjdFVwZGF0ZVRyYW5zZm9ybSgpO1xyXG5cclxuICAgIGlmKHRoaXMuX2NhY2hlQXNCaXRtYXApcmV0dXJuO1xyXG5cclxuICAgIGZvcih2YXIgaT0wLGo9dGhpcy5jaGlsZHJlbi5sZW5ndGg7IGk8ajsgaSsrKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBwZXJmb3JtYW5jZSBpbmNyZWFzZSB0byBhdm9pZCB1c2luZyBjYWxsLi4gKDEweCBmYXN0ZXIpXHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlLmRpc3BsYXlPYmplY3RDb250YWluZXJVcGRhdGVUcmFuc2Zvcm0gPSBUaW55Lk9iamVjdDJELnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5nZXRCb3VuZHMgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwKXJldHVybiBUaW55LkVtcHR5UmVjdGFuZ2xlO1xyXG4gICAgaWYgKHRoaXMuX2NhY2hlZFNwcml0ZSkgcmV0dXJuIHRoaXMuX2NhY2hlZFNwcml0ZS5nZXRCb3VuZHMoKVxyXG5cclxuICAgIC8vIFRPRE8gdGhlIGJvdW5kcyBoYXZlIGFscmVhZHkgYmVlbiBjYWxjdWxhdGVkIHRoaXMgcmVuZGVyIHNlc3Npb24gc28gcmV0dXJuIHdoYXQgd2UgaGF2ZVxyXG5cclxuICAgIHZhciBtaW5YID0gSW5maW5pdHk7XHJcbiAgICB2YXIgbWluWSA9IEluZmluaXR5O1xyXG5cclxuICAgIHZhciBtYXhYID0gLUluZmluaXR5O1xyXG4gICAgdmFyIG1heFkgPSAtSW5maW5pdHk7XHJcblxyXG4gICAgdmFyIGNoaWxkQm91bmRzO1xyXG4gICAgdmFyIGNoaWxkTWF4WDtcclxuICAgIHZhciBjaGlsZE1heFk7XHJcblxyXG4gICAgdmFyIGNoaWxkVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgIGZvcih2YXIgaT0wLGo9dGhpcy5jaGlsZHJlbi5sZW5ndGg7IGk8ajsgaSsrKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIWNoaWxkLnZpc2libGUpY29udGludWU7XHJcblxyXG4gICAgICAgIGNoaWxkVmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgIGNoaWxkQm91bmRzID0gdGhpcy5jaGlsZHJlbltpXS5nZXRCb3VuZHMoKTtcclxuICAgICBcclxuICAgICAgICBtaW5YID0gbWluWCA8IGNoaWxkQm91bmRzLnggPyBtaW5YIDogY2hpbGRCb3VuZHMueDtcclxuICAgICAgICBtaW5ZID0gbWluWSA8IGNoaWxkQm91bmRzLnkgPyBtaW5ZIDogY2hpbGRCb3VuZHMueTtcclxuXHJcbiAgICAgICAgY2hpbGRNYXhYID0gY2hpbGRCb3VuZHMud2lkdGggKyBjaGlsZEJvdW5kcy54O1xyXG4gICAgICAgIGNoaWxkTWF4WSA9IGNoaWxkQm91bmRzLmhlaWdodCArIGNoaWxkQm91bmRzLnk7XHJcblxyXG4gICAgICAgIG1heFggPSBtYXhYID4gY2hpbGRNYXhYID8gbWF4WCA6IGNoaWxkTWF4WDtcclxuICAgICAgICBtYXhZID0gbWF4WSA+IGNoaWxkTWF4WSA/IG1heFkgOiBjaGlsZE1heFk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIWNoaWxkVmlzaWJsZSlcclxuICAgICAgICByZXR1cm4gVGlueS5FbXB0eVJlY3RhbmdsZTtcclxuXHJcbiAgICB2YXIgYm91bmRzID0gdGhpcy5fYm91bmRzO1xyXG5cclxuICAgIGJvdW5kcy54ID0gbWluWDtcclxuICAgIGJvdW5kcy55ID0gbWluWTtcclxuICAgIGJvdW5kcy53aWR0aCA9IG1heFggLSBtaW5YO1xyXG4gICAgYm91bmRzLmhlaWdodCA9IG1heFkgLSBtaW5ZO1xyXG5cclxuICAgIC8vIFRPRE86IHN0b3JlIGEgcmVmZXJlbmNlIHNvIHRoYXQgaWYgdGhpcyBmdW5jdGlvbiBnZXRzIGNhbGxlZCBhZ2FpbiBpbiB0aGUgcmVuZGVyIGN5Y2xlIHdlIGRvIG5vdCBoYXZlIHRvIHJlY2FsY3VsYXRlXHJcbiAgICAvL3RoaXMuX2N1cnJlbnRCb3VuZHMgPSBib3VuZHM7XHJcbiAgIFxyXG4gICAgcmV0dXJuIGJvdW5kcztcclxufTtcclxuXHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlLmdldExvY2FsQm91bmRzID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB2YXIgbWF0cml4Q2FjaGUgPSB0aGlzLndvcmxkVHJhbnNmb3JtO1xyXG5cclxuICAgIHRoaXMud29ybGRUcmFuc2Zvcm0gPSBUaW55LmlkZW50aXR5TWF0cml4O1xyXG5cclxuICAgIGZvcih2YXIgaT0wLGo9dGhpcy5jaGlsZHJlbi5sZW5ndGg7IGk8ajsgaSsrKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGJvdW5kcyA9IHRoaXMuZ2V0Qm91bmRzKCk7XHJcblxyXG4gICAgdGhpcy53b3JsZFRyYW5zZm9ybSA9IG1hdHJpeENhY2hlO1xyXG5cclxuICAgIHJldHVybiBib3VuZHM7XHJcbn07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihyZW5kZXJTZXNzaW9uKVxyXG57XHJcbiAgICBpZiAodGhpcy52aXNpYmxlID09PSBmYWxzZSB8fCB0aGlzLmFscGhhID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgaWYgKHRoaXMuX2NhY2hlQXNCaXRtYXApXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyQ2FjaGVkU3ByaXRlKHJlbmRlclNlc3Npb24pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fbWFzaylcclxuICAgIHtcclxuICAgICAgICByZW5kZXJTZXNzaW9uLm1hc2tNYW5hZ2VyLnB1c2hNYXNrKHRoaXMuX21hc2ssIHJlbmRlclNlc3Npb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnJlbmRlcihyZW5kZXJTZXNzaW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fbWFzaylcclxuICAgIHtcclxuICAgICAgICByZW5kZXJTZXNzaW9uLm1hc2tNYW5hZ2VyLnBvcE1hc2socmVuZGVyU2Vzc2lvbik7XHJcbiAgICB9XHJcbn07IiwiVGlueS5TY2VuZSA9IGZ1bmN0aW9uKGdhbWUpXHJcbntcclxuICAgIFRpbnkuT2JqZWN0MkQuY2FsbCggdGhpcyApO1xyXG4gICAgdGhpcy53b3JsZFRyYW5zZm9ybSA9IG5ldyBUaW55Lk1hdHJpeCgpO1xyXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcclxufTtcclxuXHJcblRpbnkuU2NlbmUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVGlueS5PYmplY3QyRC5wcm90b3R5cGUgKTtcclxuVGlueS5TY2VuZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUaW55LlNjZW5lO1xyXG5cclxuVGlueS5TY2VuZS5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLndvcmxkQWxwaGEgPSAxO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG59OyIsIlxyXG5UaW55LlNwcml0ZSA9IGZ1bmN0aW9uKHRleHR1cmUsIGtleSlcclxue1xyXG4gICAgVGlueS5PYmplY3QyRC5jYWxsKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuYW5jaG9yID0gbmV3IFRpbnkuUG9pbnQoKTtcclxuXHJcbiAgICB0aGlzLnNldFRleHR1cmUodGV4dHVyZSwga2V5LCBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5fd2lkdGggPSAwO1xyXG5cclxuICAgIHRoaXMuX2hlaWdodCA9IDA7XHJcblxyXG4gICAgdGhpcy5fZnJhbWUgPSAwO1xyXG5cclxuICAgIHRoaXMudGludCA9IFwiI0ZGRkZGRlwiO1xyXG5cclxuICAgIHRoaXMuYmxlbmRNb2RlID0gXCJzb3VyY2Utb3ZlclwiO1xyXG5cclxuICAgIGlmICh0aGlzLnRleHR1cmUuaGFzTG9hZGVkKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub25UZXh0dXJlVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZW5kZXJhYmxlID0gdHJ1ZTtcclxufTtcclxuXHJcblxyXG5UaW55LlNwcml0ZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRpbnkuT2JqZWN0MkQucHJvdG90eXBlKTtcclxuVGlueS5TcHJpdGUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVGlueS5TcHJpdGU7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5TcHJpdGUucHJvdG90eXBlLCAnZnJhbWVOYW1lJywge1xyXG5cclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dHVyZS5mcmFtZS5uYW1lXHJcbiAgICB9LFxyXG5cclxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy50ZXh0dXJlLmZyYW1lLm5hbWUpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKFRpbnkuQ2FjaGUudGV4dHVyZVt0aGlzLnRleHR1cmUua2V5ICsgXCIuXCIgKyB2YWx1ZV0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5TcHJpdGUucHJvdG90eXBlLCAnZnJhbWUnLCB7XHJcblxyXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZnJhbWVcclxuICAgIH0sXHJcblxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnRleHR1cmUubGFzdEZyYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lID0gdmFsdWVcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ZyYW1lID4gdGhpcy50ZXh0dXJlLmxhc3RGcmFtZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lID0gMFxyXG4gICAgICAgICAgICB0aGlzLnNldFRleHR1cmUoVGlueS5DYWNoZS50ZXh0dXJlW3RoaXMudGV4dHVyZS5rZXkgKyBcIi5cIiArIHRoaXMuX2ZyYW1lXSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShUaW55LlNwcml0ZS5wcm90b3R5cGUsICd3aWR0aCcsIHtcclxuXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlLnggKiB0aGlzLnRleHR1cmUuZnJhbWUud2lkdGg7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNjYWxlLnggPSB2YWx1ZSAvIHRoaXMudGV4dHVyZS5mcmFtZS53aWR0aDtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5TcHJpdGUucHJvdG90eXBlLCAnaGVpZ2h0Jywge1xyXG5cclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICB0aGlzLnNjYWxlLnkgKiB0aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zY2FsZS55ID0gdmFsdWUgLyB0aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5UaW55LlNwcml0ZS5wcm90b3R5cGUuc2V0VGV4dHVyZSA9IGZ1bmN0aW9uKHRleHR1cmUsIGtleSwgdXBkYXRlRGltZW5zaW9uKVxyXG57XHJcbiAgICBpZiAodHlwZW9mIHRleHR1cmUgPT0gXCJzdHJpbmdcIikgXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGltYWdlUGF0aCA9IHRleHR1cmU7XHJcblxyXG4gICAgICAgIGlmIChrZXkgIT0gdW5kZWZpbmVkKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGltYWdlUGF0aCA9IGltYWdlUGF0aCArIFwiLlwiICsga2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGV4dHVyZSA9IFRpbnkuQ2FjaGUudGV4dHVyZVtpbWFnZVBhdGhdO1xyXG5cclxuICAgICAgICBpZiAoIXRleHR1cmUpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dHVyZSA9IG5ldyBUaW55LlRleHR1cmUoaW1hZ2VQYXRoKTtcclxuICAgICAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKCdDYWNoZSBFcnJvcjogaW1hZ2UgJyArIGltYWdlUGF0aCArICcgZG9lc2B0IGZvdW5kIGluIGNhY2hlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRleHR1cmUgPT09IHRleHR1cmUpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gICAgdGhpcy5jYWNoZWRUaW50ID0gMHhGRkZGRkY7XHJcblxyXG4gICAgaWYgKHVwZGF0ZURpbWVuc2lvbiA9PT0gdHJ1ZSkgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vblRleHR1cmVVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcblRpbnkuU3ByaXRlLnByb3RvdHlwZS5vblRleHR1cmVVcGRhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIC8vIHNvIGlmIF93aWR0aCBpcyAwIHRoZW4gd2lkdGggd2FzIG5vdCBzZXQuLlxyXG4gICAgaWYgKHRoaXMuX3dpZHRoKSB0aGlzLnNjYWxlLnggPSB0aGlzLl93aWR0aCAvIHRoaXMudGV4dHVyZS5mcmFtZS53aWR0aDtcclxuICAgIGlmICh0aGlzLl9oZWlnaHQpIHRoaXMuc2NhbGUueSA9IHRoaXMuX2hlaWdodCAvIHRoaXMudGV4dHVyZS5mcmFtZS5oZWlnaHQ7XHJcbn07XHJcblxyXG5UaW55LlNwcml0ZS5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uKHRpbWVyLCBkZWxheSlcclxue1xyXG4gICAgaWYgKHRoaXMudGV4dHVyZS5sYXN0RnJhbWUgJiYgdGhpcy50ZXh0dXJlLmZyYW1lLmluZGV4ICE9IHVuZGVmaW5lZCkgXHJcbiAgICB7XHJcbiAgICAgICAgZGVsYXkgPSBkZWxheSB8fCAodGhpcy50ZXh0dXJlLmZyYW1lLmR1cmF0aW9uIHx8IDEwMCk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5hbmltYXRpb24pIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSB0aW1lci5sb29wKGRlbGF5LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZnJhbWUgKz0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLmRlbGF5ID0gZGVsYXkgfHwgKHRoaXMudGV4dHVyZS5mcmFtZS5kdXJhdGlvbiB8fCAxMDApO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uc3RhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uZGVsYXkgPSBkZWxheTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uc3RhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55LlNwcml0ZS5wcm90b3R5cGUuZ2V0Qm91bmRzID0gZnVuY3Rpb24obWF0cml4KVxyXG57XHJcbiAgICB2YXIgd2lkdGggPSB0aGlzLnRleHR1cmUuZnJhbWUud2lkdGggLyB0aGlzLnRleHR1cmUucmVzb2x1dGlvbjtcclxuICAgIHZhciBoZWlnaHQgPSB0aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0IC8gdGhpcy50ZXh0dXJlLnJlc29sdXRpb247XHJcblxyXG4gICAgdmFyIHcwID0gd2lkdGggKiAoMS10aGlzLmFuY2hvci54KTtcclxuICAgIHZhciB3MSA9IHdpZHRoICogLXRoaXMuYW5jaG9yLng7XHJcblxyXG4gICAgdmFyIGgwID0gaGVpZ2h0ICogKDEtdGhpcy5hbmNob3IueSk7XHJcbiAgICB2YXIgaDEgPSBoZWlnaHQgKiAtdGhpcy5hbmNob3IueTtcclxuXHJcbiAgICB2YXIgd29ybGRUcmFuc2Zvcm0gPSBtYXRyaXggfHwgdGhpcy53b3JsZFRyYW5zZm9ybTtcclxuXHJcbiAgICB2YXIgYSA9IHdvcmxkVHJhbnNmb3JtLmE7XHJcbiAgICB2YXIgYiA9IHdvcmxkVHJhbnNmb3JtLmI7XHJcbiAgICB2YXIgYyA9IHdvcmxkVHJhbnNmb3JtLmM7XHJcbiAgICB2YXIgZCA9IHdvcmxkVHJhbnNmb3JtLmQ7XHJcbiAgICB2YXIgdHggPSB3b3JsZFRyYW5zZm9ybS50eDtcclxuICAgIHZhciB0eSA9IHdvcmxkVHJhbnNmb3JtLnR5O1xyXG5cclxuICAgIHZhciBtYXhYID0gLUluZmluaXR5O1xyXG4gICAgdmFyIG1heFkgPSAtSW5maW5pdHk7XHJcblxyXG4gICAgdmFyIG1pblggPSBJbmZpbml0eTtcclxuICAgIHZhciBtaW5ZID0gSW5maW5pdHk7XHJcblxyXG4gICAgaWYgKGIgPT09IDAgJiYgYyA9PT0gMClcclxuICAgIHtcclxuICAgICAgICAvLyAvLyBzY2FsZSBtYXkgYmUgbmVnYXRpdmUhXHJcbiAgICAgICAgLy8gaWYgKGEgPCAwKSBhICo9IC0xO1xyXG4gICAgICAgIC8vIGlmIChkIDwgMCkgZCAqPSAtMTtcclxuXHJcbiAgICAgICAgLy8gLy8gdGhpcyBtZWFucyB0aGVyZSBpcyBubyByb3RhdGlvbiBnb2luZyBvbiByaWdodD8gUklHSFQ/XHJcbiAgICAgICAgLy8gLy8gaWYgdGhhdHMgdGhlIGNhc2UgdGhlbiB3ZSBjYW4gYXZvaWQgY2hlY2tpbmcgdGhlIGJvdW5kIHZhbHVlcyEgeWF5ICAgICAgICAgXHJcbiAgICAgICAgLy8gbWluWCA9IGEgKiB3MSArIHR4O1xyXG4gICAgICAgIC8vIG1heFggPSBhICogdzAgKyB0eDtcclxuICAgICAgICAvLyBtaW5ZID0gZCAqIGgxICsgdHk7XHJcbiAgICAgICAgLy8gbWF4WSA9IGQgKiBoMCArIHR5O1xyXG5cclxuICAgICAgICBpZiAoYSA8IDApIHtcclxuICAgICAgICAgICAgbWluWCA9IGEgKiB3MCArIHR4O1xyXG4gICAgICAgICAgICBtYXhYID0gYSAqIHcxICsgdHg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbWluWCA9IGEgKiB3MSArIHR4O1xyXG4gICAgICAgICAgICBtYXhYID0gYSAqIHcwICsgdHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZCA8IDApIHtcclxuICAgICAgICAgICAgbWluWSA9IGQgKiBoMCArIHR5O1xyXG4gICAgICAgICAgICBtYXhZID0gZCAqIGgxICsgdHk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbWluWSA9IGQgKiBoMSArIHR5O1xyXG4gICAgICAgICAgICBtYXhZID0gZCAqIGgwICsgdHk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIHZhciB4MSA9IGEgKiB3MSArIGMgKiBoMSArIHR4O1xyXG4gICAgICAgIHZhciB5MSA9IGQgKiBoMSArIGIgKiB3MSArIHR5O1xyXG5cclxuICAgICAgICB2YXIgeDIgPSBhICogdzAgKyBjICogaDEgKyB0eDtcclxuICAgICAgICB2YXIgeTIgPSBkICogaDEgKyBiICogdzAgKyB0eTtcclxuXHJcbiAgICAgICAgdmFyIHgzID0gYSAqIHcwICsgYyAqIGgwICsgdHg7XHJcbiAgICAgICAgdmFyIHkzID0gZCAqIGgwICsgYiAqIHcwICsgdHk7XHJcblxyXG4gICAgICAgIHZhciB4NCA9ICBhICogdzEgKyBjICogaDAgKyB0eDtcclxuICAgICAgICB2YXIgeTQgPSAgZCAqIGgwICsgYiAqIHcxICsgdHk7XHJcblxyXG4gICAgICAgIG1pblggPSB4MSA8IG1pblggPyB4MSA6IG1pblg7XHJcbiAgICAgICAgbWluWCA9IHgyIDwgbWluWCA/IHgyIDogbWluWDtcclxuICAgICAgICBtaW5YID0geDMgPCBtaW5YID8geDMgOiBtaW5YO1xyXG4gICAgICAgIG1pblggPSB4NCA8IG1pblggPyB4NCA6IG1pblg7XHJcblxyXG4gICAgICAgIG1pblkgPSB5MSA8IG1pblkgPyB5MSA6IG1pblk7XHJcbiAgICAgICAgbWluWSA9IHkyIDwgbWluWSA/IHkyIDogbWluWTtcclxuICAgICAgICBtaW5ZID0geTMgPCBtaW5ZID8geTMgOiBtaW5ZO1xyXG4gICAgICAgIG1pblkgPSB5NCA8IG1pblkgPyB5NCA6IG1pblk7XHJcblxyXG4gICAgICAgIG1heFggPSB4MSA+IG1heFggPyB4MSA6IG1heFg7XHJcbiAgICAgICAgbWF4WCA9IHgyID4gbWF4WCA/IHgyIDogbWF4WDtcclxuICAgICAgICBtYXhYID0geDMgPiBtYXhYID8geDMgOiBtYXhYO1xyXG4gICAgICAgIG1heFggPSB4NCA+IG1heFggPyB4NCA6IG1heFg7XHJcblxyXG4gICAgICAgIG1heFkgPSB5MSA+IG1heFkgPyB5MSA6IG1heFk7XHJcbiAgICAgICAgbWF4WSA9IHkyID4gbWF4WSA/IHkyIDogbWF4WTtcclxuICAgICAgICBtYXhZID0geTMgPiBtYXhZID8geTMgOiBtYXhZO1xyXG4gICAgICAgIG1heFkgPSB5NCA+IG1heFkgPyB5NCA6IG1heFk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGJvdW5kcyA9IHRoaXMuX2JvdW5kcztcclxuXHJcbiAgICBib3VuZHMueCA9IG1pblg7XHJcbiAgICBib3VuZHMud2lkdGggPSBtYXhYIC0gbWluWDtcclxuXHJcbiAgICBib3VuZHMueSA9IG1pblk7XHJcbiAgICBib3VuZHMuaGVpZ2h0ID0gbWF4WSAtIG1pblk7XHJcblxyXG4gICAgLy8gc3RvcmUgYSByZWZlcmVuY2Ugc28gdGhhdCBpZiB0aGlzIGZ1bmN0aW9uIGdldHMgY2FsbGVkIGFnYWluIGluIHRoZSByZW5kZXIgY3ljbGUgd2UgZG8gbm90IGhhdmUgdG8gcmVjYWxjdWxhdGVcclxuICAgIHRoaXMuX2N1cnJlbnRCb3VuZHMgPSBib3VuZHM7XHJcblxyXG4gICAgcmV0dXJuIGJvdW5kcztcclxufTtcclxuXHJcblxyXG5UaW55LlNwcml0ZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24ocmVuZGVyU2Vzc2lvbilcclxue1xyXG4gICAgLy8gSWYgdGhlIHNwcml0ZSBpcyBub3QgdmlzaWJsZSBvciB0aGUgYWxwaGEgaXMgMCB0aGVuIG5vIG5lZWQgdG8gcmVuZGVyIHRoaXMgZWxlbWVudFxyXG4gICAgaWYgKHRoaXMudmlzaWJsZSA9PT0gZmFsc2UgfHwgdGhpcy5hbHBoYSA9PT0gMCB8fCB0aGlzLnJlbmRlcmFibGUgPT09IGZhbHNlIHx8IHRoaXMudGV4dHVyZS5jcm9wLndpZHRoIDw9IDAgfHwgdGhpcy50ZXh0dXJlLmNyb3AuaGVpZ2h0IDw9IDApIHJldHVybjtcclxuXHJcbiAgICBpZiAodGhpcy5ibGVuZE1vZGUgIT09IHJlbmRlclNlc3Npb24uY3VycmVudEJsZW5kTW9kZSlcclxuICAgIHtcclxuICAgICAgICByZW5kZXJTZXNzaW9uLmN1cnJlbnRCbGVuZE1vZGUgPSB0aGlzLmJsZW5kTW9kZTtcclxuICAgICAgICByZW5kZXJTZXNzaW9uLmNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gcmVuZGVyU2Vzc2lvbi5jdXJyZW50QmxlbmRNb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9tYXNrKVxyXG4gICAge1xyXG4gICAgICAgIHJlbmRlclNlc3Npb24ubWFza01hbmFnZXIucHVzaE1hc2sodGhpcy5fbWFzaywgcmVuZGVyU2Vzc2lvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIElnbm9yZSBudWxsIHNvdXJjZXNcclxuICAgIGlmICh0aGlzLnRleHR1cmUudmFsaWQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJlc29sdXRpb24gPSB0aGlzLnRleHR1cmUucmVzb2x1dGlvbiAvIHJlbmRlclNlc3Npb24ucmVzb2x1dGlvbjtcclxuXHJcbiAgICAgICAgcmVuZGVyU2Vzc2lvbi5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy53b3JsZEFscGhhO1xyXG5cclxuXHJcbiAgICAgICAgLy8gIElmIHRoZSB0ZXh0dXJlIGlzIHRyaW1tZWQgd2Ugb2Zmc2V0IGJ5IHRoZSB0cmltIHgveSwgb3RoZXJ3aXNlIHdlIHVzZSB0aGUgZnJhbWUgZGltZW5zaW9uc1xyXG4gICAgICAgIHZhciBkeCA9ICh0aGlzLnRleHR1cmUudHJpbSkgPyB0aGlzLnRleHR1cmUudHJpbS54IC0gdGhpcy5hbmNob3IueCAqIHRoaXMudGV4dHVyZS50cmltLndpZHRoIDogdGhpcy5hbmNob3IueCAqIC10aGlzLnRleHR1cmUuZnJhbWUud2lkdGg7XHJcbiAgICAgICAgdmFyIGR5ID0gKHRoaXMudGV4dHVyZS50cmltKSA/IHRoaXMudGV4dHVyZS50cmltLnkgLSB0aGlzLmFuY2hvci55ICogdGhpcy50ZXh0dXJlLnRyaW0uaGVpZ2h0IDogdGhpcy5hbmNob3IueSAqIC10aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0O1xyXG5cclxuICAgICAgICAvLyAgQWxsb3cgZm9yIHBpeGVsIHJvdW5kaW5nXHJcbiAgICAgICAgaWYgKHJlbmRlclNlc3Npb24ucm91bmRQaXhlbHMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZW5kZXJTZXNzaW9uLmNvbnRleHQuc2V0VHJhbnNmb3JtKFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFRyYW5zZm9ybS5hLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFRyYW5zZm9ybS5iLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFRyYW5zZm9ybS5jLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFRyYW5zZm9ybS5kLFxyXG4gICAgICAgICAgICAgICAgKHRoaXMud29ybGRUcmFuc2Zvcm0udHggKiByZW5kZXJTZXNzaW9uLnJlc29sdXRpb24pIHwgMCxcclxuICAgICAgICAgICAgICAgICh0aGlzLndvcmxkVHJhbnNmb3JtLnR5ICogcmVuZGVyU2Vzc2lvbi5yZXNvbHV0aW9uKSB8IDApO1xyXG4gICAgICAgICAgICBkeCA9IGR4IHwgMDtcclxuICAgICAgICAgICAgZHkgPSBkeSB8IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlbmRlclNlc3Npb24uY29udGV4dC5zZXRUcmFuc2Zvcm0oXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkVHJhbnNmb3JtLmEsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkVHJhbnNmb3JtLmIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkVHJhbnNmb3JtLmMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkVHJhbnNmb3JtLmQsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkVHJhbnNmb3JtLnR4ICogcmVuZGVyU2Vzc2lvbi5yZXNvbHV0aW9uLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFRyYW5zZm9ybS50eSAqIHJlbmRlclNlc3Npb24ucmVzb2x1dGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50aW50ICE9PSBcIiNGRkZGRkZcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlZFRpbnQgIT09IHRoaXMudGludClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZWRUaW50ID0gdGhpcy50aW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW50ZWRUZXh0dXJlID0gVGlueS5DYW52YXNUaW50ZXIuZ2V0VGludGVkVGV4dHVyZSh0aGlzLCB0aGlzLnRpbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZW5kZXJTZXNzaW9uLmNvbnRleHQuZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGludGVkVGV4dHVyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlLmNyb3Aud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlLmNyb3AuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR4IC8gcmVzb2x1dGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkeSAvIHJlc29sdXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlLmNyb3Aud2lkdGggLyByZXNvbHV0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZS5jcm9wLmhlaWdodCAvIHJlc29sdXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZW5kZXJTZXNzaW9uLmNvbnRleHQuZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZS5zb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlLmNyb3AueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmUuY3JvcC55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZS5jcm9wLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZS5jcm9wLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkeCAvIHJlc29sdXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHkgLyByZXNvbHV0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZS5jcm9wLndpZHRoIC8gcmVzb2x1dGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmUuY3JvcC5oZWlnaHQgLyByZXNvbHV0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT1ZFUldSSVRFXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5yZW5kZXIocmVuZGVyU2Vzc2lvbik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX21hc2spXHJcbiAgICB7XHJcbiAgICAgICAgcmVuZGVyU2Vzc2lvbi5tYXNrTWFuYWdlci5wb3BNYXNrKHJlbmRlclNlc3Npb24pO1xyXG4gICAgfVxyXG59OyIsIlxyXG5UaW55LlRleHQgPSBmdW5jdGlvbih0ZXh0LCBzdHlsZSlcclxue1xyXG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLnJlc29sdXRpb24gPSAxO1xyXG5cclxuICAgIFRpbnkuU3ByaXRlLmNhbGwodGhpcywgVGlueS5UZXh0dXJlLmZyb21DYW52YXModGhpcy5jYW52YXMpKTtcclxuXHJcbiAgICB0aGlzLnNldFRleHQodGV4dCk7XHJcbiAgICB0aGlzLnNldFN0eWxlKHN0eWxlKTtcclxuXHJcbn07XHJcblxyXG5UaW55LlRleHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUaW55LlNwcml0ZS5wcm90b3R5cGUpO1xyXG5UaW55LlRleHQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVGlueS5UZXh0O1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuVGV4dC5wcm90b3R5cGUsICd3aWR0aCcsIHtcclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGlydHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlLnggKiB0aGlzLnRleHR1cmUuZnJhbWUud2lkdGg7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUueCA9IHZhbHVlIC8gdGhpcy50ZXh0dXJlLmZyYW1lLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuVGV4dC5wcm90b3R5cGUsICdoZWlnaHQnLCB7XHJcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmRpcnR5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gIHRoaXMuc2NhbGUueSAqIHRoaXMudGV4dHVyZS5mcmFtZS5oZWlnaHQ7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUueSA9IHZhbHVlIC8gdGhpcy50ZXh0dXJlLmZyYW1lLmhlaWdodDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcclxuICAgIH1cclxufSk7XHJcblxyXG5UaW55LlRleHQucHJvdG90eXBlLnNldFN0eWxlID0gZnVuY3Rpb24oc3R5bGUpXHJcbntcclxuICAgIHN0eWxlID0gc3R5bGUgfHwge307XHJcbiAgICBzdHlsZS5mb250ID0gc3R5bGUuZm9udCB8fCAnYm9sZCAyMHB0IEFyaWFsJztcclxuICAgIHN0eWxlLmZpbGwgPSBzdHlsZS5maWxsIHx8ICdibGFjayc7XHJcbiAgICBzdHlsZS5hbGlnbiA9IHN0eWxlLmFsaWduIHx8ICdsZWZ0JztcclxuICAgIHN0eWxlLnN0cm9rZSA9IHN0eWxlLnN0cm9rZSB8fCAnYmxhY2snO1xyXG4gICAgc3R5bGUuc3Ryb2tlVGhpY2tuZXNzID0gc3R5bGUuc3Ryb2tlVGhpY2tuZXNzIHx8IDA7XHJcbiAgICBzdHlsZS53b3JkV3JhcCA9IHN0eWxlLndvcmRXcmFwIHx8IGZhbHNlO1xyXG4gICAgc3R5bGUubGluZVNwYWNpbmcgPSBzdHlsZS5saW5lU3BhY2luZyB8fCAwXHJcbiAgICBzdHlsZS53b3JkV3JhcFdpZHRoID0gc3R5bGUud29yZFdyYXBXaWR0aCAhPT0gdW5kZWZpbmVkID8gc3R5bGUud29yZFdyYXBXaWR0aCA6IDEwMDtcclxuICAgIFxyXG4gICAgc3R5bGUuZHJvcFNoYWRvdyA9IHN0eWxlLmRyb3BTaGFkb3cgfHwgZmFsc2U7XHJcbiAgICBzdHlsZS5kcm9wU2hhZG93QW5nbGUgPSBzdHlsZS5kcm9wU2hhZG93QW5nbGUgIT09IHVuZGVmaW5lZCA/IHN0eWxlLmRyb3BTaGFkb3dBbmdsZSA6IE1hdGguUEkgLyA2O1xyXG4gICAgc3R5bGUuZHJvcFNoYWRvd0Rpc3RhbmNlID0gc3R5bGUuZHJvcFNoYWRvd0Rpc3RhbmNlICE9PSB1bmRlZmluZWQgPyBzdHlsZS5kcm9wU2hhZG93RGlzdGFuY2UgOiA0O1xyXG4gICAgc3R5bGUuZHJvcFNoYWRvd0NvbG9yID0gc3R5bGUuZHJvcFNoYWRvd0NvbG9yIHx8ICdibGFjayc7XHJcblxyXG4gICAgdGhpcy5zdHlsZSA9IHN0eWxlO1xyXG4gICAgdGhpcy5kaXJ0eSA9IHRydWU7XHJcbn07XHJcblxyXG5UaW55LlRleHQucHJvdG90eXBlLnNldFRleHQgPSBmdW5jdGlvbih0ZXh0KVxyXG57XHJcbiAgICB0aGlzLnRleHQgPSB0ZXh0LnRvU3RyaW5nKCkgfHwgJyAnO1xyXG4gICAgdGhpcy5kaXJ0eSA9IHRydWU7XHJcbn07XHJcblxyXG5UaW55LlRleHQucHJvdG90eXBlLnVwZGF0ZVRleHQgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIHRoaXMudGV4dHVyZS5yZXNvbHV0aW9uID0gdGhpcy5yZXNvbHV0aW9uO1xyXG5cclxuICAgIHRoaXMuY29udGV4dC5mb250ID0gdGhpcy5zdHlsZS5mb250O1xyXG5cclxuICAgIHZhciBvdXRwdXRUZXh0ID0gdGhpcy50ZXh0O1xyXG5cclxuICAgIC8vIHdvcmQgd3JhcFxyXG4gICAgLy8gcHJlc2VydmUgb3JpZ2luYWwgdGV4dFxyXG4gICAgaWYodGhpcy5zdHlsZS53b3JkV3JhcClvdXRwdXRUZXh0ID0gdGhpcy53b3JkV3JhcCh0aGlzLnRleHQpO1xyXG5cclxuICAgIC8vc3BsaXQgdGV4dCBpbnRvIGxpbmVzXHJcbiAgICB2YXIgbGluZXMgPSBvdXRwdXRUZXh0LnNwbGl0KC8oPzpcXHJcXG58XFxyfFxcbikvKTtcclxuXHJcbiAgICAvL2NhbGN1bGF0ZSB0ZXh0IHdpZHRoXHJcbiAgICB2YXIgbGluZVdpZHRocyA9IFtdO1xyXG4gICAgdmFyIG1heExpbmVXaWR0aCA9IDA7XHJcbiAgICB2YXIgZm9udFByb3BlcnRpZXMgPSB0aGlzLmRldGVybWluZUZvbnRQcm9wZXJ0aWVzKHRoaXMuc3R5bGUuZm9udCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBsaW5lV2lkdGggPSB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQobGluZXNbaV0pLndpZHRoO1xyXG4gICAgICAgIGxpbmVXaWR0aHNbaV0gPSBsaW5lV2lkdGg7XHJcbiAgICAgICAgbWF4TGluZVdpZHRoID0gTWF0aC5tYXgobWF4TGluZVdpZHRoLCBsaW5lV2lkdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB3aWR0aCA9IG1heExpbmVXaWR0aCArIHRoaXMuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzO1xyXG4gICAgaWYodGhpcy5zdHlsZS5kcm9wU2hhZG93KXdpZHRoICs9IHRoaXMuc3R5bGUuZHJvcFNoYWRvd0Rpc3RhbmNlO1xyXG5cclxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gKCB3aWR0aCArIHRoaXMuY29udGV4dC5saW5lV2lkdGggKSAqIHRoaXMucmVzb2x1dGlvbjtcclxuICAgIFxyXG4gICAgLy9jYWxjdWxhdGUgdGV4dCBoZWlnaHRcclxuICAgIHZhciBsaW5lSGVpZ2h0ID0gZm9udFByb3BlcnRpZXMuZm9udFNpemUgKyB0aGlzLnN0eWxlLnN0cm9rZVRoaWNrbmVzcyArIHRoaXMuc3R5bGUubGluZVNwYWNpbmc7XHJcbiBcclxuICAgIHZhciBoZWlnaHQgPSBsaW5lSGVpZ2h0ICogbGluZXMubGVuZ3RoO1xyXG4gICAgaWYodGhpcy5zdHlsZS5kcm9wU2hhZG93KWhlaWdodCArPSB0aGlzLnN0eWxlLmRyb3BTaGFkb3dEaXN0YW5jZTtcclxuXHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSAoaGVpZ2h0IC0gdGhpcy5zdHlsZS5saW5lU3BhY2luZykgKiB0aGlzLnJlc29sdXRpb247XHJcblxyXG4gICAgdGhpcy5jb250ZXh0LnNjYWxlKCB0aGlzLnJlc29sdXRpb24sIHRoaXMucmVzb2x1dGlvbik7XHJcblxyXG4gICAgaWYobmF2aWdhdG9yLmlzQ29jb29uSlMpIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwwLHRoaXMuY2FudmFzLndpZHRoLHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICBcclxuICAgIC8vIHVzZWQgZm9yIGRlYnVnZ2luZy4uXHJcbiAgICAvL3RoaXMuY29udGV4dC5maWxsU3R5bGUgPVwiI0ZGMDAwMFwiXHJcbiAgICAvL3RoaXMuY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCx0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgIHRoaXMuY29udGV4dC5mb250ID0gdGhpcy5zdHlsZS5mb250O1xyXG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5zdHlsZS5zdHJva2U7XHJcbiAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3M7XHJcbiAgICB0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lID0gJ2FscGhhYmV0aWMnO1xyXG4gICAgdGhpcy5jb250ZXh0Lm1pdGVyTGltaXQgPSAyO1xyXG5cclxuICAgIC8vdGhpcy5jb250ZXh0LmxpbmVKb2luID0gJ3JvdW5kJztcclxuXHJcbiAgICB2YXIgbGluZVBvc2l0aW9uWDtcclxuICAgIHZhciBsaW5lUG9zaXRpb25ZO1xyXG5cclxuICAgIGlmKHRoaXMuc3R5bGUuZHJvcFNoYWRvdylcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5zdHlsZS5kcm9wU2hhZG93Q29sb3I7XHJcblxyXG4gICAgICAgIHZhciB4U2hhZG93T2Zmc2V0ID0gTWF0aC5zaW4odGhpcy5zdHlsZS5kcm9wU2hhZG93QW5nbGUpICogdGhpcy5zdHlsZS5kcm9wU2hhZG93RGlzdGFuY2U7XHJcbiAgICAgICAgdmFyIHlTaGFkb3dPZmZzZXQgPSBNYXRoLmNvcyh0aGlzLnN0eWxlLmRyb3BTaGFkb3dBbmdsZSkgKiB0aGlzLnN0eWxlLmRyb3BTaGFkb3dEaXN0YW5jZTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGluZVBvc2l0aW9uWCA9IHRoaXMuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzIC8gMjtcclxuICAgICAgICAgICAgbGluZVBvc2l0aW9uWSA9ICh0aGlzLnN0eWxlLnN0cm9rZVRoaWNrbmVzcyAvIDIgKyBpICogbGluZUhlaWdodCkgKyBmb250UHJvcGVydGllcy5hc2NlbnQ7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLnN0eWxlLmFsaWduID09PSAncmlnaHQnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsaW5lUG9zaXRpb25YICs9IG1heExpbmVXaWR0aCAtIGxpbmVXaWR0aHNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLnN0eWxlLmFsaWduID09PSAnY2VudGVyJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGluZVBvc2l0aW9uWCArPSAobWF4TGluZVdpZHRoIC0gbGluZVdpZHRoc1tpXSkgLyAyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLnN0eWxlLmZpbGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChsaW5lc1tpXSwgbGluZVBvc2l0aW9uWCArIHhTaGFkb3dPZmZzZXQsIGxpbmVQb3NpdGlvblkgKyB5U2hhZG93T2Zmc2V0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vICBpZihkcm9wU2hhZG93KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL3NldCBjYW52YXMgdGV4dCBzdHlsZXNcclxuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLnN0eWxlLmZpbGw7XHJcbiAgICBcclxuICAgIC8vZHJhdyBsaW5lcyBsaW5lIGJ5IGxpbmVcclxuICAgIGZvciAoaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICBsaW5lUG9zaXRpb25YID0gdGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3MgLyAyO1xyXG4gICAgICAgIGxpbmVQb3NpdGlvblkgPSAodGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3MgLyAyICsgaSAqIGxpbmVIZWlnaHQpICsgZm9udFByb3BlcnRpZXMuYXNjZW50O1xyXG5cclxuICAgICAgICBpZih0aGlzLnN0eWxlLmFsaWduID09PSAncmlnaHQnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGluZVBvc2l0aW9uWCArPSBtYXhMaW5lV2lkdGggLSBsaW5lV2lkdGhzW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuc3R5bGUuYWxpZ24gPT09ICdjZW50ZXInKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGluZVBvc2l0aW9uWCArPSAobWF4TGluZVdpZHRoIC0gbGluZVdpZHRoc1tpXSkgLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5zdHlsZS5zdHJva2UgJiYgdGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlVGV4dChsaW5lc1tpXSwgbGluZVBvc2l0aW9uWCwgbGluZVBvc2l0aW9uWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnN0eWxlLmZpbGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQobGluZXNbaV0sIGxpbmVQb3NpdGlvblgsIGxpbmVQb3NpdGlvblkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vICBpZihkcm9wU2hhZG93KVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlVGV4dHVyZSgpO1xyXG59O1xyXG5cclxuVGlueS5UZXh0LnByb3RvdHlwZS51cGRhdGVUZXh0dXJlID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLnRleHR1cmUud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcclxuICAgIHRoaXMudGV4dHVyZS5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICB0aGlzLnRleHR1cmUuY3JvcC53aWR0aCA9IHRoaXMudGV4dHVyZS5mcmFtZS53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy50ZXh0dXJlLmNyb3AuaGVpZ2h0ID0gdGhpcy50ZXh0dXJlLmZyYW1lLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxuXHJcbiAgICB0aGlzLl93aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG59O1xyXG5cclxuVGlueS5UZXh0LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihyZW5kZXJTZXNzaW9uKVxyXG57XHJcbiAgICBpZih0aGlzLmRpcnR5KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucmVzb2x1dGlvbiA9IHJlbmRlclNlc3Npb24ucmVzb2x1dGlvbjtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KCk7XHJcbiAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgIFxyXG4gICAgVGlueS5TcHJpdGUucHJvdG90eXBlLnJlbmRlci5jYWxsKHRoaXMsIHJlbmRlclNlc3Npb24pO1xyXG59O1xyXG5cclxuVGlueS5UZXh0LnByb3RvdHlwZS5kZXRlcm1pbmVGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uKGZvbnRTdHlsZSlcclxue1xyXG4gICAgdmFyIHByb3BlcnRpZXMgPSBUaW55LlRleHQuZm9udFByb3BlcnRpZXNDYWNoZVtmb250U3R5bGVdO1xyXG5cclxuICAgIGlmKCFwcm9wZXJ0aWVzKVxyXG4gICAge1xyXG4gICAgICAgIHByb3BlcnRpZXMgPSB7fTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgY2FudmFzID0gVGlueS5UZXh0LmZvbnRQcm9wZXJ0aWVzQ2FudmFzO1xyXG4gICAgICAgIHZhciBjb250ZXh0ID0gVGlueS5UZXh0LmZvbnRQcm9wZXJ0aWVzQ29udGV4dDtcclxuXHJcbiAgICAgICAgY29udGV4dC5mb250ID0gZm9udFN0eWxlO1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBNYXRoLmNlaWwoY29udGV4dC5tZWFzdXJlVGV4dCgnfE3DiXEnKS53aWR0aCk7XHJcbiAgICAgICAgdmFyIGJhc2VsaW5lID0gTWF0aC5jZWlsKGNvbnRleHQubWVhc3VyZVRleHQoJ3xNw4lxJykud2lkdGgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSAyICogYmFzZWxpbmU7XHJcblxyXG4gICAgICAgIGJhc2VsaW5lID0gYmFzZWxpbmUgKiAxLjQgfCAwO1xyXG5cclxuICAgICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZjAwJztcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZvbnQgPSBmb250U3R5bGU7XHJcblxyXG4gICAgICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ2FscGhhYmV0aWMnO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyMwMDAnO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQoJ3xNw4lxJywgMCwgYmFzZWxpbmUpO1xyXG5cclxuICAgICAgICB2YXIgaW1hZ2VkYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCkuZGF0YTtcclxuICAgICAgICB2YXIgcGl4ZWxzID0gaW1hZ2VkYXRhLmxlbmd0aDtcclxuICAgICAgICB2YXIgbGluZSA9IHdpZHRoICogNDtcclxuXHJcbiAgICAgICAgdmFyIGksIGo7XHJcblxyXG4gICAgICAgIHZhciBpZHggPSAwO1xyXG4gICAgICAgIHZhciBzdG9wID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIGFzY2VudC4gc2NhbiBmcm9tIHRvcCB0byBib3R0b20gdW50aWwgd2UgZmluZCBhIG5vbiByZWQgcGl4ZWxcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCBiYXNlbGluZTsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgbGluZTsgaiArPSA0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihpbWFnZWRhdGFbaWR4ICsgal0gIT09IDI1NSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdG9wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZighc3RvcClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWR4ICs9IGxpbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvcGVydGllcy5hc2NlbnQgPSBiYXNlbGluZSAtIGk7XHJcblxyXG4gICAgICAgIGlkeCA9IHBpeGVscyAtIGxpbmU7XHJcbiAgICAgICAgc3RvcCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLyBkZXNjZW50LiBzY2FuIGZyb20gYm90dG9tIHRvIHRvcCB1bnRpbCB3ZSBmaW5kIGEgbm9uIHJlZCBwaXhlbFxyXG4gICAgICAgIGZvcihpID0gaGVpZ2h0OyBpID4gYmFzZWxpbmU7IGktLSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8IGxpbmU7IGogKz0gNClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoaW1hZ2VkYXRhW2lkeCArIGpdICE9PSAyNTUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoIXN0b3ApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkeCAtPSBsaW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3BlcnRpZXMuZGVzY2VudCA9IGkgLSBiYXNlbGluZTtcclxuICAgICAgICAvL1RPRE8gbWlnaHQgbmVlZCBhIHR3ZWFrLiBraW5kIG9mIGEgdGVtcCBmaXghXHJcbiAgICAgICAgcHJvcGVydGllcy5kZXNjZW50ICs9IDY7XHJcbiAgICAgICAgcHJvcGVydGllcy5mb250U2l6ZSA9IHByb3BlcnRpZXMuYXNjZW50ICsgcHJvcGVydGllcy5kZXNjZW50O1xyXG5cclxuICAgICAgICBUaW55LlRleHQuZm9udFByb3BlcnRpZXNDYWNoZVtmb250U3R5bGVdID0gcHJvcGVydGllcztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJvcGVydGllcztcclxufTtcclxuXHJcblRpbnkuVGV4dC5wcm90b3R5cGUud29yZFdyYXAgPSBmdW5jdGlvbih0ZXh0KVxyXG57XHJcbiAgICAvLyBHcmVlZHkgd3JhcHBpbmcgYWxnb3JpdGhtIHRoYXQgd2lsbCB3cmFwIHdvcmRzIGFzIHRoZSBsaW5lIGdyb3dzIGxvbmdlclxyXG4gICAgLy8gdGhhbiBpdHMgaG9yaXpvbnRhbCBib3VuZHMuXHJcbiAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICB2YXIgbGluZXMgPSB0ZXh0LnNwbGl0KCdcXG4nKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNwYWNlTGVmdCA9IHRoaXMuc3R5bGUud29yZFdyYXBXaWR0aDtcclxuICAgICAgICB2YXIgd29yZHMgPSBsaW5lc1tpXS5zcGxpdCgnICcpO1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgd29yZHMubGVuZ3RoOyBqKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgd29yZFdpZHRoID0gdGhpcy5jb250ZXh0Lm1lYXN1cmVUZXh0KHdvcmRzW2pdKS53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHdvcmRXaWR0aFdpdGhTcGFjZSA9IHdvcmRXaWR0aCArIHRoaXMuY29udGV4dC5tZWFzdXJlVGV4dCgnICcpLndpZHRoO1xyXG4gICAgICAgICAgICBpZihqID09PSAwIHx8IHdvcmRXaWR0aFdpdGhTcGFjZSA+IHNwYWNlTGVmdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gU2tpcCBwcmludGluZyB0aGUgbmV3bGluZSBpZiBpdCdzIHRoZSBmaXJzdCB3b3JkIG9mIHRoZSBsaW5lIHRoYXQgaXNcclxuICAgICAgICAgICAgICAgIC8vIGdyZWF0ZXIgdGhhbiB0aGUgd29yZCB3cmFwIHdpZHRoLlxyXG4gICAgICAgICAgICAgICAgaWYoaiA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICdcXG4nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IHdvcmRzW2pdO1xyXG4gICAgICAgICAgICAgICAgc3BhY2VMZWZ0ID0gdGhpcy5zdHlsZS53b3JkV3JhcFdpZHRoIC0gd29yZFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VMZWZ0IC09IHdvcmRXaWR0aFdpdGhTcGFjZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnICcgKyB3b3Jkc1tqXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGkgPCBsaW5lcy5sZW5ndGgtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSAnXFxuJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuVGlueS5UZXh0LnByb3RvdHlwZS5nZXRCb3VuZHMgPSBmdW5jdGlvbihtYXRyaXgpXHJcbntcclxuICAgIGlmKHRoaXMuZGlydHkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KCk7XHJcbiAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBUaW55LlNwcml0ZS5wcm90b3R5cGUuZ2V0Qm91bmRzLmNhbGwodGhpcywgbWF0cml4KTtcclxufTtcclxuXHJcblRpbnkuVGV4dC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgLy8gbWFrZSBzdXJlIHRvIHJlc2V0IHRoZSB0aGUgY29udGV4dCBhbmQgY2FudmFzLi4gZG9udCB3YW50IHRoaXMgaGFuZ2luZyBhcm91bmQgaW4gbWVtb3J5IVxyXG4gICAgdGhpcy5jb250ZXh0ID0gbnVsbDtcclxuICAgIHRoaXMuY2FudmFzID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLnRleHR1cmUuZGVzdHJveSgpO1xyXG5cclxuICAgIFRpbnkuU3ByaXRlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7XHJcbn07XHJcblxyXG5UaW55LlRleHQuZm9udFByb3BlcnRpZXNDYWNoZSA9IHt9O1xyXG5UaW55LlRleHQuZm9udFByb3BlcnRpZXNDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuVGlueS5UZXh0LmZvbnRQcm9wZXJ0aWVzQ29udGV4dCA9IFRpbnkuVGV4dC5mb250UHJvcGVydGllc0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpOyIsIlxyXG5UaW55LkNhbnZhc1JlbmRlcmVyID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgb3B0aW9ucylcclxueyAgIFxyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cclxuXHJcbiAgICB0aGlzLnJlc29sdXRpb24gPSAob3B0aW9ucy5yZXNvbHV0aW9uICE9IHVuZGVmaW5lZCA/IG9wdGlvbnMucmVzb2x1dGlvbiA6IDEpO1xyXG5cclxuICAgIHRoaXMuY2xlYXJCZWZvcmVSZW5kZXIgPSAob3B0aW9ucy5jbGVhckJlZm9yZVJlbmRlciAhPSB1bmRlZmluZWQgPyBvcHRpb25zLmNsZWFyQmVmb3JlUmVuZGVyIDogdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy50cmFuc3BhcmVudCA9IChvcHRpb25zLnRyYW5zcGFyZW50ICE9IHVuZGVmaW5lZCA/IG9wdGlvbnMudHJhbnNwYXJlbnQgOiBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5hdXRvUmVzaXplID0gb3B0aW9ucy5hdXRvUmVzaXplIHx8IGZhbHNlO1xyXG5cclxuICAgIC8vIHRoaXMud2lkdGggPSB3aWR0aCB8fCA4MDA7XHJcbiAgICAvLyB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCA2MDA7XHJcblxyXG4gICAgLy8gdGhpcy53aWR0aCAqPSB0aGlzLnJlc29sdXRpb247XHJcbiAgICAvLyB0aGlzLmhlaWdodCAqPSB0aGlzLnJlc29sdXRpb247XHJcblxyXG4gICAgaWYgKCFUaW55LmRlZmF1bHRSZW5kZXJlcikgVGlueS5kZWZhdWx0UmVuZGVyZXIgPSB0aGlzO1xyXG5cclxuICAgIHZhciB2aWV3ID0gdGhpcy5kb21FbGVtZW50ID0gb3B0aW9ucy5kb21FbGVtZW50IHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiY2FudmFzXCIgKTtcclxuXHJcbiAgICB0aGlzLmNvbnRleHQgPSB2aWV3LmdldENvbnRleHQoIFwiMmRcIiwgeyBhbHBoYTogdGhpcy50cmFuc3BhcmVudCB9ICk7XHJcblxyXG4gICAgLy8gdmlldy53aWR0aCA9IHRoaXMud2lkdGggKiB0aGlzLnJlc29sdXRpb247XHJcbiAgICAvLyB2aWV3LmhlaWdodCA9IHRoaXMuaGVpZ2h0ICogdGhpcy5yZXNvbHV0aW9uO1xyXG5cclxuICAgIHRoaXMuc2V0U2l6ZSh3aWR0aCB8fCA4MDAsIGhlaWdodCB8fCA2MDApO1xyXG5cclxuICAgIHRoaXMuc2V0Q2xlYXJDb2xvcihcIiNmZmZmZmZcIik7XHJcblxyXG4gICAgaWYgKFRpbnkuQ2FudmFzTWFza01hbmFnZXIpXHJcbiAgICAgICAgdGhpcy5tYXNrTWFuYWdlciA9IG5ldyBUaW55LkNhbnZhc01hc2tNYW5hZ2VyKCk7XHJcblxyXG4gICAgdGhpcy5yZW5kZXJTZXNzaW9uID0ge1xyXG4gICAgICAgIGNvbnRleHQ6IHRoaXMuY29udGV4dCxcclxuICAgICAgICBtYXNrTWFuYWdlcjogdGhpcy5tYXNrTWFuYWdlcixcclxuICAgICAgICBzbW9vdGhQcm9wZXJ0eTogbnVsbCxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0cnVlIFBpeGkgd2lsbCBNYXRoLmZsb29yKCkgeC95IHZhbHVlcyB3aGVuIHJlbmRlcmluZywgc3RvcHBpbmcgcGl4ZWwgaW50ZXJwb2xhdGlvbi5cclxuICAgICAgICAgKiBIYW5keSBmb3IgY3Jpc3AgcGl4ZWwgYXJ0IGFuZCBzcGVlZCBvbiBsZWdhY3kgZGV2aWNlcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJvdW5kUGl4ZWxzOiBmYWxzZVxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgaWYoXCJpbWFnZVNtb290aGluZ0VuYWJsZWRcIiBpbiB0aGlzLmNvbnRleHQpXHJcbiAgICAgICAgdGhpcy5yZW5kZXJTZXNzaW9uLnNtb290aFByb3BlcnR5ID0gXCJpbWFnZVNtb290aGluZ0VuYWJsZWRcIjtcclxuICAgIGVsc2UgaWYoXCJ3ZWJraXRJbWFnZVNtb290aGluZ0VuYWJsZWRcIiBpbiB0aGlzLmNvbnRleHQpXHJcbiAgICAgICAgdGhpcy5yZW5kZXJTZXNzaW9uLnNtb290aFByb3BlcnR5ID0gXCJ3ZWJraXRJbWFnZVNtb290aGluZ0VuYWJsZWRcIjtcclxuICAgIGVsc2UgaWYoXCJtb3pJbWFnZVNtb290aGluZ0VuYWJsZWRcIiBpbiB0aGlzLmNvbnRleHQpXHJcbiAgICAgICAgdGhpcy5yZW5kZXJTZXNzaW9uLnNtb290aFByb3BlcnR5ID0gXCJtb3pJbWFnZVNtb290aGluZ0VuYWJsZWRcIjtcclxuICAgIGVsc2UgaWYoXCJvSW1hZ2VTbW9vdGhpbmdFbmFibGVkXCIgaW4gdGhpcy5jb250ZXh0KVxyXG4gICAgICAgIHRoaXMucmVuZGVyU2Vzc2lvbi5zbW9vdGhQcm9wZXJ0eSA9IFwib0ltYWdlU21vb3RoaW5nRW5hYmxlZFwiO1xyXG4gICAgZWxzZSBpZiAoXCJtc0ltYWdlU21vb3RoaW5nRW5hYmxlZFwiIGluIHRoaXMuY29udGV4dClcclxuICAgICAgICB0aGlzLnJlbmRlclNlc3Npb24uc21vb3RoUHJvcGVydHkgPSBcIm1zSW1hZ2VTbW9vdGhpbmdFbmFibGVkXCI7XHJcbn07XHJcblxyXG5UaW55LkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRpbnkuQ2FudmFzUmVuZGVyZXI7XHJcblxyXG5UaW55LkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5zZXRDbGVhckNvbG9yID0gZnVuY3Rpb24oY29sb3IpXHJcbnsgICBcclxuICAgIHRoaXMuY2xlYXJDb2xvciA9IGNvbG9yO1xyXG4gICAgXHJcbiAgICAvLyBpZiAoY29sb3IgPT09IG51bGwpIHtcclxuICAgIC8vICAgICB0aGlzLmNsZWFyQ29sb3IgPSBudWxsO1xyXG4gICAgLy8gICAgIHJldHVybjtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyB0aGlzLmNsZWFyQ29sb3IgPSBjb2xvciB8fCAweDAwMDAwMDtcclxuICAgIC8vIC8vIHRoaXMuYmFja2dyb3VuZENvbG9yU3BsaXQgPSBUaW55LmhleDJyZ2IodGhpcy5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgLy8gdmFyIGhleCA9IHRoaXMuY2xlYXJDb2xvci50b1N0cmluZygxNik7XHJcbiAgICAvLyBoZXggPSAnMDAwMDAwJy5zdWJzdHIoMCwgNiAtIGhleC5sZW5ndGgpICsgaGV4O1xyXG4gICAgLy8gdGhpcy5fY2xlYXJDb2xvciA9ICcjJyArIGhleDtcclxuXHJcbn07XHJcblxyXG4vLyBUaW55LkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5zZXRQaXhlbEFydCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuLy8gICAgIHZhciBjYW52YXMgPSB0aGlzLmRvbUVsZW1lbnQ7XHJcbiAgICBcclxuLy8gICAgIHZhciB0eXBlcyA9IFsgJ29wdGltaXplU3BlZWQnLCAnLW1vei1jcmlzcC1lZGdlcycsICctby1jcmlzcC1lZGdlcycsICctd2Via2l0LW9wdGltaXplLWNvbnRyYXN0JywgJ29wdGltaXplLWNvbnRyYXN0JywgJ2NyaXNwLWVkZ2VzJywgJ3BpeGVsYXRlZCcgXTtcclxuXHJcbi8vICAgICB0eXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKVxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIGNhbnZhcy5zdHlsZVsnaW1hZ2UtcmVuZGVyaW5nJ10gPSB0eXBlO1xyXG4vLyAgICAgfSk7XHJcblxyXG4vLyAgICAgY2FudmFzLnN0eWxlLm1zSW50ZXJwb2xhdGlvbk1vZGUgPSAnbmVhcmVzdC1uZWlnaGJvcic7XHJcbi8vICAgICB0aGlzLnJlbmRlclNlc3Npb24ucm91bmRQaXhlbHMgPSB0cnVlO1xyXG4vLyB9XHJcblxyXG5UaW55LkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihzY2VuZSlcclxue1xyXG4gICAgXHJcbiAgICB0aGlzLmNvbnRleHQuc2V0VHJhbnNmb3JtKDEsMCwwLDEsMCwwKTtcclxuXHJcbiAgICB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSAxO1xyXG5cclxuICAgIHRoaXMucmVuZGVyU2Vzc2lvbi5jdXJyZW50QmxlbmRNb2RlID0gXCJzb3VyY2Utb3ZlclwiO1xyXG4gICAgdGhpcy5jb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwic291cmNlLW92ZXJcIjtcclxuXHJcbiAgICBpZiAobmF2aWdhdG9yLmlzQ29jb29uSlMgJiYgdGhpcy5kb21FbGVtZW50LnNjcmVlbmNhbnZhcylcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5jbGVhckJlZm9yZVJlbmRlcilcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy50cmFuc3BhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCAqIHRoaXMucmVzb2x1dGlvbiwgdGhpcy5oZWlnaHQgKiB0aGlzLnJlc29sdXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5jbGVhckNvbG9yO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCAqIHRoaXMucmVzb2x1dGlvbiwgdGhpcy5oZWlnaHQgKiB0aGlzLnJlc29sdXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy5yZW5kZXJPYmplY3Qoc2NlbmUpO1xyXG5cclxufTtcclxuXHJcblRpbnkuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihyZW1vdmVWaWV3KVxyXG57ICAgXHJcbiAgICBpZiAodHlwZW9mIHJlbW92ZVZpZXcgPT09IFwidW5kZWZpbmVkXCIpIHsgcmVtb3ZlVmlldyA9IHRydWU7IH1cclxuXHJcbiAgICBpZiAocmVtb3ZlVmlldyAmJiB0aGlzLmRvbUVsZW1lbnQucGFyZW50Tm9kZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmRvbUVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZG9tRWxlbWVudCA9IG51bGw7XHJcbiAgICB0aGlzLmNvbnRleHQgPSBudWxsO1xyXG4gICAgdGhpcy5tYXNrTWFuYWdlciA9IG51bGw7XHJcbiAgICB0aGlzLnJlbmRlclNlc3Npb24gPSBudWxsO1xyXG5cclxuICAgIGlmIChUaW55LmRlZmF1bHRSZW5kZXJlciA9PT0gdGhpcykgVGlueS5kZWZhdWx0UmVuZGVyZXIgPSBudWxsO1xyXG5cclxufTtcclxuXHJcblRpbnkuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KVxyXG57XHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICB2YXIgdmlldyA9IHRoaXMuZG9tRWxlbWVudDtcclxuXHJcbiAgICB2aWV3LndpZHRoID0gTWF0aC5mbG9vcih0aGlzLndpZHRoICogdGhpcy5yZXNvbHV0aW9uKTtcclxuICAgIHZpZXcuaGVpZ2h0ID0gTWF0aC5mbG9vcih0aGlzLmhlaWdodCAqIHRoaXMucmVzb2x1dGlvbik7XHJcblxyXG4gICAgaWYgKHRoaXMuYXV0b1Jlc2l6ZSkge1xyXG4gICAgICAgIHZpZXcuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcclxuICAgICAgICB2aWV3LnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcclxuICAgIH1cclxufTtcclxuXHJcblRpbnkuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLnNldFBpeGVsUmF0aW8gPSBmdW5jdGlvbihyZXNvbHV0aW9uKVxyXG57XHJcbiAgICB0aGlzLnJlc29sdXRpb24gPSByZXNvbHV0aW9uO1xyXG5cclxuICAgIHZhciB2aWV3ID0gdGhpcy5kb21FbGVtZW50O1xyXG5cclxuICAgIHZpZXcud2lkdGggPSBNYXRoLmZsb29yKHRoaXMud2lkdGggKiB0aGlzLnJlc29sdXRpb24pO1xyXG4gICAgdmlldy5oZWlnaHQgPSBNYXRoLmZsb29yKHRoaXMuaGVpZ2h0ICogdGhpcy5yZXNvbHV0aW9uKTtcclxufTtcclxuXHJcblRpbnkuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlck9iamVjdCA9IGZ1bmN0aW9uKGRpc3BsYXlPYmplY3QsIGNvbnRleHQpXHJcbntcclxuICAgIGRpc3BsYXlPYmplY3QudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgICB0aGlzLnJlbmRlclNlc3Npb24uY29udGV4dCA9IGNvbnRleHQgfHwgdGhpcy5jb250ZXh0O1xyXG4gICAgdGhpcy5yZW5kZXJTZXNzaW9uLnJlc29sdXRpb24gPSB0aGlzLnJlc29sdXRpb247XHJcbiAgICBkaXNwbGF5T2JqZWN0LnJlbmRlcih0aGlzLnJlbmRlclNlc3Npb24pO1xyXG59OyIsInZhciBsaXN0ZW5pbmdUb1RvdWNoRXZlbnRzO1xyXG5cclxuVGlueS5JbnB1dCA9IGZ1bmN0aW9uKGdhbWUpXHJcbntcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB2YXIgdmlldyA9IHRoaXMuZG9tRWxlbWVudCA9IGdhbWUuaW5wdXRWaWV3O1xyXG5cclxuICAgIHRoaXMuYm91bmRzID0ge3g6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDB9O1xyXG4gICAgdGhpcy5jYW5kaWRhdGVzID0gW107XHJcbiAgICB0aGlzLmxpc3QgPSBbXTtcclxuXHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gbnVsbDtcclxuICAgIHRoaXMuaXNEb3duID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5kb3duSGFuZGxlciA9IHRoaXMuZG93bkhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubW92ZUhhbmRsZXIgPSB0aGlzLm1vdmVIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnVwSGFuZGxlciA9IHRoaXMudXBIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAvLyB0aGlzLmNsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHZpZXcuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuZG93bkhhbmRsZXIpO1xyXG4gICAgdmlldy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm1vdmVIYW5kbGVyKTtcclxuICAgIHZpZXcuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLnVwSGFuZGxlcik7XHJcbiAgICB2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy51cEhhbmRsZXIpO1xyXG5cclxuICAgIC8vIHZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcblxyXG4gICAgdmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmRvd25IYW5kbGVyKTtcclxuICAgIHZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3ZlSGFuZGxlcik7XHJcbiAgICB2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnVwSGFuZGxlcik7XHJcblxyXG4gICAgVGlueS5FdmVudEVtaXR0ZXIubWl4aW4odGhpcyk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBUaW55LklucHV0LnN5c3RlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBUaW55LklucHV0LnN5c3RlbXNbaV0uaW5pdC5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlQm91bmRzKCk7XHJcbn07XHJcblxyXG5UaW55LklucHV0LnByb3RvdHlwZSA9IHtcclxuXHJcblxyXG4gICAgYWRkOiBmdW5jdGlvbihvYmplY3QsIG9wdGlvbnMpIHtcclxuICAgICAgICBvYmplY3QuaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgb3B0aW9ucy5zeXN0ZW0gPSB0aGlzO1xyXG5cclxuICAgICAgICBvYmplY3QuaW5wdXQgPSBvcHRpb25zO1xyXG5cclxuICAgICAgICBUaW55LkV2ZW50RW1pdHRlci5taXhpbihvYmplY3QuaW5wdXQpXHJcblxyXG4gICAgICAgIHRoaXMubGlzdC5wdXNoKG9iamVjdCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbW92ZTogZnVuY3Rpb24ob2JqZWN0KSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5saXN0LmluZGV4T2Yob2JqZWN0KTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgdmFyIHJlbW92ZWQgPSB0aGlzLmxpc3RbaW5kZXhdO1xyXG4gICAgICAgICAgICByZW1vdmVkLmlucHV0ID0gbnVsbDtcclxuICAgICAgICAgICAgcmVtb3ZlZC5pbnB1dEVuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbnB1dEhhbmRsZXI6IGZ1bmN0aW9uKG5hbWUsIGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG5hbWUpXHJcbiAgICAgICAgdmFyIGNvb3JkcyA9IHRoaXMuZ2V0Q29vcmRzKGV2ZW50KTtcclxuXHJcbiAgICAgICAgaWYgKGNvb3JkcyAhPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lICE9IFwibW92ZVwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbmRpZGF0ZXMubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IFRpbnkuSW5wdXQuc3lzdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIFRpbnkuSW5wdXQuc3lzdGVtc1tpXS5wcmVIYW5kbGUuY2FsbCh0aGlzLCBjb29yZHMueCwgY29vcmRzLnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpc0dvb2QsIG9iajtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRoaXMubGlzdC5sZW5ndGg7IHQrKykgXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gdGhpcy5saXN0W3RdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW9iai5pbnB1dEVuYWJsZWQgfHwgIW9iai5wYXJlbnQpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmlucHV0LmNoZWNrQm91bmRzKSBpc0dvb2QgPSBvYmouaW5wdXQuY2hlY2tCb3VuZHMuY2FsbCh0aGlzLCBvYmosIGNvb3Jkcy54LCBjb29yZHMueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpc0dvb2QgPSBUaW55LklucHV0LmNoZWNrQm91bmRzLmNhbGwodGhpcywgb2JqLCBjb29yZHMueCwgY29vcmRzLnkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNHb29kKSB0aGlzLmNhbmRpZGF0ZXMucHVzaChvYmopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vdmFyIGkgPSB0aGlzLmNhbmRpZGF0ZXMubGVuZ3RoXHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuY2FuZGlkYXRlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0gdGhpcy5jYW5kaWRhdGVzW2ldXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmlucHV0W1wibGFzdF9cIiArIG5hbWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBjb29yZHMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogY29vcmRzLnlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9iai5pbnB1dC5lbWl0KG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBjb29yZHMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogY29vcmRzLnlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZSA9PSBcInVwXCIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSBvYmouaW5wdXRbXCJsYXN0X2Rvd25cIl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvaW50ICYmIFRpbnkuTWF0aC5kaXN0YW5jZShwb2ludC54LCBwb2ludC55LCBjb29yZHMueCwgY29vcmRzLnkpIDwgMzApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaW5wdXQuZW1pdChcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogY29vcmRzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogY29vcmRzLnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW9iai5pbnB1dC50cmFuc3BhcmVudCkgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICB2YXIgb2JqID0gdGhpcy5jYW5kaWRhdGVzW2kgLSAxXVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIG9iai5pbnB1dFtcImxhc3RfXCIgKyBuYW1lXSA9IHt4OiBjb29yZHMueCwgeTogY29vcmRzLnl9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gICAgIG9iai5pbnB1dC5lbWl0KG5hbWUsIHt4OiBjb29yZHMueCwgeTogY29vcmRzLnl9KVxyXG5cclxuICAgICAgICAgICAgICAgIC8vICAgICBpZiAobmFtZSA9PSBcInVwXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgdmFyIHBvaW50ID0gb2JqLmlucHV0W1wibGFzdF9kb3duXCJdXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmIChwb2ludCAmJiBUaW55Lk1hdGguZGlzdGFuY2UocG9pbnQueCwgcG9pbnQueSwgY29vcmRzLngsIGNvb3Jkcy55KSA8IDMwKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgb2JqLmlucHV0LmVtaXQoXCJjbGlja1wiLCB7eDogY29vcmRzLngsIHk6IGNvb3Jkcy55fSlcclxuICAgICAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZW1pdChuYW1lLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4OiBjb29yZHMueCxcclxuICAgICAgICAgICAgICAgIHk6IGNvb3Jkcy55XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW92ZUhhbmRsZXI6IGZ1bmN0aW9uKGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubGFzdE1vdmUgPSBldmVudDtcclxuICAgICAgICB0aGlzLmlucHV0SGFuZGxlcihcIm1vdmVcIiwgZXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cEhhbmRsZXI6IGZ1bmN0aW9uKGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaXNEb3duID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pbnB1dEhhbmRsZXIoXCJ1cFwiLCB0aGlzLmxhc3RNb3ZlKTtcclxuICAgIH0sXHJcblxyXG4gICAgZG93bkhhbmRsZXI6IGZ1bmN0aW9uKGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaXNEb3duID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmxhc3RNb3ZlID0gZXZlbnQ7XHJcbiAgICAgICAgdGhpcy5pbnB1dEhhbmRsZXIoXCJkb3duXCIsIGV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xpY2tIYW5kbGVyOiBmdW5jdGlvbihldmVudClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmlucHV0SGFuZGxlcihcImNsaWNrXCIsIGV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0Q29vcmRzOiBmdW5jdGlvbihldmVudClcclxuICAgIHtcclxuICAgICAgICB2YXIgY29vcmRzID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBUb3VjaEV2ZW50ICE9PSAndW5kZWZpbmVkJyAmJiBldmVudCBpbnN0YW5jZW9mIFRvdWNoRXZlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsaXN0ZW5pbmdUb1RvdWNoRXZlbnRzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvb3JkcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICB4OiBldmVudC50b3VjaGVzWzBdLmNsaWVudFgsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogZXZlbnQudG91Y2hlc1swXS5jbGllbnRZXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LmNsaWVudFggJiYgZXZlbnQuY2xpZW50WSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29vcmRzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IGV2ZW50LmNsaWVudFgsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogZXZlbnQuY2xpZW50WVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGxpc3RlbmluZ1RvVG91Y2hFdmVudHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBNb3VzZSBldmVudFxyXG4gICAgICAgICAgICBjb29yZHMgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBldmVudC5jbGllbnRYLFxyXG4gICAgICAgICAgICAgICAgeTogZXZlbnQuY2xpZW50WVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxpc3RlbmluZ1RvVG91Y2hFdmVudHMgJiYgZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50IHx8IGNvb3JkcyA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGNvb3JkcyA9IHtcclxuICAgICAgICAgICAgeDogKGNvb3Jkcy54IC0gdGhpcy5ib3VuZHMueCksXHJcbiAgICAgICAgICAgIHk6IChjb29yZHMueSAtIHRoaXMuYm91bmRzLnkpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBjb29yZHM7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZUJvdW5kczogZnVuY3Rpb24oKSBcclxuICAgIHtcclxuICAgICAgICBib3VuZHMgPSB0aGlzLmJvdW5kcztcclxuXHJcbiAgICAgICAgdmFyIGNsaWVudFJlY3QgPSB0aGlzLmRvbUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIGJvdW5kcy54ID0gY2xpZW50UmVjdC5sZWZ0O1xyXG4gICAgICAgIGJvdW5kcy55ID0gY2xpZW50UmVjdC50b3A7XHJcbiAgICAgICAgYm91bmRzLndpZHRoID0gY2xpZW50UmVjdC53aWR0aDtcclxuICAgICAgICBib3VuZHMuaGVpZ2h0ID0gY2xpZW50UmVjdC5oZWlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMuZG9tRWxlbWVudDtcclxuXHJcbiAgICAgICAgdmlldy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5kb3duSGFuZGxlcik7XHJcbiAgICAgICAgdmlldy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm1vdmVIYW5kbGVyKTtcclxuICAgICAgICB2aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy51cEhhbmRsZXIpO1xyXG4gICAgICAgIHZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLnVwSGFuZGxlcik7XHJcblxyXG4gICAgICAgIC8vIHZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcblxyXG4gICAgICAgIHZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5kb3duSGFuZGxlcik7XHJcbiAgICAgICAgdmlldy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdmVIYW5kbGVyKTtcclxuICAgICAgICB2aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnVwSGFuZGxlcik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55LklucHV0LmNoZWNrQm91bmRzID0gZnVuY3Rpb24ob2JqLCB4LCB5KVxyXG57XHJcbiAgICBpZiAob2JqLndvcmxkVmlzaWJsZSlcclxuICAgIHtcclxuICAgICAgICBpZiAob2JqLmdldEJvdW5kcygpLmNvbnRhaW5zKHgsIHkpKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiAob2JqLmNoaWxkcmVuICYmIG9iai5jaGlsZHJlbi5sZW5ndGggPiAwKVxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIGZvciAodmFyIHQgPSAwOyB0IDwgb2JqLmNoaWxkcmVuLmxlbmd0aDsgdCsrKSBcclxuICAgIC8vICAgICB7XHJcbiAgICAvLyAgICAgICAgIF9jaGVja09uQWN0aXZlT2JqZWN0cyhvYmouY2hpbGRyZW5bdF0sIHgsIHkpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxufVxyXG5cclxuVGlueS5JbnB1dC5zeXN0ZW1zID0gW107XHJcblxyXG5UaW55LnJlZ2lzdGVyU3lzdGVtKFwiaW5wdXRcIiwgVGlueS5JbnB1dCk7IiwiXHJcblRpbnkuQ2FjaGUgPSB7XHJcbiAgICBpbWFnZToge30sXHJcbiAgICB0ZXh0dXJlOiB7fVxyXG59O1xyXG5cclxuVGlueS5Mb2FkZXIgPSBmdW5jdGlvbihnYW1lKVxyXG57XHJcbiAgICBnYW1lLmNhY2hlID0gVGlueS5DYWNoZTtcclxuXHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgdGhpcy5saXN0ID0gW107XHJcbn07XHJcblxyXG5UaW55LkxvYWRlci5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgY2xlYXJDYWNoZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIHkgaW4gVGlueS5DYWNoZS50ZXh0dXJlKSBUaW55LkNhY2hlLnRleHR1cmVbeV0uZGVzdHJveSgpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciB5IGluIFRpbnkuQ2FjaGUpIFRpbnkuQ2FjaGVbeV0gPSB7fTtcclxuICAgIH0sXHJcblxyXG4gICAgYWxsOiBmdW5jdGlvbihhcnJheSkge1xyXG5cclxuICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmxpc3QuY29uY2F0KGFycmF5KTsgXHJcbiAgICB9LFxyXG5cclxuICAgIGltYWdlOiBmdW5jdGlvbihrZXksIHNvdXJjZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmxpc3QucHVzaChcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogc291cmNlLFxyXG4gICAgICAgICAgICBrZXk6IGtleSxcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNwcml0ZXNoZWV0OiBmdW5jdGlvbihrZXksIHNvdXJjZSwgYXJnXzEsIGFyZ18yLCB0b3RhbEZyYW1lcywgZHVyYXRpb24pXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJlcyA9IHtcclxuICAgICAgICAgICAgc3JjOiBzb3VyY2UsXHJcbiAgICAgICAgICAgIGtleToga2V5LFxyXG4gICAgICAgICAgICB0eXBlOiBcInNwcml0ZXNoZWV0XCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGFyZ18xID09IFwibnVtYmVyXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXMud2lkdGggPSBhcmdfMTtcclxuICAgICAgICAgICAgcmVzLmhlaWdodCA9IGFyZ18yO1xyXG4gICAgICAgICAgICByZXMudG90YWwgPSB0b3RhbEZyYW1lcztcclxuICAgICAgICAgICAgcmVzLmR1cmF0aW9uID0gZHVyYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ18xLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXMuZGF0YSA9IGFyZ18xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5saXN0LnB1c2gocmVzKTtcclxuICAgIH0sXHJcblxyXG4gICAgYXRsYXM6IGZ1bmN0aW9uKGtleSwgc291cmNlLCBhdGxhc0RhdGEpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5saXN0LnB1c2goXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IHNvdXJjZSxcclxuICAgICAgICAgICAga2V5OiBrZXksXHJcbiAgICAgICAgICAgIGRhdGE6IGF0bGFzRGF0YSxcclxuICAgICAgICAgICAgdHlwZTogXCJhdGxhc1wiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0OiBmdW5jdGlvbihjYWxsYmFjaylcclxuICAgIHtcclxuICAgICAgICB2YXIgZ2FtZSA9IHRoaXMuZ2FtZTtcclxuICAgICAgICB2YXIgbGlzdCA9IHRoaXMubGlzdDtcclxuXHJcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGdhbWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkTmV4dCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyB2YXIgZG9uZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgcmVzb3VyY2UgPSBsaXN0LnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbG9hZGVyID0gVGlueS5Mb2FkZXJbcmVzb3VyY2UudHlwZV07XHJcblxyXG4gICAgICAgICAgICBpZiAobG9hZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBsb2FkZXIocmVzb3VyY2UsIGxvYWRlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJDYW5ub3QgZmluZCBsb2FkZXIgZm9yIFwiICsgcmVzb3VyY2UudHlwZSk7XHJcbiAgICAgICAgICAgICAgICBsb2FkZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZGVkKHJlc291cmNlLCBkYXRhKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCAhPSAwKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbG9hZE5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGdhbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb2FkTmV4dCgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVGlueS5Mb2FkZXIuYXRsYXMgPSBmdW5jdGlvbihyZXNvdXJjZSwgY2IpXHJcbntcclxuICAgIHZhciBrZXkgPSByZXNvdXJjZS5rZXk7XHJcblxyXG4gICAgVGlueS5Mb2FkZXIuaW1hZ2UocmVzb3VyY2UsIGZ1bmN0aW9uKHJlc291cmNlLCBpbWFnZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzb3VyY2UuZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB1dWlkID0ga2V5ICsgXCIuXCIgKyByZXNvdXJjZS5kYXRhW2ldLm5hbWU7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gbmV3IFRpbnkuVGV4dHVyZShpbWFnZSwgcmVzb3VyY2UuZGF0YVtpXSk7XHJcbiAgICAgICAgICAgIHRleHR1cmUua2V5ID0ga2V5O1xyXG5cclxuICAgICAgICAgICAgVGlueS5DYWNoZS50ZXh0dXJlW3V1aWRdID0gdGV4dHVyZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNiKCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuVGlueS5Mb2FkZXIuc3ByaXRlc2hlZXQgPSBmdW5jdGlvbihyZXNvdXJjZSwgY2IpXHJcbntcclxuICAgIHZhciBrZXkgPSByZXNvdXJjZS5rZXk7XHJcblxyXG4gICAgVGlueS5Mb2FkZXIuaW1hZ2UocmVzb3VyY2UsIGZ1bmN0aW9uKHJlc291cmNlLCBpbWFnZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChyZXNvdXJjZS5kYXRhKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZnJhbWVEYXRhID0gcmVzb3VyY2UuZGF0YTtcclxuICAgICAgICAgICAgdmFyIGxhc3RGcmFtZSA9IChmcmFtZURhdGEubGVuZ3RoIC0gMSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBsYXN0RnJhbWU7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHV1aWQgPSBrZXkgKyBcIi5cIiArIGk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRleHR1cmUgPSBuZXcgVGlueS5UZXh0dXJlKGltYWdlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgeDogTWF0aC5mbG9vcihmcmFtZURhdGFbaV0ueCksXHJcbiAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5mbG9vcihmcmFtZURhdGFbaV0ueSksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IE1hdGguZmxvb3IoZnJhbWVEYXRhW2ldLndpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IE1hdGguZmxvb3IoZnJhbWVEYXRhW2ldLmhlaWdodCksXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGZyYW1lRGF0YVtpXS5kdXJhdGlvblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGV4dHVyZS5rZXkgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICB0ZXh0dXJlLmxhc3RGcmFtZSA9IGxhc3RGcmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICBUaW55LkNhY2hlLnRleHR1cmVbdXVpZF0gPSB0ZXh0dXJlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgd2lkdGggPSBpbWFnZS5uYXR1cmFsV2lkdGggfHwgaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBpbWFnZS5uYXR1cmFsSGVpZ2h0IHx8IGltYWdlLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIHZhciBmcmFtZVdpZHRoID0gcmVzb3VyY2Uud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBmcmFtZUhlaWdodCA9IHJlc291cmNlLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmICghZnJhbWVXaWR0aCkgZnJhbWVXaWR0aCA9IE1hdGguZmxvb3Iod2lkdGggLyAocmVzb3VyY2UuY29scyB8fCAxKSk7XHJcbiAgICAgICAgICAgIGlmICghZnJhbWVIZWlnaHQpIGZyYW1lSGVpZ2h0ID0gTWF0aC5mbG9vcihoZWlnaHQgLyAocmVzb3VyY2Uucm93cyB8fCAxKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29scyA9IE1hdGguZmxvb3Iod2lkdGggLyBmcmFtZVdpZHRoKTtcclxuICAgICAgICAgICAgdmFyIHJvd3MgPSBNYXRoLmZsb29yKGhlaWdodCAvIGZyYW1lSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IGNvbHMgKiByb3dzO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRvdGFsID09PSAwKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNvdXJjZS50b3RhbCkgdG90YWwgPSBNYXRoLm1pbih0b3RhbCwgcmVzb3VyY2UudG90YWwpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgICAgICB2YXIgeSA9IDA7XHJcbiAgICAgICAgICAgIHZhciBsYXN0RnJhbWUgPSB0b3RhbCAtIDE7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvdGFsOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciB1dWlkID0ga2V5ICsgXCIuXCIgKyBpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHR1cmUgPSBuZXcgVGlueS5UZXh0dXJlKGltYWdlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBmcmFtZVdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogZnJhbWVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IHJlc291cmNlLmR1cmF0aW9uXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRleHR1cmUua2V5ID0ga2V5O1xyXG4gICAgICAgICAgICAgICAgdGV4dHVyZS5sYXN0RnJhbWUgPSBsYXN0RnJhbWU7XHJcbiAgICAgICAgICAgICAgICBUaW55LkNhY2hlLnRleHR1cmVbdXVpZF0gPSB0ZXh0dXJlO1xyXG5cclxuICAgICAgICAgICAgICAgIHggKz0gZnJhbWVXaWR0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoeCArIGZyYW1lV2lkdGggPiB3aWR0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB5ICs9IGZyYW1lSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYigpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5UaW55LkxvYWRlci5pbWFnZSA9IGZ1bmN0aW9uKHJlc291cmNlLCBjYikgXHJcbntcclxuICAgIC8vIGlmIChUaW55LkNhY2hlW1wiaW1hZ2VcIl1bcmVzb3VyY2Uua2V5XSkgcmV0dXJuIGNiKHJlc291cmNlLCBUaW55LkNhY2hlW1wiaW1hZ2VcIl1bcmVzb3VyY2Uua2V5XSk7XHJcblxyXG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIFRpbnkuQ2FjaGUuaW1hZ2VbcmVzb3VyY2Uua2V5XSA9IGltYWdlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNiKHJlc291cmNlLCBpbWFnZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uKClcclxuICAgIC8vIHtcclxuICAgIC8vICAgICBjYihyZXNvdXJjZSwgaW1hZ2UpO1xyXG4gICAgLy8gfSlcclxuXHJcbiAgICBpbWFnZS5zcmMgPSByZXNvdXJjZS5zcmM7XHJcbn1cclxuXHJcblRpbnkucmVnaXN0ZXJTeXN0ZW0oXCJsb2FkXCIsIFRpbnkuTG9hZGVyKTsiLCJ2YXIgX2lzU2V0VGltZU91dCwgX29uTG9vcCwgX3RpbWVPdXRJRCwgX3ByZXZUaW1lLCBfbGFzdFRpbWU7XHJcblxyXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbn1cclxuXHJcbmlmIChzZWxmLnBlcmZvcm1hbmNlICE9PSB1bmRlZmluZWQgJiYgc2VsZi5wZXJmb3JtYW5jZS5ub3cgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgbm93ID0gc2VsZi5wZXJmb3JtYW5jZS5ub3cuYmluZChzZWxmLnBlcmZvcm1hbmNlKTtcclxufSBlbHNlIGlmIChEYXRlLm5vdyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBub3cgPSBEYXRlLm5vdztcclxufVxyXG5cclxuVGlueS5SQUYgPSBmdW5jdGlvbiAoZ2FtZSwgZm9yY2VTZXRUaW1lT3V0KVxyXG57XHJcblxyXG4gICAgaWYgKGZvcmNlU2V0VGltZU91dCA9PT0gdW5kZWZpbmVkKSB7IGZvcmNlU2V0VGltZU91dCA9IGZhbHNlOyB9XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmZvcmNlU2V0VGltZU91dCA9IGZvcmNlU2V0VGltZU91dDtcclxuXHJcbiAgICB2YXIgdmVuZG9ycyA9IFtcclxuICAgICAgICAnbXMnLFxyXG4gICAgICAgICdtb3onLFxyXG4gICAgICAgICd3ZWJraXQnLFxyXG4gICAgICAgICdvJ1xyXG4gICAgXTtcclxuXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyB4KyspXHJcbiAgICB7XHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xyXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XHJcbiAgICB9XHJcblxyXG4gICAgX2lzU2V0VGltZU91dCA9IGZhbHNlO1xyXG4gICAgX29uTG9vcCA9IG51bGw7XHJcbiAgICBfdGltZU91dElEID0gbnVsbDtcclxuXHJcbiAgICBfcHJldlRpbWUgPSAwXHJcbiAgICBfbGFzdFRpbWUgPSAwXHJcbn07XHJcblxyXG5UaW55LlJBRi5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgc3RhcnQ6IGZ1bmN0aW9uICgpXHJcbiAgICB7XHJcblxyXG4gICAgICAgIF9wcmV2VGltZSA9IG5vdygpO1xyXG5cclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB0aGlzLmZvcmNlU2V0VGltZU91dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9pc1NldFRpbWVPdXQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgX29uTG9vcCA9IGZ1bmN0aW9uICgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy51cGRhdGVTZXRUaW1lb3V0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBfdGltZU91dElEID0gd2luZG93LnNldFRpbWVvdXQoX29uTG9vcCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9pc1NldFRpbWVPdXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIF9vbkxvb3AgPSBmdW5jdGlvbiAoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy51cGRhdGVSQUYoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIF90aW1lT3V0SUQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKF9vbkxvb3ApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlUkFGOiBmdW5jdGlvbiAoKVxyXG4gICAge1xyXG4gICAgICAgIF9sYXN0VGltZSA9IG5vdygpXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzUnVubmluZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5fdXBkYXRlKE1hdGguZmxvb3IoX2xhc3RUaW1lKSwgX2xhc3RUaW1lIC0gX3ByZXZUaW1lKTtcclxuXHJcbiAgICAgICAgICAgIF90aW1lT3V0SUQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKF9vbkxvb3ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX3ByZXZUaW1lID0gX2xhc3RUaW1lXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGVTZXRUaW1lb3V0OiBmdW5jdGlvbiAoKVxyXG4gICAge1xyXG4gICAgICAgIF9sYXN0VGltZSA9IG5vdygpXHJcbiAgICAgICAgaWYgKHRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLl91cGRhdGUoTWF0aC5mbG9vcihfbGFzdFRpbWUpLCBfbGFzdFRpbWUgLSBfcHJldlRpbWUpO1xyXG5cclxuICAgICAgICAgICAgX3RpbWVPdXRJRCA9IHdpbmRvdy5zZXRUaW1lb3V0KF9vbkxvb3AsIFRpbnkuUkFGLnRpbWVUb0NhbGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfcHJldlRpbWUgPSBfbGFzdFRpbWVcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkgXHJcbiAgICB7XHJcbiAgICAgICAgX3ByZXZUaW1lID0gbm93KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0b3A6IGZ1bmN0aW9uICgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKF9pc1NldFRpbWVPdXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoX3RpbWVPdXRJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShfdGltZU91dElEKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55LlJBRi50aW1lVG9DYWxsID0gMTU7IiwidmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxudmFyIFRpbWVyID0gZnVuY3Rpb24oc3RhdHVzLCBhdXRvUmVtb3ZlLCBnYW1lLCBjYiwgZGVsYXksIGxvb3AsIG4sIG9uY29tcGxldGUpXHJcbntcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB0aGlzLl9jYl8gPSBjYiB8fCBub29wO1xyXG4gICAgdGhpcy5kZWxheSA9IChkZWxheSA9PSB1bmRlZmluZWQgPyAxMDAwIDogZGVsYXkpO1xyXG4gICAgdGhpcy5sb29wID0gbG9vcDtcclxuICAgIHRoaXMuX2NvdW50ID0gbiB8fCAwO1xyXG4gICAgdGhpcy5fcmVwZWF0ID0gKHRoaXMuX2NvdW50ID4gMCk7XHJcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxuICAgIHRoaXMuX2xhc3RGcmFtZSA9IDA7XHJcbiAgICB0aGlzLmF1dG9SZW1vdmUgPSBhdXRvUmVtb3ZlO1xyXG4gICAgdGhpcy5fb25jb21wbGV0ZSA9IG9uY29tcGxldGUgfHwgbm9vcDtcclxufVxyXG5cclxuVGltZXIucHJvdG90eXBlID0ge1xyXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IDE7XHJcbiAgICB9LFxyXG4gICAgcGF1c2U6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IDA7XHJcbiAgICB9LFxyXG4gICAgc3RvcDogZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gMDtcclxuICAgICAgICB0aGlzLl9sYXN0RnJhbWUgPSAwO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZGVsdGFUaW1lKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RGcmFtZSArPSBkZWx0YVRpbWVcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xhc3RGcmFtZSA+PSB0aGlzLmRlbGF5KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYl8oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RGcmFtZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcmVwZWF0KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50LS07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NvdW50ID09PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF1dG9SZW1vdmUgJiYgdGhpcy5nYW1lLnRpbWVyLnJlbW92ZSh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCF0aGlzLmxvb3ApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0b1JlbW92ZSAmJiB0aGlzLmdhbWUudGltZXIucmVtb3ZlKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5UaW55LlRpbWVyID0gVGltZXI7XHJcblxyXG5UaW55LlRpbWVyQ3JlYXRvciA9IGZ1bmN0aW9uKGdhbWUpXHJcbntcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB0aGlzLmxpc3QgPSBbXTtcclxuICAgIHRoaXMuYXV0b1N0YXJ0ID0gdHJ1ZTtcclxuICAgIHRoaXMuYXV0b1JlbW92ZSA9IHRydWU7XHJcbn07XHJcblxyXG5UaW55LlRpbWVyQ3JlYXRvci5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihkZWx0YSkgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5saXN0LmZvckVhY2goZnVuY3Rpb24odG0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0bS51cGRhdGUoZGVsdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlQWxsOiBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5saXN0LmZvckVhY2goZnVuY3Rpb24odG0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0bS5zdG9wKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlzdCA9IFtdO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24odG0pXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGluZGV4T2YgPSB0aGlzLmxpc3QuaW5kZXhPZih0bSk7XHJcbiAgICAgICAgaWYgKGluZGV4T2YgPiAtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRtLnN0b3AoKTtcclxuICAgICAgICAgICAgdGhpcy5saXN0LnNwbGljZShpbmRleE9mLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYWRkOiBmdW5jdGlvbihkZWxheSwgY2IsIGF1dG9zdGFydCwgYXV0b3JlbW92ZSlcclxuICAgIHtcclxuICAgICAgICBpZiAoYXV0b3N0YXJ0ID09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhdXRvc3RhcnQgPSB0aGlzLmF1dG9TdGFydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRpbWVyID0gbmV3IFRpbWVyKChhdXRvc3RhcnQgPyAxIDogMCksIChhdXRvcmVtb3ZlICE9IHVuZGVmaW5lZCA/IGF1dG9yZW1vdmUgOiB0aGlzLmF1dG9SZW1vdmUpLCB0aGlzLmdhbWUsIGNiLCBkZWxheSk7XHJcbiAgICAgICAgdGhpcy5saXN0LnB1c2godGltZXIpO1xyXG4gICAgICAgIHJldHVybiB0aW1lcjtcclxuICAgIH0sXHJcbiAgICBsb29wOiBmdW5jdGlvbihkZWxheSwgY2IsIGF1dG9zdGFydCwgYXV0b3JlbW92ZSlcclxuICAgIHtcclxuICAgICAgICBpZiAoYXV0b3N0YXJ0ID09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhdXRvc3RhcnQgPSB0aGlzLmF1dG9TdGFydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRpbWVyID0gbmV3IFRpbWVyKChhdXRvc3RhcnQgPyAxIDogMCksIChhdXRvcmVtb3ZlICE9IHVuZGVmaW5lZCA/IGF1dG9yZW1vdmUgOiB0aGlzLmF1dG9SZW1vdmUpLCB0aGlzLmdhbWUsIGNiLCBkZWxheSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5saXN0LnB1c2godGltZXIpO1xyXG4gICAgICAgIHJldHVybiB0aW1lcjtcclxuICAgIH0sXHJcbiAgICByZXBlYXQ6IGZ1bmN0aW9uKGRlbGF5LCBuLCBjYiwgY29tcGxldGUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHRpbWVyID0gbmV3IFRpbWVyKCh0aGlzLmF1dG9TdGFydCA/IDEgOiAwKSwgdGhpcy5hdXRvUmVtb3ZlLCB0aGlzLmdhbWUsIGNiLCBkZWxheSwgZmFsc2UsIG4sIGNvbXBsZXRlKTtcclxuICAgICAgICB0aGlzLmxpc3QucHVzaCh0aW1lcik7XHJcbiAgICAgICAgcmV0dXJuIHRpbWVyO1xyXG4gICAgfSxcclxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55LnJlZ2lzdGVyU3lzdGVtKFwidGltZXJcIiwgVGlueS5UaW1lckNyZWF0b3IpOyIsIlxyXG4vLyBUaW55LlRleHR1cmVDYWNoZSA9IHt9O1xyXG4vLyBUaW55LkZyYW1lQ2FjaGUgPSB7fTtcclxuVGlueS5UZXh0dXJlQ2FjaGVJZEdlbmVyYXRvciA9IDA7XHJcblRpbnkuVGV4dHVyZVNpbGVudEZhaWwgPSBmYWxzZTtcclxuXHJcblRpbnkuVGV4dHVyZSA9IGZ1bmN0aW9uKHNvdXJjZSwgZnJhbWUsIGNyb3AsIHRyaW0pXHJcbntcclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgdGhpcy5ub0ZyYW1lID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5yZXNvbHV0aW9uID0gMTtcclxuXHJcbiAgICB0aGlzLmhhc0xvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIGlmICghZnJhbWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5ub0ZyYW1lID0gdHJ1ZTtcclxuICAgICAgICBmcmFtZSA9IG5ldyBUaW55LlJlY3RhbmdsZSgwLDAsMSwxKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHNvdXJjZSA9PSBcInN0cmluZ1wiKSBcclxuICAgIHtcclxuICAgICAgICB2YXIga2V5ID0gc291cmNlO1xyXG5cclxuICAgICAgICBzb3VyY2UgPSBUaW55LkNhY2hlLmltYWdlW2tleV07XHJcblxyXG4gICAgICAgIGlmICghc291cmNlKSB0aHJvdyBuZXcgRXJyb3IoJ0NhY2hlIEVycm9yOiBpbWFnZSAnICsga2V5ICsgJyBkb2VzYHQgZm91bmQgaW4gY2FjaGUnKTtcclxuXHJcbiAgICAgICAgVGlueS5DYWNoZS50ZXh0dXJlW2tleV0gPSB0aGlzO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcblxyXG4gICAgdGhpcy5mcmFtZSA9IGZyYW1lO1xyXG5cclxuICAgIHRoaXMudHJpbSA9IHRyaW07XHJcblxyXG4gICAgdGhpcy52YWxpZCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMud2lkdGggPSAwO1xyXG5cclxuICAgIHRoaXMuaGVpZ2h0ID0gMDtcclxuXHJcbiAgICB0aGlzLmNyb3AgPSBjcm9wIHx8IG5ldyBUaW55LlJlY3RhbmdsZSgwLCAwLCAxLCAxKTtcclxuXHJcbiAgICBpZigodGhpcy5zb3VyY2UuY29tcGxldGUgfHwgdGhpcy5zb3VyY2UuZ2V0Q29udGV4dCkgJiYgdGhpcy5zb3VyY2Uud2lkdGggJiYgdGhpcy5zb3VyY2UuaGVpZ2h0KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub25Tb3VyY2VMb2FkZWQoKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc291cmNlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzY29wZS5vblNvdXJjZUxvYWRlZCgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55LlRleHR1cmUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVGlueS5UZXh0dXJlO1xyXG5cclxuVGlueS5UZXh0dXJlLnByb3RvdHlwZS5vblNvdXJjZUxvYWRlZCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5oYXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy53aWR0aCA9IHRoaXMuc291cmNlLm5hdHVyYWxXaWR0aCB8fCB0aGlzLnNvdXJjZS53aWR0aDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5zb3VyY2UubmF0dXJhbEhlaWdodCB8fCB0aGlzLnNvdXJjZS5oZWlnaHQ7XHJcblxyXG4gICAgaWYgKHRoaXMubm9GcmFtZSkgdGhpcy5mcmFtZSA9IG5ldyBUaW55LlJlY3RhbmdsZSgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgdGhpcy5zZXRGcmFtZSh0aGlzLmZyYW1lKTtcclxufTtcclxuXHJcblRpbnkuVGV4dHVyZS5wcm90b3R5cGUuYWRkVG9DYWNoZSA9IGZ1bmN0aW9uKGtleSlcclxue1xyXG4gICAgVGlueS5DYWNoZS50ZXh0dXJlW2tleV0gPSB0aGlzO1xyXG4gICAgdGhpcy5rZXkgPSBrZXk7XHJcbn07XHJcblxyXG5UaW55LlRleHR1cmUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIGlmICh0aGlzLmtleSkge1xyXG4gICAgICAgIGRlbGV0ZSBUaW55LkNhY2hlLnRleHR1cmVbdGhpcy5rZXldO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc291cmNlID0gbnVsbDtcclxuICAgIHRoaXMudmFsaWQgPSBmYWxzZTtcclxufTtcclxuXHJcblRpbnkuVGV4dHVyZS5wcm90b3R5cGUuc2V0RnJhbWUgPSBmdW5jdGlvbihmcmFtZSlcclxue1xyXG4gICAgdGhpcy5ub0ZyYW1lID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5mcmFtZSA9IGZyYW1lO1xyXG4gICAgLy8gdGhpcy53aWR0aCA9IGZyYW1lLndpZHRoO1xyXG4gICAgLy8gdGhpcy5oZWlnaHQgPSBmcmFtZS5oZWlnaHQ7XHJcblxyXG4gICAgdGhpcy5jcm9wLnggPSBmcmFtZS54O1xyXG4gICAgdGhpcy5jcm9wLnkgPSBmcmFtZS55O1xyXG4gICAgdGhpcy5jcm9wLndpZHRoID0gZnJhbWUud2lkdGg7XHJcbiAgICB0aGlzLmNyb3AuaGVpZ2h0ID0gZnJhbWUuaGVpZ2h0O1xyXG5cclxuICAgIGlmICghdGhpcy50cmltICYmIChmcmFtZS54ICsgZnJhbWUud2lkdGggPiB0aGlzLndpZHRoIHx8IGZyYW1lLnkgKyBmcmFtZS5oZWlnaHQgPiB0aGlzLmhlaWdodCkpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFUaW55LlRleHR1cmVTaWxlbnRGYWlsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUZXh0dXJlIEVycm9yOiBmcmFtZSBkb2VzIG5vdCBmaXQgaW5zaWRlIHRoZSBiYXNlIFRleHR1cmUgZGltZW5zaW9ucyAnICsgdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmFsaWQgPSBmcmFtZSAmJiBmcmFtZS53aWR0aCAmJiBmcmFtZS5oZWlnaHQgJiYgdGhpcy5zb3VyY2UgJiYgdGhpcy5oYXNMb2FkZWQ7XHJcblxyXG4gICAgaWYgKHRoaXMudHJpbSlcclxuICAgIHtcclxuICAgICAgICAvLyB0aGlzLndpZHRoID0gdGhpcy50cmltLndpZHRoO1xyXG4gICAgICAgIC8vIHRoaXMuaGVpZ2h0ID0gdGhpcy50cmltLmhlaWdodDtcclxuICAgICAgICB0aGlzLmZyYW1lLndpZHRoID0gdGhpcy50cmltLndpZHRoO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaGVpZ2h0ID0gdGhpcy50cmltLmhlaWdodDtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIFRpbnkuVGV4dHVyZS5mcm9tSW1hZ2UgPSBmdW5jdGlvbihrZXksIGltYWdlVXJsLCBjcm9zc29yaWdpbilcclxuLy8ge1xyXG4vLyAgICAgdmFyIHRleHR1cmUgPSBUaW55LlRleHR1cmVDYWNoZVtrZXldO1xyXG5cclxuLy8gICAgIGlmKCF0ZXh0dXJlKVxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHRleHR1cmUgPSBuZXcgVGlueS5UZXh0dXJlKFRpbnkuQmFzZVRleHR1cmUuZnJvbUltYWdlKGtleSwgaW1hZ2VVcmwsIGNyb3Nzb3JpZ2luKSk7XHJcbi8vICAgICAgICAgdGV4dHVyZS5rZXkgPSBrZXlcclxuLy8gICAgICAgICBUaW55LlRleHR1cmVDYWNoZVtrZXldID0gdGV4dHVyZTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICByZXR1cm4gdGV4dHVyZTtcclxuLy8gfTtcclxuXHJcbi8vIFRpbnkuVGV4dHVyZS5mcm9tRnJhbWUgPSBmdW5jdGlvbihmcmFtZUlkKVxyXG4vLyB7XHJcbi8vICAgICB2YXIgdGV4dHVyZSA9IFRpbnkuVGV4dHVyZUNhY2hlW2ZyYW1lSWRdO1xyXG4vLyAgICAgaWYoIXRleHR1cmUpIHRocm93IG5ldyBFcnJvcignVGhlIGZyYW1lSWQgXCInICsgZnJhbWVJZCArICdcIiBkb2VzIG5vdCBleGlzdCBpbiB0aGUgdGV4dHVyZSBjYWNoZSAnKTtcclxuLy8gICAgIHJldHVybiB0ZXh0dXJlO1xyXG4vLyB9O1xyXG5cclxuVGlueS5UZXh0dXJlLmZyb21DYW52YXMgPSBmdW5jdGlvbihjYW52YXMpXHJcbntcclxuICAgIC8vIGlmKCFjYW52YXMuX3RpbnlJZClcclxuICAgIC8vIHtcclxuICAgIC8vICAgICBjYW52YXMuX3RpbnlJZCA9ICdfZnJvbV9jYW52YXNfJyArIFRpbnkuVGV4dHVyZUNhY2hlSWRHZW5lcmF0b3IrKztcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyB2YXIgdGV4dHVyZSA9IFRpbnkuQ2FjaGUudGV4dHVyZVtjYW52YXMuX3RpbnlJZF07XHJcblxyXG4gICAgLy8gaWYoIXRleHR1cmUpXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdGV4dHVyZSA9IG5ldyBUaW55LlRleHR1cmUoIGNhbnZhcyApO1xyXG4gICAgLy8gICAgIFRpbnkuQ2FjaGUudGV4dHVyZVtjYW52YXMuX3RpbnlJZF0gPSB0ZXh0dXJlO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHJldHVybiB0ZXh0dXJlO1xyXG4gICAgcmV0dXJuIG5ldyBUaW55LlRleHR1cmUoIGNhbnZhcyApO1xyXG59O1xyXG5cclxuLy8gVGlueS5UZXh0dXJlLmFkZFRleHR1cmVUb0NhY2hlID0gZnVuY3Rpb24odGV4dHVyZSwgaWQpXHJcbi8vIHtcclxuLy8gICAgIFRpbnkuVGV4dHVyZUNhY2hlW2lkXSA9IHRleHR1cmU7XHJcbi8vIH07XHJcblxyXG5cclxuLy8gVGlueS5UZXh0dXJlLnJlbW92ZVRleHR1cmVGcm9tQ2FjaGUgPSBmdW5jdGlvbihpZClcclxuLy8ge1xyXG4vLyAgICAgdmFyIHRleHR1cmUgPSBUaW55LlRleHR1cmVDYWNoZVtpZF07XHJcbi8vICAgICBkZWxldGUgVGlueS5UZXh0dXJlQ2FjaGVbaWRdO1xyXG4vLyAgICAgZGVsZXRlIFRpbnkuQmFzZVRleHR1cmVDYWNoZVtpZF07XHJcbi8vICAgICByZXR1cm4gdGV4dHVyZTtcclxuLy8gfTsiLCJcclxuZnVuY3Rpb24gRXZlbnRMaXN0ZW5lcnMoKSBcclxue1xyXG4gICAgdGhpcy5hID0gW107XHJcbiAgICB0aGlzLm4gPSAwO1xyXG59XHJcblxyXG5UaW55LkV2ZW50RW1pdHRlciA9IHtcclxuXHJcbiAgICBjYWxsOiBmdW5jdGlvbihvYmopIFxyXG4gICAge1xyXG4gICAgICAgIGlmIChvYmopIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgb2JqID0gb2JqLnByb3RvdHlwZSB8fCBvYmo7XHJcbiAgICAgICAgICAgIFRpbnkuRXZlbnRFbWl0dGVyLm1peGluKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtaXhpbjogZnVuY3Rpb24ob2JqKSBcclxuICAgIHtcclxuICAgICAgICBjb25zdCBsaXN0ZW5lcnNfZXZlbnRzID0ge307XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHB1c2hMaXN0ZW5lcihldmVudCwgZm4sIGNvbnRleHQsIG9uY2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbGlzdGVuZXJzID0gbGlzdGVuZXJzX2V2ZW50c1tldmVudF1cclxuXHJcbiAgICAgICAgICAgIGlmICghbGlzdGVuZXJzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnNfZXZlbnRzW2V2ZW50XSA9IG5ldyBFdmVudExpc3RlbmVycygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsaXN0ZW5lcnMuYS5wdXNoKGZuLCBjb250ZXh0IHx8IG51bGwsIG9uY2UgfHwgZmFsc2UpO1xyXG4gICAgICAgICAgICBsaXN0ZW5lcnMubiArPSAzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JqLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4sIGNvbnRleHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwdXNoTGlzdGVuZXIoZXZlbnQsIGZuLCBjb250ZXh0LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iai5vbiA9IHB1c2hMaXN0ZW5lcjtcclxuXHJcbiAgICAgICAgb2JqLm9mZiA9IGZ1bmN0aW9uKGV2ZW50LCBmbiwgY29udGV4dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnNfZXZlbnRzW2V2ZW50XVxyXG5cclxuICAgICAgICAgICAgaWYgKCFsaXN0ZW5lcnMpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciBmbkFycmF5ID0gbGlzdGVuZXJzX2V2ZW50c1tldmVudF0uYTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZm4pIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmbkFycmF5Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoIWNvbnRleHQpIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZuQXJyYXkubGVuZ3RoOyBpICs9IDMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuQXJyYXlbaV0gPT0gZm4pXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbkFycmF5LnNwbGljZShpLCAzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSAtPSAzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZuQXJyYXkubGVuZ3RoOyBpICs9IDMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuQXJyYXlbaV0gPT0gZm4gJiYgZm5BcnJheVtpICsgMV0gPT0gY29udGV4dClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuQXJyYXkuc3BsaWNlKGksIDMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpIC09IDM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZm5BcnJheS5sZW5ndGggPT0gMCkgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBsaXN0ZW5lcnNfZXZlbnRzW2V2ZW50XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JqLmVtaXQgPSBmdW5jdGlvbihldmVudCwgYTEsIGEyLCBhMylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnNfZXZlbnRzW2V2ZW50XTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbGlzdGVuZXJzKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB2YXIgZm5BcnJheSA9IGxpc3RlbmVycy5hO1xyXG4gICAgICAgICAgICBsaXN0ZW5lcnMubiA9IDA7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm5BcnJheS5sZW5ndGggLSBsaXN0ZW5lcnMubjsgaSArPSAzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGVuIDw9IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgZm5BcnJheVtpXS5jYWxsKGZuQXJyYXlbaSArIDFdKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxlbiA9PSAyKVxyXG4gICAgICAgICAgICAgICAgICAgIGZuQXJyYXlbaV0uY2FsbChmbkFycmF5W2kgKyAxXSwgYTEpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGVuID09IDMpXHJcbiAgICAgICAgICAgICAgICAgICAgZm5BcnJheVtpXS5jYWxsKGZuQXJyYXlbaSArIDFdLCBhMSwgYTIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGZuQXJyYXlbaV0uY2FsbChmbkFycmF5W2kgKyAxXSwgYTEsIGEyLCBhMyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZuQXJyYXlbaSArIDJdKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZuQXJyYXkuc3BsaWNlKGksIDMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGkgLT0gMztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGZuQXJyYXkubGVuZ3RoID09IDApIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgbGlzdGVuZXJzX2V2ZW50c1tldmVudF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IiwiaWYgKCFEYXRlLm5vdykge1xyXG4gIERhdGUubm93ID0gZnVuY3Rpb24gbm93KCkge1xyXG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YoRmxvYXQzMkFycmF5KSA9PSAndW5kZWZpbmVkJylcclxue1xyXG5cdHdpbmRvdy5GbG9hdDMyQXJyYXkgPSBBcnJheVxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==