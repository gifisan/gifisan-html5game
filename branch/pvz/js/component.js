//主窗体
Game.ui.PVZScene = Game.extend(Game.ui.Scene,{
	className:'Game.ui.PVZScene',
	createScene:function(){
		this.height=document.body.scrollHeight;
		this.width=document.body.clientWidth;
		//this.yRate = this.height / 600;
		this.xRate = this.width / 1229;
		this.marginLeft = parseInt(252*this.xRate);
		this.marginTop = parseInt(92*this.xRate);
		this.marginRight = this.width - parseInt(230*this.xRate);
		this.marginBottom = this.height - parseInt(92*this.xRate);
		this.itemArray = [];
		this.monsters = {};
	},
	removeFocusRoad:function(){
		if(this.focusRoad){
			this.focusRoad.removeFocus();
		}
		this.focusRoad = null;
	},
	removeLastMoveItem:function(){
		if(this.lastMoveItem){
			this.lastMoveItem = null;
			this.changed = true;
		}
	},
	createTower:function(xIndex,yIndex){
		this.removeFocusRoad();
		Game.create('tower',{xIndex:xIndex,yIndex:yIndex,scene:this,images:[Game.getCmp('huojian-1')],towerRange:Game.getCmp('towerRange-1')});
	},
	createConch:function(road){
		Game.create('conch',{scene:this,xIndex:8,yIndex:3,road:road,images:[Game.getCmp('conch1-1'),Game.getCmp('conch2-1')]});
	},
	onClick:function(event,x,y){
		this.removeFocusRoad();
	},
	onMousemove:function(event,x,y){
		this.removeLastMoveItem();
	}
})
Game.reg('pvzScene',Game.ui.PVZScene);

//Range
Game.ui.Range = Game.extend(Game.ui.AnimateAble,{
	level:7,
	added:false,
	className:'Game.ui.Range',
	render:function(ctx){
		ctx.fillStyle = 'rgba(255, 255, 255,0.3)';
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,Math.PI*2,true);
		ctx.fill();
		this.onRender(ctx);
	}
})
Game.reg('range',Game.ui.Range);

//RoadRange
Game.ui.RoadRange = Game.extend(Game.ui.Range,{
	className:'Game.ui.RoadRange',
	onRender:function(ctx){
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'rgb(255, 255, 0)';
        ctx.fillRect(this.x - 45,this.y - 15,90,30);
		ctx.textAlign = 'center',
		ctx.fillStyle = 'rgb(20,20,20)';
		ctx.fillText('创建炮塔',this.x,this.y-8);
	}
})
Game.reg('roadRange',Game.ui.RoadRange);

//TowerRange
Game.ui.TowerRange = Game.extend(Game.ui.Range,{
	className:'Game.ui.TowerRange',
	onRender:function(ctx){}
})
Game.reg('towerRange',Game.ui.TowerRange);

//道路
Game.ui.Road = Game.extend(Game.ui.MixImage,{
	clickAble:true,
	mousemoveAble:true,
	flash:false,
	className:'Game.ui.Road',
	onClick:function(event,x,y){
		if(this.tower){
			this.scene.removeFocusRoad();
			this.scene.focusRoad = this;
			return this.tower.click(event,x,y);
		}
		if(this.scene.focusRoad == this && x > this.tranWidth - 45 && x < this.tranWidth+45 && y > this.tranHeight-15 && y < this.tranHeight+15){
			return this.scene.createTower(this.xIndex,this.yIndex);
		}
		if(this.scene.focusRoad != this){
			this.scene.removeFocusRoad();
			if(this.tower){
				this.tower.showRange();
			}else{
				this.showRange();
			}
			this.scene.focusRoad = this;
		}
	},
	onMousemove:function(event,x,y){
		this.scene.lastMoveItem = this;
		this.scene.changed = true;
	},
	beforeShow:function(){
		var rate = this.scene.rate;
		this.level = 1;
		this.renderWidth = parseInt(83*this.scene.xRate);
		this.renderHeight = parseInt(83*this.scene.xRate);
		this.x = this.scene.marginLeft+this.renderWidth*this.xIndex;
		this.y = this.scene.marginTop+this.renderHeight*this.yIndex;
		this.tranWidth = this.x+this.renderWidth/2;
		this.tranHeight = this.y+this.renderHeight/2;
		this.scene.iconWidth = this.renderWidth;
		this.scene.iconHeight = this.renderHeight;
		var itemArray = this.scene.itemArray;
		if(!itemArray[this.xIndex]){
			itemArray[this.xIndex] = [];
		}
		itemArray[this.xIndex][this.yIndex] = this;
	},
	onRender:function(ctx){
		if(this.scene.lastMoveItem == this){
			ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
			ctx.fillRect(this.x+2,this.y+2,this.renderWidth-4, this.renderHeight-4);
		}
	},
	showRange:function(){
		this.roadRange.x = this.tranWidth;
		this.roadRange.y = this.tranHeight;
		this.roadRange.road = this;
		this.roadRange.show();
	},
	removeFocus:function(){
		if(this.tower){
			this.tower.towerRange.hide();
		}else{
			this.roadRange.hide();
		}
	}
})
Game.reg('road',Game.ui.Road);

