var xmlreader = require('../cloud/xmlreader.js');

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('searchMALDatabase', function(request, response) {
  var query = request.params.query;
  var queryType = request.params.type;
  console.log()
  var queryUrl = "http://oduwa:uchiha16@myanimelist.net/api/" + queryType + "/search.xml?q=" + query;

  Parse.Cloud.httpRequest({
	  url: queryUrl,
	  success: function(httpResponse) {
      var xml = httpResponse.text;

      /* Use regex to switch out all images */
      var regex = /().*?(<\/image>)/g;
      xml = xml.replace(regex, "<image>http://oduwa.github.io/img/animehub-logo.png</image>");

      response.success(xml);
    },
	  error: function(httpResponse) {
	    console.error('Request failed with response code ' + httpResponse.status);
	  }
  });
});

Parse.Cloud.define('fetchMangaList', function(request, response) {
  //var queryUrl = "https://www.mangaeden.com/api/list/0/";
  var queryUrl = "http://oduwa.github.io/Hosting/allowed.json";
  //var queryUrl = "http://oduwa.github.io/Hosting/banned.json";

  Parse.Cloud.httpRequest({
	  url: queryUrl,
	  success: function(httpResponse) {
      var json = httpResponse.text;
      response.success(json);
    },
	  error: function(httpResponse) {
	    console.error('Request failed with response code ' + httpResponse.status);
	  }
  });
});

//curl -X POST   -H "X-Parse-Application-Id: sZHbbjk7aiDf4RG3vnJch1ZVxsqZDJXZOcmeFVqS"   -H "X-Parse-REST-API-Key: JLKFbYu1JcQ4K1xXsJIU5UU9GjJfMi60UREfMzt6"   -H "Content-Type: application/json" -d '{"query": "t", "type": "anime"}'   https://animehub-server.herokuapp.com/parse/functions/searchMALDatabase

Parse.Cloud.define("parseHaruhichan", function(request, response) {

	/* Get Haruhichans blog news */
	Parse.Cloud.httpRequest({
	  url: 'http://haruhichan.com/wpblog/feed/',
	  success: function(httpResponse) {
	    //console.log(httpResponse.text);
		var xml = httpResponse.text;
		var count;

		/* Variable Initialization */
		var result = "";
		var title = "";
		var link = "";
		var description = "";
		var pubDate = "";

		/* Read xml returned from the http reqquest */
		xmlreader.read(xml, function (err, res) {
		    // use xmldata...
			if(err){
				return console.log(err);
			}

			count = res.rss.channel.item.count();

		 	var Posts = Parse.Object.extend("Haruhichan");
			//var Feeds = Parse.Object.extend("Feeds");

		 	/* First clear entries */
			var Posts = Parse.Object.extend("Haruhichan");
			var oldTitlesArray = new Array(10);
			var dummyPost = new Posts();
			// save some empty thing just in case so query.find can execute its block
			dummyPost.save(null, {
			  success: function(dummyPost) {

	  		 	var query = new Parse.Query(Posts);
	  		 	query.find({
	  		   	 success: function(results) {
	  		     	// Clear previous values in table
	  		     	for (var j = 0; j < results.length; j++) {
	  		       	 var object = results[j];

				 	 oldTitlesArray[j] = object.get("title");

	  				 if(j == results.length - 1){
	  					 object.destroy({
	  					   success: function(object) {
	  			   			// using the .count() and the .at() function, you can loop through nodes with the same name:
	  			   			 for(var i = 0; i < res.rss.channel.item.count(); i++){
	  			   				 //result = result.concat(" <br />", res.rss.channel.item.at(i).title.text());

	  			   				 title = res.rss.channel.item.at(i).title.text();
	  			   				 link = res.rss.channel.item.at(i).link.text();
	  			   				 description = res.rss.channel.item.at(i).description.text();
	  			   				 pubDate = res.rss.channel.item.at(i).pubDate.text();

	  			   				 /* Save new data */
	  			   				 var post = new Posts();
								 //var feed = new Feeds();
								 //var relation = feed.relation("items");


	  			   				 post.set("title", title);
	  			   				 post.set("link", link);
	  			   				 post.set("description", description);
	  			   				 post.set("pubDate", pubDate);

	  							 /* Get Image URLS for all entries from their descriptions*/
	  							 var imageURLs = [];
	  							 var regex = /(<img\s[\s\S]*?src\s*?=\s*?['"](.*?)['"][\s\S]*?>+?)/g;
	  							 var match = regex.exec(description);
	  							 if(match.length > 1){
	  								 //console.log(match);
	  								 post.set("img", match[match.length-1]);
	  							 }
	  							 else{
	  							 	post.set("img", "http://plamoya.com/bmz_cache/a/a0cd801510e1ea3146454af5a9ecca17.image.132x132.jpg");
	  							 }

   	  			   				 if(i == res.rss.channel.item.count() - 1){
   	  			   					 post.save(null, {
   	  			   					   success: function(post) {
										   // last callback: check the newly fetched posts if theres any new titles
										   var query = new Parse.Query(Posts);
										   query.notContainedIn("title", oldTitlesArray);
										   query.find().then(function(results) {
										    	var promises = [];
												pushCount = results.length;
												/*
												///* Iterate through results
										    	for (var i = 0; i < results.length; i++){
										         	var object = results[i];
										   			var pushTitle = object.get('title');

										         	// PUSH NOTIFICATION WITH OBJECTS TITLE /
										   			var pushQuery = new Parse.Query(Parse.Installation);
										   			pushQuery.equalTo('deviceType', 'ios');
										   			pushQuery.equalTo('optedIn', true);

										   			promises.push(
										   				Parse.Push.send({
										   		    		where: pushQuery, // Set our Installation query
										   					expiration_interval: 7200,
										   		    		data: {alert: "Haruhichan - " + pushTitle, sound: "tuturu.caf", badge: "Increment"}
										   				})
										   			)
										   			/// END PUSH NOTIFICATION WITH OBJECTS TITLE /
										   			console.log("PUSH i = " + i);
										    	}// end iteration

											pushCount = results.length;
										   	// wait till all the notifications sent
										   	return Parse.Promise.when(promises);
											*/

										   }).then(function(){
										   		response.success(pushCount);
										   });
   	  			   					   },
   	  			   					   error: function(post, error) {
   	  			   					   }
   	  			   					 });
   	  			   				 }
	  			   				 else{
	  			   				 	post.save();
	  			   				 }

	  			   			 }// end xml parse loop

	  					   },
	  					   error: function(object, error) {
	  					     // The delete failed.
	  					     // error is a Parse.Error with an error code and description.
	  					   }
	  					 });
	  				 }
	  				 else{
	  				 	object.destroy();
	  				 }
	  		     	}
	  		   	},
	  		  	 error: function(error) {
	  		     	// handle error
	  		   	}
	  		 	});

			  },
			  error: function(dummyPost, error) {
				  // dummy post error
			  }
			});
		 	// was here

		});
	  },
	  error: function(httpResponse) {
	    console.error('Request failed with response code ' + httpResponse.status);
	  }
	});

});

// curl -X POST \
//   -H "X-Parse-Application-Id: sZHbbjk7aiDf4RG3vnJch1ZVxsqZDJXZOcmeFVqS" \
//   -H "X-Parse-REST-API-Key: JLKFbYu1JcQ4K1xXsJIU5UU9GjJfMi60UREfMzt6" \
//   -H "Content-Type: application/json" \
//   https://animehub-server.herokuapp.com/parse/functions/parseHaruhichan
