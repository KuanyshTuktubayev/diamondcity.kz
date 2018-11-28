<?php
session_start();

if(isset($_GET['exc'])) {
	unset($_SESSION['login']);
	unset($_SESSION['pwd']);
	session_destroy();
}
if(isset($_SESSION['login'])){
	$login = $_SESSION['login'];
}
?>
<!DOCTYPE html>
<html lang="ru">

<head>

	<meta charset="utf-8">

	<title>DIAMOND CITY |</title>
	<meta name="description" content="">

	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<link rel="stylesheet" href="./wp-content/themes/mytheme/css/bootstrap.min.css">
	<link rel="stylesheet" href="./wp-content/themes/mytheme/libs/font-awesome/css/font-awesome.min.css">
	<link rel="stylesheet" href="./wp-content/themes/mytheme/css/animate.css">
	<link rel="stylesheet" href="./wp-content/themes/mytheme/css/main.css">
	<style>body { opacity: 0; overflow-x: hidden; } </style>
	<link rel="shortcut icon" href="./wp-content/themes/mytheme/img/favicon.png">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
</head>

<body>
	<div><a href="/cab.php"><?php echo $login; ?></a></div>
<div class="hiddenMenu">
	<li class="menu-button-close">
		<i class="fa fa-close"></i>
	</li>
	<ul>
		<li><a href="#about_company">О КОМПАНИИ</a></li>
		<li><a href="#product">ПРОДУКЦИЯ</a></li>
		<li><a href="#marketing">МАРКЕТИНГ</a></li>
		<li><a href="#price-list">ПРАЙС-ЛИСТ</a></li>
		<li><a href="#feeds">ОТЗЫВЫ</a></li>
		<li><a href="#contact">КОНТАКТЫ</a></li>
		<?php if(!isset($login)) { ?>
		<li><a href="#cab">Кабинет</a></li>
		<?php } ?>
	</ul>
</div>
<div class="overlay"></div>
<li class="menu-button">
	<span></span>
	<span></span>
	<span></span>
</li>

	<header class="_header">
		<div class="container">
			<div class="row">
				<div class="col-lg-3 col-md-2 col-sm-1 col-xs-12 _header_logo wow flipInY">
					<a href="/"><img src="./wp-content/themes/mytheme/img/logo/logo.png" alt="logo"></a>
				</div>
				<div class="col-lg-9 col-md-10 col-sm-11 col-xs-12">
					<nav class="_header_menu wow bounceInRight">
						<button type="button" class="navbar-toggle">
					    <span class="icon-bar"></span>
					    <span class="icon-bar"></span>
					    <span class="icon-bar"></span>
						</button>
						<ul>
							<li><a href="#about_company">О компании</a></li>
							<li><a href="#product">Продукция</a></li>
							<li><a href="#marketing">Маркетинг</a></li>
							<li><a href="#price-list">Прайс-лист</a></li>
							<li><a href="#feeds">Отзывы</a></li>
							<li><a href="#contact">Контакты</a></li>
							<?php if(!isset($login)) { ?>
							<li><a href="#cab">Кабинет</a></li>
							<?php } ?>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	</header><div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
  <!-- Indicators -->
  <ol class="carousel-indicators">
							    <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
							    <li data-target="#carousel-example-generic" data-slide-to="1"></li>
			  </ol>

  <!-- Wrapper for slides -->
  <div class="carousel-inner" role="listbox">
	<div class="item active">
    
    <section class="_main">
      	<img class="_main_fon" width="100%" src="./wp-content/uploads/2018/02/Baiterek.jpg" alt="">
		<div class="container">
			<div class="row">
				<div class="col-md-5 text-center">
					<div class="_main_block">
						<h1>Diamond City</h1>
						<p><p>Казахстанская компания</p>
<p><img class="alignnone size-full wp-image-143" src="./wp-content/uploads/2018/02/kazakhstan.png" alt="" width="64" height="64" /> </p>
<p>&nbsp;</p>
</p>
						<a href="#" data-target="#slide-4" data-toggle="modal"><button>Подробнее >></button></a>
					</div>
				</div>
			</div>
		</div>
	</section>
    </div>
	<div class="item">
    
    <section class="_main">
      	<img class="_main_fon" width="100%" src="./wp-content/uploads/2018/02/AltynAdam.jpeg" alt="">
		<div class="container">
			<div class="row">
				<div class="col-md-5 text-center">
					<div class="_main_block">
						<h1>Diamond City</h1>
						<p><p>Казахстанская компания</p>
<p><img class="alignnone size-full wp-image-143" src="./wp-content/uploads/2018/02/kazakhstan.png" alt="" width="64" height="64" /> </p>
<p>&nbsp;</p>
</p>
						<a href="#" data-target="#slide-7" data-toggle="modal"><button>Подробнее >></button></a>
					</div>
				</div>
			</div>
		</div>
	</section>
    </div>
  </div>
</div>

		          <div id="slide-4" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Diamond City</h2>
              </div>
              <div class="modal-body">
              	                                	<strong>Дорогие будущие Миллионеры!</strong>
						<p>Мы рады представить вам компанию Diamond city. Наша продукция понравится и принесет Вам и Вашим близким много пользы, а компания финансовую независимость.</p>
<p>Главная задача компании<br>
Обеспечить партнеров высококачественной продукцией и создать условия для успешного развития бизнеса.</p>

<p>Преимущества сотрудничества с <span>Diamond city:</span></p>
						<ul>
							<li>Вы можете быстро увеличить свой доход;</li>
							<li>Мы продвигаем продукцию высочайшего качества на рынок через взаимовыгодное партнерство с независимыми дистрибьюторами;</li>
							<li>Карьерный рост;</li>
							<li>Вы можете построить бизнес не только в Казахстане, но и за ее пределами;</li>
							<li>Мы заинтересованы в Вашем успехе и готовы создать условия для плодотворного развития вашего бизнеса;</li>
						</ul>
						<p>Желаем Вам больших финансовых успехов и крепкого здоровья!</p>                              </div>
              </div>
            </div>
          </div>
                  <div id="slide-7" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Diamond City</h2>
              </div>
              <div class="modal-body">
              	                                	<strong>Дорогие будущие Миллионеры!</strong>
						<p>Мы рады представить вам компанию Diamond city. Наша продукция понравится и принесет Вам и Вашим близким много пользы, а компания финансовую независимость.</p>
