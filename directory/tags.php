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

<form>name: <input name="name" value="<?= $_GET['name'] ?>" /><input type="submit" /></form>

<?php

//$users = fetch_rows("SELECT user, count(*) num, MAX(time) `to`, MIN(time) `from` FROM {$dbprefix}samples GROUP BY user");
//$users = fetch_rows("SELECT name user FROM {$dbprefix}samples_users GROUP BY user");
//$users = fetch_rows("SELECT user FROM {$dbprefix}samples GROUP BY user");

if (!isset($_GET['name'])) exit;

$name = $_GET['name'];
$tags = fetch_rows("SELECT time, tag FROM {$dbprefix}sample_tags WHERE user='$name'");

foreach($tags as $tag) {
	$time = $tag['time'];
	$tag = $tag['tag'];

	$stime = date("Y-m-d H:i:s", $time/1000);

	echo "$time\t$tag\t$stime<br />";
}

?>

</body>
</html>