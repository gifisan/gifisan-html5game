//主场景
Game.ui.LScene = Game.extend(Game.ui.Scene,{
	className:'Game.ui.LScene',
	onClick:function(event,x,y){}
})
Game.reg('lScene',Game.ui.LScene);

//其他场景1
Game.ui.TScene = Game.extend(Game.ui.Scene,{
	className:'Game.ui.TScene',
	onClick:function(event,x,y){
		Game.info(x+':'+y);
	},
	createScene:function(){
		Game.create('btnClose',{id:this.closeId,scene:this}).show();
		Game.create('infoBg',{id:this.bgId,scene:this}).show();
		Game.create('infoTitle',{id:this.titleId,scene:this,name:this.titleName}).show();
	}
})
Game.reg('tScene',Game.ui.TScene);

//战斗场景
Game.ui.ZScene = Game.extend(Game.ui.Scene,{
	className:'Game.ui.ZScene',
	onClick:function(event,x,y){
		Game.info(x+':'+y);
	},
	createScene:function(){
		this.x_880 = 880*this.xrate;
		this.y_32  =  32*this.yrate;
		this.y_30  =  30*this.yrate;
		this.x_85  =  85*this.xrate;
		Game.create('bg',{img:Game.getCmp('bg.jpg'),id:'bg_1',scene:this}).show();
		Game.create('imageHolder',{img:Game.getCmp('btn4.png'),scene:this}).show();
		Game.create('imageHolder',{
			img:Game.getCmp('btn2.png'),
			x:800,
			scene:this,
			level:6,
			clickAble:true,
			onClick:function(event,x,y){
				Game.getCmp('taskScene').show();
			},
			onRender:function(ctx){
				ctx.textAlign = 'center',
				ctx.textBaseline = 'middle';
				ctx.font="26px sans-serif";
				ctx.fillStyle = 'rgb(255,255,255)';
				ctx.fillText('离开',this.scene.x_880,this.scene.y_32);
				//场景title
				ctx.fillText(this.scene.mrtz.text,this.scene.x_85,this.scene.y_30);
			}
		}).show();
	}
})
Game.reg('zScene',Game.ui.ZScene);

Game.ui.LbsgLoading = Game.extend(Game.ui.AnimateAble,{
	per:16,
	autoAnimate:true,
	className:'Game.ui.LbsgLoading',
	onAnimate:function(){
		this.scene.changed = true;
	},
	render:function(ctx){
		this.img.render(ctx);
		var process = this.scene.container.loader.progress*9.5;
		ctx.drawImage(this.process_step.dom,0,0,process,18,0,564*this.scene.yrate,process*this.scene.xrate,18*this.scene.yrate);
		ctx.drawImage(this.process_cursor.dom,0,0,35,19,(process-10)*this.scene.xrate,565*this.scene.yrate,35*this.scene.xrate,19*this.scene.yrate);
	},
	init:function(){
		this.process_cursor = Game.getCmp('process_cursor_1');
		this.process_step = Game.getCmp('process_step_1');
		this.img = Game.create('bg',{
			img:Game.getCmp('lzsgLoadingImg_1'),
			scene:this.scene
		}).show();
	}

})
Game.reg('lbsgLoading',Game.ui.LbsgLoading);

Game.ui.Door = Game.extend(Game.ui.MixImage,{
	per:80,
	clickAble:true,
	autoAnimate:true,
	className:'Game.ui.Door',
	images:conf.imgs['Game.ui.Door'],
	onClick:function(event,x,y){
		Game.info(this.name);
	},
	onInit:function(){
		this.imgDom = Game.getCmp('door.png').dom;
	}
})
Game.reg('door',Game.ui.Door);

Game.ui.NPC = Game.extend(Game.ui.MixImage,{
	per:64,
	renderHeight:140,
	autoAnimate:true,
	clickAble:true,
	className:'Game.ui.NPC',
	onRender:function(ctx){
		this.renderName(ctx);
	},
	renderName:function(ctx){
		ctx.textAlign = 'center',
		ctx.textBaseline = 'top';
		ctx.font="18px sans-serif";
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillText(this.name,this.bx+this.renderWidth/2,this.y-25);
	},
	onClick:function(event,x,y){
		Game.info(this.name);
	},
	beforeInit:function(){
		this.images = conf.imgs[this.className];
		this.imgDom = Game.getCmp(this.imgId).dom;
	}
})
Game.reg('npc',Game.ui.NPC);

Game.ui.CSMaleStop = Game.extend(Game.ui.NPC,{
	imgId:'cs_male_stop.png',
	className:'Game.ui.CSMaleStop'
})
Game.reg('csMaleStop',Game.ui.CSMaleStop);

