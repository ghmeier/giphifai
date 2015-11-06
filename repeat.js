var request = require("request");

var x = 0;
var finished = 0;

request.post("http://localhost:3000/analyze?num="+process.argv[2],function(err,res,body){
	console.log(body);
});

