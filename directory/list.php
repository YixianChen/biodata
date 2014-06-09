<?php

include("../config.php");
include("../protodb.php");
DB::config( array( "prefix" => $dbprefix) );

?>
<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, user-scalable=yes, maximum-scale=1.0"/>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script src="../protodb.php?_js"></script>

<style>

.vis {
	width: 800px;
	height: 158px;
	border: 1px solid #000;
	display: block;
}

</style>

</head>
<body>

<?php

//$users = fetch_rows("SELECT user, count(*) num, MAX(time) `to`, MIN(time) `from` FROM {$dbprefix}samples GROUP BY user");
$users = fetch_rows("SELECT name user FROM {$dbprefix}samples_users GROUP BY user");
//$users = fetch_rows("SELECT user FROM {$dbprefix}samples GROUP BY user");

foreach($users as $user) {
	$name = $user['user'];
	
	$info = fetch_row("SELECT count(*) num, MAX(time) `to`, MIN(time) `from` FROM {$dbprefix}samples WHERE user='$name'");

//	$name = $user['user'];
//	$num = $user['num'];
//	$from = $user['from'];
//	$to = $user['to'];
	$num = $info['num'];
	$from = $info['from'];
	$to = $info['to'];

	$sfrom = date("Y-m-d H:i:s", $from/1000);
	$sto = date("Y-m-d H:i:s", $to/1000);

	echo "$name ($num): $from to $to ($sfrom to $sto)<br/>";
	echo "<a href='download.php?user=$name' target='_blank'>download</a> ";
//	echo "<a href='visualization.php?user=$name&date=" . date("Y-m-d") . "&width=800' target='_blank'>browse days</a> ";
	echo "<a href='visualization.php?user=$name&width=1000' target='_blank'>show all</a> ";

	echo "<hr />";
}

?>

</body>
</html>