//炮塔
Game.ui.Tower = Game.extend(Game.ui.MixImage,{
	atk:3,
	per:16,
	fireTime:60,
	flash:false,
	autoShow:true,
	isShowRange:false,
	autoAnimate:true,
	currentFireTime:0,
	className:'Game.ui.Tower',
	beforeShow:function(){
		this.level = 1;
		this.renderWidth = parseInt(83*this.scene.xRate);
		this.renderHeight = parseInt(83*this.scene.xRate);
		this._x = this.scene.marginLeft+this.renderWidth*this.xIndex;
		this._y = this.scene.marginTop+this.renderHeight*this.yIndex;
		this.scene.iconWidth = this.renderWidth;
		this.scene.iconHeight = this.renderHeight;
		this.rotate = 0;
		this.lastRotate = 0;
		this.range = 200;
		this.scene.itemArray[this.xIndex][this.yIndex].tower = this;
		this.tranWidth = this._x+this.renderWidth/2;
		this.tranHeight = this._y+this.renderHeight/2;
		this.x = -this.renderWidth/2;
		this.y = -this.renderHeight/2;
		this.zx = this._x - this.x;
		this.zy = this._y - this.y;
	},
	beforeRender:function(ctx){
		ctx.save();
		ctx.translate(this.tranWidth,this.tranHeight);
		ctx.rotate(this.rotate);
	},
	onRender:function(ctx){
		ctx.restore();
	},
	onClick:function(event,x,y){
		this.showRange(this.ctx);
	},
	showRange:function(ctx){
		this.towerRange.x = this.tranWidth;
		this.towerRange.y = this.tranHeight;
		this.towerRange.tower = this;
		this.towerRange.show();
	},
	onAnimate:function(){
		if(!this.target){
			var monsters = this.scene.monsters;
			for(var i in monsters){
				var z = monsters[i];
				if(this.range > $gm.distance(this.zx,this.zy,z.cx,z.cy)){
					this.target = z;
					break;
				}
			}
		}else{
			var distance = $gm.distance(this.zx,this.zy,this.target.cx,this.target.cy);
			if(this.range > distance){
				this.rotate = $gm.rotate(this.target.cx - this.zx,this.zy - this.target.cy );
				this.lastRotate = this.rotate;
				this.currentFireTime++;
				if(this.currentFireTime == this.fireTime){
					this.fire(distance);
					this.currentFireTime = 0;
				}
			}else{
				this.target = null;
			}
		}
	},
	fire:function(distance){
		Game.create('towerBullet',{scene:this.scene,tower:this,target:this.target,distance:distance,images:[Game.getCmp('hj-zd-1-1'),Game.getCmp('hj-zd-2-1')]});
	}
})
Game.reg('tower',Game.ui.Tower);

