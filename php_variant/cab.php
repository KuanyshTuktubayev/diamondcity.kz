<?php
session_start();
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
		}
		else {
			$login = $_SESSION['login'];
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
	}
}
else {
	if(isset($_SESSION['login'])){
		$login = $_SESSION['login'];
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
$sql = "SELECT id, lastname, firstname, email FROM Client cl where cl.id = " . $login . "";
$resultCL = mysqli_query($conn, $sql);
if (mysqli_num_rows($resultCL) == 0) {
	unset($_SESSION['login']);
	session_destroy();
}

$sql = "SELECT concat(str.name, '-', str.amountEnter) str_name, cl.id, cl.lastname, cl.firstname, str.idclparent, getpath(str.idclparent) AS path FROM struct str join Client cl on cl.id = str.idclient and str.idclparent = " . $login . "";
$resultStr = mysqli_query($conn, $sql);



if(isset($_SESSION['login'])){
?>
<html>
	<head>
		<title>Личный кабинет DiamondCity</title>
	</head>
	<body>
		<div>
			<?php echo $_SESSION['login'] . " : ";
			echo "<a href='/index.php'>на главную страницу</a>"; ?>
			|
			<a href='/index.php?exc=1'>Выйти</a>
		</div>
		<div>
		<?php
		echo "<table border='1px'>";
		echo "<th>ID</th>";
		echo "<th>Фамилия</th>";
		echo "<th>Имя</th>";
		echo "<th>email</th>";
		while($rowCL = mysqli_fetch_assoc($resultCL)) {
			echo "<tr>";
			echo "<td>" . $rowCL["id"] . "</td>";
			echo "<td>" . $rowCL["lastname"] . "</td>";
			echo "<td>" . $rowCL["firstname"] . "</td>";
			echo "<td>" . $rowCL["email"] . "</td>";
			echo "</tr>";
		}
		echo "</table>";
		echo "<br>";
		echo "<table border='1px'>";
		echo "<th>Вид входа</th>";
		echo "<th>ID клиента</th>";
		echo "<th>Фамилия</th>";
		echo "<th>Имя</th>";
		echo "<th>ID пригласившего</th>";
		echo "<th>Путь</th>";
		while($rowStr = mysqli_fetch_assoc($resultStr)) {
			echo "<tr>";
			echo "<td>" . $rowStr["str_name"] . "</td>";
			echo "<td>" . $rowStr["id"] . "</td>";
			echo "<td>" . $rowStr["lastname"] . "</td>";
			echo "<td>" . $rowStr["firstname"] . "</td>";
			echo "<td>" . $rowStr["idclparent"] . "</td>";
			echo "<td>" . $rowStr["path"] . "</td>";
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