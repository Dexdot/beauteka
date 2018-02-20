'use strict';

$(function() {
	// Menu navigation script (toggling)
		$('.hamburger, .nav__link').click(function() {
			$('.hamburger').toggleClass('is-active');
			$('.nav').toggleClass('is-active');
			$('.petal').toggleClass('nozindex');
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
			$('.expert__article').removeAttr('style');
			var articles = $('.expert__article');
			var maxArticleHeight = articles[0].clientHeight;

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

			var mqFlag = 0;
			// Задаем картинкам нужный top
			for (var i = 0; i < experts.length; i++) {
				mediaQueries(991, function() {
					mqFlag = 991;
				});
				mediaQueries(767, function() {
					mqFlag = 767;
				});
				mediaQueries(480, function() {
					mqFlag = 480;
				});
				var img = $(experts[i]).find('.expert__img');
				switch (mqFlag) {
					case 991:
						$(img).css('top', innerHeight - 40 + innerTop + 'px');
						break;
					case 767:
						$(img).css('top', innerHeight - 30 + innerTop + 'px');
						break;
					case 480:
						$(img).css('top', innerHeight + innerTop + 'px');
						break;
					default:
						$(img).css('top', 30 + innerHeight + innerTop + 'px');
						break;
				}
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

		// Задаем высоту секции (для более плавной анимации)
		var expertsSectionHeight = function() {
			var height = ($('#experts').height() - finalHeight) + finalHeight + 40;
			$('#experts').css('min-height', height + 'px');
		};
		expertsSectionHeight();

		window.addEventListener('resize', function() {
			if (!$('.expert').hasClass('is-opened') && !$('.expert').hasClass('is-closed')) {
				setArticlesHeight();
				setImgTop();
				setExpertHeight();
			}
		});

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
			
			var resetScrollTop = function() {
				$('.expert-opened__inner').scrollTop(0);
			};

			if ($(this).hasClass('is-opened')) {
				return;
			}

			var switching = $('.expert').hasClass('is-opened') && $(this).hasClass('is-closed');
			if (switching) {
				tl
					.to('.expert.is-opened .expert-closed__title', 0, {opacity: 0})
					.to('.expert-opened', 0.4, {ease: easing, opacity: 0})
					.to('.expert-opened__img', 0.4, {ease: easing, x: '50%'}, '-=0.4')
			}

			var openedContent = $(this).find('.expert-opened');

			$('.expert-closed__title').css({
				'pointer-events': 'none',
				opacity: 0
			});

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
				.to(openedContent, 0, {ease: easing, display: 'block', 'pointer-events': 'auto', cursor: 'auto', onComplete: resetScrollTop},
					switching ? '-=1' : '+=0')
				.to(openedContent, 0.4, {ease: easing, opacity: 1},
					switching ? '-=0.6' : '+=0')
				.to($(openedContent).find('.expert-opened__img'), 0.4, {ease: easing, x: '0%'}, '-=0.4')
				.to('.expert.is-closed .expert-closed__title', 0, {'pointer-events': 'auto'}, '-=0.4')
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
					.to('.expert-opened', 0.4, {ease: easing, opacity: 0, cursor: 'pointer'})
					.to('.expert-opened', 0, {ease: easing, display: 'none'})
					.to($(openedContent).find('.expert-opened__img'), 0.4, {ease: easing, x: '50%'}, '-=0.4')
					.to(openedContent, 0, {'pointer-events': 'none'})
					.to('.expert-closed__title', 0, {'pointer-events': 'none'})
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
				setTimeout(function() {
					setExpertHeight();
				}, 1000);
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
	}
	function mediaQueries(width, callback) {
		var handleMatchMedia = function (mediaQuery) {
			if (mediaQuery.matches) {
				callback();
			}
		};
		mql = window.matchMedia('all and (max-width: ' + width + 'px)');
		handleMatchMedia(mql);
		mql.addListener(handleMatchMedia);
	}


	var version = detectIE();

	if (version === false) {
	  $('.map-button').removeClass('ie');
	  $('.product__info').removeClass('ie');
	} else if (version >= 12) {
	} else {
	  $('.map-button').addClass('ie');
	  $('.product__info').addClass('ie');
	}

	function detectIE() {
	  var ua = window.navigator.userAgent;

	  var msie = ua.indexOf('MSIE ');
	  if (msie > 0) {
	    // IE 10 or older => return version number
	    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	  }

	  var trident = ua.indexOf('Trident/');
	  if (trident > 0) {
	    // IE 11 => return version number
	    var rv = ua.indexOf('rv:');
	    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	  }

	  var edge = ua.indexOf('Edge/');
	  if (edge > 0) {
	    // Edge (IE 12+) => return version number
	    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	  }

	  // other browser
	  return false;
	}

	// Mobile map (< 767px)
	var initMobMap = function() {
		var moscowCenter = {lat: 55.751132, lng: 37.624252};
		var mapStyles = [
		  {
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#f5f5f5"
		      }
		    ]
		  },
		  {
		    "elementType": "labels.icon",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#616161"
		      }
		    ]
		  },
		  {
		    "elementType": "labels.text.stroke",
		    "stylers": [
		      {
		        "color": "#f5f5f5"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative.land_parcel",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#bdbdbd"
		      }
		    ]
		  },
		  {
		    "featureType": "poi",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#eeeeee"
		      }
		    ]
		  },
		  {
		    "featureType": "poi",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#757575"
		      }
		    ]
		  },
		  {
		    "featureType": "poi.park",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#e5e5e5"
		      }
		    ]
		  },
		  {
		    "featureType": "poi.park",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#9e9e9e"
		      }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#ffffff"
		      }
		    ]
		  },
		  {
		    "featureType": "road.arterial",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#757575"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#dadada"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#616161"
		      }
		    ]
		  },
		  {
		    "featureType": "road.local",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#9e9e9e"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.line",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#e5e5e5"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.station",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#eeeeee"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#c9c9c9"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#9e9e9e"
		      }
		    ]
		  }
		];
		
		var map = new google.maps.Map(document.querySelector('.map-mob'), {
			center: moscowCenter,
			disableDefaultUI: true,
			zoom: 10
		});
		map.setOptions({styles: mapStyles});

		var icon = {
			url: '../img/svg/logo.svg',
	    scaledSize: new google.maps.Size(21, 21)
		};
		var locations = [
			{lat: 55.623292, lng: 37.603828}, // Днепропетровская ул., 2
			{lat: 55.753743, lng: 37.882196}, // Юбилейный пр., 57
			{lat: 55.753868, lng: 37.662233}, // 2-й Сыромятнический пер., 1 
			{lat: 55.761528, lng: 37.585943}, // Ул. Садовая-Кудринская, дом 7
			{lat: 55.612327, lng: 37.732923}, // Ореховый б-р, 22А
			{lat: 55.790073, lng: 37.678429} // Сокольническая площадь, 4а
		];
		var markers = locations.map(function(location, i) {
			return new google.maps.Marker({
				position: locations[i],
				map: map,
				icon: icon
			});
		});
	}
	initMobMap();

});

