# KoalaBot, a chat bot for Twitch

![version 0.8](https://img.shields.io/badge/version-0.8-blue.svg?style=flat-square) ![gpl](https://img.shields.io/badge/license-GPLv3-red.svg?style=flat-square)

#### What is this?
It's a moderation bot for Twitch meant for roughly the same things as nightbot, moobot, ankhbot, deepbot, etc. This is and always will be free and open source. It runs off your desktop and although I only provide a Windows version, it's possible to make an OS X or Linux version fairly easily - you'll have to do that on your own, but I can point you in the right direction. I'm always open to feature requests, bug reports, and any constructive critique. Hit me up on [Twitch](http://www.twitch.tv/skhmt/profile) or [Twitter](https://twitter.com/SkTTV) or [Reddit](https://www.reddit.com/message/compose/?to=skhmt&subject=twitch%20bot).

#### Latest [Windows](https://github.com/Skhmt/twitch-bot/releases/) releases.

#### Features / to-do list:
- [x] Chat window with emoticons and viewer list
- [x] !highlight / !ht command to tag a place for VOD editing later
- [x] Quote system
- [x] Custom commands
- [x] Timed messages
- [x] Spam control via link, word, caps, symbols
- [x] Viewer count graphs
- [x] Customizable !uptime command based on bot running time, stream uptime, or a custom set time 
- [x] Chat logging
- [x] Hosts logging
- [x] Giveaways
- [x] Song requests
- [x] Follower logging
- [x] Sub notifications
- [x] Update backend to allow plugins
- [x] Loyalty points
- [ ] User ranks
- [ ] More text file outputs
- [ ] More variables for custom commands (custom api)
- [ ] Option to have song requests cost points
- [ ] Add "regular" rank (between viewer and sub)

#### Commands:
|Command|Parameters|Description|
|-------|-------------------|--------|
|**!bot**|n/a|*Links to this page.*|
|**!uptime**|n/a|*Configurable in the "Settings" tab to display either the bot uptime, the stream uptime, or the lap time.*|
|**!bottime**|n/a|*Shows the amount of time the bot has been open.*|
|**!streamtime**|n/a|*Shows the amount of time your stream has been going (if your stream disconnects, this resets).*|
|**!laptime**|n/a|*Shows the amount of time since you've hit the "lap" button.*|
|**!updawg**|n/a|*Replies with "What's !updawg ?"*|
|**!highlight**|(comments)|Mod-only. *Adds a time stamp to a log file (both local time and stream time) with the optional comments.*|
|**!ht**||*Same as above.*|
|**!game**|[game name]|Mod-only. *Changes the game.*|
|**!status**|[stream status]|Mod-only. *Changes the stream status.*|
|**!permit**|[username]|Mod-only. *Allows the user to post links for 60 seconds.*|
|**!addcom**|(-ul=[mod/sub/streamer]) [!commandname] [text]|Mod-only. *Adds a command. The new command can be set to only be used by a certain user level. Using %1%, %2%, %3%, %4%, or %5% when creating a command will replace it with that parameter when the command is run. For example, "!addcom !tree %1% and %2% sitting in a tree" then "!tree wolfish indy" would output "wolfish and indie sitting in a tree".*|
|**!addcmd**||*Same as above.*|
|**!delcom**|[!commandname]|Mod-only. *Deletes a command.*|
|**!delcmd**||*Same as above.*|
|**!quote**|(id)|*Plays a random quote. If an id is given, it will attempt to play the quote with that id.*|
|**!addquote**|[quote author] [quote]|*Adds a quote.*|
|**!delquote**|[id]|Mod-only. *Deletes the quote with the given id.*|
|**!currentsong**||*Returns the current song playing.*|
|**!skipsong**||Mod-only. *Skips the currently playing song.*|
|**!volume**|[volume 0-100]|Mod-only. *Sets the song volume to this.*|
|**!mute**||Mod-only. *Mutes/unmutes the song, does not change the volume level.*|
|**!songrequest**|[youtube id or youtube url]|*Adds a song to the queue.*|
|**!points**||*Displays your points.*|

#### How to use:
* Run bot.exe
* Go to the "Settings" Tab
* Click "Get Token"
* Follow the instructions
* Paste your oauth (ctrl-v) into the box
* Click "Save Token"
* If you're using the bot on an account other than the one you stream on, make sure the bot is both a mod and an editor for your channel. To make the bot an editor, go to your Twitch Dashboard on your main account.

#### Known issues:
* Some youtube videos won't play. I can't fix this, it's a nw.js problem.
* Dev Console is full of errors related to cast_sender.js. This is another youtube-related problem out of my hands. 

#### Making modules:
Modules are HTML5 + javascript (ES6) + jQuery (2.2.0) + Boostrap (3.3.6). See my [example module](https://gist.github.com/Skhmt/5b2f4300c0e7a82e654e) for working example. To install it, save it as a .js file and place it in the \mods\ folder, then restart the bot. Also see the [API](https://github.com/Skhmt/twitch-bot/blob/master/MODULE%20API.md) for more details and some functionality not used in example.js. Share modules via [JSFiddle](http://jsfiddle.net) or [Gist](http://gist.github.com).

#### Making themes:
Themes are just Bootstrap 3.3.6 .css files. Put them in the themes folder and restart the bot.

#### License:
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation version 3.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
[GNU General Public License](https://github.com/Skhmt/twitch-bot/blob/master/LICENSE) for more details.


#### Libs used:
* [nw.js 0.12.3](https://github.com/nwjs/nw.js/)
* [jQuery 2.2.0](https://jquery.com/)
* [Bootstrap 3.2.2](http://getbootstrap.com/)
* [node-irc 0.4.0](https://github.com/martynsmith/node-irc/)
* [plotly.js 1.1.1](https://github.com/plotly/plotly.js/)
