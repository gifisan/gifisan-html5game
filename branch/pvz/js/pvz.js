Game.onReady(function(){
	Game.setup(Game.create('pvzScene',{id:'pvzScene-1'}),function(imageLoader,scene){
		imageLoader.itemSize = 7;
		imageLoader.addItem(Game.create('bg',{src:'img/bg1.jpg',scene:scene,id:'bg-1',renderWidth:scene.width,renderHeight:scene.height}));
		imageLoader.addItem(Game.create('image',{autoShow:false,src:'img/road.png',scene:scene,id:'road-1'}));
		imageLoader.addItem(Game.create('image',{autoShow:false,src:'img/huojian2.png',scene:scene,id:'huojian-1',name:'火箭炮',description:'这是一个火箭炮，所向披靡'}));
		Game.create('roadRange',{id:'roadRange-1',x:0,y:0,r:100,loader:imageLoader,scene:scene});
		Game.create('towerRange',{id:'towerRange-1',x:0,y:0,r:200,loader:imageLoader,scene:scene});
		var conches = [ {src:'img/monster/conch/conch1.png',id:'conch1-1',autoShow:false,scene:scene},
						{src:'img/monster/conch/conch2.png',id:'conch2-1',autoShow:false,scene:scene}];
		var tower_bullet = [{src:'img/hj_zd_1.png',id:'hj-zd-1-1',autoShow:false,scene:scene},
							{src:'img/hj_zd_2.png',id:'hj-zd-2-1',autoShow:false,scene:scene}];
		var road = [[1,1,1,0,1,1],[1,0,0,0,1,1],[1,0,1,1,1,1],[1,0,1,1,1,1],[1,0,1,1,1,1],[1,0,1,1,1,1],[1,0,1,1,1,1],[1,0,0,0,1,1],[1,1,1,0,1,1]];
		for(var i=0;i<conches.length;i++){var item = Game.create('image',conches[i]);imageLoader.addItem(item);scene.addDestroyItem(item);}
		for(var i=0;i<tower_bullet.length;i++){var item = Game.create('image',tower_bullet[i]);imageLoader.addItem(item);scene.addDestroyItem(item);}
		for(var i = 0; i < road.length; i++){
			for(var j=0;j<road[i].length;j++){
				if(road[i][j] == 1){
					Game.create('road',{xIndex:i,yIndex:j,scene:scene,images:[Game.getCmp('road-1')],roadRange:Game.getCmp('roadRange-1')}).show();
				}
			}
		}
		imageLoader.onLoad = function(){
			scene.changeEventHandle(Game.getCmp('dialogBlankEventHandle-1'));
			Game.getCmp('box-boot-loading-1').hide();
			Game.create('alphaShow',{id:'alphaShow-1',scene:scene}).show();
			scene.changeEventHandle(Game.getCmp('defaultEventHandle-1'));
			scene.addDestroyItem(Game.create('timer',{id:'timer-pvz-conch-create',scene:scene,millisecond:4000,method:function(){this.scene.createConch(road)}}).start());
		}
	},'cvs')
});




