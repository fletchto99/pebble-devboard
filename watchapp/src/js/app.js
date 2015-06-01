//Imports
var Settings = require('settings');
var functions = require('functions');

var username = (Settings.data('username') ? 'username=' + encodeURIComponent(Settings.data('username')) : '');


Settings.config({url: functions.getSettingsURL() + username}, function (e) {
        if (!e.response) {
            console.log("No response from server?");
            return;
        }
        var data = JSON.parse(decodeURIComponent(e.response));
        Settings.data('username', data.username);
        Settings.data('password', data.password);
    });

//Setup the app
functions.setup();