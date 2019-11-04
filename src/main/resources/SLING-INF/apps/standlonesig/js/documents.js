/* seal */
var fieldArray = [];

var MINW = 847; //72dpiでPNG生成した場合のA4横のpx
var MAXW = 1100;//PDFファイルによって若干の誤差があるため、B4横(1032px)、A3横(1191px)をおおまかな数値で判定する

var pCount = 0;

let imageBasePath = '..';
if (typeof getImageBasePath === 'function') {
	// Functionが定義されているなら、ベースパスをFunctionから取得して使用する
	imageBasePath = getImageBasePath();
}

$(function() {

	// PDF画像の横幅設定
	//setPdfImagesWidth();

	// ドラッグイベントハンドリング
	$(".seal-drag-stamp-div").draggable({
		helper: function( ) {
			return $(this).clone().removeClass('seal-drag-stamp-div').addClass('stamp-drag').attr('id', $(this).context.id).css("width","66px").css("height","66px").css("background-image","url(" + imageBasePath + "/portal/apps/standlonesig/img/stamp-icon.png)").css("background-repeat","no-repeat").css("background-size","contain");
		},
		appendTo: "#seal-stamp",
		zIndex: 97,
		cursorAt: { right:0 },
		cursor: "move",
		revert: 'invalid',
	});
	$(".seal-drag-text-div").draggable({
		helper: function( ) {
			let textBoxField = $(this).clone().removeClass('seal-drag-text-div').addClass('text-drag').attr('id', $(this).context.id);
			return textBoxField;
		},
		appendTo: "#seal-stamp",
		zIndex: 97,
		cursorAt: { right:0 },
		cursor: "move",
		revert: 'invalid',
	});
	$(".seal-drag-check-div").draggable({
		helper: function( ) {
			let checkBoxField = $(this).clone().removeClass('seal-drag-check-div').addClass('check-drag').attr('id', $(this).context.id);
			return convertCheckBoxStyleForDesgin(checkBoxField);
		},
		appendTo: '#seal-stamp',
		zIndex: 97,
		cursorAt: { right:0 },
		cursor: 'move',
		revert: 'invalid',
	});
	$(".seal-drag-fill-text-div").draggable({
		helper: function( ) {
			let fillTextBoxField = $(this).clone().removeClass('seal-drag-fill-text-div').addClass('fill-text-drag').attr('id', $(this).context.id);
			return fillTextBoxField;
		},
		appendTo: "#seal-stamp",
		zIndex: 97,
		cursorAt: { right:0 },
		cursor: "move",
		revert: 'invalid',
	});
	$(".seal-drag-fill-check-div").draggable({
		helper: function( ) {
			let checkBoxField = $(this).clone().removeClass('seal-drag-fill-check-div').addClass('fill-check-drag').attr('id', $(this).context.id);
			return convertCheckBoxStyleForDesgin(checkBoxField);
		},
		appendTo: '#seal-stamp',
		zIndex: 97,
		cursorAt: { right:0 },
		cursor: 'move',
		revert: 'invalid',
	});

	// ドロップイベントハンドリング
	$('.stamp-area').droppable({
		accept: '.seal-drag-stamp-div, .seal-drag-text-div, .seal-drag-check-div, .seal-drag-fill-text-div, .seal-drag-fill-check-div',
		tolerance: 'fit',
		drop: function(e, ui) {
			if (!isPdfImagesLoaded()) {
				return;
			}
			if(ui.helper.context.className.indexOf('seal-drag-stamp-div') != -1) {
				const fieldIdPrefix = ui.helper.context.id.substr(0, ui.helper.context.id.indexOf("_") + 1);

				// ドラッグ項目情報
				const revheight  = 46 + 21/* 外枠、マージン、ボーダー等の補正 */;
				const revwidth   = 220 + 21/* 外枠、マージン、ボーダー等の補正 */;
				// スタンプ項目情報
				const Stampheight = 66;
				const Stampwidth  = 66;

				const setTop = ui.helper.position().top + $('.stamp-area')[0].scrollTop + Stampheight - revheight;
				const setLeft = ui.helper.position().left - ui.helper[0].offsetWidth + $('.stamp-area')[0].scrollLeft + Stampwidth - revwidth;
				const stamp = ui.helper.clone();
				const regExp = new RegExp(fieldIdPrefix, "g");
				const fieldIndex = ui.helper.context.id.replace(regExp, "");

				$(stamp).attr('id', ui.helper.context.id);
				$(stamp).css("left", setLeft);
				$(stamp).css("top", setTop);
				$(stamp).css("width",Stampwidth + 'px');
				$(stamp).css("height",Stampheight + 'px');
				$(stamp).css("position","absolute");
				$(stamp).css("background","");
				$(stamp).appendTo($(this));

				$(stamp).find('.removeSign').show();

				// 署名フィールドの数
				const fieldNum = $("#" + fieldIdPrefix + "num_" + fieldIndex).val();

				// id,nameを変更
				renameIdAndName(stamp, fieldIdPrefix, fieldIndex, fieldNum);
				console.log("fieldIdPrefix :: "+ fieldIdPrefix +"fieldArray  :: "+JSON.stringify(fieldArray));
				const doc = fieldArray[fieldIdPrefix];
				console.log("doc :: "+ JSON.stringify(doc));
				console.log("doc :: "+ "#" + fieldIdPrefix + "num_" + fieldIndex);
				/*if(doc.isMaxFieldOver(Number(fieldNum) + 1)) {
					$(ui.helper.context).removeClass('seal-drag-stamp-div');
				}*/

				draggable_stop($(stamp)[0].id, $(stamp)[0].offsetTop, $(stamp)[0].offsetLeft, $(stamp).width(), $(stamp).height(), e, ui);
				enableSignFieldResizeAndDrag($(stamp));
				$("#" + fieldIdPrefix + "num_" + fieldIndex).val(String(Number(fieldNum) + 1));
			} else if(ui.helper.context.className.indexOf('seal-drag-text-div') != -1) {
				const fieldIdPrefix = ui.helper.context.id.substr(0, ui.helper.context.id.indexOf("_") + 1);

				// ドラッグ項目情報
				const revheight  = 1/* 外枠、マージン、ボーダー等の補正 */;
				const revwidth   = 90 + 21/* 外枠、マージン、ボーダー等の補正 */;

				const setTop = ui.helper.position().top + $('.stamp-area')[0].scrollTop - revheight;
				const setLeft = ui.helper.position().left - ui.helper[0].offsetWidth + $('.stamp-area')[0].scrollLeft - revwidth;
				const freeText = ui.helper.clone();
				const regExp = new RegExp(fieldIdPrefix, "g");
				const fieldIndex = ui.helper.context.id.replace(regExp, "");
				$(freeText).attr('id', 'dropped_' + ui.helper.context.id);
				$(freeText).css("left", setLeft).css("top", setTop);
				$(freeText).css("position","absolute");
				$(freeText).appendTo($(this));

				$(freeText).find('.removeText').show();

				// フリーテキストエリアの数
				const freeTextNum = $("#" + fieldIdPrefix + "num_" + fieldIndex).val();

				// id,nameを変更
				renameIdAndName(freeText, fieldIdPrefix, fieldIndex, freeTextNum);

				const doc = fieldArray[fieldIdPrefix];
				if(doc.isMaxFieldOver(Number(freeTextNum) + 1)) {
					$(ui.helper.context).addClass('text-limitover');
					$(ui.helper.context).removeClass('seal-drag-text-div');
				}

				draggable_stop($(freeText)[0].id, $(freeText)[0].offsetTop, $(freeText)[0].offsetLeft, $(freeText).width(), $(freeText).height(), e, ui);
				enableFreeTextFieldResizeAndDrag($(freeText));
				$("#" + fieldIdPrefix + "num_" + fieldIndex).val(String(Number(freeTextNum) + 1));
			} else if(ui.helper.context.className.indexOf('seal-drag-check-div') != -1) {
				const fieldIdPrefix = ui.helper.context.id.substr(0, ui.helper.context.id.indexOf("_") + 1);

				// チェックボックスの種別を除いたID情報を生成
				const nonTypedId = ui.helper.context.id.substr(0, ui.helper.context.id.lastIndexOf('_'));

				// ドラッグ項目情報
				const revheight  = 1/* 外枠、マージン、ボーダー等の補正 */;
				const revwidth   = 190 + 21/* 外枠、マージン、ボーダー等の補正 */;

				const setTop = ui.helper.position().top + $('.stamp-area')[0].scrollTop - revheight;
				const setLeft = ui.helper.position().left - ui.helper.context.offsetWidth + $('.stamp-area')[0].scrollLeft - revwidth;
				const checkBoxField = ui.helper.clone();
				const regExp = new RegExp(fieldIdPrefix, "g");
				const fieldIndex = nonTypedId.replace(regExp, "");
				$(checkBoxField).attr('id', 'dropped_' + nonTypedId);
				$(checkBoxField).css("left", setLeft).css("top", setTop);
				$(checkBoxField).css("position","absolute");
				$(checkBoxField).appendTo($(this));

				$(checkBoxField).find('.removeCheck').show();

				// チェックボックスフィールドの数
				const checkBoxFieldNum = $("#" + fieldIdPrefix + "num_" + fieldIndex).val();

				// id,nameを変更
				renameIdAndName(checkBoxField, fieldIdPrefix, fieldIndex, checkBoxFieldNum);

				const doc = fieldArray[fieldIdPrefix];
				if(doc.isMaxFieldOver(Number(checkBoxFieldNum) + 1)) {
					$('#' + fieldIdPrefix + fieldIndex + '_noncheck').addClass('check-limitover');
					$('#' + fieldIdPrefix + fieldIndex + '_noncheck').removeClass('seal-drag-check-div');
					$('#' + fieldIdPrefix + fieldIndex + '_checked').addClass('check-limitover');
					$('#' + fieldIdPrefix + fieldIndex + '_checked').removeClass('seal-drag-check-div');
				}

				draggable_stop($(checkBoxField)[0].id, $(checkBoxField)[0].offsetTop, $(checkBoxField)[0].offsetLeft, $(checkBoxField).width(), $(checkBoxField).height(), e, ui);
				enableCheckBoxFieldResizeAndDrag($(checkBoxField));
				$("#" + fieldIdPrefix + "num_" + fieldIndex).val(String(Number(checkBoxFieldNum) + 1));
			} else if(ui.helper.context.className.indexOf('seal-drag-fill-text-div') != -1) {
				const fieldIdPrefix = ui.helper.context.id.substr(0, ui.helper.context.id.indexOf("_") + 1);

				// ドラッグ項目情報
				const revheight  = 1/* 外枠、マージン、ボーダー等の補正 */;
				const revwidth   = 90 + 21/* 外枠、マージン、ボーダー等の補正 */;

				const setTop = ui.helper.position().top + $('.stamp-area')[0].scrollTop - revheight;
				const setLeft = ui.helper.position().left - ui.helper[0].offsetWidth + $('.stamp-area')[0].scrollLeft - revwidth;
				const fillText = ui.helper.clone();
				const regExp = new RegExp(fieldIdPrefix, "g");
				const fieldIndex = ui.helper.context.id.replace(regExp, "");
				$(fillText).attr('id', 'dropped_' + ui.helper.context.id);
				$(fillText).css("left", setLeft).css("top", setTop);
				$(fillText).css("position","absolute");
				$(fillText).appendTo($(this));

				$(fillText).find('.removeFillText').show();

				// 埋め込みテキストエリアの数
				const fillTextNum = $("#" + fieldIdPrefix + "num_" + fieldIndex).val();

				// id,nameを変更
				renameIdAndName(fillText, fieldIdPrefix, fieldIndex, fillTextNum);

				const doc = fieldArray[fieldIdPrefix];
				if(doc.isMaxFieldOver(Number(fillTextNum) + 1)) {
					$(ui.helper.context).addClass('fill-text-limitover');
					$(ui.helper.context).removeClass('seal-drag-fill-text-div');
				}

				draggable_stop($(fillText)[0].id, $(fillText)[0].offsetTop, $(fillText)[0].offsetLeft, $(fillText).width(), $(fillText).height(), e, ui);
				enableFillTextFieldResizeAndDrag($(fillText));
				$("#" + fieldIdPrefix + "num_" + fieldIndex).val(String(Number(fillTextNum) + 1));
			} else if(ui.helper.context.className.indexOf('seal-drag-fill-check-div') != -1) {
				const fieldIdPrefix = ui.helper.context.id.substr(0, ui.helper.context.id.indexOf("_") + 1);

				// 埋め込みチェックボックスの種別を除いたID情報を生成
				const nonTypedId = ui.helper.context.id.substr(0, ui.helper.context.id.lastIndexOf('_'));

				// ドラッグ項目情報
				const revheight  = 1/* 外枠、マージン、ボーダー等の補正 */;
				const revwidth   = 190 + 21/* 外枠、マージン、ボーダー等の補正 */;

				const setTop = ui.helper.position().top + $('.stamp-area')[0].scrollTop - revheight;
				const setLeft = ui.helper.position().left - ui.helper.context.offsetWidth + $('.stamp-area')[0].scrollLeft - revwidth;
				const checkBoxField = ui.helper.clone();
				const regExp = new RegExp(fieldIdPrefix, "g");
				const fieldIndex = nonTypedId.replace(regExp, "");
				$(checkBoxField).attr('id', 'dropped_' + nonTypedId);
				$(checkBoxField).css("left", setLeft).css("top", setTop);
				$(checkBoxField).css("position","absolute");
				$(checkBoxField).appendTo($(this));

				$(checkBoxField).find('.removeFillCheck').show();

				// 埋め込みチェックボックスフィールドの数
				const checkBoxFieldNum = $("#" + fieldIdPrefix + "num_" + fieldIndex).val();

				// id,nameを変更
				renameIdAndName(checkBoxField, fieldIdPrefix, fieldIndex, checkBoxFieldNum);

				const doc = fieldArray[fieldIdPrefix];
				if(doc.isMaxFieldOver(Number(checkBoxFieldNum) + 1)) {
					$('#' + fieldIdPrefix + fieldIndex + '_noncheck').addClass('fill-check-limitover');
					$('#' + fieldIdPrefix + fieldIndex + '_noncheck').removeClass('seal-drag-fill-check-div');
					$('#' + fieldIdPrefix + fieldIndex + '_checked').addClass('fill-check-limitover');
					$('#' + fieldIdPrefix + fieldIndex + '_checked').removeClass('seal-drag-fill-check-div');
				}

				draggable_stop($(checkBoxField)[0].id, $(checkBoxField)[0].offsetTop, $(checkBoxField)[0].offsetLeft, $(checkBoxField).width(), $(checkBoxField).height(), e, ui);
				enableFillCheckBoxResizeAndDrag($(checkBoxField));
				$("#" + fieldIdPrefix + "num_" + fieldIndex).val(String(Number(checkBoxFieldNum) + 1));
			}
		}
	});

	/**
	 * ID、Name変更処理
	 */
	function renameIdAndName(target, fieldIdPrefix, fieldIndex, seq) {
		//console.log('renameIdAndName(%s, %s, %s)', fieldIdPrefix, fieldIndex, seq);

		$(target).attr('id', fieldIdPrefix + fieldIndex + '_' + seq);

		$.each($(target[0].children), function() {
			if (this.id) {
				// idを変更
				$(this).attr('id', this.id + "_" + seq);
			}

			if (this.name) {
				// nameを変更
				const delimIdx = this.name.lastIndexOf(".");
				$(this).attr('name', this.name.substr(0, delimIdx) + "[" + seq + "]" + this.name.substr(delimIdx));
			}

			if (this.className) {
				let targetChild = null;
				if ($(this).hasClass('fieldMenuCommon')) {
					// 署名フィールドのメニュー本体に対する変更
					targetChild = $(this).find('.fieldMenuBodyCommon');
				} else if ($(this).hasClass('fillTextBox3')) {
					// 埋め込みテキスト領域に対する変更
					targetChild = $(this);
				}

				if (targetChild) {
					$.each($(targetChild[0].children), function() {
						if (this.id) {
							// idを変更
							$(this).attr('id', this.id + '_' + seq);
						}

						if (this.name) {
							// nameを変更
							const delimIdx = this.name.lastIndexOf('.');
							$(this).attr('name', this.name.substr(0, delimIdx) + '[' + seq + ']' + this.name.substr(delimIdx));
						}

						if ($(this).attr('for')) {
							// forを変更
							$(this).attr('for', $(this).attr('for') + '_' + seq);
						}
					});
				}
			}
		});
	}

	/**
	 * ドラッグを開始したチェックボックスを、署名位置設定用に変換する
	 * 
	 * パーツとして配置しているチェックボックスは、チェックあり、なしで異なるものとしているが、
	 * 実際に文書上に配置する際にはこれらを区別しない。
	 * よって、変換が必要となる。
	 * 
	 * @param {*} targetField 変換対象
	 */
	function convertCheckBoxStyleForDesgin(targetField) {
		// IDからチェックボックスの種類情報を除去
		const checkBoxId = new String($(targetField).id);
		$(targetField).attr('id', checkBoxId.substr(0, checkBoxId.lastIndexOf('_')));
		$.each($(targetField[0].children), function() {
			if (this.id) {
				$(this).attr('id', this.id.substr(0, this.id.lastIndexOf('_')));
			}

			if (this.className && $(this).hasClass('checkBoxFieldMenu')) {
				const menuBody = $(this).find('.fieldMenuBodyCommon');
				if (menuBody) {
					$.each($(menuBody[0].children), function(){
						if (this.id) {
							$(this).attr('id', this.id.substr(0, this.id.lastIndexOf('_')));
						}
					});
				}
			}
		});

		return targetField;
	}

	/**
	 * 署名フィールドに対するリナンバー
	 * @param {*} prefix 処理対象プレフィックス
	 * @param {*} targetListName リナンバー対象のリスト名文字列
	 * @param {*} fieldIndex 処理対象インデックス
	 * @param {*} oldIndex 旧インデックス番号
	 * @param {*} updatedIndex 新インデックス番号
	 */
	function renumberAdditionalField(prefix, targetListName, fieldIndex, oldIndex, updatedIndex) {
		//console.log('renumberAdditionalField field renumber. prefix [%s] list [%s] field [%s] index [%s] -> [%s]', prefix, targetListName, fieldIndex, oldIndex, updatedIndex);

		// 移動対象
		const renumberTarget = $('#' + prefix + '_' + fieldIndex + '_' + oldIndex);

		const updatedTopId = renumberTarget[0].id.substr(0, renumberTarget[0].id.lastIndexOf('_') + 1) + updatedIndex;
		renumberTarget.attr('id', updatedTopId);

		// 子要素のID、Name変更
		$.each($(renumberTarget[0].children), function() {
			// id
			if (this.id) {
				// IDの末尾の番号を変更する。
				const updatedId = this.id.substr(0, this.id.lastIndexOf('_') + 1) + updatedIndex;
				$(this).attr('id', updatedId);
			}

			// name
			if (this.name) {
				// targetListName[x]の番号を変更する
				const oldFieldIndexName = targetListName + '[' + oldIndex + ']';
				const updatedFieldIndexName = targetListName + '[' + updatedIndex + ']';
				const updatedName = this.name.replace(oldFieldIndexName, updatedFieldIndexName);
				$(this).attr('name', updatedName);
			}

			if (this.className) {
				let targetChild = null;
				if ($(this).hasClass('fieldMenuCommon')) {
					// 署名フィールドのメニュー本体に対する変更
					targetChild = $(this).find('.fieldMenuBodyCommon');
				} else if ($(this).hasClass('fillTextBox3')) {
					// 埋め込みテキストに対する変更
					targetChild = $(this);
				}

				if (targetChild) {
					$.each($(targetChild[0].children), function() {
					// id
					if (this.id) {
						// IDの末尾の番号を変更する。
						const updatedId = this.id.substr(0, this.id.lastIndexOf('_') + 1) + String(updatedIndex);
						$(this).attr('id', updatedId);
					}
	
					// name
					if (this.name) {
						// targetListName[x]の番号を変更する
						const oldFieldIndexName = targetListName + '[' + oldIndex + ']';
						const updatedFieldIndexName = targetListName + '[' + updatedIndex + ']';
						const updatedName = this.name.replace(oldFieldIndexName, updatedFieldIndexName);
						$(this).attr('name', updatedName);
					}
	
					// for
					if ($(this).attr('for')) {
						// forの末尾の番号を変更する。
						const valueFor = $(this).attr('for');
						const updatedFor = valueFor.substr(0, valueFor.lastIndexOf('_') + 1) + String(updatedIndex);
						$(this).attr('for', updatedFor);
					}
					});
				}
			}
		});
	}

	function draggable_stop(id, top, left, width, height, e, ui) {

		//console.log("stop event start");
		console.log(e, ui);
		console.log(id);
		// ドロップ時のサインイメージ左上のX座標
		var pointX = left;

		// ドロップ時のサインイメージ左上のY座標
		var pointY = top;

		// ドロップされたPDFのページ番号取得
		var delimIdx = id.indexOf("_");
		var fieldPrefix = id.substr(0, delimIdx + 1);
		var fieldSuffix = id.substr(delimIdx + 1);
		var doc = fieldArray[fieldPrefix];
		if (!doc) {
			return;
		}
		var page = doc.computePage(pointX, pointY, width, height);
		//alert(page);
		if (page > 0) {
			// ドロップオブジェクトの左上がPDFの縦幅内にドロップされた場合
			$("#" + id + " #" + fieldPrefix + "x1_" + fieldSuffix).val(doc.computeX(pointX, page));
			$("#" + id + " #" + fieldPrefix + "y1_" + fieldSuffix).val(doc.computeY(pointY, page));
			$("#" + id + " #" + fieldPrefix + "page_" + fieldSuffix).val(page);
		} else {
			// ドロップオブジェクトの左上がPDFの縦幅外にドロップされた場合
			$("#" + id + " #" + fieldPrefix + "x1_" + fieldSuffix).val(-1);
			$("#" + id + " #" + fieldPrefix + "y1_" + fieldSuffix).val(-1);
			$("#" + id + " #" + fieldPrefix + "page_" + fieldSuffix).val(0);
		}
		var checkResult = true;
		$.each(fieldArray, function(key, value) {
			if (!value.checkPositionNew(true,fieldPrefix,fieldSuffix,page)) {
				checkResult = false;
			}
		});
		if (checkResult) {
			if (typeof enableSubmintButton === 'function') {
				enableSubmintButton(true);
			}
		} else {
			if (typeof enableSubmintButton === 'function') {
				enableSubmintButton(false);
			}
		}
	}

	// 署名フィールド削除ハンドラ
	$('.stamp-area').on('click', '.removeSign', function() {
		const parent = $(this).parent();
		$(parent).remove();
		// 削除対象の情報を取得
		/*let parentId = parent.attr('id');
		let idxDelim = parentId.lastIndexOf('_');
		const fieldId = parentId.substring(idxDelim + 1);
		
		parentId = parentId.substring(0, idxDelim);
		idxDelim = parentId.lastIndexOf('_');
		const entryId = parentId.substring(idxDelim + 1);
		const prefix = parentId.substring(0, idxDelim);
		//alert('#' + prefix + '_num_' + entryId);
		const totalNum = Number($('#' + prefix + '_num_' + entryId).val());
		//alert(totalNum);
		if (totalNum - 1 == Number(fieldId)) {
			// 削除対象が最大のインデックスを持っているため、対象を削除してトータル数をデクリメントする。
			$('#' + prefix + '_num_' + entryId).val(String(totalNum - 1));
			$(parent).remove();
		} else {
			// 署名は1つしか配置できないため、Agreeではこのケースは不要。
			console.log('署名数が1ではありません');
		}

		$('#' + prefix + '_' + entryId).addClass('seal-drag-stamp-div');
		if (typeof enableSubmintButton == 'function') {
			enableSubmintButton(false);
		}*/
	});

	// 署名フィールドの所有者表示・非表示
	$('.stamp-area').on('mouseenter', '.stamp-drag', function() {
		$(this).css('z-index', '98');
		$(this).find(".stampFieldMenu").css("display", "block");
	});
	$('.stamp-area').on('mouseleave', '.stamp-drag', function() {
		$(this).find(".stampFieldMenu").css("display", "none");
		$(this).css('z-index', '97');
	});

	// 署名フィールドのリサイズ
	$('.stamp-area').on('resize', '.stamp-drag', function(e, ui) {
		// 縦長禁止にする
		if($(this).height() > $(this).width()){
			$(this).height($(this).width());
		}
	});
	$('.stamp-area').on('resizestop', '.stamp-drag', function(e, ui) {
		draggable_stop($(this).context.id, ui.position.top, ui.position.left, $($(this).context).width(), $($(this).context).height(), e, ui);
	});

	// 署名フィールドのドラッグ
	$('.stamp-area').on('dragstop', '.stamp-drag', function(e, ui) {
		draggable_stop($(this).context.id, ui.position.top, ui.position.left, $($(this).context).width(), $($(this).context).height(), e, ui);
	});

	// フリーテキストフィールド削除ハンドラ
	$('.stamp-area').on('click', '.removeText', function() {
		const parent = $(this).parent();

		// 削除対象の情報を取得
		let parentId = parent.attr('id');
		let idxDelim = parentId.lastIndexOf('_');
		const fieldId = parentId.substring(idxDelim + 1);

		parentId = parentId.substring(0, idxDelim);
		idxDelim = parentId.lastIndexOf('_');
		const entryId = parentId.substring(idxDelim + 1);
		const prefix = parentId.substring(0, idxDelim);

		const totalNum = Number($('#' + prefix + '_num_' + entryId).val());

		if (totalNum - 1 == Number(fieldId)) {
			// 削除対象が最大のインデックスを持っているため、対象を削除してトータル数をデクリメントする。
			$('#' + prefix + '_num_' + entryId).val(String(totalNum - 1));
			$(parent).remove();
		} else {
			// 総数をデクリメントする
			$('#' + prefix + '_num_' + entryId).val(String(totalNum - 1));

			// 削除したフリーテキスト以降のフリーテキストをリナンバーして詰める
			for (let targetNum = Number(fieldId); targetNum < totalNum - 1; targetNum++) {
				// [targetNum + 1] を [targetNum] にリナンバー
				renumberAdditionalField(prefix, 'freeTextFieldList', entryId, targetNum + 1, targetNum);
			}

			$(parent).remove();
		}

		$('#' + prefix + '_' + entryId).addClass('seal-drag-text-div');
		$('#' + prefix + '_' + entryId).removeClass('text-limitover');
	});

	// フリーテキストフィールドの所有者表示・非表示
	$('.stamp-area').on('mouseenter', '.text-drag', function() {
		$(this).css('z-index', '98');
		$(this).find(".freeTextBoxMenu").css("display", "block");
	});
	$('.stamp-area').on('mouseleave', '.text-drag', function() {
		$(this).find(".freeTextBoxMenu").css("display", "none");
		$(this).css('z-index', '97');
	});

	// フリーテキストフィールドのリサイズ
	$('.stamp-area').on('resizestop', '.text-drag', function(e, ui) {
		draggable_stop($(this).context.id, ui.position.top, ui.position.left, $($(this).context).width(), $($(this).context).height(), e, ui);
	});

	// フリーテキストフィールドのドラッグ
	$('.stamp-area').on('dragstop', '.text-drag', function(e, ui) {
		draggable_stop($(this).context.id, ui.position.top, ui.position.left, $($(this).context).width(), $($(this).context).height(), e, ui);
	});

	// チェックボックスフィールド削除ハンドラ
	$('.stamp-area').on('click', '.removeCheck', function() {
		const parent = $(this).parent();

		// 削除対象の情報を取得
		let parentId = parent.attr('id');
		let idxDelim = parentId.lastIndexOf('_');
		const fieldId = parentId.substring(idxDelim + 1);

		parentId = parentId.substring(0, idxDelim);
		idxDelim = parentId.lastIndexOf('_');
		const entryId = parentId.substring(idxDelim + 1);
		const prefix = parentId.substring(0, idxDelim);

		const totalNum = Number($('#' + prefix + '_num_' + entryId).val());

		if (totalNum - 1 == Number(fieldId)) {
			// 削除対象が最大のインデックスを持っているため、対象を削除してトータル数をデクリメントする。
			$('#' + prefix + '_num_' + entryId).val(String(totalNum - 1));
			$(parent).remove();
		} else {
			// 総数をデクリメントする
			$('#' + prefix + '_num_' + entryId).val(String(totalNum - 1));

			// 削除したチェックボックス以降のチェックボックスをリナンバーして詰める
			for (let targetNum = Number(fieldId); targetNum < totalNum - 1; targetNum++) {
				// [targetNum + 1] を [targetNum] にリナンバー
				renumberAdditionalField(prefix, 'checkBoxFieldList', entryId, targetNum + 1, targetNum);
			}

			$(parent).remove();
		}

		$('#' + prefix + '_' + entryId + '_noncheck').addClass('seal-drag-check-div');
		$('#' + prefix + '_' + entryId + '_noncheck').removeClass('check-limitover');
		$('#' + prefix + '_' + entryId + '_checked').addClass('seal-drag-check-div');
		$('#' + prefix + '_' + entryId + '_checked').removeClass('check-limitover');
	});

	// チェックボックスフィールドの所有者表示・非表示
	$('.stamp-area').on('mouseenter', '.check-drag', function() {
		$(this).css('z-index', '98');
		$(this).find(".checkBoxFieldMenu").css("display", "block");
	});
	$('.stamp-area').on('mouseleave', '.check-drag', function() {
		$(this).find(".checkBoxFieldMenu").css("display", "none");
		$(this).css('z-index', '97');
	});

	// チェックボックスフィールドのリサイズ
	$('.stamp-area').on('resize', '.check-drag', function(e, ui) {
		$(this).find('.checkBoxField1').width($(this).width());
		$(this).find('.checkBoxField1').height($(this).height());
	});
	$('.stamp-area').on('resizestop', '.check-drag', function(e, ui) {
		draggable_stop($(this).context.id, ui.position.top, ui.position.left, $($(this).context).width(), $($(this).context).height(), e, ui);
	});

	// チェックボックスフィールドのドラッグ
	$('.stamp-area').on('dragstop', '.check-drag', function(e, ui) {
		draggable_stop($(this).context.id, ui.position.top, ui.position.left, $($(this).context).width(), $($(this).context).height(), e, ui);
	});

	// 埋め込みテキストフィールド削除ハンドラ
	$('.stamp-area').on('click', '.removeFillText', function() {
		const parent = $(this).parent();

		// 削除対象の情報を取得
		let parentId = parent.attr('id');
		let idxDelim = parentId.lastIndexOf('_');
		const fieldId = parentId.substring(idxDelim + 1);

		parentId = parentId.substring(0, idxDelim);
		idxDelim = parentId.lastIndexOf('_');
		const entryId = parentId.substring(idxDelim + 1);
		const prefix = parentId.substring(0, idxDelim);

		const totalNum = Number($('#' + prefix + '_num_' + entryId).val());

		if (totalNum - 1 == Number(fieldId)) {
			// 削除対象が最大のインデックスを持っているため、対象を削除してトータル数をデクリメントする。
			$('#' + prefix + '_num_' + entryId).val(String(totalNum - 1));
			$(parent).remove();
		} else {
			// 総数をデクリメントする
			$('#' + prefix + '_num_' + entryId).val(String(totalNum - 1));

			// 削除した埋め込みテキスト以降の埋め込みテキストをリナンバーして詰める
			for (let targetNum = Number(fieldId); targetNum < totalNum - 1; targetNum++) {
				// [targetNum + 1] を [targetNum] にリナンバー
				renumberAdditionalField(prefix, 'fillTextFieldList', entryId, targetNum + 1, targetNum);
			}

			$(parent).remove();
		}

		$('#' + prefix + '_' + entryId).addClass('seal-drag-fill-text-div');
		$('#' + prefix + '_' + entryId).removeClass('fill-text-limitover');
	});

	// 埋め込みテキストフィールドの所有者表示・非表示
	$('.stamp-area').on('mouseenter', '.fill-text-drag', function() {
		$(this).css('z-index', '98');
		$(this).find(".fillTextBoxMenu").css("display", "block");
	});
	$('.stamp-area').on('mouseleave', '.fill-text-drag', function() {
		$(this).find(".fillTextBoxMenu").css("display", "none");
		$(this).css('z-index', '97');
	});

	// 埋め込みテキストフィールドのリサイズ
	$('.stamp-area').on('resize', '.fill-text-drag', function(e, ui) {
		const fillTextInputArea = $($(this).context).find(".fillTextBox3");
		if (fillTextInputArea) {
			fillTextInputArea.width($($(this).context).width() - 10);
		}
	});
	$('.stamp-area').on('resizestop', '.fill-text-drag', function(e, ui) {
		draggable_stop($(this).context.id, ui.position.top, ui.position.left, $($(this).context).width(), $($(this).context).height(), e, ui);
	});

	// 埋め込みテキストスフィールドのドラッグ
	$('.stamp-area').on('dragstop', '.fill-text-drag', function(e, ui) {
		draggable_stop($(this).context.id, ui.position.top, ui.position.left, $($(this).context).width(), $($(this).context).height(), e, ui);
	});

	// 埋め込みチェックボックスフィールド削除ハンドラ
	$('.stamp-area').on('click', '.removeFillCheck', function() {
		const parent = $(this).parent();

		// 削除対象の情報を取得
		let parentId = parent.attr('id');
		let idxDelim = parentId.lastIndexOf('_');
		const fieldId = parentId.substring(idxDelim + 1);

		parentId = parentId.substring(0, idxDelim);
		idxDelim = parentId.lastIndexOf('_');
		const entryId = parentId.substring(idxDelim + 1);
		const prefix = parentId.substring(0, idxDelim);

		const totalNum = Number($('#' + prefix + '_num_' + entryId).val());

		if (totalNum - 1 == Number(fieldId)) {
			// 削除対象が最大のインデックスを持っているため、対象を削除してトータル数をデクリメントする。
			$('#' + prefix + '_num_' + entryId).val(String(totalNum - 1));
			$(parent).remove();
		} else {
			// 総数をデクリメントする
			$('#' + prefix + '_num_' + entryId).val(String(totalNum - 1));

			// 削除した埋め込みチェックボックス以降の埋め込みチェックボックスをリナンバーして詰める
			for (let targetNum = Number(fieldId); targetNum < totalNum - 1; targetNum++) {
				// [targetNum + 1] を [targetNum] にリナンバー
				renumberAdditionalField(prefix, 'fillCheckBoxFieldList', entryId, targetNum + 1, targetNum);
			}

			$(parent).remove();
		}

		$('#' + prefix + '_' + entryId + '_noncheck').addClass('seal-drag-fill-check-div');
		$('#' + prefix + '_' + entryId + '_noncheck').removeClass('fill-check-limitover');
		$('#' + prefix + '_' + entryId + '_checked').addClass('seal-drag-fill-check-div');
		$('#' + prefix + '_' + entryId + '_checked').removeClass('fill-check-limitover');
	});

	// 埋め込みチェックボックスフィールドの所有者表示・非表示
	$('.stamp-area').on('mouseenter', '.fill-check-drag', function() {
		$(this).css('z-index', '98');
		$(this).find(".checkBoxFieldMenu").css("display", "block");
	});
	$('.stamp-area').on('mouseleave', '.fill-check-drag', function() {
		$(this).find(".checkBoxFieldMenu").css("display", "none");
		$(this).css('z-index', '97');
	});

	// 埋め込みチェックボックスフィールドのリサイズ
	$('.stamp-area').on('resize', '.fill-check-drag', function(e, ui) {
		$(this).find('.checkBoxField1').width($(this).width());
		$(this).find('.checkBoxField1').height($(this).height());
	});
	$('.stamp-area').on('resizestop', '.fill-check-drag', function(e, ui) {
		draggable_stop($(this).context.id, ui.position.top, ui.position.left, $($(this).context).width(), $($(this).context).height(), e, ui);
	});

	// 埋め込みチェックボックスフィールドのドラッグ
	$('.stamp-area').on('dragstop', '.fill-check-drag', function(e, ui) {
		draggable_stop($(this).context.id, ui.position.top, ui.position.left, $($(this).context).width(), $($(this).context).height(), e, ui);
	});

	function escapeHTML(html) {
		return jQuery('<div>').text(html).html();
	}
});

