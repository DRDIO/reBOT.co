/*!
jCanvas v5.3.1
Copyright 2012, Caleb Evans
Licensed under the MIT license
*/
(function(z,I,c,u,N,t,w,R,x,A){var B,S,H=z.extend,P=u.round,d=u.PI,o=u.sin,b=u.cos,k=z.event.fix,s={},n={},K="transparent",E,F;function G(){}function Q(T){if(T){H(S,T)}else{S=H(G.prototype,B)}return this}z.fn.jCanvas=Q;Q.version="5.3.1";Q.events={};B={angle:0,align:"center",autosave:w,baseline:"middle",ccw:R,closed:R,compositing:"source-over",cornerRadius:0,cropFromCenter:w,each:x,end:360,fillStyle:K,font:"12pt sans-serif",fromCenter:w,height:x,inDegrees:w,load:x,mask:R,miterLimit:10,opacity:1,projection:0,r1:x,r2:x,radius:0,repeat:"repeat",rounded:R,scale:1,scaleX:1,scaleY:1,shadowBlur:0,shadowColor:K,shadowX:0,shadowY:0,sHeight:x,sides:3,source:"",start:0,strokeCap:"butt",strokeJoin:"miter",strokeStyle:K,strokeWidth:1,sWidth:x,sx:x,sy:x,text:"",visible:w,width:x,x:0,x1:0,y:0,y1:0,};Q();function L(T,U){T.fillStyle=U.fillStyle;T.strokeStyle=U.strokeStyle;T.lineWidth=U.strokeWidth;if(U.rounded){T.lineCap="round";T.lineJoin="round"}else{T.lineCap=U.strokeCap;T.lineJoin=U.strokeJoin;T.miterLimit=U.miterLimit}T.shadowOffsetX=U.shadowX;T.shadowOffsetY=U.shadowY;T.shadowBlur=U.shadowBlur;T.shadowColor=U.shadowColor;T.globalAlpha=U.opacity;T.globalCompositeOperation=U.compositing}s.x=[];s.y=[];function D(T){Q.events[T]=function U(V){V.bind(T+".jCanvas",function(W){s.x[0]=W.offsetX;s.y[0]=W.offsetY;s.type=W.type;V.drawLayers()});U.called=w}}D("click");D("dblclick");D("mousedown");D("mouseup");D("mousemove");Q.events.mouseover=Q.events.mouseout=function y(T){T.bind("mousemove.jCanvas",function(U){s.x[1]=s.x[0];s.y[1]=s.y[0];s.x[0]=U.offsetX;s.y[0]=U.offsetY;s.type="hover";T.drawLayers()});y.called=w};function e(T){T.mouseX=s.x[0];T.mouseY=s.y[0];s.x=[];s.y=[]}function O(X,T,V){var W,Z,Y,U;W=s.type;Z=V[W];Y=T.isPointInPath(s.x[0],s.y[0]);U=T.isPointInPath(s.x[1],s.y[1]);if(W==="hover"){if(Y&&!U&&!V.fired){V.fired=w;e(V);if(V.mouseover){V.mouseover.call(X,V);L(T,V)}}else{if(!Y&&U&&V.fired){V.fired=R;e(V);if(V.mouseout){V.mouseout.call(X,V);L(T,V)}}}}else{if(W!=="hover"&&Z&&Y){e(V);Z.call(X,V);L(T,V)}}}function j(T){return(T&&T.getContext?T.getContext("2d"):x)}function p(T,U){if(U.mask){if(U.autosave){T.save()}T.clip()}if(U.closed){T.closePath();T.fill();T.stroke()}else{T.fill();T.stroke();T.closePath()}}function v(T,U){if(U.scale!==1){U.scaleX=U.scaleY=U.scale}T.translate(U.x,U.y);T.scale(U.scaleX,U.scaleY);T.translate(-U.x,-U.y)}function q(T,U){U.toRad=(U.inDegrees?d/180:1);T.translate(U.x,U.y);T.rotate(U.angle*U.toRad);T.translate(-U.x,-U.y)}function g(U,W,V,T){W.toRad=(W.inDegrees?d/180:1);U.save();if(!W.fromCenter){W.x+=V/2;W.y+=T/2}if(W.angle){q(U,W)}if(W.scale!==1||W.scaleX!==1||W.scaleY!==1){v(U,W)}}function m(T){T=T||{};B=H(B,T.props);Q();if(T.name){z.fn[T.name]=function(V){var Z=this,W,X,U,Y=H(new G(),V);for(X=0;X<Z.length;X+=1){W=Z[X];U=j(W);if(U){L(U,Y);T.fn.call(W,U,Y)}}return Z}}return z.fn[T.name]}z.fn.loadCanvas=function(){return j(this[0])};z.fn.getCanvasImage=function(T,V){var U=this[0];T=T||"png";T=T.replace(/jpg/gi,"jpeg");return(U&&U.toDataURL)?U.toDataURL("image/"+T,V):x};z.fn.draw=function(W){var V=this,U,T;for(U=0;U<V.length;U+=1){T=j(V[U]);if(T){W.call(V[U],T)}}return V};z.fn.gradient=function(ac){var T=this,ag,Y=H(new G(),ac),ae,af=[],ab,V,X,Z,ad,W,U;ag=j(T[0]);if(ag){if(!Y.c2){ae=Y.c1}else{if(Y.r1!==x||Y.r2!==x){ae=ag.createRadialGradient(Y.x1,Y.y1,Y.r1,Y.x2,Y.y2,Y.r2)}else{ae=ag.createLinearGradient(Y.x1,Y.y1,Y.x2,Y.y2)}for(Z=1;Y["c"+Z]!==A;Z+=1){if(Y["s"+Z]!==A){af.push(Y["s"+Z])}else{af.push(x)}}ab=af.length;if(af[0]===x){af[0]=0}if(af[ab-1]===x){af[ab-1]=1}var aa=[];for(Z=0;Z<ab;Z+=1){if(af[Z]!==x){W=1;U=0;V=af[Z];for(ad=(Z+1);ad<ab;ad+=1){if(af[ad]!==x){X=af[ad];break}else{W+=1}}if(V>X){af[ad]=af[Z]}}else{if(af[Z]===x){U+=1;aa.push([V,X]);af[Z]=V+(U*((X-V)/W))}}ae.addColorStop(af[Z],Y["c"+(Z+1)])}}}else{ae=x}return ae};z.fn.pattern=function(Z){var T=this,ab,V=H(new G(),Z),W,Y,aa;function X(){Y=ab.createPattern(W,V.repeat)}function U(){X();if(V.load){V.load.call(T[0],Y)}}ab=j(T[0]);if(ab){W=new N();if(typeof V.source==="function"){W=c.createElement("canvas");W.width=V.width;W.height=V.height;aa=j(W);V.source.call(W,aa);U()}else{aa=V.source.getContext;if(V.source.src||aa){W=V.source}else{W.src=V.source}if(W.complete||aa){U()}else{W.onload=U}}}else{Y=x}return Y};z.fn.clearCanvas=function(U){var X=this,V,T,W=H(new G(),U);for(V=0;V<X.length;V+=1){T=j(X[V]);if(T){if(!V){g(T,W,W.width,W.height)}if(!W.x&&!W.y&&!W.width&&!W.height){T.clearRect(0,0,X[V].width,X[V].height)}else{T.clearRect(W.x-W.width/2,W.y-W.height/2,W.width,W.height)}}}return X};z.fn.saveCanvas=function(){var V=this,U,T;for(U=0;U<V.length;U+=1){T=j(V[U]);if(T){T.save()}}return V};z.fn.restoreCanvas=function(){var V=this,U,T;for(U=0;U<V.length;U+=1){T=j(V[U]);if(T){T.restore()}}return V};z.fn.scaleCanvas=function(U){var X=this,V,T,W=H(new G(),U);for(V=0;V<X.length;V+=1){T=j(X[V]);if(T){if(W.autosave){T.save()}v(T,W)}}return X};z.fn.translateCanvas=function(U){var X=this,V,T,W=H(new G(),U);for(V=0;V<X.length;V+=1){T=j(X[V]);if(T){if(W.autosave){T.save()}T.translate(W.x,W.y)}}return X};z.fn.rotateCanvas=function(U){var X=this,V,T,W=H(new G(),U);for(V=0;V<X.length;V+=1){T=j(X[V]);if(T){if(W.autosave){T.save()}q(T,W)}}return X};z.fn.drawRect=function i(Z){var U=this,Y,ac,X=H(new G(),Z),W,ab,V,aa,T;for(Y=0;Y<U.length;Y+=1){ac=j(U[Y]);if(ac){r(U[Y],Z,i);L(ac,X);if(!Y){g(ac,X,X.width,X.height)}ac.beginPath();if(X.cornerRadius){X.closed=w;W=X.x-X.width/2;ab=X.y-X.height/2;V=X.x+X.width/2;aa=X.y+X.height/2;T=X.cornerRadius;if((V-W)-(2*T)<0){T=(V-W)/2}if((aa-ab)-(2*T)<0){T=(aa-ab)/2}ac.moveTo(W+T,ab);ac.lineTo(V-T,ab);ac.arc(V-T,ab+T,T,3*d/2,d*2,R);ac.lineTo(V,aa-T);ac.arc(V-T,aa-T,T,0,d/2,R);ac.lineTo(W+T,aa);ac.arc(W+T,aa-T,T,d/2,d,R);ac.lineTo(W,ab+T);ac.arc(W+T,ab+T,T,d,3*d/2,R)}else{ac.rect(X.x-X.width/2,X.y-X.height/2,X.width,X.height)}ac.restore();if(X._event){O(U[Y],ac,Z)}p(ac,X)}}return U};z.fn.drawArc=function i(U){var X=this,V,T,W=H(new G(),U);if(!W.inDegrees&&W.end===360){W.end=d*2}for(V=0;V<X.length;V+=1){T=j(X[V]);if(T){r(X[V],U,i);L(T,W);if(!V){g(T,W,W.radius*2,W.radius*2)}T.beginPath();T.arc(W.x,W.y,W.radius,(W.start*W.toRad)-(d/2),(W.end*W.toRad)-(d/2),W.ccw);T.restore();if(W._event){O(X[V],T,U)}p(T,W)}}return X};z.fn.drawEllipse=function i(V){var Z=this,X,U,Y=H(new G(),V),W=Y.width*4/3,T=Y.height;for(X=0;X<Z.length;X+=1){U=j(Z[X]);if(U){r(Z[X],V,i);L(U,Y);if(!X){g(U,Y,Y.width,Y.height)}U.beginPath();U.moveTo(Y.x,Y.y-T/2);U.bezierCurveTo(Y.x-W/2,Y.y-T/2,Y.x-W/2,Y.y+T/2,Y.x,Y.y+T/2);U.bezierCurveTo(Y.x+W/2,Y.y+T/2,Y.x+W/2,Y.y-T/2,Y.x,Y.y-T/2);U.restore();if(Y._event){O(Z[X],U,V)}p(U,Y)}}return Z};z.fn.drawLine=function i(V){var aa=this,Y,U,Z=H(new G(),V),T=1,X=0,W=0;for(Y=0;Y<aa.length;Y+=1){U=j(aa[Y]);if(U){r(aa[Y],V,i);L(U,Z);U.beginPath();while(w){X=Z["x"+T];W=Z["y"+T];if(X!==A&&W!==A){U.lineTo(X,W);T+=1}else{break}}if(Z._event){O(aa[Y],U,V)}p(U,Z)}}return aa};z.fn.drawQuad=function i(Z){var T=this,Y,ac,X=H(new G(),Z),W=2,V=0,U=0,ab=0,aa=0;for(Y=0;Y<T.length;Y+=1){ac=j(T[Y]);if(ac){r(T[Y],Z,i);L(ac,X);ac.beginPath();ac.moveTo(X.x1,X.y1);while(w){V=X["x"+W];U=X["y"+W];ab=X["cx"+(W-1)];aa=X["cy"+(W-1)];if(V!==A&&U!==A&&ab!==A&&aa!==A){ac.quadraticCurveTo(ab,aa,V,U);W+=1}else{break}}if(X._event){O(T[Y],ac,Z)}p(ac,X)}}return T};z.fn.drawBezier=function i(ae){var T=this,ad,af,aa=H(new G(),ae),Z=2,W=1,Y=0,X=0,ac=0,V=0,ab=0,U=0;for(ad=0;ad<T.length;ad+=1){af=j(T[ad]);if(af){r(T[ad],ae,i);L(af,aa);af.beginPath();af.moveTo(aa.x1,aa.y1);while(w){Y=aa["x"+Z];X=aa["y"+Z];ac=aa["cx"+W];V=aa["cy"+W];ab=aa["cx"+(W+1)];U=aa["cy"+(W+1)];if(Y!==A&&X!==A&&ac!==A&&V!==A&&ab!==A&&U!==A){af.bezierCurveTo(ac,V,ab,U,Y,X);Z+=1;W+=2}else{break}}if(aa._event){O(T[ad],af,ae)}p(af,aa)}}return T};function J(X,T,Y){var U,V,W=/(\d*\.?\d*)\w\w\b/gi;Y.width=T.measureText(Y.text).width;if(n.font===Y.font&&n.text===Y.text){Y.height=n.height}else{U=X.style.fontSize;V=Y.font.match(W);if(V){X.style.fontSize=(Y.font.match(W)||z.css(X,"fontSize"))[0]}Y.height=t(z.css(X,"fontSize"));X.style.fontSize=U}}z.fn.drawText=function i(V){var Y=this,U,W,T,X=H(new G(),V);for(W=0;W<Y.length;W+=1){U=z(Y[W]);T=j(U[0]);if(T){r(Y[W],V,i);L(T,X);T.textBaseline=X.baseline;T.textAlign=X.align;T.font=X.font;J(U[0],T,X);if(!W){g(T,X,X.width,X.height)}T.strokeText(X.text,X.x,X.y);T.fillText(X.text,X.x,X.y);if(X._event){T.beginPath();T.rect(X.x-X.width/2,X.y-X.height/2,X.width,X.height);T.restore();O(Y[W],T,V);T.closePath()}else{T.restore()}}}n=X;return Y};z.fn.drawImage=function i(aa){var T=this,V,Z,ae,X=H(new G(),aa),Y,U,ab,ad;if(X.source.src){Y=X.source}else{if(X.source){Y=new N();Y.src=X.source}}function ac(af,ag){if(!ag){U=Y.width/Y.height;if(X.width===x&&X.sWidth===x){aa.width=X.width=X.sWidth=Y.width}if(X.height===x&&X.sHeight===x){aa.height=X.height=X.sHeight=Y.height}if(X.width===x&&X.sWidth!==x){X.width=X.sWidth}if(X.height===x&&X.sHeight!==x){X.height=X.sHeight}if(X.sWidth===x&&X.width!==x){aa.sWidth=X.sWidth=Y.width}if(X.sHeight===x&&X.height!==x){aa.sHeight=X.sHeight=Y.height}if(X.sx===x){if(X.cropFromCenter){X.sx=Y.width/2}else{X.sx=0}}if(X.sy===x){if(X.cropFromCenter){X.sy=Y.height/2}else{X.sy=0}}if(!X.cropFromCenter){X.sx+=X.sWidth/2;X.sy+=X.sHeight/2}if((X.sx+X.sWidth/2)>Y.width){X.sx=Y.width-X.sWidth/2}if((X.sx-X.sWidth/2)<0){X.sx=X.sWidth/2}if((X.sy-X.sHeight/2)<0){X.sy=X.sHeight/2}if((X.sy+X.sHeight/2)>Y.height){X.sy=Y.height-X.sHeight/2}if(X.width!==x&&X.height===x){aa.height=X.height=X.width/U}else{if(X.width===x&&X.height!==x){aa.width=X.width=X.height*U}else{if(X.width===x&&X.height===x){aa.width=X.width=Y.width;aa.height=X.height=Y.height}}}g(af,X,X.width,X.height)}af.drawImage(Y,X.sx-X.sWidth/2,X.sy-X.sHeight/2,X.sWidth,X.sHeight,X.x-X.width/2,X.y-X.height/2,X.width,X.height);if(X._event){af.beginPath();af.rect(X.x-X.width/2,X.y-X.height/2,X.width,X.height);af.restore();O(T[ag],af,aa);af.closePath()}else{af.restore()}}function W(ag,ah,af){return function(){ac(af,ah);if(X.load){X.load.call(ag)}}}for(Z=0;Z<T.length;Z+=1){V=T[Z];ae=j(T[Z]);if(ae){r(T[Z],aa,i);L(ae,X);if(Y){if(Y.complete){W(V,Z,ae)()}else{Y.onload=W(V,Z,ae)}}}}return T};z.fn.drawPolygon=function i(Y){var T=this,X,ad,V=H(new G(),Y),ae=d/V.sides,U=(d/2)+ae,ac=(d*2)/V.sides,ab=b(ac/2)*V.radius,aa,Z,W;V.closed=w;for(X=0;X<T.length;X+=1){ad=j(T[X]);if(ad){r(T[X],Y,i);L(ad,V);if(!X){g(ad,V,V.radius,V.radius)}ad.beginPath();for(W=0;W<V.sides;W+=1){aa=V.x+P(V.radius*b(U));Z=V.y+P(V.radius*o(U));ad.lineTo(aa,Z);if(V.projection){aa=V.x+P((ab+ab*V.projection)*b(U+ae));Z=V.y+P((ab+ab*V.projection)*o(U+ae));ad.lineTo(aa,Z)}U+=ac}ad.restore();if(V._event){O(T[X],ad,Y)}p(ad,V)}}return T};z.fn.setPixels=function i(ab){var T=this,V,aa,ad,W=H(new G(),ab),U,Y,X,Z,ac={};for(aa=0;aa<T.length;aa+=1){V=T[aa];ad=j(V);if(ad){r(T[aa],ab,i);if(!aa){g(ad,W,W.width,W.height)}if(!W.x&&!W.y&&!W.width&&!W.height){W.width=V.width;W.height=V.height;W.x=W.width/2;W.y=W.height/2}U=ad.getImageData(W.x-W.width/2,W.y-W.height/2,W.width,W.height);Y=U.data;Z=Y.length;ac=[];if(W.each!==x){for(X=0;X<Z;X+=4){ac.r=Y[X];ac.g=Y[X+1];ac.b=Y[X+2];ac.a=Y[X+3];W.each.call(V,ac);Y[X]=ac.r;Y[X+1]=ac.g;Y[X+2]=ac.b;Y[X+3]=ac.a}}ad.putImageData(U,W.x-W.width/2,W.y-W.height/2);ad.restore()}}return T};z.fn.getLayers=function(){var T=this[0],U;if(!T||!T.getContext){U=x}else{U=z.data(T,"jCanvas-layers");if(!U){U=[];z.data(T,"jCanvas-layers",U)}}return U};z.fn.getLayer=function(T){var W=this.getLayers(),V,U;if(!W){V=x}else{if(typeof T==="string"){for(U=0;U<W.length;U+=1){if(W[U].name===T){T=U;break}}}T=T||0;V=W[T]}return V};function a(U,T,V){if(V.visible&&V.method){V.method.call(U,V)}}z.fn.drawLayers=function(){var Z=this,U,Y,T,X,W,V;for(Y=0;Y<Z.length;Y+=1){U=z(Z[Y]);T=j(U[0]);if(T){X=U.getLayers();T.clearRect(0,0,U[0].width,U[0].height);for(V=0;V<X.length;V+=1){W=X[V];a(U,T,W)}}}return Z};function r(V,X,Y){var T,W,U;X=X||{};if(X.layer&&!X._layer){T=z(V);X=H(X,new G(),H({},X));W=T.getLayers();if(typeof X==="function"){X.method=z.fn.draw}else{X.method=z.fn[X.method]||Y;if(X.method!==z.fn.drawImage){X.width=X.width||0;X.height=X.height||0}for(U in Q.events){if(Q.events.hasOwnProperty(U)&&X[U]){if(!Q.events[U].called){Q.events[U].call(I,T)}X._event=w}}}X.layer=w;X._layer=w;W.push(X)}return X}z.fn.addLayer=function(V){var Y=this,U,W,T,X=V||{};for(W=0;W<Y.length;W+=1){U=z(Y[W]);T=j(Y[W]);if(T){X.layer=w;X=r(U[0],X);a(U,T,X)}}return Y};z.fn.removeLayers=function(){var V=this,U,T;for(T=0;T<V.length;T+=1){U=z(V[T]).getLayers()||[];U.length=0}return V};z.fn.removeLayer=function(T){var Y=this,X,V=typeof T,W,U;for(X=0;X<Y.length;X+=1){W=z(Y[X]).getLayers()||[];if(V==="string"){for(U=0;U<W.length;U+=1){if(W[U].name===T){W.splice(U,1);break}}}else{if(V==="number"){W.splice(T,1)}}}return Y};function f(U,V){var T;for(T=0;T<U.length;T+=1){V[U[T]]=V["_"+U[T]]}}function h(U,V){var T;for(T=0;T<U.length;T+=1){V["_"+U[T]]=V[U[T]]}}E=["width","height","opacity"];F=["color","backgroundColor","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","fillStyle","outlineColor","strokeStyle","shadowColor",];function C(U){var X,W,V=[],T=1;if(typeof U==="object"){V=U}else{if(U.match(/^#?[a-z0-9]+$/gi)){W=c.documentElement;X=W.style.color;W.style.color=U;U=z.css(W,"color");W.style.color=X}if(U.match(/^rgb/gi)){V=U.match(/[0-9]+/gi);if(U.match(/%/gi)){T=2.55}V[0]=V[0]*T;V[1]=V[1]*T;V[2]=V[2]*T}}return V}function M(U){var T;if(typeof U.start!=="object"){U.start=C(U.start);U.end=C(U.end)}U.now=[];for(T=0;T<3;T+=1){U.now[T]=P(U.start[T]+(U.end[T]-U.start[T])*U.pos)}U.now="rgb("+U.now.join(",")+")";if(U.elem.style){U.elem.style[U.prop]=U.now}else{U.elem[U.prop]=U.now}}function l(T){var U;for(U=0;U<T.length;U+=1){if(!z.fx.step[T[U]]){z.fx.step[T[U]]=M}}}z.fn.animateLayer=function(){var T=this,U,Y,aa,Z=([]).slice.call(arguments,0),X,ab;if(typeof Z[0]==="object"&&!Z[0].layer){Z.unshift(0)}if(Z[2]===A){Z.splice(2,0,x);Z.splice(3,0,x);Z.splice(4,0,x)}else{if(typeof Z[2]==="function"){Z.splice(2,0,x);Z.splice(3,0,x)}}if(Z[3]===A){Z[3]=x;Z.splice(4,0,x)}else{if(typeof Z[3]==="function"){Z.splice(3,0,x)}}if(Z[4]===A){Z[4]=x}function V(ac,ad){return function(){f(E,ad);T.drawLayers();if(Z[4]){Z[4].call(T)}ab=false}}function W(ac,ad){return function(){f(E,ad);T.drawLayers()}}for(Y=0;Y<T.length;Y+=1){U=z(T[Y]);aa=j(T[Y]);if(aa){if(Z[0].layer){X=Z[0]}else{X=U.getLayer(Z[0])}if(X&&X.method!==z.fn.draw){h(E,X);h(E,Z[1]);if(!ab){ab=true;z(X).animate(Z[1],{duration:Z[2],easing:(z.easing[Z[3]]?Z[3]:x),complete:V(U,X),step:W(U,X)})}}}}return T};z.fn.stopLayer=function(T,U){if(T.layer){z(T).stop(U)}else{T=z(this).getLayer(T);z(T).stop(U)}return this};z.event.fix=function(T){var U;T=k.call(z.event,T);if(T.pageX!==A&&T.offsetX===A){U=z(T.target).offset();if(U){T.offsetX=T.pageX-U.left;T.offsetY=T.pageY-U.top}}return T};l(F);z.support.canvas=(c.createElement("canvas").getContext!==A);Q.defaults=B;Q.prefs=S;Q.extend=m;z.jCanvas=Q}(jQuery,window,document,Math,Image,parseFloat,true,false,null));