<p>Главная задача компании<br>
Обеспечить партнеров высококачественной продукцией и создать условия для успешного развития бизнеса.</p>

<p>Преимущества сотрудничества с <span>Diamond city:</span></p>
						<ul>
							<li>Вы можете быстро увеличить свой доход;</li>
							<li>Мы продвигаем продукцию высочайшего качества на рынок через взаимовыгодное партнерство с независимыми дистрибьюторами;</li>
							<li>Карьерный рост;</li>
							<li>Вы можете построить бизнес не только в Казахстане, но и за ее пределами;</li>
							<li>Мы заинтересованы в Вашем успехе и готовы создать условия для плодотворного развития вашего бизнеса;</li>
						</ul>
						<p>Желаем Вам больших финансовых успехов и крепкого здоровья!</p>                              </div>
              </div>
            </div>
          </div>
         

	
<section class="_about">
	<div class="container" id="about_company">
		<div class="row">
			<div class="col-md-9 col-xs-12 text-left _about_block wow fadeInLeftBig">
					<h3>О компании</h3>
					<p><strong>Дорогие будущие Миллионеры!</strong></p>
<p>Мы рады представить вам компанию Diamond city. Наша продукция понравится и принесет Вам и Вашим близким много пользы, а компания финансовую независимость, а так же: денежные бонусы до 2.500.000 тенге, электроника, золото, путевки и Автомобиль! Все легко и просто!</p>
<p>Преимущества сотрудничества с Diamond city:</p>
<ul>
<li>Вы можете быстро увеличить свой доход;</li>
<li>Мы продвигаем продукцию высочайшего качества на рынок через взаимовыгодное партнерство с независимыми дистрибьюторами;</li>
<li>Карьерный рост;</li>
<li>Вы можете построить бизнес не только в Казахстане, но и за ее пределами;</li>
<li>Мы заинтересованы в Вашем успехе и готовы создать условия для плодотворного развития вашего бизнеса;</li>
</ul>
<p>Желаем Вам больших финансовых успехов и крепкого здоровья!</p>
			</div>
			<div class="_about_image wow fadeInRightBig"><img src="./wp-content/uploads/2018/02/countryKZ.png" alt=""></div>
		</div>
	</div>
</section>

<?php if(!isset($login)) { ?>
<section class="_about">
	<div class="container" id="cab">
			<p>Вход в личный кабинет клиента</p>
			<form action="/cab.php" method="post" name="CabLoginForm">
				<input type="text" name="login" placeholder="ваш ID" />
				<input type="password" name="pwd" placeholder="пароль" /><br />
				<input type="text" name="Firstname" id="Firstname" placeholder="Имя" hidden />
				<input type="text" name="Lastname" id="Lastname" placeholder="Фамилия" hidden />
				<input type="text" name="IDParent" id="IDParent" placeholder="ID пригласившего" hidden /><br />
				<input type="submit" name="btnLogin" name="btnLogin" value="Войти" /><br />
				<input type="checkbox" name="registration" id="registration" /> Регистрация
			</form>
			<script>
				$('#registration').click(function(){
					if ($("#registration").is(":checked")) {
						$('#Lastname').show(1000);
						$('#Firstname').show(1000);
						$('#IDParent').show(1000);
					} else {
						$('#Lastname').hide(1000);
						$('#Firstname').hide(1000);
						$('#IDParent').hide(1000);
					}
				});
			</script>
	</div>
</section>
<?php } ?>

	<section class="_production">
		<div class="container">
			<div class="row">
				<div class="col-xs-12 text-left" id="product"><h3 class=" wow fadeInLeftBig">Продукция</h3></div>
	
				<div class="col-md-4 col-sm-6 col-xs-12 text-center">
					<div class="_production_block wow flipInY">
						<h4>Фитотампон</h4>
						<img src="./wp-content/uploads/2018/02/tampon.png" alt="tampon">
						<a href="#" data-target="#product-12" data-toggle="modal"><button>Подробное описание</button></a>
					</div>
				</div>
	
				<div class="col-md-4 col-sm-6 col-xs-12 text-center">
					<div class="_production_block wow flipInY">
						<h4>Прокладки на критические дни и ночи</h4>
						<img src="./wp-content/uploads/2018/02/gaskets.png" alt="tampon">
						<a href="#" data-target="#product-15" data-toggle="modal"><button>Подробное описание</button></a>
					</div>
				</div>
	
				<div class="col-md-4 col-sm-6 col-xs-12 text-center">
					<div class="_production_block wow flipInY">
						<h4>Ежедневки от цистита (20 шт в упаковке)</h4>
						<img src="./wp-content/uploads/2018/02/-от-цистита-e1525591405327.jpg" alt="tampon">
						<a href="#" data-target="#product-65" data-toggle="modal"><button>Подробное описание</button></a>
					</div>
				</div>
	
				<div class="col-md-4 col-sm-6 col-xs-12 text-center">
					<div class="_production_block wow flipInY">
						<h4>Кордицепс для мужчин</h4>
						<img src="./wp-content/uploads/2018/02/корд.bmp" alt="tampon">
						<a href="#" data-target="#product-180" data-toggle="modal"><button>Подробное описание</button></a>
					</div>
				</div>
	
				<div class="col-md-4 col-sm-6 col-xs-12 text-center">
					<div class="_production_block wow flipInY">
						<h4>Интимный гинекологический гель</h4>
						<img src="./wp-content/uploads/2018/05/-e1525593864555.jpg" alt="tampon">
						<a href="#" data-target="#product-315" data-toggle="modal"><button>Подробное описание</button></a>
					</div>
				</div>
	
				<div class="col-md-4 col-sm-6 col-xs-12 text-center">
					<div class="_production_block wow flipInY">
						<h4>Мыло с маслом змеи</h4>
						<img src="./wp-content/uploads/2018/05/-змея-e1525591274909.jpg" alt="tampon">
						<a href="#" data-target="#product-321" data-toggle="modal"><button>Подробное описание</button></a>
					</div>
				</div>
	
				<div class="col-md-4 col-sm-6 col-xs-12 text-center">
					<div class="_production_block wow flipInY">
						<h4>Мужская сила из пантов Марала и женьшеня</h4>
						<img src="./wp-content/uploads/2018/05/IMG_3381-05-05-18-07-20-e1525556265654.jpg" alt="tampon">
						<a href="#" data-target="#product-342" data-toggle="modal"><button>Подробное описание</button></a>
					</div>
				</div>
	
				<div class="col-md-4 col-sm-6 col-xs-12 text-center">
					<div class="_production_block wow flipInY">
						<h4>Сердечно-мозговой капсула</h4>
						<img src="./wp-content/uploads/2018/05/-мозговая-капсула-e1525590800898.jpg" alt="tampon">
						<a href="#" data-target="#product-345" data-toggle="modal"><button>Подробное описание</button></a>
					</div>
				</div>
	
				<div class="col-md-4 col-sm-6 col-xs-12 text-center">
					<div class="_production_block wow flipInY">
						<h4>Ежедневки с алое лечебные</h4>
						<img src="./wp-content/uploads/2018/05/-с-алое-e1525591962410.jpg" alt="tampon">
						<a href="#" data-target="#product-352" data-toggle="modal"><button>Подробное описание</button></a>
					</div>
				</div>
	
				<div class="col-md-4 col-sm-6 col-xs-12 text-center">
					<div class="_production_block wow flipInY">
						<h4>Женьшеневое мыло с экстрактами трав</h4>
						<img src="./wp-content/uploads/2018/05/-с-женьшень-e1525592600934.jpg" alt="tampon">
						<a href="#" data-target="#product-356" data-toggle="modal"><button>Подробное описание</button></a>
					</div>
				</div>
				
			</div>
		</div>
	</section>
		          <div id="product-12" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Фитотампон</h2>
              </div>
              <div class="modal-body text-product">
              	<p>Фитотампон – тампоны вагинальные являются продуктом современных биотехнологий и древних рецептов китайской медицины. Имеют 100% натуральный состав, без консервантов и гормонов. Обладает противовоспалительным бактерицидным действием, оздоравливает микрофлору влагалища, восстанавливает и питает ци и кровь, стабилизирует менструальный цикл.<br />
