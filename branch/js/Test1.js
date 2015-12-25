/**
*/
(function(Game){
	Game = window.Game = Game || window.Game || new function Game(){};
	Game.math = Game.math || new function(){};
	window.$gm = Game.math;
	Game.version = Game.version || '1.02';
	var check=function(r){
		return r.test(navigator.userAgent.toLowerCase());
	};
	Game.isOpera=check(/opera/);
	Game.isIE=!Game.isOpera && check(/msie/);
	Game.isChrome=check(/chrome/);
	Game.genId = Game.genId || 1000;
	Game.comps = Game.comps || new function(){};
	Game.ui = Game.ui || new function(){};
	Game.util = Game.util || new function(){};
	Game.classes = Game.classes || new function(){};
	Game.Object = Game.Object || function(){this.className = 'Game.Object'};
	Game.apply = function(object, config, defaults) {
		if (defaults) {
			Game.apply(object, defaults);
		}
		if(!object){
			object = {};
		}
		if(config){
			var temp = {xtype:true,init:true};
			var temp1 = {'toString':true};
			var p = typeof(object) == 'function' ? object.prototype : object;
			var c = typeof(config) == 'function' ? config.prototype : config;
			for (var k in c) {
				if(temp1[k] || !temp[k]){
					p[k] = c[k];
				}
			}
		}
		return object;
	};
	
	Game.apply(Game,{
		reg:function(name,clazz){
			if(this.classes[name]){
				this.warn('Class repeat:'+name);
			}
			this.classes[name] = clazz;
			clazz.prototype.xtype = name;
		},
		create:function(n,args){
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
		log:function(object){
			console.log(object);
		},
		warn:function(object){
			console.warn(object);
		},
		error:function(object){
			console.error(object);
		},
		getId:function(t){
			return t+'-gen-'+(this.genId++);
		},
		get:function(id){
			var dom = document.getElementById(id);
			if(dom){
				return dom;
			}
			return this.comps[id];
		},
		getCmp:function(id){
			return this.comps[id];
		},
		onReady:function(fun){
			window.onload = fun;
		},
		copy:function(o){
			if(o.className){
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
		createRect:function(width,height,v){
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
			if (defaults) {
				Game.apply(object, defaults);
			}
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
			return object;
		},

		isObject: function(o){
			return Array.isArray(o) ? false : typeof o == 'object';
		},
		
		isArray: function(o){
			return Array.isArray(o);
		},
		
		isNull:function(o){
			return o == null || o == undefined;
		}
		
	});

	Game.apply(Game, {
	
		extend: function() {
			var _fun = ' = '+(function(){
				superc.apply(this,arguments);
				for(var i in son){
					var item = son[i] ;
					if(typeof(item) != 'function' && i != 'xtype'){
						this[i] = Game.copy(item);
					}
				}
				this.superClass = superc;
			}).toString();
			return function (superc,son){
				if(son == null){
					return this.extend(this.Object,superc);
				}
				if(!this.isObject(son)){
					throw new Error('son is not a object.');
				}
				var f = null;
				if(son.className){
					eval(son.className+_fun);
					eval('f = '+son.className);
				}else{
					f = function(){
						superc.apply(this,arguments);
						for(var i in son){
							var item = son[i] ;
							if(typeof(item) != 'function' && i != 'xtype'){
								this[i] = Game.copy(item);
							}
						}
						this.superClass = superc;
					}
				}
				var tp = f.prototype = Game.copy(superc.prototype);
				for(var i in son){
					var item = son[i] ;
					if(typeof(item) == 'function'){
						tp[i] = item;
					}
				}
				return f;
			}
		}(),
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
	
	//基类
	Game.apply(Game.Object,{
		getId:function(){return this.id;},
		superCall:function(n,o,args){o.superClass.prototype[n].apply(o,args)},
		toString:function(){return (this.className?this.className:this.xtype)+'@'+this.id},
		onDestroy:function(){},
		//init:function() {},
		destroy:function(){
			delete Game.comps[this.id];
			this.onDestroy();
		}
	})
	
	//前置工作貌似都一样
	Game.apply(Game,{
		setup:function(scene,callback,canvasId){
			Game.getCmp('container-1').initContainer(Game.get(canvasId));
			Game.getCmp('container-1').changeScene(scene);
			scene.changeEventHandle(Game.getCmp('dialogBlankEventHandle-1'));
			Game.getCmp('popLogo-1').scene = scene;
			Game.getCmp('imageLoader-1').itemSize = 1;
			Game.getCmp('imageLoader-1').addItem(Game.getCmp('popLogo-1'));
			Game.getCmp('imageLoader-1').onLoad = function(){
				Game.getCmp('box-boot-loading-1').scene = scene;
				Game.getCmp('box-boot-loading-1').show();
				Game.getCmp('timer-container-draw').start();
				Game.getCmp('timer-container-renderFrame').start();
				callback(Game.getCmp('imageLoader-1'),scene);
			}
		}
	})
	
	//下面是一些数学计算
	Game.apply(Game.math,{
		//根据坐标计算cell所在的index
		pos:function(p,w,b){
			var s = p/w;
			var sInt = parseInt(s);
			var sDecimal = s - sInt;
			if(b != null && sDecimal > b){
				return -1;
			}
			return sInt;
		},
		//根据坐标计算旋转角度
		rotate:function(x,y){
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
		distance:function(x1,y1,x2,y2){
			var x = x2 - x1;
			var y = y2 - y1;
			return Math.sqrt(x*x+y*y);
		}
	})
	
	//创建AStar对象
	Game.math.AStar = Game.math.AStar || new function(){};
	
	//一些需要持久对象的算法，抽象成类
	Game.apply(Game.math.AStar,{
		//横或竖向移动一格的路径评分
		COST_STRAIGHT:10,
		//斜向移动一格的路径评分
		COST_DIAGONAL:14,
		//不能行走
		NODE_NOWAY:0,
		//当前节点没使用过
		NODE_NONE:0,
		//在开启列表中
		NODE_OPEN:1,
		//在关闭列表中
		NODE_CLOSED:2,
		//地图
		map:null,
		//地图副本，标记开启关闭列表
		mapc:null,
		//地图宽度
		width:0,
		//地图高度
		height:0,
		//开启列表
		OpenList:null,
		//当前开启列表的下标
		olength:0,
		//是否找到
		findFalg:false,
		//Open Node cache
		OpenTable:{},
		className:'Game.math.AStar',
		reset:function(sx,sy,width,height,map){
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
		resetMapc:function(v){
			for(var i in this.mapc){
				var item = this.mapc[i];
				for(var j in item){
					item[j] = v;
				}
			}
		},
		copyMapArea:function(sx,sy,width,height,map){
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
		createNode:function(x,y,map,parent){
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
		find:function(x1,y1,x2,y2){
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
		read:function(list,node) {
			if (node.parent != null) {
				this.read(list, node.parent);
			}
			list.push(node);
		},
		check:function(x, y, eNode, parentNode, step) {
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
		putClosedTabe:function(node,eNode) {
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
		putOpenTable:function(x, y, eNode, parentNode, step) {
			var node = this.createNode(x, y,this.map, parentNode);
			this.count(node, eNode, step);
			this.OpenList[++this.olength] = node;
			this.OpenTable[node.x + "_" + node.y]= node;
			return true;
		},
		updateOpenTable:function(x, y, eNode, parentNode, step) {
			var node = this.OpenTable[x + "_" + y];
			var g = parentNode.g + step;
			if (g < node.g) {// 如果新的NODE距离起点的距离更小，增使用该新的替换掉旧的
				node.parent = parentNode;
				this.count(node, eNode, step);
				return true;
			}
			return false;
		},
		count:function(node, eNode, step) {
			this.countG(node, node.parent, step);
			this.countH(node, eNode);
			this.countF(node);
		},
		countG:function(node, parentNode, step) {
			if (parentNode == null) {
				node.g = step;
			} else {
				node.g = parentNode.g + step;
			}
		},
		countH:function(node, eNode) {
			node.h = Math.abs(eNode.x - node.x) + Math.abs(eNode.y - node.y);
		},
		countF:function(node) {
			node.f = node.g + node.h;
		}
	})
	
	//下面是一些基础组件
	
	//计时器，可以定时执行任务
	Game.util.Timer = Game.extend({
		isStop:false,
		millisecond:1000,
		lastTimeout:0,
		className:'Game.util.Timer',
		paused:false,
		delay:0,
		start:function(){
			this.isStop = false;
			this.timeStr='Game.getCmp("'+this.id+'")._start()';
			this.onStart();
			this._millisecond = this.millisecond;
			this.lastTimeout = setTimeout(this.timeStr,this.millisecond);
			this.lastPlay = Date.now();
			return this;
		},
		_start:function(){
			if(!this.isStop){
				clearTimeout(this.lastTimeout)
				this.millisecond = this._millisecond;
				this.lastTimeout = setTimeout(this.timeStr,this.millisecond);
				this.lastPlay = Date.now();
				this.method();
			}
		},
		pause:function(){
			if(!this.paused){
				clearTimeout(this.lastTimeout);
				this.pauseTime = Date.now();
				this.paused = true;
			}
		},
		play:function(){
			if(this.paused){
				this.millisecond = this.millisecond - this.pauseTime + this.lastPlay;
				this.lastTimeout = setTimeout(this.timeStr,this.millisecond);
				this.lastPlay = Date.now();
				this.paused = false;
			}
		},
		stop:function(){
			clearTimeout(this.lastTimeout);
			this.onStop();
			this.isStop = true;
		},
		onStop:function(){
			//do nothing
		},
		onStart:function(){
			//do nothing
		},
		onDestroy:function(){
			this.stop();
			Game.timers.remove(this.id);
		},
		init:function(){
			Game.timers.put(this);
			return this;
		}
	})
	Game.reg('timer',Game.util.Timer);
	
	//Map
	Game.util.Map = Game.extend({
		_size:0,
		entries:{},
		className:'Game.util.Map',
		put:function(o){
			this.entries[o.id] = o;
			this._size++;
		},
		get:function(id){
			return this.entries[id];
		},
		remove:function(id){
			var item = this.entries[id];
			if(item){
				delete this.entries[id];
				this._size--;
			}
			return item;
		},
		each:function(call){
			var entries = this.entries;
			for(var i in entries){
				if(call(entries[i]) == false){
					break;
				}
			}
		},
		size:function(){
			return this._size;
		},
		first:function(){
			if(this._size == 0){
				return null;
			}
			for(var i in this.entries){
				return this.entries[i];
			}
		},
		clear:function(){
			var that = this;
			this.each(function(item){
				item.destroy();
				that.remove(item);
			});
		},
		onDestroy:function(){
			this.clear();
		}
	});
	Game.reg('map',Game.util.Map);
	
	//场景控制器，用来控制场景的切换
	Game.ui.Container = Game.extend({
		className:'Game.ui.Container',
		animateItems:{},
		frame:0,
		calc:0,
		lastFrame:0,
		changeScene:function(scene){
			if(this.scene){
				this.scene.hide();
			}
			this.scene = scene;
			this.scene.container = this;
			this.scene.show();
		},
		drawContainer:function(){
			this.scene.drawScene(this.ctx);
			this.animate();
		},
		animate:function(){
			var items = this.animateItems;
			for(var i in items){
				var obj = items[i];
				if(obj.doAnimate){
					obj.doAnimate();
				}
			}
			this.calc++;
		},
		initContainer:function(canvas){
			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			this.ctx.textBaseline = 'top';
			this.task = Game.getCmp('timer-container-draw');
			this.initBox();
			this.onInitContainer();
			return this;
		},
		initBox:function(){
			this.height=document.body.scrollHeight;
			this.width=document.body.clientWidth;
			this.canvas.height=this.height;
			this.canvas.width=this.width;
		},
		onInitContainer:function(){},
		addAnimateItem:function(item){
			this.animateItems[item.id] = item;
		},
		removeAnimateItem:function(item){
			delete this.animateItems[item.id];
		},
		pause:function(){
			
		},
		play:function(){
			
		},
		calcFrame:function(){
			var dateNow = Date.now();
			var range = dateNow - this.lastFrameTime;
			this.frame = parseInt(1000/range);
			this.lastFrameTime = dateNow;
		},
		renderFrame:function(ctx){
			ctx.textAlign = 'left',
			ctx.textBaseline = 'top';
			ctx.font="16px sans-serif";
			ctx.fillStyle = 'rgb(20,20,20)';
			ctx.fillText('FPS:'+this.lastFrame,5,1);
		}
	})
	Game.reg('container',Game.ui.Container);
	
	//场景，场景可以用来被container切换
	Game.ui.Scene = Game.extend({
		levelItems:[],
		destroyItems:{},
		clickAbleIndex:[],
		clickAbleItems:[],
		mousemoveAbleIndex:[],
		mousemoveAbleItems:[],
		changed:false,
		className:'Game.ui.Scene',
		addClickAbleItem:function(item){
			if(!this.clickAbleItems[item.clickLevel]){
				this.clickAbleItems[item.clickLevel] = {};
			}
			this.clickAbleItems[item.clickLevel][item.id] = item;
			var contains = false;
			for(var i in this.clickAbleIndex){
				if(i == item.clickLevel){
					contains = true;
					break;
				}
			}
			if(!contains){
				this.clickAbleIndex.push(item.clickLevel);
			}
			this.clickAbleIndex.sort();
		},
		removeClickAbleItem:function(item){
			if(this.clickAbleItems[item.clickLevel]){
				delete this.clickAbleItems[item.clickLevel][item.id];
				if(this.clickAbleItems[item.clickLevel].length == 0){
					delete this.clickAbleItems[item.clickLevel];
					this.clickAbleItems.sort();
					this.clickAbleItems.length -= 1;
				}
			}
		},
		addMousemoveAbleItem:function(item){
			if(!this.mousemoveAbleItems[item.mousemoveLevel]){
				this.mousemoveAbleItems[item.mousemoveLevel] = {};
			}
			this.mousemoveAbleItems[item.mousemoveLevel][item.id] = item;
			var contains = false;
			for(var i in this.mousemoveAbleIndex){
				if(i == item.mousemoveLevel){
					contains = true;
					break;
				}
			}
			if(!contains){
				this.mousemoveAbleIndex.push(item.mousemoveLevel);
			}
			this.mousemoveAbleIndex.sort();
		},
		removeMousemoveAbleItem:function(item){
			if(this.mousemoveAbleItems[item.mousemoveLevel]){
				delete this.mousemoveAbleItems[item.mousemoveLevel][item.id];
				if(this.mousemoveAbleItems[item.mousemoveLevel].length == 0){
					delete this.mousemoveAbleItems[item.mousemoveLevel];
					this.mousemoveAbleItems.sort();
					this.mousemoveAbleItems.length -= 1;
				}
			}
		},
		drawScene:function(ctx){
			if(this.changed){
				ctx.clearRect(0, 0, this.container.width, this.container.height);
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
		destroy:function(){
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
			delete Game.comps[this.id];
			this.onDestroy();
		},
		addDestroyItem:function(item){
			this.destroyItems[item.id] = item;
		},
		changeEventHandle:function(eventHandle){
			this.eventHandle = eventHandle;
			this.eventHandle.scene = this;
			this.eventFire.onEvent(this);
		},
		show:function(){
			this.ctx = this.container.ctx;
			this.height = this.container.height;
			this.width = this.container.width;
			this.beforeShow();
		},
		beforeShow:function(){},
		hide:function(){
			this.onHide();
		},
		init:function(){
			this.eventFire = Game.getCmp('eventFire-1');
			this.createScene();
		},
		createScene:function(){},
		onHide:function(){},
		onAddItem:function(item){},
		addLevelItem:function(item){
			var array = this.levelItems[item.level];
			if(!array){
				this.levelItems[item.level] = array = {};
			}
			array[item.id] = item;
			this.onAddLevelItem(item);
		},
		removeLevelItem:function(item){
			var array = this.levelItems[item.level];
			if(array){
				item.scene.changed = true;
				delete this.levelItems[item.level][item.id];
			}
			this.onRemoveLevelItem(item);
		},
		onAddLevelItem:function(item){},
		onRemoveLevelItem:function(item){},
		onDestroy:function(){},
		click:function(event,x,y){
			//用来处理background的click事件
			this.onClick(event,x,y);
		},
		onClick:function(event,x,y){},
		mousemove:function(event,x,y){
			//用来处理background的mousemove事件
			this.onMousemove(event,x,y);
		},
		onMousemove:function(event,x,y){}
	})	
	Game.reg('scene',Game.ui.Scene);
	
	//有些情况下需要改变DOM事件分发策略
	Game.util.EventFire = Game.extend({
		className:'Game.util.EventFire',
		onEvent:function(scene){
			scene.ctx.canvas.onclick = function(event){
				scene.eventHandle.fireEvent('click',event,scene);
			}
			scene.ctx.canvas.onmousemove = function(event){
				scene.eventHandle.fireEvent('mousemove',event,scene);
			}
		}
	})
	Game.reg('eventFire',Game.util.EventFire);
	
	//可触发事件的
	Game.util.EventHandle = Game.extend({
		className:'Game.util.EventHandle',
		click:function(){},
		mousemove:function(){},
		fireEvent:function(n,event,scene){
			switch(n){
				case 'click':
					return this.click(event,scene,event.offsetX,event.offsetY);
					break;
				case 'mousemove':
					return this.mousemove(event,scene,event.offsetX,event.offsetY);
					break;
				default :
					Game.log('unknow event:'+n);
					break;
			}
		}
	})
	Game.reg('eventHandle',Game.util.EventHandle);
	
	//默认的事件处理
	Game.util.DefaultEventHandle = Game.extend(Game.util.EventHandle,{
		className:'Game.util.DefaultEventHandle',
		click:function(event,scene,x,y){
			var clickAbleIndex = this.scene.clickAbleIndex;
			var clickAbleItems = this.scene.clickAbleItems;
			OUTER:
			for(var i = clickAbleIndex.length -1 ; i > -1 ;i--){
				var items = clickAbleItems[i];
				INNER:
				for(var j in items){
					var item = items[j];
					if(x > item.x && x < item.ex && y > item.y && y < item.ey){
						item.click(event,x,y);
						//break OUTER;
						return ;
					}
				}
			}
			scene.click(event,x,y);
		},
		mousemove:function(event,scene,x,y){
			var mousemoveAbleIndex = this.scene.mousemoveAbleIndex;
			var mousemoveAbleItems = this.scene.mousemoveAbleItems;
			OUTER:
			for(var i = mousemoveAbleIndex.length -1 ; i > -1 ;i--){
				var items = mousemoveAbleItems[i];
				INNER:
				for(var j in items){
					var item = items[j];
					if(x > item.x && x < item.ex && y > item.y && y < item.ey){
						item.mousemove(event,x,y);
						//break OUTER;
						return ;
					}
				}
			}
			scene.click(event,x,y);
		}
	})
	Game.reg('defaultEventHandle',Game.util.DefaultEventHandle);
	
	//对话框的事件分发
	Game.util.DialogBlankEventHandle = Game.extend(Game.util.EventHandle,{
		className:'Game.util.DialogBlankEventFire',
		click:function(event,container,x,y){
			// do nothing
		},
		mousemove:function(event,container,x,y){
			// do nothing
		}
	})
	Game.reg('dialogBlankEventHandle',Game.util.DialogBlankEventHandle);
	
	//游戏返回退出事件分发
	Game.util.GameToolbarEventFire = Game.extend(Game.util.EventHandle,{
		className:'Game.util.GameToolbarEventHandle',
		click:function(event,scene,x,y){
			if(y < 40){
				if(x > scene.width - 40){
					var scene = Game.getCmp('timer-container-draw').scene;
					Game.getCmp('timer-container-draw').changeContainer(Game.getCmp('deskTop-1'));
					Game.getCmp('deskTop-1').changeEventHandle(Game.getCmp('deskTopEventFire-1'));
					Game.getCmp('gameToolbar-1').playState = true;
					Game.getCmp('gameToolbar-1').hide();
					scene.destroy();
					return true;
				}else if(x > scene.width - 80){
					Game.getCmp('gameToolbar-1').playOrPause();
					return true;
				}else if(x > scene.width - 120){
					Game.getCmp('gameToolbar-1').playState = false;
					Game.getCmp('timer-container-draw').scene.pause();
					Game.getCmp('timer-container-draw').changeContainer(Game.getCmp('deskTop-1'));
					Game.getCmp('deskTop-1').changeEventHandle(Game.getCmp('deskTopEventFire-1'));
					Game.getCmp('gameToolbar-1').hide();
					return true;
				}
			}
			return false;
		}
	})
	Game.reg('gameToolbarEventHandle',Game.util.GameToolbarEventHandle);
	
	//加载能够加载对象帮助工具
	Game.util.SourceLoader = Game.extend({
		itemArray:[],
		loadIndex:0,
		itemSize:0,
		progress:0,
		currentInitSize:0,
		className:'Game.util.SourceLoader',
		load:function(){
			if(this.itemSize == this.currentInitSize){
				for(var i =0;i < this.currentInitSize;i++){
					this.itemArray[i].doLoad();
					delete this.itemArray[i];
				}
				this.itemArray.length = 0;
				this.currentInitSize = 0;
				this.itemSize = 0;
				this.onLoad();
			}else{
				this.progress = parseInt((this.currentInitSize/this.itemSize)*100)
			}
			//Game.log('loader progress:'+this.progress+'%');
		},
		onLoad:function(){},
		addItem:function(item){
			item['loader'] = this;
			item.initSource();
			this.onAddItem(item);
		},
		onAddItem:function(item){},
		addLoadedItem:function(item){
			this.itemArray[this.currentInitSize++] = item;
			this.load();
		}
	})
	Game.reg('sourceLoader',Game.util.SourceLoader);
	
	//加载图像的Loader，加入场景组建后，貌似暂时用不到了
	Game.util.ImageLoader = Game.extend(Game.util.SourceLoader,{
		className:'Game.util.ImageLoader'
	})
	Game.reg('imageLoader',Game.util.ImageLoader);
	
	//任何源，能够加载的对象都属于source
	Game.util.Source = Game.extend({
		loaded:false,
		className:'Game.util.Source',
		load:function(){
			this.loader.addLoadedItem(this);
		},
		doLoad:function(){this.onLoad();},
		onLoad:function(){},
		initSource:function(){
			this.create();
			var that = this;
			this.dom.onload = function(){
				that.loaded = true;
				that.load(this);
			}
		},
		create:function(){},
	})
	Game.reg('source',Game.util.Source);
	
	//Javascript载体
	Game.util.Javascript = Game.extend(Game.util.Source,{
		className:'Game.util.Javascript',
		cache:false,
		create:function(){
			this.dom = document.createElement('script');
			this.dom.src = this.src+(this.cache?'':'?r='+Date.now());
			this.dom.type = "text/javascript";
			document.getElementsByTagName('head')[0].appendChild(this.dom);
		},
		onLoad:function(){
			//do nothing
		}	
	})
	Game.reg('js',Game.util.Javascript);
	
	//可绘画的
	Game.ui.DrawAble = Game.extend({
		showed:false,
		clickLevel:1,
		mousemoveLevel:1,
		click:function(event,x,y){
			this.onClick(event,x,y);
		},
		onClick:function(event,x,y){},
		mousemove:function(event,x,y){
			this.onMousemove(event,x,y);
		},
		onMousemove:function(event,x,y){},
		hide:function(){
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
		onHide:function(){},
		show:function(){
			if(!this.showed){
				this.beforeShow();
				this.ex = this.x+this.renderWidth;
				this.ey = this.y+this.renderHeight;
				this.scene.addLevelItem(this);
				this.scene.container.addAnimateItem(this);
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
		},
		beforeShow:function(){},
		onShow:function(){},
		destroy:function(){
			this.scene.removeLevelItem(this);
			this.scene.container.removeAnimateItem(this);
			if(this.clickAble){
				this.scene.removeClickAbleItem(this)
			}
			if(this.mousemoveAble){
				this.scene.removeClickAbleItem(this)
			}
			delete Game.comps[this.id];
			this.onDestroy();
		}
	});
	
	//可动画的
	Game.ui.AnimateAble = Game.extend(Game.ui.DrawAble,{
		className:'Game.ui.AnimateAble',
		_showAnimate:false,
		showAnimate:false,
		autoShow:true,
		doAnimate:function(){
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
		beforeAnimate:function(){},
		animate:function(){
			this.beforeAnimate();
			this.onAnimate();
		},
		changeEpos:function(){
			this.ex = this.x+this.renderWidth;
			this.ey = this.y+this.renderHeight;
		},
		onAnimate:function(){},
		onStopAnimate:function(){},
		startAnimate:function(){
			if(!this.started){
				this.showAnimate = true;
				this._showAnimate = true;
				this.lastPast = Date.now();
				this.paused = false;
				this.started = true;
			}
		},
		stopAnimate:function(){
			this.beforeStopAnimate();
			this.showAnimate = false;
			this._showAnimate = false;
			this.started = false;
			this.onStopAnimate();
		},
		beforeStopAnimate:function(){},
		pause:function(){
			if(!this.paused){
				this.pauseTime = Date.now();
				this.showAnimate = false;
				this.paused = true;
			}
		},
		play:function(){
			this.showAnimate = this._showAnimate;
			this.paused = false;
		},
		render:function(ctx){}
	})
	Game.reg('animateAble',Game.ui.AnimateAble);
	
	//Image对象用于承载DOM中的IMG
	Game.ui.Image = Game.extend(Game.util.Source,{
		level:1,
		x:0,
		y:0,
		rotate:0,
		cache:false,
		autoShow:true,
		sx:0,
		sy:0,
		className:'Game.ui.Image',
		create:function(){
			this.dom = new Image();
			this.dom.src = this.src+(this.cache?'':'?r='+Date.now());
		},
		doLoad:function(){
			this.width = this.dom.naturalWidth;
			this.height = this.dom.naturalHeight;
			this.onLoad();
			if(this.autoShow){
				this.show();
			}
		},
		render:function(ctx){
			this.beforeRender(ctx);
			ctx.drawImage(this.dom,this.sx,this.sy,this.width,this.height,this.x,this.y,this.renderWidth,this.renderHeight);
			this.onRender(ctx);
		},
		beforeRender:function(ctx){},
		onRender:function(ctx){}
	})
	Game.ui.Image = Game.extend(Game.ui.AnimateAble,new Game.ui.Image());
	Game.reg('image',Game.ui.Image);
	
	//复杂的Image
	Game.ui.MixImage = Game.extend(Game.ui.AnimateAble,{
		level:1,
		sx:0,
		sy:0,
		flash:true,
		autoShow:true,
		imgInterval:0,
		currentImgIndex:0,
		onInit:function(){},
		currentImgInterval:0,
		className:'Game.ui.MixImage',
		init:function(){
			this.dom = this.images[this.currentImgIndex++];
			if(this.images.length == 1){
				this.flash = false;
				this.currentImgIndex = 0;
			}
			this.onInit();
			if(this.autoShow){
				this.show();
			}
		},
		animate:function(){
			this.beforeAnimate();
			if(this.flash){
				if(this.imgInterval == 0){
					this.dom = this.images[this.currentImgIndex++];
					if(this.currentImgIndex == this.images.length){
						this.currentImgIndex = 0;
					}
				}else{
					this.currentImgInterval++;
					if(this.currentImgInterval == this.imgInterval){
						this.currentImgInterval = 0;
						this.dom = this.images[this.currentImgIndex++];
						if(this.currentImgIndex == this.images.length){
							this.currentImgIndex = 0;
						}
					}
				}
			}
			this.onAnimate();
		},
		beforeStopAnimate:function(){
			this.dom = this.images[0];
		},
		beforeRender:function(ctx){},
		render:function(ctx){
			this.beforeRender(ctx);
			ctx.drawImage(this.dom.dom,this.sx,this.sy,this.dom.width,this.dom.height,this.x,this.y,this.renderWidth,this.renderHeight);
			this.onRender(ctx);
		},
		onRender:function(ctx){}
	})
	Game.reg('mixImage',Game.ui.MixImage);
	
	//桌面上的文字
	Game.ui.Text = Game.extend(Game.ui.DrawAble,{
		font:'20px sans-serif',
		textAlign:'left',
		textBaseline:'top',
		strokeStyle:'rgba(20,20,20,1)',
		className:'Game.ui.Text',
		fillStyle:'rgba(20,20,20,1)',
		fill:true,
		render:function(ctx){
			ctx.textAlign=this.textAlign;
			ctx.textBaseline=this.textBaseline;
			ctx.font = this.font;
			if(this.fill){
				ctx.fillStyle=this.fillStyle;
				ctx.fillText(this.text,this.x,this.y);
			}else{
				ctx.strokeStyle=this.stokeStyle;
				ctx.strokeText(this.text,this.x,this.y);
			}
		},
		pause:function(){},
		play:function(){},
		beforeShow:function(){
			var size = parseInt(this.font);
			this.renderHeight = size;
			this.renderWidth = size*this.text.length/2;
		}
	})
	Game.reg('text',Game.ui.Text);
	
	//下面是一些插件
	
	//桌面初始化时候的Loading图案
	Game.ui.Loading = Game.extend(Game.ui.AnimateAble,{
		level:1,
		per:96,
		className:'Game.ui.Loading',
		_showAnimate:true,
		showAnimate:true,
		autoAnimate:true,
		circleNum:8,
		progressFont:'10px sans-serif',
		progressFillStyle:'rgb(20,20,20)',
		progressTextAlign:'center',
		beforeRender:function(ctx){
			ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
			ctx.fillRect(0,0,this.scene.width, this.scene.height);
		},
		setFillStyle:function(ctx,i){
			ctx.fillStyle = 'rgb('+(255-30*i)+',255,'+(247+i)+')';
		},
		arc:function(ctx,i){
			ctx.arc(0,35,4+i*0.5,0,Math.PI*2,true);
		},
		beforeShow:function(){
			this.onStopAnimate();
		},
		onHide:function(){
			this.scene.container.removeAnimateItem(this);
		},
		renderProgress:function(ctx){
			ctx.fillStyle=this.progressFillStyle;
			ctx.textAlign=this.progressTextAlign;
			ctx.font = this.progressFont;
			ctx.textBaseline = 'middle';
			ctx.fillText(this.scene.container.loader.progress+'%',0,0);
		},
		render:function(ctx){
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
		onRender:function(){},
		onAnimate:function(){
			if(this.rotate == this.maxRotate){
				this.rotate = 0;
			}else{
				this.rotate+=this.rotateRate;
			}
		},
		onStopAnimate:function(){
			this.transWidth = this.scene.width/2;
			this.transHeight = this.scene.height/2;
			this.rotate = 0;
			this.rotateRate = 360 / this.circleNum;
			this.maxRotate = 360-this.rotateRate;
		},
		onDestroy:function(){
			this.stopAnimate();
			this.hide();
		}
	})
	Game.reg('loading',Game.ui.Loading);
	
	//桌面初始化时候的BoxBootLoading图案
	Game.ui.BoxBootLogoLoading = Game.extend(Game.ui.Loading,{
		className:'Game.ui.BoxBootLogoLoading',
		beforeRender:function(ctx){
			ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			ctx.fillRect(0,0,this.scene.width, this.scene.height);
			this.dom.render(ctx);
		},
		setFillStyle:function(ctx,i){
			ctx.fillStyle = 'rgb('+(255-5*i)+',255,'+(247+i)+')';
		},
		arc:function(ctx,i){
			ctx.arc(0,20,1+i*0.3,0,Math.PI*2,true);
		},
		onStopAnimate:function(){
			this.transWidth = this.scene.width/2;
			this.transHeight = this.dom.y + this.dom.renderHeight + 10;
			this.rotate = 0;
			this.rotateRate = 360 / this.circleNum;
			this.maxRotate = 360-this.rotateRate;
		}
	})
	Game.reg('boxBootLogoLoading',Game.ui.BoxBootLogoLoading);
	
	//桌面第一次显示的渐显画面
	Game.ui.AlphaShow = Game.extend(Game.ui.AnimateAble,{
		alpha:1,
		level:2,
		per:50,
		rgb:'0, 0, 0',
		cut:5,
		_alpha:100,
		className:'Game.ui.AlphaShow',
		render:function(ctx){
			ctx.fillStyle = 'rgba('+this.rgb+', '+this.alpha+')';
			ctx.fillRect(0,0,this.scene.width, this.scene.height);
		},
		onAnimate:function(){
			if(this.alpha < 0){
				this.stopAnimate();
			}else{
				this.alpha = (this._alpha-=this.cut)/100;
				this.scene.changed = true;
			}
		},
		stopAnimate:function(){
			this.hide();
			this.destroy();
		},
		beforeShow:function(){
			this.startAnimate();
		}
	})
	Game.reg('alphaShow',Game.ui.AlphaShow);
	
	//桌面上的背景
	Game.ui.Background = Game.extend(Game.ui.Image,{
		level:0,
		clickLevel:0,
		mousemoveLevel:0,
		clickAble:true,
		mousemoveAble:true,
		className:'Game.ui.Background',
		onLoad:function(ctx){
			this.renderHeight = this.scene.height;
			this.renderWidth = this.scene.width;
		},
		onClick:function(event,x,y){
			this.scene.click(event,x,y);
		},
		onMousemove:function(event,x,y){
			this.scene.mousemove(event,x,y);
		}
	})
	Game.reg('bg',Game.ui.Background);
	
	//BoxBootLogo
	Game.ui.PopLogo = Game.extend(Game.ui.Image,{
		className:'Game.ui.PopLogo',
		renderHeight:300,
		renderWidth:300,
		onLoad:function(ctx){
			this.x = this.scene.width/2-150;
			this.y = this.scene.height/2-this.scene.height/10-200;
		}
	})
	Game.reg('popLogo',Game.ui.PopLogo);
	
	//需要调整的，或者被废弃掉
	
	//启动器，用于启动游戏
	Game.util.Starter = Game.extend({
		className:'Game.util.Starter',
		startGame:function(canvas){
			var subJs = this.subJs;
			if(!Game.getCmp(subJs[0])){
				var imageLoader = Game.create('imageLoader',{});
				imageLoader.itemSize = subJs.length;
				var that = this;
				imageLoader.onLoad = function(){
					that.create(this,canvas);
				}
				for(var i in subJs){
					imageLoader.addItem(Game.create('js',{src:subJs[i],id:subJs[i]}));
				}
			}else{
				if(Game.getCmp(this.containerId)){
					var container = Game.getCmp(this.containerId);
					container.changeEventFire(Game.getCmp(this.defaultEventFireId));
					Game.getCmp('timer-container-draw').changeContainer(container);
					container.play();
					Game.getCmp('gameToolbar-1').container = container;
					Game.getCmp('gameToolbar-1').show();
				}else{
					this.create(Game.create('imageLoader'),canvas);
				}
			}
		},
		create:function(loader){}
	})
	Game.reg('starter',Game.util.Starter);
	
	//游戏界面的返回、退出按钮
	Game.ui.GameToolbar = Game.extend(Game.ui.MixImage,{
		className:'Game.ui.GameToolbar',
		level:9,y:0,
		renderWidth:40,
		renderHeight:40,
		playState:true,
		_playState:true,
		paused:false,
		autoShow:false,
		beforeShow:function(){
			this.x0 = this.scene.width - 3*40;
			this.x1 = this.scene.width - 2*40;
			this.x2 = this.scene.width - 1*40;
		},
		render:function(ctx){
			var img = this.images[0];
			ctx.drawImage(img.dom,0,0,img.width,img.height,this.x0,this.y,this.renderWidth,this.renderHeight);
			img = this.playState ? this.images[1] : this.images[2];
			ctx.drawImage(img.dom,0,0,img.width,img.height,this.x1,this.y,this.renderWidth,this.renderHeight);
			img = this.images[3];
			ctx.drawImage(img.dom,0,0,img.width,img.height,this.x2,this.y,this.renderWidth,this.renderHeight);
		},
		pause:function(){},
		play:function(){},
		playOrPause:function(){
			if(this.playState){
				this.playState = false;
				Game.getCmp('timer-container-draw').container.pause();
			}else{
				this.playState = true;
				Game.getCmp('timer-container-draw').container.play();
			}
			Game.getCmp('timer-container-draw').container.changed = true;
		},
		startPlay:function(){
			if(this.paused){
				if(this._playState){
					this.playState = true;
					Game.getCmp('timer-container-draw').container.play();
					Game.getCmp('timer-container-draw').container.changed = true;
				}
				this.paused = false;
			}
		},
		startPause:function(){
			if(!this.paused){
				this._playState = this.playState;
				this.playState = false;
				Game.getCmp('timer-container-draw').container.pause();
				Game.getCmp('timer-container-draw').container.changed = true;
				this.paused = true;
			}
		}
	})
	Game.reg('gameToolbar',Game.ui.GameToolbar);
	
	//基础对象- - - - - - - - - - - - - - - - - - - - - - - - - - -

	//所有的定时任务
	Game.timers = Game.timers || Game.create('map');
	
	//image loader
	Game.create('imageLoader',{id:'imageLoader-1',itemSize:1});
	
	//默认的事件处理
	Game.create('defaultEventHandle',{id:'defaultEventHandle-1'});
	
	//主控制器
	Game.create('container',{id:'container-1',loader:Game.getCmp('imageLoader-1')});
	
	//主要定时任务监视器，根据系统性能每隔一定重绘桌面
	Game.create('timer',{
		millisecond:15,
		id:'timer-container-draw',
		method:function(){
			this.container.drawContainer();
		},
		onStart:function(){
			this.container.lastFrameTime = Date.now();
		},
		changeContainer:function(container){
			this.container = container;
			Game.getCmp('timer-container-renderFrame').container = container;
		}
	});
	
	//主要定时任务监视器，每隔1000毫秒计算帧率
	Game.create('timer',{
		millisecond:1000,
		id:'timer-container-renderFrame',
		method:function(){
			this.container.lastFrame = this.container.frame;
			this.container.frame = 0;
			this.container.scene.changed = true;
		}
	});
	
	//载入container
	Game.getCmp('timer-container-draw').changeContainer(Game.getCmp('container-1'));
	
	//默认的EventFire
	Game.create('eventFire',{id:'eventFire-1'});
	
	//Logo
	Game.create('popLogo',{autoShow:false,src:'img/PopCap_Logo.jpg',id:'popLogo-1',cache:true});
	
	//Logo加载动画
	Game.create('boxBootLogoLoading',{id:'box-boot-loading-1',showAnimate:true,dom:Game.getCmp('popLogo-1')});
	Game.getCmp('box-boot-loading-1').progressFillStyle='rgb(255,255,255)';
	
	//Dialog
	Game.create('dialogBlankEventHandle',{id:'dialogBlankEventHandle-1'});
	
	//游戏界面的返回、退出按钮
	Game.create('image',{id:'image-toolbar-back',src:'img/mini.png',autoShow:false,cache:true});
	Game.create('image',{id:'image-toolbar-close',src:'img/close.png',autoShow:false,cache:true});
	Game.create('image',{id:'image-toolbar-pause',src:'img/pause.png',autoShow:false,cache:true});
	Game.create('image',{id:'image-toolbar-play',src:'img/play.png',autoShow:false,cache:true});
	Game.create('gameToolbar',{
		id:'gameToolbar-1',
		images:[
			Game.getCmp('image-toolbar-back'),
			Game.getCmp('image-toolbar-pause'),
			Game.getCmp('image-toolbar-play'),
			Game.getCmp('image-toolbar-close')
		],
		destroy:function(){}
	});
	
	//游戏返回退出事件分发
	Game.create('gameToolbarEventHandle',{id:'gameToolbarEventHandle-1'});
	
	// 全局事件，应由使用者控制
	
	//window全局事件注册
	window.onblur = function(){
		//Game.getCmp('timer-container-draw').pause();
		//Game.getCmp('timer-pvz-conch-create').pause();
	}
	window.onfocus = function(){
		//Game.getCmp('timer-container-draw').play();
		//Game.getCmp('timer-pvz-conch-create').play();
	}
	
	
})(window.Game)