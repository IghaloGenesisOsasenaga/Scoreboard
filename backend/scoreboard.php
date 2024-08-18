<?php
  $allowedOrigins = [
      'http://192.168.43.1:5132',
  ];
  if (in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
      header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
      header('Access-Control-Allow-Methods: POST');
      header('Access-Control-Allow-Headers: Content-Type');
  }
  function connect_db(){
    $servername = "localhost";
    $username = "root";
    $password = "";
    $database = "scoreboard";
    $socket_path = '/data/data/com.termux/files/usr/var/run/mysqld.sock';
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$database; unix_socket=$socket_path", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $e) {
        echo "F Connection failed: " . $e->getMessage();
        return null; 
    }
  }
  
  function sd($d){
    $conn = connect_db();
    if($conn) {
        try {
          $stmt = $conn->prepare("INSERT INTO board (scores) VALUES (:d)");
          $stmt->bindParam(':d', $d);
          $stmt->execute();
          $conn = null;
        } catch(PDOException $e) {
            echo "F Error: " . $e->getMessage();
            $conn = null;
        }
    }
  }
  
  function rd(){
    $conn = connect_db();
    if($conn) {
        try {
            $smt1 = $conn->prepare("SELECT scores FROM board");
            $smt1->execute();
            $d = $smt1->fetchAll(PDO::FETCH_ASSOC);
            $conn = null;
            return array_pop($d)["scores"];
        } catch(PDOException $e) {
            echo "F Error: " . $e->getMessage();
            $conn = null;
        }
    }
  }
  //echo json_encode($_POST);
  if($_POST["e2"] == "store"){
    $d = json_encode($_POST["e1"]);
    sd($d);
  }
  if($_POST["e2"] == "retrieve"){
    echo rd();
  }
?>