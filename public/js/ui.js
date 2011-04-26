$(function() {
    $('#panel>div').buttonset();

    $('.slider').bind('slidecreate', function(e, ui) {
        $(this).slider('option', 'min', parseInt($(this).attr('data-min')));
        $(this).slider('option', 'max', parseInt($(this).attr('data-max')));
        $(this).slider('option', 'step', parseInt($(this).attr('data-step')));
        $(this).slider('option', 'value', parseInt($(this).attr('data-value')));
    }).slider();

    $('#panel').hover(function() {
        $(this).fadeTo(250, 1);
    }, function() {
        $(this).fadeTo(250, 0.25);
    });
});