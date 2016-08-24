var data, curtype, curlength, curauthor, curpiece, max;

$(document).ready(function() {
	if ($('#request').length == 0) {
		return;
	}

	max = {
		'letters' 	: 5000,
		'words' 	: 500,
		'paras'		: 10,
		'htmlp'		: 10,
		'htmlh'		: 20
	}

	curtype = 'words';
	curlength = max[curtype];
	$('#' + curtype).addClass('current-type');

	$.ajax({
		url: 'data/fetch-data.php',
		type: 'post',
		data: {
			'action': 	'fillin'
		},
		dataType: 'json',
		cache: false,
		success: function(response) {
			data = response;
			Object.keys(data).forEach(function(key) {
				$('#author').append('<li data-author-id="' + key + '">' + data[key]['name'] + '</li>');
			});
			var num = Math.floor(Math.random() * ($('#author li').length));
			$('#author').find('li').eq(num).addClass('active');
			curauthor = $('#author').find('li').eq(num).attr('data-author-id');
			Object.keys(data[curauthor]['pieces']).forEach(function(index) {
				$('#piece').append('<li data-piece-id="' + index + '">' + data[curauthor]['pieces'][index]['title'] + '</li>');		
			});

			if ($('#piece li').length == 1) {
				$('#piece').addClass('oneChild');
			} else {
				$('#piece').removeClass('oneChild');
			}

			num = Math.floor(Math.random() * ($('#piece li').length));
			$('#piece').find('li').eq(num).addClass('active');
			curpiece = $('#piece').find('li').eq(num).attr('data-piece-id');
			$('#piece li[data-piece-id="' + curpiece + '"]').addClass('active');
			cut();

			$('#author li').bind('click', function() {
				if (curauthor !== $(this).attr('data-author-id')) {
					toggleOpen($('#author'));
					curauthor = $(this).attr('data-author-id');
					switchAuthor();
				} else {
					if (!$('#author').hasClass('open') && $('#author li').length > 1) {
						toggleOpen($('#author'));
					} else {
						toggleOpen($('.open'));
					}
				}
    		});

    		$('#piece li').bind('click', function() {
    			if (curpiece !== $(this).attr('data-piece-id')) {
    				toggleOpen($('#piece'));
    				curpiece = $(this).attr('data-piece-id');
    				switchPiece();
    			} else {
    				if (!$('#piece').hasClass('open') && $('#piece li').length > 1) {
						toggleOpen($('#piece'));
					} else {
						toggleOpen($('.open'));
					}
				}
    		});
		}
    });

    $('#author, #piece').click(function(e) {
    	if (e.target !== this)
    		return;
    	var attr = $(this).attr('class');
    	var open = (typeof attr === undefined || attr === 'open') ? '' : 'open';
    	toggleOpen($(this), open);
	});

	 $('body').click(function(e) {
    	if (e.target !== $('#author, #piece') && ($('#author, #piece').parent().has(e.target).length == 0)) {
    		toggleOpen($('.open'));
    	}
	});


	$('#shuffle').click(function() { randomize(); });
	$('#refresh').click(function() { switchPiece(); });
	$('#letters').click(function() { changeType('letters'); });
	$('#words').click(function() { changeType('words'); });
	$('#paras').click(function() { changeType('paras'); });
	$('#htmlp').click(function() { changeType('htmlp'); });
	$('#htmlh').click(function() { changeType('htmlh'); });
	$('#amount-bar, #disclaimer').click(function() { copySnippet(); });


	$('#amount-bar').on("swipe touchmove mousemove", function(e) {
		changeSnippetSize(e.pageX - $(this).offset().left);
	});

	$('#min-amount').on('click mousemove', function(e) {
		$('#amount-current-bar').css('width', '0%');
   		$('#amount-current-value').html(1);
   		curlength = 1;
   		cut();
	});

	$('#max-amount').on('click mousemove', function(e) {
		$('#amount-current-bar').css('width', '100%');
   		$('#amount-current-value').html(max[curtype]);
   		curlength = max[curtype];
   		cut();
	});

	realignCopylink();
});