// 係数(72dpiで「1POINT=1PIXEL」PDFをPNG変換時に「72 * 4」DPIで変換するので「1 / 4 = 0.25」になる)
var scale = 0.25;

/**
 * 署名フィールドをDBに登録されている位置に移動します。
 *
 * @param divPrefix
 *            divのプレフィックス
 * @param objPrefix
 *            画像、テキストのプレフィックス
 * @param x1
 *            DB登録に登録されている「start_x」
 * @param y1
 *            DB登録に登録されている「start_y」
 * @param x2
 *            DB登録に登録されている「end_x」
 * @param y2
 *            DB登録に登録されている「end_x」
 * @param signPageNumber
 *            DB登録に登録されている「start_page_no」
 * @param idx
 *           署名フィールドのINDEX
 * @param pdfImage
 *           署名画像Image
 */
function moveSignField(divPrefix, objPrefix, x1, y1, x2, y2, signPageNumber, idx, pdfImage) {
	// 署名フィールドを設定されているページ番号のPDFエリアに移動
	//Androidでのフリーテキストエリア入力不具合対応のためコメント
	//$("#" + divPrefix + idx).appendTo("#pdfArea" + signPageNumber);

	// スクロールエリアの左位置
	var scrollAreaLeft = $("#scrollArea").offset().left;
	// PDF画像の左位置
	var imgLeft = $("#pdfImage" + signPageNumber).offset().left;

	// 署名するPDF画像の基本位置(署名フィールドの左上とPDF画像の左下が一致する場所)
	var baseLeftPosition = (parseFloat(imgLeft) - parseFloat(scrollAreaLeft));
	var baseTopPosition = 0;

	// 表示されている画像の高さ
	var pdfHeight = $("#pdfImage" + signPageNumber).height();
	// 表示されている画像の幅
	var pdfWidth = $("#pdfImage" + signPageNumber).width();
	// 縮小されていないイメージの取得
	var img = new Image();
	if (pdfImage) {
		img = pdfImage;
	} else {
		img.src = $('#imageUrl').val() + signPageNumber;
	}
	// 実際の画像の高さ
	var orgImgHeight = img.height;
	// 実際の画像の幅
	var orgImgWidth = img.width;
	if(orgImgHeight == 0){
		var pdfImg = document.getElementById("pdfImage" + signPageNumber);
		orgImgHeight = pdfImg.naturalHeight;
	}
	if(orgImgWidth == 0){
		var pdfImg = document.getElementById("pdfImage" + signPageNumber);
		orgImgWidth = pdfImg.naturalWidth;
	}
	// イメージの倍率
	var imgHeigntScale = orgImgHeight / pdfHeight;
	var imgWidthScale = orgImgWidth / pdfWidth;

	// 各座標の単位をポイントからピクセルに変換
	var pointX1 = x1 / scale / imgHeigntScale;
	var pointY1 = y1 / scale / imgWidthScale;
	var pointX2 = x2 / scale / imgHeigntScale;
	var pointY2 = y2 / scale / imgWidthScale;

	// 実際の署名フィールドの幅
	var fieldWidth = pointX2 - pointX1;
	// 実際の署名フィールドの高さ
	var fieldHeight = pointY2 - pointY1;

	// 署名フィールを置く位置(PDF画像の左下を起点にした座標)
	var leftPosition = parseFloat(baseLeftPosition) + pointX1;
	var topPosition = pdfHeight - (parseFloat(baseTopPosition) + pointY2);

	// 署名フィールド移動
	$("#" + divPrefix + idx).animate({
		left : leftPosition,
		top : topPosition
	}, {
		duration : "fast"
	});
	// 署名フィールドを実際のフィールドの大きさに変換
	$("#" + objPrefix + idx).width(fieldWidth).height(fieldHeight);
	// テキストフィールドの場合はフォントサイズも変更
	var baseFontSize = 12;
	if (orgImgHeight < orgImgWidth) {
		//横レイアウトの場合
		var m = orgImgWidth * scale;
		if (m <= MINW) {
			//A4横
			baseFontSize = parseInt(baseFontSize) - 5;
		} else if (m < MAXW) {
			//B4横
			baseFontSize = parseInt(baseFontSize) - 4;
		}
	} else {
		//縦レイアウトの場合(A4のみを想定)
		baseFontSize = parseInt(baseFontSize) - 3;
	}

	if ($("#" + objPrefix + idx).attr('type') == "text") {
		var fontSize = baseFontSize / scale / imgHeigntScale;
		$("#" + objPrefix + idx).css("font-size",fontSize + "px");
	}
	// 署名フィールドを表示
	$("#" + divPrefix + idx).show();

	// 署名位置までスクロールさせる
//	var pdfBottom = $("#pdfArea" + signPageNumber).offset().top
//			+ $("#pdfArea" + signPageNumber).height();
//	var scrollAreaHeight = $("#scrollArea").height();
//	var scrollDown = pdfBottom + topPosition - (scrollAreaHeight / 2) - (fieldHeight);
//	$("#scrollArea").animate({
//		scrollTop : scrollDown
//	}, "fast");
}

