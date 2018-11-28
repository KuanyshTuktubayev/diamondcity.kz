<?php
session_start();
//////////////// testing
/*if(!isset($_POST['login'])){
	echo "POST[login] is not set";
	exit();
}
if(!isset($_SESSION['login'])){
	echo "SESSION[login] is not set";
	exit();
}*/
////////////////
if(isset($_POST['login'])){
	if(isset($_SESSION['login'])){
		if($_SESSION['login'] != $_POST['login']) {
			unset($_SESSION['login']);
			session_destroy();
			$login = $_POST['login'];
			$pwd = $_POST['pwd'];
			$firstname = $_POST['Firstname'];
			$lastname = $_POST['Lastname'];
			$idparent = $_POST['IDParent'];
			$registration = $_POST['registration'];
			$_SESSION['login'] = $login;
			$_SESSION['pwd'] = $pwd;
		}
		else {
			$login = $_SESSION['login'];
			$pwd = $_SESSION['pwd'];
		}
	}
	else {
		$login = $_POST['login'];
		$pwd = $_POST['pwd'];
		$firstname = $_POST['Firstname'];
		$lastname = $_POST['Lastname'];
		$idparent = $_POST['IDParent'];
		$registration = $_POST['registration'];
		$_SESSION['login'] = $login;
		$_SESSION['pwd'] = $pwd;
	}
}
else {
	if(isset($_SESSION['login'])){
		$login = $_SESSION['login'];
		$pwd = $_SESSION['pwd'];
	}
}

$servername = "localhost";
$username = "rootDC";
$password = "Root@123";
$dbname = "p-13908_DCReal";
$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}
$sql = "SELECT cl.id, cl.lastname, cl.firstname, cl.email, u.pwd FROM Client cl join Users u on u.id = cl.id and u.islock = 0 where cl.id = " . $login . " and u.pwd = password('" . $pwd . "')";
$resultCL = mysqli_query($conn, $sql);
if (mysqli_num_rows($resultCL) == 0) {
	//echo "Не удалось найти пользователя с ид " . $_SESSION['login'] . ", и паролем " . $_SESSION['pwd'];
	//echo "Не удалось найти пользователя с ид " . $_SESSION['login'] . ", " . $sql;
	echo "Не удалось найти пользователя с ид " . $_SESSION['login'];
	unset($_SESSION['login']);
	session_destroy();
	exit();
}

//structure MLM of this client:
//$sql = "SELECT CONCAT(pt.Name, '-', pt.AmountEnter) str_name, cl.id, cl.lastname, cl.firstname, str.idclparent, getpath(" . $login . ") AS path FROM Struct str JOIN Client cl ON cl.id = str.idclient AND str.idclparent = " . $login . " join PlanType pt on pt.ID = str.IDPlanType and pt.id = 1";
$sql = "SELECT
	concat(pt.Name, '-', pt.AmountEnter) as PlanName,
    t0.IDClient,
    c0.Lastname,
    c0.Firstname,
    c0.Middlename,
    c0.Birthdate,
    c0.Gender,
    c0.Email,
    c0.IIN,
    c0.PasspNum,
    (select cn.Shortname from Country cn where cn.id = c0.IDCountryCitz LIMIT 1) as CountryCitz,
    t1.IDClient AS lev1,
    (select CONCAT(ifnull(cl.Lastname,''),' ',ifnull(cl.Firstname,''),' ',ifnull(cl.Middlename,'')) as fio from Client as cl where cl.ID = t1.IDClient limit 1) fio1,
    t2.IDClient AS lev2,
    (select CONCAT(ifnull(cl.Lastname,''),' ',ifnull(cl.Firstname,''),' ',ifnull(cl.Middlename,'')) as fio from Client as cl where cl.ID = t2.IDClient limit 1) fio2,
    t3.IDClient AS lev3,
    (select CONCAT(ifnull(cl.Lastname,''),' ',ifnull(cl.Firstname,''),' ',ifnull(cl.Middlename,'')) as fio from Client as cl where cl.ID = t3.IDClient limit 1) fio3,
    t4.IDClient AS lev4,
    (select CONCAT(ifnull(cl.Lastname,''),' ',ifnull(cl.Firstname,''),' ',ifnull(cl.Middlename,'')) as fio from Client as cl where cl.ID = t4.IDClient limit 1) fio4,
    t5.IDClient AS lev5,
    (select CONCAT(ifnull(cl.Lastname,''),' ',ifnull(cl.Firstname,''),' ',ifnull(cl.Middlename,'')) as fio from Client as cl where cl.ID = t5.IDClient limit 1) fio5,
    t6.IDClient AS lev6,
    (select CONCAT(ifnull(cl.Lastname,''),' ',ifnull(cl.Firstname,''),' ',ifnull(cl.Middlename,'')) as fio from Client as cl where cl.ID = t6.IDClient limit 1) fio6,
    t7.IDClient AS lev7,
    (select CONCAT(ifnull(cl.Lastname,''),' ',ifnull(cl.Firstname,''),' ',ifnull(cl.Middlename,'')) as fio from Client as cl where cl.ID = t7.IDClient limit 1) fio7
FROM
    Struct AS t0
join Client c0 on c0.ID = t0.IDClient
join PlanType pt on pt.ID = t0.IDPlanType
LEFT JOIN Struct AS t1
ON
    t1.IDClParent = t0.IDClient AND t1.IDPlanType = 1
LEFT JOIN Struct AS t2
ON
    t2.IDClParent = t1.IDClient AND t2.IDPlanType = 1
LEFT JOIN Struct AS t3
ON
    t3.IDClParent = t2.IDClient AND t3.IDPlanType = 1