Основные свойства:<br />
&#8212; Обладают противовоспалительным бактерицидным действием<br />
&#8212; Оздоравливает микрофлору влагалища<br />
&#8212; Устраняют и прекращают выделение белей<br />
&#8212; Снимают зуд<br />
&#8212; Восстанавливают и питают энергию Ци и кровь<br />
&#8212; Стабилизируют менструальный цикл<br />
&#8212; Снижают предменструальный болевой синдром<br />
Показания к применению :<br />
&#8212; Воспаления матки<br />
&#8212; Воспаления придатков<br />
&#8212; Воспаления в области малого таза<br />
&#8212; Эрозия шейки матки<br />
Противопоказания:<br />
&#8212; Девственность<br />
&#8212; Беременность<br />
&#8212; Не использовать во время менструации<br />
&#8212; После любых операционных вмешательств : через 3-6 месяцев<br />
Курс:<br />
Профилактический курс 6 шт<br />
Лечебный курс 12-24 шт<br />
Состав: жгун-корень плоды, дудник китайский корень, пустырник, корневища смилакса, борнеол, корневище лигустимука и т.д., 13 наименований целебных растений<br />
Код ТН ВЭД &#8212; 3005905000</p>
              </div>
              </div>
            </div>
          </div>
                  <div id="product-15" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Прокладки на критические дни и ночи</h2>
              </div>
              <div class="modal-body text-product">
              	<p>Натуральный верхний слой Airlaid быстро пропускает жидкость внутрь прокладки и препятствует ее выходу на поверхность, что позволяет коже оставаться чистой и сухой.<br />
Внутренний впитывающий слой содержит гранулы суперабсорбента, надежно удерживающие жидкость внутри.<br />
Уникальная фитомембрана содержит запатентованный концентрат травяных экстрактов.<br />
Крылышки защищают белье по краям, обеспечивая комфорт при движении.</p>
<p>Количество 16 штук.</p>
              </div>
              </div>
            </div>
          </div>
                  <div id="product-65" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Ежедневки от цистита (20 шт в упаковке)</h2>
              </div>
              <div class="modal-body text-product">
              	<p>Ежедневки от цистита (20 шт в упаковке)</p>
<ul>
<li>Устраняется зуд и воспаление</li>
<li>Снимаются болезненность и нерегулярность менструального цикла</li>
<li>Восстанавливается микрофлора влагалища,  припятствуя распространению патогенной флоры</li>
<li>Обеспечивается профилактика и лечение воспалительных процессов разного генеза</li>
<li>Устраняется дисгармональные нарушения.</li>
</ul>
<p>С ежедневными прокладками Fukang вы будете себя чувствовать комфортно весь день. К тому же, они позволяют коже дышать и идет нейтрализация неприятных запахов. Благодаря прочной клейкой основе, прокладка держится прочно на все время ее использования.</p>
<p><strong><em>Показания к применению:</em></strong></p>
<ul>
<li><em>Эрозия шейки матки</em></li>
<li><em>Воспаление слизистой оболочки матки, брюшного покрова матки, придатков</em></li>
<li><em>Воспалительные процессы органов малого таза, в том числе инфекционные венерические заболевания</em></li>
<li><em>Нарушение менструального цикла</em></li>
<li><em>Адаптация климактерического периода</em></li>
<li><em>Маточные кровотечения</em></li>
<li><em>Послеродовый период</em></li>
<li><em>Кольпит (в том числе старческий)</em></li>
<li><em>Геморрой</em></li>
<li><em>Воспаление мочевого пузыря</em></li>
<li><em>Цистит</em></li>
<li><em>Кандидоз</em></li>
<li><em>Радикулит поясничного отдела</em></li>
</ul>
              </div>
              </div>
            </div>
          </div>
                  <div id="product-180" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Кордицепс для мужчин</h2>
              </div>
              <div class="modal-body text-product">
              	<p>После долгих лет сбора медицинских данных, состав ученых медиков из научно-исследовательской группы успешно разработал наиболее эффективный и безопасный растительный продукт для мужчин. В течение нескольких недель можно добиться результатов по увеличению и укреплению полового члена. Согласно уникальной формуле, созданной на основе научных данных, каждая гранула является хорошим профилактическим средством от импотенции и преждевременной эякуляции.<br />
