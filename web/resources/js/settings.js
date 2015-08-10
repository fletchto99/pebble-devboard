function getQueryParam(variable, defaultValue) {
    var query = location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return defaultValue || '';
}

$(function () {

    var username = document.getElementById('username');
    var password = document.getElementById('password');
    var savebutton = document.getElementById('savebutton');
    var donatebutton = document.getElementById('donatebutton');

    donatebutton.addEventListener('click', function () {
        savebutton.disabled = true;
        donatebutton.value = 'Thank You!';
        donatebutton.disabled = true;
        document.location = 'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=3PXVE99RCWGRQ&lc=CA&item_name=Devboard%20for%20Pebble%20by%20Matt%20Langlois&currency_code=CAD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted&return=fletchto99.com/other/pebble/metup/settings.html';
    });

    savebutton.addEventListener('click', function() {

        if (username.value == '' || password.value == '') {
            alert('Invalid username or password entered!');
            return;
        }
        savebutton.value = 'Saving...';
        savebutton.disabled = true;
        $.ajax({
            type: "POST",
            url: "api.php",
            dataType: "json",
            data: {
                method: 'validatedeveloper',
                username: username.value,
                password: password.value
            },
            success: function (data) {
                if (data.status == 0) {
                    document.location = getQueryParam('return_to', 'pebblejs://close#') + encodeURIComponent(JSON.stringify({
                            'username': username.value,
                            'password': password.value
                    }));
                } else {
                    savebutton.value = 'Save';
                    savebutton.disabled = false;
                    alert(data.message);
                }
            },
            error: function (data) {
                savebutton.value = 'Save';
                savebutton.disabled = false;
                alert('An unknown error has occurred. Please close the settings and try again.');
            }
        });
    });

});