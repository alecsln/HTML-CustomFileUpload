function InitCustomFileUpload() {
    $('.file').each(function() {
        var $input = $(this),
            $customInput = $input.next('.file-upload').find('.file-upload-control'),
            $fileName = $input.next('.file-upload').find('.file-upload-name'),
            labelVal = $customInput.html(),
            inputId = $input.attr('id'),
            newInputId = inputId.replace('ful', 'lbl'),
            $fileNameServer = $('#' + newInputId).html();
        $('#' + newInputId).hide();
        if ($fileNameServer) {
            $($fileName).html($fileNameServer);
        }
        $input.on('change', function(e) {
            var fileName = '';
            if (this.files && this.files.length > 1)
                fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
            else if (e.target.value)
                fileName = e.target.value.split('\\').pop();

            if (fileName) {
                fileName = ShortenFileName.truncation(fileName, $fileName);
                $($fileName).html(fileName);
                $($fileName).attr({ 'title': fileName });
            } else if ($fileNameServer) {
                $fileNameServer = ShortenFileName.truncation($fileNameServer, $fileName);
                $($fileName).html($fileNameServer);
                $($fileName).attr({ 'title': $fileNameServer });
            } else {
                $($fileName).html('No file chosen');
                $($fileName).attr({ 'title': 'No file chosen' });
            }
        });

        // Firefox fix
        $input
            .on('focus', function () { $input.addClass('has-focus'); })
            .on('blur', function () { $input.removeClass('has-focus'); });
    });
}

// Text excision for generating middle ellipsis values to fit a specific size.

var ShortenFileName = function() {
    var cutMiddleChar = function (input) {
        var charPosition = Math.floor(input.length / 2);
        return input.substr(0, charPosition) + input.substr(charPosition + 1);
    };
    var insertMiddleEllipsis = function (input) {
        var charPosition = Math.floor(input.length / 2);
        return input.substr(0, charPosition) + '...' + input.substr(charPosition);
    };
    var truncation = function(inputText, inputElement) {
        var w = 0,
            t = '',
            $test = $('#shorten-test');

        var $this = $(inputElement);
        $test.text(inputText);
        // get current width, this is the width we need to fit the value to
        w = 300;
        // get current text value, we'll be manipulating this till it's sized right
        t = inputText;
        // set our test div to the value (plus our ellipsis) for sizing
        $test.text(t + '...');
        console.log(w);
        console.log($($test).width());
        // when the value's width is greater than the width of the container loop through to size it down
        if ($test.width() > w) {
            while ($test.width() > w) {
                t = cutMiddleChar(t);
                //console.log('str cut: ' + t);
                $test.text(t + '...');
                //console.log('str len: ' + t.length);
                //console.log('width:   ' + $test.width());
            }
            t = insertMiddleEllipsis(t);
        }
        return t;
    }

    return {
        truncation: truncation
    };
}();
$(document).ready(function () {
    InitCustomFileUpload();
    $('input[type=file]').keydown(function (event) {
        var inputId = $(this).attr('id'),
            newInputId = inputId.replace('ful', 'lbl'),
            $fileName = $(this).next('.file-upload').find('.file-upload-name'),
            $fileNameServer = $('#' + newInputId).html();
        // delete file on backspace/delete keydown
        if (event.which === 8 || event.which === 46) {
            // conditional statement for IE 8-10, replace the input by another clone to remove file safely
            if ($.browser.msie) {
                $(this).replaceWith($(this).clone(true));
            } else {
                $(this).val('');
            }
            if ($(this).hasClass('required')) {
                $(this).removeClass("required");
                $(this).next('.file-upload').removeClass("file-required");
            }
            if ($fileNameServer) {
                $fileNameServer = ShortenFileName.truncation($fileNameServer, $fileName);
                $(this).next('.file-upload').find('.file-upload-name').html($fileNameServer);
            } else {
                $(this).next('.file-upload').find('.file-upload-name').html('No file chosen');
            }
        }
    });
    $("html.no-js").removeClass("no-js").addClass("js");
});