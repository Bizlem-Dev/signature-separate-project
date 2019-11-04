/*rollover*/
function smartRollover() {
	if(document.getElementsByTagName) {
		var images = document.getElementsByTagName("img");
		for(var i=0; i < images.length; i++) {
			if(images[i].getAttribute("src").match("_off."))
			{
				images[i].onmouseover = function() {
					this.setAttribute("src", this.getAttribute("src").replace("_off.", "_on."));
				}
				images[i].onmouseout = function() {
					this.setAttribute("src", this.getAttribute("src").replace("_on.", "_off."));
				}
			}
		}
	}
}
if(window.addEventListener) {
	window.addEventListener("load", smartRollover, false);
}
else if(window.attachEvent) {
	window.attachEvent("onload", smartRollover);
}


/*scroll*/
$(function(){
	$('a[href^=#]').click(function(){
		var speed = 500;
		var href= $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		$("html, body").animate({scrollTop:position}, speed, "swing");
		return false;
	});
});


function checkSelectCondtion() {
	if($('[name=selectCondition]:checked').val() == 1) {
		toggleSelectCondtion(true);
	} else {
		toggleSelectCondtion(false);
	}
}

function toggleSelectCondtion(isDisabled) {

	if (isDisabled) {
		// OR選択時ラベルを【設定しない】で表示する
		$('#labelAutoUpdateAll').hide();
		$('#labelAutoUpdateNoSetting').show();

		$('#labelNotificationAll').hide();
		$('#labelNotificationNoSetting').show();

		$('#labelControlNumberAll').hide();
		$('#labelControlNumberNoSetting').show();
	} else {
		// AND選択時ラベルを【全て】で表示する
		$('#labelAutoUpdateAll').show();
		$('#labelAutoUpdateNoSetting').hide();

		$('#labelNotificationAll').show();
		$('#labelNotificationNoSetting').hide();

		$('#labelControlNumberAll').show();
		$('#labelControlNumberNoSetting').hide();
	}

}


/* top */
$(function(){
	$("#top-block .news-box").hover(function(){
		//if($(".news-list ul li").length > 0) {
			$(".news-list",this).fadeToggle("fast");
		//}
	});
});


/* tablecellcolor */
/*$(document).ready(function(){
	$('table#list-all tr:even').addClass('even');
});*/


/* listopen */
$(function(){
	$("#list-all .down").on("click", function() {

		if(!$(this).is($("div .down.active"))) {
			var parents = $("#list-all #tr .wn");
			var childs = $("div .down.active").parents("tr").next(".pulldown").find("td.wn");

			toggleParent(parents, childs);

			$("div .down.active").parents("tr").next(".pulldown").toggle();
			$("div .down.active").toggleClass("active");
		}

		if ($(this).hasClass("active")) {
			$(this).parents("tr").next(".pulldown").toggle();
		} else {
			$(this).parents("tr").next(".pulldown").toggle();
		}

		$(this).toggleClass("active");

		var parents = $("#list-all #tr .wn");
		var childs = $(this).parents("tr").next(".pulldown").find("td.wn");

		var showParents = toggleParent(parents, childs);

		$.each(showParents, function(index, elem) {
			if (index % 2 == 0) {
				$(elem).removeClass("even");
			} else {
				$(elem).removeClass("even");
				$(elem).addClass("even");
			}
		});

	});

	function toggleParent (parents, childs) {

		var showParents = [];
		$.each(parents, function() {
			var parent = $(this);
			$.each(childs, function() {
				var childText = $(this).text();
				if(parent.text().trim() == childText.trim()) {
					parent.parent().toggle();
				}
			});

			if (!parent.parent().is(":hidden")) {
				showParents.push(parent.parent());
			}
		});

		return showParents;
	}
});


/* window */
$(function(){
	$('.modal-btn').click(function(){
		wn = '.' + $(this).data('tgt');
		var mW = $(wn).find('.modalBody').innerWidth() / 2;
		var mH = $(wn).find('.modalBody').innerHeight() / 2;
		$(wn).find('.modalBody').css({'margin-left':-mW,'margin-top':-mH});
		$(wn).fadeIn(200);
		$('.modalBody .form').scrollTop(0);
	});
	$('.close,.modalBK').click(function(){
		$(wn).fadeOut(200);
		// フォーム内容をクリア
		var idname = $(this).attr("id");
		//console.log(idname);

		if(idname != undefined){ // 署名再依頼のときはテキストデータは残す
			if(idname.match(/requestAgain/) != undefined) {
				$('.modalBody .form').find('input[type="checkbox"]').prop('checked', false);
			}else if(idname.match(/topDocumentSearch/) != undefined) {
				modalTopSearchClearandClose();
			}else if(idname.match(/documentSearch/) != undefined) {
				modalSearchClearandClose();
			}else{
				modalClearandClose();
			}

		}else{
			modalClearandClose();
		}
	});

	function modalClearandClose(){
		$('.modalBody .form').find('textarea, :text, select').val("").end().find('input[type="checkbox"]').prop('checked', false).end().find('input[type="radio"]').prop('checked', '0');
		$('.modalBody .btnarea').find('[value="削除"]').prop('disabled', true); // if button has delete of value be disabled.

	}

	function modalTopSearchClearandClose(){
		$('.modalBody .form').find('textarea, :text, select').val("").end().find('input[type="checkbox"]').prop('checked', false).end().find('input[type="radio"]').prop('checked', '0');
		$('.modalBody .btnarea').find('[value="削除"]').prop('disabled', true); // if button has delete of value be disabled.
		$('#selectConditionAND').prop('checked', true);
		$('#notationSwayIncluded').prop('checked', true);

	}

	function modalSearchClearandClose(){
		$('.modalBody .form').find('textarea, :text, select').val("").end().find('input[type="checkbox"]').prop('checked', false).end().find('input[type="radio"]').prop('checked', '0');
		$('.modalBody .btnarea').find('[value="削除"]').prop('disabled', true); // if button has delete of value be disabled.
		$('#selectConditionAND').prop('checked', true);
		$('#notationSwayIncluded').prop('checked', true);
		toggleAutoUpdating(true);
		toggleReminder(true);

	}
});

