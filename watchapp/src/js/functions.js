var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');
var config = require('Config.json');

var functions = module.exports;

//Functions
functions.setup = function () {
    if (!functions.getSetting('username') || !functions.getSetting('password')) {
        functions.showCard('Not setup', '', 'We have noticed that your username and password have not been setup. Please add them in the settings panel!');
    } else {
        var loading = functions.showCard('Devboard', 'Loading...', '');
        ajax({
            url: functions.getAPIURL(),
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
                    var menuItems = [data.length];
                    for (var i = 0; i < data.length; i++) {
                        menuItems[i] = {
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
                        };
                    }
                    var menu = new UI.Menu({
                        sections: [{
                            title: 'Projects - ' + menuItems.length, items: menuItems
                        }]
                    });

                    menu.on('select', function (event) {
                        functions.showCard(menuItems[event.itemIndex].title, menuItems[event.itemIndex].subtitle,'Installs: ' + menuItems[event.itemIndex].installs + '\nHearts: ' + menuItems[event.itemIndex].hearts + '\nLast Updated:\n' + menuItems[event.itemIndex].update_date + '\nAplite: ' + menuItems[event.itemIndex].aplite + '\nBasalt: ' + menuItems[event.itemIndex].basalt + '\nChalk: ' + menuItems[event.itemIndex].chalk + '\nAndroid: ' + menuItems[event.itemIndex].android + '\niOS: ' + menuItems[event.itemIndex].ios + '\nTimeline: ' + menuItems[event.itemIndex].timeline);
                    });
                    menu.show();
                } else {
                    functions.showAndRemoveCard('Error', 'You do not have any projects published!', '', loading);
                }
            }
        }, function (error) {
            functions.showAndRemoveCard('Error', 'Error contacting server.', '', loading);
        });
    }
};

functions.getSetting = function (setting, default_setting) {
    if (!default_setting) {
        default_setting = false;
    }
    return Settings.data(setting) !== null ? Settings.data(setting) : default_setting;
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

functions.getAPIURL = function () {
    return config.API_URL;
};

functions.getSettingsURL = function () {
    return config.SETTINGS_URL;
};