Главные ингредиенты: Китайский кордицепс, мак , муравьи, олень, акулий экстракт, яички тибетского яка, женьшень, кнут, подснежник, родиола розовая, шафран, гиппокамп.<br />
Показания: импотенция, проспермия, поллюция, нарушение половых функций, снижение страсти, короткий и маленький мужской член, пояснично-коленная ломота, бессилие конечностей, головокружение и звон в ушах, учащенное мочеиспускание по ночам, своя слабость и ночной пот, простатит и другие симптомы, вызванные почечной недостаточностью<br />
Способ употребления и дозировка: принимать внутрь, принимать только 1/2 капсулу перед сном с теплой водой.</p>
              </div>
              </div>
            </div>
          </div>
                  <div id="product-315" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Интимный гинекологический гель</h2>
              </div>
              <div class="modal-body text-product">
              	<p><strong>Данный препарат лечит эрозию шейки матки, сокращает влагалище и регулирует вагинальный кислотно-щелочной баланс, улучшит функцию иммунный системы, имеет хороший эффект при генитальном зуде, постороннем неприятном запахе, увеличении количества бели, вагините бактериальном, вагините трихомонадном, вагините грибковым.</strong></p>
<p><strong>Состав: экстракты из кордицепса, софоры, стемоны, жгун-корня Моннье, гриба пория, сафлора красильного, алоэ и борнеола</strong></p>
<p><strong>Номер санитарного надзора: ШЭЙ0165-2013г.</strong></p>
<p><strong>Форма: 5г</strong></p>
<p><strong>Срок хранения: на упаковке</strong></p>
              </div>
              </div>
            </div>
          </div>
                  <div id="product-321" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Мыло с маслом змеи</h2>
              </div>
              <div class="modal-body text-product">
              	<p>Уникальное мыло с маслом змеи 3в1, уменьшает акне, прыщ, веснушки, разглаживает морщины. Предотвращает бактериальные инфекции кожи, эффект коллагена, и витамина Е увлажняет кожу, и делает его гладкой</p>
<p>Состав: Экстракт из масло змеи, мед, мятное масло, глицерин, экстракт из прополиса, парфюмерия</p>
              </div>
              </div>
            </div>
          </div>
                  <div id="product-342" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Мужская сила из пантов Марала и женьшеня</h2>
              </div>
              <div class="modal-body text-product">
              	<ol>
<li>Повышение потенции: быстро и мягко (безопасно) для организма обеспечивает устойчивую эрекцию уже через 15-25 минут после приёма. После оргазма происходит быстрое восстановление и мужчина может заниматься сексом не один раз за ночь. Увеличивается продолжительность полового акта, а время эрекции у мужчины может очень продолжительным (до 50 минут);</li>
<li>Лечебный эффект при наличии мужских заболеваний, а также отличная профилактика мужского здоровья.</li>
</ol>
<p><strong>Совместим с алкоголем, не краснеет лицо, не болит голова, не болит желудок. Можно применять мужчинам с гипертонией, кардиопатией и диабетом. </strong></p>
<p>Пилюли  для почки рекомендуется применять при:</p>
<ul>
<li>эректильной дисфункции;</li>
<li>импотенции;</li>
<li>преждевременной эякуляции;</li>
<li>атрофии пениса (для мужчин средних и преклонных лет);</li>
<li>воспалении простаты, частом и неполном мочеиспускании;</li>
<li>слабости функции почек, шум (звон) в ушах, болях в коленях и спине, бессоннице;</li>
<li>вялости, потере волос, слабой памяти;</li>
<li>бесплодии мужчины</li>
<li>отсутствии или пониженном сексуальном влечении.</li>
</ul>
<p><strong>Состав:</strong> женьшень из северо-восточного Китая, панты оленя из провинции Цзинхай, кордицепс китайский, снежный лотос, яичко тибетского быка, самец шелкопряда, синьзянский циноморий мясистый, ягоды дерезы, Herba Cistanches и др.</p>
<p><strong>Инструкция по применению:</strong> за 15-30 минут до постельного дела примите, запивая солоноватой водой, 1/2 ― 1 пилюлю (первый раз рекомендуется принимать 1/2 пилюли, чтобы определить подходящую Вам дозировку). Не принимайте более 1-ой пилюли в 24 часа. В случае передозировки (эрекция не проходит), пейте холодную воду, чай.</p>
<p><strong>Противопоказания:</strong></p>
<ul>
<li>не применять женщинам и несовершеннолетним мужчинам;</li>
<li>при индивидуальной непереносимости.</li>
</ul>
<p>БАД, не является лекарством.</p>
              </div>
              </div>
            </div>
          </div>
                  <div id="product-345" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Сердечно-мозговой капсула</h2>
              </div>
              <div class="modal-body text-product">
              	<p>Сердечно- мозговой капсула универсально защищает сердце и мозг, комплексно решит три основных каналов жизни: кровь, желудок и кишки, каналы и коллатерали</p>
<p>в упаковке 60 капсул</p>
              </div>
              </div>
            </div>
          </div>
                  <div id="product-352" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Ежедневки с алое лечебные</h2>
              </div>
              <div class="modal-body text-product">
              	<p><strong><em>Состав:</em></strong><em> 100%-хлопковая основа, пропитка: 24 вида экстрактов китайских трав: алоэ, мяты, ромашки, сафлора красильного, дудника китайского, эхинацеи китайской, шалфея</em></p>
