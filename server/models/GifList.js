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

function GifList(tag,start,limit,do_done){
	var gif_ref = fb_root.child("tags").child(tag);
	this.gifs = new Array();
	var self = this;
	var callback = do_done;
	gif_ref.on("value",function(snap){
		var data = snap.val();
		var keys = Object.keys(data);
		var list = [];

		async.forEachOf(keys,function(current,key,callback){
			Gif.getGifById(current,function(gif){
				list.push(gif);
				callback();
			});

		},function(err){
			if (err){
				console.log(err.message);
			}

			do_done(list.slice(start,start+limit));
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