/**
 * モーダル
 * モーダル内に入力された値を残す
 */
$(function(){
	$('.modal-btn_notClear').click(function(){
		if(!isModalFadeIn()) {
			return;
		}
		wn = '.' + $(this).data('tgt');
		var mW = $(wn).find('.modalBody').innerWidth() / 2;
		var mH = $(wn).find('.modalBody').innerHeight() / 2;
		$(wn).find('.modalBody').css({'margin-left':-mW,'margin-top':-mH});
		$(wn).fadeIn(200);
		$('.modalBody .form').scrollTop(0);
		$("html,body").animate({ scrollTop: 0 }, 300);
		$(window).animate({ scrollTop: 0 }, 300);
	});
	$('.close_notClear,.modalBK_notClear').click(function(){
		$(wn).fadeOut(200);

	});

});

function isModalFadeIn(){
	return true;
}

/* caveat */
$(function(){
	$(".caveat span").on("click", function() {
		$(this).parents(".caveat").fadeOut(200);
	});
});


/* zoom */
$(function() {
	var img$ = $('#seal-stamp .stamp-area img');
	$('#zoom-in').on('click', function(){
		img$.width(img$.width()+100);
		if(img$.width() > 1200){
			img$.css('width', 1200);
		}
	});
	$('#zoom-out').on('click', function(){
		$(this).removeClass("invalid");
		img$.width(img$.width()-100);
		if(img$.width() < 360){
			img$.css('width', 360);
		}
	});
});


///* seal */
//$(function() {
//	$('.seal-drag').draggable({
//		helper: 'clone',
//		revert: 'invalid'
//	});
//	$('.stamp-area').droppable({
//		accept: '.seal-drag',
//		tolerance: 'fit',
//		drop: function(e, ui) {
//			$(this).append(ui.helper.clone().removeClass().addClass('stamp-drag'));
//			$('.stamp-drag').draggable({
//				containment: 'parent'
//			});
//		}
//	});
//});

$(function(){
	$('#addsearch2').click(function(){
		var targetY = 440.5;
		//var targetY = $(this).offset().top;
		$('#modalcontents').animate({scrollTop:targetY-80});
	});
});
$(function(){
	$('#addsearch3').click(function(){
		var targetY = 460.5;
		//var targetY = $(this).offset().top;
		$('#modalcontents').animate({scrollTop:targetY-58});
	});
});
$(function(){
	$('.totop').click(function(){
		$('#modalcontents').animate({scrollTop:0});
	});
});
$(function(){
	$('#checkall1').click(function(){
		var $checkall1 = $('[id^=checkall1]');
		if ($('#checkall1_1:checked').val() != undefined && $('#checkall1_2:checked').val() != undefined){
			$checkall1.prop("checked",false);
		}else{
			$checkall1.prop("checked",true);
		}
	});
});
$(function(){
	var $checkall1 = $('[id^=checkall1]');
	$checkall1.prop("checked",true);
});

$(function(){
	$('#clearbtn').click(function(){
		$('.modalBody .form').find('textarea, :text, select').val("").end().find('input[type="checkbox"]').prop('checked', false).end().find('input[type="radio"]').prop('checked', '0');
		$('#selectConditionAND').prop('checked', true);
		$('#notationSwayIncluded').prop('checked', true);
		checkSelectCondtion();
		toggleAutoUpdating(true);
		toggleReminder(true);
	});
	})
// ツールチップ(締結)
$(function(){
	$("form[class^=hasToolTips]").tooltip({
	/*$(".inner-box2").tooltip({*/
		track: true,
		show:{
	        effect: "slideDown",
	        delay: 250,
		},
		hide: {
		}
	});
	$(".menuToolTips").tooltip({
		/*$(".inner-box2").tooltip({*/
			track: true,
			show:{
		        effect: "slideDown",
		        delay: 250,
			}
		,tooltipClass:"ui-tooltip-menu"
		});
})
/**
 * 文書一覧：絞り込み検索の検索条件操作用関数
 *
 *
 */
$(function(){
	$('[name=selectCondition]').on('change', function() {
		checkSelectCondtion();
	});
});