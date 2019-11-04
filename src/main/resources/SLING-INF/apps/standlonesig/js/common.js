
$(function() {
	// datepicker
//	$(".calendar").datepicker();
//	$(".calendar").datepicker("option", "showOn", 'both');
	$(".calendar").datepicker({
	      changeMonth: true,
	      changeYear: true
	    });

	$('img').on('contextmenu', function(e) {
		return false;
	});

//	$(document).on('keypress', 'input[type="text"]', function(event) {
//		return event.which !== 13;
//	});
	//サブミットボタンは一回押したら非活性にする
	$('form').submit(function(){
		$('input[type=submit]').prop('disabled', true);
		$('input[type=button]').prop('disabled', true);
	})

	// マウスオーバーで全文字列表示
	$.each($(".over1,.over2,.over3"), function(i, val) {
		$(val).mouseover(function() {
			$(this).attr('title',$.trim($(this).text()));
		});
	});

});


/**
 * 日付型チェック
 *
 * @param dateString
 *            yyyy-MM-ddd形式
 * @returns {Boolean}
 */
function checkDateString(dateString) {
	if (dateString == '') {
		return true;
	}
	if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
		return false;
	}
	var year = dateString.substr(0, 4) - 0;
	var month = dateString.substr(5, 2) - 1;
	var day = dateString.substr(8, 2) - 0;
	// 月,日の妥当性チェック
	if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
		var date = new Date(year, month, day);
		if (isNaN(date)) {
			return false;
		} else if (date.getFullYear() == year && date.getMonth() == month
				&& date.getDate() == day) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

/**
 * 数値チェック<br>
 * 数値以外の値が入力されていた場合はfalseを返します。
 * @param numString
 * @returns {Boolean}
 */
function checkNumericString(numString){
	if (numString == '') {
		return true;
	}
	if (!numString.match(/^\d*$/)) {
		return false;
	}else{
		return true;
	}
}

/**
 * サブミットします。
 *
 * @param url
 *            遷移先URL
 * @param form
 *            フォーム(指定しなくても可)
 * @returns {Boolean}
 */
function submit(url, form) {
	var f = form;
	if (f == undefined) {
		f = $('form')[0]
	}
	$('input[type=submit]').prop('disabled', true);
	$('input[type=button]').prop('disabled', true);
	f.action = url;
	f.method = 'post';
	f.submit();
	return false;
}

/**
 * サブミットします。
 *
 * @param url
 *            遷移先URL
 * @param form
 *            フォーム(指定しなくても可)
 * @returns {Boolean}
 */
function submit1(url, form) {
	var f = form;
	if (f == undefined) {
		f = $('form')[0]
	}
	$('input[type=submit]').prop('disabled', true);
	$('input[type=button]').prop('disabled', true);
	f.action = url;
	f.method = 'post';
	f.submit();
	return false;
}

/**
 * POSTページング用コール関数<br>
 * 「esign:postPagingLinks」タグより出力される関数です。<br>
 * 独自にPOSTしたい場合はオーバライドしてください。<br>
 * JSP内に「<input type="hidden" id="page" name="page" value="${page}">」を用意してください。
 *
 * @param page
 *            ページ番号
 * @param formId
 *            フォームID
 * @param formIndex
 *            フォームインデックス
 * @param url
 *            URL
 * @returns {Boolean}
 */
function postPaging(page, formId, formIndex, url) {
	var form;
	if (formId != '') {
		form = $('#' + formId);
		var i = $('form').index(form);
		form = $("form")[i];
	} else {
		form = $("form")[formIndex];
	}
	form.page.value = page;
	form.action = url;
	form.method = 'post';
	form.submit();
	return false;
}

/**
 * POSTソート用コール関数<br>
 * 「esign:postSortLinks」タグより出力される関数です。<br>
 * 独自にPOSTしたい場合はオーバライドしてください。<br>
 * JSP内に <br> 「<input type="hidden" id="page" name="page" value="${page}">」<br> 「<input
 * type="hidden" id="sortTatget" name="sortTatget" value="${sortTarget}">」<br> 「<input
 * type="hidden" id="sortType" name="sortType" value="${sortType}">」<br>
 * を用意してください。
 *
 * @param page
 * @param formId
 * @param formIndex
 * @param url
 * @param target
 * @returns {Boolean}
 */
function postSorting(page, formId, formIndex, url, target) {
	var form;
	if (formId != '') {
		//form = $('#' + formId);
		form = $('#' + formId);
		var i = $('form').index(form);
		form = $("form")[i];
	} else {
		form = $("form")[formIndex];
	}
	if (form.sortTarget.value == target) {
		if (form.sortType.value == 0) {
			form.sortType.value = 1;
		} else {
			form.sortType.value = 0;
		}
	} else {
		form.sortType.value = 0;
	}
	form.sortTarget.value = target
	return postPaging(page, formId, formIndex, url);
}

