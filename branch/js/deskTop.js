Game.onReady(function(){
	Game.setup(Game.create('deskTop',{id:'deskTop-1'}),function(imageLoader,scene){
		var items = [{name:'window',src:'img/1.png',url:'http://2.wsyx987.sinaapp.com/',scene:scene},
					{name:'千千静听',src:'img/2.png',url:'http://2.winapp.sinaapp.com/',scene:scene},
					{name:'歌曲播放',src:'img/music.png',url:'http://10.wkapp.sinaapp.com/_/demo/music/music.html',scene:scene},
					{name:'PS',src:'img/3.png',url:'http://6.winapp.sinaapp.com/',scene:scene},
					{name:'斗地主',src:'img/4.png',url:'http://1.winapp.sinaapp.com',scene:scene},
					{name:'记事本',src:'img/5.png',url:'http://3.wkapp.sinaapp.com/',scene:scene},
					{name:'三国',src:'img/6.png',url:'http://5.wkapp.sinaapp.com/',scene:scene},
					{name:'守卫',src:'img/12.png',url:'http://9.wkapp.sinaapp.com/',scene:scene},
					{name:'部落守卫',src:'img/13.png',url:'http://7.wkapp.sinaapp.com/',scene:scene},
					{name:'蜀山',src:'img/14.png',url:'http://wkapp.sinaapp.com/',scene:scene},
					{name:'大战僵尸',src:'img/pvz.jpg',url:'http://www.boxboot.com/pvz/index.htm',scene:scene},
					{name:'梦幻西游',src:'img/mhxy.png',url:'http://www.boxboot.com/mhxy/index.htm',scene:scene}];
		imageLoader.addItem(Game.create('bg',{src:'img/bg2.jpg',scene:scene,id:'bg-1',renderWidth:scene.width,renderHeight:scene.height}));
		imageLoader.addItem(Game.create('bottom',{name:'bottom',src:'img/toImg.png',id:'bottom-1',scene:scene}));
		imageLoader.itemSize = items.length+2;
		for(var i in items){imageLoader.addItem(Game.create('icon',items[i]));}
		//所有图片加载完成
		imageLoader.onLoad = function(){
			Game.getCmp('box-boot-loading-1').hide();
			scene.changeEventHandle(Game.getCmp('defaultEventHandle-1'));
			Game.create('alphaShow',{id:'alphaShow-1',scene:scene}).show();
		}
	},'cvs');
});