/*
	Copyright (C) 2016  skhmt

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

 // vars 
var clientid = "3y2ofy4qcsvnaybw9ogdzwmwfode8y0"; /* this is the (public) client_id of KoalaBot. */
var bot;
var server = "irc.twitch.tv";
var fs;
var win;
var logFile;
var execPath;
var hosts = [];
var hostFile;
var viewers = [];
var startDate = new Date();
var subBadgeUrl = "";
var permitted = [];
var emoticonsTwitch = [];
var emoticonsBTTV = [];
var emoticonsBTTVall = [];

var settings = {
	access_token: "",
	username: "",
	channel: "",
	id: "",
	theme: "default"
};


$(document).ready( function() {
	
	var gui = require( "nw.gui" );
	var path = require( "path" );
	win = gui.Window.get();
	fs = require( "fs" );
	
	execPath = path.dirname( process.execPath );

	$("#saveOauth").click( function() {
		var newoauth = $("#getOauthField").val();
		if ( settings.access_token !== newoauth ) { // if you're changing user
			settings.access_token = newoauth;
			getUsername();
		}
		return false;
	} );

	$("#changeChannel").click( function() {
		var newchan = $("#getChannelField").val();
		if ( newchan.substring(0,1) !== "#" ) { // if the user forgot the #, add it
			newchan = `#${newchan}`;
			$("#getChannelField").val(newchan);
		}

		if ( newchan !== settings.channel ) { // if the channel is actually different
			bot.part( settings.channel, function(){
				log( `* Parting ${settings.channel}` );
			} );
			bot.join( newchan, function() {
				log( `* Joining ${newchan}` );
				settings.channel = newchan;
				onChannelEnter();
			} );
		}
	} );
	
	// making logs and settings directories
	try { fs.accessSync( `${execPath}\\logs` ); }
	catch (e) { fs.mkdirSync( `${execPath}\\logs` ); }
	
	try { fs.accessSync( `${execPath}\\settings` ); }
	catch (e) { fs.mkdirSync( `${execPath}\\settings` ); }
	
	
	hostFile = `${execPath}\\logs\\hosts.log`;


	// Setting up the chat log
	var d = new Date();
	var dmonth = d.getMonth() + 1;
	dmonth = dmonth < 10 ? "0" + dmonth : dmonth;
	var dday = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
	var dhour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
	var dmin = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
	var dsec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
	var logname = `chatlog_${d.getFullYear()}-${dmonth}-${dday}_${dhour}-${dmin}-${dsec}.log`;

	logFile = `${execPath}\\logs\\${logname}`;
	
	// setting up moderation area
	modSetup();
	
	// setting up the commands area
	cmdSetup();
	
	// getting twitch and bttv emoticons
	getEmoticons();
	
	// setting up timed messages
	timedMessagesSetup();
	
	// starting the timer
	timerSetup();
	
	// setting up stats stuff
	statsSetup();
	
	// setting up the raffle tab
	raffleSetup();

	// setting up songs
	songsSetup();

	// set up the events part
	eventSetup();
	
	// loading settings.ini
	try {
		var readFile = fs.readFileSync( `${execPath}\\settings\\settings.ini` );
		settings = $.parseJSON( readFile );

		// Setting up config area
		$("#getOauthField").val( settings.access_token );
		$("#getChannelField").val( settings.channel );
		$("#displayName").html( settings.username );

		// Setting up theme
		try {
			fs.readFileSync( `${execPath}\\themes\\${settings.theme}` );
			if ( settings.theme === "default" ) {
				$("#botTheme").attr( "href", `css\\bootstrap.min.css` );
				$("#botThemeCurrent").html("Default");
			} else {
				$("#botTheme").attr( "href", `${execPath}\\themes\\${settings.theme}` );
				$("#botThemeCurrent").html( settings.theme.split(".")[0] );
			}
		} catch (e) {
			$("#botTheme").attr( "href", `css\\bootstrap.min.css` );
			$("#botThemeCurrent").html("Default");
			settings.theme = "default";
		}

		// Running tabs
		runChat();
		onChannelEnter();
		save();
	} catch (e) {
		$("#getOauthField").val("");
		save();
	}

	//	populate the #botThemeList
	fs.readdir(`${execPath}\\themes`, function(err, files){

		for ( var f = 0; f < files.length; f++ ) {
			var splitName = files[f].split(".");
			if ( splitName[1] == "css" ) {
				$("#botThemeList").append(`
					<option value="${files[f]}">
						${splitName[0]}
					</option>`);
			}
		}
	} );

	$("#botThemeChange").click(function() {
		var tempTheme = $("#botThemeList").val();
		if ( tempTheme === "default" ) {
			$("#botTheme").attr( "href", `css\\bootstrap.min.css` );
			$("#botThemeCurrent").html("Default");
		} else {
			$("#botTheme").attr( "href", `${execPath}\\themes\\${tempTheme}` );
			$("#botThemeCurrent").html(tempTheme.split(".")[0]);
		}
		settings.theme = tempTheme;
		save();
		return false;
	} );


});

