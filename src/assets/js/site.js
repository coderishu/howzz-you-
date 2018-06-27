
$(document).ready(function(){

	$('.project-slide.owl-carousel').owlCarousel({
    loop:false,
    margin:10,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:true,
						slideBy:1
        },
        480:{
            items:2,
            nav:true,
						slideBy:2
        },
        600:{
            items:3,
            nav:true,
						slideBy:3
        },
        1000:{
            items:4,
            nav:true,
						slideBy:6
        }
    }
});
	$('.owl-carousel').owlCarousel({
    loop:false,
    margin:10,
    responsiveClass:true,
    responsive:{
        0:{
            items:2,
            nav:true,
						slideBy:2
        },
        600:{
            items:3,
            nav:true,
						slideBy:3
        },
        768:{
            items:4,
            nav:true,
						slideBy:4
        },
        1025:{
            items:6,
            nav:true,
						slideBy:6
        }
    }
});

 $(".select-dropdwn").selectBoxIt({ });
 $('.close-btn-sec').click(function() {
		$('.filters-sec').removeClass('slide-fltr')
});
$('.drop-dwn-sec .dropdwn-wrapper > ul > li > a').click(function() {
		$(this).siblings(".sub-menu").slideToggle();
});
 $('.checkout-sub-total .items-dtails .items').click(function() {
		$(this).siblings('.chkout-items').slideToggle();
		$(this).toggleClass('rotate');
});
$('.filter-responsive').click(function() {
		$('.filters-sec').toggleClass('slide-fltr');
		$('.filters-sec form').height($(window).height() - 207);
});

$('body').on('click', '.secondry-header .drop-row', function(e) {

	$('.drop-row').not($(this)).removeClass('slide-menu')

	if (($(window).width() <= 1024)) {
		$(this).toggleClass('slide-menu');
	}
		e.stopPropagation();
});

$('body').on('click', '.secondry-header .drop-dwn', function(e) {
	e.stopPropagation();
})

$('body').click(function() {
	if($(window).width() <= 1024){
	$(".drop-row").removeClass('slide-menu');
  }
});

// header sticky start
var high = $('header').offset().top + 133;
$(window).scroll(function() {
	if ($(window).scrollTop() >= high) {
		$('header').addClass('sticky-head');
	} else if ($('header').hasClass('sticky-head')) {
		$('header').removeClass('sticky-head');
	}
});
// header sticky end

$("#slider-range").slider({
		range : true,
		min : 500,
		max : 3500,
		step : 500,
		ticks : true,
		values : [500, 1000],
		slide : function(event, ui) {
			if (ui.values[1] - ui.values[0] < 500) {

				return false;
			}

			if (ui.values[1] - ui.values[0] >= 500) {

				$("#amount_minSelectBoxItText").text(ui.values[0]);
				$("#amount_maxSelectBoxItText").text(ui.values[1]);
				$("#amount_min").val(ui.values[0]);
				$("#amount_max").val(ui.values[1]);

			}

		},
		change : function(event, ui) {

			$("#amount_min option").each(function() {

				if ($(this).attr('value') >= $("#amount_max").val()) {


					if ($(this).attr('value') != '500') {
                                 console.log($(this).index())
						$(this).css('display', 'none');
						$('#amount_minSelectBoxItOptions li').eq($(this).index()).css('display', 'none');
					}

				}
				if ($(this).attr('value') < $("#amount_max").val()) {
					$(this).css('display', 'inline-block');
					$('#amount_minSelectBoxItOptions li').eq($(this).index()).css('display', 'block');

				}
			});


		}
	});
	$('#amount_minSelectBoxItOptions li').css('display', 'none');
    $('#amount_minSelectBoxItOptions li').eq(0).css('display', 'block');

	var resetVal = $('#slider-range').slider("values");
	$('.price-head .load-more').click(function() {

		$('#slider-range').slider("values", resetVal);
		$("#amount_minSelectBoxItText").text($('#slider-range').slider("values")[0]);
		$("#amount_maxSelectBoxItText").text($('#slider-range').slider("values")[1]);
		$("#amount_min").val($('#slider-range').slider("values")[0]);
		$("#amount_max").val($('#slider-range').slider("values")[1]);
	});
	$('#amount_maxSelectBoxIt').click(function() {

		$("#amount_maxSelectBoxItOptions li").each(function() {
			$(this).removeClass('selectboxit-focus')
			if ($(this).index() == ($('.ui-slider-pip-selected-2').index() - 4)) {
				$(this).addClass('selectboxit-focus')
			}
		});

	});
	$('#amount_minSelectBoxIt').click(function() {

		$("#amount_minSelectBoxItOptions li").each(function() {

			$(this).removeClass('selectboxit-focus')
			if ($(this).index() == ($('.ui-slider-pip-selected-1').index() - 3)) {
				$(this).addClass('selectboxit-focus')
			}
		});

	});

	$('#slider-range').slider("pips", {

		first : "label",
		last : "label",
		rest : "label",

		step : 1,
		labels : false,
		prefix : "",
		suffix : ""

	});

	$("#amount_min").val($("#slider-range").slider("values", 0));
	$("#amount_max").val($("#slider-range").slider("values", 1));

	$("#amount_max").change(function() {

		$("#slider-range").slider("values", 1, $(this).val());

	});

	$("#amount_min").change(function() {
		$("#slider-range").slider("values", 0, $(this).val());
	});

	$("#amount_min option").each(function() {

		if ($(this).attr('value') >= $("#amount_max").val()) {

			console.log($(this).attr('value'))
			if ($(this).attr('value') != '500') {
				$(this).css('display', 'none')
			}
		}
		if ($(this).attr('value') < $("#amount_max").val()) {
			$(this).css('display', 'inline-block')

		}
	});

});