function changeSnippetSize(xpos) {
	var num, maximum, percent, amount;

	maximum = $('#max-amount').html();
	percent = xpos / $('#amount-bar').outerWidth();
	amount = Math.ceil(percent * maximum);
	if (amount < 1) amount = 1;

	$('#amount-current-bar').css('width', percent * 100 + '%');
	$('#amount-current-value').html(amount);
	curlength = amount;
	cut();
}

function changeType(type) {
	if (curtype !== type) {
		var num = Math.floor(parseInt($('#amount-current-bar').css('width')) / parseInt($('#amount-bar').css('width')) * max[type]);
		if (num == 0) num = 1;
		if ($('#amount-current-value').html() == max[curtype]) num = max[type];

		$('#max-amount').html(max[type]);
   		$('#amount-current-value').html(num);
   		$('.current-type').removeClass('current-type');
   		$('#piece li[data-piece-id="' + type + '"]').addClass('current-type');
   		curtype = type;
   		curlength = num;
		cut();
	}
}

function cut() {
	var str = data[curauthor]['pieces'][curpiece]['snippet'];
	var chapter = (undefined !== data[curauthor]['pieces'][curpiece]['chapter']) ? data[curauthor]['pieces'][curpiece]['chapter'] : '';
	switch (curtype) {
		case "words":
			str = str.split(/\s+/).slice(0, curlength).join(" ");
			break;
		case "letters":
			str = str.substr(0, curlength);
			break;
		case "paras":
			str = getParags(str, curlength, curtype);
			break;
		case "htmlp":
			str = getParags(str, curlength, curtype);
			break;
		case "htmlh":
			str = str.split('.');
			str = '<h1>' + str.slice(0, curlength).map(Function.prototype.call, String.prototype.trim).join(".</h1>\n\n<h1>") + '.</h1>';
			break;
		default:
			break;
	}

	$('#result-text').html(str);

	$('.result-text').remove();
    hiddenDiv = $(document.createElement('div')),
  	hiddenDiv.addClass('result-text');
  	$('#result').append(hiddenDiv);
    content = $('#result-text').val().replace(/\n/g, '<br>');
    hiddenDiv.html(content + '<br class="lbr">');
    $('#result-text').css('height', parseInt(hiddenDiv.height()) + 'px');

    $('#footer-middle').html(chapter);
}

function randomize() {
 	var num, author, found;
 	found = false;

 	while (found == false) {
 		num = Math.floor(Math.random() * ($('#author').find('li').length));
 		author = $('#author').find('li').eq(num).attr('data-author-id');
 		if (author != curauthor) {
 			found = true;
 		}
 	}

 	curauthor = author;
 	$('#author li.active').removeClass('active');
 	$('#author li[data-author-id="' + curauthor + '"]').addClass('active');
	updatePieces();
}

function updatePieces() {
 	$('#piece').empty();
 	Object.keys(data[curauthor]['pieces']).forEach(function(index) {
		$('#piece').append('<li data-piece-id="' + index + '">' + data[curauthor]['pieces'][index]['title'] + '</li>');		
	});

	if ($('#piece li').length == 1) {
		$('#piece').addClass('oneChild');
	} else {
		$('#piece').removeClass('oneChild');
	}

	$('#piece li').bind('click', function() {
		if (curpiece !== $(this).attr('data-piece-id')) {
			toggleOpen($('#piece'));
			curpiece = $(this).attr('data-piece-id');
			switchPiece();
		} else {
			if (!$('#piece').hasClass('open') && $('#piece li').length > 1) {
				toggleOpen($('#piece'));
			} else {
				toggleOpen($('.open'));
			}
		}
    });


    var num = Math.floor(Math.random() * ($('#piece li').length));
	$('#piece').find('li').eq(num).addClass('active');
	curpiece = $('#piece').find('li').eq(num).attr('data-piece-id');
	$('#piece li[data-piece-id="' + curpiece + '"]').addClass('active');

	$.ajax({
		url: 'data/fetch-data.php',
		type: 'post',
		data: {
			'action': 	'fillin'
		},
		dataType: 'json',
		cache: false,
		success: function(response) {
			data = response;
			cut();
		}
    });
}

