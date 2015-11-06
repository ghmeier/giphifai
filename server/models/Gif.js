var Firebase = require("firebase");
var request = require("request");
var fb_root = new Firebase("https://giphifai.firebaseio.com");

function Gif() {
	this.url = "";
	this.tags = new Array();
	this.id = "";
};

Gif.getGifById = function(id,callback){
	var gif_ref = fb_root.child("gifs").child(id);

	gif_ref.on("value",function(snap){
		var data = snap.val();
		return new Gif(data.url,data.id,data.tags,function(gif){
			callback(gif);
		});
	});
}

function Gif(url,id,tags){
	this.url = url;
	this.id = id;
	this.tags = tags;
}

function Gif(url,id,tags,callback){
	this.url = url;
	this.id=id;
	this.tags=tags;
	if (callback && typeof(callback) == 'function'){
		callback(this);
	}
}

Gif.prototype.create = function(callback){
	request.get("http://api.giphy.com/v1/gifs/random?api_key=124hpbJkl6DGOQ",function(err,res,body){
		var data = (JSON.parse(body)).data;
		this.url = data.fixed_height_downsampled_url;
		this.url = this.url.replace("_d.gif","_s.gif");
		this.id = data.id;
		callback(new Gif(this.url,this.id,this.tags));
	});
};

Gif.prototype.get = function(id, callback){
	var gifs = fb_root.child("gifs");
	gifs.on("value",function(s){
		var data = s.value();

		this.url = data.url;
		this.tags = data.tags.split(",");
		this.id = data.id;
		callback(new Gif(this.url,this.id,this.tags));
	});
};

Gif.prototype.push = function(callback){
	var gifs = fb_root.child("gifs");
	var tags = fb_root.child("tags");
	gifs.child(this.id).set(this);
	for (id in this.tags){
		var current = this.tags[id];
		var cur_ref = tags.child(current);

		cur_ref.child(this.id).set(this.id);
	}
	callback(this);
};

Gif.prototype.tag = function(callback){

	if (!this.url){
		return "First have a url before tagging";
	}

	console.log("Analyzing "+this.id);
	var cur_url = this.url;
	var self = this;

	request.post({
		url:"https://api.clarifai.com/v1/token",
		form:{
			"grant_type":"client_credentials",
			"client_id": "LtBAeH3T5UdE9uTYaiehZObqh1PZehqGOEwr064G",
			"client_secret":"BddH4Yro_9WsszRNkfyVLPNCGdcKk7Ljiooxbzm5"
		}
	},function(err,res,body){

		if (err){
			return err;
		}

		var token_data = JSON.parse(body);
		token = token_data.access_token;

		request.get({
			url:"http://api.clarifai.com/v1/tag?url="+cur_url,
			headers: {
				'Authorization':'Bearer '+token
			}
		},function(err,res,body){
			if (err){
				return err;
			}

			var data = JSON.parse(body);
			if (data.results && data.results[0].result && data.results[0].result.tag && data.results[0].result.tag.classes){
				self.tags = data.results[0].result.tag.classes[0];
			}else{
				//console.log(data);
				//return data;
			}

			callback(new Gif(cur_url,self.id,self.tags));
		});
	});
};

module.exports = Gif;