/**
 * PDF画像の読み込み完了判定<br>
 * 各画面で実装してください。
 *
 * @returns true - 読み込み完了 / false - 読み込み中
 */
function isPdfImagesLoaded() {
	return true;
}

/**
 * PDF画像の横幅設定<br>
 * 1ページ目の横幅が基準となります。
 */
function setPdfImagesWidth() {
	if(document.getElementById('pdfImage1') != null) {
		var imgUrl = $('#imageUrl').val() + '1';
		var JudgmentImg = new Image();
		JudgmentImg.addEventListener("load", function() {
			var JudgmentW = JudgmentImg.width;
			var JudgmentH = JudgmentImg.height;
			var setWidth = "1000px";

			if (JudgmentW < JudgmentH) {
				//縦(A4のみを想定)
				setWidth = "1000px";
			} else {
				var m = JudgmentImg.width * scale;
				if (m <= MINW) {
					//A4横
					setWidth = "1980px";
				} else if (m < MAXW) {
					//B4横
					setWidth = "1990px";
				} else {
					//A3横
					setWidth = "2000px";
				}
			}
			for (var i = 1; i <= pCount; i++) {
				$("#pdfImage" + i).css("width",setWidth);
			}
		}, false);
		JudgmentImg.src = imgUrl;
	}
}

