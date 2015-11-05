var secrets = require("./config/secrets");
var Gif = require("./models/Gif");
var GifList = require("./models/GifList");

module.exports = function(app,passport){
	app.get("/",function(req,res){
		res.send("pong");
	});

	app.get("/analyze",function(req,res){
		var max = req.query.num || 1;
		var x = 0,fin = 0, success = 0;
		while (x < max){
			var current = new Gif();
			current.create(function(done){ 
				done.tag(function(tagged){
					tagged.push(function(up){
						if (++fin >= max){
							res.json({success:success,message:"Tagged "+success+" gifs."});
						}
						
						if (up.tags){
							success++;
						//res.json(up);
						}
					});
				});
			});
			x++;
		}
		
	});

	app.get("/tags",function(req,res){
		var start = parseInt(req.query.offset) || 0;
		var limit = parseInt(req.query.limit) || 25;
		GifList.listTags(start,limit,function(tags){
			res.json({tags:tags});
		});
	});

	app.get("/tags/:tag",function(req,res){
		var list = new GifList(req.params.tag,function(list){
			res.json({list:list});
		});
	});

};
