var Firebase = require("firebase");
//var Gif = require("Gif");
var fb_root = new Firebase("https://giphifai.firebaseio.com");

function GifList(){
	var gifs = fb_root.child("gifs");
	this.gifs = new Array();

	gifs.on("value",function(snap){
		var data = snap.val();
		var keys = Object.keys(data);
		
		for (id in keys){
			var current = data[keys[id]];
			
			this.gifs.push(new Gif(current.url,current.id,current.tags));

		}
		
	});
};

function GifList(tag){
	var gifs = fb_root.child("tags").child(tag);
	this.gifs = new Array();

	if (gifs.hasChild()){
		gifs.on("value",function(snap){
			var data = snap.val();
			var keys = Object.keys(data);

			for (id in keys){
				var current = data[keys[id]];

				this.gifs.push(new Gif(current.url,current.id,current.tags));
			}
		});
	}
};

GifList.listTags = function(start,limit,callback){
	var tags = new Array();
	console.log(start,limit);
	var tag_ref = fb_root.child("tags").startAt(start).limitToFirst(limit);

	tag_ref.on("value",function(snap){
		var data = snap.val();
		console.log(data);
		if (data){
		var keys = Object.keys(data);
		
			callback(keys);
		}else{
			callback(null);
		}
	});

};



module.exports = GifList;