<p>Ежедневные прокладки созданы с учетом анатомических особенностей женщины. Так как содержится  хлопковая основа и экстракты из 24 оздоровительных трав, то при применении, происходит ансептическое и антибактериальное действие на слизистую гениталий. Е<strong>жедневные прокладки Diamond city очень часто применяются при комплексной терапии и лечении многих гинекологических и венерических заболеваний.</strong></p>
<p><strong>Благодаря применению:</strong></p>
<ul>
<li>Устраняется зуд и воспаление</li>
<li>Снимаются болезненность и нерегулярность менструального цикла</li>
<li>Восстанавливается микрофлора влагалища,  припятствуя распространению патогенной флоры</li>
<li>Обеспечивается профилактика и лечение воспалительных процессов разного генеза</li>
<li>Устраняется дисгармональные нарушения.</li>
</ul>
<p>С ежедневными прокладками Diamond city вы будете себя чувствовать комфортно весь день. К тому же, они позволяют коже дышать и идет нейтрализация неприятных запахов. Благодаря прочной клейкой основе, прокладка держится прочно на все время ее использования.</p>
<p><strong><em>Показания к применению:</em></strong></p>
<ul>
<li><em>Эрозия шейки матки</em></li>
<li><em>Воспаление слизистой оболочки матки, брюшного покрова матки, придатков</em></li>
<li><em>Воспалительные процессы органов малого таза, в том числе инфекционные венерические заболевания</em></li>
<li><em>Нарушение менструального цикла</em></li>
<li><em>Адаптация климактерического периода</em></li>
<li><em>Маточные кровотечения</em></li>
<li><em>Послеродовый период</em></li>
<li><em>Кольпит (в том числе старческий)</em></li>
<li><em>Геморрой</em></li>
<li><em>Воспаление мочевого пузыря</em></li>
<li><em>Цистит</em></li>
<li><em>Кандидоз</em></li>
<li><em>Радикулит поясничного отдела</em></li>
</ul>
<p><strong>Способ применения:</strong><br />
Пользуйтесь ежедневно, прикрепив клейкой основой к нижнему белью.</p>
<p><strong>Производство:</strong> Китай</p>
              </div>
              </div>
            </div>
          </div>
                  <div id="product-356" class="modal fade">
            <div class="modal-dialog">
              <div class="modal-content text-center">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h2 class="modal-title">Женьшеневое мыло с экстрактами трав</h2>
              </div>
              <div class="modal-body text-product">
              	<p>Женьшеневое мыло- эффективный продукт, созданный для борьбы с акне, черными точками и пигментацией.</p>
<p>Мыло создано на основе травяного комплекса и содержит вытяжки из целебных растений, обладающих выраженными антибактериальными свойствами. Мягко очищая кожу лица, мыло вытягивает из пор загрязнения и подготавливает кожу лица к дальнейшим процедурам. Мягкий массаж мыльной пеной ощутимо улучшает циркуляцию крови и дарит природным румянец уставшей коже</p>
              </div>
              </div>
            </div>
          </div>
         
	<section class="_marketing ">
		<div class="container">
			<div class="row">
				<div class="col-xs-12 text-left" id="marketing"><h3 class="wow fadeInLeftBig">Маркетинг</h3></div>
					
				<div class="col-md-7 col-xs-12 text-left _marketing-block wow fadeInLeftBig">
					<div class="_marketing_item">
						<h4>Вход «Start» 20.000 тг + товар</h4>
						<div style="line-height: 1; font-size: 14px;">
<p>1 уровень личка 4000 х 2 = 8000 тг</p>
<p>2 уровень 1200 х 4 = 4800 тг</p>
<p>3 уровень 1200 х 8 = 9600 тг</p>
<p>4 уровень 1200 х 16 = 19 200 тг</p>
<p>5 уровень 1200 х 32 = 38 400 тг</p>
<p>6 уровень 1200 х 64 = 76 800 тг</p>
<p>7 уровень 1200 х 128 = 153 600 тг бонус 250.000 тг (-10%налог)</p>
<p>2 ветки работают, и если будет 4 ветки, тогда умножаете на 2, Ваш доход  будет</p>
<p>1 120 800 вместе с бонусом и так бесконечно)</p>
<p>Промоушн: 1 линия если 4 человека по 20.000 подарок <strong>Мультиварка </strong><strong>Redmond</strong></p>
</div>
																		<span>Итог: 310 400 тг + 250.000 бонус = 560 400тг
</span>
											</div>
				</div>
					
				<div class="col-md-6 col-md-offset-6 col-xs-12  text-left _marketing-block wow fadeInRightBig">
					<div class="_marketing_item">
						<h4>Вход «Сапфир» 50.000 тг + товар</h4>
						<div style="line-height: 1.4; font-size: 14px;">
<ul>
<li style="list-style-type: none;">
<ul>
<li style="line-height: 1; font-size: 14px;">1 уровень личка 8000 х 2 = 16 000 тг<br />
2 уровень 3000 х 4 = 12 000 тг<br />
3 уровень 3000 х 8 = 24 000 тг<br />
4 уровень 3000 х 16 = 48 000 тг<br />
5 уровень 3000 х 32 = 96 000 тг<br />
6 уровень 3000 х 64 = 192 000 тг<br />
7 уровень 3000 х 128 = 384 000 тг бонус 500.000 тг (-10%налог)<br />
Итог: 772 000 тг + 500.000 бонус = 1 272 000тг ( когда 2 ветки работают, и если будет 4 ветки, тогда умножаете на 2, Ваш доход будет 2 544 000 вместе с бонусом и так бесконечно)</li>
</ul>
<p>Промоушн: 1 линия если 4 человека по 50.000 подарок Золотое кольцо с сапфиром</p>
<p>-10% налог удерживается только с денежных бонусов</li>
</ul>
</div>
																		<span>Итог: 772 000 тг + 500.000 бонус = 1 272 000тг</span>
											</div>
				</div>
					
				<div class="col-md-7 col-xs-12 text-left _marketing-block wow fadeInLeftBig">
					<div class="_marketing_item">
						<h4>Вход «Бриллиант» 80.000 тг + товар</h4>
						<div style="line-height: 1; font-size: 14px;">