function switchAuthor() {
	toggleOpen($('.open'));
	$('#author .active').removeClass('active');
	$('#author li[data-author-id="' + curauthor + '"]').addClass('active');
	updatePieces();
}

function switchPiece() {
	toggleOpen($('.open'));
    $('#piece .active').removeClass('active');
    $('#piece li[data-piece-id="' + curpiece + '"]').addClass('active');

	$.ajax({
		url: 'data/fetch-data.php',
		type: 'post',
		data: {
			'action': 	'updatesnippet',
			'author': 	curauthor,
			'piece': 	data[curauthor]['pieces'][curpiece]['title']
		},
		dataType: 'json',
		cache: false,
		success: function(response) {
			if (response === Object(response)) {
				data[curauthor]['pieces'][curpiece]['snippet'] = response[0];
				data[curauthor]['pieces'][curpiece]['chapter'] = response[1];
			} else {
				data[curauthor]['pieces'][curpiece]['snippet'] = response;
    		}
    		cut();
		}
    }); 
}

function toggleOpen(elem, state) {
	if (elem.hasClass('open')) {
		elem.animate({
			height: '30px'
		}, 200, function() {
			elem.removeClass('open');
		});
	} else {
		var height = elem.css('height', 'auto').height();
		$('.open').not(elem).animate({
			height: '30px'
		}, 400, function() {
			$(this).removeClass('open');
		});

		elem.css('height', '30px');
		elem.addClass('open');
		elem.animate({
			height: height
		}, 200, function() {		
			elem.css('height', 'auto');
		});
	}
}

function copySnippet() {
	var text = $('#result-text');
	if (text && text.select) {
		text.select();
      	try {
        	document.execCommand('copy');
        	text.blur();
        	$('#copied').fadeIn(200, function() {
        		setTimeout(function() {
        			$('#copied span').fadeOut(600, function() {
        				$('#copied').fadeOut(200, function() {
        					$('#copied span').css('display', 'inline');
        				});
        			});
        		}, 1000);
        	})
      	}
      	catch (err) {
      	}
  	}
}


function getParags(str, length, type) {
	var sentences, otag, ctag, num, newstr;
    str = str.split(/([.?!])\s*(?=[A-Z])/g);
    sentences = new Array();
    for (i = 0; i < str.length; i = i+2) {
    	sentences.push((i + 1 < str.length) ? (str[i] + str[i+1] + ' ') : (str[i] + ' '));
    }
    num = max[type];

    if (type == 'htmlp') {
    	otag = '<p>';
    	ctag = '</p>';
    } else {
    	otag = '';
    	ctag = '';
    }

	if (num > 1) {
    	var count, output, i, size;
	    count = sentences.length;
    	output = [];
	    i = 0;
    	size;

    	if (count % num === 0) {
        	size = Math.floor(count / num);
	        while (i < count) {
    	        output.push(sentences.slice(i, i += size).join(''));
        	}
	    } else {
    	    while (i < count) {
        	    size = Math.ceil((count - i) / num--);
            	output.push(sentences.slice(i, i += size).join(''));
	        }
    	}
    	return otag + output.slice(0, length).join(ctag + "\n\n" + otag) + ctag;
	} else {
		return otag + sentences.toString() + ctag;
	}
}


function realignCopylink() {
  	try {
  		document.createEvent("TouchEvent");
  		var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  		var disc = $('#disclaimer');
  		if (!iOS) {
  			disc.detach();
			$('#amount').addClass('mobile').append(disc);
		} else {
			disc.remove();
		}
	}
  	catch (e) {
  		return false;
  	}
}

