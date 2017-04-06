<?php
    require 'config.php';

    // 从user表中查找user是否等于传过来的user
    $query = mysql_query("SELECT user FROM user WHERE user='{$_POST['user']}'") or die('SQL 错误！');

    // 如果穿过来的user有值，返回false（即用户名被占用）
    if(mysql_fetch_array($query,MYSQL_ASSOC)){
        echo 'false';
    }else{
        echo 'true';
    }

    mysql_close();
?>