$(function() {
    'use strict';

    // Cache the page
    var $page = $('html, body');

    // Set the speed of the assisted page scroll
    var pageScrollSpeed = 500;

    // Focus state for append/prepend inputs
    $('.form-control-group').on('focus', '.form-control', function () {
        $(this).closest('.form-control-group').addClass('focus');
    }).on('blur', '.form-control', function () {
        $(this).closest('.form-control-group').removeClass('focus');
    });

    var pageScrollTo = function (target) {
        target = target > 0 ? target : target.offset().top;
        $page.animate({ 'scrollTop': target }, pageScrollSpeed);
    };

    // CLICK EVENTS ------------------------------------------------------------

    $('.menu-item').on('click', function (event) {
        var $this = $(this);
        var destination = $this.attr('href');

        pageScrollTo($(destination));

        event.preventDefault();

        $('.menu-item').removeClass('active');
        $this.addClass('active');
    });
});