function getUsername() {
	var token = settings.access_token.substring(6);
	$.getJSON(
		"https://api.twitch.tv/kraken",
		{
			"client_id" : clientid,
			"api_version" : 3,
			"oauth_token" : token	
		},
		function( response ) {
			settings.username = response.token.user_name;
			$("#displayName").html( settings.username );
			
			settings.channel = "#" + settings.username;
			$("#getChannelField").val( settings.channel );

			save();	
			runChat();
			onChannelEnter();
		}
	);
}


function runChat() {
	
	try {
		bot.disconnect( function() {
			log( `* Disconnected from ${server}` );
		});
	} catch (e) {}

	var irc = require( "irc" );
	
	var config = {
		//channels: [settings.channel],
		server: server,
		username: settings.username,
		nick: settings.username,
		password: settings.access_token,
		sasl: true,
		autoConnect: false
	};

	bot = new irc.Client( config.server, config.nick, config );

	bot.connect(5, function() {
		log( `* Connected to ${server}` );
	} );
	
	bot.addListener( "registered", function( message ) {
		bot.send( "CAP REQ", "twitch.tv/membership" );
		bot.send( "CAP REQ", "twitch.tv/commands" );
		bot.send( "CAP REQ", "twitch.tv/tags" )
		bot.join( settings.channel, function() {
			log( "* Joining " + settings.channel );
		} );
	} );
	
	bot.addListener( "error", function( message ) {
		log( "* Error: " + message );
	} );
	
	bot.addListener( "raw", function( message ) {
		var args = message.args[0].split(" ");
		var command = message.command;
		
		if (false) { // logging all raw commands
			log( `<b>${message.rawCommand}</b>` );
			log( ` args: ${args}` );
		}
		
		parseMsg(command, args);
	} );
}

// This is run every time a channel is entered
function onChannelEnter() {

	// clearing the host file, hosts tab, and the list of hosts
	fs.writeFileSync( hostFile, "" );
	$("#hosts").html("");
	hosts = [];
	
	// getting when you change channel because it's channel-specific
	getEmoticonsBTTV();

	getFollowers();

	getSubs();

	// get subscriber image URL of the channel you're in
	$.getJSON(
		`https://api.twitch.tv/kraken/chat/${settings.channel.substring(1)}/badges`,
		{
			"client_id" : clientid,
			"api_version" : 3
		},
		function( response ) {
			if ( response.subscriber != null ) {
				subBadgeUrl = response.subscriber.image;
			}
		}
	);
	
	// get id of the channel you're in and current game and stream title
	$.getJSON(
		`https://api.twitch.tv/kraken/channels/${settings.channel.substring(1)}`,
		{
			"client_id" : clientid,
			"api_version" : 3
		},
		function( response ) {
			settings.id = response._id;
			eventSettings.isPartnered = response.partner;
			save();
			$("#gameField").val( response.game );
			$("#statusField").val( response.status );
		}
	);
}

