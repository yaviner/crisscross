/**
* This class implements the logic for matching an event to our events table
* In general we receive an updated calendar event and
* we try the following:
* 1) Match it against what we currently have on the events table. 
* 2) If 1) fails, We try to find it in seatgeek.com and create the event on the event table
* 3) If 2) fails, we create it as new event on the event table with the info from the calendar
*/

var dbAccess = require('./dbAccess');
var http = require('http');
var dateFormat = require('dateformat');

//Entry method
function processNewCalendarEvent(userId,userCalendarEvent, callback){
	console.log("Processing processNewCalendarEvent");
	checkExists(userCalendarEvent,function(response){
		dbAccess.addUserToEvent(userId,response,function(response)){};
	});
	
}

//Returns the eventId
function checkExists(userCalendarEvent,callback){
	console.log("Processing checkExists");
	var date=dateFormat(userCalendarEvent.date, "isoDateTime");
	var description=userCalendarEvent.description;
	//1) Search locally
	dbAccess.getEventByDateAndDescription(date,description, function(result){
		console.log('Local result: '+JSON.stringify(result));
		if(result.length>0){
			callback(result[0].event_id);
			return;
		}
		//2)Search SeatGeek
		searchSeatGeek(date,description,function(result){
			console.log('SeatGeet result: '+JSON.stringify(result));
			if(result.length>0){
			//If no response, add the event with info from calendar
				var event={ 
					event_id: 0,  
					start_date: result[0].datetime_local,
					end_date: result[0].datetime_local,
					description: result[0].title, 
					location_lat: result[0].venue.location.lat,
					location_long: result[0].venue.location.lon,
					picture_url: result[0].performers[0].image,										
				};
			}else{
			//If no response, add the event with info from calendar
				var event={ 
					event_id: 0,  
					start_date: date,
					end_date: date,
					description: description, 
					location_lat: 0,
					location_long: 0,
					picture_url: null,										
				};
			}
			//Create the new event and return
			dbAccess.addEvent(event,function(response){
				callback(response.event_id);
			});					
		});
	});
}

function searchLocalDB(date,description,callback){
}

function searchSeatGeek(date,description,callback){
	console.log("Processing searchSeekGeek");
	var options = {
	  host: 'api.seatgeek.com',
	  port: 80,
	  path: '/2/events?datetime_local'+[date]+'&q='+[description],
	  method: 'GET'
	};
	var url='http://api.seatgeek.com/2/events?datetime_local='+[date]+'&q='+[description];
	console.log('url='+url);
	http.get(url, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  res.setEncoding('utf8');
	  var data='';
	  res.on('data', function (chunk) {
		data+=chunk;
	  });
	  res.on('end', function () {
		var response=new Array();
		var index=0;
		var dataJson = JSON.parse(data).events;
		//Now we remove any venue that is not on the US
		while(dataJson.length>0){
			if(dataJson[0].venue.country == 'US') {
				response[index]=dataJson[0];
			}
			dataJson.splice(0, 1);			
		};
		//always return the first one
		callback(response);
	  });
	  //callback(chunk);
	}).end();
}	

exports.processNewCalendarEvent=processNewCalendarEvent;