/**
 * 署名ポジション計算用関数
 *
 * @param fieldPrefix
 *            IDのプレフィックス（キー）
 * @param pageCount
 *            PDFページ数
 * @param targetCount
 *            署名ポジション設定対象となる人数
 * @param maxFieldCount
 *            配置可能なフィールド数
 * @param minFieldCount
 *            最低限配置しなければならないフィールド数
 * @param fieldMagine
 *            フィールドのマージン
 */
function Documents(fieldPrefix, pageCount, targetCount, maxFieldCount, minFieldCount, fieldMagine) {
	if(maxFieldCount < 0) {
		// 無制限でも最大99にしておく
		maxFieldCount = 99;
	}

	// マージン(PDFの境界付近にフィールドを置くとはみ出ていてもチェックを通るため)
	var magine = 1;

	// フィールドのマージン
	//var fieldMagine = 0;
	// PDFのマージン TODO デザインマージ時に正しくする
	var pdfMagine = 0 * 2;

	/**
	 * フィールドの最大値に達したかどうかを判定します。
	 *
	 * @param num
	 *            現在のフィールド数
	 * @returns 最大値に達した場合はtrue
	 */
	this.isMaxFieldOver = function isMaxFieldOver(num) {
		return (num >= maxFieldCount);
	};

	/**
	 * X座標を計算します。<br>
	 * ドロップされたフィールドの左上のX座標をPDFファイルを基準に算出します。
	 *
	 * @param x
	 *            ドロップ時のオフセット値
	 * @param page
	 *            PDFページ番号
	 * @returns PDF内のX座標
	 */
	this.computeX = function computeX(x, page) {
		if (page <= 0) {
			return -1;
		}
		var result = x - $("#pdfImage" + page)[0].offsetLeft;
		return result;
	};

	/**
	 * Y座標を計算します。<br>
	 * ドロップされたフィールドの左上のY座標をPDFファイルを基準に算出します。
	 *
	 * @param y
	 *            ドロップ時のオフセット値
	 * @param page
	 *            PDFページ番号
	 * @returns PDF内のY座標
	 */
	this.computeY = function computeY(y, page) {
		if (page <= 0) {
			return -1;
		}
		var result = y - $("#pdfImage" + page)[0].offsetTop;
		return result;
	};

	/**
	 * ページ番号を計算します。<br>
	 * ドロップされたフィールドの左上がPDFの何ページにあるのかを算出します。
	 *
	 * @param x
	 *            X座標(computeXで計算してください)
	 * @param y
	 *            X座標(computeYで計算してください)
	 * @returns PDFのページ番号
	 */
	this.computePage = function computePage(x, y, w, h) {
//		var scrollTop = $(".stamp-area").scrollTop();
		var scrollTop = 0;
		y = y + scrollTop;
		for (var i = 1; i <= pageCount; i++) {
			flag = false;
			var pdf = $("#pdfImage" + i);
			var x1 = pdf[0].offsetLeft;
			var x2 = pdf[0].offsetLeft + pdf.width() - w;
			var y1 = pdf[0].offsetTop + scrollTop;
			var y2 = pdf[0].offsetTop + pdf.height() + scrollTop - h;
			if (x1 <= x && x <= x2 && y1 <= y && y <= y2) {
				return i;
			}
		}
		return 0;
	};

	/**
	 * フィールの位置がPDF内にあるかチェックします。
	 *
	 * @param isAll
	 *            falseの場合は左上のみチェック。trueの場合は左上＋右下をチェック
	 * @returns true - PDF内にある / false - PDF内にない
	 */
	this.checkPosition = function checkPosition(isAll) {
	
		var jMax = maxFieldCount >= 0 ? maxFieldCount : 99;
		for (var i = 0; i < targetCount; i++) {
			var seqCount = 0;
			alert("outside i :: "+i);
			for (var j = 0; j < jMax; j++) {
			alert("i :: "+i);
			alert("j :: "+j);
			alert(document.getElementById(fieldPrefix + "page_" + i + "_" + j));
				if(document.getElementById(fieldPrefix + "page_" + i + "_" + j) == null) {
					break;
				}
				seqCount = seqCount + 1;
				var page = $("#" + fieldPrefix + "page_" + i + "_" + j).val();
				var x1 = parseFloat($("#" + fieldPrefix + "x1_" + i + "_" + j).val());
				var y1 = parseFloat($("#" + fieldPrefix + "y1_" + i + "_" + j).val());
				if (page == "" || page == 0) {
					return false;
				}
				if (x1 < 0 || y1 < 0) {
					return false;
				}
				var pdf = $("#pdfImage" + page);
				var pdfMaxLeft = pdf.width() - magine;
				var pdfMaxBottom = pdf.height() - magine;
				if (pdfMaxLeft < x1 || pdfMaxBottom < y1) {
					return false;
				}
				if (isAll) {
					// x2,y2もチェック
					var field = $("#" + fieldPrefix + i + "_" + j);
					alert("#" + fieldPrefix + i + "_" + j);
					var x2 = x1 + parseFloat(field.width()) + fieldMagine;
					var y2 = y1 + parseFloat(field.height()) + fieldMagine;
					$("#" + fieldPrefix + "x2_" + i + "_" + j).val(x2);
					$("#" + fieldPrefix + "y2_" + i + "_" + j).val(y2);

					if (x2 < 0 || y2 < 0) {
						return false;
					}
					if (pdfMaxLeft < x2 || pdfMaxBottom < y2) {
						return false;
					}
				}
			}
			if (seqCount < minFieldCount) {
				return false;
			}
		}
		return true;
	};
	
	this.checkPositionNew = function checkPositionNew(isAll,fieldPrefixNew,fieldSuffixNew,pageNew) {
				//alert(fieldPrefixNew);
				//alert(fieldSuffixNew);
				//alert(pageNew);
				var page = $("#" + fieldPrefixNew + "page_" + fieldSuffixNew).val();
				var x1 = parseFloat($("#" + fieldPrefixNew + "x1_" + fieldSuffixNew).val());
				var y1 = parseFloat($("#" + fieldPrefixNew + "y1_" + fieldSuffixNew).val());
				if (page == "" || page == 0) {
					return false;
				}
				if (x1 < 0 || y1 < 0) {
					return false;
				}
				var pdf = $("#pdfImage" + page);
				var pdfMaxLeft = pdf.width() - magine;
				var pdfMaxBottom = pdf.height() - magine;
				if (pdfMaxLeft < x1 || pdfMaxBottom < y1) {
					return false;
				}
				if (isAll) {
					// x2,y2もチェック
					var field = $("#" + fieldPrefixNew + fieldSuffixNew);
					//alert("#" + fieldPrefixNew + fieldSuffixNew);
					var x2 = x1 + parseFloat(field.width()) + fieldMagine;
					var y2 = y1 + parseFloat(field.height()) + fieldMagine;
					$("#" + fieldPrefixNew + "x2_" + fieldSuffixNew).val(x2);
					$("#" + fieldPrefixNew + "y2_" + fieldSuffixNew).val(y2);

					if (x2 < 0 || y2 < 0) {
						return false;
					}
					if (pdfMaxLeft < x2 || pdfMaxBottom < y2) {
						return false;
					}
				}
		
		return true;
	};

	/**
	 * 計算します。<br>
	 * 署名フィールドのPDF内に存在するかのチェックを行い問題ない場合は署名フィール作成用の座標に変換する。<br>
	 * ※署名フィールド用の座標とはPDFの右下を起点とした単位をPOINTに変換した値のことである。
	 *
	 * @returns true - 計算した結果問題なし / false - 署名フィールドがPDF内にないものがある
	 */
	this.compute = function compute() {
		var jMax = maxFieldCount >= 0 ? maxFieldCount : 99;
		if (!this.checkPosition(true)) {
			return false;
		}
		for (var i = 0; i < targetCount; i++) {
			for (var j = 0; j < jMax; j++) {
				if(document.getElementById(fieldPrefix + "page_" + i + "_" + j) == null) {
					break;
				}
				computeForPdf(i, j);
			}
		}
		return true;
	};

	/**
	 * フィールドのザ行をPDFに合わせたものに変換します。<br>
	 * ・基準を右下に変換<br>
	 * ・pixelからpointに変換<br>
	 * ・PDFイメージの縮尺に合わせて変換 ・左上右下を右上左下に変換
	 */
	function computeForPdf(i, j) {
		var page = $("#" + fieldPrefix + "page_" + i + "_" + j).val();
		var x1 = parseFloat($("#" + fieldPrefix + "x1_" + i + "_" + j).val());
		var y1 = parseFloat($("#" + fieldPrefix + "y1_" + i + "_" + j).val());
		var x2 = parseFloat($("#" + fieldPrefix + "x2_" + i + "_" + j).val());
		var y2 = parseFloat($("#" + fieldPrefix + "y2_" + i + "_" + j).val());
		var pdfHeight = $("#pdfImage" + page).height();
		var pdfWidth = $("#pdfImage" + page).width();

		pdfHeight -= (parseFloat(pdfMagine) * 2);
		pdfWidth -= (parseFloat(pdfMagine) * 2);

		// 左下起点に変更(xは変更なし)
		y1 = pdfHeight - y1;
		y2 = pdfHeight - y2;

		// 縮小されていないイメージの取得
		var img = new Image();
		img.src = $('#imageUrl').val() + page;
		// 実際の画像の高さ
		var orgImgHeight = img.height;
		// 実際の画像の幅
		var orgImgWidth = img.width;
		if(orgImgHeight == 0){
			var pdfImg = document.getElementById("pdfImage" + page);
			orgImgHeight = pdfImg.naturalHeight;
		}
		if(orgImgWidth == 0){
			var pdfImg = document.getElementById("pdfImage" + page);
			orgImgWidth = pdfImg.naturalWidth;
		}
		// イメージの倍率
		var imgHeigntScale = orgImgHeight / pdfHeight;
		var imgWidthScale = orgImgWidth / pdfWidth;

		// ポイント変換
		x1 = x1 * scale * imgWidthScale;
		x2 = x2 * scale * imgWidthScale;
		y1 = y1 * scale * imgHeigntScale;
		y2 = y2 * scale * imgHeigntScale;

		// 左上右下を右上左下に変換(x座標だけ入れ替える)
		var tmp = x1;
		x1 = x2;
		x2 = tmp;

		// hiddenにセットし直し
		$("#" + fieldPrefix + "x1_" + i + "_" + j).val(x1);
		$("#" + fieldPrefix + "y1_" + i + "_" + j).val(y1);
		$("#" + fieldPrefix + "x2_" + i + "_" + j).val(x2);
		$("#" + fieldPrefix + "y2_" + i + "_" + j).val(y2);
		console.log("compute:(" + x1 + ", " + y1 + ", " + x2 + ", " + y2 + ")");
	}
	
	


	this.computeForPdfNew = function(fieldPrefix,i, j) {
			fieldPrefix = fieldPrefix + "_";
			//alert("#" + fieldPrefix + "page_" + i + "_" + j);
			var page = $("#" + fieldPrefix + "page_" + i + "_" + j).val();
			var x1 = parseFloat($("#" + fieldPrefix + "x1_" + i + "_" + j).val());
			var y1 = parseFloat($("#" + fieldPrefix + "y1_" + i + "_" + j).val());
			var x2 = parseFloat($("#" + fieldPrefix + "x2_" + i + "_" + j).val());
			var y2 = parseFloat($("#" + fieldPrefix + "y2_" + i + "_" + j).val());
			var pdfHeight = $("#pdfImage" + page).height();
			var pdfWidth = $("#pdfImage" + page).width();

			pdfHeight -= (parseFloat(pdfMagine) * 2);
			pdfWidth -= (parseFloat(pdfMagine) * 2);

			// 左下起点に変更(xは変更なし)
			y1 = pdfHeight - y1;
			y2 = pdfHeight - y2;

			// 縮小されていないイメージの取得
			//alert(page);
			var img = new Image();
			//img.src = $('#imageUrl').val() + page;
			img.src = document.getElementById("pdfImage" + page).src;
			// 実際の画像の高さ
			var orgImgHeight = img.height;
			// 実際の画像の幅
			var orgImgWidth = img.width;
			if(orgImgHeight == 0){
				var pdfImg = document.getElementById("pdfImage" + page);
				orgImgHeight = pdfImg.naturalHeight;
			}
			if(orgImgWidth == 0){
				var pdfImg = document.getElementById("pdfImage" + page);
				orgImgWidth = pdfImg.naturalWidth;
			}
			// イメージの倍率
			var imgHeigntScale = orgImgHeight / pdfHeight;
			var imgWidthScale = orgImgWidth / pdfWidth;

			// ポイント変換
			x1 = x1 * scale * imgWidthScale;
			x2 = x2 * scale * imgWidthScale;
			y1 = y1 * scale * imgHeigntScale;
			y2 = y2 * scale * imgHeigntScale;

			// 左上右下を右上左下に変換(x座標だけ入れ替える)
			var tmp = x1;
			x1 = x2;
			x2 = tmp;

			// hiddenにセットし直し
			$("#" + fieldPrefix + "x1_" + i + "_" + j).val(x1);
			$("#" + fieldPrefix + "y1_" + i + "_" + j).val(y1);
			$("#" + fieldPrefix + "x2_" + i + "_" + j).val(x2);
			$("#" + fieldPrefix + "y2_" + i + "_" + j).val(y2);
			console.log("compute:(" + x1 + ", " + y1 + ", " + x2 + ", " + y2 + ")");
		}

	//表示領域のwidth指定用にページ数を保持
	pCount= pageCount;

}