LEFT JOIN Struct AS t4
ON
    t4.IDClParent = t3.IDClient AND t4.IDPlanType = 1
LEFT JOIN Struct AS t5
ON
    t5.IDClParent = t4.IDClient AND t5.IDPlanType = 1
LEFT JOIN Struct AS t6
ON
    t6.IDClParent = t5.IDClient AND t6.IDPlanType = 1
LEFT JOIN Struct AS t7
ON
    t7.IDClParent = t6.IDClient AND t7.IDPlanType = 1
WHERE 1=1
AND t0.IDPlanType = 1
and t0.IDClient = " . $login . "";
$resultStr = mysqli_query($conn, $sql);
$sStructMessage = "";
if (mysqli_num_rows($resultStr) == 0) {
	$sStructMessage = "У клиента с ид " . $_SESSION['login'] . " нет нижних клиентов в его структуре.";
}


if(isset($_SESSION['login'])){
?>
<html>
	<head>
		<title>Личный кабинет DiamondCity</title>
		<link rel="stylesheet" href="./wp-content/themes/mytheme/css/bootstrap.min.css">
	</head>
	<body>
		<div class="container">
			Клиент <?php echo "<b>" . $_SESSION['login'] . "</b> : ";
			echo "<a href='/index.php'>на главную страницу</a>"; ?>
			|
			<a href='/index.php?exc=1'>Выйти</a>
		</div>
		<div class="container">
			<p>Ваши данные:</p>
		<?php
		echo "<ul>";
		while($rowCL = mysqli_fetch_assoc($resultCL)) {
			echo "<li>ID: " . $rowCL["id"] . "</li>";
			echo "<li>Фамилия: " . $rowCL["lastname"] . "</li>";
			echo "<li>Имя: " . $rowCL["firstname"] . "</li>";
			echo "<li>email: " . $rowCL["email"] . "</li>";
		}
		echo "</ul>";
		echo "<br>";

		echo "<p>Ваша структура:</p>";
		//echo $sStructMessage; //testing
		echo "<table border='0px'>";
		echo "<th>Вид входа</th>";
		echo "<th>Уровень-1</th>";
		echo "<th>Уровень-2</th>";
		echo "<th>Уровень-3</th>";
		echo "<th>Уровень-4</th>";
		echo "<th>Уровень-5</th>";
		echo "<th>Уровень-6</th>";
		echo "<th>Уровень-7</th>";
		$fio1 = "";
		$fio2 = "";
		$fio3 = "";
		$fio4 = "";
		$fio5 = "";
		$fio6 = "";
		$fio7 = "";
		$emptySymb = "...";
		while($rowStr = mysqli_fetch_assoc($resultStr)) {
			echo "<tr>";
			
			echo "<td>" . $rowStr["PlanName"] . "</td>";
			if(($fio1 == $rowStr["fio1"]) && ($fio1 != "")){
				echo "<td>" . $emptySymb . "</td>";
			}
			else {
				$fio1 = $rowStr["fio1"];
				echo "<td>" . $rowStr["fio1"] . "</td>";
			}
			
			if(($fio2 == $rowStr["fio2"]) && ($fio2 != "")){
				echo "<td>" . $emptySymb . "</td>";
			}
			else {
				$fio2 = $rowStr["fio2"];
				echo "<td>" . $rowStr["fio2"] . "</td>";
			}
			
			if(($fio3 == $rowStr["fio3"]) && ($fio3 != "")){
				echo "<td>" . $emptySymb . "</td>";
			}
			else {
				$fio3 = $rowStr["fio3"];
				echo "<td>" . $rowStr["fio3"] . "</td>";
			}
			
			if(($fio4 == $rowStr["fio4"]) && ($fio4 != "")){
				echo "<td>" . $emptySymb . "</td>";
			}
			else {
				$fio4 = $rowStr["fio4"];
				echo "<td>" . $rowStr["fio4"] . "</td>";
			}
			
			if(($fio5 == $rowStr["fio5"]) && ($fio5 != "")){
				echo "<td>" . $emptySymb . "</td>";
			}
			else {
				$fio5 = $rowStr["fio5"];
				echo "<td>" . $rowStr["fio5"] . "</td>";
			}
			
			if(($fio6 == $rowStr["fio6"]) && ($fio6 != "")){
				echo "<td>" . $emptySymb . "</td>";
			}
			else {
				$fio6 = $rowStr["fio6"];
				echo "<td>" . $rowStr["fio6"] . "</td>";
			}
			
			if(($fio7 == $rowStr["fio7"]) && ($fio7 != "")){
				echo "<td>" . $emptySymb . "</td>";
			}
			else {
				$fio7 = $rowStr["fio7"];
				echo "<td>" . $rowStr["fio7"] . "</td>";
			}
			/*
			echo "<td>" . $rowStr["fio1"] . "</td>";
			echo "<td>" . $rowStr["fio2"] . "</td>";
			echo "<td>" . $rowStr["fio3"] . "</td>";
			echo "<td>" . $rowStr["fio4"] . "</td>";
			echo "<td>" . $rowStr["fio5"] . "</td>";
			echo "<td>" . $rowStr["fio6"] . "</td>";
			echo "<td>" . $rowStr["fio7"] . "</td>";
			*/
			echo "</tr>";
		}
		echo "</table>";
		
		?>
		</div>
	</body>
</html>
<?php
}
else {
	echo "Вам нужно зайти под своим логином<br>";
	echo "<a href='/index.php'>перейти на главную страницу</a>";
}
mysqli_close($conn);
?>