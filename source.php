<?php
$host_name = "localhost";
$database = "puissance4";
$user_name = "puissance4";
$password = "123456";

$connect = new mysqli($host_name, $user_name, $password, $database);

$sql1 = "SELECT * FROM scores";
$result1 = $connect->query($sql1);

$scores = $result1->fetch_assoc();

$sRouge = $scores['rouge'];
$sJaune = $scores['jaune'];

$sql2 = "SELECT nbparties FROM partie_en_cours";
$result2 = $connect->query($sql2);

$nbP = $result2->fetch_assoc();

$nbParties = $nbP['nbparties'];

$sql6 = "SELECT encours FROM partie_en_cours";
$result3 = $connect->query($sql6);

$enC = $result3->fetch_assoc();
$enCours = $enC['encours'];

$sql9 = "SELECT t FROM partie_en_cours";
$result4 = $connect->query($sql9);

$tab = $result4->fetch_assoc();
$tableau = $tab['t'];

$sql11 = "SELECT currentPlayer FROM partie_en_cours";
$result5 = $connect->query($sql11);

$cP = $result5->fetch_assoc();
$currentPlayer = $cP['currentPlayer'];

if(isset($_GET['pre'])){
    echo json_encode(array("a" => $sRouge, "b" => $sJaune, "c" => $nbParties, "d" => $enCours, "t" => $tableau, "p" => $currentPlayer));
    die;
}

if(isset($_POST['scoresJ'])){
   $scoreJaune = $_POST['scoresJ'];
   $sql3 = "UPDATE scores SET jaune='$scoreJaune'";
   mysqli_query($connect, $sql3);
} elseif(isset($_POST['scoresR'])){
    $scoreRouge = $_POST['scoresR'];
    $sql4 = "UPDATE scores SET rouge='$scoreRouge'";
    mysqli_query($connect, $sql4);
} elseif(isset($_POST['updateParties'])){
    $uNbParties = $_POST['updateParties'];
    $sql5 = "UPDATE partie_en_cours SET nbparties='$uNbParties'";
    mysqli_query($connect, $sql5);
} elseif(isset($_POST['encours'])){
    $uEnCours = $_POST['encours'];
    $sql7 = "UPDATE partie_en_cours SET encours='$uEnCours'";
    mysqli_query($connect, $sql7);
} elseif(isset($_POST['tab'])) {
    $uTab = $_POST['tab'];
    $sql8 = "UPDATE partie_en_cours SET t='$uTab'";
    mysqli_query($connect, $sql8);
} elseif(isset($_POST['currentPlayer'])) {
    $uCP = $_POST['currentPlayer'];
    $sql10 = "UPDATE partie_en_cours SET currentPlayer='$uCP'";
    mysqli_query($connect, $sql10);
}



mysqli_close($connect);
?>