<ul>
<li style="line-height: 1.4; font-size: 14px;">1 уровень личка 11000 х 2 = 22 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">2 уровень 4000 х 4 = 16 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">3 уровень 4000 х 8 = 32 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">4 уровень 4000 х 16 = 64 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">5 уровень 4000 х 32 = 128 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">6 уровень 4000 х 64 = 256 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">7 уровень 4000 х 128 = 512 000 тг <strong>бонус 1 000.000 тг</strong>  <strong>(-10%налог)</strong></li>
<li style="line-height: 1.4; font-size: 14px;"><strong>Итог: 1 030 000 тг + 1 000.000 бонус = 2 030 000тг </strong>( когда 2 ветки работают,</li>
<li style="line-height: 1.4; font-size: 14px;">и если будет 4 ветки, тогда умножаете на 2 Ваш доход, будет <strong>4 060 000</strong> вместе</li>
<li style="line-height: 1.4; font-size: 14px;">с бонусом и так бесконечно)</li>
<li style="line-height: 1.4; font-size: 14px;">Промоушн: 1 линия если 4 человека по 80000 подарок <strong>Золотое кольцо с Бриллиантом</strong></li>
</ul>
</div>
																		<span>Итог: 1 030 000 тг + 1 000.000 бонус = 2 030 000тг</span>
											</div>
				</div>
					
				<div class="col-md-6 col-md-offset-6 col-xs-12  text-left _marketing-block wow fadeInRightBig">
					<div class="_marketing_item">
						<h4>Вход «VIP» 200.000 тг + товар</h4>
						<div style="line-height: 1.4; font-size: 14px;">
<ul style="line-height: 1; font-size: 14px;">
<li style="line-height: 1.4; font-size: 14px;">1 уровень личка 25 000 х 2 = 50 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">2 уровень 9000 х 4 = 36 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">3 уровень 9000 х 8 = 72 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">4 уровень 9000 х 16 = 144 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">5 уровень 9000 х 32 = 288 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">6 уровень 9000 х 64 = 576 000 тг</li>
<li style="line-height: 1.4; font-size: 14px;">7 уровень 9000 х 128 = 1 152 000 тг <strong>бонус 2 500.000 тг</strong>  <strong>(-10%налог) + Автомобиль за 3.000.000 тг в подарок</strong></li>
<li style="line-height: 1.4; font-size: 14px;">Итог: 2 318 000 тг + 2 500.000 бонус = 4 818 000тг (когда 2 ветки работают, и если будет 4 ветки, тогда умножаете на 2, Ваш доход будет 9 636 000 вместе с бонусом и так бесконечно)</li>
</ul>
<p>Промоушн: 1 линия если 4 человека по 200.000 подарок <strong>Золотые часы</strong></p>
</div>
																		<span>Итог: 2 318 000 тг + 2 500.000 бонус = 4 818 000тг</span>
											</div>
				</div>
					
				<div class="col-md-7 col-xs-12 text-left _marketing-block wow fadeInLeftBig">
					<div class="_marketing_item">
						<h4>Промоушн нет ограничений по срокам:</h4>
						<ul>
<li>4 лички по 20.000 тг Электроблинница</li>
<li>4 лички по 50.000 тг Золотое кольцо (печатка) с Сапфиром</li>
<li>4 лички по 80.000 тг Золотое кольцо (печатка) с Бриллиантом</li>
<li>4 лички по 200.000 тг Золотые часы</li>
</ul>
																	</div>
				</div>
					
				<div class="col-md-6 col-md-offset-6 col-xs-12  text-left _marketing-block wow fadeInRightBig">
					<div class="_marketing_item_priz">
						<h4></h4>
						<p>Вход 200.000 тг, 7 уровень 128 человек в подарок Автомобиль<img class="alignnone size-medium wp-image-267" src="./wp-content/uploads/2018/03/IMG_20180330_090800-300x197.png" alt="" width="300" height="197" srcset="./wp-content/uploads/2018/03/IMG_20180330_090800-300x197.png 300w, ./wp-content/uploads/2018/03/IMG_20180330_090800.png 480w" sizes="(max-width: 300px) 100vw, 300px" /></p>
																	</div>
				</div>
					
				<div class="col-md-7 col-xs-12 text-left _marketing-block wow fadeInLeftBig">
					<div class="_marketing_item_priz">
						<h4></h4>
						<p>Бонус! VIP пакет 200.000 тг, 7 уровень 128 человек получаете бонус 2.500.000 тенге  + компания покупает вам МАШИНУ за 3.000.000 с салона на ваш выбор!!!!  Diamond City 💎 срок не ограничен</p>
																	</div>
				</div>
	
			</div>
		</div>
	</section>
	<section class="_price">
		<div class="container">
			<div class="row">
				<div class="col-md-12 text-left" id="price-list">
					<h3 class="wow fadeInLeftBig">Прайс-лист</h3>
				</div>
				<div class="col-md-12">
					<div class="_price_table">
						<ul>
							<li class="wow fadeInRightBig">
								<div class="_price_table_left">Название товара</div>
								<div class="_price_table_right"><span>Код</span><span>Цена</span></div>
							</li>
$i = 1;
																						<li class="wow fadeInRightBig">
															<div class="_price_table_left"><p>Фитотампон (6шт в упаковке)</p>
</div>
																<div class="_price_table_right"><span>002</span><span>7500 тг</span></div>
							</li>
															<li class="wow fadeInLeftBig">
																						<div class="_price_table_left"><p>Прокладки на критические дни</p>
</div>
																<div class="_price_table_right"><span>005</span><span>1500 тг</span></div>
							</li>
																						<li class="wow fadeInRightBig">
															<div class="_price_table_left"><p>Мужская сила из женьшеня и пантов отдельно по 3500 тг (3шт в пачке на 9 раз)</p>
</div>
																<div class="_price_table_right"><span>010</span><span>14000 тг</span></div>
							</li>
															<li class="wow fadeInLeftBig">
																						<div class="_price_table_left"><p>Ежедневки лечебные с алое</p>
</div>
																<div class="_price_table_right"><span>022</span><span>1500 тг</span></div>
							</li>
																						<li class="wow fadeInRightBig">
															<div class="_price_table_left"><p>Ежедневки от цистита 20 шт</p>
</div>
																<div class="_price_table_right"><span>018</span><span>1200 тг</span></div>
							</li>
															<li class="wow fadeInLeftBig">
																						<div class="_price_table_left"><p>Мыло с маслом змеи 3в1</p>
</div>
																<div class="_price_table_right"><span>025</span><span>2500 тг</span></div>
							</li>
																						<li class="wow fadeInRightBig">
															<div class="_price_table_left"><p>Мыло с женьшенем отбеливающий</p>
