$(function() {
    $('#button-edit')
        .button({text: false, icons: {primary: 'ui-icon-wrench'}})
        .click(function() {
            $('#panel').toggle('blind', {direction: 'horizontal'}, 250);
        });

    $('#panel>div').buttonset();

    $('#panel').hide();    
});