/**
 * 有効な拡張子か判定します。
 *
 * @param file
 *            Fileセレクタ
 * @param validExtensions
 *            有効な拡張子の配列
 * @returns {Boolean} true - 有効 / false - 無効
 */
function checkExtension(file, validExtensions) {
	var fileName = file.val();
	return checkFileNameExtension(fileName, validExtensions);
}

/**
 * 有効な拡張子か判定します。
 *
 * @param file
 *            Fileセレクタ
 * @param validExtensions
 *            有効な拡張子の配列
 * @returns {Boolean} true - 有効 / false - 無効
 */
function checkFileNameExtension(fileName, validExtensions) {
	if (fileName == '') {
		return false;
	}
	var extension = fileName.slice(-5);
	if (extension.slice(0, 1) == ".") {
		extension = extension.slice(-4);
	} else if (extension.slice(1, 2) == ".") {
		extension = extension.slice(-3);
	}
	if (validExtensions.indexOf(extension.toLowerCase()) == -1) {
		return false;
	}
	return true;
}

/**
 * 非同期通信を行います。
 *
 * @param url
 *            通信先URL
 * @param formData
 *            フォームデータ
 * @returns {jqXHR} jqXHR Object
 */
function callAjaxByFormData(url, formData) {
	return $.ajax({
		url : url,
		type : 'POST',
		data : formData,
		dataType : 'json',
		processData : false,
		contentType : false
	}).done(function(response) {
		ajaxSuccessCallback(response)
	}).fail(function(jqXHR, textStatus, errorThrown) {
		ajaxFailureCallback(jqXHR, textStatus, errorThrown)
	});
}

/**
 * 非同期通信を行います。
 *
 * @param url
 *            通信先URL
 * @param formData
 *            フォームデータ
 * @returns {jqXHR} jqXHR Object
 */
function callAjaxByFormDataByCallbak(url, formData, successCallback, failureCallback) {
	return $.ajax({
		url : url,
		type : 'POST',
		data : formData,
		dataType : 'json',
		processData : false,
		contentType : false
	}).done(function(response) {
		successCallback(response);
	}).fail(function(jqXHR, textStatus, errorThrown) {
		failureCallback(jqXHR, textStatus, errorThrown);
	});
}

/**
 * 非同期通信を行います。
 *
 * @param url
 *            通信先URL
 * @param form
 *            フォーム
 * @returns {jqXHR} jqXHR Object
 */
function callAjax(url, form) {
	var formData = new FormData(form);
	return $.ajax({
		url : url,
		type : 'POST',
		data : formData,
		dataType : 'json',
		processData : false,
		contentType : false
	}).done(function(response) {
		ajaxSuccessCallback(response)
	}).fail(function(jqXHR, textStatus, errorThrown) {
		ajaxFailureCallback(jqXHR, textStatus, errorThrown);
	});
}

/**
 * 非同期通信を行います。
 *
 * @param url
 *            通信先URL
 * @param form
 *            フォーム
 * @returns {jqXHR} jqXHR Object
 */
function callAjaxByCallbak(url, form, successCallback, failureCallback) {
	var formData = null;
	if (form != null) {
		formData = new FormData(form);
	}
	return $.ajax({
		url : url,
		type : 'POST',
		data : formData,
		dataType : 'json',
		processData : false,
		contentType : false
	}).done(function(response) {
		successCallback(response);
	}).fail(function(jqXHR, textStatus, errorThrown) {
		failureCallback(jqXHR, textStatus, errorThrown);
	});
}

/**
 * 非同期通信成功用コールバック関数<br>
 * 各画面で実装してください。
 *
 * @param response
 *            レスポンス
 */
function ajaxSuccessCallback(response) {
	alert('successful');
}

/**
 * 非同期通信失敗用コールバック関数
 *
 * @param jqXHR
 * @param textStatus
 * @param errorThrown
 */
function ajaxFailureCallback(jqXHR, textStatus, errorThrown) {
	console.log('ERROR', jqXHR, textStatus, errorThrown);
	//alert(errorThrown);
}

/**
 * 画面全体Loading開始
 *
 * @param showOverlay
 * @param onBlockFunc
 */
function startLoading(showOverlay, onBlockFunc) {

	$.blockUI({
		message : '<div class="loader"></div>',
		css : {
			backgroundColor : 'none',
			border : 'none',
			opacity : .2,
		},
		showOverlay: showOverlay,
		overlayCSS : {
			backgroundColor : '#000',
			opacity : 0.4
		},
		onBlock: onBlockFunc
	});
}

