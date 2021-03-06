<?php

class Functions {

    static function retrieveProjects(PebbleDevScraper $scraper, $developmentURL) {
        if (strpos($scraper->getContent(), 'Signed in successfully') !== false) {
            $html = $scraper->browse($developmentURL);
            $tables = self::findElements($html, 'table[class=application-table]');
            $tablesText = "";
            foreach($tables as $table) {
                $tablesText .= self::findElement($table,'table' , 0);
            }
            if ($tables) {
                return ['status' => 0, 'message' => 'Dev account found!', 'projects' => $tablesText];
            }

            return ['status' => 1, 'message' => 'Login successful but we were unable to determine your project\'s status..'];
        }

        return ['status' => -1, 'message' => 'Error logging into account, was your password changed?'];
    }

    static function findElement($html, $class, $pos) {
        $DOM = new simple_html_dom();
        $DOM->load($html);
        if ($DOM->find($class)) {
            return array_values($DOM->find($class))[$pos];
        }

        return false;
    }

    static function findElements($html, $class) {
        $DOM = new simple_html_dom();
        $DOM->load($html);
        if ($DOM->find($class)) {
            return $DOM->find($class);
        }

        return null;
    }

    static function elementToPlaintext($DOMelement) {
        return trim($DOMelement->plaintext);
    }

    static function elementToText($DOMelement) {
        return trim($DOMelement->outertext);
    }

}