/**
 * 手書き入力用のキャンバスのヘルパークラス（コンストラクタ関数）
 *
 * @param canvasId
 *            キャンバスのID（必須）
 * @param closestContainerId
 *            キャンバスの横幅調整用のコンテナのセレクタ（任意。省略時は ".modalBody" を適用）
 */
function FreeDrawCanvasHelper(canvasId, closestContainerId) {

	// 線の太さ
	var lineWidth = 3;

	// 手書き入力用のキャンバス設定
	var canvas = document.getElementById(canvasId);

	// 幅の補正（この時点で非表示になっていても幅を取得できる jQuery の関数で対処する）
	var fbMaxWidth = 360;
	var fbMinWidth = 300;

	var screenWidth = window.innerWidth;

	if( screenWidth > fbMaxWidth ){
		fbMaxWidth = screenWidth;
	}

	var widthForCanvas = $(canvas).closest(closestContainerId ? closestContainerId : ".modalBody").width() * 0.7;
	if (fbMinWidth > widthForCanvas) {
		// 想定値が得られない場合はレスポンシブ対応の一環としてフォールバック処置
		widthForCanvas = fbMinWidth;
		var widthForWindow = screenWidth * 0.9;
		if (widthForWindow > fbMaxWidth) {
			widthForWindow = fbMaxWidth;
		}
		widthForCanvas = Math.max(widthForCanvas, widthForWindow);
	}
	canvas.width = widthForCanvas;

	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = lineWidth;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";

	// キャンバス状態保持用
	var ox = 0, oy = 0, x = 0, y = 0;
	var minx = 0, maxx = 0;
	var drawing = false;

	// ダーティフラグ設定・参照
	var setDirty = function(dirty) {
		var val = (dirty === true || dirty === "true") ? "true" : "false";
		canvas.setAttribute("data-is-dirty", val);
	};
	var isDirty = function() {
		return canvas.getAttribute("data-is-dirty") === "true";
	};

	// 描画用の手続き
	var drawLine = function() {
		// 描画
		ctx.beginPath();
		ctx.moveTo(ox, oy);
		ctx.lineTo(x, y);
		ctx.stroke();
		// ダーティフラグON
		setDirty(true);
		// X軸の描画対象範囲を更新
		minx = Math.min(minx, Math.min(ox, x));
		maxx = Math.max(maxx, Math.max(ox, x));
	};

	// キャンバスクリア用の手続き
	var clearCanvas = function() {
		// 描画
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// ダーティフラグOFF
		setDirty(false);
		// X軸の描画対象範囲を更新
		minx = canvas.width;
		maxx = 0;
	};

	// X軸の描画範囲確認用の手続き（それぞれ線の太さを加味して補正する）
	var getDrawnStartX = function() {
		return Math.max(minx - lineWidth, 0);
	};
	var getDrawnWidth = function() {
		return Math.min(maxx - minx + lineWidth * 2.5, canvas.width);
	};

	// イベントハンドラ
	var onTouchStart = function(event) {
		drawing = true;
		var touch = event.touches[0];
		var rect = event.target.getBoundingClientRect();
		ox = touch.clientX - rect.left;
		oy = touch.clientY - rect.top;
		event.stopPropagation();
	};
	var onTouchMove = function(event) {
		if (!drawing) {
			return;
		}
		var touch = event.touches[0];
		var rect = event.target.getBoundingClientRect();
		x = touch.clientX - rect.left;
		y = touch.clientY - rect.top;
		drawLine();
		ox = x;
		oy = y;
		event.preventDefault();
		event.stopPropagation();
	};
	var onTouchEnd = function(event) {
		drawing = false;
		event.stopPropagation();
	};
	var onMouseDown = function(event) {
		var rect = event.target.getBoundingClientRect();
		ox = event.clientX - rect.left;
		oy = event.clientY - rect.top;
		drawing = true;
	};
	var onMouseMove = function(event) {
		if (!drawing) {
			return;
		}
		if (event.buttons !== 1 && event.which !== 1) {
			// 描画状態のまま外に行くと drawing=true のままになるので、その保険
			return;
		}
		var rect = event.target.getBoundingClientRect();
		x = event.clientX - rect.left;
		y = event.clientY - rect.top;
		drawLine();
		ox = x;
		oy = y;
	};
	var onMouseUp = function(event) {
		drawing = false;
	};

	// イベント設定
	canvas.addEventListener("touchstart", onTouchStart, false);
	canvas.addEventListener("touchmove", onTouchMove, false);
	canvas.addEventListener("touchend", onTouchEnd, false);
	canvas.addEventListener("mousedown", onMouseDown, false);
	canvas.addEventListener("mousemove", onMouseMove, false);
	canvas.addEventListener("mouseup", onMouseUp, false);

	// キャンバス初期化
	clearCanvas();

	// 公開機能
	this.canvas = canvas; // HTML element
	this.clearCanvas = clearCanvas; // function
	this.isDirty = isDirty; // function
	this.getDrawnStartX = getDrawnStartX; // function
	this.getDrawnWidth = getDrawnWidth; // function
}