/**
 * 画面全体Loading終了
 */
function endLoading() {
	$.unblockUI();
}

/**
 * TopLoading開始
 *
 * @param elem
 * @param onBlockFunc
 */
function startLoadingByTop(elem, onBlockFunc) {

	elem.block({
		message : '<div class="loader-top"></div>',
		css : {
			backgroundColor : 'none',
			border : 'none',
			opacity : .2,
		},
		showOverlay: false,
		overlayCSS : {
			backgroundColor : '#000',
			opacity : 0.2
		},
		onBlock: onBlockFunc
	});
}

/**
 * TopLoading終了
 *
 * @param elem
 */
function endLoadingByTop(elem) {
	elem.unblock();
}

/**
 * 文書プレビューLoading開始
 *
 * @param elem
 * @param onBlockFunc
 */
function startLoadingByDocPreview(elem, onBlockFunc) {

	elem.block({
		message : '<div class="loader-doc-prev"></div>',
		css : {
			backgroundColor : 'none',
			margin : '35%',
			border : 'none',
			opacity : 0.2,
		},
		showOverlay: false,
		overlayCSS : {
			backgroundColor : '#000',
			opacity : 0.2
		},
		onBlock: onBlockFunc
	});
}

/**
 * 文書プレビューLoading終了
 *
 * @param elem
 */
function endLoadingByDocPreview(elem) {
	elem.unblock();
}

/**
 * 文書プレビュー(PDF署名リスト)Loading開始
 *
 * @param elem
 * @param onBlockFunc
 */
function startLoadingByDocPreviewSignList(elem, onBlockFunc) {

	elem.block({
		message : '<div class="loader-doc-prev-sign-list"></div>',
		css : {
			backgroundColor : 'none',
			margin : '35%',
			border : 'none',
			opacity : 0.2,
		},
		showOverlay: false,
		overlayCSS : {
			backgroundColor : '#000',
			opacity : 0.2
		},
		onBlock: onBlockFunc
	});
}

/**
 * 文書プレビュー(PDF署名リスト)Loading終了
 *
 * @param elem
 */
function endLoadingByDocPreviewSignList(elem) {
	elem.unblock();
}

/**
 * 文書プレビュー(別ウインドウ)Loading開始
 *
 * @param elem
 * @param onBlockFunc
 */
function startLoadingByDocFullPreview(elem, onBlockFunc) {

	elem.block({
		message : '<div class="loader-doc-prev"></div>',
		css : {
			backgroundColor : 'none',
			margin : '0%',
			border : 'none',
			opacity : 0.2,
		},
		showOverlay: false,
		overlayCSS : {
			backgroundColor : '#000',
			opacity : 0.2
		},
		onBlock: onBlockFunc
	});
}

/**
 * 文書プレビュー(別ウインドウ)Loading終了
 *
 * @param elem
 */
function endLoadingByDocFullPreview(elem) {
	elem.unblock();
}

/**
 * 文書プレビュー(別ウインドウ)(PDF署名リスト)Loading開始
 *
 * @param elem
 * @param onBlockFunc
 */
function startLoadingByDocFullPreviewSignList(elem, onBlockFunc) {

	elem.block({
		message : '<div class="loader-doc-prev-sign-list"></div>',
		css : {
			backgroundColor : 'none',
			margin : '0%',
			border : 'none',
			opacity : 0.2,
		},
		showOverlay: false,
		overlayCSS : {
			backgroundColor : '#000',
			opacity : 0.2
		},
		onBlock: onBlockFunc
	});
}

/**
 * 文書プレビュー(別ウインドウ)(PDF署名リスト)Loading終了
 *
 * @param elem
 */
function endLoadingByDocFullPreviewSignList(elem) {
	elem.unblock();
}

/**
 * 印影プレビューLoading開始
 *
 * @param elem
 * @param onBlockFunc
 */
function startLoadingBySignPreview(elem, onBlockFunc) {

	elem.block({
		message : '<div class="loader-sign-prev"></div>',
		css : {
			backgroundColor : 'none',
			margin : '0%',
			border : 'none',
			opacity : 0.2,
		},
		showOverlay: true,
		overlayCSS : {
			backgroundColor : '#000',
			opacity : 0.2
		},
		onBlock: onBlockFunc
	});
}

/**
 * 印影プレビューLoading終了
 *
 * @param elem
 */
function endLoadingBySignPreview(elem) {
	elem.unblock();
}

/**
 * 文書プレビュー(PDF署名リスト)描画
 *
 * @param elem
 *            描画先
 * @param response
 *            非同期通信レスポンス
 * @param registeredSealTitle
 *            実印タイトル
 * @param privateSealTitle
 *            認印タイトル
 * @param signerTitle
 *            署名者タイトル
 */