</div>
																<div class="_price_table_right"><span>030</span><span>3000 тг</span></div>
							</li>
															<li class="wow fadeInLeftBig">
																						<div class="_price_table_left"><p>Сердечно-мозговой капсула</p>
</div>
																<div class="_price_table_right"><span>085</span><span>8500 тг</span></div>
							</li>
																						<li class="wow fadeInRightBig">
															<div class="_price_table_left"><p>Жевательный кальции</p>
</div>
																<div class="_price_table_right"><span>080</span><span>8000 тг</span></div>
							</li>
															<li class="wow fadeInLeftBig">
																						<div class="_price_table_left"><p>Пластырь от гипертонии</p>
</div>
																<div class="_price_table_right"><span>111</span><span>1000 тг</span></div>
							</li>
																						<li class="wow fadeInRightBig">
															<div class="_price_table_left"><p>Водонагреватель для кухни</p>
</div>
																<div class="_price_table_right"><span></span><span>20000 тг</span></div>
							</li>
															<li class="wow fadeInLeftBig">
																						<div class="_price_table_left"><p>Водонагреватель для душа</p>
</div>
																<div class="_price_table_right"><span>039</span><span>27000тг</span></div>
							</li>
																						<li class="wow fadeInRightBig">
															<div class="_price_table_left"><p>Зубная паста лечебная</p>
</div>
																<div class="_price_table_right"><span>038</span><span>3000тг</span></div>
							</li>
															<li class="wow fadeInLeftBig">
																						<div class="_price_table_left"><p>Зубная щетка лечебная (с золотым напылением, с углем)</p>
</div>
																<div class="_price_table_right"><span>037</span><span>2500 тг</span></div>
							</li>
	
						</ul>
						
					</div>
				</div>
			</div>
		</div>
	</section>
	<section class="_reviews">
		<div class="container">
			<div class="row">
				<div class="col-xs-12 text-left wow fadeInLeftBig" id="feeds">
					<h3>Отзывы</h3>
				</div>
			<div class="col-md-2 wow fadeInLeftBig">
				<div class="_reviews_image">
					<img src="./wp-content/uploads/2018/02/girl-1037882_960_720.jpg" alt="reviews">
				</div>
			</div>
			<div class="col-md-10 wow fadeInRightBig">
				<div class="_reviews_text">
					<p>Продукты &#8212; просто чудо! И это без всякого преувеличения. Я тщательно изучила все свойства и состав продуктов компании. Они действительно уникальны. Сделана продукция на высокотехнологичном производстве, а ее основа &#8212; рецепты традиционной китайской медицины.</p>
				</div>
			</div>
			<div class="col-md-2 wow fadeInLeftBig">
				<div class="_reviews_image">
					<img src="./wp-content/uploads/2018/02/s1a-Копировать.jpg" alt="reviews">
				</div>
			</div>
			<div class="col-md-10 wow fadeInRightBig">
				<div class="_reviews_text">
					<p>У меня наблюдалась пароксизмальная тахикардия. Приступы были разной продолжительности от 10 минут до полутора часов. С возрастом эти приступы становились чаще и длительнее. Я начала принимать кордицепс. Через три месяца регулярного употребления продукции состояние моего здоровья значительно улучшилось. Самое неожиданное для меня было то, что ушли приступы тахикардии.</p>
				</div>
			</div>
	
			</div>
		</div>
	</section>
		<section class="_contacts">
		<div class="container" id="contact">
			<div class="row wow fadeInLeftBig">
				<div class="col-xs-12 text-left wow fadeInLeftBig">
					<h3>Контакты</h3>
				</div>
				<div class="col-md-5 col-sm-6 col-xs-12  _contacts_left text-left">
					<div class="_contacts_info">
						<span>Акбергенова Диана Сабитовна  
<br>и .о. директора</span>
						<span><a href="tel:+ 7 707 21 77 466" style="position: relative;">+ 7 707 21 77 466</a></span>
						<span><a href="mailro:diamond8city@gmail.com   " style="position: relative;">diamond8city@gmail.com  </a></span>
						<span><a href="https://yandex.ua/maps/?z=14&ll=76.9047921903606%2C43.23563335842474&l=map&origin=jsapi_2_1_56&from=api-maps&um=constructor%3Abae47bfc427b031197cbf8b206ad8d6292917e071437a15b73b6596508280d56&mode=usermaps" target="_blank" style="position: relative;">г. Алматы, ул. Мынбаева, 46 офис 211</a></span>
					</div>

				</div>
				<div class="col-md-5 col-sm-6 col-xs-12 col-md-offset-2 text-left _contacts_right">
					<div class="_contacts_form">
						<h4>Напишите нам</h4>
						<div role="form" class="wpcf7" id="wpcf7-f86-o1" lang="ru-RU" dir="ltr">
