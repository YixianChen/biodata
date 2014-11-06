<?php

session_start();

require_once('db.php');

include('protodb.php');

DB::config( array( "prefix" => $dbprefix) );

if (!isset($_REQUEST['cmd'])) exit;

if ($_SERVER['REQUEST_METHOD']=="POST") {
	echo "post";

	switch($_REQUEST['cmd']) {
	case "data":
		$type = $_POST['type'];
		$user = $_POST['user'];
		$samples = $_POST['samples'];
//		DB::insert("status", array("type" => $type));
//		DB::insert("status", array("type" => $type, "num" => count($samples)));
//		DB::insert("samples", array("user" => "rost"));

		mysql_query("CREATE TABLE IF NOT EXISTS {$dbprefix}samples (`time` BIGINT NOT NULL PRIMARY KEY, `type` TEXT, `gsr` FLOAT, `acc` FLOAT, `user` TEXT)");
		echo mysql_error();
		mysql_query("CREATE TABLE IF NOT EXISTS {$dbprefix}sample_tags (`time` BIGINT NOT NULL PRIMARY KEY, `tag` TEXT, `user` TEXT)");
		echo mysql_error();
		mysql_query("CREATE TABLE IF NOT EXISTS {$dbprefix}sample_acc (`time` BIGINT NOT NULL PRIMARY KEY, `user` TEXT, `x` FLOAT, `y` FLOAT, `z` FLOAT)");
		echo mysql_error();
		mysql_query("CREATE TABLE IF NOT EXISTS {$dbprefix}biodata (`time` BIGINT(20) NOT NULL, `type` TEXT, `gsr` FLOAT, `acc` FLOAT, `user` VARCHAR(200) NOT NULL, `tag` TEXT, `lantitude` DECIMAL, `longitude` DECIMAL, `unused_1` TEXT, `unused_2` TEXT, `unused_3` TEXT, PRIMARY KEY (`user`,`time`))");
		echo mysql_error();
		mysql_query("CREATE TABLE IF NOT EXISTS {$dbprefix}tagyourplace (`time` BIGINT(20) NOT NULL, `type` TEXT, `latitude` FLOAT, `longitude` FLOAT, `user` VARCHAR(200) NOT NULL, `tag` TEXT, PRIMARY KEY (`user`,`time`))");
		echo mysql_error();

		switch($type) {
		case "GSR":
		echo "GSR<br />";
		echo $samples."<br />";
			$values = array();
			$cols = "(`type`,`time`,`gsr`,`acc`,`user`)";
			for ($i=0;$i<count($samples);$i++) {
				$sample = json_decode((string)$samples[$i]);
				//echo $i, ' ', $samples, ' ', $sample->t, '<br/>';

				//DB::insert("samples", array("type" => $type, "time" => $sample->t, "gsr" => $sample->gsr, "acc" => $sample->acc));
                //var_dump($sample);
				$values[] = "'$type','".$sample->t."','".$sample->gsr."','".$sample->acc."','" . $user . "'";
				
			}
			$values = "(" . implode("),(",$values) . ")";
			$mysql= "INSERT INTO {$dbprefix}biodata $cols VALUES $values";
			echo $mysql;
			mysql_query($mysql);
			echo mysql_error();
			
//			echo $values;
			break;
		case "TAG":
			$values = array();
			$cols = "(`time`,`tag`,`user`)";
			for ($i=0;$i<count($samples);$i++) {
				$sample = json_decode((string)$samples[$i]);
//				DB::insert("samples", array("type" => $type, "time" => $sample->t, "gsr" => $sample->gsr, "acc" => $sample->acc));
				$values[] = "'".$sample->t."','".$sample->tag."','" . $user . "'";
		        $time= '$sample->t';
				$update = "tag=$sample->tag" ;
			}
			$values = "(" . implode("),(",$values) . ")";
			mysql_query("INSERT INTO {$dbprefix}biodata $cols VALUES $values");
			echo mysql_error();
			mysql_query("INSERT INTO {$dbprefix}sample_tags $cols VALUES $values");
			echo mysql_error();
			
//			echo $values;
			break;
		case "ACC":
			$values = array();
			$cols = "(`time`,`user`, `x`, `y`, `z`)";
			for ($i=0;$i<count($samples);$i++) {
				$sample = json_decode((string)$samples[$i]);
//				DB::insert("samples", array("type" => $type, "time" => $sample->t, "gsr" => $sample->gsr, "acc" => $sample->acc));
				$values[] = "'".$sample->t."','".$sample->longitude."','".$sample->latitude."','".$sample->tag."','" . $user . "'";
			}
			$values = "(" . implode("),(",$values) . ")";
			mysql_query("INSERT INTO {$dbprefix}sample_acc $cols VALUES $values");
			echo mysql_error();
			
//			echo $values;
			break;
		case "GPS":
			$values = array();
			$cols = "(`type`,`time`, `user`, `latitude`, `longitude`,`tag`)";
			for ($i=0;$i<count($samples);$i++) {
				$sample = json_decode((string)$samples[$i]);
//				DB::insert("samples", array("type" => $type, "time" => $sample->t, "gsr" => $sample->gsr, "acc" => $sample->acc));
				$values[] = "'$type','".$sample->t."','" . $user . "','" .$sample->latitude. "','" .$sample->longitude. "','" .$sample->tag. "'";
			}
			$values = "(" . implode("),(",$values) . ")";
			mysql_query("INSERT INTO {$dbprefix}tagyourplace $cols VALUES $values");
			echo mysql_error();
			
//			echo $values;
			break;
			}
		break;
	}

} else {	// GET

	switch($_REQUEST['cmd']) {
	case "count":
		
		$titles = $_GET['titles'];
		$since = $_GET['since'];
		$before = $_GET['before'];
		$user = $_GET['user'];
		$since_aff = $since*1000;
		$before_aff = $before*1000;
		
		$titles_array = array();
		
		for($i=0;$i<count($titles);$i++){
				$title = json_decode((string)$titles[$i]);
				$value = $title -> title;
				array_push($titles_array, $value);
				
		}
		 //echo json_encode((array)$titles_array);
		 $obj = new stdClass;
		 $obj->count_aff = 0;
		 $obj->count_tag = 0;
		 
		if(in_array("acc", $titles_array) || in_array("gsr", $titles_array)){
		    
			$obj->count_aff = fetch_value("SELECT COUNT(*) FROM {$dbprefix}biodata WHERE user='$user' AND time>='$since_aff' AND time<'$before_aff'");
		}
		
		if(in_array("longitude", $titles_array) || in_array("latitude", $titles_array) ||in_array("tag", $titles_array)){
		
		  $obj->count_tag = fetch_value("SELECT COUNT(*) FROM {$dbprefix}tagyourplace WHERE user='$user' AND time>='$since' AND time<'$before'");
		
		}
		
		//$titles_array = array();
		//$obj->count_aff = fetch_value("SELECT COUNT(*) FROM {$dbprefix}biodata WHERE user='$user' AND time>='$since_aff' AND time<'$before_aff'");
		//$obj->count_tag = fetch_value("SELECT COUNT(*) FROM {$dbprefix}tagyourplace WHERE user='$user' AND type='$type' AND time>='$since' AND time<'$before'");
		$obj->count_data = $obj->count_aff  + $obj->count_tag ;
		header("Content-Type: application/json");
		echo json_encode((array)$obj);
		break;
	case "tags":
		header("Content-Type: application/json");
		echo json_encode(fetch_rows("SELECT * FROM {$dbprefix}sample_tags"));
		break;
	case "data":
		
		$titles = $_GET['titles'];
		$since = $_GET['since'];
		$before = $_GET['before'];
		$user = $_GET['user'];
		if (!isset($user)) $user = "rost";

		$titles_array = array();
		
		for($i=0;$i<count($titles);$i++){
				$title = json_decode((string)$titles[$i]);
				$value = $title -> title;
				array_push($titles_array, $value);
				
		}
		//echo $titles_array;
		if(!empty($titles_array)){
			if(!in_array("acc", $titles_array) && !in_array("gsr", $titles_array)){
		    
						$type = 'GPS';
			}else if(!in_array("longitude", $titles_array) && !in_array("latitude", $titles_array) && ! in_array("tag", $titles_array)){
		
						$type = 'GSR';
		
			}else{
						$type = 'ALL';
		    }
		}
		else
			echo "there are no data would be downloaded!";
		
		
		
		$result_GPS = null; 
		$result_GSR = null; 
		switch($type){
		case "GPS":	
				if (isset($since)) {
					$colums  = implode(",",$titles_array);
					$sql = "SELECT time,". $colums ." FROM {$dbprefix}tagyourplace WHERE user='$user' AND time>='$since' AND time<'$before'";
					$result = mysql_query($sql);
		}
			break;
		case "GSR":
			$since_aff = $since*1000;
			$before_aff = $before*1000;
				if (isset($since_aff)) {
					$colums  = implode(",",$titles_array);
					//$colums = 'gsr,acc';
					$sql = "SELECT time,". $colums ." FROM {$dbprefix}biodata WHERE user='$user' AND time>='$since_aff' AND time<'$before_aff'";
					$result = mysql_query($sql);
		}
			break;
		case "ALL":
			$since_aff = $since*1000;
			$before_aff = $before*1000;
			$GSR_array = array();
			$GPS_array = array();
			if (isset($since_aff)&& isset($since)) {
				if(in_array("acc", $titles_array)){
					array_push($GSR_array, 'acc');
				}
				if(in_array("gsr", $titles_array)){
					array_push($GSR_array, 'gsr');
				}
				if(in_array("longitude", $titles_array)){
					array_push($GPS_array, 'longitude');
				}
				if(in_array("latitude", $titles_array)){
					array_push($GPS_array, 'latitude');
				}
				if(in_array("tag", $titles_array)){
					array_push($GPS_array, 'tag');
				}
				
				$colums_GSR  = implode(",",$GSR_array);
				$colums_GPS  = implode(",",$GPS_array);
				
				$sql_GPS = "SELECT time,". $colums_GPS ." FROM {$dbprefix}tagyourplace WHERE user='$user' AND time>='$since' AND time<'$before'";
				$sql_GSR = "SELECT time,". $colums_GSR ." FROM {$dbprefix}biodata WHERE user='$user' AND time>='$$since_aff' AND time<'$before_aff'";
				
				
				$result_GPS = mysql_query($sql_GPS);
				$result_GSR = mysql_query($sql_GSR);
			}			
			break;
		}
		
		
		if($result_GPS == null &&$result_GPS == null ){
		header("Content-Type: application/json");
		echo "[";
		$first == false;
		while($row = mysql_fetch_assoc($result)) {
			if ($first) {
				echo ",";
			}
			$first = true;

//			$time = $row['time'];
//			$value = $row['value'];

			echo json_encode($row);
		}
		echo "]";

		
		}
		else{
		header("Content-Type: application/json");
		echo "[[";
		$first == false;
		while($row_GPS= mysql_fetch_assoc($result_GPS)) {
			if ($first) {
				echo ",";
			}
			$first = true;

//			$time = $row['time'];
//			$value = $row['value'];

			echo json_encode($row_GPS);
		}
		echo "]";
		header("Content-Type: application/json");
		echo ",[";
		$first = false;
		while($row_GSR = mysql_fetch_assoc($result_GSR)) {
			if ($first) {
				echo ",";
			}
			$first = true;

//			$time = $row['time'];
//			$value = $row['value'];

			echo json_encode($row_GSR);
		}
		echo "]]";
		}

		break;
	default:
		
		$obj = new stdClass;
		header("Content-Type: application/json");
		echo json_encode($obj);
		
		break;
	}

}

?>
