function getQueryParam(variable, default_) {
    var query = location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return default_ || false;
}

function saveOptions(username, password) {
    return {
        'username': username,
        'password': password
    };
}

$(document).ready(function () {
    var username = $('#username');
    var password = $('#password');
    var options = $('#options');
    var progress = $('#progress');
    var button_save = $('#save');
    var button_cancel = $('#cancel');

    progress.hide();
    button_cancel.click(function () {
        document.location = getQueryParam('return_to', 'pebblejs://close#');
    });
    button_save.click(function () {
        if (username.val() == '' || password.val() == '') {
            alert('Invalid username or password entered!');
            return;
        }
        options.fadeToggle('1000', function () {
            progress.fadeToggle('1000');
        });


        $.ajax({
            type: "POST",
            url: "api.php",
            dataType: "json",
            data: {
                method: 'validatedeveloper',
                username: username.val(),
                password: password.val()
            },
            success: function (data) {
                if (data.status == 0) {
                    progress.fadeToggle('1000');
                    document.location = getQueryParam('return_to', 'pebblejs://close#') + encodeURIComponent(JSON.stringify(saveOptions(username.val(), password.val())));
                } else {
                    progress.fadeToggle('1000', function () {
                        options.fadeToggle('1000', function() {
                            alert(data.message);
                        });
                    });
                }
            },
            error: function(data) {
                progress.fadeToggle('1000', function () {
                    options.fadeToggle('1000', function() {
                        alert('An unknown error has occurred. Please close the settings and try again.');
                    });
                });
            }
        });

    });
});