// Main map (> 767px)
var initMap = function() {
	var moscowCenter = {lat: 55.751132, lng: 37.624252};
	var mapStyles = [
	  {
	    "elementType": "geometry",
	    "stylers": [
	      {
	        "color": "#f5f5f5"
	      }
	    ]
	  },
	  {
	    "elementType": "labels.icon",
	    "stylers": [
	      {
	        "visibility": "off"
	      }
	    ]
	  },
	  {
	    "elementType": "labels.text.fill",
	    "stylers": [
	      {
	        "color": "#616161"
	      }
	    ]
	  },
	  {
	    "elementType": "labels.text.stroke",
	    "stylers": [
	      {
	        "color": "#f5f5f5"
	      }
	    ]
	  },
	  {
	    "featureType": "administrative.land_parcel",
	    "elementType": "labels.text.fill",
	    "stylers": [
	      {
	        "color": "#bdbdbd"
	      }
	    ]
	  },
	  {
	    "featureType": "poi",
	    "elementType": "geometry",
	    "stylers": [
	      {
	        "color": "#eeeeee"
	      }
	    ]
	  },
	  {
	    "featureType": "poi",
	    "elementType": "labels.text.fill",
	    "stylers": [
	      {
	        "color": "#757575"
	      }
	    ]
	  },
	  {
	    "featureType": "poi.park",
	    "elementType": "geometry",
	    "stylers": [
	      {
	        "color": "#e5e5e5"
	      }
	    ]
	  },
	  {
	    "featureType": "poi.park",
	    "elementType": "labels.text.fill",
	    "stylers": [
	      {
	        "color": "#9e9e9e"
	      }
	    ]
	  },
	  {
	    "featureType": "road",
	    "elementType": "geometry",
	    "stylers": [
	      {
	        "color": "#ffffff"
	      }
	    ]
	  },
	  {
	    "featureType": "road.arterial",
	    "elementType": "labels.text.fill",
	    "stylers": [
	      {
	        "color": "#757575"
	      }
	    ]
	  },
	  {
	    "featureType": "road.highway",
	    "elementType": "geometry",
	    "stylers": [
	      {
	        "color": "#dadada"
	      }
	    ]
	  },
	  {
	    "featureType": "road.highway",
	    "elementType": "labels.text.fill",
	    "stylers": [
	      {
	        "color": "#616161"
	      }
	    ]
	  },
	  {
	    "featureType": "road.local",
	    "elementType": "labels.text.fill",
	    "stylers": [
	      {
	        "color": "#9e9e9e"
	      }
	    ]
	  },
	  {
	    "featureType": "transit.line",
	    "elementType": "geometry",
	    "stylers": [
	      {
	        "color": "#e5e5e5"
	      }
	    ]
	  },
	  {
	    "featureType": "transit.station",
	    "elementType": "geometry",
	    "stylers": [
	      {
	        "color": "#eeeeee"
	      }
	    ]
	  },
	  {
	    "featureType": "water",
	    "elementType": "geometry",
	    "stylers": [
	      {
	        "color": "#c9c9c9"
	      }
	    ]
	  },
	  {
	    "featureType": "water",
	    "elementType": "labels.text.fill",
	    "stylers": [
	      {
	        "color": "#9e9e9e"
	      }
	    ]
	  }
	];
	
	var map = new google.maps.Map(document.querySelector('.map'), {
		center: moscowCenter,
		disableDefaultUI: true,
		scrollwheel: true,
		zoom: 10
	});
	map.setOptions({styles: mapStyles});

	var icon = {
		url: '../img/svg/logo.svg',
    scaledSize: new google.maps.Size(21, 21)
	};
	var locations = [
		{lat: 55.623292, lng: 37.603828}, // Днепропетровская ул., 2
		{lat: 55.753743, lng: 37.882196}, // Юбилейный пр., 57
		{lat: 55.753868, lng: 37.662233}, // 2-й Сыромятнический пер., 1 
		{lat: 55.761528, lng: 37.585943}, // Ул. Садовая-Кудринская, дом 7
		{lat: 55.612327, lng: 37.732923}, // Ореховый б-р, 22А
		{lat: 55.790073, lng: 37.678429} // Сокольническая площадь, 4а
	];
	var markers = locations.map(function(location, i) {
		return new google.maps.Marker({
			position: locations[i],
			map: map,
			icon: icon
		});
	});

	var hideMarkers = function() {
		markers.forEach(function(marker) {
			marker.setVisible(false);
		});
	};
	var showMarkers = function() {
		markers.forEach(function(marker) {
			marker.setVisible(true);
		});
	};
	$('.map-button').on('click', function() {
		$('.map-button').removeClass('is-active');
		$(this).addClass('is-active');

		var btnIndex = $(this).index();
		if (btnIndex === 0) {
			showMarkers();
			map.setZoom(10);
			map.setCenter(moscowCenter);
		} else {
			btnIndex--;
			hideMarkers();
			markers[btnIndex].setVisible(true);
			map.setZoom(14);
			map.setCenter({lat: markers[btnIndex].getPosition().lat(), lng: markers[btnIndex].getPosition().lng()});
		}
	});
};