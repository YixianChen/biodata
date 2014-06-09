<?php
		require_once('config.php');

        mysql_connect($db_url, $db_user, $db_passwd);
        @mysql_select_db($database) or die("could not select database");
        
        function fetch_rows($query)
        {
        	$r = mysql_query($query);
        	echo mysql_error();
			if (!$r) return array();
        	$rows = array();
        	while($row = mysql_fetch_assoc($r))
        	{
        		$rows[] = $row;
        	}
        	mysql_free_result($r);
        	return $rows;
        }

        function fetch_row($query)
        {
        	$r = mysql_query($query);
        	echo mysql_error();
        	return $r?mysql_fetch_assoc($r):null;
        }

        function fetch_value($query)
        {
        	$r = mysql_query($query);
        	echo mysql_error();
        	$arr = mysql_fetch_array($r);
        	return $arr[0];
        }
        
class Query {
	function __construct()
	{
	}
	public static function select($table, $cols = false)
	{
		return new SelectQuery($table,$cols);
	}
}

class SelectQuery extends Query {
	private $table = null;
	private $where = null;
	private $order = null;
	private $group = null;
	private $limit = null;
	private $cols = null;
	function __construct($table,$cols)
	{
		$this->table = $table;
		if ($cols == null)
			$this->cols = "*";
		else
		{
			$this->cols = $cols;
		}
	}

	function where($where)
	{
		if ($this->where==null)
		{
			$this->where = $where;
		}
		else if (is_array($this->where))
		{
			if (is_array($where))
				$this->where = array_merge($this->where,$where);
			else
				$this->where[] = $where;
		}
		else
		{
			if (is_array($where))
				$this->where = array_merge(array($this->where),$this->where);
			else
				$this->where = array($this->where,$where);
		}
		return $this;
	}

	function order($order)
	{
		$this->order = $order;
		return $this;
	}

	function group($group)
	{
		$this->group = $group;
		return $this;
	}

	function limit($limit)
	{
		$this->limit = $limit;
		return $this;
	}

	function query()
	{
		$q = "SELECT " . $this->cols . " FROM " . $this->table;
		if ($this->where)
		{
			if (is_array($this->where))
				$q .= " WHERE " . implode(" AND ", $this->where);
			else
				$q .= " WHERE " . $this->where;
		}
		if ($this->group)
		{
			$q .= " GROUP BY " . $this->group;
		}
		if ($this->order)
		{
			$q .= " ORDER BY " . $this->order;
		}
		if ($this->limit)
		{
			$q .= " LIMIT " . $this->limit;
		}
		return $q;
	}
}

?>
