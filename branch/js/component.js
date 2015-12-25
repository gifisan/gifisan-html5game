//主窗体
Game.ui.DeskTop = Game.extend(Game.ui.Scene,{
	className:'Game.ui.DeskTop',
	iconHeight:0,	itemsArray:[],		marginTop:40,		xIndex:0,	paddingY:60,
	marginLeft:40,		marginBottom:240,	paddingX:40,	yIndex:0,
	removeText:function(){
		if(this.focusItem && this.focusItem.xtype == 'icon'){
			this.removeLevelItem(Game.getCmp('text-1'));
			this.removeLevelItem(Game.getCmp('text-2'));
			Game.getCmp('text-1').hide();
			Game.getCmp('text-2').hide();
			this.focusItem.stopAnimate();
			this.focusItem = null;
		}
	},
	onClick:function(){
		this.removeText();
	}
})
Game.reg('deskTop',Game.ui.DeskTop);

//MyInfo的事件分发
Game.util.MyInfoEventHandle = Game.extend(Game.util.EventHandle,{
	className:'Game.util.MyInfoEventHandle',
	click:function(event,scene,x,y){
		var myinfo = Game.getCmp('myinfo-1');
		if(x<myinfo.x || x>myinfo.x+myinfo.renderWidth || y<myinfo.y || y>myinfo.y+myinfo.renderHeight){
			Game.getCmp('myinfo-1').hide();
			scene.changeEventHandle(Game.getCmp('defaultEventHandle-1'));
		}
	}
})
Game.reg('myInfoEventHandle',Game.util.MyInfoEventHandle);

//桌面上的ICON
Game.ui.Icon = Game.extend(Game.ui.Image,{
	renderWidth:64,
	renderHeight:64,
	per:16,
	clickAble:true,
	className:'Game.ui.Icon',
	beforeRender:function(ctx){
		if(this.scene.focusItem === this){
			this.createBox(ctx);
			if(!this.tranWidth){
				this.tranWidth = this.x+this.renderWidth/2;
				this.tranHeight = this.y+this.renderHeight/2;
				this.rx = -this.renderWidth/2;
				this.ry = -this.renderHeight/2;
			}
			this.x = this.rx;
			this.y = this.ry;
			ctx.save();
			ctx.translate(this.tranWidth,this.tranHeight);
			ctx.rotate(this.rotate*Math.PI/180);
		}
	},
	onRender:function(ctx){
		if(this.scene.focusItem === this){
			ctx.restore();
			this.x = this._x;
			this.y = this._y;
		}
		ctx.font="16px sans-serif";
		ctx.textAlign="center";
		ctx.textBaseline="top";
		ctx.strokeStyle="rgba(20,20,20,0.6)";
		ctx.strokeText(this.name,this.x+34,this.y+75);
		var array = this.scene.itemsArray;
		if(!array[this.xIndex]){
			array[this.xIndex] = [];
		}
		array[this.xIndex][this.yIndex] = this;
	},
	onClick:function(event,scene,x,y){
		if(this.scene.focusItem != this){
			this.scene.removeText();
			this.scene.focusItem = this;
			this.startAnimate();
			this.showDescription();
		}
	},
	showDescription:function(){
		Game.create('text',{scene:this.scene,text:this.name,id:'text-1',x:40,level:1,fill:true,y:this.scene.height-40}).show();
		Game.create('text',{clickAble:true,scene:this.scene,
			text:this.url,id:'text-2',x:160,level:1,fill:true,y:this.scene.height-40,
			onClick:function(){
				this.scene.removeText();
				window.open(this.text)
			}
		}).show();
	},
	calcItemXY:function(){
		var scene = this.scene;
		if(!scene.iconWidth){
			scene.iconWidth = scene.paddingX+this.renderWidth;
			scene.iconHeight = scene.paddingY+this.renderHeight;
			scene.iconMaxY = scene.height-scene.marginBottom+scene.iconHeight+40;
			scene.scaleX = this.renderWidth/scene.iconWidth;
			scene.scaleY = (this.renderHeight+24)/scene.iconHeight;
		}
		var x = scene.xIndex*scene.iconWidth+scene.marginLeft;
		var y = scene.yIndex*scene.iconHeight+scene.marginTop;
		Game.apply(this,{x:x,y:y,_x:x,_y:y,xIndex:scene.xIndex,yIndex:scene.yIndex});
		if(scene.height - y - scene.iconHeight < scene.marginBottom){
			scene.yIndex = 0;
			scene.xIndex++;
		}else{
			scene.yIndex++;
		}
	},
	onAnimate:function(){
		if(this.rotate == 358){
			this.rotate = 0;
		}else{
			this.rotate+=2;
		}
	},
	onStopAnimate:function(){
		this.rotate = 0;
		this.x = this._x;
		this.y = this._y;
	},
	onLoad:function(){
		this.calcItemXY();
	},
	createBox:function(ctx){
		ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(this._x-6, this._y-6,77, 102);
	},
	changeEpos:function(){/*override*/},
	onShow:function(){
		this.ey += 28;
	}
})
Game.reg('icon',Game.ui.Icon);

