<?php

session_start();

require_once('db.php');

include('protodb.php');

DB::config( array( "prefix" => $dbprefix) );

  
		
if (!isset($_REQUEST['cmd'])) exit;

if ($_SERVER['REQUEST_METHOD']=="POST") {
	echo "post<br />";

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
				$values[] = "'".$sample->t."','" . $user . "','" . $sample->x . "','" . $sample->y . "','" . $sample->z . "'";
			}
			$values = "(" . implode("),(",$values) . ")";
			mysql_query("INSERT INTO {$dbprefix}sample_acc $cols VALUES $values");
			echo mysql_error();
			
//			echo $values;
			break;
		}
		break;
	}

} else {	// GET

	switch($_REQUEST['cmd']) {
	case "count":
		$user = $_GET['user'];
		$obj = new stdClass;
		$obj->count = fetch_value("SELECT COUNT(*) FROM {$dbprefix}samples WHERE user='$user'");
		header("Content-Type: application/json");
		echo json_encode($obj);
		break;
	case "tags":
		header("Content-Type: application/json");
		echo json_encode(fetch_rows("SELECT * FROM {$dbprefix}sample_tags"));
		break;
	case "data":
		$type = $_GET['type'];
		$since = $_GET['since'];
		$before = $_GET['before'];
		$user = $_GET['user'];
		if (!isset($user)) $user = "rost";

		if (isset($since)) {
			$result = mysql_query("SELECT time t,gsr,acc FROM {$dbprefix}samples WHERE user='$user' AND type='$type' AND time>='$since' AND time<'$before' ORDER BY time ASC");
		} else {
//			$result = mysql_query("SELECT time t,gsr,acc FROM {$dbprefix}samples WHERE user='$user' AND type='$type' ORDER BY time ASC");
		}
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

		break;
	default:
		
		$obj = new stdClass;
		header("Content-Type: application/json");
		echo json_encode($obj);
		
		break;
	}

}

?>