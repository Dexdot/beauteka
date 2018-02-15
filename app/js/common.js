'use strict';

$(function() {
	// Menu navigation script (toggling)
		$('.hamburger, .nav__link').click(function() {
			$('.hamburger').toggleClass('is-active');
			$('.nav').toggleClass('is-active');
		});

	// Smooth scroll
		$("a[href*='#']").on('click', function(event) {
			event.preventDefault();
	    var target = $(this).attr('href');
	    var top = $(target).offset().top + parseInt($(target).css('padding-top'));
	    $('html, body').animate({
	      scrollTop: top},
	      1000);
		});

	// Modals
		$('.modal-close').on('click', function() {
			$('.modal-overlay').fadeOut();
		});
		$('.btn').on('click', function() {
			$('.modal-overlay').fadeIn();
		});

	// Test

		var test = function() {
			var nextBtn = $('.test-link');
			var restartBtn = $('.test-card__link');
			var allTests = $('.test div[data-test]');

			nextBtn.on('click', function() {
				allTests.hide();

				var target = $(this).attr('href');
				var top = $(target).offset().top;

				var testIndex = +$(this).attr('data-test');

				switch (testIndex) {

					// С листьев на вопросы
					case 1:
						testIndex++;
						$(this).attr('data-test', testIndex);
						nextBtn.removeClass('is-down');
						break;

					// С ласт вопроса к итогу
					case allTests.length - 1:
						testIndex++;
						$(this).attr('data-test', testIndex);
						nextBtn.hide();
						break;
					default:
						testIndex++;
						$(this).attr('data-test', testIndex);
						break;
				}

				// Записываем индекс в атрибут и показываем следующий вопрос
				$(this).attr('data-test', testIndex);
				$('.test div[data-test="' + testIndex + '"]').show();
			});

			// Возвращаемся в начало
			restartBtn.on('click', function() {
				allTests.hide();
				nextBtn.attr('data-test', 1);
				nextBtn.addClass('is-down');
				nextBtn.show();
				$('.test div[data-test="1"]').show();
			});
		};
		test();

	// Experts

		// Задаем всем артиклям высоту, равной максимальной высоте артиклей
		var setArticlesHeight = function () {

			var articles = $('.expert__article'),
					maxArticleHeight = articles[0].clientHeight;

			// Находим макс
			for (var i = 0; i < articles.length; i++) {
				if (articles[i].clientHeight > maxArticleHeight) {
					maxArticleHeight = articles[i].clientHeight;
				}
			}

			// Задаем высоту
			for (var i = 0; i < articles.length; i++) {
				 $(articles[i]).css('height', maxArticleHeight + 'px');
			}
		};
		setArticlesHeight();

		var experts = $('.expert');
		var innerHeight;

		// Задаем top для картинки
		var setImgTop = function() {
			var inners = $('.expert__inner');
			var innerTop = +$('.expert__inner').css('min-height').split('px')[0];
			var innerHeights = [];
			for (var i = 0; i < inners.length; i++) {
				innerHeights.push(+$(inners[i]).css('height').split('px')[0]);
			}

			// Находим макс высоту иннеров
			innerHeight = getMax(innerHeights);

			// Задаем картинкам нужный top
			for (var i = 0; i < experts.length; i++) {
				var img = $(experts[i]).find('.expert__img');
				$(img).css('top', 30 + innerHeight + innerTop + 'px');
			}
		};
		setImgTop();

		// Задаем высоту блоков
		var setExpertHeight = function() {
			var images = $('.expert__img');
			var imgHeights = [];
			for (var i = 0; i < images.length; i++) {
				imgHeights.push(+$(images[i]).css('height').split('px')[0]);
			}

			var imgTop = +$('.expert__img').css('top').split('px')[0];
			var imgHeight = getMax(imgHeights);

			for (var i = 0; i < experts.length; i++) {
				$(experts[i]).css('height', 25 + imgHeight + imgTop + 'px');
			}
		};
		setExpertHeight();
		var finalHeight = +$('.expert').css('height').split('px')[0];

		// Experts animation
		var tl = new TimelineMax();
		var easing = Power1.easeInOut;
		var hasCloseHandler;

		$('.expert').on('click', function() {

			var target = '#experts-outer';
			var top = $(target).offset().top;
			$('html, body').animate({
			  scrollTop: top},
			  400);
			
			if ($(this).hasClass('is-opened')) {
				return;
			}

			var switching = $('.expert').hasClass('is-opened') && $(this).hasClass('is-closed');
			if (switching) {
				tl
					.to('.expert.is-opened .expert-closed__title', 0, {display: 'none', opacity: 0})
					.to('.expert-opened', 0.4, {ease: easing, opacity: 0, backgroundPosition: '135% bottom'})
			}

			var openedContent = $(this).find('.expert-opened');

			$('.expert-closed__title').hide();

			$('.expert').addClass('is-closed');
			$(this).removeClass('is-closed');

			$('.expert').removeClass('is-opened');
			$(this).addClass('is-opened');

			// Раскрытие карточек
			tl
				.to('.expert__inner, .expert__img', 0.3,
					{ease: easing, opacity: 0, y: 100})
				.to('.expert', 0.4,
					{ease: easing, height: '100vh'},
					'+=0.2')
				.to('.expert.is-closed', 0.4,
					{ease: easing, width: $('.expert.is-closed').css('min-width')},
					switching ? '-=1' : '-=0.4')
				.to('.expert.is-opened', 0.4,
					{ease: easing, width: '100%'},
					switching ? '-=1' : '-=0.4')
				.to(openedContent, 0, {ease: easing, display: 'block'},
					switching ? '-=1' : '+=0')
				.to(openedContent, 0.4, {ease: easing, opacity: 1, backgroundPosition: '95% bottom', cursor: 'auto'},
					switching ? '-=0.6' : '+=0')
				.to('.expert.is-closed .expert-closed__title', 0, {display: 'block'}, '-=0.4')
				.to('.expert.is-closed .expert-closed__title', 0.4, {opacity: 1}, '-=0.4')
				.fromTo($(openedContent).find('.expert-opened__inner'), 0.6,
					{ease: easing, y: '70%', opacity: 0},
					{ease: easing, y: '0%', opacity: 1}, '-=1')

			
			var onOpenedClick = function(e) {
				e.stopPropagation();

				var showImage = function() {

					// Показываем картинку при наведении (убираем opacity: 0 из инлайн-стилей)
					var imgStyle = $('.expert__img').attr('style');
					var opacityIndex = imgStyle.indexOf('opacity: 0');
					if (opacityIndex != -1) {
						$('.expert__img').attr('style', imgStyle = imgStyle.slice(0, opacityIndex) + imgStyle.slice(opacityIndex + 10));
					}
				};
				$('.expert').removeClass('is-closed');

				// Сворачивание
				tl
					.to($('.expert-opened'), 0.4, {ease: easing, opacity: 0, backgroundPosition: '135% bottom', cursor: 'pointer'})
					.to(openedContent, 0, {display: 'none'})
					.to('.expert-closed__title', 0, {display: 'none'})
					.to('.expert-closed__title', 0.4, {opacity: 0})
					.to('.expert', 0.4,
						{width: '25%', height: finalHeight, onComplete: showImage}, '-=0.4')
					.fromTo('.expert__inner', 0,
						{ease: easing, x: '-50%', y: '100px'},
						{ease: easing, x: '-50%', y: '-50%'})
					.fromTo('.expert__img', 0,
						{ease: easing, x: '-100%', y: 100},
						{ease: easing, x: '-100%', y: 0})
					.fromTo('.expert__inner', 0.4,
						{ease: easing, opacity: 0},
						{ease: easing, opacity: 1})

				if (hasCloseHandler) $('.expert__close').off('click', onOpenedClick);
				hasCloseHandler = false;

				$('.expert').removeClass('is-opened');
			};
			if (!hasCloseHandler) $('.expert__close').on('click', onOpenedClick);
			hasCloseHandler = true;

		});

		// Gradient
		$('.expert-opened__inner').on('scroll', function(e) {
			var gradient = $('.expert__gradient');
			var maxScrollTop = Math.floor($(this)[0].scrollHeight - $(this).height());
			if ($(this).scrollTop() === maxScrollTop) {
				gradient.hide();
			} else if ($(this).scrollTop() < maxScrollTop) {
				gradient.show();
			}
		});

	function getMax(numArr) {
		if (!numArr) return;
		var max = numArr[0];
		for (var i = 1; i < numArr.length; i++) {
			if (numArr[i] > max) {
				max = numArr[i];
			}
		}
		return max;
	};


});