/**
 * 署名フィールドのリサイズ・ドラッグを有効化
 */
function enableSignFieldResizeAndDrag(signField) {
	// アスペクトの設定
	const aspectratio = false;

	// リサイズ
	$(signField).resizable({
		aspectRatio: aspectratio,
		maxWidth: $(signField).width() + 284,
		minWidth: $(signField).width() - 30,
		maxHeight: $(signField).height() + 134,
		minHeight: $(signField).height() - 30
	});

	$(signField).draggable({
		containment: 'parent',
		accept: "#pdfImage1",
		cursor: "move"
	});
}

/**
 * フリーテキストフィールドのリサイズ・ドラッグを有効化
 */
function enableFreeTextFieldResizeAndDrag(freeTextField) {
	// アスペクトの設定
	const aspectratio = false;

	// リサイズ
	$(freeTextField).resizable({
		aspectRatio: aspectratio,
		maxWidth: 980,
		minWidth: 30,
		maxHeight: 30,
		minHeight: 30
	});

	$(freeTextField).draggable({
		containment: 'parent',
		accept: "#pdfImage1",
		cursor: "move"
	});
}

/**
 * チェックボックスフィールドのリサイズ・ドラッグを有効化
 */
function enableCheckBoxFieldResizeAndDrag(checkBoxField) {
	// アスペクトの設定
	const aspectratio = true;

	// リサイズ
	$(checkBoxField).resizable({
		aspectRatio: aspectratio,
		maxWidth: 60,
		minWidth: 24,
		maxHeight: 60,
		minHeight: 24
	});

	$(checkBoxField).draggable({
		containment: 'parent',
		accept: "#pdfImage1",
		cursor: "move"
	});
}

