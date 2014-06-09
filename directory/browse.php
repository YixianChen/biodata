<?php

include("../config.php");
include("../protodb.php");
DB::config( array( "prefix" => $dbprefix) );

$width = isset($_GET['width'])?$_GET['width']:500;
$height = isset($_GET['height'])?$_GET['height']:128;
$user = $_GET['user'];

$date = isset($_GET['date'])?$_GET['date']:date("Y-m-d");

$cur = strtotime($date);
$prev = date("Y-m-d", $cur-3600*24);
$next = date("Y-m-d", $cur+3600*24);

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
	height: 128px;
	border: 1px solid #000;
	display: block;
}

</style>

</head>
<body>

<a href='browse.php?user=<?= $user ?>&date=<?= $prev ?>'>prev</a>
<img src='visualization.php?user=<?= $user ?>&date=<?= $date ?>' />
<a href='browse.php?user=<?= $user ?>&date=<?= $next ?>'>next</a>

</body>
</html>