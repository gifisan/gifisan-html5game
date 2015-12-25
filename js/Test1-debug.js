// ┌────────────────────────────────────────────────────────────┐ \\
// │ Test1 1.02 - JavaScript canvas Library                     │ \\
// ├────────────────────────────────────────────────────────────┤ \\
// │ Author yoocent (http://www.yoocent.com/)                   │ \\
// └────────────────────────────────────────────────────────────┘ \\
// 
// Copyright (c) 2013 YooCent Systems Incorporated. All rights reserved.
//
(function(Game){
	Game = window.Game = Game || window.Game || new function Game(){};
	Game.math = Game.math || new function(){};
	window.$gm = Game.math;
	Game.version = Game.version || '1.02';
	var check=function(r){
		return r.test(navigator.userAgent.toLowerCase());
	};
	Game.isIE=!check(/opera/) && check(/msie/);
	Game.enableDebug = true;
	Game.genId = Game.genId || 1000;
	Game.ui = Game.ui || new function(){};
	Game.util = Game.util || new function(){};
	Game.classes = Game.classes || new function(){};
	Game.comps = Game.comps || new function(){};
	Game.apply = function(object, config,ignore) {
		if(object && config){
			var temp1 = {'toString':true};
			var p = typeof(object) == 'function' ? object.prototype : object;
			var c = typeof(config) == 'function' ? config.prototype : config;
			if(ignore){
				for (var k in c) {
					if(temp1[k] || !ignore[k]){
						p[k] = c[k];
					}
				}
			}else{
				for (var k in c) {
					p[k] = c[k];
				}
			}
		}
		return object;
	};
	
	Game.apply(Function,{
		delegate: function(scope,args){
			var method = this;
			return function(){
				var args = args;
				if(arguments.length > 0){
					args = arguments;
				}
				return method.apply(scope || window ,args);
			}
		}
	});
	
	Game.apply(Game,{
		reg: function(name,clazz){
			if(this.classes[name]){
				this.warn('Class repeat:'+name);
			}
			this.classes[name] = clazz;
			clazz.prototype.xtype = name;
		},
		namespace: function(name) {
			var parts = name.split('.');  
			var container = window;
			if(!container[parts[0]]){
				eval('var ' + parts[0] + ' = ' + parts[0] + ' || new function(){};window.'+parts[0]+'='+parts[0]);
			}
			for(var i = 0; i < parts.length; i++) {
				var part = parts[i];    
				if (!container[part])
					eval(parts.slice(0,i+1).join('.') + '=' + parts.slice(0,i+1).join('.') + '|| new function(){}');
					//container[part] = new function(){};
				else if (typeof container[part] != "object") {
					var n = parts.slice(0,i).join('.');  
					throw n + " already exists and is not an object";
				}  
				container = container[part];  
			}
			return container;  
		},
		each: function(array, fn, scope){
	        for(var i=0, len=array.length; i < len; i++){
	            if(fn.call(scope || array[i], array[i], i, array) === false){
	                return i;
	            };
	        }
	    },
		create: function(n,args){
			var o = new this.classes[n]();
			if(args){
				for(var i in args){
					o[i] = args[i];
				}
			}
			if(!o.id){
				var id = this.getId(n);
				o.id = id;
			}
			if(this.comps[o.id]){
				//this.warn('Component repeat:'+o.toString());
			}
			this.comps[o.id] = o;
			if(o.init){
				o.init();
			}
			return o;
		},
		debug: function(object){
			if(Game.enableDebug){
				console.trace(object);
			}
		},
		info: function(object){
			console.info(object);
		},
		warn: function(object){
			console.warn(object);
		},
		error: function(object){
			console.error(object);
		},
		getId: function(t){
			return t+'-gen-'+(this.genId++);
		},
		get: function(id){
			var dom = document.getElementById(id);
			if(dom){
				return dom;
			}
			return this.comps[id];
		},
		getCmp: function(id){
			return this.comps[id];
		},
		onReady: function(fun){
			window.onload = fun;
		},
		copy: function(o){
			if(o == null){
				return o;
			}
			if(o.xtype){
				throw o.xtype;
				return Game.create(o.xtype);
			}else if(this.isObject(o)){
				var c = {};
				for(var i in o){
					c[i] = this.copy(o[i]);
				}
				return c;
			}else if(this.isArray(o)){
				c = [];
				for(var i in o){
					c[i] = this.copy(o[i]);
				}
				return c;
			}else{
				return o;
			}
		},
		createRect: function(width,height,v){
			var array = [];
			for(var i = 0 ; i < height;i++){
				array[i] = [];
				for(var j = 0;j< width;j++){
					array[i][j] = v;
				}
			}
			return array;
		}
	})
	
	Game.apply(Game, {
		applyIf: function(object, config) {
			if(config && object){
				var temp = {xtype:true,init:true};
				var p = typeof(object) == 'function' ? object.prototype : object;
				var c = typeof(config) == 'function' ? config.prototype : config;
				for (var k in c) {
					if(!temp[k] && p[k] == null){
						p[k] = c[k];
					}
				}
			}
		},
		isObject: function(o){
			return Array.isArray(o) ? false : typeof o == 'object';
		},
		isArray: function(o){
			return Array.isArray(o);
		},
		isNull: function(o){
			return o == null || o == undefined;
		}
	});

	Game.apply(Game, {
		extend: function(){
			var _fun_config = ' = ' + (function(){
				superc.apply(this,arguments);
				for(var i in config){
					this[i] = Game.copy(config[i]);
				}
			}).toString();
			
			var _fun = ' = ' + (function(){
				superc.apply(this,arguments);
			}).toString();

			return function (superc,son){
				if(son == null){
					return this.extend(this.Object,superc);
				}
				if(!this.isObject(son)){
					throw new Error('son is not a object.');
				}
				var F = function(){};
				F.prototype = superc.prototype;
				var config = {};
				var empty_config = true;
				for(var i in son){
					if(typeof son[i] != 'function' && i != 'className'){
						config[i] = son[i];
						empty_config = false;
					}
				}
				var sonc = null;
				if(son.className){
					eval(son.className + (empty_config ? _fun : _fun_config));
					eval('sonc = '+son.className);
				}else{
					if(empty_config){
						sonc = function(){
							superc.apply(this,arguments);
						}
					}else{
						sonc = function(){
							superc.apply(this,arguments);
							for(var i in config){
								this[i] = Game.copy(config[i]);
							}
						};
					}
				}
				sonc.prototype = new F();
				for(var i in son){
					if(typeof son[i] == 'function' || i == 'className'){
						sonc.prototype[i] = son[i];
					}
				}
				sonc.prototype.superClass = superc.prototype;
				return sonc;
			};
		}.delegate(Game)(),
		override: function(origclass, overrides) {
			if(overrides){
				var p=origclass.prototype;
	            Game.apply(p, overrides);
	            if(Game.isIE && overrides.toString != origclass.toString){
	                p.toString=overrides.toString;
	            }
	        }
		}
	});
	
	//下面是一些数学计算
	Game.apply(Game.math,{
		//根据坐标计算cell所在的index
		pos: function(p,w,b){
			var s = p/w;
			var sInt = parseInt(s);
			var sDecimal = s - sInt;
			if(b != null && sDecimal > b){
				return -1;
			}
			return sInt;
		},
		//根据坐标计算旋转角度
		rotate: function(x,y){
			//这种写法比较好理解
			var z = Math.sqrt(x*x+y*y);
			//按照象限进行操作
			if((x >= 0 && y >= 0)){
				return Math.asin(x/z);
			}else if((x >= 0 && y <= 0)){
				return Math.acos(x/z)+Math.PI/2;
			}else if((x <= 0 && y <= 0)){
				return Math.asin(-x/z)+Math.PI;
			}else if((x <= 0 && y >= 0)){
				return Math.acos(-x/z)+Math.PI*3/2;
			}
			return 0;
			/*
			//这种写法比较抽象，炮塔箭头与X轴不平行时可以这么写
			//正时针旋转坐标系，这样可以使炮塔与坐标系持平，因为炮塔的箭头是朝上的，而坐标系的起始旋转是从X轴开始
			//设旋转起点从 -PI/2 开始
			var y = this.container.mx - this.x + this.drawX;
			var x = -(this.container.my - this.y + this.drawY);
			var z = Math.sqrt(x*x+y*y);
			//fn(x) = sin(x) fn函数在一象限和四象限是增函数，fn(x) = -1 ~ 1 ,此时旋转为一个半圆
			if((x >= 0 && y <= 0) || (x >= 0 && y >= 0)){
				this.rotate = Math.asin(y/z);
			}else{
				//x从第二象限开始到第三象限结束需要加上PI，因为起点从x=-PI/2开始，所以从x=PI/2开始加上PI
				this.rotate = Math.asin(-y/z)+Math.PI;
			}
			*/
		},
		//计算给定两点的距离
		distance: function(x1,y1,x2,y2){
			var x = x2 - x1;
			var y = y2 - y1;
			return Math.sqrt(x*x+y*y);
		}
	})
	
	//创建AStar对象
	Game.namespace('Game.math.AStar');
	
	//一些需要持久对象的算法，抽象成类
	Game.apply(Game.math.AStar,{
		//横或竖向移动一格的路径评分
		COST_STRAIGHT: 10,
		//斜向移动一格的路径评分
		COST_DIAGONAL: 14,
		//不能行走
		NODE_NOWAY: 0,
		//当前节点没使用过
		NODE_NONE: 0,
		//在开启列表中
		NODE_OPEN: 1,
		//在关闭列表中
		NODE_CLOSED: 2,
		//地图
		map: null,
		//地图副本，标记开启关闭列表
		mapc: null,
		//地图宽度
		width: 0,
		//地图高度
		height: 0,
		//开启列表
		OpenList: null,
		//当前开启列表的下标
		olength: 0,
		//是否找到
		findFalg: false,
		//Open Node cache
		OpenTable: {},
		className: 'Game.math.AStar',
		reset: function(sx,sy,width,height,map){
			this.sx = sx;
			this.sy = sy;
			this.height = height;
			this.width = width;
			this.map = this.copyMapArea(sx,sy,width,height,map);
			if(!this.mapc){
				this.mapc = Game.createRect(this.width,this.height,this.NODE_NONE);
			}else{
				this.resetMapc(this.NODE_NONE);
			}
			//最多只有一半的障碍..
			this.OpenList = [this.width * this.height / 2];
			this.findFalg = false;
			this.OpenTable = {};
			this.olength = 0;
		},
		resetMapc: function(v){
			for(var i in this.mapc){
				var item = this.mapc[i];
				for(var j in item){
					item[j] = v;
				}
			}
		},
		copyMapArea: function(sx,sy,width,height,map){
			var array = [];
			//var i = (map.length - sx) > height ? map.length - sx : map.length - height;
			//var i = (map.length - sy) > width ? map[0].length - sy : map[0].length - width;
			var i , j ;
			if(map.length - sx > height){
				i = sx;
				height = sx + height;
			}else{
				i = map.length - height;
				height = map.lenght;
			}
			if(map[0].length - sy > width){
				j = sy;
				width = sy + width;
			}else{
				j = map[0].length - width;
				width = map[0].lenght;
			}
			var _i = 0;
			var _j = j;
			for(; i < height;i++){
				var item = array[_i++] = [];
				var j1 = 0;
				for(;j < width;j++){
					item[j1++] = map[i][j];
				}
				j = _j;
			}
			return array;
		},
		createNode: function(x,y,map,parent){
			return {
				x:x,
				y:y,
				f:0,
				g:0,
				h:0,
				map:map,
				parent:parent
			}
		},
		//竖着为X，横着为Y
		find: function(x1,y1,x2,y2){
			//var sNode = this.createNode(x1-this.sx, y1-this.sy);
			//var eNode = this.createNode(x2-this.sx, y2-this.sy);
			var sNode = this.createNode(x1, y1);
			var eNode = this.createNode(x2, y2);
			this.olength++;
			this.OpenList[this.olength] = sNode;
			this.mapc[sNode.x][sNode.y] = this.NODE_OPEN;
			var cNode = null;
			while (this.olength > 0) {
				cNode = this.OpenList[1];
				// 当前节点四方向可通行标志 f0,f1,f2,f3
				// 东
				var f0 = this.check(cNode.x, cNode.y + 1, eNode, cNode, this.COST_STRAIGHT);
				// 南
				var f1 = this.check(cNode.x + 1, cNode.y, eNode, cNode, this.COST_STRAIGHT);
				// 西
				var f2 = this.check(cNode.x, cNode.y - 1, eNode, cNode, this.COST_STRAIGHT);
				// 北
				var f3 = this.check(cNode.x - 1, cNode.y, eNode, cNode, this.COST_STRAIGHT);
				// 东南
				// if (f0 && f1)可以直接跳
				this.check(cNode.x + 1, cNode.y + 1, eNode, cNode, this.COST_DIAGONAL);
				// 东北
				// if (f0 && f3)可以直接跳
				this.check(cNode.x - 1, cNode.y + 1, eNode, cNode, this.COST_DIAGONAL);
				// 西南
				// if (f2 && f1)可以直接跳
				this.check(cNode.x + 1, cNode.y - 1, eNode, cNode, this.COST_DIAGONAL);
				// 西北
				// if (f2 && f3)可以直接跳
				this.check(cNode.x - 1, cNode.y - 1, eNode, cNode, this.COST_DIAGONAL);
				this.putClosedTabe(cNode, eNode);
				if (this.findFalg) {
					break;
				}
			}
			if (this.findFalg) {// 有
				var array = [];
				this.read(array, cNode);
				return array;
			} else {
				return null;
			}
		},
		read: function(list,node) {
			if (node.parent != null) {
				this.read(list, node.parent);
			}
			list.push(node);
		},
		check: function(x, y, eNode, parentNode, step) {
			if (x < 0 || x == this.height || y < 0 || y == this.width) {
				return false;
			}
			if (this.map[x][y] == this.NODE_NOWAY) {// 没门
				return false;
			}
			if (this.mapc[x][y] == this.NODE_CLOSED) {
				return false;
			}
			if (this.mapc[x][y] == this.NODE_NONE) {
				this.putOpenTable(x, y, eNode, parentNode, step);
				this.mapc[x][y] = this.NODE_OPEN;
				return true;
			} else if (this.mapc[x][y] == this.NODE_OPEN) {
				this.updateOpenTable(x, y, eNode, parentNode, step);
				return true;
			}
			Game.error("should never print!");
			return false;
		},
		putClosedTabe: function(node,eNode) {
			if (node.x == eNode.x && node.y == eNode.y) {
				this.findFalg = true;// 找到了
				return;
			}
			// 此时OpenList[1]是本次循环起始点的Node，应该把该节点移除
			this.OpenList[1] = this.OpenList[this.olength];
			this.OpenList[this.olength--] = null;
			var temp = 1;
			var tNode = this.OpenList[temp];
			// 对数组进行排序，F值最小的放前面，其他不管
			for (var j = 1; j < this.olength; j++) {
				if (tNode.f > this.OpenList[j].f) {
					tNode = this.OpenList[j];
					temp = j;
				}
			}
			this.OpenList[temp] = this.OpenList[1];
			this.OpenList[1] = tNode;
			this.mapc[node.x][node.y] = this.NODE_CLOSED;
		},
		putOpenTable: function(x, y, eNode, parentNode, step) {
			var node = this.createNode(x, y,this.map, parentNode);
			this.count(node, eNode, step);
			this.OpenList[++this.olength] = node;
			this.OpenTable[node.x + "_" + node.y]= node;
			return true;
		},
		updateOpenTable: function(x, y, eNode, parentNode, step) {
			var node = this.OpenTable[x + "_" + y];
			var g = parentNode.g + step;
			if (g < node.g) {// 如果新的NODE距离起点的距离更小，增使用该新的替换掉旧的
				node.parent = parentNode;
				this.count(node, eNode, step);
				return true;
			}
			return false;
		},
		count: function(node, eNode, step) {
			this.countG(node, node.parent, step);
			this.countH(node, eNode);
			this.countF(node);
		},
		countG: function(node, parentNode, step) {
			if (parentNode == null) {
				node.g = step;
			} else {
				node.g = parentNode.g + step;
			}
		},
		countH: function(node, eNode) {
			node.h = Math.abs(eNode.x - node.x) + Math.abs(eNode.y - node.y);
		},
		countF: function(node) {
			node.f = node.g + node.h;
		}
	});
	
	//基类
	Game.Object = Game.extend(Object,{
		className: 'Game.Object',
		superCall: function(name,object,args){
			var _function = object[name];
			var superClass = object.superClass;
			while(!superClass.hasOwnProperty(name) || superClass[name] == _function){
				superClass = superClass.superClass;
				if(superClass.xtype == null){
					return false;
				}
			}
			var fun = superClass[name];
			fun.call(object,args);
		},
		toString: function(){
			return (this.className?this.className:this.xtype)+'@'+this.id
		},
		onDestroy: function(){},
		init: function() {},
		onInit: function(){},
		beforeInit: function(){},
		destroy: function(){
			delete Game.comps[this.id];
			this.onDestroy();
		}
	});
	Game.reg('object',Game.Object)
	
	//下面是一些基础组件
	
	
	//计时器，可以定时执行任务,好像会降低性能@_@
	Game.util.Timer = Game.extend({
		delay:0,
		isStop:true,
		paused:false,
		lastTimeout:0,
		millisecond:1000,
		className:'Game.util.Timer',
		initProxy: function(){
			if(!this._start){
				this._start = function(){
					if(!this.isStop){
						clearTimeout(this.lastTimeout)
						this.millisecond = this._millisecond;
						this.lastTimeout = setTimeout(this._start,this.millisecond);
						this.lastPlay = Date.now();
						this.method();
					}
				}.delegate(this);
			}
		},
		start: function(millisecond){
			if(millisecond){
				this.millisecond = millisecond;
			}
			this.isStop = false;
			this.onStart();
			this._millisecond = this.millisecond;
			this.lastTimeout = setTimeout(this._start,this.millisecond);
			this.lastPlay = Date.now();
		},
		method: function(){
			Game.info('override me please.');
		},
		pause: function(){
			if(!this.paused){
				clearTimeout(this.lastTimeout);
				this.pauseTime = Date.now();
				this.paused = true;
			}
		},
		play: function(){
			if(this.paused){
				if(!this.lastPlay){
					this.lastPlay = Date.now();
				}
				this.millisecond = this.millisecond - this.pauseTime + this.lastPlay;
				this.lastTimeout = setTimeout(this._start,this.millisecond);
				this.lastPlay = Date.now();
				this.paused = false;
			}
		},
		stop: function(){
			clearTimeout(this.lastTimeout);
			this.onStop();
			this.isStop = true;
		},
		onStop: function(){
			//do nothing
		},
		onStart: function(){
			//do nothing
		},
		onDestroy: function(){
			this.stop();
		},
		init: function(){
			this.initProxy();
			this.onInit();
			return this;
		}
	})
	Game.reg('timer',Game.util.Timer);
	
	//场景控制器，用来控制场景的切换
	Game.ui.Container = Game.extend({
		
		calc:0,
		rate:1,
		frame:0,
		width:0,
		height:0,
		lastFrame:0,
		showFPS:true,
		animateItems:{},
		fullScreen:false,
		className:'Game.ui.Container',
		changeScene: function(scene){
			var scene_temp = this.scene;
			this.scene = scene;
			scene.changed = true;
			if(scene_temp){
				scene_temp.hide();
			}
		},
		drawContainer: function(){
			this.scene.drawScene(this.ctx);
			this.animate();
		},
		animate: function(){
			var items = this.animateItems;
			for(var i in items){
				var obj = items[i];
				if(obj.doAnimate){
					obj.doAnimate();
				}
			}
		},
		initContainer: function(canvas,fullScreen){
			if(fullScreen != null){
				this.fullScreen = fullScreen;
			}
			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			this.ctx.textBaseline = 'top';
			this.task = Game.getCmp('timer-container-draw');
			this.initBox(canvas);
			this.onInitContainer();
			Game.getCmp('eventFire').onEvent(this);
		},
		initBox: function(canvas){
			this.height = document.body.scrollHeight;
			if(this.fullScreen){
				this.width = document.body.scrollWidth;
				this.xrate = this.width / 960;
				this.yrate = this.height / 640;
			}else{
				if(this.height < 640){
					this.height = 640;
				}
				this.yrate = this.height / 640;
				this.xrate = this.yrate;
				this.width = 960 * this.yrate;
			}
			this.canvas.height = this.height;
			this.canvas.width = this.width;
			canvas.style['margin-left'] = -this.width/2+'px';
		},
		onInitContainer: function(){},
		addAnimateItem: function(item){
			this.animateItems[item.id] = item;
		},
		removeAnimateItem: function(item){
			delete this.animateItems[item.id];
		},
		renderFrame: function(ctx){
			ctx.textAlign = 'left',
			ctx.textBaseline = 'top';
			ctx.font="16px sans-serif";
			ctx.fillStyle = 'rgb(20,20,20)';
			ctx.fillText('FPS:'+this.lastFrame,5,1);
		},
		startPlay: function(drawContainerInterval){
			Game.getCmp('timer-container-draw').start(drawContainerInterval);
			if(Game.enableDebug){
				Game.getCmp('timer-container-renderFrame').start();
			}
		}
	})
	Game.reg('container',Game.ui.Container);
	
	//场景，场景可以用来被container切换
	Game.ui.Scene = Game.extend({
		levelItems:[],
		changed:false,
		destroyItems:{},
		clickAbleIndex:[],
		clickAbleItems:[],
		mousemoveAbleIndex:[],
		mousemoveAbleItems:[],
		className:'Game.ui.Scene',
		addClickAbleItem: function(item){
			if(!this.clickAbleItems[item.level]){
				this.clickAbleItems[item.level] = {};
			}
			this.clickAbleItems[item.level][item.id] = item;
			var contains = false;
			for(var i in this.clickAbleIndex){
				if(this.clickAbleIndex[i] == item.level){
					contains = true;
					break;
				}
			}
			if(!contains){
				this.clickAbleIndex.push(item.level);
				this.clickAbleIndex.sort();
			}
		},
		removeClickAbleItem: function(item){
			if(this.clickAbleItems[item.level]){
				delete this.clickAbleItems[item.level][item.id];
				if(this.clickAbleItems[item.level].length == 0){
					delete this.clickAbleItems[item.level];
					this.clickAbleItems.sort();
					this.clickAbleItems.length -= 1;
				}
			}
		},
		addMousemoveAbleItem: function(item){
			if(!this.mousemoveAbleItems[item.level]){
				this.mousemoveAbleItems[item.level] = {};
			}
			this.mousemoveAbleItems[item.level][item.id] = item;
			var contains = false;
			for(var i in this.mousemoveAbleIndex){
				if(this.mousemoveAbleIndex[i] == item.level){
					contains = true;
					break;
				}
			}
			if(!contains){
				this.mousemoveAbleIndex.push(item.level);
				this.mousemoveAbleIndex.sort();
			}
		},
		removeMousemoveAbleItem: function(item){
			if(this.mousemoveAbleItems[item.level]){
				delete this.mousemoveAbleItems[item.level][item.id];
				if(this.mousemoveAbleItems[item.level].length == 0){
					delete this.mousemoveAbleItems[item.level];
					this.mousemoveAbleItems.sort();
					this.mousemoveAbleItems.length -= 1;
				}
			}
		},
		drawScene: function(ctx){
			if(this.changed){
				ctx.clearRect(0, 0, this.width, this.height);
				var items = this.levelItems;
				for(var i in items){
					var obj = items[i];
					for(i in obj){
						obj[i].render(ctx);
					}
				}
				this.changed = false;
				this.container.renderFrame(ctx);
			}
			this.container.frame++;
		},
		destroy: function(){
			this.eventFire.destroy();
			var destroyItems = this.destroyItems;
			for(var i in destroyItems){
				if(destroyItems[i]){
					destroyItems[i].destroy();
					delete destroyItems[i];
				}
			}
			var levelItems = this.levelItems;
			for(var i in levelItems){
				if(levelItems[i]){
					var items = levelItems[i];
					for(var j in items){
						items[j].destroy();
						delete items[j];
					}
					items.length = 0;
				}
			}
			levelItems.length = 0;
			this.superCall('destroy',this);
		},
		addDestroyItem: function(item){
			this.destroyItems[item.id] = item;
		},
		changeEventHandle: function(eventHandle){
			eventHandle.scene = this;
			this.eventFire.eventHandle = eventHandle;
		},
		init: function(){
			this.beforeInit();
			if(!this.container){
				this.container = window.container;
			}
			this.ctx = this.container.ctx;
			this.height = this.container.height;
			this.width = this.container.width;
			this.xrate = this.container.xrate;
			this.yrate = this.container.yrate;
			this.eventFire = Game.getCmp('eventFire');
			this.createScene();
			this.onInit();
		},
		beforeShow: function(){},
		onShow: function(){},
		show: function(){
			this.beforeShow();
			this.container.changeScene(this);
			this.changeEventHandle(Game.getCmp('defaultEventHandle'));
			this.onShow();
		},
		hide: function(){
			this.onHide();
		},
		createScene: function(){},
		onHide: function(){},
		addLevelItem: function(item){
			if(!this.levelItems[item.level]){
				this.levelItems[item.level] = {};
			}
			this.levelItems[item.level][item.id] = item;
			this.container.addAnimateItem(item);
			this.onAddLevelItem(item);
		},
		removeLevelItem: function(item){
			if(this.levelItems[item.level]){
				this.changed = true;
				delete this.levelItems[item.level][item.id];
			}
			this.container.removeAnimateItem(item);
			this.onRemoveLevelItem(item);
		},
		onAddLevelItem: function(item){},
		onRemoveLevelItem: function(item){},
		onDestroy: function(){},
		click: function(event,x,y){
			//用来处理background的click事件
			this.onClick(event,x,y);
		},
		onClick: function(event,x,y){},
		mousemove: function(event,x,y){
			//用来处理background的mousemove事件
			this.onMousemove(event,x,y);
		},
		onMousemove: function(event,x,y){}
	})	
	Game.reg('scene',Game.ui.Scene);
	
	//有些情况下需要改变DOM事件分发策略
	Game.util.EventFire = Game.extend({
		className:'Game.util.EventFire',
		onEvent: function(container){
			container.canvas.onclick = function(event){
				this.eventHandle.fireEvent('click',event);
			}.delegate(this);
			/*
			定位为手机方面
			不要触发onmousemove
			container.canvas.onmousemove = function(event){
				this.eventHandle.fireEvent('mousemove',event);
			}.delegate(this);
			*/
			container.canvas.oncontextmenu = function(event){
				this.eventHandle.fireEvent('contextmenu',event);
				return false;
			}.delegate(this);
		}
	})
	Game.reg('eventFire',Game.util.EventFire);
	
	//可触发事件的
	Game.util.EventHandle = Game.extend({
		click: function(event,offsetX,offsetY){
			Game.info('click@'+offsetX+','+offsetY);
		},
		mousemove: function(event,offsetX,offsetY){
			//Game.info('mousemove@'+offsetX+','+offsetY);
		},
		contextmenu: function(event,offsetX,offsetY){
			Game.info('contextmenu@'+offsetX+','+offsetY);
		},
		className:'Game.util.EventHandle',
		fireEvent: function(n,event){
			switch(n){
				case 'click':
					this.click(event,event.offsetX,event.offsetY);
					break;
				case 'contextmenu':
					this.contextmenu(event,event.offsetX,event.offsetY);
					break;
				case 'mousemove':
					this.mousemove(event,event.offsetX,event.offsetY);
					break;
				default :
					Game.info('unknow event:'+n);
					break;
			}
		}
	})
	Game.reg('eventHandle',Game.util.EventHandle);
	
	//默认的事件处理
	Game.util.DefaultEventHandle = Game.extend(Game.util.EventHandle,{
		className:'Game.util.DefaultEventHandle',
		click: function(event,x,y){
			Game.info('CLICK START:'+Date.now());
			var clickAbleIndex = this.scene.clickAbleIndex;
			var clickAbleItems = this.scene.clickAbleItems;
			OUTER:
			for(var i = clickAbleIndex.length -1 ; i > -1 ;i--){
				var items = clickAbleItems[clickAbleIndex[i]];
				INNER:
				for(var j in items){
					var item = items[j];
					if(x > item.bx && x < item.ex && y > item.by && y < item.ey){
						item.click(event,x,y);
						Game.info('CLICK   END:'+Date.now());
						Game.info('');
						//break OUTER;
						return ;
					}
				}
			}
			this.scene.click(event,x,y);
			Game.info('CLICK   END:'+Date.now());
		},
		mousemove: function(event,x,y){
			var mousemoveAbleIndex = this.scene.mousemoveAbleIndex;
			var mousemoveAbleItems = this.scene.mousemoveAbleItems;
			OUTER:
			for(var i = mousemoveAbleIndex.length -1 ; i > -1 ;i--){
				var items = mousemoveAbleItems[i];
				INNER:
				for(var j in items){
					var item = items[j];
					if(x > item.bx && x < item.ex && y > item.by && y < item.ey){
						item.mousemove(event,x,y);
						//break OUTER;
						return ;
					}
				}
			}
			this.scene.mousemove(event,x,y);
		}
	})
	Game.reg('defaultEventHandle',Game.util.DefaultEventHandle);
	
	//对话框的事件分发
	Game.util.DialogBlankEventHandle = Game.extend(Game.util.EventHandle,{
		className:'Game.util.DialogBlankEventFire',
		click: function(event,x,y){
			// do nothing
		},
		mousemove: function(event,x,y){
			// do nothing
		}
	})
	Game.reg('dialogBlankEventHandle',Game.util.DialogBlankEventHandle);
	
	//加载能够加载对象帮助工具
	Game.util.SourceLoader = Game.extend({
		itemSize:0,
		progress:0,
		loadIndex:0,
		itemArray:[],
		currentInitSize:0,
		className:'Game.util.SourceLoader',
		load: function(){
			if(this.itemSize == this.currentInitSize){
				this.progress = 100;
				for(var i =0;i < this.currentInitSize;i++){
					this.itemArray[i].doLoad();
					delete this.itemArray[i];
				}
				this.itemArray.length = 0;
				this.currentInitSize = 0;
				this.itemSize = 0;
				this.onLoad();
				this.progress = 0;
			}else{
				this.progress = parseInt((this.currentInitSize/this.itemSize)*100)
			}
			//Game.info('loader progress:'+this.progress+'%');
		},
		onLoad: function(){},
		addItem: function(item){
			item['loader'] = this;
			item.initSource();
			this.onAddItem(item);
		},
		onAddItem: function(item){},
		addLoadedItem: function(item){
			this.itemArray[this.currentInitSize++] = item;
			this.load();
		}
	})
	Game.reg('sourceLoader',Game.util.SourceLoader);
	
	//任何源，能够加载的对象都属于source
	Game.util.Source = Game.extend({
		cache:true,
		loaded:false,
		onLoad: function(){},
		className:'Game.util.Source',
		initSource: function(){
			this.create();
			this.dom.onload = function(){
				this.loaded = true;
				this.loader.addLoadedItem(this);
			}.delegate(this);
			this.load();
		},
		create: function(){},
		load: function(){},
		doLoad: function(){
			this.onLoad();
		}
	})
	Game.reg('source',Game.util.Source);
	
	//Javascript载体
	Game.util.Javascript = Game.extend(Game.util.Source,{
		className:'Game.util.Javascript',
		create: function(){
			this.dom = document.createElement('script');
			this.dom.src = this.src+(this.cache?'':'?r='+Date.now());
			this.dom.type = "text/javascript";
		},
		load: function(){
			document.getElementsByTagName('head')[0].appendChild(this.dom);
		},
		onLoad: function(){
			//do nothing
		}	
	})
	Game.reg('js',Game.util.Javascript);
	
	//Image载体
	Game.ui.Image = Game.extend(Game.util.Source,{
		cache:false,
		className:'Game.ui.Image',
		create: function(){
			this.dom = new Image();
			this.dom.src = this.src+(this.cache?'':'?r='+Date.now());
		},
		doLoad: function(){
			this.width = this.dom.naturalWidth;
			this.height = this.dom.naturalHeight;
			this.onLoad();
		},
		getImgDom: function(){
			return this.dom;
		}
	})
	Game.reg('image',Game.ui.Image);
	
	//Audio载体
	Game.util.Audio = Game.extend(Game.util.Source,{
		className:'Game.util.Audio',
		autoPlay: false,
		create: function(){
			this.dom = new Audio();
			this.dom.src = this.src+(this.cache?'':'?r='+Date.now());
			this.dom.addEventListener("canplaythrough", function(e) {
				this.loaded = true;
				this.loader.addLoadedItem(this);
			}.delegate(this));
		},
		onLoad: function(){
			// 加载出错
			this.dom.addEventListener("error", function(e) {
				// 1.用户终止 2.网络错误 3.解码错误 4.URL无效
				var errorClew = {
					1 : "用户终止",
					2 : "网络错误",
					3 : "解码错误",
					4 : "URL无效"
				};
				util.log("加载出错:"+this);
			}.delegate(this));
			// 播放结束
			this.dom.addEventListener("abort", function(e) {
				util.log("客户端主动终止下载（不是因为错误引起）");
			}.delegate(this));
			// 加载中
			this.dom.addEventListener("progress", function(e) {
				console.log("load...");
			}.delegate(this));
			// 播放结束
			this.dom.addEventListener("ended", function(e) {
				this.ended(e);
			}.delegate(this));
			// 当前播放时间改变，
			this.dom.addEventListener("timeupdate", function(e) {
				this.timeupdate(e);
			}.delegate(this));
			// 资源长度改变时
			this.dom.addEventListener("durationchange", function(e) {
				console.log(e);
			}.delegate(this));
			// 可以得到资源长度
			this.dom.addEventListener("loadedmetadata", function(e) {
				console.log(e);
			}.delegate(this));
			
			if(this.autoPlay){
				this.play();
			}
		},
		play: function() {
			this.dom.play();
		},
		pause: function() {
			this.dom.pause();
		},
		isPause: function() {
			return this.dom.paused;
		},
		isEnded: function() {
			return this.dom.ended;
		},
		end: function(e) {
			this.pause();
			this.dom.currentTime = 0.0;
		},
		ended: function(e) {
			//this.play();
		},
		getCurrTime: function() {
			// 当前以播放时间
			return this.dom.currentTime;
		},
		setCurrTime: function(value) {
			// 当前以播放时间
			this.dom.currentTime=value;
		},
		getAllTime: function() {
			// 返回总长度
			return this.dom.duration;
		},
		getVolume: function() {
			// 得到音量
			return this.dom.volume;
		},
		setVolume: function(value) {
			// 音量最大为1，从 0 - 1
			this.dom.volume = value;
		},
		getMuted: function(value) {
			// 设置静音
			return this.dom.muted;
		},
		setMuted: function(value) {
			// 设置静音
			this.dom.muted = value;
		},
		timeupdate: function(e){
			
		}
	})
	Game.reg('audio',Game.util.Audio);
	
	
	//可绘画的
	Game.ui.DrawAble = Game.extend({
		x:0,
		y:0,
		bx:0,
		by:0,
		ex:0,
		ey:0,
		rate:1,
		level:1,
		showed:false,
		clickLevel:1,
		autoShow:false,
		clickAble:false,
		mousemoveLevel:1,
		mousemoveAble:false,
		className:'Game.ui.DrawAble',
		click: function(event,x,y){
			this.onClick(event,x,y);
		},
		onClick: function(event,x,y){},
		mousemove: function(event,x,y){
			this.onMousemove(event,x,y);
		},
		onMousemove: function(event,x,y){},
		hide: function(){
			this.showed = false;
			this.scene.removeLevelItem(this);
			if(this.clickAble){
				this.scene.removeClickAbleItem(this);
			}
			if(this.mousemoveAble){
				this.scene.removeMousemoveAbleItem(this);
			}
			this.onHide();
		},
		onHide: function(){},
		show: function(scene){
			if(scene){
				if(this.showed){
					this.showed = scene == this.scene;
				}
				this.scene = scene;
			}
			if(!this.showed){
				this.beforeShow();
				this.ex = this.bx+this.renderWidth;
				this.ey = this.by+this.renderHeight;
				this.scene.addLevelItem(this);
				if(this.autoAnimate){
					this.startAnimate();
				}
				if(this.clickAble){
					this.scene.addClickAbleItem(this);
				}
				if(this.mousemoveAble){
					this.scene.addMousemoveAbleItem(this);
				}
				this.scene.changed = true;
				this.showed = true;
				this.onShow();
			}
			return this;
		},
		beforeShow: function(){},
		onShow: function(){},
		destroy: function(){
			this.scene.removeLevelItem(this);
			this.scene.container.removeAnimateItem(this);
			if(this.clickAble){
				this.scene.removeClickAbleItem(this)
			}
			if(this.mousemoveAble){
				this.scene.removeClickAbleItem(this)
			}
			this.superCall('destroy',this);
		}
	});
	Game.reg('drawAble',Game.ui.DrawAble);
	
	//可动画的
	Game.ui.AnimateAble = Game.extend(Game.ui.DrawAble,{
		moveAble:true,
		showAnimate:false,
		_showAnimate:false,
		className:'Game.ui.AnimateAble',
		doAnimate: function(){
			if(this.showAnimate){
				var now = null;
				if(this.pauseTime){
					now = this.pauseTime;
				}else{
					now = Date.now();
				}
				var past = now - this.lastPast;
				if(past >= this.per){
					var remainder = past%this.per;
					var execTime = (past - remainder) / this.per;
					for(var i = 0;i< execTime ;i++){
						this.animate();
					}
					this.changeEpos();
					this.scene.changed = true;
					this.lastPast = now - remainder;
				}else if(past/this.per > 0.85){
					var remainder = this.per - past;
					this.animate();
					this.changeEpos();
					this.scene.changed = true;
					this.lastPast = now + remainder;
				}
			}
		},
		beforeAnimate: function(){},
		animate: function(){
			this.beforeAnimate();
			this.onAnimate();
		},
		changeEpos: function(){
			this.ex = this.bx+this.renderWidth;
			this.ey = this.by+this.renderHeight;
		},
		onAnimate: function(){},
		onStopAnimate: function(){},
		startAnimate: function(){
			if(!this.started){
				this.showAnimate = true;
				this._showAnimate = true;
				this.lastPast = Date.now();
				this.paused = false;
				this.started = true;
			}
		},
		stopAnimate: function(){
			this.beforeStopAnimate();
			this.showAnimate = false;
			this._showAnimate = false;
			this.started = false;
			this.onStopAnimate();
		},
		beforeStopAnimate: function(){},
		pause: function(){
			if(!this.paused){
				this.pauseTime = Date.now();
				this.showAnimate = false;
				this.paused = true;
			}
		},
		play: function(){
			this.showAnimate = this._showAnimate;
			this.paused = false;
		},
		render: function(ctx){}
	})
	Game.reg('animateAble',Game.ui.AnimateAble);
	
	//一张包含多张小图片动画组合的图片
	Game.ui.MixImage = Game.extend(Game.ui.AnimateAble,{
		flash:true,
		imgInterval:0,
		autoShow:false,
		calcRated:false,
		currentImgIndex:0,
		currentImgInterval:0,
		className:'Game.ui.MixImage',
		convertImgLocation: function(){
			var xrate = this.xrate * this.scene.xrate;
			var yrate = this.yrate * this.scene.yrate;
			for(var i in this.images){
				var img = this.images[i];
				if(!img.offsetX){
					img.offsetX = 0;
				}
				if(!img.offsetY){
					img.offsetY = 0;
				}
				img.offsetX = img.offsetX * xrate;
				img.offsetY = img.offsetY * yrate;
				img.renderWidth = img.frameWidth * xrate;
				img.renderHeight = img.frameHeight * yrate;
				img.bx = this.x + img.offsetX;
				img.by = this.y + img.offsetY;
			}
		},
		init: function(){
			this.beforeInit();
			if(!this.xrate){
				this.xrate = this.rate;
			}
			if(!this.yrate){
				this.yrate = this.rate;
			}
			this.x = this.x * this.scene.xrate;
			this.y = this.y * this.scene.yrate;
			this.convertImgLocation();
			this.img = this.images[this.currentImgIndex++];
			this.bx = this.images[0].bx;
			this.by = this.images[0].by;
			if(this.images.length < 2){
				throw 'please use ImageHolder';
			}
			this.onInit();
			if(!this.imgDom){
				throw 'none image dom found!';
			}
		},
		animate: function(){
			this.beforeAnimate();
			if(this.flash){
				if(this.imgInterval == 0){
					this.img = this.images[this.currentImgIndex++];
					this.calcBXBY();
					if(this.currentImgIndex == this.images.length){
						this.currentImgIndex = 0;
					}
				}else{
					this.currentImgInterval++;
					if(this.currentImgInterval == this.imgInterval){
						this.currentImgInterval = 0;
						this.img = this.images[this.currentImgIndex++];
						this.calcBXBY();
						if(this.currentImgIndex == this.images.length){
							this.currentImgIndex = 0;
						}
					}
				}
			}
			this.onAnimate();
		},
		beforeStopAnimate: function(){
			this.img = this.images[0];
			this.calcBXBY();
		},
		beforeRender: function(ctx){},
		render: function(ctx){
			this.beforeRender(ctx);
			ctx.drawImage(this.imgDom,this.img.frameX,this.img.frameY,this.img.frameWidth,this.img.frameHeight,this.bx,
				this.by,this.img.renderWidth,this.img.renderHeight);
			this.onRender(ctx);
		},
		onRender: function(ctx){},
		calcBXBY: function(){
			if(this.moveAble){
				this.bx = this.x + this.img.offsetX;
				this.by = this.y + this.img.offsetX;
			}else{
				this.bx = this.img.bx;
				this.by = this.img.by;
			}
			this.renderWidth = this.img.renderWidth;
			this.renderHeight = this.img.renderHeight;
		}
	})
	Game.reg('mixImage',Game.ui.MixImage);
	
	//图片承载，可以在多个位置显示一张图片资源
	Game.ui.ImageHolder = Game.extend(Game.ui.AnimateAble,{
		frameX:0,
		frameY:0,
		offsetX:0,
		offsetY:0,
		currentImgInterval:0,
		className:'Game.ui.ImageHolder',
		init: function(){
			this.beforeInit();
			if(!this.xrate){
				this.xrate = this.rate;
			}
			if(!this.yrate){
				this.yrate = this.rate;
			}
			if(!this.frameWidth){
				this.frameWidth = this.img.width;
			}
			if(!this.frameHeight){
				this.frameHeight = this.img.height;
			}
			this.x = this.x * this.scene.xrate;
			this.y = this.y * this.scene.yrate;
			this.offsetX = this.offsetX * this.xrate * this.scene.xrate;
			this.offsetY = this.offsetY * this.yrate * this.scene.yrate;
			this.renderWidth = this.frameWidth * this.xrate * this.scene.xrate;
			this.renderHeight = this.frameHeight * this.yrate * this.scene.yrate;
			this.bx = this.x + this.offsetX;
			this.by = this.y + this.offsetY;
			this.onInit();
			this.imgDom = this.img.dom;
			if(this.autoShow){
				this.show();
			}
		},
		beforeRender: function(ctx){},
		render: function(ctx){
			this.beforeRender(ctx);
			ctx.drawImage(this.imgDom,this.frameX,this.frameY,this.frameWidth,this.frameHeight,this.bx,this.by
				,this.renderWidth,this.renderHeight);
			this.onRender(ctx);
		},
		onRender: function(ctx){},
		animate: function(){
			this.beforeAnimate();
			this.calcBXBY();
			this.onAnimate();
		},
		calcBXBY: function(){
			if(this.moveAble){
				this.bx = this.x + this.offsetX;
				this.by = this.y + this.offsetY;
			}
		}
	})
	Game.reg('imageHolder',Game.ui.ImageHolder);
	
	//对话框
	Game.ui.MsgBox = Game.extend(Game.ui.ImageHolder,{
		level:5,
		dialog:true,
		init: function(){
			this.beforeInit();
			if(!this.xrate){
				this.xrate = this.rate;
			}
			if(!this.yrate){
				this.yrate = this.rate;
			}
			if(!this.frameWidth){
				this.frameWidth = this.img.width;
			}
			if(!this.frameHeight){
				this.frameHeight = this.img.height;
			}
			this.renderWidth = this.frameWidth * this.xrate * this.scene.xrate;
			this.renderHeight = this.frameHeight * this.yrate * this.scene.yrate;
			if(this.x == 0){
				this.x = (960-this.frameWidth*this.xrate)/2;
			}
			if(this.y == 0){
				this.y = (640-this.frameHeight*this.yrate)/3;
			}
			this.x = this.x * this.scene.xrate;
			this.y = this.y * this.scene.yrate;
			this.offsetX = this.offsetX * this.xrate * this.scene.xrate;
			this.offsetY = this.offsetY * this.yrate * this.scene.yrate;
			this.bx = this.x + this.offsetX;
			this.by = this.y + this.offsetY;
			this.dialogBg = Game.getCmp('dialogBg');
			this.onInit();
			this.imgDom = this.img.dom;
			if(this.autoShow){
				this.show();
			}
		},
		hide: function(){
			this.superCall('hide',this);
			this.dialogBg.hide();
			this.onHide();
		},
		show: function(args){
			this.superCall('show',this,args);
			this.dialogBg.show(this.scene);
			this.onShow();
		}
	})
	Game.reg('msgBox',Game.ui.MsgBox);

	/*
	frameX:166,//在大图中X坐标
	frameY:274,//在大图中Y坐标
	frameWidth:51,//在大图中的宽度
	frameHeight:109,//在大图中的高度
	offsetX:0,//相比原图偏移X像素
	offsetY:-1,//相比原图偏移Y像素
	rotated:false,//是否正时针旋转90°存放的
	sourceColorRectX:17,//裁切前有色区域X起始位置
	sourceColorRectY:7,//裁切前有色区域Y起始位置
	sourceColorRectWidth:51,//有色区域宽度，一般与frameWidth一致
	sourceColorRectHeight:109,//有色区域高度，一般与frameHeight一致
	sourceSizeWidth:85,//原图宽度
	sourceSizeHeight:121,//原图高度
	*/
	
	//遮罩层
	Game.ui.DialogBg = Game.extend(Game.ui.DrawAble,{
		level:4,
		clickAble:true,
		backgroundColor:'rgba(255, 255, 255, 0.3)',
		render: function(ctx){
			ctx.fillStyle = this.backgroundColor;
			ctx.fillRect(0,0,this.scene.width, this.scene.height);
		},
		beforeShow: function(){
			this.renderWidth = this.scene.width;
			this.renderHeight = this.scene.height;
		},
		onClick: function(event,x,y){
			Game.info(x+','+y);
		}
	})
	Game.reg('dialogBg',Game.ui.DialogBg);
	
	//桌面上的文字
	Game.ui.Text = Game.extend(Game.ui.AnimateAble,{
		fill:true,
		textAlign:'left',
		textBaseline:'top',
		font:'20px sans-serif',
		className:'Game.ui.Text',
		fillStyle:'rgba(20,20,20,1)',
		strokeStyle:'rgba(20,20,20,1)',
		className:'Game.ui.Text',
		render: function(ctx){
			ctx.textAlign=this.textAlign;
			ctx.textBaseline=this.textBaseline;
			ctx.font = this.font;
			if(this.fill){
				ctx.fillStyle=this.fillStyle;
				ctx.fillText(this.text,this.bx,this.by);
			}else{
				ctx.strokeStyle=this.stokeStyle;
				ctx.strokeText(this.text,this.bx,this.by);
			}
		},
		beforeShow: function(){
			var size = parseInt(this.font);
			this.renderHeight = size;
			this.renderWidth = size*this.text.length/2;
		},
		init: function(){
			this.beforeInit();
			this.bx = this.x = this.x * this.scene.xrate;
			this.by = this.y = this.y * this.scene.yrate;
			this.onInit();
			if(this.autoShow){
				this.show();
			}
		}
	})
	Game.reg('text',Game.ui.Text);
	
	//下面是一些插件
	
	//桌面初始化时候的Loading图案
	Game.ui.Loading = Game.extend(Game.ui.AnimateAble,{
		per:96,
		level:3,
		circleNum:8,
		showAnimate:true,
		autoAnimate:true,
		_showAnimate:true,
		progressTextAlign:'center',
		progressFont:'10px sans-serif',
		progressFillStyle:'rgb(20,20,20)',
		backgroundColor:'rgba(255, 255, 255, 0.5)',
		className:'Game.ui.Loading',
		beforeRender: function(ctx){
			ctx.fillStyle = this.backgroundColor;
			ctx.fillRect(0,0,this.scene.width, this.scene.height);
		},
		beforeShow: function(){
			this.onStopAnimate();
		},
		onHide: function(){
			this.scene.container.removeAnimateItem(this);
		},
		renderProgress: function(ctx){
			ctx.fillStyle=this.progressFillStyle;
			ctx.textAlign=this.progressTextAlign;
			ctx.font = this.progressFont;
			ctx.textBaseline = 'middle';
			ctx.fillText(this.scene.container.loader.progress+'%',0,0);
		},
		render: function(ctx){
			this.beforeRender(ctx);
			ctx.translate(this.transWidth,this.transHeight);
			this.renderProgress(ctx);
			var rotate = this.rotate;
			var maxRotate = this.maxRotate;
			var rotateRate = this.rotateRate;
			for (var i=0;i<this.circleNum;i++){
				ctx.save();
				this.setFillStyle(ctx,i);
				ctx.rotate(rotate*Math.PI/180);
				if(rotate == maxRotate){
					rotate = 0;
				}else{
					rotate+=rotateRate;
				}
				ctx.beginPath();
				this.arc(ctx,i);
				ctx.fill();
				ctx.restore();
			}
			ctx.translate(-this.transWidth,-this.transHeight);
			this.onRender(ctx);
		},
		onRender: function(){},
		onAnimate: function(){
			if(this.rotate == this.maxRotate){
				this.rotate = 0;
			}else{
				this.rotate+=this.rotateRate;
			}
		},
		onStopAnimate: function(){
			this.transWidth = this.scene.width/2;
			this.transHeight = this.scene.height/2;
			this.rotate = 0;
			this.rotateRate = 360 / this.circleNum;
			this.maxRotate = 360-this.rotateRate;
		},
		onDestroy: function(){
			this.stopAnimate();
			this.hide();
		}
	})
	Game.reg('loading',Game.ui.Loading);
	
	//桌面初始化时候的Loading图案
	Game.ui.BasicLoading = Game.extend(Game.ui.Loading,{
		className:'Game.ui.BasicLoading',
		setFillStyle: function(ctx,i){
			ctx.fillStyle = 'rgb('+(255-30*i)+',255,'+(247+i)+')';
		},
		arc: function(ctx,i){
			ctx.arc(0,35,4+i*0.5,0,Math.PI*2,true);
		}
	})
	Game.reg('basicLoading',Game.ui.BasicLoading);
	
	//桌面初始化时候的BoxBootLoading图案
	Game.ui.BoxBootLogoLoading = Game.extend(Game.ui.Loading,{
		className:'Game.ui.BoxBootLogoLoading',
		beforeRender: function(ctx){
			ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			ctx.fillRect(0,0,this.scene.width, this.scene.height);
			this.img.render(ctx);
		},
		setFillStyle: function(ctx,i){
			ctx.fillStyle = 'rgb('+(255-5*i)+',255,'+(247+i)+')';
		},
		arc: function(ctx,i){
			ctx.arc(0,20,1+i*0.3,0,Math.PI*2,true);
		},
		onStopAnimate: function(){
			this.transWidth = this.scene.width/2;
			this.transHeight = this.img.by + this.img.renderHeight + 30;
			this.rotate = 0;
			this.rotateRate = 360 / this.circleNum;
			this.maxRotate = 360-this.rotateRate;
		}
	})
	Game.reg('boxBootLogoLoading',Game.ui.BoxBootLogoLoading);
	
	//桌面第一次显示的渐显画面
	Game.ui.AlphaShow = Game.extend(Game.ui.AnimateAble,{
		cut:5,
		per:50,
		alpha:1,
		level:2,
		_alpha:100,
		rgb:'0, 0, 0',
		className:'Game.ui.AlphaShow',
		render: function(ctx){
			ctx.fillStyle = 'rgba('+this.rgb+', '+this.alpha+')';
			ctx.fillRect(0,0,this.scene.width, this.scene.height);
		},
		onAnimate: function(){
			if(this.alpha < 0){
				this.stopAnimate();
			}else{
				this.alpha = (this._alpha-=this.cut)/100;
				this.scene.changed = true;
			}
		},
		stopAnimate: function(){
			this.hide();
			this.destroy();
		},
		beforeShow: function(){
			this.startAnimate();
		}
	})
	Game.reg('alphaShow',Game.ui.AlphaShow);
	
	//桌面上的背景
	Game.ui.Background = Game.extend(Game.ui.ImageHolder,{
		level:0,
		className:'Game.ui.Background',
		init: function(){
			this.beforeInit();
			this.frameWidth = this.img.width;
			this.frameHeight = this.img.height;
			this.renderWidth = this.scene.width;
			this.renderHeight = this.scene.height;
			this.onInit();
			this.imgDom = this.img.dom;
			if(this.autoShow){
				this.show();
			}
		},
	})
	Game.reg('bg',Game.ui.Background);
	
	//BoxBootLogo
	Game.ui.PopLogo = Game.extend(Game.ui.ImageHolder,{
		rate:0.7,
		className:'Game.ui.PopLogo',
		init: function(ctx){
			this.beforeInit();
			if(!this.xrate){
				this.xrate = this.rate;
			}
			if(!this.yrate){
				this.yrate = this.rate;
			}
			if(!this.frameWidth){
				this.frameWidth = this.img.width;
			}
			if(!this.frameHeight){
				this.frameHeight = this.img.height;
			}
			this.renderWidth = this.frameWidth * this.xrate * this.scene.xrate;
			this.renderHeight = this.frameHeight * this.yrate * this.scene.yrate;
			if(this.x == 0){
				this.x = (960-this.frameWidth*this.xrate)/2;
			}
			if(this.y == 0){
				this.y = (640-this.frameHeight*this.yrate)/3;
			}
			this.x = this.x * this.scene.xrate;
			this.y = this.y * this.scene.yrate;
			this.offsetX = this.offsetX * this.xrate * this.scene.xrate;
			this.offsetY = this.offsetY * this.yrate * this.scene.yrate;
			this.bx = this.x + this.offsetX;
			this.by = this.y + this.offsetY;
			this.dialogBg = Game.getCmp('dialogBg');
			this.onInit();
			this.imgDom = this.img.dom;
			if(this.autoShow){
				this.show();
			}
		}
	})
	Game.reg('popLogo',Game.ui.PopLogo);
	
	//基础对象- - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	//image loader
	Game.create('sourceLoader',{id:'sourceLoader',itemSize:1});
	
	//默认的事件处理
	Game.create('defaultEventHandle',{id:'defaultEventHandle'});
	
	//主控制器
	window.container = Game.create('container',{loader:Game.getCmp('sourceLoader')});
	
	
	//主要定时任务监视器，根据系统性能每隔一定重绘桌面
	Game.create('timer',{
		millisecond:15,
		id:'timer-container-draw',
		method: function(){
			this.container.drawContainer();
		},
		onStart: function(){
			this.container = window.container;
			this.container.lastFrameTime = Date.now();
		}
	});
	
	//主要定时任务监视器，每隔1000毫秒计算帧率

	Game.create('timer',{
		millisecond:1000,
		id:'timer-container-renderFrame',
		container:window.container,
		method: function(){
			this.container.lastFrame = this.container.frame;
			this.container.frame = 0;
			this.container.scene.changed = true;
			/*
			if(this.showFPS){
				this.calcFPS();
			}
			*/
		}
	});
	
	
	//默认的EventFire
	Game.create('eventFire',{id:'eventFire'});
	
	//默认遮罩层
	Game.create('dialogBg',{id:'dialogBg'});
	
	//Logo加载动画
	Game.create('boxBootLogoLoading',{id:'box-boot-loading',showAnimate:true,progressFillStyle:'rgb(255,255,255)'});
	
	//basic loading
	Game.create('basicLoading',{id:'basicLoading'});
	
	//Dialog
	Game.create('dialogBlankEventHandle',{id:'dialogBlankEventHandle'});
	
	//
	window.onresize = function(){}
	
})(window.Game)
//初学乍练，初窥门径，略知一二，粗通皮毛，登堂入室，驾轻就熟，
//青出於蓝，融会贯通，炉火纯青，出类拔萃，技冠群雄，出神入化，傲视群雄，登峰造极，
//惊世骇俗，震古铄今，威镇寰宇，空前绝后，天人合一，返璞归真
//籍籍无名 初露锋芒 误入歧途 问鼎天下 独步武林 独孤求败 道法自然