$(window).load(function() {
    var bannerSlider =$('.banner-sec .flexslider').flexslider({
        animation : "slide",
        slideshowSpeed:3000,
});

$('body').on('click', '.banner-sec .flexslider', function(){
    bannerSlider.flexslider("pause");
})
$('body').on('mouseleave', '.banner-sec .flexslider', function(){

    bannerSlider.flexslider("pause");
    bannerSlider.flexslider("play");

})
});

//  Range slider JS start

var sheet = document.createElement('style'), $rangeInput = $('.range input'), prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

document.body.appendChild(sheet);

var getTrackStyle = function(el) {
	var curVal = el.value, val = (curVal - 1) * 16.666666667, style = '';

	// Set active label
	$('.range-labels li').removeClass('active selected');

	var curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');

	curLabel.addClass('active selected');
	curLabel.prevAll().addClass('selected');

	// Change background gradient
	for (var i = 0; i < prefs.length; i++) {
		style += '.range {background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #fff ' + val + '%, #fff 100%)}';
		style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #b2b2b2 ' + val + '%, #b2b2b2 100%)}';
	}

	return style;
}

$rangeInput.on('input', function() {
	sheet.textContent = getTrackStyle(this);
});

// Change input value on label click
$('.range-labels li').on('click', function() {
	var index = $(this).index();

	$rangeInput.val(index + 1).trigger('input');

});
// Range slider JS End

// Accordion JS start
$(function () {
  // Smooth Scroll
  $('.filters-sec a[href*=#]').bind('click', function(e){
    var anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $(anchor.attr('href')).offset().top
    }, 1000);
    e.preventDefault();
  });
});


  // Color Changer

  $(document).ready(function() {
    // $('.ac-list > li.expanded > a').on('click', function(e) {
    //   e.preventDefault();
    //   if($(this).next('ul.sub-menu').is(':visible')) {
    //       $(this).removeClass('open');
    //       $(this).next('ul.sub-menu').slideUp();
    //   } else {
    //       $('.ac-list > li.expanded > a').removeClass('open');
    //       $(this).addClass('open');
    //       $('.ac-list > li.expanded > a').next('ul.sub-menu').slideUp();
    //       $(this).next('ul.sub-menu').slideToggle();
    //   }
    // });



    //start checkout code js
 $(".chkout-edit").css("display","none");
 $(".chckout-sbmt-btn").click(function(e){
 	e.preventDefault()

 	$(this).parent(".chckout-btn-wrap").hide();
 	$(this).parents(".ship-wrap").find(".chkout-edit").show().attr("data-target","0");
 	$(this).parents(".chkout-shipping").find(".chkout-frm-wrp").css("display","none")
 	if($(this).parents(".chkout-shipping").next(".chkout-shipping").find(".chkout-edit").css("display")  !=  "block"){
 			$(this).parents(".chkout-shipping").next(".chkout-shipping").css("display","block").find(".chkout-frm-wrp").css("display","block")
 	}
 })

 $("body").on("click",".chkout-edit",function(e){
 	e.preventDefault()
 	$(this).parents(".chkout-shipping").find(".chkout-frm-wrp").css("display","block");
 	$(this).parents(".chkout-shipping").siblings(".chkout-shipping").find(".chkout-frm-wrp").css("display","none")
 	$(this).parents(".ship-wrap").find(".chckout-btn-wrap").show();
    $(this).parents(".chkout-shipping").siblings(".chkout-shipping").find('.chkout-edit[data-target="0"]').show();
    $(this).hide();
 })



 $(".saved-addrs input").click(function(){
 	if($("#rd7").prop("checked") == true){
 		$(this).parents(".saved-addrs").siblings(".new-user").css("display","block");
 	}
 	else{
 		$(this).parents(".saved-addrs").siblings(".new-user").css("display","none");
 	}



 });

 //end checkout code js

  });


$(window).resize(function() {
	if ($(window).width() < 768) {
		$('.filters-sec form').height($(window).height() - 207);
	}
});

/*Scroll to top when arrow up clicked BEGIN*/
$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#back-to-top').fadeIn();
    } else {
        $('#back-to-top').fadeOut();
    }
});
$(document).ready(function() {
    $("#back-to-top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, 500);
        return false;
    });

    $(".dept-sec").on({
    mouseenter: function() {
      $(".secondry-header .dept-sec .drop-dwn-sec").addClass("drop-dwn-section");
    },
    mouseleave: function(){
    	$(".secondry-header .dept-sec .drop-dwn-sec").removeClass("drop-dwn-section");
    },
    click: function() {
       $(".secondry-header .dept-sec .drop-dwn-sec").toggleClass("drop-dwn-section");
    }
});

$(".cart ul li ").on({
    mouseenter: function() {

      $(this).find("div").addClass("drop-dwn-section");
    },
    mouseleave: function(){
    	$(this).find("div").removeClass("drop-dwn-section");
    },
    click: function() {
      $(this).find("div").toggleClass("drop-dwn-section");
    }
});
	$('.product-desc-list .tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('.product-desc-list .tabs li').removeClass('current');
		$('.product-desc-list .tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})
});
 /*Scroll to top when arrow up clicked END*/
