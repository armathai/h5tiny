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
        delta *= this.timeScale;
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

__webpack_require__(/*! ./renderers/CanvasRenderer.js */ "./src/renderers/CanvasRenderer.js"); // 3 Kb

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
    // matrix = matrix;//just to get passed js hinting (and preserve inheritance)
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
    this._cachedSprite = null;
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

        if (this.game) child.game = this.game;

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
    this.cachedTint = "#FFFFFF";

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
    if(this.dirty || this.resolution !== renderSession.resolution)
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

/***/ "./src/renderers/CanvasRenderer.js":
/*!*****************************************!*\
  !*** ./src/renderers/CanvasRenderer.js ***!
  \*****************************************/
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

    this.resize(width || 800, height || 600);

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
    scene.updateTransform();

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

Tiny.CanvasRenderer.prototype.resize = function(width, height)
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
                    obj = this.candidates[i]
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
        
        var lastFrame, uuid, texture;

        if (resource.data) {

            var frameData = resource.data;
            lastFrame = (frameData.length - 1);

            for (var i = 0; i <= lastFrame; i++)
            {
                uuid = key + "." + i;

                texture = new Tiny.Texture(image, {
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
            lastFrame = total - 1;

            for (var i = 0; i < total; i++)
            {
                uuid = key + "." + i;
                texture = new Tiny.Texture(image, {
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

    this.valid = frame && frame.width && frame.height && this.source && this.hasLoaded;

    if (!this.valid) return;

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
            var fn, ctx;

            for (var i = 0; i < fnArray.length - listeners.n; i += 3)
            {
                fn = fnArray[i];
                ctx = fnArray[i + 1];
                
                if (fnArray[i + 2])
                {
                    fnArray.splice(i, 3);
                    i -= 3;
                }

                if (len <= 1)
                    fn.call(ctx);
                else if (len == 2)
                    fn.call(ctx, a1);
                else if (len == 3)
                    fn.call(ctx, a1, a2);
                else
                    fn.call(ctx, a1, a2, a3);

                // if (fnArray[i + 2])
                // {
                //     fnArray.splice(i, 3);
                //     i -= 3;
                // }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRoL01hdGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hdGgvTWF0cml4LmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRoL1BvaW50LmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRoL1JlY3RhbmdsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWluaS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9CYXNlT2JqZWN0MkQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvT2JqZWN0MkQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvU2NlbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvU3ByaXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL1RleHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlbmRlcmVycy9DYW52YXNSZW5kZXJlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3lzdGVtcy9JbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3lzdGVtcy9Mb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N5c3RlbXMvUkFGLmpzIiwid2VicGFjazovLy8uL3NyYy9zeXN0ZW1zL1RpbWVyLmpzIiwid2VicGFjazovLy8uL3NyYy90ZXh0dXJlcy9UZXh0dXJlLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9FdmVudEVtaXR0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3BvbHlmaWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNqRkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUIseUJBQXlCO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLHlCQUF5QjtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLHlCQUF5QjtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsMkJBQTJCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQix5QkFBeUI7QUFDNUM7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQy9LQSxtQkFBTyxDQUFDLG9EQUFxQjs7QUFFN0I7O0FBRUEsbUJBQU8sQ0FBQyw4QkFBVTtBQUNsQixtQkFBTyxDQUFDLG9DQUFhO0FBQ3JCLG1CQUFPLENBQUMsMENBQWdCLEVBQUU7QUFDMUIsbUJBQU8sQ0FBQyw0Q0FBaUIsRUFBRTtBQUMzQixtQkFBTyxDQUFDLDhDQUFrQixFQUFFO0FBQzVCLG1CQUFPLENBQUMsb0RBQXFCLEVBQUU7O0FBRS9CLG1CQUFPLENBQUMsZ0VBQTJCLEVBQUU7QUFDckMsbUJBQU8sQ0FBQyx3REFBdUIsRUFBRTtBQUNqQyxtQkFBTyxDQUFDLGtEQUFvQixFQUFFOztBQUU5QixtQkFBTyxDQUFDLHdFQUErQixFQUFFLFE7Ozs7Ozs7Ozs7OztBQ2R6Qzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7Ozs7QUM5Q0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7Ozs7QUNyQkE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHdDOzs7Ozs7Ozs7OztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRTs7Ozs7Ozs7Ozs7O0FDWEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxxRDs7Ozs7Ozs7Ozs7QUM5SEEsbUJBQU8sQ0FBQyxnQ0FBVzs7O0FBR25CLG1CQUFPLENBQUMsOENBQWtCLEVBQUU7QUFDNUIseUNBQXlDO0FBQ3pDLG1CQUFPLENBQUMsb0RBQXFCLEVBQUU7QUFDL0IsbUJBQU8sQ0FBQyxrREFBb0IsRUFBRTtBQUM5QixtQkFBTyxDQUFDLGtEQUFvQixFQUFFOztBQUU5QixtQkFBTyxDQUFDLDREQUF5Qjs7QUFFakMsbUJBQU8sQ0FBQyx3REFBdUIsRUFBRTs7QUFFakMsbUJBQU8sQ0FBQyxvREFBcUIsRUFBRTtBQUMvQixtQkFBTyxDQUFDLGdEQUFtQixFQUFFOzs7Ozs7Ozs7Ozs7Ozs7QUNiN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esd0ZBQXdGOztBQUV4RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQsa0Q7Ozs7Ozs7Ozs7OztBQ3RSQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxRQUFROztBQUVSO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBLGdCQUFnQjtBQUNoQjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUEsSUFBSTs7QUFFSjs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQywwQ0FBMEM7QUFDMUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixvQkFBb0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsdUNBQXVDLEtBQUs7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLHVDQUF1QyxLQUFLO0FBQzVDO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsdUNBQXVDLEtBQUs7QUFDNUM7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLDBCQUEwQjtBQUM3QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7OztBQy9WQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLDBCQUEwQjtBQUM3QztBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7Ozs7QUNqQkE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQiwwQkFBMEI7QUFDN0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7Ozs7Ozs7O0FDaFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGVBQWUsa0JBQWtCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGNBQWM7QUFDaEM7QUFDQSxzQkFBc0IsVUFBVTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLGNBQWM7QUFDckM7QUFDQSxzQkFBc0IsVUFBVTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtGOzs7Ozs7Ozs7Ozs7QUNuWUE7QUFDQSxDO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLDJDQUEyQywwQkFBMEI7O0FBRXJFO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTs7QUFFUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSxDO0FBQ0EsNENBQTRDLG1CQUFtQjs7QUFFL0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7Ozs7Ozs7O0FDakxBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLG1CQUFtQiwrQkFBK0I7QUFDbEQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQkFBK0IsK0JBQStCO0FBQzlEO0FBQ0E7O0FBRUE7O0FBRUEsK0JBQStCLHNCQUFzQjtBQUNyRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSx3REFBd0QsUUFBUTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0RBQW9EOztBQUVwRCw2Q0FBNkMseUJBQXlCOztBQUV0RTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QseUJBQXlCO0FBQ2pGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLHlCQUF5QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHlDOzs7Ozs7Ozs7Ozs7QUNoUkE7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQSw0QztBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx1QkFBdUIsMEJBQTBCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsMkJBQTJCLGdCQUFnQjtBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsV0FBVztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxRQUFROztBQUVSO0FBQ0E7O0FBRUEseUM7Ozs7Ozs7Ozs7O0FDcFBBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx3Q0FBd0MseUJBQXlCO0FBQ2pFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixxREFBcUQ7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx5Qjs7Ozs7Ozs7Ozs7QUM3SEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdEOzs7Ozs7Ozs7Ozs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLOzs7Ozs7Ozs7Ozs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixvQkFBb0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isb0JBQW9CO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDJCQUEyQixrQ0FBa0M7QUFDN0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7Ozs7Ozs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDIiwiZmlsZSI6InRpbnkubWluaS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL21pbmkuanNcIik7XG4iLCJcclxudmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxuVGlueS5BcHAgPSBmdW5jdGlvbihzdGF0ZXMpXHJcbntcclxuICAgIHRoaXMuY2FsbGJhY2tDb250ZXh0ID0gdGhpcztcclxuICAgIHRoaXMuc3RhdGUgPSAwO1xyXG4gICAgdGhpcy50aW1lU2NhbGUgPSAxO1xyXG4gICAgdGhpcy53aWR0aCA9IDA7XHJcbiAgICB0aGlzLmhlaWdodCA9IDA7XHJcbiAgICB0aGlzLnN5c3RlbXMgPSBbXTtcclxuICAgIHRoaXMudXBkYXRhYmxlID0gW107XHJcbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5wYXVzZUR1cmF0aW9uID0gMDtcclxuICAgIHRoaXMuaW5wdXRWaWV3ID0gZG9jdW1lbnQuYm9keTtcclxuXHJcbiAgICBzdGF0ZXMgPSBzdGF0ZXMgfHwge307XHJcbiAgICB0aGlzLmJvb3QgPSBzdGF0ZXMuYm9vdCB8fCB0aGlzLmJvb3QgfHwgbm9vcDtcclxuICAgIHRoaXMucHJlbG9hZCA9IHN0YXRlcy5wcmVsb2FkIHx8IHRoaXMucHJlbG9hZCB8fCBub29wO1xyXG4gICAgdGhpcy5jcmVhdGUgPSBzdGF0ZXMuY3JlYXRlIHx8IHRoaXMuY3JlYXRlIHx8IG5vb3A7XHJcbiAgICB0aGlzLnVwZGF0ZSA9IHN0YXRlcy51cGRhdGUgfHwgdGhpcy51cGRhdGUgfHwgbm9vcDtcclxuICAgIHRoaXMucmVuZGVyID0gc3RhdGVzLnJlbmRlciB8fCB0aGlzLnJlbmRlciB8fCBub29wO1xyXG4gICAgdGhpcy5fcmVzaXplX2NiID0gc3RhdGVzLnJlc2l6ZSB8fCBub29wO1xyXG4gICAgdGhpcy5fZGVzdHJveV9jYiA9IHN0YXRlcy5kZXN0cm95IHx8IG5vb3A7XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgc2VsZi5fYm9vdCgpO1xyXG4gICAgfSwgMCk7XHJcbn1cclxuXHJcblRpbnkuQXBwLnByb3RvdHlwZS5fYm9vdCA9IGZ1bmN0aW9uKClcclxue1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgVGlueS5zeXN0ZW1zLmxlbmd0aDsgaSsrKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzeXN0ZW0gPSBUaW55LnN5c3RlbXNbaV07XHJcblxyXG4gICAgICAgIHZhciBfc3lzXyA9IG5ldyBzeXN0ZW0uX2NsYXNzXyh0aGlzKTtcclxuICAgICAgICB0aGlzLnN5c3RlbXMucHVzaChfc3lzXyk7XHJcbiAgICAgICAgaWYgKF9zeXNfLnVwZGF0ZSkgdGhpcy51cGRhdGFibGUucHVzaChfc3lzXyk7XHJcblxyXG4gICAgICAgIGlmIChzeXN0ZW0ubmFtZSkgdGhpc1tzeXN0ZW0ubmFtZV0gPSBfc3lzXztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoVGlueS5SQUYpIFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucmFmID0gbmV3IFRpbnkuUkFGKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYm9vdC5jYWxsKHRoaXMuY2FsbGJhY2tDb250ZXh0KTtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICBpZiAoc2VsZi5sb2FkKSBzZWxmLl9wcmVsb2FkKCk7XHJcbiAgICAgICAgZWxzZSBzZWxmLl9jcmVhdGUoKTtcclxuICAgIH0sIDApXHJcbn1cclxuXHJcblRpbnkuQXBwLnByb3RvdHlwZS5fcHJlbG9hZCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5wcmVsb2FkLmNhbGwodGhpcy5jYWxsYmFja0NvbnRleHQpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IDE7XHJcbiAgICB0aGlzLmxvYWQuc3RhcnQodGhpcy5fY3JlYXRlKTtcclxufTtcclxuXHJcblRpbnkuQXBwLnByb3RvdHlwZS5fY3JlYXRlID0gZnVuY3Rpb24oKSBcclxue1xyXG4gICAgdGhpcy5jcmVhdGUuY2FsbCh0aGlzLmNhbGxiYWNrQ29udGV4dCk7XHJcblxyXG4gICAgaWYgKHRoaXMucmFmKSBcclxuICAgIHtcclxuICAgICAgICB0aGlzLnJhZi5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RhdGUgPSAyO1xyXG59XHJcblxyXG5cclxuVGlueS5BcHAucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKSBcclxue1xyXG4gICAgaWYgKHRoaXMucmFmKSBcclxuICAgIHtcclxuICAgICAgICB0aGlzLnJhZi5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5wYXVzZWQpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN5c3RlbXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zeXN0ZW1zW2ldLnBhdXNlKSB0aGlzLnN5c3RlbXNbaV0ucGF1c2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuVGlueS5BcHAucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgaWYgKHRoaXMucmFmKSBcclxuICAgIHtcclxuICAgICAgICB0aGlzLnJhZi5yZXNldCgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5wYXVzZWQpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN5c3RlbXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zeXN0ZW1zW2ldLnJlc3VtZSkgdGhpcy5zeXN0ZW1zW2ldLnJlc3VtZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuVGlueS5BcHAucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbih0aW1lLCBkZWx0YSlcclxue1xyXG4gICAgaWYgKCF0aGlzLnBhdXNlZClcclxuICAgIHtcclxuICAgICAgICBkZWx0YSAqPSB0aGlzLnRpbWVTY2FsZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZS5jYWxsKHRoaXMuY2FsbGJhY2tDb250ZXh0LCB0aW1lLCBkZWx0YSk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy51cGRhdGFibGUubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0YWJsZVtpXS51cGRhdGUoZGVsdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICB0aGlzLnBhdXNlRHVyYXRpb24gKz0gZGVsdGFcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG59XHJcblxyXG5cclxuVGlueS5BcHAucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpXHJcbntcclxuICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCB0aGlzLndpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgfHwgdGhpcy5oZWlnaHQ7XHJcblxyXG4gICAgaWYgKHRoaXMuc3RhdGUgPiAwKSBcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9yZXNpemVfY2IuY2FsbCh0aGlzLmNhbGxiYWNrQ29udGV4dCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChzZWxmLmlucHV0KSBzZWxmLmlucHV0LnVwZGF0ZUJvdW5kcygpO1xyXG4gICAgfSwgMClcclxufVxyXG5cclxuVGlueS5BcHAucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihjbGVhckNhY2hlKVxyXG57XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3lzdGVtcy5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5zeXN0ZW1zW2ldLmRlc3Ryb3kpIHRoaXMuc3lzdGVtc1tpXS5kZXN0cm95KGNsZWFyQ2FjaGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoY2xlYXJDYWNoZSkgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5sb2FkLmNsZWFyQ2FjaGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yYWYpIFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucmFmLnN0b3AoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9kZXN0cm95X2NiLmNhbGwodGhpcy5jYWxsYmFja0NvbnRleHQpO1xyXG59XHJcbiIsInJlcXVpcmUoJy4vdXRpbHMvcG9seWZpbGwuanMnKTtcclxuXHJcbndpbmRvdy5UaW55ID0ge307XHJcblxyXG5yZXF1aXJlKCcuL0FwcC5qcycpO1xyXG5yZXF1aXJlKCcuL2dsb2JhbC5qcycpO1xyXG5yZXF1aXJlKCcuL21hdGgvTWF0aC5qcycpOyAvLyAxIEtiXHJcbnJlcXVpcmUoJy4vbWF0aC9Qb2ludC5qcycpOyAgICAgIC8vXHJcbnJlcXVpcmUoJy4vbWF0aC9NYXRyaXguanMnKTsgICAgIC8vXHJcbnJlcXVpcmUoJy4vbWF0aC9SZWN0YW5nbGUuanMnKTsgIC8vICA4IEtiXHJcblxyXG5yZXF1aXJlKCcuL29iamVjdHMvQmFzZU9iamVjdDJELmpzJyk7ICAgICAgICAgICAgIC8vXHJcbnJlcXVpcmUoJy4vb2JqZWN0cy9PYmplY3QyRC5qcycpOyAgICAvL1xyXG5yZXF1aXJlKCcuL29iamVjdHMvU2NlbmUuanMnKTsgICAgICAgICAgICAgICAgICAgICAvLyAxMCBLYlxyXG5cclxucmVxdWlyZSgnLi9yZW5kZXJlcnMvQ2FudmFzUmVuZGVyZXIuanMnKTsgLy8gMyBLYiIsIlxyXG5UaW55LlZFUlNJT04gPSBcIjEuNC45XCI7XHJcblxyXG5UaW55LnN5c3RlbXMgPSBbXTtcclxuXHJcblRpbnkucmVnaXN0ZXJTeXN0ZW0gPSBmdW5jdGlvbihuYW1lLCBzeXN0ZW0pIHtcclxuICAgIFRpbnkuc3lzdGVtcy5wdXNoKHtcclxuICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgIF9jbGFzc186IHN5c3RlbVxyXG4gICAgfSk7XHJcbn1cclxuXHJcblRpbnkuUHJpbWl0aXZlcyA9IHtcclxuICAgIFBPTFk6IDAsXHJcbiAgICBSRUNUOiAxLCBcclxuICAgIENJUkM6IDIsXHJcbiAgICBFTElQOiAzLFxyXG4gICAgUlJFQzogNCxcclxuICAgIFJSRUNfTEpPSU46IDVcclxufVxyXG5cclxuVGlueS5ybmQgPSBmdW5jdGlvbihtaW4sIG1heCkge1xyXG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XHJcbn07XHJcblxyXG5UaW55LmNvbG9yMnJnYiA9IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICByZXR1cm4gVGlueS5oZXgycmdiKFRpbnkuc3R5bGUyaGV4KHN0eWxlKSk7XHJcbn1cclxuXHJcblRpbnkuY29sb3Iyc3R5bGUgPSBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgcmV0dXJuIHN0eWxlO1xyXG59O1xyXG5cclxuVGlueS5zdHlsZTJoZXggPSBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgcmV0dXJuICtzdHlsZS5yZXBsYWNlKCcjJywgJzB4Jyk7XHJcbn07XHJcblxyXG5UaW55LmhleDJzdHlsZSA9IGZ1bmN0aW9uKGhleCkge1xyXG4gICAgcmV0dXJuIFwiI1wiICsgKFwiMDAwMDBcIiArICggaGV4IHwgMCkudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTYpO1xyXG59XHJcblxyXG5UaW55LmhleDJyZ2IgPSBmdW5jdGlvbihoZXgpIHtcclxuICAgIHJldHVybiBbKGhleCA+PiAxNiAmIDB4RkYpIC8gMjU1LCAoIGhleCA+PiA4ICYgMHhGRikgLyAyNTUsIChoZXggJiAweEZGKS8gMjU1XTtcclxufTtcclxuXHJcblRpbnkucmdiMmhleCA9IGZ1bmN0aW9uKHJnYikge1xyXG4gICAgcmV0dXJuICgocmdiWzBdKjI1NSA8PCAxNikgKyAocmdiWzFdKjI1NSA8PCA4KSArIHJnYlsyXSoyNTUpO1xyXG59OyIsIlxyXG5UaW55Lk1hdGggPSB7XHJcblxyXG4gICAgZGlzdGFuY2U6IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5Mikge1xyXG5cclxuICAgICAgICB2YXIgZHggPSB4MSAtIHgyO1xyXG4gICAgICAgIHZhciBkeSA9IHkxIC0geTI7XHJcblxyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuICAgIH1cclxufTtcclxuXHJcbnZhciBkZWdyZWVUb1JhZGlhbnNGYWN0b3IgPSBNYXRoLlBJIC8gMTgwO1xyXG52YXIgcmFkaWFuVG9EZWdyZWVzRmFjdG9yID0gMTgwIC8gTWF0aC5QSTtcclxuXHJcblRpbnkuTWF0aC5kZWdUb1JhZCA9IGZ1bmN0aW9uIGRlZ1RvUmFkIChkZWdyZWVzKSB7XHJcbiAgICByZXR1cm4gZGVncmVlcyAqIGRlZ3JlZVRvUmFkaWFuc0ZhY3RvcjtcclxufTtcclxuXHJcblRpbnkuTWF0aC5yYWRUb0RlZyA9IGZ1bmN0aW9uIHJhZFRvRGVnIChyYWRpYW5zKSB7XHJcbiAgICByZXR1cm4gcmFkaWFucyAqIHJhZGlhblRvRGVncmVlc0ZhY3RvcjtcclxufTsiLCJcclxuVGlueS5NYXRyaXggPSBmdW5jdGlvbigpXHJcbntcclxuXHJcbiAgICB0aGlzLmEgPSAxO1xyXG5cclxuICAgIHRoaXMuYiA9IDA7XHJcblxyXG4gICAgdGhpcy5jID0gMDtcclxuXHJcbiAgICB0aGlzLmQgPSAxO1xyXG5cclxuICAgIHRoaXMudHggPSAwO1xyXG5cclxuICAgIHRoaXMudHkgPSAwO1xyXG5cclxuICAgIHRoaXMudHlwZSA9IFRpbnkuTUFUUklYO1xyXG5cclxufTtcclxuXHJcblRpbnkuTWF0cml4LnByb3RvdHlwZS5mcm9tQXJyYXkgPSBmdW5jdGlvbihhcnJheSlcclxue1xyXG4gICAgdGhpcy5hID0gYXJyYXlbMF07XHJcbiAgICB0aGlzLmIgPSBhcnJheVsxXTtcclxuICAgIHRoaXMuYyA9IGFycmF5WzNdO1xyXG4gICAgdGhpcy5kID0gYXJyYXlbNF07XHJcbiAgICB0aGlzLnR4ID0gYXJyYXlbMl07XHJcbiAgICB0aGlzLnR5ID0gYXJyYXlbNV07XHJcbn07XHJcblxyXG5cclxuVGlueS5NYXRyaXgucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbih0cmFuc3Bvc2UpXHJcbntcclxuICAgIGlmICghdGhpcy5hcnJheSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmFycmF5ID0gbmV3IEZsb2F0MzJBcnJheSg5KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYXJyYXkgPSB0aGlzLmFycmF5O1xyXG5cclxuICAgIGlmICh0cmFuc3Bvc2UpXHJcbiAgICB7XHJcbiAgICAgICAgYXJyYXlbMF0gPSB0aGlzLmE7XHJcbiAgICAgICAgYXJyYXlbMV0gPSB0aGlzLmI7XHJcbiAgICAgICAgYXJyYXlbMl0gPSAwO1xyXG4gICAgICAgIGFycmF5WzNdID0gdGhpcy5jO1xyXG4gICAgICAgIGFycmF5WzRdID0gdGhpcy5kO1xyXG4gICAgICAgIGFycmF5WzVdID0gMDtcclxuICAgICAgICBhcnJheVs2XSA9IHRoaXMudHg7XHJcbiAgICAgICAgYXJyYXlbN10gPSB0aGlzLnR5O1xyXG4gICAgICAgIGFycmF5WzhdID0gMTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICBhcnJheVswXSA9IHRoaXMuYTtcclxuICAgICAgICBhcnJheVsxXSA9IHRoaXMuYztcclxuICAgICAgICBhcnJheVsyXSA9IHRoaXMudHg7XHJcbiAgICAgICAgYXJyYXlbM10gPSB0aGlzLmI7XHJcbiAgICAgICAgYXJyYXlbNF0gPSB0aGlzLmQ7XHJcbiAgICAgICAgYXJyYXlbNV0gPSB0aGlzLnR5O1xyXG4gICAgICAgIGFycmF5WzZdID0gMDtcclxuICAgICAgICBhcnJheVs3XSA9IDA7XHJcbiAgICAgICAgYXJyYXlbOF0gPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhcnJheTtcclxufTtcclxuXHJcblRpbnkuTWF0cml4LnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uKHBvcywgbmV3UG9zKVxyXG57XHJcbiAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFRpbnkuUG9pbnQoKTtcclxuXHJcbiAgICB2YXIgeCA9IHBvcy54O1xyXG4gICAgdmFyIHkgPSBwb3MueTtcclxuXHJcbiAgICBuZXdQb3MueCA9IHRoaXMuYSAqIHggKyB0aGlzLmMgKiB5ICsgdGhpcy50eDtcclxuICAgIG5ld1Bvcy55ID0gdGhpcy5iICogeCArIHRoaXMuZCAqIHkgKyB0aGlzLnR5O1xyXG5cclxuICAgIHJldHVybiBuZXdQb3M7XHJcbn07XHJcblxyXG5UaW55Lk1hdHJpeC5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24ocG9zLCBuZXdQb3MpXHJcbntcclxuICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgVGlueS5Qb2ludCgpO1xyXG5cclxuICAgIHZhciBpZCA9IDEgLyAodGhpcy5hICogdGhpcy5kICsgdGhpcy5jICogLXRoaXMuYik7XHJcbiAgICB2YXIgeCA9IHBvcy54O1xyXG4gICAgdmFyIHkgPSBwb3MueTtcclxuXHJcbiAgICBuZXdQb3MueCA9IHRoaXMuZCAqIGlkICogeCArIC10aGlzLmMgKiBpZCAqIHkgKyAodGhpcy50eSAqIHRoaXMuYyAtIHRoaXMudHggKiB0aGlzLmQpICogaWQ7XHJcbiAgICBuZXdQb3MueSA9IHRoaXMuYSAqIGlkICogeSArIC10aGlzLmIgKiBpZCAqIHggKyAoLXRoaXMudHkgKiB0aGlzLmEgKyB0aGlzLnR4ICogdGhpcy5iKSAqIGlkO1xyXG5cclxuICAgIHJldHVybiBuZXdQb3M7XHJcbn07XHJcblxyXG5UaW55Lk1hdHJpeC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24oeCwgeSlcclxue1xyXG4gICAgdGhpcy50eCArPSB4O1xyXG4gICAgdGhpcy50eSArPSB5O1xyXG4gICAgXHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcblRpbnkuTWF0cml4LnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uKHgsIHkpXHJcbntcclxuICAgIHRoaXMuYSAqPSB4O1xyXG4gICAgdGhpcy5kICo9IHk7XHJcbiAgICB0aGlzLmMgKj0geDtcclxuICAgIHRoaXMuYiAqPSB5O1xyXG4gICAgdGhpcy50eCAqPSB4O1xyXG4gICAgdGhpcy50eSAqPSB5O1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVGlueS5NYXRyaXgucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uKGFuZ2xlKVxyXG57XHJcbiAgICB2YXIgY29zID0gTWF0aC5jb3MoIGFuZ2xlICk7XHJcbiAgICB2YXIgc2luID0gTWF0aC5zaW4oIGFuZ2xlICk7XHJcblxyXG4gICAgdmFyIGExID0gdGhpcy5hO1xyXG4gICAgdmFyIGMxID0gdGhpcy5jO1xyXG4gICAgdmFyIHR4MSA9IHRoaXMudHg7XHJcblxyXG4gICAgdGhpcy5hID0gYTEgKiBjb3MtdGhpcy5iICogc2luO1xyXG4gICAgdGhpcy5iID0gYTEgKiBzaW4rdGhpcy5iICogY29zO1xyXG4gICAgdGhpcy5jID0gYzEgKiBjb3MtdGhpcy5kICogc2luO1xyXG4gICAgdGhpcy5kID0gYzEgKiBzaW4rdGhpcy5kICogY29zO1xyXG4gICAgdGhpcy50eCA9IHR4MSAqIGNvcyAtIHRoaXMudHkgKiBzaW47XHJcbiAgICB0aGlzLnR5ID0gdHgxICogc2luICsgdGhpcy50eSAqIGNvcztcclxuIFxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5UaW55Lk1hdHJpeC5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obWF0cml4KVxyXG57XHJcbiAgICB2YXIgYTEgPSB0aGlzLmE7XHJcbiAgICB2YXIgYjEgPSB0aGlzLmI7XHJcbiAgICB2YXIgYzEgPSB0aGlzLmM7XHJcbiAgICB2YXIgZDEgPSB0aGlzLmQ7XHJcblxyXG4gICAgdGhpcy5hICA9IG1hdHJpeC5hICogYTEgKyBtYXRyaXguYiAqIGMxO1xyXG4gICAgdGhpcy5iICA9IG1hdHJpeC5hICogYjEgKyBtYXRyaXguYiAqIGQxO1xyXG4gICAgdGhpcy5jICA9IG1hdHJpeC5jICogYTEgKyBtYXRyaXguZCAqIGMxO1xyXG4gICAgdGhpcy5kICA9IG1hdHJpeC5jICogYjEgKyBtYXRyaXguZCAqIGQxO1xyXG5cclxuICAgIHRoaXMudHggPSBtYXRyaXgudHggKiBhMSArIG1hdHJpeC50eSAqIGMxICsgdGhpcy50eDtcclxuICAgIHRoaXMudHkgPSBtYXRyaXgudHggKiBiMSArIG1hdHJpeC50eSAqIGQxICsgdGhpcy50eTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5UaW55Lk1hdHJpeC5wcm90b3R5cGUuaWRlbnRpdHkgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIHRoaXMuYSA9IDE7XHJcbiAgICB0aGlzLmIgPSAwO1xyXG4gICAgdGhpcy5jID0gMDtcclxuICAgIHRoaXMuZCA9IDE7XHJcbiAgICB0aGlzLnR4ID0gMDtcclxuICAgIHRoaXMudHkgPSAwO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVGlueS5pZGVudGl0eU1hdHJpeCA9IG5ldyBUaW55Lk1hdHJpeCgpOyIsIlRpbnkuUG9pbnQgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgdGhpcy54ID0geCB8fCAwO1xyXG4gICAgdGhpcy55ID0geSB8fCAwO1xyXG59O1xyXG5cclxuVGlueS5Qb2ludC5wcm90b3R5cGUgPSB7XHJcblx0IHNldDogZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgdGhpcy55ID0geSB8fCAoICh5ICE9PSAwKSA/IHRoaXMueCA6IDAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn07IiwiXHJcblRpbnkuUmVjdGFuZ2xlID0gZnVuY3Rpb24gKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICB4ID0geCB8fCAwO1xyXG4gICAgeSA9IHkgfHwgMDtcclxuICAgIHdpZHRoID0gd2lkdGggfHwgMDtcclxuICAgIGhlaWdodCA9IGhlaWdodCB8fCAwO1xyXG5cclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG5cclxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgIHRoaXMudHlwZSA9IFRpbnkuUHJpbWl0aXZlcy5SRUNUXHJcbn07XHJcblxyXG5UaW55LlJlY3RhbmdsZS5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgc2V0VG86IGZ1bmN0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uICh4LCB5KSB7XHJcblxyXG4gICAgICAgIHJldHVybiBUaW55LlJlY3RhbmdsZS5jb250YWlucyh0aGlzLCB4LCB5KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGludGVyc2VjdHM6IGZ1bmN0aW9uIChiKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBUaW55LlJlY3RhbmdsZS5pbnRlcnNlY3RzKHRoaXMsIGIpO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5SZWN0YW5nbGUucHJvdG90eXBlLCBcImJvdHRvbVwiLCB7XHJcblxyXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSA8PSB0aGlzLnkpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gdmFsdWUgLSB0aGlzLnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5SZWN0YW5nbGUucHJvdG90eXBlLCBcInJpZ2h0XCIsIHtcclxuXHJcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aDtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICBpZiAodmFsdWUgPD0gdGhpcy54KSB7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB2YWx1ZSAtIHRoaXMueDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShUaW55LlJlY3RhbmdsZS5wcm90b3R5cGUsIFwidm9sdW1lXCIsIHtcclxuXHJcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5UaW55LlJlY3RhbmdsZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUaW55LlJlY3RhbmdsZTtcclxuXHJcblRpbnkuUmVjdGFuZ2xlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGEsIHgsIHkpIHtcclxuXHJcbiAgICBpZiAoYS53aWR0aCA8PSAwIHx8IGEuaGVpZ2h0IDw9IDApXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoeCA+PSBhLnggJiYgeCA8IGEucmlnaHQgJiYgeSA+PSBhLnkgJiYgeSA8IGEuYm90dG9tKTtcclxuXHJcbn07XHJcblxyXG5UaW55LlJlY3RhbmdsZS5jb250YWluc1BvaW50ID0gZnVuY3Rpb24gKGEsIHBvaW50KSB7XHJcblxyXG4gICAgcmV0dXJuIFRpbnkuUmVjdGFuZ2xlLmNvbnRhaW5zKGEsIHBvaW50LngsIHBvaW50LnkpO1xyXG5cclxufTtcclxuXHJcblRpbnkuUmVjdGFuZ2xlLmNvbnRhaW5zUmVjdCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcblxyXG4gICAgLy8gIElmIHRoZSBnaXZlbiByZWN0IGhhcyBhIGxhcmdlciB2b2x1bWUgdGhhbiB0aGlzIG9uZSB0aGVuIGl0IGNhbiBuZXZlciBjb250YWluIGl0XHJcbiAgICBpZiAoYS52b2x1bWUgPiBiLnZvbHVtZSlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChhLnggPj0gYi54ICYmIGEueSA+PSBiLnkgJiYgYS5yaWdodCA8IGIucmlnaHQgJiYgYS5ib3R0b20gPCBiLmJvdHRvbSk7XHJcblxyXG59O1xyXG5cclxuVGlueS5SZWN0YW5nbGUuaW50ZXJzZWN0cyA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcblxyXG4gICAgaWYgKGEud2lkdGggPD0gMCB8fCBhLmhlaWdodCA8PSAwIHx8IGIud2lkdGggPD0gMCB8fCBiLmhlaWdodCA8PSAwKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gIShhLnJpZ2h0IDwgYi54IHx8IGEuYm90dG9tIDwgYi55IHx8IGEueCA+IGIucmlnaHQgfHwgYS55ID4gYi5ib3R0b20pO1xyXG5cclxufTtcclxuXHJcblRpbnkuRW1wdHlSZWN0YW5nbGUgPSBuZXcgVGlueS5SZWN0YW5nbGUoMCwgMCwgMCwgMCk7IiwicmVxdWlyZSgnLi9iYXNlLmpzJylcclxuXHJcblxyXG5yZXF1aXJlKCcuL3N5c3RlbXMvUkFGLmpzJyk7IC8vIDIgS2JcclxuLy8gcmVxdWlyZSgnLi9zeXN0ZW1zL09iamVjdENyZWF0b3IuanMnKTsgLy8gMSBLYlxyXG5yZXF1aXJlKCcuL3N5c3RlbXMvTG9hZGVyLmpzJyk7IC8vIDMgS2JcclxucmVxdWlyZSgnLi9zeXN0ZW1zL0lucHV0LmpzJyk7IC8vIDEgS2JcclxucmVxdWlyZSgnLi9zeXN0ZW1zL1RpbWVyLmpzJyk7IC8vIDEgS2JcclxuXHJcbnJlcXVpcmUoJy4vdXRpbHMvRXZlbnRFbWl0dGVyLmpzJyk7XHJcblxyXG5yZXF1aXJlKCcuL3RleHR1cmVzL1RleHR1cmUuanMnKTtcdFx0Ly8gNCBLYlxyXG5cclxucmVxdWlyZSgnLi9vYmplY3RzL1Nwcml0ZS5qcycpOyAvLyAzIEtiXHJcbnJlcXVpcmUoJy4vb2JqZWN0cy9UZXh0LmpzJyk7IC8vIDUgS2JcclxuXHJcblxyXG4iLCJcclxudmFyIHBpMiA9IE1hdGguUEkgKiAyO1xyXG5cclxuVGlueS5CYXNlT2JqZWN0MkQgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVGlueS5Qb2ludCgwLCAwKTtcclxuICAgIHRoaXMuc2NhbGUgPSBuZXcgVGlueS5Qb2ludCgxLCAxKTtcclxuICAgIHRoaXMucGl2b3QgPSBuZXcgVGlueS5Qb2ludCgwLCAwKTtcclxuICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gICAgdGhpcy5hbHBoYSA9IDE7XHJcbiAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xyXG4gICAgdGhpcy5yZW5kZXJhYmxlID0gZmFsc2U7XHJcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XHJcbiAgICB0aGlzLndvcmxkQWxwaGEgPSAxO1xyXG4gICAgdGhpcy53b3JsZFRyYW5zZm9ybSA9IG5ldyBUaW55Lk1hdHJpeCgpO1xyXG4gICAgdGhpcy5fc3IgPSAwO1xyXG4gICAgdGhpcy5fY3IgPSAxO1xyXG4gICAgdGhpcy5fY2FjaGVBc0JpdG1hcCA9IGZhbHNlO1xyXG59O1xyXG5cclxuXHJcblRpbnkuQmFzZU9iamVjdDJELnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRpbnkuQmFzZU9iamVjdDJEO1xyXG5cclxuXHJcblRpbnkuQmFzZU9iamVjdDJELnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBpZiAodGhpcy5wYXJlbnQpXHJcbiAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlKCB0aGlzIClcclxuXHJcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XHJcbiAgICB0aGlzLndvcmxkVHJhbnNmb3JtID0gbnVsbDtcclxuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5yZW5kZXJhYmxlID0gZmFsc2U7XHJcbiAgICB0aGlzLl9kZXN0cm95Q2FjaGVkU3ByaXRlKCk7XHJcbn07XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLCAnd29ybGRWaXNpYmxlJywge1xyXG5cclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBpdGVtID0gdGhpcztcclxuXHJcbiAgICAgICAgZG9cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghaXRlbS52aXNpYmxlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUoaXRlbSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLCAnY2FjaGVBc0JpdG1hcCcsIHtcclxuXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAgdGhpcy5fY2FjaGVBc0JpdG1hcDtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fY2FjaGVBc0JpdG1hcCA9PT0gdmFsdWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdGVDYWNoZWRTcHJpdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVzdHJveUNhY2hlZFNwcml0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY2FjaGVBc0JpdG1hcCA9IHZhbHVlO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblRpbnkuQmFzZU9iamVjdDJELnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm0gPSBmdW5jdGlvbigpXHJcbntcclxuICAgIGlmICghdGhpcy5wYXJlbnQpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNyZWF0ZSBzb21lIG1hdHJpeCByZWZzIGZvciBlYXN5IGFjY2Vzc1xyXG4gICAgdmFyIHB0ID0gdGhpcy5wYXJlbnQud29ybGRUcmFuc2Zvcm07XHJcbiAgICB2YXIgd3QgPSB0aGlzLndvcmxkVHJhbnNmb3JtO1xyXG5cclxuICAgIC8vIHRlbXBvcmFyeSBtYXRyaXggdmFyaWFibGVzXHJcbiAgICB2YXIgYSwgYiwgYywgZCwgdHgsIHR5O1xyXG5cclxuICAgIC8vIHNvIGlmIHJvdGF0aW9uIGlzIGJldHdlZW4gMCB0aGVuIHdlIGNhbiBzaW1wbGlmeSB0aGUgbXVsdGlwbGljYXRpb24gcHJvY2Vzcy4uXHJcbiAgICBpZiAodGhpcy5yb3RhdGlvbiAlIHBpMilcclxuICAgIHtcclxuICAgICAgICAvLyBjaGVjayB0byBzZWUgaWYgdGhlIHJvdGF0aW9uIGlzIHRoZSBzYW1lIGFzIHRoZSBwcmV2aW91cyByZW5kZXIuIFRoaXMgbWVhbnMgd2Ugb25seSBuZWVkIHRvIHVzZSBzaW4gYW5kIGNvcyB3aGVuIHJvdGF0aW9uIGFjdHVhbGx5IGNoYW5nZXNcclxuICAgICAgICBpZiAodGhpcy5yb3RhdGlvbiAhPT0gdGhpcy5yb3RhdGlvbkNhY2hlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGlvbkNhY2hlID0gdGhpcy5yb3RhdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5fc3IgPSBNYXRoLnNpbih0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5fY3IgPSBNYXRoLmNvcyh0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgbWF0cml4IHZhbHVlcyBvZiB0aGUgZGlzcGxheW9iamVjdCBiYXNlZCBvbiBpdHMgdHJhbnNmb3JtIHByb3BlcnRpZXMuLlxyXG4gICAgICAgIGEgID0gIHRoaXMuX2NyICogdGhpcy5zY2FsZS54O1xyXG4gICAgICAgIGIgID0gIHRoaXMuX3NyICogdGhpcy5zY2FsZS54O1xyXG4gICAgICAgIGMgID0gLXRoaXMuX3NyICogdGhpcy5zY2FsZS55O1xyXG4gICAgICAgIGQgID0gIHRoaXMuX2NyICogdGhpcy5zY2FsZS55O1xyXG4gICAgICAgIHR4ID0gIHRoaXMucG9zaXRpb24ueDtcclxuICAgICAgICB0eSA9ICB0aGlzLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY2hlY2sgZm9yIHBpdm90Li4gbm90IG9mdGVuIHVzZWQgc28gZ2VhcmVkIHRvd2FyZHMgdGhhdCBmYWN0IVxyXG4gICAgICAgIGlmICh0aGlzLnBpdm90LnggfHwgdGhpcy5waXZvdC55KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHggLT0gdGhpcy5waXZvdC54ICogYSArIHRoaXMucGl2b3QueSAqIGM7XHJcbiAgICAgICAgICAgIHR5IC09IHRoaXMucGl2b3QueCAqIGIgKyB0aGlzLnBpdm90LnkgKiBkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29uY2F0IHRoZSBwYXJlbnQgbWF0cml4IHdpdGggdGhlIG9iamVjdHMgdHJhbnNmb3JtLlxyXG4gICAgICAgIHd0LmEgID0gYSAgKiBwdC5hICsgYiAgKiBwdC5jO1xyXG4gICAgICAgIHd0LmIgID0gYSAgKiBwdC5iICsgYiAgKiBwdC5kO1xyXG4gICAgICAgIHd0LmMgID0gYyAgKiBwdC5hICsgZCAgKiBwdC5jO1xyXG4gICAgICAgIHd0LmQgID0gYyAgKiBwdC5iICsgZCAgKiBwdC5kO1xyXG4gICAgICAgIHd0LnR4ID0gdHggKiBwdC5hICsgdHkgKiBwdC5jICsgcHQudHg7XHJcbiAgICAgICAgd3QudHkgPSB0eCAqIHB0LmIgKyB0eSAqIHB0LmQgKyBwdC50eTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICAvLyBsZXRzIGRvIHRoZSBmYXN0IHZlcnNpb24gYXMgd2Uga25vdyB0aGVyZSBpcyBubyByb3RhdGlvbi4uXHJcbiAgICAgICAgYSAgPSB0aGlzLnNjYWxlLng7XHJcbiAgICAgICAgZCAgPSB0aGlzLnNjYWxlLnk7XHJcblxyXG4gICAgICAgIHR4ID0gdGhpcy5wb3NpdGlvbi54IC0gdGhpcy5waXZvdC54ICogYTtcclxuICAgICAgICB0eSA9IHRoaXMucG9zaXRpb24ueSAtIHRoaXMucGl2b3QueSAqIGQ7XHJcblxyXG4gICAgICAgIHd0LmEgID0gYSAgKiBwdC5hO1xyXG4gICAgICAgIHd0LmIgID0gYSAgKiBwdC5iO1xyXG4gICAgICAgIHd0LmMgID0gZCAgKiBwdC5jO1xyXG4gICAgICAgIHd0LmQgID0gZCAgKiBwdC5kO1xyXG4gICAgICAgIHd0LnR4ID0gdHggKiBwdC5hICsgdHkgKiBwdC5jICsgcHQudHg7XHJcbiAgICAgICAgd3QudHkgPSB0eCAqIHB0LmIgKyB0eSAqIHB0LmQgKyBwdC50eTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBtdWx0aXBseSB0aGUgYWxwaGFzLi5cclxuICAgIHRoaXMud29ybGRBbHBoYSA9IHRoaXMuYWxwaGEgKiB0aGlzLnBhcmVudC53b3JsZEFscGhhO1xyXG5cclxufTtcclxuXHJcbi8vIHBlcmZvcm1hbmNlIGluY3JlYXNlIHRvIGF2b2lkIHVzaW5nIGNhbGwuLiAoMTB4IGZhc3RlcilcclxuVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLmRpc3BsYXlPYmplY3RVcGRhdGVUcmFuc2Zvcm0gPSBUaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtO1xyXG5cclxuVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLmdldEJvdW5kcyA9IGZ1bmN0aW9uKG1hdHJpeClcclxue1xyXG4gICAgLy8gbWF0cml4ID0gbWF0cml4Oy8vanVzdCB0byBnZXQgcGFzc2VkIGpzIGhpbnRpbmcgKGFuZCBwcmVzZXJ2ZSBpbmhlcml0YW5jZSlcclxuICAgIHJldHVybiBUaW55LkVtcHR5UmVjdGFuZ2xlO1xyXG59O1xyXG5cclxuVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLmdldExvY2FsQm91bmRzID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICByZXR1cm4gdGhpcy5nZXRCb3VuZHMoVGlueS5pZGVudGl0eU1hdHJpeCk7XHJcbn07XHJcblxyXG5UaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUuZ2VuZXJhdGVUZXh0dXJlID0gZnVuY3Rpb24ocmVzb2x1dGlvbiwgcmVuZGVyZXIpXHJcbntcclxuICAgIHZhciBib3VuZHMgPSB0aGlzLmdldExvY2FsQm91bmRzKCk7XHJcblxyXG4gICAgdmFyIHJlbmRlclRleHR1cmUgPSBuZXcgVGlueS5SZW5kZXJUZXh0dXJlKGJvdW5kcy53aWR0aCB8IDAsIGJvdW5kcy5oZWlnaHQgfCAwLCByZW5kZXJlciwgcmVzb2x1dGlvbik7XHJcbiAgICBcclxuICAgIFRpbnkuQmFzZU9iamVjdDJELl90ZW1wTWF0cml4LnR4ID0gLWJvdW5kcy54O1xyXG4gICAgVGlueS5CYXNlT2JqZWN0MkQuX3RlbXBNYXRyaXgudHkgPSAtYm91bmRzLnk7XHJcbiAgICBcclxuICAgIHJlbmRlclRleHR1cmUucmVuZGVyKHRoaXMsIFRpbnkuQmFzZU9iamVjdDJELl90ZW1wTWF0cml4KTtcclxuXHJcbiAgICByZXR1cm4gcmVuZGVyVGV4dHVyZTtcclxufTtcclxuXHJcblRpbnkuQmFzZU9iamVjdDJELnByb3RvdHlwZS51cGRhdGVDYWNoZSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5fZ2VuZXJhdGVDYWNoZWRTcHJpdGUoKTtcclxufTtcclxuXHJcblxyXG5UaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUudG9HbG9iYWwgPSBmdW5jdGlvbihwb3NpdGlvbilcclxue1xyXG4gICAgLy8gZG9uJ3QgbmVlZCB0byB1W2RhdGUgdGhlIGxvdFxyXG4gICAgdGhpcy5kaXNwbGF5T2JqZWN0VXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcy53b3JsZFRyYW5zZm9ybS5hcHBseShwb3NpdGlvbik7XHJcbn07XHJcblxyXG5UaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUudG9Mb2NhbCA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBmcm9tKVxyXG57XHJcbiAgICBpZiAoZnJvbSlcclxuICAgIHtcclxuICAgICAgICBwb3NpdGlvbiA9IGZyb20udG9HbG9iYWwocG9zaXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRvbid0IG5lZWQgdG8gdVtkYXRlIHRoZSBsb3RcclxuICAgIHRoaXMuZGlzcGxheU9iamVjdFVwZGF0ZVRyYW5zZm9ybSgpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShwb3NpdGlvbik7XHJcbn07XHJcblxyXG5UaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUuX3JlbmRlckNhY2hlZFNwcml0ZSA9IGZ1bmN0aW9uKHJlbmRlclNlc3Npb24pXHJcbntcclxuICAgIHRoaXMuX2NhY2hlZFNwcml0ZS53b3JsZEFscGhhID0gdGhpcy53b3JsZEFscGhhO1xyXG5cclxuICAgIFRpbnkuU3ByaXRlLnByb3RvdHlwZS5yZW5kZXIuY2FsbCh0aGlzLl9jYWNoZWRTcHJpdGUsIHJlbmRlclNlc3Npb24pO1xyXG4gICAgXHJcbn07XHJcblxyXG5UaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUuX2dlbmVyYXRlQ2FjaGVkU3ByaXRlID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLl9jYWNoZWRTcHJpdGUgPSBudWxsO1xyXG4gICAgdGhpcy5fY2FjaGVBc0JpdG1hcCA9IGZhbHNlO1xyXG5cclxuICAgIHZhciBib3VuZHMgPSB0aGlzLmdldExvY2FsQm91bmRzKCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLl9jYWNoZWRTcHJpdGUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJlbmRlclRleHR1cmUgPSBuZXcgVGlueS5SZW5kZXJUZXh0dXJlKGJvdW5kcy53aWR0aCB8IDAsIGJvdW5kcy5oZWlnaHQgfCAwKTsvLywgcmVuZGVyU2Vzc2lvbi5yZW5kZXJlcik7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhY2hlZFNwcml0ZSA9IG5ldyBUaW55LlNwcml0ZShyZW5kZXJUZXh0dXJlKTtcclxuICAgICAgICB0aGlzLl9jYWNoZWRTcHJpdGUud29ybGRUcmFuc2Zvcm0gPSB0aGlzLndvcmxkVHJhbnNmb3JtO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2NhY2hlZFNwcml0ZS50ZXh0dXJlLnJlc2l6ZShib3VuZHMud2lkdGggfCAwLCBib3VuZHMuaGVpZ2h0IHwgMCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIFRpbnkuQmFzZU9iamVjdDJELl90ZW1wTWF0cml4LnR4ID0gLWJvdW5kcy54O1xyXG4gICAgVGlueS5CYXNlT2JqZWN0MkQuX3RlbXBNYXRyaXgudHkgPSAtYm91bmRzLnk7XHJcbiAgICBcclxuICAgIHRoaXMuX2NhY2hlZFNwcml0ZS50ZXh0dXJlLnJlbmRlcih0aGlzLCBUaW55LkJhc2VPYmplY3QyRC5fdGVtcE1hdHJpeCwgdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5fY2FjaGVkU3ByaXRlLmFuY2hvci54ID0gLSggYm91bmRzLnggLyBib3VuZHMud2lkdGggKTtcclxuICAgIHRoaXMuX2NhY2hlZFNwcml0ZS5hbmNob3IueSA9IC0oIGJvdW5kcy55IC8gYm91bmRzLmhlaWdodCApO1xyXG5cclxuICAgIHRoaXMuX2NhY2hlQXNCaXRtYXAgPSB0cnVlO1xyXG59O1xyXG5cclxuVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLl9kZXN0cm95Q2FjaGVkU3ByaXRlID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBpZiAoIXRoaXMuX2NhY2hlZFNwcml0ZSkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuX2NhY2hlZFNwcml0ZS50ZXh0dXJlLmRlc3Ryb3kodHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5fY2FjaGVkU3ByaXRlID0gbnVsbDtcclxufTtcclxuXHJcblxyXG5UaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24ocmVuZGVyU2Vzc2lvbilcclxue1xyXG4gICAgXHJcbn07XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlLCAneCcsIHtcclxuXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuQmFzZU9iamVjdDJELnByb3RvdHlwZSwgJ3knLCB7XHJcblxyXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi55O1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcblRpbnkuQmFzZU9iamVjdDJELl90ZW1wTWF0cml4ID0gbmV3IFRpbnkuTWF0cml4KCk7IiwiXHJcblRpbnkuT2JqZWN0MkQgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIFRpbnkuQmFzZU9iamVjdDJELmNhbGwodGhpcyk7XHJcblxyXG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgdGhpcy5fYm91bmRzID0gbmV3IFRpbnkuUmVjdGFuZ2xlKDAsIDAsIDEsIDEpO1xyXG4gICAgdGhpcy5fY3VycmVudEJvdW5kcyA9IG51bGw7XHJcbiAgICB0aGlzLl9tYXNrID0gbnVsbDtcclxufTtcclxuXHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVGlueS5CYXNlT2JqZWN0MkQucHJvdG90eXBlICk7XHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVGlueS5PYmplY3QyRDtcclxuXHJcbi8vIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUaW55Lk9iamVjdDJELnByb3RvdHlwZSwgJ2lucHV0RW5hYmxlZCcsIHtcclxuXHJcbi8vICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4vLyAgICAgICAgIHJldHVybiAodGhpcy5pbnB1dCAmJiB0aGlzLmlucHV0LmVuYWJsZWQpXHJcbi8vICAgICB9LFxyXG5cclxuLy8gICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuLy8gICAgICAgICBpZiAodmFsdWUpIHtcclxuLy8gICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXQgPT09IG51bGwpIHtcclxuLy8gICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQgPSB7ZW5hYmxlZDogdHJ1ZSwgcGFyZW50OiB0aGlzfVxyXG4vLyAgICAgICAgICAgICAgICAgVGlueS5FdmVudFRhcmdldC5taXhpbih0aGlzLmlucHV0KVxyXG4vLyAgICAgICAgICAgICB9IGVsc2UgXHJcbi8vICAgICAgICAgICAgICAgICB0aGlzLmlucHV0LmVuYWJsZWQgPSB0cnVlXHJcbi8vICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgdGhpcy5pbnB1dCAhPT0gbnVsbCAmJiAodGhpcy5pbnB1dC5lbmFibGVkID0gZmFsc2UpXHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG5cclxuLy8gfSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5PYmplY3QyRC5wcm90b3R5cGUsICd3aWR0aCcsIHtcclxuXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlLnggKiB0aGlzLmdldExvY2FsQm91bmRzKCkud2lkdGg7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmdldExvY2FsQm91bmRzKCkud2lkdGg7XHJcblxyXG4gICAgICAgIGlmKHdpZHRoICE9PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY2FsZS54ID0gdmFsdWUgLyB3aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY2FsZS54ID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuT2JqZWN0MkQucHJvdG90eXBlLCAnaGVpZ2h0Jywge1xyXG5cclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICB0aGlzLnNjYWxlLnkgKiB0aGlzLmdldExvY2FsQm91bmRzKCkuaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblxyXG4gICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmdldExvY2FsQm91bmRzKCkuaGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAoaGVpZ2h0ICE9PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY2FsZS55ID0gdmFsdWUgLyBoZWlnaHQgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjYWxlLnkgPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShUaW55Lk9iamVjdDJELnByb3RvdHlwZSwgJ21hc2snLCB7XHJcblxyXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWFzaztcclxuICAgIH0sXHJcblxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbWFzaykgdGhpcy5fbWFzay5pc01hc2sgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5fbWFzayA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbWFzaykgdGhpcy5fbWFzay5pc01hc2sgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB2YXIgaSA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xyXG5cclxuICAgIHdoaWxlIChpLS0pXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgXHJcbiAgICBUaW55LkJhc2VPYmplY3QyRC5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuX2JvdW5kcyA9IG51bGw7XHJcbiAgICB0aGlzLl9jdXJyZW50Qm91bmRzID0gbnVsbDtcclxuICAgIHRoaXMuX21hc2sgPSBudWxsO1xyXG4gICAgXHJcbiAgICBpZiAodGhpcy5pbnB1dCkgdGhpcy5pbnB1dC5zeXN0ZW0ucmVtb3ZlKHRoaXMpO1xyXG59O1xyXG5cclxuVGlueS5PYmplY3QyRC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oY2hpbGQpXHJcbntcclxuICAgIHJldHVybiB0aGlzLmFkZENoaWxkQXQoY2hpbGQsIHRoaXMuY2hpbGRyZW4ubGVuZ3RoKTtcclxufTtcclxuXHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlLmFkZENoaWxkQXQgPSBmdW5jdGlvbihjaGlsZCwgaW5kZXgpXHJcbntcclxuICAgIGlmKGluZGV4ID49IDAgJiYgaW5kZXggPD0gdGhpcy5jaGlsZHJlbi5sZW5ndGgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYoY2hpbGQucGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2hpbGQucGFyZW50LnJlbW92ZShjaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5nYW1lKSBjaGlsZC5nYW1lID0gdGhpcy5nYW1lO1xyXG5cclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xyXG5cclxuICAgICAgICByZXR1cm4gY2hpbGQ7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGNoaWxkICsgJ2FkZENoaWxkQXQ6IFRoZSBpbmRleCAnKyBpbmRleCArJyBzdXBwbGllZCBpcyBvdXQgb2YgYm91bmRzICcgKyB0aGlzLmNoaWxkcmVuLmxlbmd0aCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5zd2FwQ2hpbGRyZW4gPSBmdW5jdGlvbihjaGlsZCwgY2hpbGQyKVxyXG57XHJcbiAgICBpZihjaGlsZCA9PT0gY2hpbGQyKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpbmRleDEgPSB0aGlzLmdldENoaWxkSW5kZXgoY2hpbGQpO1xyXG4gICAgdmFyIGluZGV4MiA9IHRoaXMuZ2V0Q2hpbGRJbmRleChjaGlsZDIpO1xyXG5cclxuICAgIGlmKGluZGV4MSA8IDAgfHwgaW5kZXgyIDwgMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc3dhcENoaWxkcmVuOiBCb3RoIHRoZSBzdXBwbGllZCBPYmplY3RzIG11c3QgYmUgYSBjaGlsZCBvZiB0aGUgY2FsbGVyLicpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2hpbGRyZW5baW5kZXgxXSA9IGNoaWxkMjtcclxuICAgIHRoaXMuY2hpbGRyZW5baW5kZXgyXSA9IGNoaWxkO1xyXG5cclxufTtcclxuXHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlLmdldENoaWxkSW5kZXggPSBmdW5jdGlvbihjaGlsZClcclxue1xyXG4gICAgdmFyIGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNoaWxkKTtcclxuICAgIGlmIChpbmRleCA9PT0gLTEpXHJcbiAgICB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc3VwcGxpZWQgT2JqZWN0IG11c3QgYmUgYSBjaGlsZCBvZiB0aGUgY2FsbGVyJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5kZXg7XHJcbn07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5zZXRDaGlsZEluZGV4ID0gZnVuY3Rpb24oY2hpbGQsIGluZGV4KVxyXG57XHJcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHN1cHBsaWVkIGluZGV4IGlzIG91dCBvZiBib3VuZHMnKTtcclxuICAgIH1cclxuICAgIHZhciBjdXJyZW50SW5kZXggPSB0aGlzLmdldENoaWxkSW5kZXgoY2hpbGQpO1xyXG4gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoY3VycmVudEluZGV4LCAxKTsgLy9yZW1vdmUgZnJvbSBvbGQgcG9zaXRpb25cclxuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZCk7IC8vYWRkIGF0IG5ldyBwb3NpdGlvblxyXG59O1xyXG5cclxuVGlueS5PYmplY3QyRC5wcm90b3R5cGUuZ2V0Q2hpbGRBdCA9IGZ1bmN0aW9uKGluZGV4KVxyXG57XHJcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0Q2hpbGRBdDogU3VwcGxpZWQgaW5kZXggJysgaW5kZXggKycgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGNoaWxkIGxpc3QsIG9yIHRoZSBzdXBwbGllZCBPYmplY3QgbXVzdCBiZSBhIGNoaWxkIG9mIHRoZSBjYWxsZXInKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2luZGV4XTtcclxuICAgIFxyXG59O1xyXG5cclxuVGlueS5PYmplY3QyRC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oY2hpbGQpXHJcbntcclxuICAgIHZhciBpbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZiggY2hpbGQgKTtcclxuICAgIGlmKGluZGV4ID09PSAtMSlyZXR1cm47XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzLnJlbW92ZUNoaWxkQXQoIGluZGV4ICk7XHJcbn07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5yZW1vdmVDaGlsZEF0ID0gZnVuY3Rpb24oaW5kZXgpXHJcbntcclxuICAgIHZhciBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGRBdCggaW5kZXggKTtcclxuICAgIGNoaWxkLnBhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKCBpbmRleCwgMSApO1xyXG4gICAgcmV0dXJuIGNoaWxkO1xyXG59O1xyXG5cclxuVGlueS5PYmplY3QyRC5wcm90b3R5cGUucmVtb3ZlQ2hpbGRyZW4gPSBmdW5jdGlvbihiZWdpbkluZGV4LCBlbmRJbmRleClcclxue1xyXG4gICAgdmFyIGJlZ2luID0gYmVnaW5JbmRleCB8fCAwO1xyXG4gICAgdmFyIGVuZCA9IHR5cGVvZiBlbmRJbmRleCA9PT0gJ251bWJlcicgPyBlbmRJbmRleCA6IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgdmFyIHJhbmdlID0gZW5kIC0gYmVnaW47XHJcblxyXG4gICAgaWYgKHJhbmdlID4gMCAmJiByYW5nZSA8PSBlbmQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJlbW92ZWQgPSB0aGlzLmNoaWxkcmVuLnNwbGljZShiZWdpbiwgcmFuZ2UpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVtb3ZlZC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSByZW1vdmVkW2ldO1xyXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZW1vdmVkO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocmFuZ2UgPT09IDAgJiYgdGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDApXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ3JlbW92ZUNoaWxkcmVuOiBSYW5nZSBFcnJvciwgbnVtZXJpYyB2YWx1ZXMgYXJlIG91dHNpZGUgdGhlIGFjY2VwdGFibGUgcmFuZ2UnICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm0gPSBmdW5jdGlvbigpXHJcbntcclxuICAgIGlmKCF0aGlzLnZpc2libGUpcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuZGlzcGxheU9iamVjdFVwZGF0ZVRyYW5zZm9ybSgpO1xyXG5cclxuICAgIGlmKHRoaXMuX2NhY2hlQXNCaXRtYXApcmV0dXJuO1xyXG5cclxuICAgIGZvcih2YXIgaT0wLGo9dGhpcy5jaGlsZHJlbi5sZW5ndGg7IGk8ajsgaSsrKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBwZXJmb3JtYW5jZSBpbmNyZWFzZSB0byBhdm9pZCB1c2luZyBjYWxsLi4gKDEweCBmYXN0ZXIpXHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlLmRpc3BsYXlPYmplY3RDb250YWluZXJVcGRhdGVUcmFuc2Zvcm0gPSBUaW55Lk9iamVjdDJELnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5nZXRCb3VuZHMgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwKXJldHVybiBUaW55LkVtcHR5UmVjdGFuZ2xlO1xyXG4gICAgaWYgKHRoaXMuX2NhY2hlZFNwcml0ZSkgcmV0dXJuIHRoaXMuX2NhY2hlZFNwcml0ZS5nZXRCb3VuZHMoKVxyXG5cclxuICAgIC8vIFRPRE8gdGhlIGJvdW5kcyBoYXZlIGFscmVhZHkgYmVlbiBjYWxjdWxhdGVkIHRoaXMgcmVuZGVyIHNlc3Npb24gc28gcmV0dXJuIHdoYXQgd2UgaGF2ZVxyXG5cclxuICAgIHZhciBtaW5YID0gSW5maW5pdHk7XHJcbiAgICB2YXIgbWluWSA9IEluZmluaXR5O1xyXG5cclxuICAgIHZhciBtYXhYID0gLUluZmluaXR5O1xyXG4gICAgdmFyIG1heFkgPSAtSW5maW5pdHk7XHJcblxyXG4gICAgdmFyIGNoaWxkQm91bmRzO1xyXG4gICAgdmFyIGNoaWxkTWF4WDtcclxuICAgIHZhciBjaGlsZE1heFk7XHJcblxyXG4gICAgdmFyIGNoaWxkVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgIGZvcih2YXIgaT0wLGo9dGhpcy5jaGlsZHJlbi5sZW5ndGg7IGk8ajsgaSsrKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIWNoaWxkLnZpc2libGUpY29udGludWU7XHJcblxyXG4gICAgICAgIGNoaWxkVmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgIGNoaWxkQm91bmRzID0gdGhpcy5jaGlsZHJlbltpXS5nZXRCb3VuZHMoKTtcclxuICAgICBcclxuICAgICAgICBtaW5YID0gbWluWCA8IGNoaWxkQm91bmRzLnggPyBtaW5YIDogY2hpbGRCb3VuZHMueDtcclxuICAgICAgICBtaW5ZID0gbWluWSA8IGNoaWxkQm91bmRzLnkgPyBtaW5ZIDogY2hpbGRCb3VuZHMueTtcclxuXHJcbiAgICAgICAgY2hpbGRNYXhYID0gY2hpbGRCb3VuZHMud2lkdGggKyBjaGlsZEJvdW5kcy54O1xyXG4gICAgICAgIGNoaWxkTWF4WSA9IGNoaWxkQm91bmRzLmhlaWdodCArIGNoaWxkQm91bmRzLnk7XHJcblxyXG4gICAgICAgIG1heFggPSBtYXhYID4gY2hpbGRNYXhYID8gbWF4WCA6IGNoaWxkTWF4WDtcclxuICAgICAgICBtYXhZID0gbWF4WSA+IGNoaWxkTWF4WSA/IG1heFkgOiBjaGlsZE1heFk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIWNoaWxkVmlzaWJsZSlcclxuICAgICAgICByZXR1cm4gVGlueS5FbXB0eVJlY3RhbmdsZTtcclxuXHJcbiAgICB2YXIgYm91bmRzID0gdGhpcy5fYm91bmRzO1xyXG5cclxuICAgIGJvdW5kcy54ID0gbWluWDtcclxuICAgIGJvdW5kcy55ID0gbWluWTtcclxuICAgIGJvdW5kcy53aWR0aCA9IG1heFggLSBtaW5YO1xyXG4gICAgYm91bmRzLmhlaWdodCA9IG1heFkgLSBtaW5ZO1xyXG5cclxuICAgIC8vIFRPRE86IHN0b3JlIGEgcmVmZXJlbmNlIHNvIHRoYXQgaWYgdGhpcyBmdW5jdGlvbiBnZXRzIGNhbGxlZCBhZ2FpbiBpbiB0aGUgcmVuZGVyIGN5Y2xlIHdlIGRvIG5vdCBoYXZlIHRvIHJlY2FsY3VsYXRlXHJcbiAgICAvL3RoaXMuX2N1cnJlbnRCb3VuZHMgPSBib3VuZHM7XHJcbiAgIFxyXG4gICAgcmV0dXJuIGJvdW5kcztcclxufTtcclxuXHJcblRpbnkuT2JqZWN0MkQucHJvdG90eXBlLmdldExvY2FsQm91bmRzID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB2YXIgbWF0cml4Q2FjaGUgPSB0aGlzLndvcmxkVHJhbnNmb3JtO1xyXG5cclxuICAgIHRoaXMud29ybGRUcmFuc2Zvcm0gPSBUaW55LmlkZW50aXR5TWF0cml4O1xyXG5cclxuICAgIGZvcih2YXIgaT0wLGo9dGhpcy5jaGlsZHJlbi5sZW5ndGg7IGk8ajsgaSsrKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGJvdW5kcyA9IHRoaXMuZ2V0Qm91bmRzKCk7XHJcblxyXG4gICAgdGhpcy53b3JsZFRyYW5zZm9ybSA9IG1hdHJpeENhY2hlO1xyXG5cclxuICAgIHJldHVybiBib3VuZHM7XHJcbn07XHJcblxyXG5UaW55Lk9iamVjdDJELnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihyZW5kZXJTZXNzaW9uKVxyXG57XHJcbiAgICBpZiAodGhpcy52aXNpYmxlID09PSBmYWxzZSB8fCB0aGlzLmFscGhhID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgaWYgKHRoaXMuX2NhY2hlQXNCaXRtYXApXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyQ2FjaGVkU3ByaXRlKHJlbmRlclNlc3Npb24pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fbWFzaylcclxuICAgIHtcclxuICAgICAgICByZW5kZXJTZXNzaW9uLm1hc2tNYW5hZ2VyLnB1c2hNYXNrKHRoaXMuX21hc2ssIHJlbmRlclNlc3Npb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnJlbmRlcihyZW5kZXJTZXNzaW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fbWFzaylcclxuICAgIHtcclxuICAgICAgICByZW5kZXJTZXNzaW9uLm1hc2tNYW5hZ2VyLnBvcE1hc2socmVuZGVyU2Vzc2lvbik7XHJcbiAgICB9XHJcbn07IiwiVGlueS5TY2VuZSA9IGZ1bmN0aW9uKGdhbWUpXHJcbntcclxuICAgIFRpbnkuT2JqZWN0MkQuY2FsbCggdGhpcyApO1xyXG4gICAgdGhpcy53b3JsZFRyYW5zZm9ybSA9IG5ldyBUaW55Lk1hdHJpeCgpO1xyXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcclxufTtcclxuXHJcblRpbnkuU2NlbmUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVGlueS5PYmplY3QyRC5wcm90b3R5cGUgKTtcclxuVGlueS5TY2VuZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUaW55LlNjZW5lO1xyXG5cclxuVGlueS5TY2VuZS5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLndvcmxkQWxwaGEgPSAxO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG59OyIsIlxyXG5UaW55LlNwcml0ZSA9IGZ1bmN0aW9uKHRleHR1cmUsIGtleSlcclxue1xyXG4gICAgVGlueS5PYmplY3QyRC5jYWxsKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuYW5jaG9yID0gbmV3IFRpbnkuUG9pbnQoKTtcclxuXHJcbiAgICB0aGlzLnNldFRleHR1cmUodGV4dHVyZSwga2V5LCBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5fd2lkdGggPSAwO1xyXG5cclxuICAgIHRoaXMuX2hlaWdodCA9IDA7XHJcblxyXG4gICAgdGhpcy5fZnJhbWUgPSAwO1xyXG5cclxuICAgIHRoaXMudGludCA9IFwiI0ZGRkZGRlwiO1xyXG5cclxuICAgIHRoaXMuYmxlbmRNb2RlID0gXCJzb3VyY2Utb3ZlclwiO1xyXG5cclxuICAgIGlmICh0aGlzLnRleHR1cmUuaGFzTG9hZGVkKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub25UZXh0dXJlVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZW5kZXJhYmxlID0gdHJ1ZTtcclxufTtcclxuXHJcblxyXG5UaW55LlNwcml0ZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRpbnkuT2JqZWN0MkQucHJvdG90eXBlKTtcclxuVGlueS5TcHJpdGUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVGlueS5TcHJpdGU7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5TcHJpdGUucHJvdG90eXBlLCAnZnJhbWVOYW1lJywge1xyXG5cclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dHVyZS5mcmFtZS5uYW1lXHJcbiAgICB9LFxyXG5cclxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy50ZXh0dXJlLmZyYW1lLm5hbWUpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKFRpbnkuQ2FjaGUudGV4dHVyZVt0aGlzLnRleHR1cmUua2V5ICsgXCIuXCIgKyB2YWx1ZV0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5TcHJpdGUucHJvdG90eXBlLCAnZnJhbWUnLCB7XHJcblxyXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZnJhbWVcclxuICAgIH0sXHJcblxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnRleHR1cmUubGFzdEZyYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lID0gdmFsdWVcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ZyYW1lID4gdGhpcy50ZXh0dXJlLmxhc3RGcmFtZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lID0gMFxyXG4gICAgICAgICAgICB0aGlzLnNldFRleHR1cmUoVGlueS5DYWNoZS50ZXh0dXJlW3RoaXMudGV4dHVyZS5rZXkgKyBcIi5cIiArIHRoaXMuX2ZyYW1lXSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShUaW55LlNwcml0ZS5wcm90b3R5cGUsICd3aWR0aCcsIHtcclxuXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlLnggKiB0aGlzLnRleHR1cmUuZnJhbWUud2lkdGg7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNjYWxlLnggPSB2YWx1ZSAvIHRoaXMudGV4dHVyZS5mcmFtZS53aWR0aDtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVGlueS5TcHJpdGUucHJvdG90eXBlLCAnaGVpZ2h0Jywge1xyXG5cclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICB0aGlzLnNjYWxlLnkgKiB0aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zY2FsZS55ID0gdmFsdWUgLyB0aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5UaW55LlNwcml0ZS5wcm90b3R5cGUuc2V0VGV4dHVyZSA9IGZ1bmN0aW9uKHRleHR1cmUsIGtleSwgdXBkYXRlRGltZW5zaW9uKVxyXG57XHJcbiAgICBpZiAodHlwZW9mIHRleHR1cmUgPT0gXCJzdHJpbmdcIikgXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGltYWdlUGF0aCA9IHRleHR1cmU7XHJcblxyXG4gICAgICAgIGlmIChrZXkgIT0gdW5kZWZpbmVkKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGltYWdlUGF0aCA9IGltYWdlUGF0aCArIFwiLlwiICsga2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGV4dHVyZSA9IFRpbnkuQ2FjaGUudGV4dHVyZVtpbWFnZVBhdGhdO1xyXG5cclxuICAgICAgICBpZiAoIXRleHR1cmUpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dHVyZSA9IG5ldyBUaW55LlRleHR1cmUoaW1hZ2VQYXRoKTtcclxuICAgICAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKCdDYWNoZSBFcnJvcjogaW1hZ2UgJyArIGltYWdlUGF0aCArICcgZG9lc2B0IGZvdW5kIGluIGNhY2hlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRleHR1cmUgPT09IHRleHR1cmUpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gICAgdGhpcy5jYWNoZWRUaW50ID0gXCIjRkZGRkZGXCI7XHJcblxyXG4gICAgaWYgKHVwZGF0ZURpbWVuc2lvbiA9PT0gdHJ1ZSkgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vblRleHR1cmVVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcblRpbnkuU3ByaXRlLnByb3RvdHlwZS5vblRleHR1cmVVcGRhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIC8vIHNvIGlmIF93aWR0aCBpcyAwIHRoZW4gd2lkdGggd2FzIG5vdCBzZXQuLlxyXG4gICAgaWYgKHRoaXMuX3dpZHRoKSB0aGlzLnNjYWxlLnggPSB0aGlzLl93aWR0aCAvIHRoaXMudGV4dHVyZS5mcmFtZS53aWR0aDtcclxuICAgIGlmICh0aGlzLl9oZWlnaHQpIHRoaXMuc2NhbGUueSA9IHRoaXMuX2hlaWdodCAvIHRoaXMudGV4dHVyZS5mcmFtZS5oZWlnaHQ7XHJcbn07XHJcblxyXG5UaW55LlNwcml0ZS5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uKHRpbWVyLCBkZWxheSlcclxue1xyXG4gICAgaWYgKHRoaXMudGV4dHVyZS5sYXN0RnJhbWUgJiYgdGhpcy50ZXh0dXJlLmZyYW1lLmluZGV4ICE9IHVuZGVmaW5lZCkgXHJcbiAgICB7XHJcbiAgICAgICAgZGVsYXkgPSBkZWxheSB8fCAodGhpcy50ZXh0dXJlLmZyYW1lLmR1cmF0aW9uIHx8IDEwMCk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5hbmltYXRpb24pIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSB0aW1lci5sb29wKGRlbGF5LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZnJhbWUgKz0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLmRlbGF5ID0gZGVsYXkgfHwgKHRoaXMudGV4dHVyZS5mcmFtZS5kdXJhdGlvbiB8fCAxMDApO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uc3RhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uZGVsYXkgPSBkZWxheTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uc3RhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55LlNwcml0ZS5wcm90b3R5cGUuZ2V0Qm91bmRzID0gZnVuY3Rpb24obWF0cml4KVxyXG57XHJcbiAgICB2YXIgd2lkdGggPSB0aGlzLnRleHR1cmUuZnJhbWUud2lkdGggLyB0aGlzLnRleHR1cmUucmVzb2x1dGlvbjtcclxuICAgIHZhciBoZWlnaHQgPSB0aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0IC8gdGhpcy50ZXh0dXJlLnJlc29sdXRpb247XHJcblxyXG4gICAgdmFyIHcwID0gd2lkdGggKiAoMS10aGlzLmFuY2hvci54KTtcclxuICAgIHZhciB3MSA9IHdpZHRoICogLXRoaXMuYW5jaG9yLng7XHJcblxyXG4gICAgdmFyIGgwID0gaGVpZ2h0ICogKDEtdGhpcy5hbmNob3IueSk7XHJcbiAgICB2YXIgaDEgPSBoZWlnaHQgKiAtdGhpcy5hbmNob3IueTtcclxuXHJcbiAgICB2YXIgd29ybGRUcmFuc2Zvcm0gPSBtYXRyaXggfHwgdGhpcy53b3JsZFRyYW5zZm9ybTtcclxuXHJcbiAgICB2YXIgYSA9IHdvcmxkVHJhbnNmb3JtLmE7XHJcbiAgICB2YXIgYiA9IHdvcmxkVHJhbnNmb3JtLmI7XHJcbiAgICB2YXIgYyA9IHdvcmxkVHJhbnNmb3JtLmM7XHJcbiAgICB2YXIgZCA9IHdvcmxkVHJhbnNmb3JtLmQ7XHJcbiAgICB2YXIgdHggPSB3b3JsZFRyYW5zZm9ybS50eDtcclxuICAgIHZhciB0eSA9IHdvcmxkVHJhbnNmb3JtLnR5O1xyXG5cclxuICAgIHZhciBtYXhYID0gLUluZmluaXR5O1xyXG4gICAgdmFyIG1heFkgPSAtSW5maW5pdHk7XHJcblxyXG4gICAgdmFyIG1pblggPSBJbmZpbml0eTtcclxuICAgIHZhciBtaW5ZID0gSW5maW5pdHk7XHJcblxyXG4gICAgaWYgKGIgPT09IDAgJiYgYyA9PT0gMClcclxuICAgIHtcclxuICAgICAgICAvLyAvLyBzY2FsZSBtYXkgYmUgbmVnYXRpdmUhXHJcbiAgICAgICAgLy8gaWYgKGEgPCAwKSBhICo9IC0xO1xyXG4gICAgICAgIC8vIGlmIChkIDwgMCkgZCAqPSAtMTtcclxuXHJcbiAgICAgICAgLy8gLy8gdGhpcyBtZWFucyB0aGVyZSBpcyBubyByb3RhdGlvbiBnb2luZyBvbiByaWdodD8gUklHSFQ/XHJcbiAgICAgICAgLy8gLy8gaWYgdGhhdHMgdGhlIGNhc2UgdGhlbiB3ZSBjYW4gYXZvaWQgY2hlY2tpbmcgdGhlIGJvdW5kIHZhbHVlcyEgeWF5ICAgICAgICAgXHJcbiAgICAgICAgLy8gbWluWCA9IGEgKiB3MSArIHR4O1xyXG4gICAgICAgIC8vIG1heFggPSBhICogdzAgKyB0eDtcclxuICAgICAgICAvLyBtaW5ZID0gZCAqIGgxICsgdHk7XHJcbiAgICAgICAgLy8gbWF4WSA9IGQgKiBoMCArIHR5O1xyXG5cclxuICAgICAgICBpZiAoYSA8IDApIHtcclxuICAgICAgICAgICAgbWluWCA9IGEgKiB3MCArIHR4O1xyXG4gICAgICAgICAgICBtYXhYID0gYSAqIHcxICsgdHg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbWluWCA9IGEgKiB3MSArIHR4O1xyXG4gICAgICAgICAgICBtYXhYID0gYSAqIHcwICsgdHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZCA8IDApIHtcclxuICAgICAgICAgICAgbWluWSA9IGQgKiBoMCArIHR5O1xyXG4gICAgICAgICAgICBtYXhZID0gZCAqIGgxICsgdHk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbWluWSA9IGQgKiBoMSArIHR5O1xyXG4gICAgICAgICAgICBtYXhZID0gZCAqIGgwICsgdHk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIHZhciB4MSA9IGEgKiB3MSArIGMgKiBoMSArIHR4O1xyXG4gICAgICAgIHZhciB5MSA9IGQgKiBoMSArIGIgKiB3MSArIHR5O1xyXG5cclxuICAgICAgICB2YXIgeDIgPSBhICogdzAgKyBjICogaDEgKyB0eDtcclxuICAgICAgICB2YXIgeTIgPSBkICogaDEgKyBiICogdzAgKyB0eTtcclxuXHJcbiAgICAgICAgdmFyIHgzID0gYSAqIHcwICsgYyAqIGgwICsgdHg7XHJcbiAgICAgICAgdmFyIHkzID0gZCAqIGgwICsgYiAqIHcwICsgdHk7XHJcblxyXG4gICAgICAgIHZhciB4NCA9ICBhICogdzEgKyBjICogaDAgKyB0eDtcclxuICAgICAgICB2YXIgeTQgPSAgZCAqIGgwICsgYiAqIHcxICsgdHk7XHJcblxyXG4gICAgICAgIG1pblggPSB4MSA8IG1pblggPyB4MSA6IG1pblg7XHJcbiAgICAgICAgbWluWCA9IHgyIDwgbWluWCA/IHgyIDogbWluWDtcclxuICAgICAgICBtaW5YID0geDMgPCBtaW5YID8geDMgOiBtaW5YO1xyXG4gICAgICAgIG1pblggPSB4NCA8IG1pblggPyB4NCA6IG1pblg7XHJcblxyXG4gICAgICAgIG1pblkgPSB5MSA8IG1pblkgPyB5MSA6IG1pblk7XHJcbiAgICAgICAgbWluWSA9IHkyIDwgbWluWSA/IHkyIDogbWluWTtcclxuICAgICAgICBtaW5ZID0geTMgPCBtaW5ZID8geTMgOiBtaW5ZO1xyXG4gICAgICAgIG1pblkgPSB5NCA8IG1pblkgPyB5NCA6IG1pblk7XHJcblxyXG4gICAgICAgIG1heFggPSB4MSA+IG1heFggPyB4MSA6IG1heFg7XHJcbiAgICAgICAgbWF4WCA9IHgyID4gbWF4WCA/IHgyIDogbWF4WDtcclxuICAgICAgICBtYXhYID0geDMgPiBtYXhYID8geDMgOiBtYXhYO1xyXG4gICAgICAgIG1heFggPSB4NCA+IG1heFggPyB4NCA6IG1heFg7XHJcblxyXG4gICAgICAgIG1heFkgPSB5MSA+IG1heFkgPyB5MSA6IG1heFk7XHJcbiAgICAgICAgbWF4WSA9IHkyID4gbWF4WSA/IHkyIDogbWF4WTtcclxuICAgICAgICBtYXhZID0geTMgPiBtYXhZID8geTMgOiBtYXhZO1xyXG4gICAgICAgIG1heFkgPSB5NCA+IG1heFkgPyB5NCA6IG1heFk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGJvdW5kcyA9IHRoaXMuX2JvdW5kcztcclxuXHJcbiAgICBib3VuZHMueCA9IG1pblg7XHJcbiAgICBib3VuZHMud2lkdGggPSBtYXhYIC0gbWluWDtcclxuXHJcbiAgICBib3VuZHMueSA9IG1pblk7XHJcbiAgICBib3VuZHMuaGVpZ2h0ID0gbWF4WSAtIG1pblk7XHJcblxyXG4gICAgLy8gc3RvcmUgYSByZWZlcmVuY2Ugc28gdGhhdCBpZiB0aGlzIGZ1bmN0aW9uIGdldHMgY2FsbGVkIGFnYWluIGluIHRoZSByZW5kZXIgY3ljbGUgd2UgZG8gbm90IGhhdmUgdG8gcmVjYWxjdWxhdGVcclxuICAgIHRoaXMuX2N1cnJlbnRCb3VuZHMgPSBib3VuZHM7XHJcblxyXG4gICAgcmV0dXJuIGJvdW5kcztcclxufTtcclxuXHJcblxyXG5UaW55LlNwcml0ZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24ocmVuZGVyU2Vzc2lvbilcclxue1xyXG4gICAgLy8gSWYgdGhlIHNwcml0ZSBpcyBub3QgdmlzaWJsZSBvciB0aGUgYWxwaGEgaXMgMCB0aGVuIG5vIG5lZWQgdG8gcmVuZGVyIHRoaXMgZWxlbWVudFxyXG4gICAgaWYgKHRoaXMudmlzaWJsZSA9PT0gZmFsc2UgfHwgdGhpcy5hbHBoYSA9PT0gMCB8fCB0aGlzLnJlbmRlcmFibGUgPT09IGZhbHNlIHx8IHRoaXMudGV4dHVyZS5jcm9wLndpZHRoIDw9IDAgfHwgdGhpcy50ZXh0dXJlLmNyb3AuaGVpZ2h0IDw9IDApIHJldHVybjtcclxuXHJcbiAgICBpZiAodGhpcy5ibGVuZE1vZGUgIT09IHJlbmRlclNlc3Npb24uY3VycmVudEJsZW5kTW9kZSlcclxuICAgIHtcclxuICAgICAgICByZW5kZXJTZXNzaW9uLmN1cnJlbnRCbGVuZE1vZGUgPSB0aGlzLmJsZW5kTW9kZTtcclxuICAgICAgICByZW5kZXJTZXNzaW9uLmNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gcmVuZGVyU2Vzc2lvbi5jdXJyZW50QmxlbmRNb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9tYXNrKVxyXG4gICAge1xyXG4gICAgICAgIHJlbmRlclNlc3Npb24ubWFza01hbmFnZXIucHVzaE1hc2sodGhpcy5fbWFzaywgcmVuZGVyU2Vzc2lvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIElnbm9yZSBudWxsIHNvdXJjZXNcclxuICAgIGlmICh0aGlzLnRleHR1cmUudmFsaWQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJlc29sdXRpb24gPSB0aGlzLnRleHR1cmUucmVzb2x1dGlvbiAvIHJlbmRlclNlc3Npb24ucmVzb2x1dGlvbjtcclxuXHJcbiAgICAgICAgcmVuZGVyU2Vzc2lvbi5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy53b3JsZEFscGhhO1xyXG5cclxuXHJcbiAgICAgICAgLy8gIElmIHRoZSB0ZXh0dXJlIGlzIHRyaW1tZWQgd2Ugb2Zmc2V0IGJ5IHRoZSB0cmltIHgveSwgb3RoZXJ3aXNlIHdlIHVzZSB0aGUgZnJhbWUgZGltZW5zaW9uc1xyXG4gICAgICAgIHZhciBkeCA9ICh0aGlzLnRleHR1cmUudHJpbSkgPyB0aGlzLnRleHR1cmUudHJpbS54IC0gdGhpcy5hbmNob3IueCAqIHRoaXMudGV4dHVyZS50cmltLndpZHRoIDogdGhpcy5hbmNob3IueCAqIC10aGlzLnRleHR1cmUuZnJhbWUud2lkdGg7XHJcbiAgICAgICAgdmFyIGR5ID0gKHRoaXMudGV4dHVyZS50cmltKSA/IHRoaXMudGV4dHVyZS50cmltLnkgLSB0aGlzLmFuY2hvci55ICogdGhpcy50ZXh0dXJlLnRyaW0uaGVpZ2h0IDogdGhpcy5hbmNob3IueSAqIC10aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0O1xyXG5cclxuICAgICAgICAvLyAgQWxsb3cgZm9yIHBpeGVsIHJvdW5kaW5nXHJcbiAgICAgICAgaWYgKHJlbmRlclNlc3Npb24ucm91bmRQaXhlbHMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZW5kZXJTZXNzaW9uLmNvbnRleHQuc2V0VHJhbnNmb3JtKFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFRyYW5zZm9ybS5hLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFRyYW5zZm9ybS5iLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFRyYW5zZm9ybS5jLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFRyYW5zZm9ybS5kLFxyXG4gICAgICAgICAgICAgICAgKHRoaXMud29ybGRUcmFuc2Zvcm0udHggKiByZW5kZXJTZXNzaW9uLnJlc29sdXRpb24pIHwgMCxcclxuICAgICAgICAgICAgICAgICh0aGlzLndvcmxkVHJhbnNmb3JtLnR5ICogcmVuZGVyU2Vzc2lvbi5yZXNvbHV0aW9uKSB8IDApO1xyXG4gICAgICAgICAgICBkeCA9IGR4IHwgMDtcclxuICAgICAgICAgICAgZHkgPSBkeSB8IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlbmRlclNlc3Npb24uY29udGV4dC5zZXRUcmFuc2Zvcm0oXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkVHJhbnNmb3JtLmEsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkVHJhbnNmb3JtLmIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkVHJhbnNmb3JtLmMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkVHJhbnNmb3JtLmQsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkVHJhbnNmb3JtLnR4ICogcmVuZGVyU2Vzc2lvbi5yZXNvbHV0aW9uLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFRyYW5zZm9ybS50eSAqIHJlbmRlclNlc3Npb24ucmVzb2x1dGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50aW50ICE9PSBcIiNGRkZGRkZcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlZFRpbnQgIT09IHRoaXMudGludClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZWRUaW50ID0gdGhpcy50aW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW50ZWRUZXh0dXJlID0gVGlueS5DYW52YXNUaW50ZXIuZ2V0VGludGVkVGV4dHVyZSh0aGlzLCB0aGlzLnRpbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZW5kZXJTZXNzaW9uLmNvbnRleHQuZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGludGVkVGV4dHVyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlLmNyb3Aud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlLmNyb3AuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR4IC8gcmVzb2x1dGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkeSAvIHJlc29sdXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlLmNyb3Aud2lkdGggLyByZXNvbHV0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZS5jcm9wLmhlaWdodCAvIHJlc29sdXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZW5kZXJTZXNzaW9uLmNvbnRleHQuZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZS5zb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlLmNyb3AueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmUuY3JvcC55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZS5jcm9wLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZS5jcm9wLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkeCAvIHJlc29sdXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHkgLyByZXNvbHV0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZS5jcm9wLndpZHRoIC8gcmVzb2x1dGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmUuY3JvcC5oZWlnaHQgLyByZXNvbHV0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT1ZFUldSSVRFXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5yZW5kZXIocmVuZGVyU2Vzc2lvbik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX21hc2spXHJcbiAgICB7XHJcbiAgICAgICAgcmVuZGVyU2Vzc2lvbi5tYXNrTWFuYWdlci5wb3BNYXNrKHJlbmRlclNlc3Npb24pO1xyXG4gICAgfVxyXG59OyIsIlxyXG5UaW55LlRleHQgPSBmdW5jdGlvbih0ZXh0LCBzdHlsZSlcclxue1xyXG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLnJlc29sdXRpb24gPSAxO1xyXG5cclxuICAgIFRpbnkuU3ByaXRlLmNhbGwodGhpcywgVGlueS5UZXh0dXJlLmZyb21DYW52YXModGhpcy5jYW52YXMpKTtcclxuXHJcbiAgICB0aGlzLnNldFRleHQodGV4dCk7XHJcbiAgICB0aGlzLnNldFN0eWxlKHN0eWxlKTtcclxuXHJcbn07XHJcblxyXG5UaW55LlRleHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUaW55LlNwcml0ZS5wcm90b3R5cGUpO1xyXG5UaW55LlRleHQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVGlueS5UZXh0O1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuVGV4dC5wcm90b3R5cGUsICd3aWR0aCcsIHtcclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGlydHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlLnggKiB0aGlzLnRleHR1cmUuZnJhbWUud2lkdGg7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUueCA9IHZhbHVlIC8gdGhpcy50ZXh0dXJlLmZyYW1lLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbnkuVGV4dC5wcm90b3R5cGUsICdoZWlnaHQnLCB7XHJcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmRpcnR5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gIHRoaXMuc2NhbGUueSAqIHRoaXMudGV4dHVyZS5mcmFtZS5oZWlnaHQ7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUueSA9IHZhbHVlIC8gdGhpcy50ZXh0dXJlLmZyYW1lLmhlaWdodDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcclxuICAgIH1cclxufSk7XHJcblxyXG5UaW55LlRleHQucHJvdG90eXBlLnNldFN0eWxlID0gZnVuY3Rpb24oc3R5bGUpXHJcbntcclxuICAgIHN0eWxlID0gc3R5bGUgfHwge307XHJcbiAgICBzdHlsZS5mb250ID0gc3R5bGUuZm9udCB8fCAnYm9sZCAyMHB0IEFyaWFsJztcclxuICAgIHN0eWxlLmZpbGwgPSBzdHlsZS5maWxsIHx8ICdibGFjayc7XHJcbiAgICBzdHlsZS5hbGlnbiA9IHN0eWxlLmFsaWduIHx8ICdsZWZ0JztcclxuICAgIHN0eWxlLnN0cm9rZSA9IHN0eWxlLnN0cm9rZSB8fCAnYmxhY2snO1xyXG4gICAgc3R5bGUuc3Ryb2tlVGhpY2tuZXNzID0gc3R5bGUuc3Ryb2tlVGhpY2tuZXNzIHx8IDA7XHJcbiAgICBzdHlsZS53b3JkV3JhcCA9IHN0eWxlLndvcmRXcmFwIHx8IGZhbHNlO1xyXG4gICAgc3R5bGUubGluZVNwYWNpbmcgPSBzdHlsZS5saW5lU3BhY2luZyB8fCAwXHJcbiAgICBzdHlsZS53b3JkV3JhcFdpZHRoID0gc3R5bGUud29yZFdyYXBXaWR0aCAhPT0gdW5kZWZpbmVkID8gc3R5bGUud29yZFdyYXBXaWR0aCA6IDEwMDtcclxuICAgIFxyXG4gICAgc3R5bGUuZHJvcFNoYWRvdyA9IHN0eWxlLmRyb3BTaGFkb3cgfHwgZmFsc2U7XHJcbiAgICBzdHlsZS5kcm9wU2hhZG93QW5nbGUgPSBzdHlsZS5kcm9wU2hhZG93QW5nbGUgIT09IHVuZGVmaW5lZCA/IHN0eWxlLmRyb3BTaGFkb3dBbmdsZSA6IE1hdGguUEkgLyA2O1xyXG4gICAgc3R5bGUuZHJvcFNoYWRvd0Rpc3RhbmNlID0gc3R5bGUuZHJvcFNoYWRvd0Rpc3RhbmNlICE9PSB1bmRlZmluZWQgPyBzdHlsZS5kcm9wU2hhZG93RGlzdGFuY2UgOiA0O1xyXG4gICAgc3R5bGUuZHJvcFNoYWRvd0NvbG9yID0gc3R5bGUuZHJvcFNoYWRvd0NvbG9yIHx8ICdibGFjayc7XHJcblxyXG4gICAgdGhpcy5zdHlsZSA9IHN0eWxlO1xyXG4gICAgdGhpcy5kaXJ0eSA9IHRydWU7XHJcbn07XHJcblxyXG5UaW55LlRleHQucHJvdG90eXBlLnNldFRleHQgPSBmdW5jdGlvbih0ZXh0KVxyXG57XHJcbiAgICB0aGlzLnRleHQgPSB0ZXh0LnRvU3RyaW5nKCkgfHwgJyAnO1xyXG4gICAgdGhpcy5kaXJ0eSA9IHRydWU7XHJcbn07XHJcblxyXG5UaW55LlRleHQucHJvdG90eXBlLnVwZGF0ZVRleHQgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIHRoaXMudGV4dHVyZS5yZXNvbHV0aW9uID0gdGhpcy5yZXNvbHV0aW9uO1xyXG5cclxuICAgIHRoaXMuY29udGV4dC5mb250ID0gdGhpcy5zdHlsZS5mb250O1xyXG5cclxuICAgIHZhciBvdXRwdXRUZXh0ID0gdGhpcy50ZXh0O1xyXG5cclxuICAgIC8vIHdvcmQgd3JhcFxyXG4gICAgLy8gcHJlc2VydmUgb3JpZ2luYWwgdGV4dFxyXG4gICAgaWYodGhpcy5zdHlsZS53b3JkV3JhcClvdXRwdXRUZXh0ID0gdGhpcy53b3JkV3JhcCh0aGlzLnRleHQpO1xyXG5cclxuICAgIC8vc3BsaXQgdGV4dCBpbnRvIGxpbmVzXHJcbiAgICB2YXIgbGluZXMgPSBvdXRwdXRUZXh0LnNwbGl0KC8oPzpcXHJcXG58XFxyfFxcbikvKTtcclxuXHJcbiAgICAvL2NhbGN1bGF0ZSB0ZXh0IHdpZHRoXHJcbiAgICB2YXIgbGluZVdpZHRocyA9IFtdO1xyXG4gICAgdmFyIG1heExpbmVXaWR0aCA9IDA7XHJcbiAgICB2YXIgZm9udFByb3BlcnRpZXMgPSB0aGlzLmRldGVybWluZUZvbnRQcm9wZXJ0aWVzKHRoaXMuc3R5bGUuZm9udCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBsaW5lV2lkdGggPSB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQobGluZXNbaV0pLndpZHRoO1xyXG4gICAgICAgIGxpbmVXaWR0aHNbaV0gPSBsaW5lV2lkdGg7XHJcbiAgICAgICAgbWF4TGluZVdpZHRoID0gTWF0aC5tYXgobWF4TGluZVdpZHRoLCBsaW5lV2lkdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB3aWR0aCA9IG1heExpbmVXaWR0aCArIHRoaXMuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzO1xyXG4gICAgaWYodGhpcy5zdHlsZS5kcm9wU2hhZG93KXdpZHRoICs9IHRoaXMuc3R5bGUuZHJvcFNoYWRvd0Rpc3RhbmNlO1xyXG5cclxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gKCB3aWR0aCArIHRoaXMuY29udGV4dC5saW5lV2lkdGggKSAqIHRoaXMucmVzb2x1dGlvbjtcclxuICAgIFxyXG4gICAgLy9jYWxjdWxhdGUgdGV4dCBoZWlnaHRcclxuICAgIHZhciBsaW5lSGVpZ2h0ID0gZm9udFByb3BlcnRpZXMuZm9udFNpemUgKyB0aGlzLnN0eWxlLnN0cm9rZVRoaWNrbmVzcyArIHRoaXMuc3R5bGUubGluZVNwYWNpbmc7XHJcbiBcclxuICAgIHZhciBoZWlnaHQgPSBsaW5lSGVpZ2h0ICogbGluZXMubGVuZ3RoO1xyXG4gICAgaWYodGhpcy5zdHlsZS5kcm9wU2hhZG93KWhlaWdodCArPSB0aGlzLnN0eWxlLmRyb3BTaGFkb3dEaXN0YW5jZTtcclxuXHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSAoaGVpZ2h0IC0gdGhpcy5zdHlsZS5saW5lU3BhY2luZykgKiB0aGlzLnJlc29sdXRpb247XHJcblxyXG4gICAgdGhpcy5jb250ZXh0LnNjYWxlKCB0aGlzLnJlc29sdXRpb24sIHRoaXMucmVzb2x1dGlvbik7XHJcblxyXG4gICAgaWYobmF2aWdhdG9yLmlzQ29jb29uSlMpIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwwLHRoaXMuY2FudmFzLndpZHRoLHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICBcclxuICAgIC8vIHVzZWQgZm9yIGRlYnVnZ2luZy4uXHJcbiAgICAvL3RoaXMuY29udGV4dC5maWxsU3R5bGUgPVwiI0ZGMDAwMFwiXHJcbiAgICAvL3RoaXMuY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCx0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgIHRoaXMuY29udGV4dC5mb250ID0gdGhpcy5zdHlsZS5mb250O1xyXG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5zdHlsZS5zdHJva2U7XHJcbiAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3M7XHJcbiAgICB0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lID0gJ2FscGhhYmV0aWMnO1xyXG4gICAgdGhpcy5jb250ZXh0Lm1pdGVyTGltaXQgPSAyO1xyXG5cclxuICAgIC8vdGhpcy5jb250ZXh0LmxpbmVKb2luID0gJ3JvdW5kJztcclxuXHJcbiAgICB2YXIgbGluZVBvc2l0aW9uWDtcclxuICAgIHZhciBsaW5lUG9zaXRpb25ZO1xyXG5cclxuICAgIGlmKHRoaXMuc3R5bGUuZHJvcFNoYWRvdylcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5zdHlsZS5kcm9wU2hhZG93Q29sb3I7XHJcblxyXG4gICAgICAgIHZhciB4U2hhZG93T2Zmc2V0ID0gTWF0aC5zaW4odGhpcy5zdHlsZS5kcm9wU2hhZG93QW5nbGUpICogdGhpcy5zdHlsZS5kcm9wU2hhZG93RGlzdGFuY2U7XHJcbiAgICAgICAgdmFyIHlTaGFkb3dPZmZzZXQgPSBNYXRoLmNvcyh0aGlzLnN0eWxlLmRyb3BTaGFkb3dBbmdsZSkgKiB0aGlzLnN0eWxlLmRyb3BTaGFkb3dEaXN0YW5jZTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGluZVBvc2l0aW9uWCA9IHRoaXMuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzIC8gMjtcclxuICAgICAgICAgICAgbGluZVBvc2l0aW9uWSA9ICh0aGlzLnN0eWxlLnN0cm9rZVRoaWNrbmVzcyAvIDIgKyBpICogbGluZUhlaWdodCkgKyBmb250UHJvcGVydGllcy5hc2NlbnQ7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLnN0eWxlLmFsaWduID09PSAncmlnaHQnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsaW5lUG9zaXRpb25YICs9IG1heExpbmVXaWR0aCAtIGxpbmVXaWR0aHNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLnN0eWxlLmFsaWduID09PSAnY2VudGVyJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGluZVBvc2l0aW9uWCArPSAobWF4TGluZVdpZHRoIC0gbGluZVdpZHRoc1tpXSkgLyAyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLnN0eWxlLmZpbGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChsaW5lc1tpXSwgbGluZVBvc2l0aW9uWCArIHhTaGFkb3dPZmZzZXQsIGxpbmVQb3NpdGlvblkgKyB5U2hhZG93T2Zmc2V0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vICBpZihkcm9wU2hhZG93KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL3NldCBjYW52YXMgdGV4dCBzdHlsZXNcclxuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLnN0eWxlLmZpbGw7XHJcbiAgICBcclxuICAgIC8vZHJhdyBsaW5lcyBsaW5lIGJ5IGxpbmVcclxuICAgIGZvciAoaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICBsaW5lUG9zaXRpb25YID0gdGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3MgLyAyO1xyXG4gICAgICAgIGxpbmVQb3NpdGlvblkgPSAodGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3MgLyAyICsgaSAqIGxpbmVIZWlnaHQpICsgZm9udFByb3BlcnRpZXMuYXNjZW50O1xyXG5cclxuICAgICAgICBpZih0aGlzLnN0eWxlLmFsaWduID09PSAncmlnaHQnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGluZVBvc2l0aW9uWCArPSBtYXhMaW5lV2lkdGggLSBsaW5lV2lkdGhzW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuc3R5bGUuYWxpZ24gPT09ICdjZW50ZXInKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGluZVBvc2l0aW9uWCArPSAobWF4TGluZVdpZHRoIC0gbGluZVdpZHRoc1tpXSkgLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5zdHlsZS5zdHJva2UgJiYgdGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlVGV4dChsaW5lc1tpXSwgbGluZVBvc2l0aW9uWCwgbGluZVBvc2l0aW9uWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnN0eWxlLmZpbGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQobGluZXNbaV0sIGxpbmVQb3NpdGlvblgsIGxpbmVQb3NpdGlvblkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vICBpZihkcm9wU2hhZG93KVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlVGV4dHVyZSgpO1xyXG59O1xyXG5cclxuVGlueS5UZXh0LnByb3RvdHlwZS51cGRhdGVUZXh0dXJlID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLnRleHR1cmUud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcclxuICAgIHRoaXMudGV4dHVyZS5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICB0aGlzLnRleHR1cmUuY3JvcC53aWR0aCA9IHRoaXMudGV4dHVyZS5mcmFtZS53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy50ZXh0dXJlLmNyb3AuaGVpZ2h0ID0gdGhpcy50ZXh0dXJlLmZyYW1lLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxuXHJcbiAgICB0aGlzLl93aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG59O1xyXG5cclxuVGlueS5UZXh0LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihyZW5kZXJTZXNzaW9uKVxyXG57XHJcbiAgICBpZih0aGlzLmRpcnR5IHx8IHRoaXMucmVzb2x1dGlvbiAhPT0gcmVuZGVyU2Vzc2lvbi5yZXNvbHV0aW9uKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucmVzb2x1dGlvbiA9IHJlbmRlclNlc3Npb24ucmVzb2x1dGlvbjtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KCk7XHJcbiAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgIFxyXG4gICAgVGlueS5TcHJpdGUucHJvdG90eXBlLnJlbmRlci5jYWxsKHRoaXMsIHJlbmRlclNlc3Npb24pO1xyXG59O1xyXG5cclxuVGlueS5UZXh0LnByb3RvdHlwZS5kZXRlcm1pbmVGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uKGZvbnRTdHlsZSlcclxue1xyXG4gICAgdmFyIHByb3BlcnRpZXMgPSBUaW55LlRleHQuZm9udFByb3BlcnRpZXNDYWNoZVtmb250U3R5bGVdO1xyXG5cclxuICAgIGlmKCFwcm9wZXJ0aWVzKVxyXG4gICAge1xyXG4gICAgICAgIHByb3BlcnRpZXMgPSB7fTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgY2FudmFzID0gVGlueS5UZXh0LmZvbnRQcm9wZXJ0aWVzQ2FudmFzO1xyXG4gICAgICAgIHZhciBjb250ZXh0ID0gVGlueS5UZXh0LmZvbnRQcm9wZXJ0aWVzQ29udGV4dDtcclxuXHJcbiAgICAgICAgY29udGV4dC5mb250ID0gZm9udFN0eWxlO1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBNYXRoLmNlaWwoY29udGV4dC5tZWFzdXJlVGV4dCgnfE3DiXEnKS53aWR0aCk7XHJcbiAgICAgICAgdmFyIGJhc2VsaW5lID0gTWF0aC5jZWlsKGNvbnRleHQubWVhc3VyZVRleHQoJ3xNw4lxJykud2lkdGgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSAyICogYmFzZWxpbmU7XHJcblxyXG4gICAgICAgIGJhc2VsaW5lID0gYmFzZWxpbmUgKiAxLjQgfCAwO1xyXG5cclxuICAgICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZjAwJztcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZvbnQgPSBmb250U3R5bGU7XHJcblxyXG4gICAgICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ2FscGhhYmV0aWMnO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyMwMDAnO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQoJ3xNw4lxJywgMCwgYmFzZWxpbmUpO1xyXG5cclxuICAgICAgICB2YXIgaW1hZ2VkYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCkuZGF0YTtcclxuICAgICAgICB2YXIgcGl4ZWxzID0gaW1hZ2VkYXRhLmxlbmd0aDtcclxuICAgICAgICB2YXIgbGluZSA9IHdpZHRoICogNDtcclxuXHJcbiAgICAgICAgdmFyIGksIGo7XHJcblxyXG4gICAgICAgIHZhciBpZHggPSAwO1xyXG4gICAgICAgIHZhciBzdG9wID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIGFzY2VudC4gc2NhbiBmcm9tIHRvcCB0byBib3R0b20gdW50aWwgd2UgZmluZCBhIG5vbiByZWQgcGl4ZWxcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCBiYXNlbGluZTsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgbGluZTsgaiArPSA0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihpbWFnZWRhdGFbaWR4ICsgal0gIT09IDI1NSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdG9wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZighc3RvcClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWR4ICs9IGxpbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvcGVydGllcy5hc2NlbnQgPSBiYXNlbGluZSAtIGk7XHJcblxyXG4gICAgICAgIGlkeCA9IHBpeGVscyAtIGxpbmU7XHJcbiAgICAgICAgc3RvcCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLyBkZXNjZW50LiBzY2FuIGZyb20gYm90dG9tIHRvIHRvcCB1bnRpbCB3ZSBmaW5kIGEgbm9uIHJlZCBwaXhlbFxyXG4gICAgICAgIGZvcihpID0gaGVpZ2h0OyBpID4gYmFzZWxpbmU7IGktLSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8IGxpbmU7IGogKz0gNClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoaW1hZ2VkYXRhW2lkeCArIGpdICE9PSAyNTUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoIXN0b3ApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkeCAtPSBsaW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3BlcnRpZXMuZGVzY2VudCA9IGkgLSBiYXNlbGluZTtcclxuICAgICAgICAvL1RPRE8gbWlnaHQgbmVlZCBhIHR3ZWFrLiBraW5kIG9mIGEgdGVtcCBmaXghXHJcbiAgICAgICAgcHJvcGVydGllcy5kZXNjZW50ICs9IDY7XHJcbiAgICAgICAgcHJvcGVydGllcy5mb250U2l6ZSA9IHByb3BlcnRpZXMuYXNjZW50ICsgcHJvcGVydGllcy5kZXNjZW50O1xyXG5cclxuICAgICAgICBUaW55LlRleHQuZm9udFByb3BlcnRpZXNDYWNoZVtmb250U3R5bGVdID0gcHJvcGVydGllcztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJvcGVydGllcztcclxufTtcclxuXHJcblRpbnkuVGV4dC5wcm90b3R5cGUud29yZFdyYXAgPSBmdW5jdGlvbih0ZXh0KVxyXG57XHJcbiAgICAvLyBHcmVlZHkgd3JhcHBpbmcgYWxnb3JpdGhtIHRoYXQgd2lsbCB3cmFwIHdvcmRzIGFzIHRoZSBsaW5lIGdyb3dzIGxvbmdlclxyXG4gICAgLy8gdGhhbiBpdHMgaG9yaXpvbnRhbCBib3VuZHMuXHJcbiAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICB2YXIgbGluZXMgPSB0ZXh0LnNwbGl0KCdcXG4nKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNwYWNlTGVmdCA9IHRoaXMuc3R5bGUud29yZFdyYXBXaWR0aDtcclxuICAgICAgICB2YXIgd29yZHMgPSBsaW5lc1tpXS5zcGxpdCgnICcpO1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgd29yZHMubGVuZ3RoOyBqKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgd29yZFdpZHRoID0gdGhpcy5jb250ZXh0Lm1lYXN1cmVUZXh0KHdvcmRzW2pdKS53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHdvcmRXaWR0aFdpdGhTcGFjZSA9IHdvcmRXaWR0aCArIHRoaXMuY29udGV4dC5tZWFzdXJlVGV4dCgnICcpLndpZHRoO1xyXG4gICAgICAgICAgICBpZihqID09PSAwIHx8IHdvcmRXaWR0aFdpdGhTcGFjZSA+IHNwYWNlTGVmdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gU2tpcCBwcmludGluZyB0aGUgbmV3bGluZSBpZiBpdCdzIHRoZSBmaXJzdCB3b3JkIG9mIHRoZSBsaW5lIHRoYXQgaXNcclxuICAgICAgICAgICAgICAgIC8vIGdyZWF0ZXIgdGhhbiB0aGUgd29yZCB3cmFwIHdpZHRoLlxyXG4gICAgICAgICAgICAgICAgaWYoaiA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICdcXG4nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IHdvcmRzW2pdO1xyXG4gICAgICAgICAgICAgICAgc3BhY2VMZWZ0ID0gdGhpcy5zdHlsZS53b3JkV3JhcFdpZHRoIC0gd29yZFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VMZWZ0IC09IHdvcmRXaWR0aFdpdGhTcGFjZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnICcgKyB3b3Jkc1tqXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGkgPCBsaW5lcy5sZW5ndGgtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSAnXFxuJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuVGlueS5UZXh0LnByb3RvdHlwZS5nZXRCb3VuZHMgPSBmdW5jdGlvbihtYXRyaXgpXHJcbntcclxuICAgIGlmKHRoaXMuZGlydHkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KCk7XHJcbiAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBUaW55LlNwcml0ZS5wcm90b3R5cGUuZ2V0Qm91bmRzLmNhbGwodGhpcywgbWF0cml4KTtcclxufTtcclxuXHJcblRpbnkuVGV4dC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgLy8gbWFrZSBzdXJlIHRvIHJlc2V0IHRoZSB0aGUgY29udGV4dCBhbmQgY2FudmFzLi4gZG9udCB3YW50IHRoaXMgaGFuZ2luZyBhcm91bmQgaW4gbWVtb3J5IVxyXG4gICAgdGhpcy5jb250ZXh0ID0gbnVsbDtcclxuICAgIHRoaXMuY2FudmFzID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLnRleHR1cmUuZGVzdHJveSgpO1xyXG5cclxuICAgIFRpbnkuU3ByaXRlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7XHJcbn07XHJcblxyXG5UaW55LlRleHQuZm9udFByb3BlcnRpZXNDYWNoZSA9IHt9O1xyXG5UaW55LlRleHQuZm9udFByb3BlcnRpZXNDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuVGlueS5UZXh0LmZvbnRQcm9wZXJ0aWVzQ29udGV4dCA9IFRpbnkuVGV4dC5mb250UHJvcGVydGllc0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpOyIsIlxyXG5UaW55LkNhbnZhc1JlbmRlcmVyID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgb3B0aW9ucylcclxueyAgIFxyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cclxuXHJcbiAgICB0aGlzLnJlc29sdXRpb24gPSAob3B0aW9ucy5yZXNvbHV0aW9uICE9IHVuZGVmaW5lZCA/IG9wdGlvbnMucmVzb2x1dGlvbiA6IDEpO1xyXG5cclxuICAgIHRoaXMuY2xlYXJCZWZvcmVSZW5kZXIgPSAob3B0aW9ucy5jbGVhckJlZm9yZVJlbmRlciAhPSB1bmRlZmluZWQgPyBvcHRpb25zLmNsZWFyQmVmb3JlUmVuZGVyIDogdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy50cmFuc3BhcmVudCA9IChvcHRpb25zLnRyYW5zcGFyZW50ICE9IHVuZGVmaW5lZCA/IG9wdGlvbnMudHJhbnNwYXJlbnQgOiBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5hdXRvUmVzaXplID0gb3B0aW9ucy5hdXRvUmVzaXplIHx8IGZhbHNlO1xyXG5cclxuICAgIC8vIHRoaXMud2lkdGggPSB3aWR0aCB8fCA4MDA7XHJcbiAgICAvLyB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCA2MDA7XHJcblxyXG4gICAgLy8gdGhpcy53aWR0aCAqPSB0aGlzLnJlc29sdXRpb247XHJcbiAgICAvLyB0aGlzLmhlaWdodCAqPSB0aGlzLnJlc29sdXRpb247XHJcblxyXG4gICAgaWYgKCFUaW55LmRlZmF1bHRSZW5kZXJlcikgVGlueS5kZWZhdWx0UmVuZGVyZXIgPSB0aGlzO1xyXG5cclxuICAgIHZhciB2aWV3ID0gdGhpcy5kb21FbGVtZW50ID0gb3B0aW9ucy5kb21FbGVtZW50IHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiY2FudmFzXCIgKTtcclxuXHJcbiAgICB0aGlzLmNvbnRleHQgPSB2aWV3LmdldENvbnRleHQoIFwiMmRcIiwgeyBhbHBoYTogdGhpcy50cmFuc3BhcmVudCB9ICk7XHJcblxyXG4gICAgLy8gdmlldy53aWR0aCA9IHRoaXMud2lkdGggKiB0aGlzLnJlc29sdXRpb247XHJcbiAgICAvLyB2aWV3LmhlaWdodCA9IHRoaXMuaGVpZ2h0ICogdGhpcy5yZXNvbHV0aW9uO1xyXG5cclxuICAgIHRoaXMucmVzaXplKHdpZHRoIHx8IDgwMCwgaGVpZ2h0IHx8IDYwMCk7XHJcblxyXG4gICAgdGhpcy5zZXRDbGVhckNvbG9yKFwiI2ZmZmZmZlwiKTtcclxuXHJcbiAgICBpZiAoVGlueS5DYW52YXNNYXNrTWFuYWdlcilcclxuICAgICAgICB0aGlzLm1hc2tNYW5hZ2VyID0gbmV3IFRpbnkuQ2FudmFzTWFza01hbmFnZXIoKTtcclxuXHJcbiAgICB0aGlzLnJlbmRlclNlc3Npb24gPSB7XHJcbiAgICAgICAgY29udGV4dDogdGhpcy5jb250ZXh0LFxyXG4gICAgICAgIG1hc2tNYW5hZ2VyOiB0aGlzLm1hc2tNYW5hZ2VyLFxyXG4gICAgICAgIHNtb290aFByb3BlcnR5OiBudWxsLFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRydWUgUGl4aSB3aWxsIE1hdGguZmxvb3IoKSB4L3kgdmFsdWVzIHdoZW4gcmVuZGVyaW5nLCBzdG9wcGluZyBwaXhlbCBpbnRlcnBvbGF0aW9uLlxyXG4gICAgICAgICAqIEhhbmR5IGZvciBjcmlzcCBwaXhlbCBhcnQgYW5kIHNwZWVkIG9uIGxlZ2FjeSBkZXZpY2VzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcm91bmRQaXhlbHM6IGZhbHNlXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBpZihcImltYWdlU21vb3RoaW5nRW5hYmxlZFwiIGluIHRoaXMuY29udGV4dClcclxuICAgICAgICB0aGlzLnJlbmRlclNlc3Npb24uc21vb3RoUHJvcGVydHkgPSBcImltYWdlU21vb3RoaW5nRW5hYmxlZFwiO1xyXG4gICAgZWxzZSBpZihcIndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZFwiIGluIHRoaXMuY29udGV4dClcclxuICAgICAgICB0aGlzLnJlbmRlclNlc3Npb24uc21vb3RoUHJvcGVydHkgPSBcIndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZFwiO1xyXG4gICAgZWxzZSBpZihcIm1vekltYWdlU21vb3RoaW5nRW5hYmxlZFwiIGluIHRoaXMuY29udGV4dClcclxuICAgICAgICB0aGlzLnJlbmRlclNlc3Npb24uc21vb3RoUHJvcGVydHkgPSBcIm1vekltYWdlU21vb3RoaW5nRW5hYmxlZFwiO1xyXG4gICAgZWxzZSBpZihcIm9JbWFnZVNtb290aGluZ0VuYWJsZWRcIiBpbiB0aGlzLmNvbnRleHQpXHJcbiAgICAgICAgdGhpcy5yZW5kZXJTZXNzaW9uLnNtb290aFByb3BlcnR5ID0gXCJvSW1hZ2VTbW9vdGhpbmdFbmFibGVkXCI7XHJcbiAgICBlbHNlIGlmIChcIm1zSW1hZ2VTbW9vdGhpbmdFbmFibGVkXCIgaW4gdGhpcy5jb250ZXh0KVxyXG4gICAgICAgIHRoaXMucmVuZGVyU2Vzc2lvbi5zbW9vdGhQcm9wZXJ0eSA9IFwibXNJbWFnZVNtb290aGluZ0VuYWJsZWRcIjtcclxufTtcclxuXHJcblRpbnkuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVGlueS5DYW52YXNSZW5kZXJlcjtcclxuXHJcblRpbnkuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLnNldENsZWFyQ29sb3IgPSBmdW5jdGlvbihjb2xvcilcclxueyAgIFxyXG4gICAgdGhpcy5jbGVhckNvbG9yID0gY29sb3I7XHJcbiAgICBcclxuICAgIC8vIGlmIChjb2xvciA9PT0gbnVsbCkge1xyXG4gICAgLy8gICAgIHRoaXMuY2xlYXJDb2xvciA9IG51bGw7XHJcbiAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHRoaXMuY2xlYXJDb2xvciA9IGNvbG9yIHx8IDB4MDAwMDAwO1xyXG4gICAgLy8gLy8gdGhpcy5iYWNrZ3JvdW5kQ29sb3JTcGxpdCA9IFRpbnkuaGV4MnJnYih0aGlzLmJhY2tncm91bmRDb2xvcik7XHJcbiAgICAvLyB2YXIgaGV4ID0gdGhpcy5jbGVhckNvbG9yLnRvU3RyaW5nKDE2KTtcclxuICAgIC8vIGhleCA9ICcwMDAwMDAnLnN1YnN0cigwLCA2IC0gaGV4Lmxlbmd0aCkgKyBoZXg7XHJcbiAgICAvLyB0aGlzLl9jbGVhckNvbG9yID0gJyMnICsgaGV4O1xyXG5cclxufTtcclxuXHJcbi8vIFRpbnkuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLnNldFBpeGVsQXJ0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4vLyAgICAgdmFyIGNhbnZhcyA9IHRoaXMuZG9tRWxlbWVudDtcclxuICAgIFxyXG4vLyAgICAgdmFyIHR5cGVzID0gWyAnb3B0aW1pemVTcGVlZCcsICctbW96LWNyaXNwLWVkZ2VzJywgJy1vLWNyaXNwLWVkZ2VzJywgJy13ZWJraXQtb3B0aW1pemUtY29udHJhc3QnLCAnb3B0aW1pemUtY29udHJhc3QnLCAnY3Jpc3AtZWRnZXMnLCAncGl4ZWxhdGVkJyBdO1xyXG5cclxuLy8gICAgIHR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgY2FudmFzLnN0eWxlWydpbWFnZS1yZW5kZXJpbmcnXSA9IHR5cGU7XHJcbi8vICAgICB9KTtcclxuXHJcbi8vICAgICBjYW52YXMuc3R5bGUubXNJbnRlcnBvbGF0aW9uTW9kZSA9ICduZWFyZXN0LW5laWdoYm9yJztcclxuLy8gICAgIHRoaXMucmVuZGVyU2Vzc2lvbi5yb3VuZFBpeGVscyA9IHRydWU7XHJcbi8vIH1cclxuXHJcblRpbnkuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKHNjZW5lKVxyXG57XHJcbiAgICBzY2VuZS51cGRhdGVUcmFuc2Zvcm0oKTtcclxuXHJcbiAgICB0aGlzLmNvbnRleHQuc2V0VHJhbnNmb3JtKDEsMCwwLDEsMCwwKTtcclxuXHJcbiAgICB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSAxO1xyXG5cclxuICAgIHRoaXMucmVuZGVyU2Vzc2lvbi5jdXJyZW50QmxlbmRNb2RlID0gXCJzb3VyY2Utb3ZlclwiO1xyXG4gICAgdGhpcy5jb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwic291cmNlLW92ZXJcIjtcclxuXHJcbiAgICBpZiAobmF2aWdhdG9yLmlzQ29jb29uSlMgJiYgdGhpcy5kb21FbGVtZW50LnNjcmVlbmNhbnZhcylcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5jbGVhckJlZm9yZVJlbmRlcilcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy50cmFuc3BhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCAqIHRoaXMucmVzb2x1dGlvbiwgdGhpcy5oZWlnaHQgKiB0aGlzLnJlc29sdXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5jbGVhckNvbG9yO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCAqIHRoaXMucmVzb2x1dGlvbiwgdGhpcy5oZWlnaHQgKiB0aGlzLnJlc29sdXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy5yZW5kZXJPYmplY3Qoc2NlbmUpO1xyXG5cclxufTtcclxuXHJcblRpbnkuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihyZW1vdmVWaWV3KVxyXG57ICAgXHJcbiAgICBpZiAodHlwZW9mIHJlbW92ZVZpZXcgPT09IFwidW5kZWZpbmVkXCIpIHsgcmVtb3ZlVmlldyA9IHRydWU7IH1cclxuXHJcbiAgICBpZiAocmVtb3ZlVmlldyAmJiB0aGlzLmRvbUVsZW1lbnQucGFyZW50Tm9kZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmRvbUVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZG9tRWxlbWVudCA9IG51bGw7XHJcbiAgICB0aGlzLmNvbnRleHQgPSBudWxsO1xyXG4gICAgdGhpcy5tYXNrTWFuYWdlciA9IG51bGw7XHJcbiAgICB0aGlzLnJlbmRlclNlc3Npb24gPSBudWxsO1xyXG5cclxuICAgIGlmIChUaW55LmRlZmF1bHRSZW5kZXJlciA9PT0gdGhpcykgVGlueS5kZWZhdWx0UmVuZGVyZXIgPSBudWxsO1xyXG5cclxufTtcclxuXHJcblRpbnkuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpXHJcbntcclxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgIHZhciB2aWV3ID0gdGhpcy5kb21FbGVtZW50O1xyXG5cclxuICAgIHZpZXcud2lkdGggPSBNYXRoLmZsb29yKHRoaXMud2lkdGggKiB0aGlzLnJlc29sdXRpb24pO1xyXG4gICAgdmlldy5oZWlnaHQgPSBNYXRoLmZsb29yKHRoaXMuaGVpZ2h0ICogdGhpcy5yZXNvbHV0aW9uKTtcclxuXHJcbiAgICBpZiAodGhpcy5hdXRvUmVzaXplKSB7XHJcbiAgICAgICAgdmlldy5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xyXG4gICAgICAgIHZpZXcuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVGlueS5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUuc2V0UGl4ZWxSYXRpbyA9IGZ1bmN0aW9uKHJlc29sdXRpb24pXHJcbntcclxuICAgIHRoaXMucmVzb2x1dGlvbiA9IHJlc29sdXRpb247XHJcblxyXG4gICAgdmFyIHZpZXcgPSB0aGlzLmRvbUVsZW1lbnQ7XHJcblxyXG4gICAgdmlldy53aWR0aCA9IE1hdGguZmxvb3IodGhpcy53aWR0aCAqIHRoaXMucmVzb2x1dGlvbik7XHJcbiAgICB2aWV3LmhlaWdodCA9IE1hdGguZmxvb3IodGhpcy5oZWlnaHQgKiB0aGlzLnJlc29sdXRpb24pO1xyXG59O1xyXG5cclxuVGlueS5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyT2JqZWN0ID0gZnVuY3Rpb24oZGlzcGxheU9iamVjdCwgY29udGV4dClcclxue1xyXG4gICAgdGhpcy5yZW5kZXJTZXNzaW9uLmNvbnRleHQgPSBjb250ZXh0IHx8IHRoaXMuY29udGV4dDtcclxuICAgIHRoaXMucmVuZGVyU2Vzc2lvbi5yZXNvbHV0aW9uID0gdGhpcy5yZXNvbHV0aW9uO1xyXG4gICAgZGlzcGxheU9iamVjdC5yZW5kZXIodGhpcy5yZW5kZXJTZXNzaW9uKTtcclxufTsiLCJ2YXIgbGlzdGVuaW5nVG9Ub3VjaEV2ZW50cztcclxuXHJcblRpbnkuSW5wdXQgPSBmdW5jdGlvbihnYW1lKVxyXG57XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgdmFyIHZpZXcgPSB0aGlzLmRvbUVsZW1lbnQgPSBnYW1lLmlucHV0VmlldztcclxuXHJcbiAgICB0aGlzLmJvdW5kcyA9IHt4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwfTtcclxuICAgIHRoaXMuY2FuZGlkYXRlcyA9IFtdO1xyXG4gICAgdGhpcy5saXN0ID0gW107XHJcblxyXG4gICAgdGhpcy5sYXN0TW92ZSA9IG51bGw7XHJcbiAgICB0aGlzLmlzRG93biA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuZG93bkhhbmRsZXIgPSB0aGlzLmRvd25IYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm1vdmVIYW5kbGVyID0gdGhpcy5tb3ZlSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy51cEhhbmRsZXIgPSB0aGlzLnVwSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgLy8gdGhpcy5jbGlja0hhbmRsZXIuYmluZCh0aGlzKTtcclxuXHJcbiAgICB2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmRvd25IYW5kbGVyKTtcclxuICAgIHZpZXcuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5tb3ZlSGFuZGxlcik7XHJcbiAgICB2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy51cEhhbmRsZXIpO1xyXG4gICAgdmlldy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMudXBIYW5kbGVyKTtcclxuXHJcbiAgICAvLyB2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbGlja0hhbmRsZXIpO1xyXG5cclxuICAgIHZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5kb3duSGFuZGxlcik7XHJcbiAgICB2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW92ZUhhbmRsZXIpO1xyXG4gICAgdmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy51cEhhbmRsZXIpO1xyXG5cclxuICAgIFRpbnkuRXZlbnRFbWl0dGVyLm1peGluKHRoaXMpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgVGlueS5JbnB1dC5zeXN0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgVGlueS5JbnB1dC5zeXN0ZW1zW2ldLmluaXQuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZUJvdW5kcygpO1xyXG59O1xyXG5cclxuVGlueS5JbnB1dC5wcm90b3R5cGUgPSB7XHJcblxyXG5cclxuICAgIGFkZDogZnVuY3Rpb24ob2JqZWN0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgb2JqZWN0LmlucHV0RW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIG9wdGlvbnMuc3lzdGVtID0gdGhpcztcclxuXHJcbiAgICAgICAgb2JqZWN0LmlucHV0ID0gb3B0aW9ucztcclxuXHJcbiAgICAgICAgVGlueS5FdmVudEVtaXR0ZXIubWl4aW4ob2JqZWN0LmlucHV0KVxyXG5cclxuICAgICAgICB0aGlzLmxpc3QucHVzaChvYmplY3QpO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW1vdmU6IGZ1bmN0aW9uKG9iamVjdCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMubGlzdC5pbmRleE9mKG9iamVjdCk7XHJcblxyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciByZW1vdmVkID0gdGhpcy5saXN0W2luZGV4XTtcclxuICAgICAgICAgICAgcmVtb3ZlZC5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJlbW92ZWQuaW5wdXRFbmFibGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW1vdmVkO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5wdXRIYW5kbGVyOiBmdW5jdGlvbihuYW1lLCBldmVudClcclxuICAgIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhuYW1lKVxyXG4gICAgICAgIHZhciBjb29yZHMgPSB0aGlzLmdldENvb3JkcyhldmVudCk7XHJcblxyXG4gICAgICAgIGlmIChjb29yZHMgIT09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobmFtZSAhPSBcIm1vdmVcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW5kaWRhdGVzLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBUaW55LklucHV0LnN5c3RlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBUaW55LklucHV0LnN5c3RlbXNbaV0ucHJlSGFuZGxlLmNhbGwodGhpcywgY29vcmRzLngsIGNvb3Jkcy55KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaXNHb29kLCBvYmo7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdCA9IDA7IHQgPCB0aGlzLmxpc3QubGVuZ3RoOyB0KyspIFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IHRoaXMubGlzdFt0XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvYmouaW5wdXRFbmFibGVkIHx8ICFvYmoucGFyZW50KSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5pbnB1dC5jaGVja0JvdW5kcykgaXNHb29kID0gb2JqLmlucHV0LmNoZWNrQm91bmRzLmNhbGwodGhpcywgb2JqLCBjb29yZHMueCwgY29vcmRzLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaXNHb29kID0gVGlueS5JbnB1dC5jaGVja0JvdW5kcy5jYWxsKHRoaXMsIG9iaiwgY29vcmRzLngsIGNvb3Jkcy55KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzR29vZCkgdGhpcy5jYW5kaWRhdGVzLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL3ZhciBpID0gdGhpcy5jYW5kaWRhdGVzLmxlbmd0aFxyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSB0aGlzLmNhbmRpZGF0ZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gdGhpcy5jYW5kaWRhdGVzW2ldXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmlucHV0W1wibGFzdF9cIiArIG5hbWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBjb29yZHMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogY29vcmRzLnlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9iai5pbnB1dC5lbWl0KG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBjb29yZHMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogY29vcmRzLnlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZSA9PSBcInVwXCIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSBvYmouaW5wdXRbXCJsYXN0X2Rvd25cIl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvaW50ICYmIFRpbnkuTWF0aC5kaXN0YW5jZShwb2ludC54LCBwb2ludC55LCBjb29yZHMueCwgY29vcmRzLnkpIDwgMzApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaW5wdXQuZW1pdChcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogY29vcmRzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogY29vcmRzLnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW9iai5pbnB1dC50cmFuc3BhcmVudCkgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICB2YXIgb2JqID0gdGhpcy5jYW5kaWRhdGVzW2kgLSAxXVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIG9iai5pbnB1dFtcImxhc3RfXCIgKyBuYW1lXSA9IHt4OiBjb29yZHMueCwgeTogY29vcmRzLnl9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gICAgIG9iai5pbnB1dC5lbWl0KG5hbWUsIHt4OiBjb29yZHMueCwgeTogY29vcmRzLnl9KVxyXG5cclxuICAgICAgICAgICAgICAgIC8vICAgICBpZiAobmFtZSA9PSBcInVwXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgdmFyIHBvaW50ID0gb2JqLmlucHV0W1wibGFzdF9kb3duXCJdXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmIChwb2ludCAmJiBUaW55Lk1hdGguZGlzdGFuY2UocG9pbnQueCwgcG9pbnQueSwgY29vcmRzLngsIGNvb3Jkcy55KSA8IDMwKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgb2JqLmlucHV0LmVtaXQoXCJjbGlja1wiLCB7eDogY29vcmRzLngsIHk6IGNvb3Jkcy55fSlcclxuICAgICAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZW1pdChuYW1lLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4OiBjb29yZHMueCxcclxuICAgICAgICAgICAgICAgIHk6IGNvb3Jkcy55XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW92ZUhhbmRsZXI6IGZ1bmN0aW9uKGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubGFzdE1vdmUgPSBldmVudDtcclxuICAgICAgICB0aGlzLmlucHV0SGFuZGxlcihcIm1vdmVcIiwgZXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cEhhbmRsZXI6IGZ1bmN0aW9uKGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaXNEb3duID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pbnB1dEhhbmRsZXIoXCJ1cFwiLCB0aGlzLmxhc3RNb3ZlKTtcclxuICAgIH0sXHJcblxyXG4gICAgZG93bkhhbmRsZXI6IGZ1bmN0aW9uKGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaXNEb3duID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmxhc3RNb3ZlID0gZXZlbnQ7XHJcbiAgICAgICAgdGhpcy5pbnB1dEhhbmRsZXIoXCJkb3duXCIsIGV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xpY2tIYW5kbGVyOiBmdW5jdGlvbihldmVudClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmlucHV0SGFuZGxlcihcImNsaWNrXCIsIGV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0Q29vcmRzOiBmdW5jdGlvbihldmVudClcclxuICAgIHtcclxuICAgICAgICB2YXIgY29vcmRzID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBUb3VjaEV2ZW50ICE9PSAndW5kZWZpbmVkJyAmJiBldmVudCBpbnN0YW5jZW9mIFRvdWNoRXZlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsaXN0ZW5pbmdUb1RvdWNoRXZlbnRzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvb3JkcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICB4OiBldmVudC50b3VjaGVzWzBdLmNsaWVudFgsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogZXZlbnQudG91Y2hlc1swXS5jbGllbnRZXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LmNsaWVudFggJiYgZXZlbnQuY2xpZW50WSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29vcmRzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IGV2ZW50LmNsaWVudFgsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogZXZlbnQuY2xpZW50WVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGxpc3RlbmluZ1RvVG91Y2hFdmVudHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBNb3VzZSBldmVudFxyXG4gICAgICAgICAgICBjb29yZHMgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBldmVudC5jbGllbnRYLFxyXG4gICAgICAgICAgICAgICAgeTogZXZlbnQuY2xpZW50WVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxpc3RlbmluZ1RvVG91Y2hFdmVudHMgJiYgZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50IHx8IGNvb3JkcyA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGNvb3JkcyA9IHtcclxuICAgICAgICAgICAgeDogKGNvb3Jkcy54IC0gdGhpcy5ib3VuZHMueCksXHJcbiAgICAgICAgICAgIHk6IChjb29yZHMueSAtIHRoaXMuYm91bmRzLnkpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBjb29yZHM7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZUJvdW5kczogZnVuY3Rpb24oKSBcclxuICAgIHtcclxuICAgICAgICBib3VuZHMgPSB0aGlzLmJvdW5kcztcclxuXHJcbiAgICAgICAgdmFyIGNsaWVudFJlY3QgPSB0aGlzLmRvbUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIGJvdW5kcy54ID0gY2xpZW50UmVjdC5sZWZ0O1xyXG4gICAgICAgIGJvdW5kcy55ID0gY2xpZW50UmVjdC50b3A7XHJcbiAgICAgICAgYm91bmRzLndpZHRoID0gY2xpZW50UmVjdC53aWR0aDtcclxuICAgICAgICBib3VuZHMuaGVpZ2h0ID0gY2xpZW50UmVjdC5oZWlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMuZG9tRWxlbWVudDtcclxuXHJcbiAgICAgICAgdmlldy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5kb3duSGFuZGxlcik7XHJcbiAgICAgICAgdmlldy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm1vdmVIYW5kbGVyKTtcclxuICAgICAgICB2aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy51cEhhbmRsZXIpO1xyXG4gICAgICAgIHZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLnVwSGFuZGxlcik7XHJcblxyXG4gICAgICAgIC8vIHZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcblxyXG4gICAgICAgIHZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5kb3duSGFuZGxlcik7XHJcbiAgICAgICAgdmlldy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdmVIYW5kbGVyKTtcclxuICAgICAgICB2aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnVwSGFuZGxlcik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55LklucHV0LmNoZWNrQm91bmRzID0gZnVuY3Rpb24ob2JqLCB4LCB5KVxyXG57XHJcbiAgICBpZiAob2JqLndvcmxkVmlzaWJsZSlcclxuICAgIHtcclxuICAgICAgICBpZiAob2JqLmdldEJvdW5kcygpLmNvbnRhaW5zKHgsIHkpKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiAob2JqLmNoaWxkcmVuICYmIG9iai5jaGlsZHJlbi5sZW5ndGggPiAwKVxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIGZvciAodmFyIHQgPSAwOyB0IDwgb2JqLmNoaWxkcmVuLmxlbmd0aDsgdCsrKSBcclxuICAgIC8vICAgICB7XHJcbiAgICAvLyAgICAgICAgIF9jaGVja09uQWN0aXZlT2JqZWN0cyhvYmouY2hpbGRyZW5bdF0sIHgsIHkpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxufVxyXG5cclxuVGlueS5JbnB1dC5zeXN0ZW1zID0gW107XHJcblxyXG5UaW55LnJlZ2lzdGVyU3lzdGVtKFwiaW5wdXRcIiwgVGlueS5JbnB1dCk7IiwiXHJcblRpbnkuQ2FjaGUgPSB7XHJcbiAgICBpbWFnZToge30sXHJcbiAgICB0ZXh0dXJlOiB7fVxyXG59O1xyXG5cclxuVGlueS5Mb2FkZXIgPSBmdW5jdGlvbihnYW1lKVxyXG57XHJcbiAgICBnYW1lLmNhY2hlID0gVGlueS5DYWNoZTtcclxuXHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgdGhpcy5saXN0ID0gW107XHJcbn07XHJcblxyXG5UaW55LkxvYWRlci5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgY2xlYXJDYWNoZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIHkgaW4gVGlueS5DYWNoZS50ZXh0dXJlKSBUaW55LkNhY2hlLnRleHR1cmVbeV0uZGVzdHJveSgpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciB5IGluIFRpbnkuQ2FjaGUpIFRpbnkuQ2FjaGVbeV0gPSB7fTtcclxuICAgIH0sXHJcblxyXG4gICAgYWxsOiBmdW5jdGlvbihhcnJheSkge1xyXG5cclxuICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmxpc3QuY29uY2F0KGFycmF5KTsgXHJcbiAgICB9LFxyXG5cclxuICAgIGltYWdlOiBmdW5jdGlvbihrZXksIHNvdXJjZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmxpc3QucHVzaChcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogc291cmNlLFxyXG4gICAgICAgICAgICBrZXk6IGtleSxcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNwcml0ZXNoZWV0OiBmdW5jdGlvbihrZXksIHNvdXJjZSwgYXJnXzEsIGFyZ18yLCB0b3RhbEZyYW1lcywgZHVyYXRpb24pXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJlcyA9IHtcclxuICAgICAgICAgICAgc3JjOiBzb3VyY2UsXHJcbiAgICAgICAgICAgIGtleToga2V5LFxyXG4gICAgICAgICAgICB0eXBlOiBcInNwcml0ZXNoZWV0XCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGFyZ18xID09IFwibnVtYmVyXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXMud2lkdGggPSBhcmdfMTtcclxuICAgICAgICAgICAgcmVzLmhlaWdodCA9IGFyZ18yO1xyXG4gICAgICAgICAgICByZXMudG90YWwgPSB0b3RhbEZyYW1lcztcclxuICAgICAgICAgICAgcmVzLmR1cmF0aW9uID0gZHVyYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ18xLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXMuZGF0YSA9IGFyZ18xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5saXN0LnB1c2gocmVzKTtcclxuICAgIH0sXHJcblxyXG4gICAgYXRsYXM6IGZ1bmN0aW9uKGtleSwgc291cmNlLCBhdGxhc0RhdGEpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5saXN0LnB1c2goXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IHNvdXJjZSxcclxuICAgICAgICAgICAga2V5OiBrZXksXHJcbiAgICAgICAgICAgIGRhdGE6IGF0bGFzRGF0YSxcclxuICAgICAgICAgICAgdHlwZTogXCJhdGxhc1wiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0OiBmdW5jdGlvbihjYWxsYmFjaylcclxuICAgIHtcclxuICAgICAgICB2YXIgZ2FtZSA9IHRoaXMuZ2FtZTtcclxuICAgICAgICB2YXIgbGlzdCA9IHRoaXMubGlzdDtcclxuXHJcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGdhbWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkTmV4dCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyB2YXIgZG9uZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgcmVzb3VyY2UgPSBsaXN0LnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbG9hZGVyID0gVGlueS5Mb2FkZXJbcmVzb3VyY2UudHlwZV07XHJcblxyXG4gICAgICAgICAgICBpZiAobG9hZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBsb2FkZXIocmVzb3VyY2UsIGxvYWRlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJDYW5ub3QgZmluZCBsb2FkZXIgZm9yIFwiICsgcmVzb3VyY2UudHlwZSk7XHJcbiAgICAgICAgICAgICAgICBsb2FkZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZGVkKHJlc291cmNlLCBkYXRhKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCAhPSAwKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbG9hZE5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGdhbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb2FkTmV4dCgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVGlueS5Mb2FkZXIuYXRsYXMgPSBmdW5jdGlvbihyZXNvdXJjZSwgY2IpXHJcbntcclxuICAgIHZhciBrZXkgPSByZXNvdXJjZS5rZXk7XHJcblxyXG4gICAgVGlueS5Mb2FkZXIuaW1hZ2UocmVzb3VyY2UsIGZ1bmN0aW9uKHJlc291cmNlLCBpbWFnZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzb3VyY2UuZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB1dWlkID0ga2V5ICsgXCIuXCIgKyByZXNvdXJjZS5kYXRhW2ldLm5hbWU7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gbmV3IFRpbnkuVGV4dHVyZShpbWFnZSwgcmVzb3VyY2UuZGF0YVtpXSk7XHJcbiAgICAgICAgICAgIHRleHR1cmUua2V5ID0ga2V5O1xyXG5cclxuICAgICAgICAgICAgVGlueS5DYWNoZS50ZXh0dXJlW3V1aWRdID0gdGV4dHVyZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNiKCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuVGlueS5Mb2FkZXIuc3ByaXRlc2hlZXQgPSBmdW5jdGlvbihyZXNvdXJjZSwgY2IpXHJcbntcclxuICAgIHZhciBrZXkgPSByZXNvdXJjZS5rZXk7XHJcblxyXG4gICAgVGlueS5Mb2FkZXIuaW1hZ2UocmVzb3VyY2UsIGZ1bmN0aW9uKHJlc291cmNlLCBpbWFnZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsYXN0RnJhbWUsIHV1aWQsIHRleHR1cmU7XHJcblxyXG4gICAgICAgIGlmIChyZXNvdXJjZS5kYXRhKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZnJhbWVEYXRhID0gcmVzb3VyY2UuZGF0YTtcclxuICAgICAgICAgICAgbGFzdEZyYW1lID0gKGZyYW1lRGF0YS5sZW5ndGggLSAxKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGxhc3RGcmFtZTsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB1dWlkID0ga2V5ICsgXCIuXCIgKyBpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRleHR1cmUgPSBuZXcgVGlueS5UZXh0dXJlKGltYWdlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgeDogTWF0aC5mbG9vcihmcmFtZURhdGFbaV0ueCksXHJcbiAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5mbG9vcihmcmFtZURhdGFbaV0ueSksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IE1hdGguZmxvb3IoZnJhbWVEYXRhW2ldLndpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IE1hdGguZmxvb3IoZnJhbWVEYXRhW2ldLmhlaWdodCksXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGZyYW1lRGF0YVtpXS5kdXJhdGlvblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGV4dHVyZS5rZXkgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICB0ZXh0dXJlLmxhc3RGcmFtZSA9IGxhc3RGcmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICBUaW55LkNhY2hlLnRleHR1cmVbdXVpZF0gPSB0ZXh0dXJlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgd2lkdGggPSBpbWFnZS5uYXR1cmFsV2lkdGggfHwgaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBpbWFnZS5uYXR1cmFsSGVpZ2h0IHx8IGltYWdlLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIHZhciBmcmFtZVdpZHRoID0gcmVzb3VyY2Uud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBmcmFtZUhlaWdodCA9IHJlc291cmNlLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmICghZnJhbWVXaWR0aCkgZnJhbWVXaWR0aCA9IE1hdGguZmxvb3Iod2lkdGggLyAocmVzb3VyY2UuY29scyB8fCAxKSk7XHJcbiAgICAgICAgICAgIGlmICghZnJhbWVIZWlnaHQpIGZyYW1lSGVpZ2h0ID0gTWF0aC5mbG9vcihoZWlnaHQgLyAocmVzb3VyY2Uucm93cyB8fCAxKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29scyA9IE1hdGguZmxvb3Iod2lkdGggLyBmcmFtZVdpZHRoKTtcclxuICAgICAgICAgICAgdmFyIHJvd3MgPSBNYXRoLmZsb29yKGhlaWdodCAvIGZyYW1lSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IGNvbHMgKiByb3dzO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRvdGFsID09PSAwKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNvdXJjZS50b3RhbCkgdG90YWwgPSBNYXRoLm1pbih0b3RhbCwgcmVzb3VyY2UudG90YWwpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgICAgICB2YXIgeSA9IDA7XHJcbiAgICAgICAgICAgIGxhc3RGcmFtZSA9IHRvdGFsIC0gMTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG90YWw7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdXVpZCA9IGtleSArIFwiLlwiICsgaTtcclxuICAgICAgICAgICAgICAgIHRleHR1cmUgPSBuZXcgVGlueS5UZXh0dXJlKGltYWdlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBmcmFtZVdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogZnJhbWVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IHJlc291cmNlLmR1cmF0aW9uXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRleHR1cmUua2V5ID0ga2V5O1xyXG4gICAgICAgICAgICAgICAgdGV4dHVyZS5sYXN0RnJhbWUgPSBsYXN0RnJhbWU7XHJcbiAgICAgICAgICAgICAgICBUaW55LkNhY2hlLnRleHR1cmVbdXVpZF0gPSB0ZXh0dXJlO1xyXG5cclxuICAgICAgICAgICAgICAgIHggKz0gZnJhbWVXaWR0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoeCArIGZyYW1lV2lkdGggPiB3aWR0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB5ICs9IGZyYW1lSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYigpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5UaW55LkxvYWRlci5pbWFnZSA9IGZ1bmN0aW9uKHJlc291cmNlLCBjYikgXHJcbntcclxuICAgIC8vIGlmIChUaW55LkNhY2hlW1wiaW1hZ2VcIl1bcmVzb3VyY2Uua2V5XSkgcmV0dXJuIGNiKHJlc291cmNlLCBUaW55LkNhY2hlW1wiaW1hZ2VcIl1bcmVzb3VyY2Uua2V5XSk7XHJcblxyXG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIFRpbnkuQ2FjaGUuaW1hZ2VbcmVzb3VyY2Uua2V5XSA9IGltYWdlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNiKHJlc291cmNlLCBpbWFnZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uKClcclxuICAgIC8vIHtcclxuICAgIC8vICAgICBjYihyZXNvdXJjZSwgaW1hZ2UpO1xyXG4gICAgLy8gfSlcclxuXHJcbiAgICBpbWFnZS5zcmMgPSByZXNvdXJjZS5zcmM7XHJcbn1cclxuXHJcblRpbnkucmVnaXN0ZXJTeXN0ZW0oXCJsb2FkXCIsIFRpbnkuTG9hZGVyKTsiLCJ2YXIgX2lzU2V0VGltZU91dCwgX29uTG9vcCwgX3RpbWVPdXRJRCwgX3ByZXZUaW1lLCBfbGFzdFRpbWU7XHJcblxyXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbn1cclxuXHJcbmlmIChzZWxmLnBlcmZvcm1hbmNlICE9PSB1bmRlZmluZWQgJiYgc2VsZi5wZXJmb3JtYW5jZS5ub3cgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgbm93ID0gc2VsZi5wZXJmb3JtYW5jZS5ub3cuYmluZChzZWxmLnBlcmZvcm1hbmNlKTtcclxufSBlbHNlIGlmIChEYXRlLm5vdyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBub3cgPSBEYXRlLm5vdztcclxufVxyXG5cclxuVGlueS5SQUYgPSBmdW5jdGlvbiAoZ2FtZSwgZm9yY2VTZXRUaW1lT3V0KVxyXG57XHJcblxyXG4gICAgaWYgKGZvcmNlU2V0VGltZU91dCA9PT0gdW5kZWZpbmVkKSB7IGZvcmNlU2V0VGltZU91dCA9IGZhbHNlOyB9XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmZvcmNlU2V0VGltZU91dCA9IGZvcmNlU2V0VGltZU91dDtcclxuXHJcbiAgICB2YXIgdmVuZG9ycyA9IFtcclxuICAgICAgICAnbXMnLFxyXG4gICAgICAgICdtb3onLFxyXG4gICAgICAgICd3ZWJraXQnLFxyXG4gICAgICAgICdvJ1xyXG4gICAgXTtcclxuXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyB4KyspXHJcbiAgICB7XHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xyXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XHJcbiAgICB9XHJcblxyXG4gICAgX2lzU2V0VGltZU91dCA9IGZhbHNlO1xyXG4gICAgX29uTG9vcCA9IG51bGw7XHJcbiAgICBfdGltZU91dElEID0gbnVsbDtcclxuXHJcbiAgICBfcHJldlRpbWUgPSAwXHJcbiAgICBfbGFzdFRpbWUgPSAwXHJcbn07XHJcblxyXG5UaW55LlJBRi5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgc3RhcnQ6IGZ1bmN0aW9uICgpXHJcbiAgICB7XHJcblxyXG4gICAgICAgIF9wcmV2VGltZSA9IG5vdygpO1xyXG5cclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB0aGlzLmZvcmNlU2V0VGltZU91dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9pc1NldFRpbWVPdXQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgX29uTG9vcCA9IGZ1bmN0aW9uICgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy51cGRhdGVTZXRUaW1lb3V0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBfdGltZU91dElEID0gd2luZG93LnNldFRpbWVvdXQoX29uTG9vcCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9pc1NldFRpbWVPdXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIF9vbkxvb3AgPSBmdW5jdGlvbiAoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy51cGRhdGVSQUYoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIF90aW1lT3V0SUQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKF9vbkxvb3ApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlUkFGOiBmdW5jdGlvbiAoKVxyXG4gICAge1xyXG4gICAgICAgIF9sYXN0VGltZSA9IG5vdygpXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzUnVubmluZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5fdXBkYXRlKE1hdGguZmxvb3IoX2xhc3RUaW1lKSwgX2xhc3RUaW1lIC0gX3ByZXZUaW1lKTtcclxuXHJcbiAgICAgICAgICAgIF90aW1lT3V0SUQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKF9vbkxvb3ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX3ByZXZUaW1lID0gX2xhc3RUaW1lXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGVTZXRUaW1lb3V0OiBmdW5jdGlvbiAoKVxyXG4gICAge1xyXG4gICAgICAgIF9sYXN0VGltZSA9IG5vdygpXHJcbiAgICAgICAgaWYgKHRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLl91cGRhdGUoTWF0aC5mbG9vcihfbGFzdFRpbWUpLCBfbGFzdFRpbWUgLSBfcHJldlRpbWUpO1xyXG5cclxuICAgICAgICAgICAgX3RpbWVPdXRJRCA9IHdpbmRvdy5zZXRUaW1lb3V0KF9vbkxvb3AsIFRpbnkuUkFGLnRpbWVUb0NhbGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfcHJldlRpbWUgPSBfbGFzdFRpbWVcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkgXHJcbiAgICB7XHJcbiAgICAgICAgX3ByZXZUaW1lID0gbm93KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0b3A6IGZ1bmN0aW9uICgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKF9pc1NldFRpbWVPdXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoX3RpbWVPdXRJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShfdGltZU91dElEKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55LlJBRi50aW1lVG9DYWxsID0gMTU7IiwidmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxudmFyIFRpbWVyID0gZnVuY3Rpb24oc3RhdHVzLCBhdXRvUmVtb3ZlLCBnYW1lLCBjYiwgZGVsYXksIGxvb3AsIG4sIG9uY29tcGxldGUpXHJcbntcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB0aGlzLl9jYl8gPSBjYiB8fCBub29wO1xyXG4gICAgdGhpcy5kZWxheSA9IChkZWxheSA9PSB1bmRlZmluZWQgPyAxMDAwIDogZGVsYXkpO1xyXG4gICAgdGhpcy5sb29wID0gbG9vcDtcclxuICAgIHRoaXMuX2NvdW50ID0gbiB8fCAwO1xyXG4gICAgdGhpcy5fcmVwZWF0ID0gKHRoaXMuX2NvdW50ID4gMCk7XHJcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxuICAgIHRoaXMuX2xhc3RGcmFtZSA9IDA7XHJcbiAgICB0aGlzLmF1dG9SZW1vdmUgPSBhdXRvUmVtb3ZlO1xyXG4gICAgdGhpcy5fb25jb21wbGV0ZSA9IG9uY29tcGxldGUgfHwgbm9vcDtcclxufVxyXG5cclxuVGltZXIucHJvdG90eXBlID0ge1xyXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IDE7XHJcbiAgICB9LFxyXG4gICAgcGF1c2U6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IDA7XHJcbiAgICB9LFxyXG4gICAgc3RvcDogZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gMDtcclxuICAgICAgICB0aGlzLl9sYXN0RnJhbWUgPSAwO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZGVsdGFUaW1lKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RGcmFtZSArPSBkZWx0YVRpbWVcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xhc3RGcmFtZSA+PSB0aGlzLmRlbGF5KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYl8oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RGcmFtZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcmVwZWF0KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50LS07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NvdW50ID09PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF1dG9SZW1vdmUgJiYgdGhpcy5nYW1lLnRpbWVyLnJlbW92ZSh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCF0aGlzLmxvb3ApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0b1JlbW92ZSAmJiB0aGlzLmdhbWUudGltZXIucmVtb3ZlKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5UaW55LlRpbWVyID0gVGltZXI7XHJcblxyXG5UaW55LlRpbWVyQ3JlYXRvciA9IGZ1bmN0aW9uKGdhbWUpXHJcbntcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB0aGlzLmxpc3QgPSBbXTtcclxuICAgIHRoaXMuYXV0b1N0YXJ0ID0gdHJ1ZTtcclxuICAgIHRoaXMuYXV0b1JlbW92ZSA9IHRydWU7XHJcbn07XHJcblxyXG5UaW55LlRpbWVyQ3JlYXRvci5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihkZWx0YSkgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5saXN0LmZvckVhY2goZnVuY3Rpb24odG0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0bS51cGRhdGUoZGVsdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlQWxsOiBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5saXN0LmZvckVhY2goZnVuY3Rpb24odG0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0bS5zdG9wKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlzdCA9IFtdO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24odG0pXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGluZGV4T2YgPSB0aGlzLmxpc3QuaW5kZXhPZih0bSk7XHJcbiAgICAgICAgaWYgKGluZGV4T2YgPiAtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRtLnN0b3AoKTtcclxuICAgICAgICAgICAgdGhpcy5saXN0LnNwbGljZShpbmRleE9mLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYWRkOiBmdW5jdGlvbihkZWxheSwgY2IsIGF1dG9zdGFydCwgYXV0b3JlbW92ZSlcclxuICAgIHtcclxuICAgICAgICBpZiAoYXV0b3N0YXJ0ID09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhdXRvc3RhcnQgPSB0aGlzLmF1dG9TdGFydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRpbWVyID0gbmV3IFRpbWVyKChhdXRvc3RhcnQgPyAxIDogMCksIChhdXRvcmVtb3ZlICE9IHVuZGVmaW5lZCA/IGF1dG9yZW1vdmUgOiB0aGlzLmF1dG9SZW1vdmUpLCB0aGlzLmdhbWUsIGNiLCBkZWxheSk7XHJcbiAgICAgICAgdGhpcy5saXN0LnB1c2godGltZXIpO1xyXG4gICAgICAgIHJldHVybiB0aW1lcjtcclxuICAgIH0sXHJcbiAgICBsb29wOiBmdW5jdGlvbihkZWxheSwgY2IsIGF1dG9zdGFydCwgYXV0b3JlbW92ZSlcclxuICAgIHtcclxuICAgICAgICBpZiAoYXV0b3N0YXJ0ID09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhdXRvc3RhcnQgPSB0aGlzLmF1dG9TdGFydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRpbWVyID0gbmV3IFRpbWVyKChhdXRvc3RhcnQgPyAxIDogMCksIChhdXRvcmVtb3ZlICE9IHVuZGVmaW5lZCA/IGF1dG9yZW1vdmUgOiB0aGlzLmF1dG9SZW1vdmUpLCB0aGlzLmdhbWUsIGNiLCBkZWxheSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5saXN0LnB1c2godGltZXIpO1xyXG4gICAgICAgIHJldHVybiB0aW1lcjtcclxuICAgIH0sXHJcbiAgICByZXBlYXQ6IGZ1bmN0aW9uKGRlbGF5LCBuLCBjYiwgY29tcGxldGUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHRpbWVyID0gbmV3IFRpbWVyKCh0aGlzLmF1dG9TdGFydCA/IDEgOiAwKSwgdGhpcy5hdXRvUmVtb3ZlLCB0aGlzLmdhbWUsIGNiLCBkZWxheSwgZmFsc2UsIG4sIGNvbXBsZXRlKTtcclxuICAgICAgICB0aGlzLmxpc3QucHVzaCh0aW1lcik7XHJcbiAgICAgICAgcmV0dXJuIHRpbWVyO1xyXG4gICAgfSxcclxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55LnJlZ2lzdGVyU3lzdGVtKFwidGltZXJcIiwgVGlueS5UaW1lckNyZWF0b3IpOyIsIlxyXG4vLyBUaW55LlRleHR1cmVDYWNoZSA9IHt9O1xyXG4vLyBUaW55LkZyYW1lQ2FjaGUgPSB7fTtcclxuVGlueS5UZXh0dXJlQ2FjaGVJZEdlbmVyYXRvciA9IDA7XHJcblRpbnkuVGV4dHVyZVNpbGVudEZhaWwgPSBmYWxzZTtcclxuXHJcblRpbnkuVGV4dHVyZSA9IGZ1bmN0aW9uKHNvdXJjZSwgZnJhbWUsIGNyb3AsIHRyaW0pXHJcbntcclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgdGhpcy5ub0ZyYW1lID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5yZXNvbHV0aW9uID0gMTtcclxuXHJcbiAgICB0aGlzLmhhc0xvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIGlmICghZnJhbWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5ub0ZyYW1lID0gdHJ1ZTtcclxuICAgICAgICBmcmFtZSA9IG5ldyBUaW55LlJlY3RhbmdsZSgwLDAsMSwxKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHNvdXJjZSA9PSBcInN0cmluZ1wiKSBcclxuICAgIHtcclxuICAgICAgICB2YXIga2V5ID0gc291cmNlO1xyXG5cclxuICAgICAgICBzb3VyY2UgPSBUaW55LkNhY2hlLmltYWdlW2tleV07XHJcblxyXG4gICAgICAgIGlmICghc291cmNlKSB0aHJvdyBuZXcgRXJyb3IoJ0NhY2hlIEVycm9yOiBpbWFnZSAnICsga2V5ICsgJyBkb2VzYHQgZm91bmQgaW4gY2FjaGUnKTtcclxuXHJcbiAgICAgICAgVGlueS5DYWNoZS50ZXh0dXJlW2tleV0gPSB0aGlzO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcblxyXG4gICAgdGhpcy5mcmFtZSA9IGZyYW1lO1xyXG5cclxuICAgIHRoaXMudHJpbSA9IHRyaW07XHJcblxyXG4gICAgdGhpcy52YWxpZCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMud2lkdGggPSAwO1xyXG5cclxuICAgIHRoaXMuaGVpZ2h0ID0gMDtcclxuXHJcbiAgICB0aGlzLmNyb3AgPSBjcm9wIHx8IG5ldyBUaW55LlJlY3RhbmdsZSgwLCAwLCAxLCAxKTtcclxuXHJcbiAgICBpZigodGhpcy5zb3VyY2UuY29tcGxldGUgfHwgdGhpcy5zb3VyY2UuZ2V0Q29udGV4dCkgJiYgdGhpcy5zb3VyY2Uud2lkdGggJiYgdGhpcy5zb3VyY2UuaGVpZ2h0KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub25Tb3VyY2VMb2FkZWQoKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc291cmNlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzY29wZS5vblNvdXJjZUxvYWRlZCgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5UaW55LlRleHR1cmUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVGlueS5UZXh0dXJlO1xyXG5cclxuVGlueS5UZXh0dXJlLnByb3RvdHlwZS5vblNvdXJjZUxvYWRlZCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5oYXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy53aWR0aCA9IHRoaXMuc291cmNlLm5hdHVyYWxXaWR0aCB8fCB0aGlzLnNvdXJjZS53aWR0aDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5zb3VyY2UubmF0dXJhbEhlaWdodCB8fCB0aGlzLnNvdXJjZS5oZWlnaHQ7XHJcblxyXG4gICAgaWYgKHRoaXMubm9GcmFtZSkgdGhpcy5mcmFtZSA9IG5ldyBUaW55LlJlY3RhbmdsZSgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgdGhpcy5zZXRGcmFtZSh0aGlzLmZyYW1lKTtcclxufTtcclxuXHJcblRpbnkuVGV4dHVyZS5wcm90b3R5cGUuYWRkVG9DYWNoZSA9IGZ1bmN0aW9uKGtleSlcclxue1xyXG4gICAgVGlueS5DYWNoZS50ZXh0dXJlW2tleV0gPSB0aGlzO1xyXG4gICAgdGhpcy5rZXkgPSBrZXk7XHJcbn07XHJcblxyXG5UaW55LlRleHR1cmUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIGlmICh0aGlzLmtleSkge1xyXG4gICAgICAgIGRlbGV0ZSBUaW55LkNhY2hlLnRleHR1cmVbdGhpcy5rZXldO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc291cmNlID0gbnVsbDtcclxuICAgIHRoaXMudmFsaWQgPSBmYWxzZTtcclxufTtcclxuXHJcblRpbnkuVGV4dHVyZS5wcm90b3R5cGUuc2V0RnJhbWUgPSBmdW5jdGlvbihmcmFtZSlcclxue1xyXG4gICAgdGhpcy5ub0ZyYW1lID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5mcmFtZSA9IGZyYW1lO1xyXG5cclxuICAgIHRoaXMudmFsaWQgPSBmcmFtZSAmJiBmcmFtZS53aWR0aCAmJiBmcmFtZS5oZWlnaHQgJiYgdGhpcy5zb3VyY2UgJiYgdGhpcy5oYXNMb2FkZWQ7XHJcblxyXG4gICAgaWYgKCF0aGlzLnZhbGlkKSByZXR1cm47XHJcblxyXG4gICAgLy8gdGhpcy53aWR0aCA9IGZyYW1lLndpZHRoO1xyXG4gICAgLy8gdGhpcy5oZWlnaHQgPSBmcmFtZS5oZWlnaHQ7XHJcblxyXG4gICAgdGhpcy5jcm9wLnggPSBmcmFtZS54O1xyXG4gICAgdGhpcy5jcm9wLnkgPSBmcmFtZS55O1xyXG4gICAgdGhpcy5jcm9wLndpZHRoID0gZnJhbWUud2lkdGg7XHJcbiAgICB0aGlzLmNyb3AuaGVpZ2h0ID0gZnJhbWUuaGVpZ2h0O1xyXG5cclxuICAgIGlmICghdGhpcy50cmltICYmIChmcmFtZS54ICsgZnJhbWUud2lkdGggPiB0aGlzLndpZHRoIHx8IGZyYW1lLnkgKyBmcmFtZS5oZWlnaHQgPiB0aGlzLmhlaWdodCkpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFUaW55LlRleHR1cmVTaWxlbnRGYWlsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUZXh0dXJlIEVycm9yOiBmcmFtZSBkb2VzIG5vdCBmaXQgaW5zaWRlIHRoZSBiYXNlIFRleHR1cmUgZGltZW5zaW9ucyAnICsgdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRyaW0pXHJcbiAgICB7XHJcbiAgICAgICAgLy8gdGhpcy53aWR0aCA9IHRoaXMudHJpbS53aWR0aDtcclxuICAgICAgICAvLyB0aGlzLmhlaWdodCA9IHRoaXMudHJpbS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53aWR0aCA9IHRoaXMudHJpbS53aWR0aDtcclxuICAgICAgICB0aGlzLmZyYW1lLmhlaWdodCA9IHRoaXMudHJpbS5oZWlnaHQ7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBUaW55LlRleHR1cmUuZnJvbUltYWdlID0gZnVuY3Rpb24oa2V5LCBpbWFnZVVybCwgY3Jvc3NvcmlnaW4pXHJcbi8vIHtcclxuLy8gICAgIHZhciB0ZXh0dXJlID0gVGlueS5UZXh0dXJlQ2FjaGVba2V5XTtcclxuXHJcbi8vICAgICBpZighdGV4dHVyZSlcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB0ZXh0dXJlID0gbmV3IFRpbnkuVGV4dHVyZShUaW55LkJhc2VUZXh0dXJlLmZyb21JbWFnZShrZXksIGltYWdlVXJsLCBjcm9zc29yaWdpbikpO1xyXG4vLyAgICAgICAgIHRleHR1cmUua2V5ID0ga2V5XHJcbi8vICAgICAgICAgVGlueS5UZXh0dXJlQ2FjaGVba2V5XSA9IHRleHR1cmU7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcmV0dXJuIHRleHR1cmU7XHJcbi8vIH07XHJcblxyXG4vLyBUaW55LlRleHR1cmUuZnJvbUZyYW1lID0gZnVuY3Rpb24oZnJhbWVJZClcclxuLy8ge1xyXG4vLyAgICAgdmFyIHRleHR1cmUgPSBUaW55LlRleHR1cmVDYWNoZVtmcmFtZUlkXTtcclxuLy8gICAgIGlmKCF0ZXh0dXJlKSB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBmcmFtZUlkIFwiJyArIGZyYW1lSWQgKyAnXCIgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHRleHR1cmUgY2FjaGUgJyk7XHJcbi8vICAgICByZXR1cm4gdGV4dHVyZTtcclxuLy8gfTtcclxuXHJcblRpbnkuVGV4dHVyZS5mcm9tQ2FudmFzID0gZnVuY3Rpb24oY2FudmFzKVxyXG57XHJcbiAgICAvLyBpZighY2FudmFzLl90aW55SWQpXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgY2FudmFzLl90aW55SWQgPSAnX2Zyb21fY2FudmFzXycgKyBUaW55LlRleHR1cmVDYWNoZUlkR2VuZXJhdG9yKys7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gdmFyIHRleHR1cmUgPSBUaW55LkNhY2hlLnRleHR1cmVbY2FudmFzLl90aW55SWRdO1xyXG5cclxuICAgIC8vIGlmKCF0ZXh0dXJlKVxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHRleHR1cmUgPSBuZXcgVGlueS5UZXh0dXJlKCBjYW52YXMgKTtcclxuICAgIC8vICAgICBUaW55LkNhY2hlLnRleHR1cmVbY2FudmFzLl90aW55SWRdID0gdGV4dHVyZTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyByZXR1cm4gdGV4dHVyZTtcclxuICAgIHJldHVybiBuZXcgVGlueS5UZXh0dXJlKCBjYW52YXMgKTtcclxufTtcclxuXHJcbi8vIFRpbnkuVGV4dHVyZS5hZGRUZXh0dXJlVG9DYWNoZSA9IGZ1bmN0aW9uKHRleHR1cmUsIGlkKVxyXG4vLyB7XHJcbi8vICAgICBUaW55LlRleHR1cmVDYWNoZVtpZF0gPSB0ZXh0dXJlO1xyXG4vLyB9O1xyXG5cclxuXHJcbi8vIFRpbnkuVGV4dHVyZS5yZW1vdmVUZXh0dXJlRnJvbUNhY2hlID0gZnVuY3Rpb24oaWQpXHJcbi8vIHtcclxuLy8gICAgIHZhciB0ZXh0dXJlID0gVGlueS5UZXh0dXJlQ2FjaGVbaWRdO1xyXG4vLyAgICAgZGVsZXRlIFRpbnkuVGV4dHVyZUNhY2hlW2lkXTtcclxuLy8gICAgIGRlbGV0ZSBUaW55LkJhc2VUZXh0dXJlQ2FjaGVbaWRdO1xyXG4vLyAgICAgcmV0dXJuIHRleHR1cmU7XHJcbi8vIH07IiwiXHJcbmZ1bmN0aW9uIEV2ZW50TGlzdGVuZXJzKCkgXHJcbntcclxuICAgIHRoaXMuYSA9IFtdO1xyXG4gICAgdGhpcy5uID0gMDtcclxufVxyXG5cclxuVGlueS5FdmVudEVtaXR0ZXIgPSB7XHJcblxyXG4gICAgY2FsbDogZnVuY3Rpb24ob2JqKSBcclxuICAgIHtcclxuICAgICAgICBpZiAob2JqKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG9iaiA9IG9iai5wcm90b3R5cGUgfHwgb2JqO1xyXG4gICAgICAgICAgICBUaW55LkV2ZW50RW1pdHRlci5taXhpbihvYmopO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbWl4aW46IGZ1bmN0aW9uKG9iaikgXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzX2V2ZW50cyA9IHt9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBwdXNoTGlzdGVuZXIoZXZlbnQsIGZuLCBjb250ZXh0LCBvbmNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IGxpc3RlbmVyc19ldmVudHNbZXZlbnRdXHJcblxyXG4gICAgICAgICAgICBpZiAoIWxpc3RlbmVycylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzX2V2ZW50c1tldmVudF0gPSBuZXcgRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGlzdGVuZXJzLmEucHVzaChmbiwgY29udGV4dCB8fCBudWxsLCBvbmNlIHx8IGZhbHNlKTtcclxuICAgICAgICAgICAgbGlzdGVuZXJzLm4gKz0gMztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iai5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuLCBjb250ZXh0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHVzaExpc3RlbmVyKGV2ZW50LCBmbiwgY29udGV4dCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYmoub24gPSBwdXNoTGlzdGVuZXI7XHJcblxyXG4gICAgICAgIG9iai5vZmYgPSBmdW5jdGlvbihldmVudCwgZm4sIGNvbnRleHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbGlzdGVuZXJzID0gbGlzdGVuZXJzX2V2ZW50c1tldmVudF1cclxuXHJcbiAgICAgICAgICAgIGlmICghbGlzdGVuZXJzKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB2YXIgZm5BcnJheSA9IGxpc3RlbmVyc19ldmVudHNbZXZlbnRdLmE7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWZuKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm5BcnJheS5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCFjb250ZXh0KSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmbkFycmF5Lmxlbmd0aDsgaSArPSAzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmbkFycmF5W2ldID09IGZuKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm5BcnJheS5zcGxpY2UoaSwgMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgLT0gMztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmbkFycmF5Lmxlbmd0aDsgaSArPSAzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmbkFycmF5W2ldID09IGZuICYmIGZuQXJyYXlbaSArIDFdID09IGNvbnRleHQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbkFycmF5LnNwbGljZShpLCAzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSAtPSAzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGZuQXJyYXkubGVuZ3RoID09IDApIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgbGlzdGVuZXJzX2V2ZW50c1tldmVudF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iai5lbWl0ID0gZnVuY3Rpb24oZXZlbnQsIGExLCBhMiwgYTMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbGlzdGVuZXJzID0gbGlzdGVuZXJzX2V2ZW50c1tldmVudF07XHJcblxyXG4gICAgICAgICAgICBpZiAoIWxpc3RlbmVycykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZuQXJyYXkgPSBsaXN0ZW5lcnMuYTtcclxuICAgICAgICAgICAgbGlzdGVuZXJzLm4gPSAwO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBmbiwgY3R4O1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmbkFycmF5Lmxlbmd0aCAtIGxpc3RlbmVycy5uOyBpICs9IDMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZuID0gZm5BcnJheVtpXTtcclxuICAgICAgICAgICAgICAgIGN0eCA9IGZuQXJyYXlbaSArIDFdO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZm5BcnJheVtpICsgMl0pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm5BcnJheS5zcGxpY2UoaSwgMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaSAtPSAzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsZW4gPD0gMSlcclxuICAgICAgICAgICAgICAgICAgICBmbi5jYWxsKGN0eCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsZW4gPT0gMilcclxuICAgICAgICAgICAgICAgICAgICBmbi5jYWxsKGN0eCwgYTEpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGVuID09IDMpXHJcbiAgICAgICAgICAgICAgICAgICAgZm4uY2FsbChjdHgsIGExLCBhMik7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZm4uY2FsbChjdHgsIGExLCBhMiwgYTMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIChmbkFycmF5W2kgKyAyXSlcclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBmbkFycmF5LnNwbGljZShpLCAzKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICBpIC09IDM7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChmbkFycmF5Lmxlbmd0aCA9PSAwKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGxpc3RlbmVyc19ldmVudHNbZXZlbnRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyIsImlmICghRGF0ZS5ub3cpIHtcclxuICBEYXRlLm5vdyA9IGZ1bmN0aW9uIG5vdygpIHtcclxuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICB9O1xyXG59XHJcblxyXG5pZiAodHlwZW9mKEZsb2F0MzJBcnJheSkgPT0gJ3VuZGVmaW5lZCcpXHJcbntcclxuXHR3aW5kb3cuRmxvYXQzMkFycmF5ID0gQXJyYXlcclxufSJdLCJzb3VyY2VSb290IjoiIn0=