# Bot for Twitch

![skhmt](https://img.shields.io/badge/made_by-skhmt-blue.svg?style=flat-square)
![version 0.4b](https://img.shields.io/badge/version-0.4b-blue.svg?style=flat-square) ![gpl](https://img.shields.io/badge/license-GPLv3-red.svg?style=flat-square)

##### Get the latest Windows build in the /dist/ folder

##### Features:
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
- [ ] Giveaways
- [ ] Song requests
- [ ] Sound / video playing in response to a command or event
- [ ] Loyalty points
- [ ] User ranks
- [ ] Mini games
- [ ] Poll
- [ ] More variables for custom commands
- [ ] Individually disable timed messages
- [ ] Individually disable custom and built-in commands
- [ ] Whispers (unlikely that it will be done)

##### To build from scratch on Windows:
* Get nw.js
* Pull everything from src on this repository
* Zip it to bot.zip (top level)
* Rename it to bot.nw
* Put bot.nw into the nw.js folder
* Open a console window (shift-rightclick in the folder)
* Run: `copy /b nw.exe+bot.nw bot.exe`
* You only need bot.exe, nw.pak, and icudtl.dat to run the program... for now at least.

Note: if you build your own version, you'll need to get your own clientid and make your own oauth page. Don't use this actual page, although you may copy and use it on your own site: https://github.com/Skhmt/skhmt.github.io/blob/master/bot/oauth.html

##### Libs used:
* [nw.js](https://github.com/nwjs/nw.js/)
* [jQuery](https://jquery.com/)
* [jQueryUI](https://jqueryui.com/)
* [node-irc](https://github.com/martynsmith/node-irc/)
* [plotly.js](https://github.com/plotly/plotly.js/)