function updateUserlist() {
	if ( settings.channel.substring(1) == "" || settings.channel.substring(1) == null ) return;
	$.getJSON(
		`https://tmi.twitch.tv/group/user/${settings.channel.substring(1)}/chatters`,
		{
			"client_id" : clientid,
			"api_version" : 3
		},
		function( response ) {
			
			if ( response.chatters == null || response.chatter_count === 0 ) return; // didn't load a user yet
			
			var output = `<b>Total viewers</b>: ${response.chatter_count}<br>`;
			
			exportViewers( response.chatter_count );
			
			var staffLen = response.chatters.staff.length;
			if ( staffLen > 0 ) {
				output += `<p> <b style='color: #6d35ac;'>STAFF (${staffLen})</b> <br> `;
				for ( var i = 0; i < staffLen; i++ ) {
					output += `${response.chatters.staff[i]} <br> `;
				}
				output += "</p> ";
			}

			var modLen = response.chatters.moderators.length;
			if ( modLen > 0 ) {
				output += `<p> <b style='color: #34ae0a;'>MODERATORS (${modLen})</b> <br> `;
				for ( var i = 0; i < modLen; i++ ) {
					output += `${response.chatters.moderators[i]} <br> `;
				}
				output += "</p> ";
			}

			var adminLen = response.chatters.admins.length;
			if ( adminLen > 0 ) {
				output += `<p> <b style='color: #faaf19;'>ADMINS (${adminLen})</b> <br> `;
				for ( var i = 0; i < adminLen; i++ ) {
					output += `${response.chatters.admins[i]} <br> `;
				}
				output += "</p> ";
			}

			var globalLen = response.chatters.global_mods.length;
			if ( globalLen > 0 ) {
				output += `<p> <b style='color: #1a7026;'>GLOBAL MODS (${globalLen})</b> <br> `;
				for ( var i = 0; i < globalLen; i++ ) {
					output += `${response.chatters.global_mods[i]} <br> `;
				}
				output += "</p> ";
			}

			var viewLen = response.chatters.viewers.length;
			if ( viewLen > 0 ) {
				output += `<p> <b style='color: #2e7db2;'>VIEWERS (${viewLen})</b> <br> `;
				for ( var i = 0; i < viewLen; i++ ) {
					output += `${response.chatters.viewers[i]} <br> `;
				}
				output += "</p> ";
			}

			$("#userlist").html( output );
		}
	);
}

function getEmoticons() {
	$.getJSON(
		"https://api.twitch.tv/kraken/chat/emoticons",
		{
			"client_id" : clientid,
			"api_version" : 3
		},
		function( response ) {
			if ( "emoticons" in response ) emoticonsTwitch = response.emoticons;
			else setTimeout( function() { getEmoticons(); }, 5*1000 );
		}
	);
}

function getEmoticonsBTTV() {
	$.getJSON(
		`https://api.betterttv.net/2/channels/${settings.channel.substring(1)}`,
		{},
		function ( response ) {
			if ( "emotes" in response ) emoticonsBTTV = response.emotes;
		}
	);

	$.getJSON(
		"https://api.betterttv.net/emotes",
		{},
		function ( response ) {
			if ( "emotes" in response ) emoticonsBTTVall = response.emotes;
		}
	);
}

function writeEmoticons( message ) {
	var output = "";
	var text = message.split(" ");
	
	// for each word, check if it's an emoticon and if it is, output the url instead of the text
	for( var i = 0; i < text.length; i++ ) {
		output += checkEmote(text[i]);
	}
	
	return output;
}