//桌面的底部
Game.ui.Bottom = Game.extend(Game.ui.Image,{
	renderWidth:50,
	renderHeight:50,
	autoAnimate:true,
	clickAble:true,
	per:192,
	className:'Game.ui.Bottom',
	onRender:function(ctx){
		ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, this.lineY, this.scene.width, 60);
		ctx.strokeStyle = 'rgba(20, 20, 20, 0.2)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0,this.lineY);
		ctx.lineTo(this.scene.width,this.lineY);
		ctx.stroke();
	},
	onLoad:function(){
		this.x = this.scene.width - 55;
		this.y = this.scene.height - 55;
		this._y1 = this.y;
		this._y2 = this.y+2;
		this.lineY = this.y-5;
	},
	onAnimate:function(){
		this.y = this.y == this._y1 ? this._y2 : this._y1;
	},
	onClick:function(event,ctx,x,y){
		this.scene.removeText();
		var myinfo = Game.getCmp('myinfo-1');
		if(myinfo == null){
			var loading = Game.create('loading',{scene:this.scene});
			loading.show();
			myinfo = Game.create('myinfo',{src:'img/bg1.jpg',id:'myinfo-1',scene:this.scene});
			this.scene.changeEventHandle(Game.getCmp('dialogBlankEventHandle-1'));
			var loader = this.scene.container.loader;
			loader.itemSize = 1;
			loader.addItem(myinfo);
			loader.onLoad = function(event){
				loading.destroy();
				myinfo.scene.changeEventHandle(Game.create('myInfoEventHandle',{id:'myInfoEventHandle-1'}));
			}
		}else{
			myinfo.show();
			this.scene.changeEventHandle(Game.getCmp('myInfoEventHandle-1'));
		}
	}
})
Game.reg('bottom',Game.ui.Bottom);

//我的信息
Game.ui.MyInfo = Game.extend(Game.ui.Image,{
	level:2,renderWidth:600,
	className:'Game.ui.MyInfo',
	autoAnimate:true,
	per:16,
	onRender:function(ctx){
		if(this.renderHeight === 400){
			ctx.font="24px sans-serif";
			ctx.textAlign="left";
			ctx.textBaseline="top";
			ctx.fillStyle="rgb(20,20,20)";
			ctx.fillText('姓名：王凯',this.x+30,this.y+60);
			ctx.fillText('现就职于：上海市博科资讯股份有限公司',this.x+30,this.y+100);
			ctx.fillText('我的邮箱：wangkaishopping@163.com',this.x+30,this.y+140);
			ctx.fillText('欢迎来信讨论技术方面（Java或Javascript）的问题',this.x+30,this.y+180);
		}
	},
	onAnimate:function(){
		if(this.renderHeight == 400){
			this.stopAnimate();
		}else{
			this.renderHeight += 10;
			this.y-=5;
		}
	},
	onHide:function(){
		this.x = (this.scene.width-600)/2;
		this.y = this.scene.height/2-this.scene.height/8;
		this.renderHeight = 0;
	},
	beforeShow:function(){
		this.x = (this.scene.width-600)/2;
		this.y = this.scene.height/2-this.scene.height/8;
		this.renderHeight = 0;
	},
	beforeRender:function(ctx){
		ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(0,0,this.scene.width,this.scene.height);
	}
})
Game.reg('myinfo',Game.ui.MyInfo);