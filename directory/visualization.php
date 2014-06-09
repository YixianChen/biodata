<?php

include("../config.php");
include("../protodb.php");
DB::config( array( "prefix" => $dbprefix) );

$width = isset($_GET['width'])?$_GET['width']:500;
$height = isset($_GET['height'])?$_GET['height']:128;
$user = $_GET['user'];
$im     = imagecreatetruecolor($width,$height);
$color = imagecolorallocate($im, 255,0,0);

$yearstart = mktime(0,0,0,1,1,2012)*1000;

$start = $yearstart;
$end = (time()+100000)*1000;

if (isset($_GET['date'])) {
	$date = $_GET['date'];
	$time = strtotime($date);

	$start = $time*1000;
	$end = $start + 24*3600*1000;
//	exit;
}

$meta = fetch_row("SELECT MIN(time) `from`, MAX(time) `to` FROM {$dbprefix}samples WHERE time>=$start AND time<=$end AND user='$user'");
$samples = mysql_query("SELECT * FROM {$dbprefix}samples WHERE time>$start AND time<=$end AND user='$user' ORDER BY time ASC");
$tags = mysql_query("SELECT * FROM {$dbprefix}sample_tags WHERE time>$start AND time<=$end AND user='$user' ORDER BY time ASC");

if (isset($_GET['v'])) {
	echo mysql_num_rows($tags) . "<br />";

	while($tag = mysql_fetch_assoc($tags)) {
		$text = $tag['tag'];
		$time = intval($tag['time']);
		$stime = date("Y-m-d H:i:s", $time/1000);
		echo "$stime $text $time <br />";
	}
	exit;
}

$from = $meta['from'];
$to = $meta['to'];
//if ($from==0) $from = $start;
//if ($to==0) $to = $end;
if (isset($_GET['date'])) {
	$from = $start;
	$to = $end;
}
$sfrom = date("Y-m-d H:i:s", $from/1000);
$sto = date("Y-m-d H:i:s", $to/1000);

imagestring($im, 3, 5, 9, "$user $sfrom to $sto", $color);

$timeinterval = $to-$from; //$meta['to'] - $meta['from'];

$count = 0;
while($sample = mysql_fetch_assoc($samples)) {

	$time = $sample['time'];
	$gsr = $sample['gsr'];

	$x = ($time-$from)*$width / $timeinterval;
	$y = $height-5-$height*0.8*($gsr/65536);

	imagerectangle($im, $x-1, $y, $x+1, $height, $color);

	$count++;
//	if ($count>1000000) break;
}

$color = imagecolorallocate($im, 255,255,255);
$heights = array(20,32,44);
$count = 0;
while($tag = mysql_fetch_assoc($tags)) {
	$time = intval($tag['time']);

	$x = ($time-$from)*$width / $timeinterval;
	$text = $tag['tag'];
	
	imagestring($im, 3,$x, $heights[$count%count($heights)], $text, $color);
	$count++;
}


header("Content-type: image/png");
imagepng($im);
imagedestroy($im);

?>