/**
 * 埋め込みテキストフィールドのリサイズ・ドラッグを有効化
 */
function enableFillTextFieldResizeAndDrag(fillTextField) {
	// アスペクトの設定
	const aspectratio = false;

	// リサイズ
	$(fillTextField).resizable({
		aspectRatio: aspectratio,
		maxWidth: 980,
		minWidth: 30,
		maxHeight: 30,
		minHeight: 30
	});

	$(fillTextField).draggable({
		containment: 'parent',
		accept: "#pdfImage1",
		cursor: "move"
	});
}

/**
 * 埋め込みチェックボックスフィールドのリサイズ・ドラッグを有効化
 */
function enableFillCheckBoxResizeAndDrag(fillCheckBoxField) {
	// アスペクトの設定
	const aspectratio = true;

	// リサイズ
	$(fillCheckBoxField).resizable({
		aspectRatio: aspectratio,
		maxWidth: 60,
		minWidth: 24,
		maxHeight: 60,
		minHeight: 24
	});

	$(fillCheckBoxField).draggable({
		containment: 'parent',
		accept: "#pdfImage1",
		cursor: "move"
	});
}

/**
 * 「signFieldRoot」配下の署名フィールド（DB表現のまま）を、「stampArea」要素を起点とする
 * 文書イメージ上に再配置する。
 * なお、各文書ページのIMGは、「prefixPageImg」＋ページ番号（1始まり）で指定する。
 * 
 * @param {*} stampArea 文書全体の起点となる要素
 * @param {*} prefixPageImg 各文書ページのPNGを表示するIMGタグ
 * @param {*} signFieldRoot DB表現のままの署名フィールドを格納している要素
 * @param {*} imgOriginalWidth オリジナルのページイメージの幅
 * @param {*} imgOriginalHeight オリジナルのページイメージの高さ
 */
function moveSignFieldsDbToEditPosition(stampArea, prefixPageImg, signFieldRoot, imgOriginalWidth, imgOriginalHeight) {

	// 文書全体のオフセットを取得
	const stampAreaOffsetLeft = $(stampArea).offset().left;
	const stampAreaOffsetTop = $(stampArea).offset().top;

	$(signFieldRoot).children('div').each(function(idx, moveTarget) {
		const pageNumber = $(moveTarget).find('[name$=pageNumber]').val();
		const pageImgTag = $('#' + prefixPageImg + pageNumber);

		const imageScaleWidth = imgOriginalWidth / pageImgTag.width();
		const imageScaleHeight = imgOriginalHeight / pageImgTag.height();

		// 位置情報をピクセルに変換
		// ※scaleは、document.js内で定義のPNG変換時のDPI
		const x1 = $(moveTarget).find('[name$=x1]').val() / scale / imageScaleWidth;
		const workY1 = $(moveTarget).find('[name$=y1]').val() / scale / imageScaleHeight;
		const x2 = $(moveTarget).find('[name$=x2]').val() / scale / imageScaleWidth;
		const workY2 = $(moveTarget).find('[name$=y2]').val() / scale / imageScaleHeight;

		// PDFの左下を基準としてY側の座標をセット
		const y2 = pageImgTag.height() - workY1;
		const y1 = y2 - (workY2 - workY1);

		$(moveTarget).find('[name$=x1]').val(x1);
		$(moveTarget).find('[name$=y1]').val(y1);
		$(moveTarget).find('[name$=x2]').val(x2);
		$(moveTarget).find('[name$=y2]').val(y2);

		// リサイズおよび、ドラッグを有効化
		if ($(moveTarget).hasClass('stamp-drag')) {
			enableSignFieldResizeAndDrag($(moveTarget));
		} else if ($(moveTarget).hasClass('text-drag')) {
			enableFreeTextFieldResizeAndDrag($(moveTarget));
		} else if ($(moveTarget).hasClass('check-drag')) {
			enableCheckBoxFieldResizeAndDrag($(moveTarget));
		} else if ($(moveTarget).hasClass('fill-text-drag')) {
			enableFillTextFieldResizeAndDrag($(moveTarget));
		} else if ($(moveTarget).hasClass('fill-check-drag')) {
			enableFillCheckBoxResizeAndDrag($(moveTarget));
		}

		// parseInt()は、数値に変換できるところまでを数値に変換する。
		// よって、「10px」の場合、変換結果は「10」となる。
		const imageMarginLeft = parseInt(pageImgTag.css('margin-left'), 10);
		const imageMarginTop = parseInt(pageImgTag.css('margin-top'), 10);
		const borderTopWidth = parseInt($(moveTarget).css('border-top-width'), 10);

		// フィールドの位置情報を計算
		const fieldX1 = x1 + pageImgTag.position().left + imageMarginLeft + stampAreaOffsetLeft;
		const fieldY1 = y1 + pageImgTag.position().top + imageMarginTop + stampAreaOffsetTop - borderTopWidth;
		const fieldWidth = x2 - x1;
		let fieldHeight = y2 - y1;

		// フィールドのノードを付け替える
		$(moveTarget).detach();
		$(stampArea).append($(moveTarget));
		
		// 位置情報をセット
		$(moveTarget).offset({ left: fieldX1, top: fieldY1 });
		$(moveTarget).innerWidth(fieldWidth);
		$(moveTarget).innerHeight(fieldHeight);

		if ($(moveTarget).hasClass('check-drag')) {
			// チェックボックスの場合、チェックボックス画像のサイズも調整する
			const checkBoxField1 = $(moveTarget).find('.checkBoxField1');
			if (checkBoxField1) {
				checkBoxField1.width($(moveTarget).width());
				checkBoxField1.height($(moveTarget).height());
			}
		} else if ($(moveTarget).hasClass('fill-text-drag')) {
			// 埋め込みテキストの場合、内包するテキストボックスのサイズも調整する
			const fillTextInputArea = $(moveTarget).find(".fillTextBox3");
			if (fillTextInputArea) {
				fillTextInputArea.width($(moveTarget).width() - 10);
			}
		} else if ($(moveTarget).hasClass('fill-check-drag')) {
			// 埋め込みチェックボックスの場合、チェックボックス画像のサイズも調整する
			const checkBoxField1 = $(moveTarget).find('.checkBoxField1');
			if (checkBoxField1) {
				checkBoxField1.width($(moveTarget).width());
				checkBoxField1.height($(moveTarget).height());
			}
		}
	});
}

/**
 * 署名者リスト中の各署名者について、署名フィールドの配置数の上限をチェック
 * なお、上限を超過したフィールドについては追加の配置を行うことができないようにする。
 * @param {*} sealListElement 署名者情報のリストを保持している要素
 */
function checkSignFieldsLimitOver(sealListElement) {
	// クラス(seal-drag)を持つ要素を順に処理する
	// ※背景色の指定を利用して、署名者の種類を判定して処理を分けている
	$(sealListElement).find('.seal-drag').each(function(idx, element) {
		const classNameString = new String(element.className);
		const isFillField = classNameString.lastIndexOf('bgcolorDocumentFill') != -1;
		const isOurSigner = classNameString.lastIndexOf('bgcolorOurSigner') != -1;
		const isPartnerSigner = classNameString.lastIndexOf('bgcolorPartnerSigner') != -1;

		if (isFillField) {
			// 送信元埋め込みフィールドに対する処理

			// 埋め込みテキスト
			const fillTextNum = $(element).find('[name^=fillText_num_]');
			const fillTextNumPart = new String(fillTextNum.attr('id')).split('_');
			if (fieldArray[fillTextNumPart[0] + '_'].isMaxFieldOver(Number($(fillTextNum).val()))) {
				// 最大数超過のため、ドロップを禁止する
				const fieldId = '#' + fillTextNumPart[0] + '_' + fillTextNumPart[2];
				$(fieldId).addClass('fill-text-limitover');
				$(fieldId).removeClass('seal-drag-fill-text-div');
			}

			// 埋め込みチェックボックス
			const fillCheckNum = $(element).find('[name^=fillCheck_num_]');
			const fillCheckNumPart = new String(fillCheckNum.attr('id')).split('_');
			if (fieldArray[fillCheckNumPart[0] + '_'].isMaxFieldOver(Number($(fillCheckNum).val()))) {
				// 最大数超過のため、ドロップを禁止する
				const fieldIdNonCheck = '#' + fillCheckNumPart[0] + '_' + fillCheckNumPart[2] + '_noncheck';
				const fieldIdChecked =  '#' + fillCheckNumPart[0] + '_' + fillCheckNumPart[2] + '_checked';
				$(fieldIdNonCheck).addClass('fill-check-limitover');
				$(fieldIdNonCheck).removeClass('seal-drag-fill-check-div');
				$(fieldIdChecked).addClass('fill-check-limitover');
				$(fieldIdChecked).removeClass('seal-drag-fill-check-div');
			}
		} else if (isOurSigner || isPartnerSigner) {
			// 自社署名者または、送信先に対する処理
			let signFieldClassName = '';
			let freeTextFieldClassName = '';
			let checkBoxFieldClassName = '';
			if (isOurSigner) {
				// 自社署名者用のクラス名
				signFieldClassName = 'ourSignerField_num_';
				freeTextFieldClassName = 'ourSignerFreeText_num_';
				checkBoxFieldClassName = 'ourSignerCheck_num_';
			} else {
				// 送信先用のクラス名
				signFieldClassName = 'partnerSignerField_num_';
				freeTextFieldClassName = 'partnerSignerFreeText_num_';
				checkBoxFieldClassName = 'partnerSignerCheck_num_';
			}

			// 署名フィールド
			const signFieldNum = $(element).find('[name^=' + signFieldClassName + ']');
			const signFieldNumPart = new String(signFieldNum.attr('id')).split('_');
			if (fieldArray[signFieldNumPart[0] + '_'].isMaxFieldOver(Number($(signFieldNum).val()))) {
				// 最大数超過のため、ドロップを禁止する
				const fieldId = '#' + signFieldNumPart[0] + '_' + signFieldNumPart[2];
				$(fieldId).removeClass('seal-drag-stamp-div');
			}

			// フリーテキスト
			const textFieldNum = $(element).find('[name^=' + freeTextFieldClassName + ']');
			const textFieldNumPart = new String(textFieldNum.attr('id')).split('_');
			if (fieldArray[textFieldNumPart[0] + '_'].isMaxFieldOver(Number($(textFieldNum).val()))) {
				// 最大数超過のため、ドロップを禁止する
				const fieldId = '#' + textFieldNumPart[0] + '_' + textFieldNumPart[2];
				$(fieldId).addClass('text-limitover');
				$(fieldId).removeClass('seal-drag-text-div');
			}

			// チェックボックス
			const checkFieldNum = $(element).find('[name^=' + checkBoxFieldClassName + ']');
			const checkFieldNumPart = new String(checkFieldNum.attr('id')).split('_');
			if (fieldArray[checkFieldNumPart[0] + '_'].isMaxFieldOver(Number($(checkFieldNum).val()))) {
				// 最大数超過のため、ドロップを禁止する
				const fieldIdNonCheck = '#' + checkFieldNumPart[0] + '_' + checkFieldNumPart[2] + '_noncheck';
				const fieldIdChecked =  '#' + checkFieldNumPart[0] + '_' + checkFieldNumPart[2] + '_checked';
				$(fieldIdNonCheck).addClass('check-limitover');
				$(fieldIdNonCheck).removeClass('seal-drag-check-div');
				$(fieldIdChecked).addClass('check-limitover');
				$(fieldIdChecked).removeClass('seal-drag-check-div');
			}
		}
	} );

	// 全フィールドの座標を調整
	$.each(fieldArray, function(key, value) {
		value.checkPosition(true);
	});
}

