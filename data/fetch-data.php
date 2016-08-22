<?php

	$GLOBALS['data'] = false;


	$action = $_POST['action'];
	if ($action == "fillin") {
		$GLOBALS['data'] = preparedata();

		if ($GLOBALS['data'] !== false) {
			echo json_encode($GLOBALS['data']);
		} else {
			echo json_encode('Error');
		}
	} else if ($action == "updatesnippet") {
		$author = $_POST['author'];
		$piece = $_POST['piece'];
		$snippet = getSnippet($author, $piece);
		echo json_encode($snippet);
	}

	function preparedata() {
		$cat = @fopen(dirname(__DIR__) . "/data/content/data.txt", "r");
		if ($cat) {
			$data = array();
			while (($line = fgets($cat)) !== false) {
				
				$list = explode(': ', $line, 2);
				if ($list === false) {
					die();
				} else {
					$pieces = array();
					$authorid = trim($list[0]);
					$authorname = trim($list[1]);

					if ($dir = opendir(dirname(__DIR__) . "/data/content/" . $authorid)) {
    					while (false !== ($files = readdir($dir))) {
        					if ($files != "." && $files != "..") {

        						$piece = (false !== strpos($files, '.')) ? substr($files, 0, strrpos($files, '.')) : $files;
        						$snippet = getSnippet($authorid, $piece);
        						if (is_array($snippet)) {
									$pieces[] = array(
	    	    						'title'		=> $piece,
    	    							'snippet'	=> $snippet[0],
    	    							'chapter'	=> $snippet[1]
        							);
        						} else {
        							$pieces[] = array(
	    	    						'title'		=> $piece,
    	    							'snippet'	=> $snippet
        							);
        						}
        					}
	    				}

    					closedir($dir);

    					$piecessorted = array();
    					foreach($pieces as $p){ 
							foreach($p as $key => $value){ 
        						if (!isset($piecessorted[$key])){ 
    	        					$piecessorted[$key] = array(); 
	        					}
        						$piecessorted[$key][] = $value; 
							}
						} 
						array_multisort($piecessorted['title'], SORT_ASC, $pieces); 
    					
    					$data[$authorid] = array(
							'name' 		=> $authorname,
							'pieces'	=> $pieces
						);
    				}
				}
			}

			fclose($cat);
			return $data;
		} else {
			return false;
		}
	}

	function getSnippet($authorid, $piece) {
		$minsentences = 30;
		$minwords = 500;
		$chapter = '';
		$path = dirname(__DIR__) . "/data/content/" . $authorid . "/" . $piece;

		if ($subdir = opendir($path)) {
			$chapter = array();
			while (false !== ($files = readdir($subdir))) {
				if ($files != "." && $files != "..") {
					$chapter[] = $files;
				}
			}
			closedir($subdir);

			$rand = rand(0, count($chapter) - 1);
			$chapter = $chapter[$rand];
			$text = file_get_contents($path . "/" . $chapter);
		} else {
			$text = file_get_contents($path . ".txt");
		}

		if (false !== $text) {
			$found = false;
			while (false === $found) {
				$sent = $text;
    			$sent = preg_split('/(?<=[.…?!;:])\s+/', $sent, -1, PREG_SPLIT_NO_EMPTY);

				$randsent = rand(0, (count($sent) - 1));
				$snippet = substr($text, strpos($text, $sent[$randsent]));

				$snippetwords = explode(" ", $snippet);
				$snippetsize = sizeof($snippetwords);

				$snippetsent = trim(implode(" ", $snippetwords));
    			$snippetsent = preg_split('/(?<=[.…?!;:])\s+/', $snippetsent, -1, PREG_SPLIT_NO_EMPTY);
				$sentsize = count($snippetsent);

				if ($snippetsize >= $minwords && $sentsize >= $minsentences) {
					$found = true;
				}
			}

			$snippetwords = array_slice($snippetwords, 0, $minwords);
			$text = trim(implode(" ", $snippetwords));

			if ($chapter != '') {
				return array(ucfirst($text), substr($chapter, 0, strrpos($chapter, '.')));
			} else {
				return ucfirst($text);
			}
		} else {
			return false;
		}
	}
?>
