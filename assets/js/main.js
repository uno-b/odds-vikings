(function ($) {
	"use strict";
    jQuery(document).ready(function($){

        /* magnificPopup video view */
        $('.popup-video').magnificPopup({
            type: 'iframe'
        });

        // offcanvas menu
        $(".bar").on("click", function () {
            $(".offcanves-menu, .offcanvas-overlay").addClass("active");
        });
        $(".close, .offcanvas-overlay").on("click", function () {
            $(".offcanves-menu, .offcanvas-overlay").removeClass("active");
        });
        // One Page Nav
        var top_offset = $('.header-area').height() - 10;

        $('.main-menu nav ul').onePageNav({
            currentClass: 'active',
            scrollOffset: top_offset,
        });



    });

    //sticky header activation
    $("header.header-area").sticky({
        topSpacing: 0,
        className: "sticky"
    });



}(jQuery));	