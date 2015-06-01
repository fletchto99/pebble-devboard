<?php

require_once 'PebbleDevScraper.php';
require_once 'functions/Projects.php';

class FunctionCallHandler
{

    private $result = array('error' => 'Username or password not configured correctly.');

    function __construct($config, $username, $password)
    {
        $this->config = $config;
        $this->username = $username;
        $this->password = $password;
        $this -> scraper = new PebbleDevScraper($username, $password);
        $this -> scraper -> login($config['LOGIN_URL']);
    }

    function execute($method)
    {
        if ($this->username && $this->password) {
            switch ($method) {
                case 'validatedeveloper':
                    $this ->result= Functions::retrieveProjects($this -> scraper, $this -> config['DEVELOPMENT_URL']);
                    break;
                case 'projects':
                    $projects = new Projects($this -> scraper, $this -> config['DEVELOPMENT_URL']);
                    $this->result = $projects->execute();
                    break;
                default:
                    $this->result['error'] = 'Error executing option, please try again later.';
                    break;
            }
        }
        echo json_encode($this->result);
    }

}