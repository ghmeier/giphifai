var secrets = require("./config/secrets");
var Gif = require("./models/Gif");
var GifList = require("./models/GifList");

module.exports = function(app,passport){

	app.get("/ping",function(req,res){
		res.send("pong");
	});

	app.post("/analyze",function(req,res){
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
        //res.json({success:false,message:"Tagged "+success+" gifs."});

	});

	app.post("/tags",function(req,res){
		var start = parseInt(req.query.offset) || 0;
		var limit = parseInt(req.query.limit) || 25;

		GifList.listTags(start,limit,function(tags){
			res.json({tags:tags});
		});
	});

	app.post("/tags/:tag",function(req,res){
        var start = parseInt(req.query.offset) || 0;
        var limit = parseInt(req.query.limit) || 25;
		var list = new GifList(req.params.tag,start,limit,function(list){
			res.json({list:list});
		});
	});

	app.post("/search",function(req,res){
		var query = req.query.q;
		var start = parseInt(req.query.offset) || 0;
		var limit = parseInt(req.query.limit) || 25;

		GifList.searchByTag(query,start,limit,function(data){
			res.json({tags:data.tags,list:data.list});
		})
	})

	app.get("*",function(req,res){
		res.render("index.html");
	});
};
