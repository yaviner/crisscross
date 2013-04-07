/**
* This class implements the logic for matching an event to our events table
* In gener we receive an updated calendar event and
* we try the following:
* 1) Match it against what we currently have on the events table. 
* 2) If 1) fails, We try to find it in seatgeek.com and create the event on the event table
* 3) If 2) fails, we create it as new event on the event table with the info from the calendar
*/

var dbAccess = require('./dbAccess');
var http = require('http');
var dateFormat = require('dateformat');

var event={ 
	event_id: '1',  
	start_date: 'Sat Apr 06 2013 00:00:00 GMT-0400 (Eastern Daylight Time)',
	end_date: 'Sat Apr 06 2013 00:00:00 GMT-0400 (Eastern Daylight Time)',
	description: 'some description2' 
}

function processNewCalendarEvent(userCalendarEvent, callback){
	console.log("Processing processNewCalendarEvent");
	checkExists(userCalendarEvent,function(response){});
}

function checkExists(userCalendarEvent,callback){
	console.log("Processing checkExists");
	var date=dateFormat(userCalendarEvent.date, "isoDateTime");
	var description=userCalendarEvent.description;
	searchSeatGeek(date,description,function(response){
		if(response.length==0){
			var event={ 
				event_id: 0,  
				start_date: response.datetime_local,
				end_date: response.datetime_local,
				description: response.description, 
			};
			dbAccess.addEvent
			
		}
	});
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
	
	http.get(url, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  var data='';
	  res.on('data', function (chunk) {
		data+=chunk;
	  });
	  res.on('end', function () {
		var DataJson = JSON.parse(data);
		callback(DataJson.events);
	  });
	  //callback(chunk);
	}).end();
}	

exports.processNewCalendarEvent=processNewCalendarEvent;
exports.searchSeatGeek=searchSeatGeek;