<div class="screen-reader-response"></div>
<form action="/#wpcf7-f86-o1" method="post" class="wpcf7-form" novalidate="novalidate">
<div style="display: none;">
<input type="hidden" name="_wpcf7" value="86" />
<input type="hidden" name="_wpcf7_version" value="5.0" />
<input type="hidden" name="_wpcf7_locale" value="ru_RU" />
<input type="hidden" name="_wpcf7_unit_tag" value="wpcf7-f86-o1" />
<input type="hidden" name="_wpcf7_container_post" value="0" />
</div>
<p><span class="wpcf7-form-control-wrap text-218"><input type="text" name="text-218" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required diamant-name" aria-required="true" aria-invalid="false" placeholder="Имя" /></span><br />
<span class="wpcf7-form-control-wrap tel-565"><input type="tel" name="tel-565" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-tel wpcf7-validates-as-required wpcf7-validates-as-tel diamant-tel" aria-required="true" aria-invalid="false" placeholder="Телефон" /></span><br />
<span class="wpcf7-form-control-wrap email-714"><input type="email" name="email-714" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-email wpcf7-validates-as-email diamant-email" aria-invalid="false" placeholder="Электронная почта" /></span></p>
<p><input type="submit" value="ОТПРАВИТЬ" class="wpcf7-form-control wpcf7-submit diamant-send" /></p>
<div class="wpcf7-response-output wpcf7-display-none"></div></form></div>					</div>
				</div>
			</div>
		</div>
	</section>

		<footer class="_footer">
		<div class="container">
			<div class="row">
				<div class="col-md-6  wow fadeInLeftBig">
					<div class="_footer_info">
						<h4><a href="/">Diamond City</a></h4>
						<span><a href="tel:+ 7 707 21 77 466">+ 7 707 21 77 466</a></span>
						<span><a href="mailto:diamond8city@gmail.com  ">diamond8city@gmail.com  </a></span>
						<span><a href="https://yandex.ua/maps/?z=14&ll=76.9047921903606%2C43.23563335842474&l=map&origin=jsapi_2_1_56&from=api-maps&um=constructor%3Abae47bfc427b031197cbf8b206ad8d6292917e071437a15b73b6596508280d56&mode=usermaps" target="_blank">г. Алматы, ул. Мынбаева, 46 офис 211</a></span>
						<div class="_footer_info_social">
							<a href=""><img src="./wp-content/themes/mytheme/img/icon/vk.png" target="_blank" alt=""></a>
							<a href=""><img src="./wp-content/themes/mytheme/img/icon/fb.png" target="_blank" alt=""></a>
							<a href=""><img src="./wp-content/themes/mytheme/img/icon/telegram.png" target="_blank" alt=""></a>
							<a href=""><img src="./wp-content/themes/mytheme/img/icon/twitter.png" target="_blank" alt=""></a>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-xs-12 _footer_map wow fadeInRightBig">
					<div class="_footer_map_item">
						<script type="text/javascript" charset="utf-8" async src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Abae47bfc427b031197cbf8b206ad8d6292917e071437a15b73b6596508280d56&amp;width=100%25&amp;height=375&amp;lang=ru_UA&amp;scroll=true"></script>
					</div>
				</div>
			</div>
		</div>
		<a id="back-to-top" href="" class="btn btn-lg back-to-top" role="button" data-toggle="tooltip" data-placement="right"><img src="./wp-content/themes/mytheme/img/up.png" alt=""></a>
	</footer>
		<div class="col-xs-12 tel-what">
		<div class="col-xs-6 desk2">
			<i class="fa fa-phone" aria-hidden="true" style="padding:5px;"></i>
			<a href="tel:+ 7 707 21 77 466">ПОЗВОНИТЬ</a>
		</div>
		<div class="col-xs-6 desk1">
			<i class="fa fa-whatsapp" aria-hidden="true" style="padding:5px;"></i><a href="https://api.whatsapp.com/send?phone=77072177466" target="_blank"> WHATSAPP</a><br>
		</div>
	</div>
	<script src="./wp-content/themes/mytheme/js/jquery-2.2.3.min.js"></script>
	<script src="./wp-content/themes/mytheme/js/bootstrap.min.js"></script>
	<!--<script src="./wp-content/themes/mytheme/js/scripts.min.js"></script>-->
	<link rel="stylesheet" href="./wp-content/themes/mytheme/css/bootstrap.min.css">
	<link rel="stylesheet" href="./wp-content/themes/mytheme/css/main.css">
	<script>
	if(window.screen.width > 767) {
	  document.write('<script src="./wp-content/themes/mytheme/js/wow.js"><\/script>');
	}
	</script>
	<script>
		var wow = new WOW(
		{
			boxClass:     'wow',      // animated element css class (default is wow)
			animateClass: 'animated', // animation css class (default is animated)
			offset:       0,          // distance to the element when triggering the animation (default is 0)
			mobile:       true,       // trigger animations on mobile devices (default is true)
			live:         true,       // act on asynchronously loaded content (default is true)
			callback:     function(box) {
			// the callback is fired every time an animation is started
			// the argument that is passed in is the DOM node being animated
			},
			scrollContainer: null // optional scroll container selector, otherwise use window
		}
		);
		wow.init();
	</script>
	<script>
	$(".menu-button").click(function() {
		$(".hiddenMenu").stop(true, true).animate({
			left: 0,
			opacity: 1
		});
		$('.overlay').fadeIn();
	})
	$(".menu-button-close, .hiddenMenu ul a").click(function() {
		$(".hiddenMenu").stop(true, true).animate({
			left: "-270px",
			opacity: 0
		});
		$(".overlay").fadeOut();
	})
	</script>
	<script>
		$(document).ready(function(){
	    $("._header_menu").on("click","a", function (event) {
		      event.preventDefault();
		      var id  = $(this).attr('href'),
		      top = $(id).offset().top;
		      $('body,html').animate({scrollTop: top -60}, 1500);
		  	});
		});
		$(document).ready(function(){
	    $(".hiddenMenu").on("click","a", function (event) {
		      event.preventDefault();
		      var id  = $(this).attr('href'),
		      top = $(id).offset().top;
		      $('body,html').animate({scrollTop: top -60}, 1500);
		  	});
		});
	</script>
	<script>
  	$(document).ready(function() {
	$(window).scroll(function() {
	    if ($(this).scrollTop() > 50) {
	        $('#back-to-top').fadeIn();
	    } else {
	        $('#back-to-top').fadeOut();
	    }
	});
	// scroll body to 0px on click
	$('#back-to-top').click(function() {
	    $('#back-to-top').tooltip('hide');
	    $('body,html').animate({
	        scrollTop: 0
	    }, 800);
	    return false;
	});

	$('#back-to-top').tooltip('show');
	});
	</script>
	<script type="text/javascript">
	$(document).ready(function(){

	  var windowHeight = $(window).height();
	 

	    $(window).resize(function() {
	      if( $(window).height() <= 470 ) {
	        $(".hiddenMenu ul li").css(
	            {'margin-top': '0', 'margin-bottom': '5px'}
	        );
	        $(".hiddenMenu ul li a").css(
	            {'padding-top': '0', 'padding-bottom': '0', 'font-size': '16px'}
	        );
	        $(".hidden-menu-language").css(
	            {'margin-top': '10px'}
	        );
	        
	        $(".hidden-menu-language-buttons input").css(
	            {'width': '40px', 'height': '25px'}
	        );

	      }
	      });

	   
	 
	});
	</script>
	</body>
</html>