Game.ui.CSFemaleStop = Game.extend(Game.ui.NPC,{
	imgId:'cs_female_stop.png',
	className:'Game.ui.CSFemaleStop'
})
Game.reg('csFemaleStop',Game.ui.CSFemaleStop);

//mj_female_stop
Game.ui.MJFemaleStop = Game.extend(Game.ui.NPC,{
	imgId:'mj_female_stop.png',
	className:'Game.ui.MJFemaleStop'
})
Game.reg('mjFemaleStop',Game.ui.MJFemaleStop);

Game.ui.InfoTitle = Game.extend(Game.ui.ImageHolder,{
	x:35,
	y:25,
	xrate:0.8,
	className:'Game.ui.InfoTitle',
	onRender:function(ctx){
		ctx.textAlign = 'center',
		ctx.textBaseline = 'middle';
		ctx.font="24px sans-serif";
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillText(this.name,this.textX,this.textY);
	},
	beforeInit:function(){
		this.img = Game.getCmp('info_title_bg.png');
	},
	onInit:function(){
		this.textX = this.bx+this.renderWidth/2;
		this.textY = this.by+this.renderHeight/2;
	}
})
Game.reg('infoTitle',Game.ui.InfoTitle);


Game.ui.InfoBg = Game.extend(Game.ui.ImageHolder,{
	className:'Game.ui.InfoBg',
	beforeInit:function(){
		this.img = Game.getCmp('task_bg.png');
	}
})
Game.reg('infoBg',Game.ui.InfoBg);

Game.ui.BTNClose = Game.extend(Game.ui.ImageHolder,{
	y:24,
	x:870,
	level:2,
	frameX:15,
	frameWidth:77,
	frameHeight:60,
	clickAble:true,
	className:'Game.ui.BTNClose',
	onClick:function(){
		Game.getCmp('mainScene').show();
	},
	onInit:function(){
		this.img = Game.getCmp('btn_close.png');
	}
})
Game.reg('btnClose',Game.ui.BTNClose);

Game.ui.SkillBg = Game.extend(Game.ui.ImageHolder,{
	rate:0.8,
	className:'Game.ui.SkillBg',
	beforeInit:function(){
		this.img = Game.getCmp('icon_bg.png');
	}
})
Game.reg('skillBg',Game.ui.SkillBg)

Game.ui.SkillIcon = Game.extend(Game.ui.ImageHolder,{
	level:5,
	clickAble:true,
	renderWidth:82,
	renderHeight:82,
	className:'Game.ui.SkillIcon',
	beforeInit:function(){
		this.wrap = Game.create('skillBg',{x:this.x-2,y:this.y-2,scene:this.scene,level:this.level});
	},
	beforeShow:function(ctx){
		this.wrap.show();
	},
	onClick:function(){
		Game.getCmp('userMsgBox').curZB = this.id;
		Game.getCmp('userMsgBox').show();
	},
	onHide:function(){
		this.wrap.hide();
	}
})
Game.reg('skillIcon',Game.ui.SkillIcon)