//怪兽-海螺
Game.ui.Conch = Game.extend(Game.ui.MixImage,{
	per:64,
	blood:360,
	cBlood:360,
	animateRate:2,
	autoShow:true,
	imgInterval:3,
	autoAnimate:true,
	currentAnimateRate:2,
	className:'Game.ui.Conch',
	beforeShow:function(){
		this.level = 1;
		this.currentDom = 0;
		this.step = 2;
		this.lastXIndex = this.xIndex+1;
		this.lastYIndex = this.yIndex;
		this.currentXIndex = this.xIndex;
		this.currentYIndex = this.yIndex;
		var renderWidth = parseInt(83*this.scene.xRate);
		var renderHeight = parseInt(83*this.scene.xRate);
		this.boxWidth = renderWidth;
		this.x = this.scene.marginLeft+renderWidth*this.xIndex+(renderWidth-50)/2;
		this.y = this.scene.marginTop+renderHeight*this.yIndex+(renderHeight-60)/2;
		this.renderWidth = renderWidth*50/83;
		this.renderHeight = renderHeight*60/83;
		this.run = this.boxWidth;
		this.halfRenderWith = this.renderWidth/2;
		this.halfRenderHeight = this.renderHeight/2;
		this.cx = this.x + this.halfRenderWith;
		this.cy = this.y + this.halfRenderHeight;
		this.scene.monsters[this.id] = this;
		this.onAnimate();
	},
	render:function(ctx){
		ctx.drawImage(this.dom.dom,0,0,this.dom.width,this.dom.height,this.x,this.y,this.renderWidth,this.renderHeight);
		this.onRender(ctx);		
	},
	onAnimate:function(){
		if(this.x >this.scene.width || this.x < 0 || this.y >this.scene.height || this.y < 0 ){
			return this.destroy();
		}
		if(this.run >= this.boxWidth){
			this.run = 0;
			if(this.road[this.currentXIndex-1] && this.road[this.currentXIndex-1][this.currentYIndex] == 0 
				&& (this.currentXIndex-1 != this.lastXIndex || this.currentYIndex != this.lastYIndex)){
				this.lastXIndex = this.currentXIndex;
				this.lastYIndex = this.currentYIndex;
				this.currentXIndex--;
				this.move = -this.step;
				this.direction = 'x';
			}else if(this.road[this.currentXIndex+1] && this.road[this.currentXIndex+1][this.currentYIndex] == 0 
				&& (this.currentXIndex+1 != this.lastXIndex || this.currentYIndex != this.lastYIndex)){
				this.lastXIndex = this.currentXIndex;
				this.lastYIndex = this.currentYIndex;
				this.currentXIndex++;
				this.move = this.step;
				this.direction = 'x';
			}else if(this.road[this.currentXIndex] && this.road[this.currentXIndex][this.currentYIndex-1] == 0 
				&& (this.currentXIndex != this.lastXIndex || this.currentYIndex-1 != this.lastYIndex)){
				this.lastXIndex = this.currentXIndex;
				this.lastYIndex = this.currentYIndex;
				this.currentYIndex--;
				this.move = -this.step;
				this.direction = 'y';
			}else if(this.road[this.currentXIndex] && this.road[this.currentXIndex][this.currentYIndex+1] == 0 
				&& (this.currentXIndex != this.lastXIndex || this.currentYIndex+1 != this.lastYIndex)){
				this.lastXIndex = this.currentXIndex;
				this.lastYIndex = this.currentYIndex;
				this.currentYIndex++;
				this.direction = 'y';
				this.move = this.step;
			}
		}
		if(this.direction == 'x'){
			this.x+=this.move;
		}else{
			this.y+=this.move;
		}
		this.cx = this.x + this.halfRenderWith;
		this.cy = this.y + this.halfRenderHeight;
		this.run+=this.step;
	},
	onDestroy:function(){
		delete this.scene.monsters[this.id];
		this.scene.removeLevelItem(this);
	},
	onRender:function(ctx){
		ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(this.x, this.y-10, this.renderWidth, 4);
		ctx.fillStyle = 'rgb(240, 17, 17)';
        ctx.fillRect(this.x, this.y-10, this.renderWidth*this.cBlood/this.blood, 4);
	}
})
Game.reg('conch',Game.ui.Conch);

//炮塔的子弹
Game.ui.TowerBullet = Game.extend(Game.ui.MixImage,{
	per:16,
	autoShow:true,
	autoAnimate:true,
	imgInterval:6,
	className:'Game.ui.TowerBullet',
	beforeShow:function(){
		var rate = this.scene.rate;
		this.level = 2;
		this.step = 9;
		var tower = this.tower;
		this.tranWidth = tower.tranWidth;
		this.tranHeight = tower.tranHeight;
		this.rotate = tower.rotate;
		this.currentIndex = 0;
		this.x = tower.x+22;
		this.run = 0;
		this.y= tower.y;
		this.renderWidth = parseInt(41.915*this.scene.xRate);
		this.renderHeight = parseInt(83*this.scene.xRate);
		this.onAnimate();
		this.startAnimate();
	},
	render:function(ctx){
		ctx.translate(this.tranWidth,this.tranHeight);
		ctx.rotate(this.rotate);
		ctx.drawImage(this.dom.dom,0,0,this.dom.width,this.dom.height,this.x,this.y,this.renderWidth,this.renderHeight);
		ctx.rotate(-this.rotate);
		ctx.translate(-this.tranWidth,-this.tranHeight);
		this.onRender(ctx);		
	},
	onAnimate:function(){
		if(-this.y < this.scene.width){
			if(!this.shoot){
				if(-this.y >= this.distance+this.renderHeight){
					this.target.cBlood -= this.tower.atk;
					if(this.target.cBlood <= 0){
						this.target.destroy();
						this.target = null;
						this.tower.target = null;
					}
					this.shoot = true;
				}
			}
			this.y-=this.step;
		}else{
			this.destroy();
		}
	}
})
Game.reg('towerBullet',Game.ui.TowerBullet);






