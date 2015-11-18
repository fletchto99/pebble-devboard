var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');
var config = require("Config.json");


var functions = module.exports;

//Functions
functions.init = function () {
    if (!functions.getSetting('username') || !functions.getSetting('password')) {
        return functions.showCard('Not setup', '', 'We have noticed that your username and password have not been setup. Please add them in the settings panel!');
    }
    var loading = functions.showCard('Devboard', 'Loading...', '');
    ajax({
        url: config.API_URL,
        type: 'json',
        method: 'post',
        data: {
            username: functions.getSetting('username'),
            password: functions.getSetting('password'),
            method: 'projects'
        }, cache: false
    }, function (data) {
        if (data.status != 0) {
            functions.showAndRemoveCard('Error', '', data.message, loading);
        } else {
            if (data.projects.length > 0) {
                loading.hide();
                data = data.projects;
                var publishedMenuItems = [];
                var incompleteMenuItems = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].version) {
                        publishedMenuItems.push({
                            title: data[i].title,
                            subtitle: "Version: " + data[i].version,
                            update_date: data[i].update_date,
                            aplite: data[i].aplite,
                            basalt: data[i].basalt,
                            chalk: data[i].chalk,
                            ios: data[i].ios,
                            android: data[i].android,
                            timeline: data[i].timeline,
                            hearts: data[i].hearts,
                            installs: data[i].installs
                        });
                    } else {
                        incompleteMenuItems.push({
                            title: data[i].title,
                            subtitle: "Version: " + data[i].version,
                            update_date: data[i].update_date,
                            aplite: data[i].aplite,
                            basalt: data[i].basalt,
                            chalk: data[i].chalk,
                            ios: data[i].ios,
                            android: data[i].android,
                            timeline: data[i].timeline,
                            hearts: data[i].hearts,
                            installs: data[i].installs
                        });
                    }


                }
                var menu = new UI.Menu({
                    sections: [{
                        title: 'Published - ' + publishedMenuItems.length, items: publishedMenuItems
                    },{
                        title: 'Incomplete - ' + incompleteMenuItems.length, items: incompleteMenuItems
                    }]
                });

                menu.on('select', function (event) {
                    functions.showCard(event.item.title, event.item.subtitle,'Installs: ' + event.item.installs + '\nHearts: ' + event.item.hearts + '\nLast Updated:\n' + event.item.update_date + '\nAplite: ' + event.item.aplite + '\nBasalt: ' + event.item.basalt + '\nChalk: ' + event.item.chalk + '\nAndroid: ' + event.item.android + '\niOS: ' + event.item.ios + '\nTimeline: ' + event.item.timeline);
                });
                menu.show();
            } else {
                functions.showAndRemoveCard('Error', 'You do not have any projects published!', '', loading);
            }
        }
    }, function () {
        functions.showAndRemoveCard('Error', 'Error contacting server.', '', loading);
    });
    return null;
};

functions.getSetting = function (setting, default_setting) {
    if (!default_setting) {
        default_setting = false;
    }
    return Settings.option(setting) !== null ? Settings.option(setting) : default_setting;
};

functions.showCard = function (title, subtitle, body) {
    return functions.showAndRemoveCard(title, subtitle, body, null);
};

functions.showAndRemoveCard = function (title, subtitle, body, old) {
    if (old !== null) {
        old.hide();
    }
    var card = new UI.Card({title: title, subtitle: subtitle, body: body, scrollable: true});
    card.show();
    return card;
};