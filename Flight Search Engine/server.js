var http = require('http');
var fs = require('fs');

const PORT=8080; 
 http.createServer(function(request, response) {  
		try {
			if(request.url == "/"){
			
				fs.readFile('./index.html', function (err, file) {

					if (err) {
						response.writeHeader(200, {"Content-Type": "text/html"});  
						response.end();
					}else{
						response.writeHeader(200, {"Content-Type": "text/html"});  
						response.write(file);  
						response.end();
					}
				   
				});
			}else{
				fs.readFile("./"+request.url, function (err, html) {

					if (err) {
						response.writeHeader(200);  
						response.end();
					}else{
						response.writeHeader(200);  
						response.write(html);  
						response.end();
					}
						
				   
				});
			}
		}catch(err){
			
			
		}
		
          
    }).listen(PORT);
