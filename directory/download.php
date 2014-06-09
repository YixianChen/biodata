<?php

include("../config.php");
include("../protodb.php");
DB::config( array( "prefix" => $dbprefix) );

$width = isset($_GET['width'])?$_GET['width']:500;
$height = isset($_GET['height'])?$_GET['height']:128;
$user = $_GET['user'];
//$im     = imagecreatetruecolor($width,$height);
//$color = imagecolorallocate($im, 255,0,0);

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

$from = $meta['from'];
$to = $meta['to'];
$sfrom = date("Y-m-d H:i:s", $from/1000);
$sto = date("Y-m-d H:i:s", $to/1000);

//imagestring($im, 3, 5, 9, "$user $sfrom to $sto", $color);

$timeinterval = $meta['to'] - $meta['from'];

header("Content-type: text/text");

$count = 0;
while($sample = mysql_fetch_assoc($samples)) {

	$time = $sample['time'];
	$gsr = $sample['gsr'];
	$acc = $sample['acc'];

	$x = ($time-$meta['from'])*$width / $timeinterval;
	$y = $height-5-$height*0.8*($gsr/65536);

//	imagerectangle($im, $x-1, $y, $x+1, $height, $color);
	echo "$time\t$gsr\t$acc\n";

	$count++;
//	if ($count>1000000) break;
}

//header("Content-type: image/png");
//imagepng($im);
//imagedestroy($im);

?>