function checkEmote( word ) {
	// if the word is a single character, don't bother checking
	if( word.length < 2 ) return word + " ";

	// checking BTTV channel specific emotes first since it's smaller
	for( var j in emoticonsBTTV ) {
		if ( word === emoticonsBTTV[j].code )
			return `<img src="https://cdn.betterttv.net/emote/${emoticonsBTTV[j].id}/1x"> `;
	}

	// checking universal BTTV emotes
	for( var j in emoticonsBTTVall ) {
		if ( word === emoticonsBTTVall[j].regex )
			return `<img src="https:${emoticonsBTTVall[j].url}"> `;
	}

	// checking official Twitch emotes
	for( var j in emoticonsTwitch ) {
		if ( word === emoticonsTwitch[j].regex )
			return `<img src="${emoticonsTwitch[j].images[0].url}"> `;
	}
	
	// not an emote
	return `${word} `;
}

function log( message ) {
	var out = document.getElementById("console");

	// scrollHeight = element's total height including overflow
	// clientHeight = element's height including padding excluding horizontal scroll bar
	// scrollTop = distance from an element's top to its topmost visible content, it's 0 if there's no scrolling needed
	// allow 1px inaccuracy by adding 1

	// if it's scrolled to the bottom within 20px before a chat message shows up, set isScrolledToBottom to true
	var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 20;

	// add message
	$("#console").append( `${writeEmoticons(message)} <br>` );

	// if it was scrolled to the bottom before the message was appended, scroll to the bottom
	if( isScrolledToBottom )
		out.scrollTop = out.scrollHeight - out.clientHeight;

	// remove html tags before writing to the log
	var wrapped = $(`<div>${message}</div>`);
	message = wrapped.text();

	// write to log
	fs.appendFile( logFile, `${message}\r\n`, function ( err ) {
		if ( err ) $("#console").append(`* Error writing to log <br>`);
	} );
}

function chat() {
	// get the chat input box value
	var text = $("#chatText").val();
	
	// output it to the console
	log( `${getTimeStamp()} <b>&gt;</b> ${text.replace(/</g,"&lt;").replace(/>/g,"&gt;")}` );
	
	// check if it was a command...
	if ( text.substring(0, 1) === cmdSettings.symbol ) {
		parseCommand( text, settings.username, true, true);
	} 
	else {
		// send the data to the irc server
		bot.say( settings.channel, text );
	}
	
	// clear the chat input box
	$("#chatText").val("");
}

function getTimeStamp() {
	var dt = new Date();
	var hrs = dt.getHours();
	var mins = dt.getMinutes();
	// var secs = dt.getSeconds();

	if ( hrs < 10 ) hrs = "0" + hrs;
	if ( mins < 10 ) mins = "0" + mins;
	// if ( secs < 10 ) secs = "0" + secs;

	return `[${hrs}:${mins}]`;
}

function save() {
	// saving settings.ini
	fs.writeFile( `${execPath}\\settings\\settings.ini`, JSON.stringify( settings ), function ( err ) {
		if ( err ) log( "* Error saving settings" );
	} );

	// saving modSettings.ini
	fs.writeFile( `${execPath}\\settings\\modSettings.ini`, JSON.stringify( modSettings ), function ( err ) {
		if ( err ) log( "* Error saving modSettings" );
	} );

	// saving timedMessages.ini
	fs.writeFile( `${execPath}\\settings\\timedMessages.ini`, JSON.stringify( timedMessages ), function ( err ) {
		if ( err ) log( "* Error saving timedMessages" );
	} );

	// saving cmdSettings.ini
	fs.writeFile( `${execPath}\\settings\\cmdSettings.ini`, JSON.stringify( cmdSettings ), function ( err ) {
		if ( err ) log( "* Error saving cmdSettings" );
	} );

	// saving raffleSettings.ini
	fs.writeFile( `${execPath}\\settings\\raffleSettings.ini`, JSON.stringify( raffleSettings ), function ( err ) {
		if ( err ) log( "* Error saving raffleSettings" );
	} );

	// saving eventSettings.ini
	fs.writeFile( `${execPath}\\settings\\eventSettings.ini`, JSON.stringify( eventSettings ), function ( err ) {
		if ( err ) log( "* Error saving eventSettings" );
	} );
}