//User
Game.namespace('L');
L.User = Game.extend({
	name:'WKAPP',
	showName:'名字：WKAPP',
	currentExp:0,
	level:1,
	levelUpExp:100,
	blood:100,
	attack:20,
	money:100,
	realMoney:0,
	skill:{},
	equipment:{},
	className:'L.User',
	init:function(){
		this.x_240 = 240*this.scene.xrate;
		this.y_150 = 150*this.scene.yrate;
		this.x_520 = 520*this.scene.xrate;
		this.y_410 = 410*this.scene.yrate;
		this.y_200 = 200*this.scene.yrate;
		this.x_560 = 560*this.scene.xrate;
		this.y_300 = 300*this.scene.yrate;
		this.x_750 = 750*this.scene.xrate;
		this.y_350 = 350*this.scene.yrate;
		this.y_250 = 250*this.scene.yrate;
		this.user_img = Game.create('csMaleStop',{
			x:180,y:200,
			scene:this.scene,
			clickAble:false,
			id:'user_img',
			renderHeight:200,
			renderWidth:100,
			user:this,
			renderName:function(ctx){
				ctx.textAlign = 'center',
				ctx.textBaseline = 'middle';
				ctx.font="26px sans-serif";
				ctx.fillStyle = 'rgb(255,255,255)';
				ctx.fillText(this.scene.user.showName,this.user.x_240,this.user.y_150);
				//借用renderName 把属性也render出来
				ctx.textAlign = 'left',
				ctx.fillText('角色属性',this.user.x_520,this.user.y_150);
				ctx.fillText('角色技能',this.user.x_520,this.user.y_410);
				ctx.font="24px sans-serif";
				ctx.fillText('等级：'+this.user.level,this.user.x_560,this.user.y_200);
				ctx.fillText('经验：'+this.user.currentExp+'/'+this.user.levelUpExp,this.user.x_560,this.user.y_250);
				ctx.fillText('生命：'+this.user.blood,this.user.x_560,this.user.y_300);
				ctx.fillText('攻击：'+this.user.attack,this.user.x_750,this.user.y_300);
				ctx.fillText('金币：'+this.user.money,this.user.x_560,this.user.y_350);
				ctx.fillText('元宝：'+this.user.realMoney,this.user.x_750,this.user.y_350);
			}
		});
		this.zb_weapon = Game.create('skillIcon',{
			x:120,
			y:460,
			level:3,
			name:'魏武青虹',
			scene:this.scene,
			clickAble:true,
			id:'zb_weapon',
			img:Game.getCmp('zb_weapon.png')
		})
		this.zb_cloth = Game.create('skillIcon',{
			x:280,
			y:460,
			level:3,
			scene:this.scene,
			clickAble:true,
			id:'zb_cloth',
			name:'夜魔披风',
			img:Game.getCmp('zb_cloth.png')
		})
		this.skill_tssl = Game.create('skillIcon',{
			x:530,
			y:460,
			level:3,
			scene:this.scene,
			clickAble:true,
			id:'skill_tssl',
			name:'天生神力',
			img:Game.getCmp('skill_tianshengshenli.png')
		})
		this.skill_bfbz = Game.create('skillIcon',{
			x:720,
			y:460,
			level:3,
			scene:this.scene,
			clickAble:true,
			id:'skill_bfbz',
			name:'百发百中',
			img:Game.getCmp('skill_baifabaizhong.png')
		})
		Game.create('userMsgBox',{id:'userMsgBox',scene:this.scene});
		this.zb_weapon.show();
		this.zb_cloth.show();
		this.skill_tssl.show();
		this.skill_bfbz.show();
		this.user_img.show();
	},
	show:function(){
		this.user_img.startAnimate();
	},
	hide:function(){
		this.user_img.stopAnimate();
	}
})
Game.reg('user',L.User)

Game.ui.GuideBtn = Game.extend(Game.ui.ImageHolder,{
	y:520,
	level:2,
	rate:0.6,
	clickLevel:2,
	clickAble:true,
	className:'Game.ui.GuideBtn',
	onRender:function(ctx){
		ctx.textAlign = 'center',
		ctx.textBaseline = 'middle';
		ctx.font="18px sans-serif";
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillText(this.name,this.textX,this.textY);
	},
	onClick:function(event,x,y){
		Game.getCmp('lbasicMsgBox').text = this.name;
		Game.getCmp('lbasicMsgBox').show(this.scene);
	},
	beforeInit:function(){
		this.img = Game.getCmp('guide_bg.png');
	},
	onInit:function(){
		this.textY = this.by+this.renderHeight/2;
		this.textX = this.bx+this.renderWidth/2;
	}
})
Game.reg('guideBtn',Game.ui.GuideBtn);

Game.ui.LBtn = Game.extend(Game.ui.ImageHolder,{
	level:6,
	rate:0.7,
	clickAble:true,
	textAlign:'left',
	className:'Game.ui.LBtn',
	onRender:function(ctx){
		ctx.textAlign = this.textAlign,
		ctx.textBaseline = 'middle';
		ctx.font="22px sans-serif";
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillText(this.text,this.textX,this.textY);
	},
	beforeInit:function(){
		this.img=Game.getCmp('btn1.png');
	},
	onInit:function(){
		this.textX = this.bx+this.renderWidth/2;
		this.textY = this.by+this.renderHeight/2;
	}
})
Game.reg('lbtn',Game.ui.LBtn);

Game.ui.LBasicMsgBox = Game.extend(Game.ui.MsgBox,{
	rate:1.3,
	id:'lbasicMsgBox',
	className:'Game.ui.LBasicMsgBox',
	beforeInit:function(){
		this.img = Game.getCmp('msg_bg.png');
	},
	onInit:function(){
		this.textX = 425*this.scene.xrate;
		this.textY = 180*this.scene.yrate;
		this.closeBtn = Game.create('lbtn',{
			x:418,
			y:289,
			text:'关闭',
			textAlign:'center',
			scene:this.scene,
			onClick:function(){
				Game.getCmp('lbasicMsgBox').hide();
			},
			onInit:function(){
				this.textX = this.bx+this.renderWidth/2;
				this.textY = this.by+this.renderHeight/2;
			}
		})
	},
	onRender:function(ctx){
		ctx.textAlign = this.textAlign,
		ctx.textBaseline = 'middle';
		ctx.font="22px sans-serif";
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillText(this.text,this.textX,this.textY);
	},
	onShow:function(){
		this.closeBtn.show();
	},
	onHide:function(){
		this.closeBtn.hide();
	}
})
Game.reg('lbasicMsgBox',Game.ui.LBasicMsgBox);

