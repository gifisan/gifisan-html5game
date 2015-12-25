Game.onReady(function(){
	
	container.initContainer(Game.get('cvs'),false);
	var scene = Game.create('lScene',{id:'mainScene'});
	var sourceLoader = Game.getCmp('sourceLoader');
	sourceLoader.itemSize = 3;
	sourceLoader.addItem(Game.create('image',{id:'lzsgLoadingImg_1',src:'img/loading_bg.jpg',scene:scene,cache:true}));
	sourceLoader.addItem(Game.create('image',{id:'process_cursor_1',src:'img/process_cursor.png',scene:scene,cache:true}));
	sourceLoader.addItem(Game.create('image',{id:'process_step_1',src:'img/process_step.png',scene:scene,cache:true}));
	Game.getCmp('dialogBg').backgroundColor='rgba(20, 20, 20, 0.3)';
	sourceLoader.onLoad = function(){
		scene.show();
		scene.changeEventHandle(Game.getCmp('dialogBlankEventHandle'));
		Game.create('lbsgLoading',{id:'lbsgLoading_1',scene:scene}).show();
		container.startPlay(16);
		var images = ['btn_close.png','guide_bg.png','task_bg.png','info_title_bg.png','mj_female_stop.png',
					  'cs_female_stop.png','cs_male_stop.png','zb_cloth.png','icon_bg.png','icon_sel.png',
					  'zb_weapon.png','paoma_bg.png','skill_baifabaizhong.png','skill_tianshengshenli.png',
					  'msg_bg.png','btn1.png','meiri_title.png','littlehelper_herocopy.png','bg.jpg','btn2.png',
					  'btn3.png','btn4.png','btn5.png','cs_male_skillattacka.png','door.png','caocao_stop.png','FishActor-Mid.png'];
		
		sourceLoader.itemSize = images.length;
		for(var i in images){
			sourceLoader.addItem(Game.create('image',{src:'img/'+images[i],id:images[i]}));
		}
		/*
		sourceLoader.addItem(Game.create('audio',{
			id:'audio1',
			autoPlay:true,
			src:'http://5.wkapp.sinaapp.com/resource/music/longyaguan.mp3',
			ended : function(e) {
				this.play();
			}
		}));
		*/
		sourceLoader.onLoad = function(){
			Game.getCmp('lbsgLoading_1').hide();
			Game.getCmp('lbsgLoading_1').destroy();
			Game.create('bg',{img:Game.getCmp('bg.jpg'),id:'bg_1',scene:scene}).show();
			Game.create('door',{x:760,y:220,scene:scene,onClick:function(){
				Game.getCmp('lbasicMsgBox').text = '无人区，暂不开放';
				Game.getCmp('lbasicMsgBox').show(scene);
			}}).show();
			
			Game.create('lbasicMsgBox',{scene:scene});
			Game.create('csMaleStop',{scene:scene,x:60,y:120,name:'每日挑战',id:'rwsz_1',
				onInit:function(){
					this.taskScene = Game.create('tScene',{
						id:'taskScene',
						closeId:'task_btnClose',
						bgId:'task_bg',
						titleId:'task_title',
						titleName:'每日挑战',
						onInit:function(){
							this.mrtz1=Game.create('mrtzIcon1',{scene:this,x:100,text:'初出江湖'});
							this.mrtz2=Game.create('mrtzIcon1',{scene:this,x:300,text:'小试牛刀'});
							this.mrtz3=Game.create('mrtzIcon1',{scene:this,x:500,text:'略知一二'});
							this.mrtz4=Game.create('mrtzIcon1',{scene:this,x:700,text:'驾轻就熟'});
							this.mrtz5=Game.create('mrtzIcon2',{scene:this,x:100,text:'融会贯通'});
							this.mrtz6=Game.create('mrtzIcon2',{scene:this,x:300,text:'空前绝后'});
							this.mrtz7=Game.create('mrtzIcon2',{scene:this,x:500,text:'天人合一'});
							this.mrtz8=Game.create('mrtzIcon2',{scene:this,x:700,text:'返璞归真'});
						},
						onShow:function(){
							this.mrtz1.show();
							this.mrtz2.show();
							this.mrtz3.show();
							this.mrtz4.show();
							this.mrtz5.show();
							this.mrtz6.show();
							this.mrtz7.show();
							this.mrtz8.show();
						},
						onHide:function(){
							this.mrtz1.hide();
							this.mrtz2.hide();
							this.mrtz3.hide();
							this.mrtz4.hide();
							this.mrtz5.hide();
							this.mrtz6.hide();
							this.mrtz7.hide();
							this.mrtz8.hide();
						}
					});
				},
				onClick:function(event,x,y){
					this.taskScene.show();
				}
			}).show();
			
			Game.create('csFemaleStop',{scene:scene,x:210,y:120,name:'活动使者',id:'hdsz_1',
				onInit:function(){
					this.hdszScene = Game.create('tScene',{id:'hdszScene',closeId:'hdsz_btnClose',bgId:'hdsz_bg',titleId:'hdsz_title',titleName:'活动使者'});
				},
				onClick:function(event,x,y){
					this.hdszScene.show();
				}
			}).show();
			Game.create('mjFemaleStop',{scene:scene,x:360,y:120,name:'装备商人',id:'zbsr_1',
				onInit:function(){
					this.zbsrScene = Game.create('tScene',{id:'zbsrScene',closeId:'zbsr_btnClose',bgId:'zbsr_bg',titleId:'zbsr_title',titleName:'装备商人'});
				},
				onClick:function(event,x,y){
					this.zbsrScene.show();
				}
			}).show();
			Game.create('csFemaleStop',{scene:scene,x:510,y:120,name:'群众演员甲',id:'qzyyj',onClick:function(){
				Game.getCmp('lbasicMsgBox').text = '好好学习，天天向上';
				Game.getCmp('lbasicMsgBox').show(scene);
			}}).show();
			
			Game.create('guideBtn',{images:[Game.getCmp('guide_bg.png')],scene:scene,x:560,name:'角色',onClick:function(event,x,y){
				var roleScene = Game.getCmp('roleScene');
				if(roleScene == null){
					roleScene = Game.create('tScene',{
						id:'roleScene',
						closeId:'role_btnClose',
						bgId:'role_bg',
						titleId:'role_title',
						titleName:'角色',
						onInit:function(){
							this.user = Game.create('user',{scene:this});
						},
						onShow:function(){
							this.user.show();
						},
						onHide:function(){
							this.user.hide();
						}
					});
				}
				roleScene.show();
			}}).show();
			Game.create('guideBtn',{scene:scene,x:660,name:'物品'}).show();
			Game.create('guideBtn',{scene:scene,x:760,name:'提升'}).show();
			Game.create('guideBtn',{scene:scene,x:860,name:'退出'}).show();
			scene.changeEventHandle(Game.getCmp('defaultEventHandle'));
		}

	}
});
