<?php

class Projects
{

    function __construct($scraper, $url)
    {
        $this -> projects = Functions::retrieveProjects($scraper, $url);
    }

    function execute()
    {
        $projects = [];
        if ($this -> projects['status'] == 0) {
            $projs = Functions::findElements($this -> projects['projects'], '.application');
            foreach($projs as $proj) {
                $project = [];
                $project['title'] = Functions::elementToPlaintext(Functions::findElement($proj,'.application-title' , 0));
                $releaseInfo = Functions::findElement($proj,'.application-release-info' , 0);
                $project['version'] = Functions::elementToPlaintext(Functions::findElement($releaseInfo,'p' , 0));
                $project['update_date'] = Functions::elementToPlaintext(Functions::findElement($releaseInfo,'p' , 1));
                $icons = strtolower(Functions::elementToText(Functions::findElement($proj,'.application-icons' , 0)));
                $project['aplite'] = (strpos($icons, 'aplite') !== false) ? 'true' : 'false';
                $project['basalt'] = (strpos($icons, 'basalt') !== false) ? 'true' : 'false';
                $project['timeline'] = (strpos($icons, 'timeline') !== false) ? 'Enabled' : 'Disabled';
                $stats = Functions::findElement($proj,'.application-stats' , 0);
                $project['hearts'] = intval(Functions::elementToPlaintext(Functions::findElement($stats,'p' , 0)));
                $project['installs'] = intval(Functions::elementToPlaintext(Functions::findElement($stats,'p' , 1)));
                array_push($projects, $project);
            }
        }
        $this -> projects['projects'] = $projects;
        return $this -> projects;

    }
}

?>