function renderDocPreviewSignList(elem, response, registeredSealTitle, privateSealTitle, signerTitle) {

	var ltTimeStamp = response.LtTimeStamp;
	if (ltTimeStamp) {
		var html = '';
		html += '<li>';
		html += '<table class="dn-list">';
		html += '<tr>';
		html += '<th style="font-size:9px">Signing<br>Time</th>';
		html += '<td><p>' + ltTimeStamp + '</p></td>';
		html += '</tr>';
		html += '</table>';
		html += '</li>';
		elem.append(html);
	}
	var userSignatures = response.UserSignatures;

	// 実印→認印の順で纏めて表示するため、ドキュメントタイプによるループを実施
	var registeredSeal = 2;//  実印
	var privateSeal = 3; // 認印
	var targetDocumentTypes = [registeredSeal, privateSeal];
	for (var targetDocumentTypeIdx = 0; targetDocumentTypeIdx < targetDocumentTypes.length; targetDocumentTypeIdx++) {
		var targetDocumentType = targetDocumentTypes[targetDocumentTypeIdx];
		var firstData = true;
		for (var i = 0; i < userSignatures.length; i++) {
			if (userSignatures[i].DocumentType != targetDocumentType) {
				// 対象外
				continue;
			}
			var html = '';
			if(firstData) {
				firstData = false;
				// 区切りラベルを非表示にするため、以下処理を無効化
				/*
				html += '<li>';
				html += '<table class="dn-list">';
				html += '<tr>';
				var documentTypeTitle = '';
				if(response[i].DocumentType == registeredSeal) {
					documentTypeTitle = registeredSealTitle;
				} else if(response[i].DocumentType == privateSeal) {
					documentTypeTitle = privateSealTitle;
				}
				html += '<th colspan="2" style="text-align: left;"> ' + documentTypeTitle + '</th>';
				html += '</tr>';
				html += '</table>';
				html += '</li>';
				*/
			}
			html += '<li>';
			html += '<table class="dn-list">';
			html += '<tr>';
			html += '<th colspan="2" style="text-align: left;">' + signerTitle +'</th>';
			html += '</tr>';
			if(userSignatures[i].DocumentType == registeredSeal) { // 実印のときは理由以外を表示
				// ltTimeStamp に集約
				/*
				html += '<tr>';
				html += '<th style="font-size:9px">Signing<br>Time</th>';
				html += '<td><p>' + userSignatures[i].SigningTime + '</p></td>';
				html += '</tr>';
				*/
				if (userSignatures[i].SignerSubject.E) {
					html += '<tr>';
					html += '<th>E</th>';
					html += '<td><p>' + userSignatures[i].SignerSubject.E + '</p></td>';
					html += '</tr>';
				}
				if (userSignatures[i].SignerSubject.CN) {
					html += '<tr>';
					html += '<th>CN</th>';
					html += '<td><p>' + userSignatures[i].SignerSubject.CN + '</p></td>';
					html += '</tr>';
				}
				if (userSignatures[i].SignerSubject.OU) {
					html += '<tr>';
					html += '<th>OU</th>';
					html += '<td><p>' + userSignatures[i].SignerSubject.OU + '</p></td>';
					html += '</tr>';
				}
				if (userSignatures[i].SignerSubject.O) {
					html += '<tr>';
					html += '<th>O</th>';
					html += '<td><p>' + userSignatures[i].SignerSubject.O + '</p></td>';
					html += '</tr>';
				}
				if (userSignatures[i].SignerSubject.L) {
					html += '<tr>';
					html += '<th>L</th>';
					html += '<td><p>' + userSignatures[i].SignerSubject.L + '</p></td>';
					html += '</tr>';
				}
				if (userSignatures[i].SignerSubject.S) {
					html += '<tr>';
					html += '<th>S</th>';
					html += '<td><p>' + userSignatures[i].SignerSubject.S + '</p></td>';
					html += '</tr>';
				}
				if (userSignatures[i].SignerSubject.C) {
					html += '<tr>';
					html += '<th>C</th>';
					html += '<td><p>' + userSignatures[i].SignerSubject.C + '</p></td>';
					html += '</tr>';
				}
			}
			if(userSignatures[i].DocumentType == privateSeal) { // 認印のときは理由のみ表示
				if (userSignatures[i].Reason) {
					html += '<tr>';
					html += '<th></th>';
					html += '<td><div style="padding: 0;width: 160px;word-break: break-all;">' + userSignatures[i].Reason + '</div></td>';
					html += '</tr>';
				}
			}

			html += '</table>';
			html += '</li>';
			elem.append(html);
		}
	}
}
