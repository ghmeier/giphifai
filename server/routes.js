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

	app.get("/tags",function(req,res){
		var start = parseInt(req.query.offset) || 0;
		var limit = parseInt(req.query.limit) || 25;
		var base_url = "http://localhost:3000/tags/";
		GifList.listTags(start,limit,function(tags){
			var string = "<div class='list'>";
			for (i=0;i<tags.length;i++){
				string += "<li><a href='"+base_url+tags[i]+"'>"+tags[i]+"</a></li>";
			}
			res.send(string);
		});
	});

	app.get("/tags/:tag",function(req,res){
        var start = parseInt(req.query.offset) || 0;
        var limit = parseInt(req.query.limit) || 25;
		var list = new GifList(req.params.tag,start,limit,function(list){
            var style = "<style>.gif-list {text-align: justify;font-size: 0;padding: 4% 4% 0 4%}"+
            ".gif {font-size: 1rem;display: inline-block;background: #eee;border: .125em solid;width: 40%;padding: 2%;margin-bottom:4%;}"+
            ".break {display: inline-block;width: 30%;height: 0}"+
            "</style>";


			var string = style+"<div class='gif-list'>";
            var base_url = "http://localhost:3000/tags/";
			for (i=0;i<list.length;i++){
				string += "<div class='gif'>";
				string += "<img style='display:block;margin-left:auto;margin-right:auto' src='"+list[i].url.replace(/_s/,"")+"'/>";
				string += "<p>";

                for (j=0;j<list[i].tags.length;j++){
                    string+="<a href='"+base_url+list[i].tags[j]+"'>#"+list[i].tags[j]+"</a> ";
                }
                string +="</p>";
				string += "</div>";
			}
            string +="<div class='break'></div></div>";

			res.send(string);
		});
	});

	app.get("*",function(req,res){
		res.render("index.html");
	});
};