Game.ui.UserMsgBox = Game.extend(Game.ui.MsgBox,{
	y:165,
	rate:1.5,
	className:'Game.ui.UserMsgBox',
	beforeInit:function(){
		this.img = Game.getCmp('msg_bg.png');
	},
	onInit:function(){
		this.x_320 = 320*this.scene.xrate;
		this.y_215 = 215*this.scene.yrate;
		this.y_265 = 265*this.scene.yrate;
		this.zb = {
			zb_weapon:Game.create('skillIcon',{
				x:540,
				y:230,
				name:'魏武青虹',
				scene:this.scene,
				attr:'攻击(30)',
				img:Game.getCmp('zb_weapon.png'),
				onClick:function(){}
			}),
			zb_cloth:Game.create('skillIcon',{
				x:540,
				y:230,
				scene:this.scene,
				name:'夜魔披风',
				attr:'气血(50)',
				img:Game.getCmp('zb_cloth.png'),
				onClick:function(){}
			}),
			skill_tssl:Game.create('skillIcon',{
				x:540,
				y:230,
				scene:this.scene,
				name:'天生神力',
				attr:'伤害提升10%',
				img:Game.getCmp('skill_tianshengshenli.png'),
				onClick:function(){}
			}),
			skill_bfbz:Game.create('skillIcon',{
				x:540,
				y:230,
				scene:this.scene,
				name:'百发百中',
				attr:'命中率100%',
				img:Game.getCmp('skill_baifabaizhong.png'),
				onClick:function(){}
			}),
		}
		this.upBtn = Game.create('lbtn',{
			x:320,
			y:355,
			text:'去提升',
			scene:this.scene,
			textAlign:'center',
			onClick:function(){
				Game.info('upBtn');
			}
		})
		this.closeBtn = Game.create('lbtn',{
			x:510,
			y:355,
			text:'关闭',
			scene:this.scene,
			textAlign:'center',
			onClick:function(){
				Game.getCmp('userMsgBox').hide();
			}
		})
	},
	onShow:function(){
		this.zb[this.curZB].show();
		this.upBtn.show();
		this.closeBtn.show();
	},
	onHide:function(){
		this.upBtn.hide();
		this.closeBtn.hide();
		this.zb[this.curZB].hide();
	},
	onRender:function(ctx){
		ctx.textAlign = 'left',
		ctx.textBaseline = 'top';
		ctx.font="22px sans-serif";
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillText('名称：'+this.zb[this.curZB].name,this.x_320,this.y_215);
		ctx.fillText('属性：'+this.zb[this.curZB].attr,this.x_320,this.y_265);
	}

})
Game.reg('userMsgBox',Game.ui.UserMsgBox);

Game.ui.MRTZIcon1 = Game.extend(Game.ui.ImageHolder,{
	y:130,
	level:5,
	rate:1.8,
	clickAble:true,
	className:'Game.ui.MRTZIcon1',
	imgId:'littlehelper_herocopy.png',
	onRender:function(ctx){
		ctx.textAlign = 'center',
		ctx.textBaseline = 'top';
		ctx.font="24px sans-serif";
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillText(this.text,this.textX,this.textY);
	},
	beforeInit:function(){
		this.img=Game.getCmp(this.imgId);
	},
	onInit:function(){
		this.textX = this.bx+this.renderWidth/2;
		this.textY = this.by+this.renderHeight;
		this.targetScene = Game.create('zScene',{id:'zScene'});
	},
	onClick:function(event,x,y){
		this.targetScene.mrtz = this;
		this.targetScene.show();
	}
})
Game.reg('mrtzIcon1',Game.ui.MRTZIcon1);

Game.ui.MRTZIcon2 = Game.extend(Game.ui.MRTZIcon1,{
	y:350,
	imgId:'meiri_title.png',
	className:'Game.ui.MRTZIcon2',
	onRender:function(ctx){
		ctx.textAlign = 'center',
		ctx.textBaseline = 'top';
		ctx.font="24px sans-serif";
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillText(this.text,this.textX,this.textY);
	}
})
Game.reg('mrtzIcon2',Game.ui.MRTZIcon2);
















