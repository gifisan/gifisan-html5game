Game.onReady(function(){
	container.initContainer(Game.get('cvs'));
	var scene = Game.create('deskTop',{id:'deskTop'});
	var sourceLoader = Game.getCmp('sourceLoader');
	sourceLoader.itemSize = 1;
	sourceLoader.addItem(Game.create('image',{id:'PopCap_Logo.jpg',src:'img/PopCap_Logo.jpg',scene:scene,cache:true}));
	Game.getCmp('sourceLoader').onLoad = function(){
		scene.show();
		scene.changeEventHandle(Game.getCmp('dialogBlankEventHandle'));
		Game.getCmp('box-boot-loading').img = Game.create('popLogo',{img:Game.getCmp('PopCap_Logo.jpg'),scene:scene});
		Game.getCmp('box-boot-loading').show(scene);
		container.startPlay(15);
		var images = ['1.png','2.png','3.png','4.png','5.png','6.png','12.png','13.png','14.png','15.png',
					  'music.png','pvz.jpg','1.png','mhxy.png','lbsg.png','bg2.jpg','toImg.png','bg1.jpg'];
		sourceLoader.itemSize = images.length;
		for(var i in images){
			sourceLoader.addItem(Game.create('image',{src:'img/'+images[i],id:images[i]}));
		}
		
		//所有图片加载完成
		sourceLoader.onLoad = function(){
			Game.getCmp('box-boot-loading').hide();
			Game.create('bg',{img:Game.getCmp('bg2.jpg'),scene:scene}).show();
			Game.create('bottom',{name:'bottom',img:Game.getCmp('toImg.png'),id:'bottom',scene:scene}).show();
			var items = [{name:'window',src:'1.png',url:'http://2.wsyx987.sinaapp.com/',scene:scene,x:40,y:40},
						 {name:'千千静听',src:'2.png',url:'http://2.winapp.sinaapp.com/',scene:scene,x:40,y:170},
						 {name:'PS',src:'3.png',url:'http://6.winapp.sinaapp.com/',scene:scene,x:40,y:300},
						 {name:'斗地主',src:'4.png',url:'http://1.winapp.sinaapp.com',scene:scene,x:40,y:430},
						 {name:'记事本',src:'5.png',url:'http://3.wkapp.sinaapp.com/',scene:scene,x:140,y:40},
						 {name:'三国',src:'6.png',url:'http://5.wkapp.sinaapp.com/',scene:scene,x:140,y:170},
						 {name:'守卫',src:'12.png',url:'http://9.wkapp.sinaapp.com/',scene:scene,x:140,y:300},
						 {name:'部落守卫',src:'13.png',url:'http://7.wkapp.sinaapp.com/',scene:scene,x:140,y:430},
						 {name:'蜀山',src:'14.png',url:'http://wkapp.sinaapp.com/',scene:scene,x:240,y:40},
						 {name:'诸神修仙',src:'15.png',url:'http://1.wkapp.sinaapp.com/',scene:scene,x:240,y:170},
						 {name:'歌曲播放',src:'music.png',url:'http://10.wkapp.sinaapp.com/_/demo/music/music.html',scene:scene,x:240,y:300},
						 {name:'大战僵尸',src:'pvz.jpg',url:'http://wkapp100.duapp.com/pvz/index.htm',scene:scene,x:240,y:430},
						 {name:'梦幻西游',src:'mhxy.png',url:'http://wkapp100.duapp.com/mhxy/index.htm',scene:scene,x:340,y:40},
						 {name:'龙霸三国',src:'lbsg.png',url:'http://wkapp100.duapp.com/lbsg/index.htm',scene:scene,x:340,y:170}];
			/**/
			for(var i in items){
				Game.create('icon',items[i]).show();
			}
			
			scene.changeEventHandle(Game.getCmp('defaultEventHandle'));
			Game.create('alphaShow',{id:'alphaShow',scene:scene}).show();
			Game.create('myinfo',{img:Game.getCmp('bg1.jpg'),id:'myinfo',scene:scene,myInfoEventHandle:Game.create('myInfoEventHandle')});
		}
		
	}

		

});