<?php
class Configuration {

    static function getConfiguration() {
        $config['LOGIN_URL'] = 'https://auth.getpebble.com/users/sign_in';
        $config['DEVELOPMENT_URL'] = 'https://dev-portal.getpebble.com/users/auth/pebble';
        $config['MAINTENANCE_MODE'] = false;
        return $config;
    }
}