/**
 * チェック対象文字列中にサロゲートペアの文字を含むかを確認する
 * @param {*} targetString チェック対象文字列
 */
function isContainsSurrogatePair(targetString) {
	if ((typeof targetString === 'string') && targetString.trim() != "") {
		if ((targetString.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)||[]).length > 0) {
			// サロゲートペアのコードページに該当するパターンを検出
			return true;
		}
	}
	return false;
}

function getAllUrlParams(url) {

	  // get query string from url (optional) or window
	  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

	  // we'll store the parameters here
	  var obj = {};

	  // if query string exists
	  if (queryString) {

	    // stuff after # is not part of query string, so get rid of it
	    queryString = queryString.split('#')[0];

	    // split our query string into its component parts
	    var arr = queryString.split('&');

	    for (var i = 0; i < arr.length; i++) {
	      // separate the keys and the values
	      var a = arr[i].split('=');

	      // set parameter name and value (use 'true' if empty)
	      var paramName = a[0];
	      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

	      // (optional) keep case consistent
	      //paramName = paramName.toLowerCase();
	      paramName = paramName;
	      //if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
	      if (typeof paramValue === 'string') paramValue = paramValue;

	      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
	      if (paramName.match(/\[(\d+)?\]$/)) {

	        // create key if it doesn't exist
	        var key = paramName.replace(/\[(\d+)?\]/, '');
	        if (!obj[key]) obj[key] = [];

	        // if it's an indexed array e.g. colors[2]
	        if (paramName.match(/\[\d+\]$/)) {
	          // get the index value and add the entry at the appropriate position
	          var index = /\[(\d+)\]/.exec(paramName)[1];
	          obj[key][index] = paramValue;
	        } else {
	          // otherwise add the value to the end of the array
	          obj[key].push(paramValue);
	        }
	      } else {
	        // we're dealing with a string
	        if (!obj[paramName]) {
	          // if it doesn't exist, create property
	          obj[paramName] = paramValue;
	        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
	          // if property does exist and it's a string, convert it to an array
	          obj[paramName] = [obj[paramName]];
	          obj[paramName].push(paramValue);
	        } else {
	          // otherwise add the property
	          obj[paramName].push(paramValue);
	        }
	      }
	    }
	  }

	  return obj;
	}

function isEmpty(str) {
    return (!str || 0 === str.length);
}


function getParamAndGetImageData(){
	
	var data=sessionStorage.getItem("dataJson");
	console.log("sessionData: "+data);
	
	 var dataArr = JSON.parse(data);
	 if(dataArr.length>0){
		 
		 var allMultipleLink="";
		 for(var i=0;i<dataArr.length;i++){
			 
			 var filePathplusfilename="";
			 if ( dataArr[i].hasOwnProperty("filePathplusfilename") ) {
				 filePathplusfilename=dataArr[i].filePathplusfilename;
				 console.log("filePathplusfilename: "+filePathplusfilename);
           	 }
			 var pageNo=0;
			 var pagenoNew=0;
			 if ( dataArr[i].hasOwnProperty("pageNo") ) {
				  pageNo=dataArr[i].pageNo;
				  console.log("pageNo: "+pageNo);
				   pagenoNew=pageNo+1;
				  console.log("pageNo+1: "+pagenoNew);
           	 }
			 
			 allMultipleLink= allMultipleLink+'<br>'+pagenoNew+'/'+dataArr.length+'pages<br><div id="pdfArea'+pagenoNew+'"><div id="pdfImage'+pagenoNew+'Loading" style="background: rgb(221, 221, 221); display: none;"><img src="/portal/apps/standlonesig/img/loading.gif"><br>Loading ...<br></div><div id="pdfImage'+pagenoNew+'Loaded" style=""><img class="pdfImage" id="pdfImage'+pagenoNew+'" alt="" src="'+filePathplusfilename+'" data-state="loaded" style="border: 1px solid black; width: 100%;"></div></div>';
			 
			 
		 } // for close
		 
		 document.getElementById("imageLoadId").innerHTML = allMultipleLink;
		
	 } // length check
	
	/*var url=window.location.href;
	var data=getAllUrlParams(url);
	
	console.log("otherpagejson: "+JSON.stringify(data));
	
	if ( data.hasOwnProperty("urlfile") ) {
		  var returnFileUrl=data.urlfile;
		  console.log("returnFileUrl: "+returnFileUrl.trim());
		  if( !isEmpty(returnFileUrl) ){
			  
			  $.ajax({
					
					type:'GET',
					url:'/portal/servlet/service/SigImage?returnFileUrl='+returnFileUrl,
//					async: false,
					success:function(data){
					console.log("imageData: "+data);
					
					 var dataArr = JSON.parse(data);
					 if(dataArr.length>0){
						 
						 var allMultipleLink="";
						 for(var i=0;i<dataArr.length;i++){
							 
							 var filePathplusfilename="";
							 if ( dataArr[i].hasOwnProperty("filePathplusfilename") ) {
								 filePathplusfilename=dataArr[i].filePathplusfilename;
								 console.log("filePathplusfilename: "+filePathplusfilename);
				           	 }
							 var pageNo=0;
							 var pagenoNew=0;
							 if ( dataArr[i].hasOwnProperty("pageNo") ) {
								  pageNo=dataArr[i].pageNo;
								  console.log("pageNo: "+pageNo);
								   pagenoNew=pageNo+1;
								  console.log("pageNo+1: "+pagenoNew);
				           	 }
							 
							 allMultipleLink= allMultipleLink+'<br>'+pagenoNew+'/'+dataArr.length+'pages<br><div id="pdfArea'+pagenoNew+'"><div id="pdfImage'+pagenoNew+'Loading" style="background: rgb(221, 221, 221); display: none;"><img src="/portal/apps/standlonesig/img/loading.gif"><br>Loading ...<br></div><div id="pdfImage'+pagenoNew+'Loaded" style=""><img class="pdfImage" id="pdfImage'+pagenoNew+'" alt="" src="'+filePathplusfilename+'" data-state="loaded" style="border: 1px solid black; width: 100%;"></div></div>';
							 
							 
						 } // for close
						 
						 document.getElementById("imageLoadId").innerHTML = allMultipleLink;
						 
					 } // length check
					
					
					} // ajax success close
					}); // ajax close
			  
		  } // urlFile blank check
	} // has urlFile check
	*/
	
}


/*$( document ).ready(function() {
  
	//getParamAndGetImageData();
	
});*/

function saveDataThroughServeltInDataBase(signerArr){
	
	var ExtraMainJson={};
	
	var url=window.location.href;
	var data=getAllUrlParams(url);
	
	console.log("otherpagejson: "+JSON.stringify(data));
	
	if ( data.hasOwnProperty("group") ) {
		var group=data.group;
		ExtraMainJson.group=group;
	}if ( data.hasOwnProperty("email") ) {
		var email=data.email;
		ExtraMainJson.email=email;
	}if ( data.hasOwnProperty("templateName") ) {
		var templateName=data.templateName;
		ExtraMainJson.templateName=templateName;
	}
		
		ExtraMainJson.SigPos=signerArr;
		
		var twoFactorCheckBox = document.getElementById("twofactor");
		if (twoFactorCheckBox.checked == true){
			ExtraMainJson.twoFactor="true";
		}else{
			ExtraMainJson.twoFactor="false";
		}
		
		var type = document.getElementsByName('type');
		
		for(i = 0; i < type.length; i++) { 
			
			if( type[i].checked ){
				//$('#errorTypeId').html("");
				 document.getElementById("errorTypeId").innerHTML="";
				var valueType=type[i].value;
				ExtraMainJson.type=valueType;
				console.log("valueType: "+valueType);
				
				console.log("ExtraMainJson: "+JSON.stringify(ExtraMainJson));
				
				$.ajax({
					
					    type: "POST",
					   
			            url: "/portal/servlet/service/SigImagePosDataNew",
			            async: false,
			            data : {
							'sigData' : JSON.stringify(ExtraMainJson)
						},
			            success: function (data) {
			            	console.log("sigResponse: "+data);
			            	 
			            	//document.getElementById("SuceessShowId").innerHTML = data;
			            	$('#SuceessShowId').css('color','green');
							$('#SuceessShowId').html(data);
							
							 var inputF = document.getElementById("errorTypeId");
							 inputF.disabled = false;
//							document.getElementById("errorTypeId").style.display = "none";
							$('#errorTypeId').css('display','none');
			            } // ajax success
					
				}); // ajax close
				break;
			}else{
				// give message to please select type 
				console.log("valueType_else: "+valueType);
				$('#errorTypeId').css('color','red');
				//$('#errorTypeId').html('Please select atleast one radio');
				
				 var inputF = document.getElementById("errorTypeId");
				 inputF.value = "Please select atleast one radio";
				 inputF.focus();
				 inputF.blur();
				 
				 $('#errorTypeId').css('display','block');
				 
				 inputF.disabled = true;
				// document.getElementById("errorTypeId").style.display = "block";
				 
			}
			
		} // for type close
		
}

