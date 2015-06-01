<?php

class PebbleDevScraper
{
    private $email;
    private $password;
    private $cookie;
    private $content = '';


    public function __construct($email, $password)
    {
        $this->email = $email;
        $this->password = $password;
        $this -> cookie = tempnam('', 'pebble-');
    }

    public function login($loginURL) {
        $html = $this -> cURL($loginURL);
        $token = $this -> getFormFields($html, 'new_user')['authenticity_token'];
        $form_data = ['authenticity_token' => $token, 'user[email]' => $this -> email, 'user[password]' => $this -> password];
        return $this -> cURL($loginURL, $form_data);
    }

    private function getFormFields($data, $id)
    {
        if (preg_match('/(<form.*?id=.?' . $id . '.*?<\/form>)/is', $data, $matches)) {
            $inputs = $this->getInputs($matches[1]);

            return $inputs;
        } else {
            return false;
        }

    }

    /* Get Inputs in form */
    private function getInputs($form)
    {
        $inputs = array();

        $elements = preg_match_all('/(<input[^>]+>)/is', $form, $matches);

        if ($elements > 0) {
            for ($i = 0; $i < $elements; $i++) {
                $el = preg_replace('/\s{2,}/', ' ', $matches[1][$i]);

                if (preg_match('/name=(?:["\'])?([^"\'\s]*)/i', $el, $name)) {
                    $name = $name[1];
                    $value = '';

                    if (preg_match('/value=(?:["\'])?([^"\']*)/i', $el, $value)) {
                        $value = $value[1];
                    }

                    $inputs[$name] = $value;
                }
            }
        }

        return $inputs;
    }


    public function browse($url)
    {
        return $this -> cURL($url);
    }

    private function cURL($url, $postData = null)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
        curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);
        curl_setopt($ch, CURLOPT_FRESH_CONNECT, FALSE);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)");
        curl_setopt($ch, CURLOPT_COOKIEFILE, $this->cookie);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $this->cookie);

        if ($postData)
        {
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        }

        $this -> content = curl_exec($ch);

        curl_close($ch);
        return $this -> getContent();
    }

    public function getContent() {
        return $this -> content;
    }


}