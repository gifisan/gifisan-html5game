//主窗体
Game.ui.DeskTop = Game.extend(Game.ui.Scene,{
	className:'Game.ui.DeskTop',
	iconHeight:0,	itemsArray:[],		marginTop:40,		xIndex:0,	paddingY:60,
	marginLeft:40,		marginBottom:240,	paddingX:40,	yIndex:0,
	removeText:function(){
		if(this.focusItem && this.focusItem.xtype == 'icon'){
			this.focusItem.stopAnimate();
			this.textTitle.hide();
			this.textUrl.hide();
			this.focusItem = null;
		}
	},
	onClick:function(){
		this.removeText();
	},
	createScene:function(){
		this.textTitle = Game.create('text',{scene:this,id:'text',x:40,level:1,fill:true,y:this.height-60});
		this.textUrl = Game.create('text',{clickAble:true,scene:this,id:'text-2',x:160,level:1,fill:true,y:this.height-60,
			onClick:function(){
				this.scene.removeText();
				window.open(this.text)
			}
		});
	}
})
Game.reg('deskTop',Game.ui.DeskTop);

//MyInfo的事件分发
Game.util.MyInfoEventHandle = Game.extend(Game.util.EventHandle,{
	className:'Game.util.MyInfoEventHandle',
	click:function(event,x,y){
		var myinfo = Game.getCmp('myinfo');
		if(myinfo.showAnimate){
			return;
		}
		if(x <myinfo.bx || x>myinfo.ex || y<myinfo.by || y>myinfo.ey){
			Game.getCmp('myinfo').hide();
			this.scene.changeEventHandle(Game.getCmp('defaultEventHandle'));
		}
	}
})
Game.reg('myInfoEventHandle',Game.util.MyInfoEventHandle);

//桌面上的ICON
Game.ui.Icon = Game.extend(Game.ui.ImageHolder,{
	per:15,
	rotate:0,
	moveAble:false,
	clickAble:true,
	className:'Game.ui.Icon',
	beforeRender:function(ctx){
		if(this.scene.focusItem === this){
			this.createBox(ctx);
			if(!this.tranWidth){
				this.tranWidth = this.bx+this.renderWidth/2;
				this.tranHeight = this.by+this.renderHeight/2;
			}
			ctx.save();
			ctx.translate(this.tranWidth,this.tranHeight);
			ctx.rotate(this.rotate*Math.PI/180);
			this.bx = -this.renderWidth/2;
			this.by = -this.renderHeight/2;
		}
	},
	onRender:function(ctx){
		if(this.scene.focusItem === this){
			ctx.restore();
			this.bx = this._x;
			this.by = this._y;
		}
		ctx.font="16px sans-serif";
		ctx.textAlign="center";
		ctx.textBaseline="top";
		ctx.strokeStyle="rgba(20,20,20,0.6)";
		ctx.strokeText(this.name,this._x+this.renderWidth/2,this._y+this.renderHeight+13);
		var array = this.scene.itemsArray;
		if(!array[this.xIndex]){
			array[this.xIndex] = [];
		}
		array[this.xIndex][this.yIndex] = this;
	},
	onClick:function(event,x,y){
		if(this.scene.focusItem != this){
			this.scene.removeText();
			this.scene.focusItem = this;
			this.startAnimate();
			this.showDescription();
		}
	},
	showDescription:function(ctx){
		this.scene.textTitle.text = this.name;
		this.scene.textUrl.text = this.url;
		this.scene.textTitle.show();
		this.scene.textUrl.show();
	},
	beforeInit:function(){
		this.img = Game.getCmp(this.src);
	},
	onInit:function(){
		this._x = this.bx;
		this._y = this.by;
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
		this.bx = this._x;
		this.by = this._y;
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
Game.ui.Bottom = Game.extend(Game.ui.ImageHolder,{
	rate:0.8,
	x:900,
	y:587,
	per:192,
	clickAble:true,
	autoAnimate:true,
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
	onInit:function(){
		this._y1 = this.y;
		this._y2 = this.y+2*this.scene.yrate;
		this.lineY = this.y-5*this.scene.yrate;
	},
	onAnimate:function(){
		this.y = this.y == this._y1 ? this._y2 : this._y1;
	},
	onClick:function(event,x,y){
		this.scene.removeText();
		Game.getCmp('myinfo').show();
		this.scene.changeEventHandle(Game.getCmp('myinfo').myInfoEventHandle)
	}
})
Game.reg('bottom',Game.ui.Bottom);

//我的信息
Game.ui.MyInfo = Game.extend(Game.ui.ImageHolder,{
	per:16,
	level:2,
	yrate:0.4,
	xrate:0.4,
	moveAble:false,
	autoAnimate:true,
	className:'Game.ui.MyInfo',
	onRender:function(ctx){
		if(this.renderHeight >= this.maxRenderHeight){
			ctx.font="24px sans-serif";
			ctx.textAlign="left";
			ctx.textBaseline="top";
			ctx.fillStyle="rgb(20,20,20)";
			ctx.fillText('姓名：王凯',this.bx+30,this.by+60);
			ctx.fillText('现就职于：上海市博科资讯股份有限公司',this.bx+30,this.by+100);
			ctx.fillText('我的邮箱：wangkaishopping@163.com',this.bx+30,this.by+140);
			ctx.fillText('欢迎来信讨论技术方面（Java或Javascript）的问题',this.bx+30,this.by+180);
		}
	},
	onAnimate:function(){
		if(this.renderHeight > this.maxRenderHeight){
			this.stopAnimate();
		}else{
			this.renderHeight += 10;
			this.by-=5;
		}
	},
	onHide:function(){
		this.bx = (this.scene.width - this.renderWidth)/2;
		this.by = 0.7 * this.maxRenderHeight;
		this.renderHeight = 0;
	},
	beforeShow:function(){
		this.bx = (this.scene.width - this.renderWidth)/2;
		this.maxRenderHeight = this.frameHeight * this.yrate * this.scene.yrate;
		this.by = 0.7 * this.maxRenderHeight;
		this.renderHeight = 0;
		
	},
	beforeRender:function(ctx){
		ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(0,0,this.scene.width,this.scene.height);
	},
	changeEpos:function(){
		this.ex = this.bx + this.renderWidth;
		this.ey = this.by + this.maxRenderHeight;
	}
})
Game.reg('myinfo',Game.ui.MyInfo);