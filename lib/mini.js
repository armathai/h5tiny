!function(t){function e(n){if(i[n])return i[n].exports;var s=i[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,e),s.l=!0,s.exports}var i={};e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=14)}([function(t,e,i){i(12),window.Tiny=i(2),i(3),i(7),i(8),i(10),i(9),i(11),i(4),i(5),i(6),i(1)},function(t,e){Tiny.CanvasRenderer=function(t,e,i){i=i||{},this.resolution=void 0!=i.resolution?i.resolution:1,this.clearBeforeRender=void 0==i.clearBeforeRender||i.clearBeforeRender,this.transparent=void 0!=i.transparent&&i.transparent,this.autoResize=i.autoResize||!1,this.width=t||800,this.height=e||600,this.width*=this.resolution,this.height*=this.resolution,this.view=i.view||document.createElement("canvas"),this.context=this.view.getContext("2d",{alpha:this.transparent}),this.refresh=!0,this.view.width=this.width,this.view.height=this.height,Tiny.CanvasMaskManager&&(this.maskManager=new Tiny.CanvasMaskManager),this.renderSession={context:this.context,maskManager:this.maskManager,scaleMode:0,smoothProperty:null,roundPixels:!1},this.mapBlendModes(),this.resize(t,e),"imageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="imageSmoothingEnabled":"webkitImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="webkitImageSmoothingEnabled":"mozImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="mozImageSmoothingEnabled":"oImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="oImageSmoothingEnabled":"msImageSmoothingEnabled"in this.context&&(this.renderSession.smoothProperty="msImageSmoothingEnabled")},Tiny.CanvasRenderer.prototype.constructor=Tiny.CanvasRenderer,Tiny.CanvasRenderer.prototype.render=function(t){t.updateTransform(),this.context.setTransform(1,0,0,1,0,0),this.context.globalAlpha=1,this.renderSession.currentBlendMode=Tiny.blendModes.NORMAL,this.context.globalCompositeOperation=Tiny.blendModesCanvas[Tiny.blendModes.NORMAL],navigator.isCocoonJS&&this.view.screencanvas&&(this.context.fillStyle="black",this.context.clear()),this.clearBeforeRender&&(this.transparent?this.context.clearRect(0,0,this.width,this.height):(this.context.fillStyle=t.backgroundColorString,this.context.fillRect(0,0,this.width,this.height))),this.renderDisplayObject(t)},Tiny.CanvasRenderer.prototype.destroy=function(t){void 0===t&&(t=!0),t&&this.view.parentNode&&this.view.parentNode.removeChild(this.view),this.view=null,this.context=null,this.maskManager=null,this.renderSession=null},Tiny.CanvasRenderer.prototype.resize=function(t,e){this.width=t*this.resolution,this.height=e*this.resolution,this.view.width=this.width,this.view.height=this.height,this.autoResize&&(this.view.style.width=this.width/this.resolution+"px",this.view.style.height=this.height/this.resolution+"px")},Tiny.CanvasRenderer.prototype.renderDisplayObject=function(t,e){this.renderSession.context=e||this.context,this.renderSession.resolution=this.resolution,t._renderCanvas(this.renderSession)},Tiny.CanvasRenderer.prototype.mapBlendModes=function(){Tiny.blendModesCanvas||(Tiny.blendModesCanvas=[],Tiny.blendModesCanvas[Tiny.blendModes.NORMAL]="source-over")}},function(t,e){var i=function t(e,i,n,s,r){n=n||document.body,this._preboot(e,i,s,r),this.renderer=new t.CanvasRenderer(this.width,this.height,{autoResize:!0});var h=this.inputView=this.renderer.view;n.appendChild(h),h.style.position="absolute",h.style.top="0px",h.style.left="0px",h.style.transformOrigin="0% 0%",h.style.perspective="1000px",this._boot()};i.prototype._preload=function(){this.preload.call(this.callbackContext),this.state=1,i.Loader?this.load.start(this._create):this._create()},i.prototype._render=function(){this.renderer.render(this.stage)},i.prototype.resize=function(t,e,i){this._resize(t,e,i)},i.prototype.destroy=function(){this._destroy()},t.exports=i},function(t,e){function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var n=!1;Tiny.prototype._preboot=function(t,e,s,r){this.height=e||720,this.width=t||430,this.callbackContext=this,r=r||{},this.state=0,this.preload=this.preload||r.preload||function(){},this.create=this.create||r.create||function(){},this.update=this.update||r.update||function(){},this._resize_cb=this._resize_cb||r.resize||function(){},this._destroy_cb=this._destroy_cb||r.destroy||function(){},this.stage=new Tiny.Stage(this),"object"==i(window.TWEEN)&&(n=!0),this._raf=s&&Tiny.RAF,this.time={timeToCall:15},this.paused=!1,this.pauseDuration=0,this.tweens=[]},Tiny.prototype._boot=function(){Tiny.Loader&&(this.load=new Tiny.Loader(this)),Tiny.ObjectCreator&&(this.add=new Tiny.ObjectCreator(this)),Tiny.Input&&(this.input=new Tiny.Input(this)),Tiny.TimerCreator&&(this.timer=new Tiny.TimerCreator(this)),this._raf&&(this.raf=new Tiny.RAF(this)),Tiny.defaultRenderer=this.renderer;var t=this;setTimeout(function(){t._preload()},0)},Tiny.prototype.setPixelRatio=function(t){this.renderer.resolution=t},Tiny.prototype._resize=function(t,e,i){this.width=t||this.width,this.height=e||this.height,this.renderer.resize(this.width,this.height),this.state>0&&this._resize_cb.call(this.callbackContext,this.width,this.height,i)},Tiny.prototype._create=function(){this.create.call(this.callbackContext),this._raf&&this.raf.start(),this.state=2},Tiny.prototype.pause=function(){if(n){this.tweens.length=0;for(var t in TWEEN._tweens)this.tweens.push(TWEEN._tweens[t]),TWEEN._tweens[t].pause()}this.paused=!0},Tiny.prototype.pause=function(){n&&(this.tweens.forEach(function(t){t.resume()}),this.tweens.length=0),this.paused=!1},Tiny.prototype._update=function(t,e){this.paused?this.pauseDuration+=e:(this.update.call(this.callbackContext,t,e),n&&TWEEN.update(),this.timers&&this.timers.forEach(function(t){t.update(e)}),this._render())},Tiny.prototype._destroy=function(){Tiny.Input&&this.input.destroy(),n&&TWEEN.removeAll(),this.timers&&this.timer.removeAll(),this.paused=!0,this.stage.destroy();for(var t in Tiny.TextureCache)Tiny.TextureCache[t].destroy(!0);for(var t in Tiny.BaseTextureCache)Tiny.BaseTextureCache[t].destroy();Tiny.BaseTextureCache=[],Tiny.TextureCache=[],this.stage.children=[],this.update(),this.renderer.destroy(!0),this._raf&&this.raf.stop(),this._destroy_cb.call(this.callbackContext)},Tiny.prototype.stop=Tiny.prototype.pause,Tiny.prototype.play=Tiny.prototype.resume,Tiny.prototype.setSize=Tiny.prototype.resize},function(t,e){Tiny.DisplayObject=function(){this.position=new Tiny.Point(0,0),this.scale=new Tiny.Point(1,1),this.transformCallback=null,this.transformCallbackContext=null,this.pivot=new Tiny.Point(0,0),this.rotation=0,this.alpha=1,this.visible=!0,this.hitArea=null,this.renderable=!1,this.parent=null,this.stage=null,this.worldAlpha=1,this.worldTransform=new Tiny.Matrix,this._sr=0,this._cr=1,this._bounds=new Tiny.Rectangle(0,0,1,1),this._currentBounds=null,this._mask=null,this._cacheAsBitmap=!1,this._cacheIsDirty=!1,this.input=null},Object.defineProperty(Tiny.DisplayObject.prototype,"inputEnabled",{get:function(){return this.input&&this.input.enabled},set:function(t){t?null===this.input?(this.input={enabled:!0,parent:this},Tiny.EventTarget.mixin(this.input)):this.input.enabled=!0:null!==this.input&&(this.input.enabled=!1)}}),Tiny.DisplayObject.prototype.constructor=Tiny.DisplayObject,Tiny.DisplayObject.prototype.destroy=function(){if(this.children){for(var t=this.children.length;t--;)this.children[t].destroy();this.children=[]}this.transformCallback=null,this.transformCallbackContext=null,this.hitArea=null,this.parent=null,this.stage=null,this.worldTransform=null,this._bounds=null,this._currentBounds=null,this._mask=null,this.renderable=!1,this._destroyCachedSprite()},Object.defineProperty(Tiny.DisplayObject.prototype,"worldVisible",{get:function(){var t=this;do{if(!t.visible)return!1;t=t.parent}while(t);return!0}}),Object.defineProperty(Tiny.DisplayObject.prototype,"mask",{get:function(){return this._mask},set:function(t){this._mask&&(this._mask.isMask=!1),this._mask=t,this._mask&&(this._mask.isMask=!0)}}),Object.defineProperty(Tiny.DisplayObject.prototype,"cacheAsBitmap",{get:function(){return this._cacheAsBitmap},set:function(t){this._cacheAsBitmap!==t&&(t?this._generateCachedSprite():this._destroyCachedSprite(),this._cacheAsBitmap=t)}}),Tiny.DisplayObject.prototype.updateTransform=function(){if(this.parent){var t,e,i,n,s,r,h=this.parent.worldTransform,o=this.worldTransform;this.rotation%Tiny.PI_2?(this.rotation!==this.rotationCache&&(this.rotationCache=this.rotation,this._sr=Math.sin(this.rotation),this._cr=Math.cos(this.rotation)),t=this._cr*this.scale.x,e=this._sr*this.scale.x,i=-this._sr*this.scale.y,n=this._cr*this.scale.y,s=this.position.x,r=this.position.y,(this.pivot.x||this.pivot.y)&&(s-=this.pivot.x*t+this.pivot.y*i,r-=this.pivot.x*e+this.pivot.y*n),o.a=t*h.a+e*h.c,o.b=t*h.b+e*h.d,o.c=i*h.a+n*h.c,o.d=i*h.b+n*h.d,o.tx=s*h.a+r*h.c+h.tx,o.ty=s*h.b+r*h.d+h.ty):(t=this.scale.x,n=this.scale.y,s=this.position.x-this.pivot.x*t,r=this.position.y-this.pivot.y*n,o.a=t*h.a,o.b=t*h.b,o.c=n*h.c,o.d=n*h.d,o.tx=s*h.a+r*h.c+h.tx,o.ty=s*h.b+r*h.d+h.ty),this.worldAlpha=this.alpha*this.parent.worldAlpha,this.transformCallback&&this.transformCallback.call(this.transformCallbackContext,o,h)}},Tiny.DisplayObject.prototype.displayObjectUpdateTransform=Tiny.DisplayObject.prototype.updateTransform,Tiny.DisplayObject.prototype.getBounds=function(t){return t=t,Tiny.EmptyRectangle},Tiny.DisplayObject.prototype.getLocalBounds=function(){return this.getBounds(Tiny.identityMatrix)},Tiny.DisplayObject.prototype.setStageReference=function(t){this.stage=t},Tiny.DisplayObject.prototype.preUpdate=function(){},Tiny.DisplayObject.prototype.generateTexture=function(t,e){var i=this.getLocalBounds(),n=new Tiny.RenderTexture(0|i.width,0|i.height,e,t);return Tiny.DisplayObject._tempMatrix.tx=-i.x,Tiny.DisplayObject._tempMatrix.ty=-i.y,n.render(this,Tiny.DisplayObject._tempMatrix),n},Tiny.DisplayObject.prototype.updateCache=function(){this._generateCachedSprite()},Tiny.DisplayObject.prototype.toGlobal=function(t){return this.displayObjectUpdateTransform(),this.worldTransform.apply(t)},Tiny.DisplayObject.prototype.toLocal=function(t,e){return e&&(t=e.toGlobal(t)),this.displayObjectUpdateTransform(),this.worldTransform.applyInverse(t)},Tiny.DisplayObject.prototype._renderCachedSprite=function(t){this._cachedSprite.worldAlpha=this.worldAlpha,Tiny.Sprite.prototype._renderCanvas.call(this._cachedSprite,t)},Tiny.DisplayObject.prototype._generateCachedSprite=function(){this._cacheAsBitmap=!1;var t=this.getLocalBounds();if(this._cachedSprite)this._cachedSprite.texture.resize(0|t.width,0|t.height);else{var e=new Tiny.RenderTexture(0|t.width,0|t.height);this._cachedSprite=new Tiny.Sprite(e),this._cachedSprite.worldTransform=this.worldTransform}Tiny.DisplayObject._tempMatrix.tx=-t.x,Tiny.DisplayObject._tempMatrix.ty=-t.y,this._cachedSprite.texture.render(this,Tiny.DisplayObject._tempMatrix,!0),this._cachedSprite.anchor.x=-t.x/t.width,this._cachedSprite.anchor.y=-t.y/t.height,this._cacheAsBitmap=!0},Tiny.DisplayObject.prototype._destroyCachedSprite=function(){this._cachedSprite&&(this._cachedSprite.texture.destroy(!0),this._cachedSprite=null)},Tiny.DisplayObject.prototype._renderCanvas=function(t){t=t},Object.defineProperty(Tiny.DisplayObject.prototype,"x",{get:function(){return this.position.x},set:function(t){this.position.x=t}}),Object.defineProperty(Tiny.DisplayObject.prototype,"y",{get:function(){return this.position.y},set:function(t){this.position.y=t}}),Tiny.DisplayObject._tempMatrix=new Tiny.Matrix},function(t,e){Tiny.DisplayObjectContainer=function(){Tiny.DisplayObject.call(this),this.children=[]},Tiny.DisplayObjectContainer.prototype=Object.create(Tiny.DisplayObject.prototype),Tiny.DisplayObjectContainer.prototype.constructor=Tiny.DisplayObjectContainer,Object.defineProperty(Tiny.DisplayObjectContainer.prototype,"width",{get:function(){return this.scale.x*this.getLocalBounds().width},set:function(t){var e=this.getLocalBounds().width;this.scale.x=0!==e?t/e:1,this._width=t}}),Object.defineProperty(Tiny.DisplayObjectContainer.prototype,"height",{get:function(){return this.scale.y*this.getLocalBounds().height},set:function(t){var e=this.getLocalBounds().height;this.scale.y=0!==e?t/e:1,this._height=t}}),Tiny.DisplayObjectContainer.prototype.addChild=function(t){return this.addChildAt(t,this.children.length)},Tiny.DisplayObjectContainer.prototype.addChildAt=function(t,e){if(e>=0&&e<=this.children.length)return t.parent&&t.parent.removeChild(t),t.parent=this,t.game=this.game,this.children.splice(e,0,t),this.stage&&t.setStageReference(this.stage),t;throw new Error(t+"addChildAt: The index "+e+" supplied is out of bounds "+this.children.length)},Tiny.DisplayObjectContainer.prototype.swapChildren=function(t,e){if(t!==e){var i=this.getChildIndex(t),n=this.getChildIndex(e);if(i<0||n<0)throw new Error("swapChildren: Both the supplied DisplayObjects must be a child of the caller.");this.children[i]=e,this.children[n]=t}},Tiny.DisplayObjectContainer.prototype.getChildIndex=function(t){var e=this.children.indexOf(t);if(-1===e)throw new Error("The supplied DisplayObject must be a child of the caller");return e},Tiny.DisplayObjectContainer.prototype.setChildIndex=function(t,e){if(e<0||e>=this.children.length)throw new Error("The supplied index is out of bounds");var i=this.getChildIndex(t);this.children.splice(i,1),this.children.splice(e,0,t)},Tiny.DisplayObjectContainer.prototype.getChildAt=function(t){if(t<0||t>=this.children.length)throw new Error("getChildAt: Supplied index "+t+" does not exist in the child list, or the supplied DisplayObject must be a child of the caller");return this.children[t]},Tiny.DisplayObjectContainer.prototype.removeChild=function(t){var e=this.children.indexOf(t);if(-1!==e)return this.removeChildAt(e)},Tiny.DisplayObjectContainer.prototype.removeChildAt=function(t){var e=this.getChildAt(t);return this.stage&&e.removeStageReference(),e.parent=void 0,this.children.splice(t,1),e},Tiny.DisplayObjectContainer.prototype.removeChildren=function(t,e){var i=t||0,n="number"==typeof e?e:this.children.length,s=n-i;if(s>0&&s<=n){for(var r=this.children.splice(i,s),h=0;h<r.length;h++){var o=r[h];this.stage&&o.removeStageReference(),o.parent=void 0}return r}if(0===s&&0===this.children.length)return[];throw new Error("removeChildren: Range Error, numeric values are outside the acceptable range")},Tiny.DisplayObjectContainer.prototype.updateTransform=function(){if(this.visible&&(this.displayObjectUpdateTransform(),!this._cacheAsBitmap))for(var t=0,e=this.children.length;t<e;t++)this.children[t].updateTransform()},Tiny.DisplayObjectContainer.prototype.displayObjectContainerUpdateTransform=Tiny.DisplayObjectContainer.prototype.updateTransform,Tiny.DisplayObjectContainer.prototype.getBounds=function(){if(0===this.children.length)return Tiny.EmptyRectangle;for(var t,e,i,n=1/0,s=1/0,r=-1/0,h=-1/0,o=!1,a=0,c=this.children.length;a<c;a++){this.children[a].visible&&(o=!0,t=this.children[a].getBounds(),n=n<t.x?n:t.x,s=s<t.y?s:t.y,e=t.width+t.x,i=t.height+t.y,r=r>e?r:e,h=h>i?h:i)}if(!o)return Tiny.EmptyRectangle;var y=this._bounds;return y.x=n,y.y=s,y.width=r-n,y.height=h-s,y},Tiny.DisplayObjectContainer.prototype.getLocalBounds=function(){var t=this.worldTransform;this.worldTransform=Tiny.identityMatrix;for(var e=0,i=this.children.length;e<i;e++)this.children[e].updateTransform();var n=this.getBounds();return this.worldTransform=t,n},Tiny.DisplayObjectContainer.prototype.setStageReference=function(t){this.stage=t;for(var e=0;e<this.children.length;e++)this.children[e].setStageReference(t)},Tiny.DisplayObjectContainer.prototype.removeStageReference=function(){for(var t=0;t<this.children.length;t++)this.children[t].removeStageReference();this.stage=null},Tiny.DisplayObjectContainer.prototype._renderCanvas=function(t){if(!1!==this.visible&&0!==this.alpha){if(this._cacheAsBitmap)return void this._renderCachedSprite(t);this._mask&&t.maskManager.pushMask(this._mask,t);for(var e=0;e<this.children.length;e++)this.children[e]._renderCanvas(t);this._mask&&t.maskManager.popMask(t)}}},function(t,e){Tiny.Stage=function(t){Tiny.DisplayObjectContainer.call(this),this.worldTransform=new Tiny.Matrix,this.game=t,this.stage=this,this.setBackgroundColor(16777215)},Tiny.Stage.prototype=Object.create(Tiny.DisplayObjectContainer.prototype),Tiny.Stage.prototype.constructor=Tiny.Stage,Tiny.Stage.prototype.updateTransform=function(){this.worldAlpha=1;for(var t=0;t<this.children.length;t++)this.children[t].updateTransform()},Tiny.Stage.prototype.setBackgroundColor=function(t){this.backgroundColor=t||0,this.backgroundColorSplit=Tiny.hex2rgb(this.backgroundColor);var e=this.backgroundColor.toString(16);e="000000".substr(0,6-e.length)+e,this.backgroundColorString="#"+e}},function(t,e){Tiny.VERSION="1.1.2",Tiny.PI_2=2*Math.PI,Tiny._UID=0,Tiny.RETINA_PREFIX="@2x",Tiny.Polygon=function(){},Tiny.Primitives={POLY:0,RECT:1,CIRC:2,ELIP:3,RREC:4,RREC_LJOIN:5},Tiny.blendModes={NORMAL:0},Tiny.hex2rgb=function(t){return[(t>>16&255)/255,(t>>8&255)/255,(255&t)/255]},Tiny.rgb2hex=function(t){return(255*t[0]<<16)+(255*t[1]<<8)+255*t[2]},Tiny.getNextPowerOfTwo=function(t){if(t>0&&0==(t&t-1))return t;for(var e=1;e<t;)e<<=1;return e},Tiny.isPowerOfTwo=function(t,e){return t>0&&0==(t&t-1)&&e>0&&0==(e&e-1)}},function(t,e){Tiny.Math={distance:function(t,e,i,n){var s=t-i,r=e-n;return Math.sqrt(s*s+r*r)}};var i=Math.PI/180,n=180/Math.PI;Tiny.Math.degToRad=function(t){return t*i},Tiny.Math.radToDeg=function(t){return t*n}},function(t,e){Tiny.Matrix=function(){this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0,this.type=Tiny.MATRIX},Tiny.Matrix.prototype.fromArray=function(t){this.a=t[0],this.b=t[1],this.c=t[3],this.d=t[4],this.tx=t[2],this.ty=t[5]},Tiny.Matrix.prototype.toArray=function(t){this.array||(this.array=new Float32Array(9));var e=this.array;return t?(e[0]=this.a,e[1]=this.b,e[2]=0,e[3]=this.c,e[4]=this.d,e[5]=0,e[6]=this.tx,e[7]=this.ty,e[8]=1):(e[0]=this.a,e[1]=this.c,e[2]=this.tx,e[3]=this.b,e[4]=this.d,e[5]=this.ty,e[6]=0,e[7]=0,e[8]=1),e},Tiny.Matrix.prototype.apply=function(t,e){e=e||new Tiny.Point;var i=t.x,n=t.y;return e.x=this.a*i+this.c*n+this.tx,e.y=this.b*i+this.d*n+this.ty,e},Tiny.Matrix.prototype.applyInverse=function(t,e){e=e||new Tiny.Point;var i=1/(this.a*this.d+this.c*-this.b),n=t.x,s=t.y;return e.x=this.d*i*n+-this.c*i*s+(this.ty*this.c-this.tx*this.d)*i,e.y=this.a*i*s+-this.b*i*n+(-this.ty*this.a+this.tx*this.b)*i,e},Tiny.Matrix.prototype.translate=function(t,e){return this.tx+=t,this.ty+=e,this},Tiny.Matrix.prototype.scale=function(t,e){return this.a*=t,this.d*=e,this.c*=t,this.b*=e,this.tx*=t,this.ty*=e,this},Tiny.Matrix.prototype.rotate=function(t){var e=Math.cos(t),i=Math.sin(t),n=this.a,s=this.c,r=this.tx;return this.a=n*e-this.b*i,this.b=n*i+this.b*e,this.c=s*e-this.d*i,this.d=s*i+this.d*e,this.tx=r*e-this.ty*i,this.ty=r*i+this.ty*e,this},Tiny.Matrix.prototype.append=function(t){var e=this.a,i=this.b,n=this.c,s=this.d;return this.a=t.a*e+t.b*n,this.b=t.a*i+t.b*s,this.c=t.c*e+t.d*n,this.d=t.c*i+t.d*s,this.tx=t.tx*e+t.ty*n+this.tx,this.ty=t.tx*i+t.ty*s+this.ty,this},Tiny.Matrix.prototype.identity=function(){return this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0,this},Tiny.identityMatrix=new Tiny.Matrix},function(t,e){Tiny.Point=function(t,e){this.x=t||0,this.y=e||0},Tiny.Point.prototype={set:function(t,e){return this.x=t||0,this.y=e||(0!==e?this.x:0),this},setTo:function(t,e){this.set(t,e)}}},function(t,e){Tiny.Rectangle=function(t,e,i,n){t=t||0,e=e||0,i=i||0,n=n||0,this.x=t,this.y=e,this.width=i,this.height=n,this.type=Tiny.Primitives.RECT},Tiny.Rectangle.prototype={setTo:function(t,e,i,n){return this.x=t,this.y=e,this.width=i,this.height=n,this},contains:function(t,e){return Tiny.Rectangle.contains(this,t,e)},intersects:function(t){return Tiny.Rectangle.intersects(this,t)},toString:function(){return"[{Rectangle (x="+this.x+" y="+this.y+" width="+this.width+" height="+this.height+" empty="+this.empty+")}]"}},Object.defineProperty(Tiny.Rectangle.prototype,"bottom",{get:function(){return this.y+this.height},set:function(t){t<=this.y?this.height=0:this.height=t-this.y}}),Object.defineProperty(Tiny.Rectangle.prototype,"right",{get:function(){return this.x+this.width},set:function(t){t<=this.x?this.width=0:this.width=t-this.x}}),Object.defineProperty(Tiny.Rectangle.prototype,"volume",{get:function(){return this.width*this.height}}),Tiny.Rectangle.prototype.constructor=Tiny.Rectangle,Tiny.Rectangle.contains=function(t,e,i){return!(t.width<=0||t.height<=0)&&(e>=t.x&&e<t.right&&i>=t.y&&i<t.bottom)},Tiny.Rectangle.containsPoint=function(t,e){return Tiny.Rectangle.contains(t,e.x,e.y)},Tiny.Rectangle.containsRect=function(t,e){return!(t.volume>e.volume)&&(t.x>=e.x&&t.y>=e.y&&t.right<e.right&&t.bottom<e.bottom)},Tiny.Rectangle.intersects=function(t,e){return!(t.width<=0||t.height<=0||e.width<=0||e.height<=0)&&!(t.right<e.x||t.bottom<e.y||t.x>e.right||t.y>e.bottom)},Tiny.EmptyRectangle=new Tiny.Rectangle(0,0,0,0)},function(t,e){Date.now||(Date.now=function(){return(new Date).getTime()}),"undefined"==typeof Float32Array&&(window.Float32Array=Array)},,function(t,e,i){i(0),i(19),i(17),i(18),i(15),i(16)},function(t,e){Tiny.Sprite=function(t){Tiny.DisplayObjectContainer.call(this),this.anchor=new Tiny.Point,this.texture=t,this._width=0,this._height=0,this._frame=0,this.tint=16777215,this.blendMode=Tiny.blendModes.NORMAL,this.shader=null,this.texture.baseTexture.hasLoaded&&this.onTextureUpdate(),this.renderable=!0},Tiny.Sprite.prototype=Object.create(Tiny.DisplayObjectContainer.prototype),Tiny.Sprite.prototype.constructor=Tiny.Sprite,Object.defineProperty(Tiny.Sprite.prototype,"frameName",{get:function(){return this.texture.frame.name},set:function(t){this.texture.frame.name&&this.setTexture(Tiny.TextureCache[this.texture.key+"_"+t])}}),Object.defineProperty(Tiny.Sprite.prototype,"frame",{get:function(){return this._frame},set:function(t){this.texture.max_no_frame&&(this._frame=t,this._frame>this.texture.max_no_frame&&(this._frame=0),this.setTexture(Tiny.TextureCache[this.texture.key+"_"+this._frame]))}}),Object.defineProperty(Tiny.Sprite.prototype,"width",{get:function(){return this.scale.x*this.texture.frame.width},set:function(t){this.scale.x=t/this.texture.frame.width,this._width=t}}),Object.defineProperty(Tiny.Sprite.prototype,"height",{get:function(){return this.scale.y*this.texture.frame.height},set:function(t){this.scale.y=t/this.texture.frame.height,this._height=t}}),Tiny.Sprite.prototype.setTexture=function(t){this.texture=t,this.cachedTint=16777215},Tiny.Sprite.prototype.onTextureUpdate=function(){this._width&&(this.scale.x=this._width/this.texture.frame.width),this._height&&(this.scale.y=this._height/this.texture.frame.height)},Tiny.Sprite.prototype.animate=function(t){if(this.texture.max_no_frame&&void 0!=this.texture.frame.index){var e=t||this.texture.frame.duration||100;this.animation?(this.animation.delay=e,this.animation.start()):(this.animation=this.game.timer.loop(e,function(){this.frame+=1,this.animation.delay=t||this.texture.frame.duration||100}.bind(this)),this.animation.start())}},Tiny.Sprite.prototype.getBounds=function(t){var e=this.texture.frame.width,i=this.texture.frame.height,n=e*(1-this.anchor.x),s=e*-this.anchor.x,r=i*(1-this.anchor.y),h=i*-this.anchor.y,o=t||this.worldTransform,a=o.a,c=o.b,y=o.c,u=o.d,l=o.tx,d=o.ty,p=-1/0,T=-1/0,f=1/0,x=1/0;if(0===c&&0===y)a<0&&(a*=-1),u<0&&(u*=-1),f=a*s+l,p=a*n+l,x=u*h+d,T=u*r+d;else{var m=a*s+y*h+l,g=u*h+c*s+d,w=a*n+y*h+l,b=u*h+c*n+d,v=a*n+y*r+l,C=u*r+c*n+d,_=a*s+y*r+l,S=u*r+c*s+d;f=m<f?m:f,f=w<f?w:f,f=v<f?v:f,f=_<f?_:f,x=g<x?g:x,x=b<x?b:x,x=C<x?C:x,x=S<x?S:x,p=m>p?m:p,p=w>p?w:p,p=v>p?v:p,p=_>p?_:p,T=g>T?g:T,T=b>T?b:T,T=C>T?C:T,T=S>T?S:T}var O=this._bounds;return O.x=f,O.width=p-f,O.y=x,O.height=T-x,this._currentBounds=O,O},Tiny.Sprite.prototype._renderCanvas=function(t){if(!(!1===this.visible||0===this.alpha||!1===this.renderable||this.texture.crop.width<=0||this.texture.crop.height<=0)){if(this.blendMode!==t.currentBlendMode&&(t.currentBlendMode=this.blendMode,t.context.globalCompositeOperation=Tiny.blendModesCanvas[t.currentBlendMode]),this._mask&&t.maskManager.pushMask(this._mask,t),this.texture.valid){var e=this.texture.baseTexture.resolution/t.resolution;t.context.globalAlpha=this.worldAlpha;var i=this.texture.trim?this.texture.trim.x-this.anchor.x*this.texture.trim.width:this.anchor.x*-this.texture.frame.width,n=this.texture.trim?this.texture.trim.y-this.anchor.y*this.texture.trim.height:this.anchor.y*-this.texture.frame.height;t.roundPixels?(t.context.setTransform(this.worldTransform.a,this.worldTransform.b,this.worldTransform.c,this.worldTransform.d,this.worldTransform.tx*t.resolution|0,this.worldTransform.ty*t.resolution|0),i|=0,n|=0):t.context.setTransform(this.worldTransform.a,this.worldTransform.b,this.worldTransform.c,this.worldTransform.d,this.worldTransform.tx*t.resolution,this.worldTransform.ty*t.resolution),16777215!==this.tint?(this.cachedTint!==this.tint&&(this.cachedTint=this.tint,this.tintedTexture=Tiny.CanvasTinter.getTintedTexture(this,this.tint)),t.context.drawImage(this.tintedTexture,0,0,this.texture.crop.width,this.texture.crop.height,i/e,n/e,this.texture.crop.width/e,this.texture.crop.height/e)):t.context.drawImage(this.texture.baseTexture.source,this.texture.crop.x,this.texture.crop.y,this.texture.crop.width,this.texture.crop.height,i/e,n/e,this.texture.crop.width/e,this.texture.crop.height/e)}for(var s=0;s<this.children.length;s++)this.children[s]._renderCanvas(t);this._mask&&t.maskManager.popMask(t)}}},function(t,e){Tiny.Text=function(t,e){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.resolution=1,Tiny.Sprite.call(this,Tiny.Texture.fromCanvas(this.canvas)),this.setText(t),this.setStyle(e)},Tiny.Text.prototype=Object.create(Tiny.Sprite.prototype),Tiny.Text.prototype.constructor=Tiny.Text,Object.defineProperty(Tiny.Text.prototype,"width",{get:function(){return this.dirty&&(this.updateText(),this.dirty=!1),this.scale.x*this.texture.frame.width},set:function(t){this.scale.x=t/this.texture.frame.width,this._width=t}}),Object.defineProperty(Tiny.Text.prototype,"height",{get:function(){return this.dirty&&(this.updateText(),this.dirty=!1),this.scale.y*this.texture.frame.height},set:function(t){this.scale.y=t/this.texture.frame.height,this._height=t}}),Tiny.Text.prototype.setStyle=function(t){t=t||{},t.font=t.font||"bold 20pt Arial",t.fill=t.fill||"black",t.align=t.align||"left",t.stroke=t.stroke||"black",t.strokeThickness=t.strokeThickness||0,t.wordWrap=t.wordWrap||!1,t.wordWrapWidth=t.wordWrapWidth||100,t.dropShadow=t.dropShadow||!1,t.dropShadowAngle=t.dropShadowAngle||Math.PI/6,t.dropShadowDistance=t.dropShadowDistance||4,t.dropShadowColor=t.dropShadowColor||"black",this.style=t,this.dirty=!0},Tiny.Text.prototype.setText=function(t){this.text=t.toString()||" ",this.dirty=!0},Tiny.Text.prototype.updateText=function(){this.texture.baseTexture.resolution=this.resolution,this.context.font=this.style.font;var t=this.text;this.style.wordWrap&&(t=this.wordWrap(this.text));for(var e=t.split(/(?:\r\n|\r|\n)/),i=[],n=0,s=this.determineFontProperties(this.style.font),r=0;r<e.length;r++){var h=this.context.measureText(e[r]).width;i[r]=h,n=Math.max(n,h)}var o=n+this.style.strokeThickness;this.style.dropShadow&&(o+=this.style.dropShadowDistance),this.canvas.width=(o+this.context.lineWidth)*this.resolution;var a=s.fontSize+this.style.strokeThickness,c=a*e.length;this.style.dropShadow&&(c+=this.style.dropShadowDistance),this.canvas.height=c*this.resolution,this.context.scale(this.resolution,this.resolution),navigator.isCocoonJS&&this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.context.font=this.style.font,this.context.strokeStyle=this.style.stroke,this.context.lineWidth=this.style.strokeThickness,this.context.textBaseline="alphabetic",this.context.miterLimit=2;var y,u;if(this.style.dropShadow){this.context.fillStyle=this.style.dropShadowColor;var l=Math.sin(this.style.dropShadowAngle)*this.style.dropShadowDistance,d=Math.cos(this.style.dropShadowAngle)*this.style.dropShadowDistance;for(r=0;r<e.length;r++)y=this.style.strokeThickness/2,u=this.style.strokeThickness/2+r*a+s.ascent,"right"===this.style.align?y+=n-i[r]:"center"===this.style.align&&(y+=(n-i[r])/2),this.style.fill&&this.context.fillText(e[r],y+l,u+d)}for(this.context.fillStyle=this.style.fill,r=0;r<e.length;r++)y=this.style.strokeThickness/2,u=this.style.strokeThickness/2+r*a+s.ascent,"right"===this.style.align?y+=n-i[r]:"center"===this.style.align&&(y+=(n-i[r])/2),this.style.stroke&&this.style.strokeThickness&&this.context.strokeText(e[r],y,u),this.style.fill&&this.context.fillText(e[r],y,u);this.updateTexture()},Tiny.Text.prototype.updateTexture=function(){this.texture.baseTexture.width=this.canvas.width,this.texture.baseTexture.height=this.canvas.height,this.texture.crop.width=this.texture.frame.width=this.canvas.width,this.texture.crop.height=this.texture.frame.height=this.canvas.height,this._width=this.canvas.width,this._height=this.canvas.height,this.texture.baseTexture.dirty()},Tiny.Text.prototype._renderCanvas=function(t){this.dirty&&(this.resolution=t.resolution,this.updateText(),this.dirty=!1),Tiny.Sprite.prototype._renderCanvas.call(this,t)},Tiny.Text.prototype.determineFontProperties=function(t){var e=Tiny.Text.fontPropertiesCache[t];if(!e){e={};var i=Tiny.Text.fontPropertiesCanvas,n=Tiny.Text.fontPropertiesContext;n.font=t;var s=Math.ceil(n.measureText("|MÉq").width),r=Math.ceil(n.measureText("|MÉq").width),h=2*r;r=1.4*r|0,i.width=s,i.height=h,n.fillStyle="#f00",n.fillRect(0,0,s,h),n.font=t,n.textBaseline="alphabetic",n.fillStyle="#000",n.fillText("|MÉq",0,r);var o,a,c=n.getImageData(0,0,s,h).data,y=c.length,u=4*s,l=0,d=!1;for(o=0;o<r;o++){for(a=0;a<u;a+=4)if(255!==c[l+a]){d=!0;break}if(d)break;l+=u}for(e.ascent=r-o,l=y-u,d=!1,o=h;o>r;o--){for(a=0;a<u;a+=4)if(255!==c[l+a]){d=!0;break}if(d)break;l-=u}e.descent=o-r,e.descent+=6,e.fontSize=e.ascent+e.descent,Tiny.Text.fontPropertiesCache[t]=e}return e},Tiny.Text.prototype.wordWrap=function(t){for(var e="",i=t.split("\n"),n=0;n<i.length;n++){for(var s=this.style.wordWrapWidth,r=i[n].split(" "),h=0;h<r.length;h++){var o=this.context.measureText(r[h]).width,a=o+this.context.measureText(" ").width;0===h||a>s?(h>0&&(e+="\n"),e+=r[h],s=this.style.wordWrapWidth-o):(s-=a,e+=" "+r[h])}n<i.length-1&&(e+="\n")}return e},Tiny.Text.prototype.getBounds=function(t){return this.dirty&&(this.updateText(),this.dirty=!1),Tiny.Sprite.prototype.getBounds.call(this,t)},Tiny.Text.prototype.destroy=function(t){this.context=null,this.canvas=null,this.texture.destroy(void 0===t||t)},Tiny.Text.fontPropertiesCache={},Tiny.Text.fontPropertiesCanvas=document.createElement("canvas"),Tiny.Text.fontPropertiesContext=Tiny.Text.fontPropertiesCanvas.getContext("2d")},function(t,e){Tiny.BaseTextureCache={},Tiny.BaseTextureCacheIdGenerator=0,Tiny.BaseTexture=function(t){if(this.resolution=1,this.width=100,this.height=100,this.hasLoaded=!1,this.source=t,this._UID=Tiny._UID++,this.premultipliedAlpha=!0,this.mipmap=!1,this._dirty=[!0,!0,!0,!0],t){if((this.source.complete||this.source.getContext)&&this.source.width&&this.source.height)this.hasLoaded=!0,this.width=this.source.naturalWidth||this.source.width,this.height=this.source.naturalHeight||this.source.height,this.dirty();else{var e=this;this.source.onload=function(){e.hasLoaded=!0,e.width=e.source.naturalWidth||e.source.width,e.height=e.source.naturalHeight||e.source.height}}this.imageUrl=null,this._powerOf2=!1}},Tiny.BaseTexture.prototype.constructor=Tiny.BaseTexture,Tiny.BaseTexture.prototype.destroy=function(){this.imageUrl?(delete Tiny.BaseTextureCache[this.key],delete Tiny.TextureCache[this.key],this.imageUrl=null,navigator.isCocoonJS||(this.source.src="")):this.source&&this.source._pixiId&&delete Tiny.BaseTextureCache[this.source._pixiId],this.source=null},Tiny.BaseTexture.prototype.updateSourceImage=function(t){this.hasLoaded=!1,this.source.src=null,this.source.src=t},Tiny.BaseTexture.prototype.dirty=function(){},Tiny.BaseTexture.fromImage=function(t,e,i){var n=Tiny.BaseTextureCache[t];if(void 0===i&&-1===e.indexOf("data:")&&(i=!0),!n){var s=new Image;i&&(s.crossOrigin=""),s.src=e,n=new Tiny.BaseTexture(s),n.imageUrl=e,n.key=t,Tiny.BaseTextureCache[t]=n,-1!==e.indexOf(Tiny.RETINA_PREFIX+".")&&(n.resolution=2)}return n},Tiny.BaseTexture.fromCanvas=function(t){t._pixiId||(t._pixiId="canvas_"+Tiny.TextureCacheIdGenerator++);var e=Tiny.BaseTextureCache[t._pixiId];return e||(e=new Tiny.BaseTexture(t),Tiny.BaseTextureCache[t._pixiId]=e),e}},function(t,e){Tiny.TextureCache={},Tiny.FrameCache={},Tiny.TextureSilentFail=!1,Tiny.TextureCacheIdGenerator=0,Tiny.Texture=function(t,e,i,n){this.noFrame=!1,e||(this.noFrame=!0,e=new Tiny.Rectangle(0,0,1,1)),t instanceof Tiny.Texture&&(t=t.baseTexture),this.baseTexture=t,this.frame=e,this.trim=n,this.valid=!1,this.requiresUpdate=!1,this._uvs=null,this.width=0,this.height=0,this.crop=i||new Tiny.Rectangle(0,0,1,1),t.hasLoaded&&(this.noFrame&&(e=new Tiny.Rectangle(0,0,t.width,t.height)),this.setFrame(e))},Tiny.Texture.prototype.constructor=Tiny.Texture,Tiny.Texture.prototype.onBaseTextureLoaded=function(){var t=this.baseTexture;this.noFrame&&(this.frame=new Tiny.Rectangle(0,0,t.width,t.height)),this.setFrame(this.frame)},Tiny.Texture.prototype.destroy=function(t){t&&this.baseTexture.destroy(),this.valid=!1},Tiny.Texture.prototype.setFrame=function(t){if(this.noFrame=!1,this.frame=t,this.width=t.width,this.height=t.height,this.crop.x=t.x,this.crop.y=t.y,this.crop.width=t.width,this.crop.height=t.height,!this.trim&&(t.x+t.width>this.baseTexture.width||t.y+t.height>this.baseTexture.height)){if(!Tiny.TextureSilentFail)throw new Error("Texture Error: frame does not fit inside the base Texture dimensions "+this);return void(this.valid=!1)}this.valid=t&&t.width&&t.height&&this.baseTexture.source&&this.baseTexture.hasLoaded,this.trim&&(this.width=this.trim.width,this.height=this.trim.height,this.frame.width=this.trim.width,this.frame.height=this.trim.height),this.valid&&this._updateUvs()},Tiny.Texture.prototype._updateUvs=function(){this._uvs||(this._uvs=new Tiny.TextureUvs);var t=this.crop,e=this.baseTexture.width,i=this.baseTexture.height;this._uvs.x0=t.x/e,this._uvs.y0=t.y/i,this._uvs.x1=(t.x+t.width)/e,this._uvs.y1=t.y/i,this._uvs.x2=(t.x+t.width)/e,this._uvs.y2=(t.y+t.height)/i,this._uvs.x3=t.x/e,this._uvs.y3=(t.y+t.height)/i},Tiny.Texture.fromImage=function(t,e,i){var n=Tiny.TextureCache[t];return n||(n=new Tiny.Texture(Tiny.BaseTexture.fromImage(t,e,i)),n.key=t,Tiny.TextureCache[t]=n),n},Tiny.Texture.fromFrame=function(t){var e=Tiny.TextureCache[t];if(!e)throw new Error('The frameId "'+t+'" does not exist in the texture cache ');return e},Tiny.Texture.fromCanvas=function(t){var e=Tiny.BaseTexture.fromCanvas(t);return new Tiny.Texture(e)},Tiny.Texture.addTextureToCache=function(t,e){Tiny.TextureCache[e]=t},Tiny.Texture.removeTextureFromCache=function(t){var e=Tiny.TextureCache[t];return delete Tiny.TextureCache[t],delete Tiny.BaseTextureCache[t],e},Tiny.TextureUvs=function(){this.x0=0,this.y0=0,this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.x3=0,this.y3=0}},function(t,e){var i,n,s,r;Tiny.RAF=function(t,e){void 0===e&&(e=!1),this.game=t,this.isRunning=!1,this.forceSetTimeOut=e;for(var h=["ms","moz","webkit","o"],o=0;o<h.length&&!window.requestAnimationFrame;o++)window.requestAnimationFrame=window[h[o]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[h[o]+"CancelAnimationFrame"]||window[h[o]+"CancelRequestAnimationFrame"];i=!1,n=null,s=null,r=0},Tiny.RAF.prototype={start:function(){this.isRunning=!0;var t=this;!window.requestAnimationFrame||this.forceSetTimeOut?(i=!0,n=function(){return t.updateSetTimeout()},s=window.setTimeout(n,0)):(i=!1,n=function(e){return t.updateRAF(e)},s=window.requestAnimationFrame(n))},updateRAF:function(t){this.isRunning&&(this.game._update(Math.floor(t),t-r),s=window.requestAnimationFrame(n)),r=t},updateSetTimeout:function(){var t=Date.now();this.isRunning&&(this.game._update(t-this.paused,t-r),s=window.setTimeout(n,this.game.time.timeToCall)),r=t},stop:function(){i?clearTimeout(s):window.cancelAnimationFrame(s),this.isRunning=!1},isSetTimeOut:function(){return i},isRAF:function(){return!1===i}}}]);