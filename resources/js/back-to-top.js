$(document).ready(function() {
    //var targetOffset = $('#back-to-top').offset().top;
    
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut();
        }
    });
    $('.back-to-top').click(function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 1000);
    });
});