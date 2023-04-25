!function(){var t={776:function(){var t=function(){};Tiny.App=function(i){this.callbackContext=this,this.state=0,this.timeScale=1,this.width=0,this.height=0,this.systems=[],this.updatable=[],this.paused=!1,this.pauseDuration=0,this.inputView=document.body,Tiny.app||(Tiny.app=this),Tiny.EventEmitter&&Tiny.EventEmitter.mixin(this),i=i||{},this.boot=i.boot||this.boot||t,this.preload=i.preload||this.preload||t,this.create=i.create||this.create||t,this.update=i.update||this.update||t,this.render=i.render||this.render||t,this._resize_cb=i.resize||t,this._destroy_cb=i.destroy||t;var e=this;setTimeout((function(){e._boot()}),0)},Tiny.App.prototype._boot=function(){for(var t=0;t<Tiny.systems.length;t++){var i=Tiny.systems[t],e=new i._class_(this);this.systems.push(e),e.update&&this.updatable.push(e),i.name&&(this[i.name]=e)}Tiny.RAF&&(this.raf=new Tiny.RAF(this)),this.boot.call(this.callbackContext);var n=this;setTimeout((function(){n.load?n._preload():n._create()}),0)},Tiny.App.prototype._preload=function(){this.preload.call(this.callbackContext),this.state=1,this.load.start(this._create)},Tiny.App.prototype._create=function(){this.emit("load"),this.create.call(this.callbackContext),this.raf&&this.raf.start(),this.state=2},Tiny.App.prototype.pause=function(){if(this.raf&&this.raf.reset(),!this.paused){for(var t=0;t<this.systems.length;t++)this.systems[t].pause&&this.systems[t].pause();this.paused=!0}},Tiny.App.prototype.resume=function(){if(this.raf&&this.raf.reset(),this.paused){for(var t=0;t<this.systems.length;t++)this.systems[t].resume&&this.systems[t].resume();this.paused=!1}},Tiny.App.prototype._update=function(t,i){if(this.paused)this.pauseDuration+=i;else{i*=this.timeScale,this.update.call(this.callbackContext,t,i),this.emit("update",i);for(var e=0;e<this.updatable.length;e++)this.updatable[e].update(i)}this.render(),this.emit("postrender")},Tiny.App.prototype.resize=function(t,i){this.width=t||this.width,this.height=i||this.height,this.state>0&&(this._resize_cb.call(this.callbackContext,this.width,this.height),this.emit("resize",t,i));var e=this;setTimeout((function(){e.input&&e.input.updateBounds()}),0)},Tiny.App.prototype.destroy=function(t){for(var i=0;i<this.systems.length;i++)this.systems[i].destroy&&this.systems[i].destroy(t);this.paused=!0,t&&this.load.clearCache(),this.raf&&this.raf.stop(),this._destroy_cb.call(this.callbackContext),Tiny.app===this&&(Tiny.app=null)}},377:function(){Tiny.VERSION="2.2.0",Tiny.systems=[],Tiny.registerSystem=function(t,i){Tiny.systems.push({name:t,_class_:i})},Tiny.Primitives={POLY:0,RECT:1,CIRC:2,ELIP:3,RREC:4,RREC_LJOIN:5},Tiny.rnd=function(t,i){return t+Math.floor(Math.random()*(i-t+1))},Tiny.style2hex=function(t){return+t.replace("#","0x")},Tiny.hex2style=function(t){return"#"+("00000"+(0|t).toString(16)).substr(-6)},Tiny.hex2rgb=function(t){return[(t>>16&255)/255,(t>>8&255)/255,(255&t)/255]},Tiny.rgb2hex=function(t){return(255*t[0]<<16)+(255*t[1]<<8)+255*t[2]}},100:function(){Tiny.Math={distance:function(t,i,e,n){var s=t-e,r=i-n;return Math.sqrt(s*s+r*r)}};var t=Math.PI/180,i=180/Math.PI;Tiny.Math.degToRad=function(i){return i*t},Tiny.Math.radToDeg=function(t){return t*i}},68:function(){Tiny.Matrix=function(){this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0,this.type=Tiny.MATRIX},Tiny.Matrix.prototype.fromArray=function(t){this.a=t[0],this.b=t[1],this.c=t[3],this.d=t[4],this.tx=t[2],this.ty=t[5]},Tiny.Matrix.prototype.toArray=function(t){this.array||(this.array=new Float32Array(9));var i=this.array;return t?(i[0]=this.a,i[1]=this.b,i[2]=0,i[3]=this.c,i[4]=this.d,i[5]=0,i[6]=this.tx,i[7]=this.ty,i[8]=1):(i[0]=this.a,i[1]=this.c,i[2]=this.tx,i[3]=this.b,i[4]=this.d,i[5]=this.ty,i[6]=0,i[7]=0,i[8]=1),i},Tiny.Matrix.prototype.apply=function(t,i){i=i||new Tiny.Point;var e=t.x,n=t.y;return i.x=this.a*e+this.c*n+this.tx,i.y=this.b*e+this.d*n+this.ty,i},Tiny.Matrix.prototype.applyInverse=function(t,i){i=i||new Tiny.Point;var e=1/(this.a*this.d+this.c*-this.b),n=t.x,s=t.y;return i.x=this.d*e*n+-this.c*e*s+(this.ty*this.c-this.tx*this.d)*e,i.y=this.a*e*s+-this.b*e*n+(-this.ty*this.a+this.tx*this.b)*e,i},Tiny.Matrix.prototype.translate=function(t,i){return this.tx+=t,this.ty+=i,this},Tiny.Matrix.prototype.scale=function(t,i){return this.a*=t,this.d*=i,this.c*=t,this.b*=i,this.tx*=t,this.ty*=i,this},Tiny.Matrix.prototype.rotate=function(t){var i=Math.cos(t),e=Math.sin(t),n=this.a,s=this.c,r=this.tx;return this.a=n*i-this.b*e,this.b=n*e+this.b*i,this.c=s*i-this.d*e,this.d=s*e+this.d*i,this.tx=r*i-this.ty*e,this.ty=r*e+this.ty*i,this},Tiny.Matrix.prototype.append=function(t){var i=this.a,e=this.b,n=this.c,s=this.d;return this.a=t.a*i+t.b*n,this.b=t.a*e+t.b*s,this.c=t.c*i+t.d*n,this.d=t.c*e+t.d*s,this.tx=t.tx*i+t.ty*n+this.tx,this.ty=t.tx*e+t.ty*s+this.ty,this},Tiny.Matrix.prototype.identity=function(){return this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0,this},Tiny.identityMatrix=new Tiny.Matrix},606:function(){Tiny.Point=function(t,i){this.x=t||0,this.y=i||0},Tiny.Point.prototype={set:function(t,i){return this.x=t||0,this.y=i||(0!==i?this.x:0),this}}},378:function(){Tiny.Rectangle=function(t,i,e,n){t=t||0,i=i||0,e=e||0,n=n||0,this.x=t,this.y=i,this.width=e,this.height=n,this.type=Tiny.Primitives.RECT},Tiny.Rectangle.prototype={setTo:function(t,i,e,n){return this.x=t,this.y=i,this.width=e,this.height=n,this},contains:function(t,i){return Tiny.Rectangle.contains(this,t,i)},intersects:function(t){return Tiny.Rectangle.intersects(this,t)}},Object.defineProperty(Tiny.Rectangle.prototype,"bottom",{get:function(){return this.y+this.height},set:function(t){t<=this.y?this.height=0:this.height=t-this.y}}),Object.defineProperty(Tiny.Rectangle.prototype,"right",{get:function(){return this.x+this.width},set:function(t){t<=this.x?this.width=0:this.width=t-this.x}}),Object.defineProperty(Tiny.Rectangle.prototype,"volume",{get:function(){return this.width*this.height}}),Tiny.Rectangle.prototype.constructor=Tiny.Rectangle,Tiny.Rectangle.contains=function(t,i,e){return!(t.width<=0||t.height<=0)&&(i>=t.x&&i<t.right&&e>=t.y&&e<t.bottom)},Tiny.Rectangle.containsPoint=function(t,i){return Tiny.Rectangle.contains(t,i.x,i.y)},Tiny.Rectangle.containsRect=function(t,i){return!(t.volume>i.volume)&&(t.x>=i.x&&t.y>=i.y&&t.right<i.right&&t.bottom<i.bottom)},Tiny.Rectangle.intersects=function(t,i){return!(t.width<=0||t.height<=0||i.width<=0||i.height<=0)&&!(t.right<i.x||t.bottom<i.y||t.x>i.right||t.y>i.bottom)},Tiny.EmptyRectangle=new Tiny.Rectangle(0,0,0,0)},717:function(){var t=2*Math.PI;Tiny.BaseObject2D=function(){this.position=new Tiny.Point(0,0),this.scale=new Tiny.Point(1,1),this.pivot=new Tiny.Point(0,0),this.rotation=0,this.alpha=1,this.visible=!0,this.renderable=!1,this.parent=null,this.worldAlpha=1,this.worldTransform=new Tiny.Matrix,this._sr=0,this._cr=1,this._cacheAsBitmap=!1},Tiny.BaseObject2D.prototype.constructor=Tiny.BaseObject2D,Tiny.BaseObject2D.prototype.destroy=function(){this.parent&&this.parent.remove(this),this.parent=null,this.worldTransform=null,this.visible=!1,this.renderable=!1,this._destroyCachedSprite()},Object.defineProperty(Tiny.BaseObject2D.prototype,"worldVisible",{get:function(){var t=this;do{if(!t.visible)return!1;t=t.parent}while(t);return!0}}),Object.defineProperty(Tiny.BaseObject2D.prototype,"cacheAsBitmap",{get:function(){return this._cacheAsBitmap},set:function(t){this._cacheAsBitmap!==t&&(t?this._generateCachedSprite():this._destroyCachedSprite(),this._cacheAsBitmap=t)}}),Tiny.BaseObject2D.prototype.updateTransform=function(){if(this.parent){var i,e,n,s,r,h,o=this.parent.worldTransform,a=this.worldTransform;this.rotation%t?(this.rotation!==this.rotationCache&&(this.rotationCache=this.rotation,this._sr=Math.sin(this.rotation),this._cr=Math.cos(this.rotation)),i=this._cr*this.scale.x,e=this._sr*this.scale.x,n=-this._sr*this.scale.y,s=this._cr*this.scale.y,r=this.position.x,h=this.position.y,(this.pivot.x||this.pivot.y)&&(r-=this.pivot.x*i+this.pivot.y*n,h-=this.pivot.x*e+this.pivot.y*s),a.a=i*o.a+e*o.c,a.b=i*o.b+e*o.d,a.c=n*o.a+s*o.c,a.d=n*o.b+s*o.d,a.tx=r*o.a+h*o.c+o.tx,a.ty=r*o.b+h*o.d+o.ty):(i=this.scale.x,s=this.scale.y,r=this.position.x-this.pivot.x*i,h=this.position.y-this.pivot.y*s,a.a=i*o.a,a.b=i*o.b,a.c=s*o.c,a.d=s*o.d,a.tx=r*o.a+h*o.c+o.tx,a.ty=r*o.b+h*o.d+o.ty),this.worldAlpha=this.alpha*this.parent.worldAlpha}},Tiny.BaseObject2D.prototype.displayObjectUpdateTransform=Tiny.BaseObject2D.prototype.updateTransform,Tiny.BaseObject2D.prototype.getBounds=function(t){return Tiny.EmptyRectangle},Tiny.BaseObject2D.prototype.getLocalBounds=function(){return this.getBounds(Tiny.identityMatrix)},Tiny.BaseObject2D.prototype.generateTexture=function(t,i){var e=this.getLocalBounds(),n=new Tiny.RenderTexture(0|e.width,0|e.height,i,t);return Tiny.BaseObject2D._tempMatrix.tx=-e.x,Tiny.BaseObject2D._tempMatrix.ty=-e.y,n.render(this,Tiny.BaseObject2D._tempMatrix),n},Tiny.BaseObject2D.prototype.updateCache=function(){this._generateCachedSprite()},Tiny.BaseObject2D.prototype.toGlobal=function(t){return this.displayObjectUpdateTransform(),this.worldTransform.apply(t)},Tiny.BaseObject2D.prototype.toLocal=function(t,i){return i&&(t=i.toGlobal(t)),this.displayObjectUpdateTransform(),this.worldTransform.applyInverse(t)},Tiny.BaseObject2D.prototype._renderCachedSprite=function(t){this._cachedSprite.worldAlpha=this.worldAlpha,Tiny.Sprite.prototype.render.call(this._cachedSprite,t)},Tiny.BaseObject2D.prototype._generateCachedSprite=function(){this._cachedSprite=null,this._cacheAsBitmap=!1;var t=this.getLocalBounds();if(this._cachedSprite)this._cachedSprite.texture.resize(0|t.width,0|t.height);else{var i=new Tiny.RenderTexture(0|t.width,0|t.height);this._cachedSprite=new Tiny.Sprite(i),this._cachedSprite.worldTransform=this.worldTransform}Tiny.BaseObject2D._tempMatrix.tx=-t.x,Tiny.BaseObject2D._tempMatrix.ty=-t.y,this._cachedSprite.texture.render(this,Tiny.BaseObject2D._tempMatrix,!0),this._cachedSprite.anchor.x=-t.x/t.width,this._cachedSprite.anchor.y=-t.y/t.height,this._cacheAsBitmap=!0},Tiny.BaseObject2D.prototype._destroyCachedSprite=function(){this._cachedSprite&&(this._cachedSprite.texture.destroy(!0),this._cachedSprite=null)},Tiny.BaseObject2D.prototype.render=function(t){},Object.defineProperty(Tiny.BaseObject2D.prototype,"x",{get:function(){return this.position.x},set:function(t){this.position.x=t}}),Object.defineProperty(Tiny.BaseObject2D.prototype,"y",{get:function(){return this.position.y},set:function(t){this.position.y=t}}),Tiny.BaseObject2D._tempMatrix=new Tiny.Matrix},758:function(){Tiny.Object2D=function(){Tiny.BaseObject2D.call(this),this.children=[],this._bounds=new Tiny.Rectangle(0,0,1,1),this._currentBounds=null,this._mask=null},Tiny.Object2D.prototype=Object.create(Tiny.BaseObject2D.prototype),Tiny.Object2D.prototype.constructor=Tiny.Object2D,Object.defineProperty(Tiny.Object2D.prototype,"width",{get:function(){return this.scale.x*this.getLocalBounds().width},set:function(t){var i=this.getLocalBounds().width;this.scale.x=0!==i?t/i:1,this._width=t}}),Object.defineProperty(Tiny.Object2D.prototype,"height",{get:function(){return this.scale.y*this.getLocalBounds().height},set:function(t){var i=this.getLocalBounds().height;this.scale.y=0!==i?t/i:1,this._height=t}}),Object.defineProperty(Tiny.Object2D.prototype,"mask",{get:function(){return this._mask},set:function(t){this._mask&&(this._mask.isMask=!1),this._mask=t,this._mask&&(this._mask.isMask=!0)}}),Tiny.Object2D.prototype.destroy=function(){for(var t=this.children.length;t--;)this.children[t].destroy();this.children=[],Tiny.BaseObject2D.prototype.destroy.call(this),this._bounds=null,this._currentBounds=null,this._mask=null,this.input&&this.input.system.remove(this)},Tiny.Object2D.prototype.add=function(t){return this.addChildAt(t,this.children.length)},Tiny.Object2D.prototype.addChildAt=function(t,i){if(i>=0&&i<=this.children.length)return t.parent&&t.parent.remove(t),t.parent=this,this.game&&(t.game=this.game),this.children.splice(i,0,t),t;throw new Error(t+"addChildAt: The index "+i+" supplied is out of bounds "+this.children.length)},Tiny.Object2D.prototype.swapChildren=function(t,i){if(t!==i){var e=this.getChildIndex(t),n=this.getChildIndex(i);if(e<0||n<0)throw new Error("swapChildren: Both the supplied Objects must be a child of the caller.");this.children[e]=i,this.children[n]=t}},Tiny.Object2D.prototype.getChildIndex=function(t){var i=this.children.indexOf(t);if(-1===i)throw new Error("The supplied Object must be a child of the caller");return i},Tiny.Object2D.prototype.setChildIndex=function(t,i){if(i<0||i>=this.children.length)throw new Error("The supplied index is out of bounds");var e=this.getChildIndex(t);this.children.splice(e,1),this.children.splice(i,0,t)},Tiny.Object2D.prototype.getChildAt=function(t){if(t<0||t>=this.children.length)throw new Error("getChildAt: Supplied index "+t+" does not exist in the child list, or the supplied Object must be a child of the caller");return this.children[t]},Tiny.Object2D.prototype.remove=function(t){var i=this.children.indexOf(t);if(-1!==i)return this.removeChildAt(i)},Tiny.Object2D.prototype.removeChildAt=function(t){var i=this.getChildAt(t);return i.parent=void 0,this.children.splice(t,1),i},Tiny.Object2D.prototype.updateTransform=function(){if(this.visible&&(this.displayObjectUpdateTransform(),!this._cacheAsBitmap))for(var t=0,i=this.children.length;t<i;t++)this.children[t].updateTransform()},Tiny.Object2D.prototype.displayObjectContainerUpdateTransform=Tiny.Object2D.prototype.updateTransform,Tiny.Object2D.prototype.getBounds=function(){if(0===this.children.length)return Tiny.EmptyRectangle;if(this._cachedSprite)return this._cachedSprite.getBounds();for(var t,i,e,n=1/0,s=1/0,r=-1/0,h=-1/0,o=!1,a=0,c=this.children.length;a<c;a++){this.children[a].visible&&(o=!0,n=n<(t=this.children[a].getBounds()).x?n:t.x,s=s<t.y?s:t.y,r=r>(i=t.width+t.x)?r:i,h=h>(e=t.height+t.y)?h:e)}if(!o)return Tiny.EmptyRectangle;var p=this._bounds;return p.x=n,p.y=s,p.width=r-n,p.height=h-s,p},Tiny.Object2D.prototype.getLocalBounds=function(){var t=this.worldTransform;this.worldTransform=Tiny.identityMatrix;for(var i=0,e=this.children.length;i<e;i++)this.children[i].updateTransform();var n=this.getBounds();return this.worldTransform=t,n},Tiny.Object2D.prototype.render=function(t){if(!1!==this.visible&&0!==this.alpha)if(this._cacheAsBitmap)this._renderCachedSprite(t);else{this._mask&&t.maskManager.pushMask(this._mask,t);for(var i=0;i<this.children.length;i++)this.children[i].render(t);this._mask&&t.maskManager.popMask(t)}}},746:function(){Tiny.Scene=function(t){Tiny.Object2D.call(this),this.worldTransform=new Tiny.Matrix,this.game=t},Tiny.Scene.prototype=Object.create(Tiny.Object2D.prototype),Tiny.Scene.prototype.constructor=Tiny.Scene,Tiny.Scene.prototype.updateTransform=function(){this.worldAlpha=1;for(var t=0;t<this.children.length;t++)this.children[t].updateTransform()}},162:function(){Tiny.CanvasRenderer=function(t,i,e){e=e||{},this.resolution=null!=e.resolution?e.resolution:1,this.clearBeforeRender=null==e.clearBeforeRender||e.clearBeforeRender,this.transparent=null!=e.transparent&&e.transparent,this.autoResize=e.autoResize||!1,Tiny.defaultRenderer||(Tiny.defaultRenderer=this);var n=this.domElement=e.domElement||document.createElement("canvas");this.context=n.getContext("2d",{alpha:this.transparent}),this.resize(t||800,i||600),this.setClearColor("#ffffff"),Tiny.CanvasMaskManager&&(this.maskManager=new Tiny.CanvasMaskManager),this.renderSession={context:this.context,maskManager:this.maskManager,smoothProperty:null,roundPixels:!1},"imageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="imageSmoothingEnabled":"webkitImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="webkitImageSmoothingEnabled":"mozImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="mozImageSmoothingEnabled":"oImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="oImageSmoothingEnabled":"msImageSmoothingEnabled"in this.context&&(this.renderSession.smoothProperty="msImageSmoothingEnabled")},Tiny.CanvasRenderer.prototype.constructor=Tiny.CanvasRenderer,Tiny.CanvasRenderer.prototype.setClearColor=function(t){this.clearColor=t},Tiny.CanvasRenderer.prototype.render=function(t){t.updateTransform(),this.context.setTransform(1,0,0,1,0,0),this.context.globalAlpha=1,this.renderSession.currentBlendMode="source-over",this.context.globalCompositeOperation="source-over",navigator.isCocoonJS&&this.domElement.screencanvas&&(this.context.fillStyle="black",this.context.clear()),this.clearBeforeRender&&(this.transparent?this.context.clearRect(0,0,this.width*this.resolution,this.height*this.resolution):(this.context.fillStyle=this.clearColor,this.context.fillRect(0,0,this.width*this.resolution,this.height*this.resolution))),this.renderObject(t)},Tiny.CanvasRenderer.prototype.destroy=function(t){void 0===t&&(t=!0),t&&this.domElement.parentNode&&this.domElement.parentNode.removeChild(this.domElement),this.domElement=null,this.context=null,this.maskManager=null,this.renderSession=null,Tiny.defaultRenderer===this&&(Tiny.defaultRenderer=null)},Tiny.CanvasRenderer.prototype.resize=function(t,i){this.width=t,this.height=i;var e=this.domElement;e.width=Math.floor(this.width*this.resolution),e.height=Math.floor(this.height*this.resolution),this.autoResize&&(e.style.width=t+"px",e.style.height=i+"px")},Tiny.CanvasRenderer.prototype.setPixelRatio=function(t){this.resolution=t;var i=this.domElement;i.width=Math.floor(this.width*this.resolution),i.height=Math.floor(this.height*this.resolution)},Tiny.CanvasRenderer.prototype.renderObject=function(t,i){this.renderSession.context=i||this.context,this.renderSession.resolution=this.resolution,t.render(this.renderSession)}},623:function(){Date.now||(Date.now=function(){return(new Date).getTime()}),"undefined"==typeof Float32Array&&(window.Float32Array=Array)}},i={};function e(n){var s=i[n];if(void 0!==s)return s.exports;var r=i[n]={exports:{}};return t[n](r,r.exports,e),r.exports}e(623),window.Tiny={},e(776),e(377),e(100),e(606),e(68),e(378),e(717),e(758),e(746),e(162)}();