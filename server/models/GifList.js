var Firebase = require("firebase");
var Gif = require("./Gif");
var async = require("async");
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

function GifList(tag,do_done){
	var gif_ref = fb_root.child("tags").child(tag);
	this.gifs = new Array();
	var self = this;

	gif_ref.on("value",function(snap){
		var data = snap.val();
		var keys = Object.keys(data);
		var list = [];

		async.forEachOf(keys,function(current,key,callback){
			list.push(Gif.getGifById(current,callack));
			
			console.log("WORD");
		},function(err){
			if (err){
				console.log(err.message);
			}

			console.log("Done",list);
			do_done(list);
		});
	});
	
};

GifList.listTags = function(start,limit,callback){
	var tags = new Array();
	var tag_ref = fb_root.child("tags");
	tag_ref.on("value",function(snap){
		var data = snap.val();
		
		if (data){
			var keys = Object.keys(data);
			console.log(keys[start] + " " + keys[start+limit]);	
			callback(keys.slice(start,start+limit));
		}else{
			callback(null);
		}
	});

};



module.exports = GifList;
