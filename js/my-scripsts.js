/*
 * Important Advice:
 * jQuery event aliases like '.load', '.unload' or '.error' deprecated since jQuery 1.8
 * Replace these aliases with '.on()' to register listeners instead.
 */

//- js initiation:
$(document).ready(function(){

    //- for a MODAL (dialogs) triggers:
    $('.modal-trigger').leanModal();

    //- for a COLLAPSE MOBILE NAV:
    $(".button-collapse").sideNav();

    //- for a DROPDOWNS:
    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        // hover: true,  Activate on hover
        gutter: 200, // Spacing from edge
        belowOrigin: false // Displays dropdown below the button
    });

    //- for TABS:
    $('ul.tabs').tabs();

    //- (custom js) script to set current Year in (common) Footer
    $(function () {
        $(".js-current-year").html(new Date().getFullYear());
    });

    //- (top) Header Shrink when user scrolls down
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 100) {
            $(".navbar-top").addClass("js-thinny-nav");
        } else {
            $(".navbar-top").removeClass("js-thinny-nav");
        }
    });
});

//- for Load the Main Nav (external HTML):
$(window).on(function() {
    // alert("Esta cargada la web, sí");
    $("#navbar").on("navbar.html");
    // Añadir y quitar clase ".active" en links de main nav bar:
    $(".navbar-link").click(function(){
        $(this).toggleClass("active");
    });
});

'use strict';
// Abandon all hope ye who enter here
$(document).ready(function() {

    var navigating = false,
        curPage = 1,
        pages = $(".section").length,
        $sections = $(".sections"),
        $paginationPage = $(".pagination .page"),
        $paginationTotal = $(".total-pages"),
        $textStuff = $(".section-heading, .additional-text");

    if (pages >= 10) {
        $paginationTotal.text(pages);
    } else {
        $paginationTotal.text("0" + pages);
    }

    /*
     Sets random transition-delay for blocks between 0.4 and 1.2 seconds on every call
     */
    function randomDelay() {
        $(".left-part").css("transition-delay", (Math.floor(Math.random() * 9) + 4)/10 + "s");
        for (var i = 1; i <= pages; i++) {
            $(".bg-part:nth-child("+i+")").css("transition-delay", (Math.floor(Math.random() * 9) + 4)/10 + "s");
        }
    }

    /* Async hell, with hardcoded numbers.
     On production, 410 number must be .section-heading transform transition time in miliseconds + 10, but i'm sort of tired of this demo :D
     */
    function timeoutNav(t) {
        var time = t || 2000;
        $textStuff.addClass("not-visible");
        setTimeout(function() {
            navigating = false;
            randomDelay();
        }, time);
        setTimeout(function() {
            // cached selector not working because of newely created clone when moving up more then 2 positions
            $(".section-heading, .additional-text").css({"margin-top": 0 - (parseInt($(".nav-elem.active").attr("data-page")) - 1) * 100 + "vh"}).hide();
        }, 410);
        setTimeout(function() {
            $textStuff.show();
            $textStuff.css("top");
            $textStuff.removeClass("not-visible");
        }, time + 10);
    }

    function magicStuff(paramPage) {
        if (paramPage) curPage = paramPage;
        navigating = true;
        var calculatedMargin = 0 - (curPage - 1) * 100;
        $(".bg-part, .left-part").css("margin-top", calculatedMargin +"vh");
        $(".scroll-down").addClass("removed");
        if (parseInt($(".nav-elem.active").attr("data-page")) === 1) {
            $(".scroll-down").removeClass("removed");
        }
    }

    function trickyStuff(page) {
        $(".left-part, .bg-part").css({"transition-duration": "0s", "transition-delay": "0s"});
        $(".main").css("top");
        magicStuff(page);
        $(".main").css("top");
        $(".left-part, .bg-part").css("transition-duration", "0.8s");
        randomDelay();
    }

    function pagination(pg) {
        $(".nav-elem").removeClass("active");
        $(".nav-" + pg).addClass("active");
        curPage = pg;

        if (pages >= 10) {
            $paginationPage.text(pg);
        } else {
            $paginationPage.text("0" + pg);
        }
    }

    function navigateUp() {
        if (curPage > 1) {
            curPage--;
            pagination(curPage);
            magicStuff();
            timeoutNav();
        }
    }

    function navigateDown() {
        if (curPage < pages) {
            curPage++;
            pagination(curPage);
            magicStuff();
            timeoutNav();
        }
    }

    $(document).on("mousewheel DOMMouseScroll", function(e) {
        if (!navigating) {
            if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                navigateUp();
            } else {
                navigateDown();
            }
        }
    });

    $(document).on("mousewheel DOMMouseScroll",
        ".sidebar-hover, .sidebar-real",
        function(e) {
            e.stopPropagation();
        });

    var sidebarScroll = 0,
        $navEl =  $(".nav-elem"),
        $sidebar = $(".sidebar-real"),
        maxScroll = $navEl.length * $navEl.height() - $(window).height();

    $(document).on("mousewheel DOMMouseScroll", ".sidebar-real", function(e) {
        if (navigating) return;
        if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
            if (!sidebarScroll) return;
            sidebarScroll += 100;
            if (sidebarScroll > 0) sidebarScroll = 0;
        } else {
            if (Math.abs(sidebarScroll) === maxScroll) return;
            sidebarScroll -= 100;
            if (Math.abs(sidebarScroll) > maxScroll) sidebarScroll = 0 - maxScroll;
        }
        $sidebar.css("transform", "translateY("+ sidebarScroll +"px)");
    });

    $(document).on("click", ".nav-elem:not(.active)", function() {
        if (navigating) return;
        var activePage = parseInt($(".nav-elem.active").attr("data-page"), 10),
            futurePage = $(this).attr("data-page");

        pagination(futurePage);

        if (Math.abs(activePage - futurePage) > 2) {
            var $fakePage = $(".section-" + futurePage).clone(),
                $currentPage = $(".section-" + activePage),
                fakeNumber = 0;
            // ugly code, do not enter here
            if (activePage < futurePage) {
                // moving down
                $currentPage.after($fakePage);
                fakeNumber = activePage + 1;
                $(".main").css("top");
                randomDelay();
                magicStuff(fakeNumber);
            } else {
                // moving up (real hell)
                $currentPage.before($fakePage);
                fakeNumber = activePage - 1;
                trickyStuff(activePage + 1);
                $(".main").css("top");
                randomDelay();
                $(".main").css("top");
                magicStuff(activePage);
            }
            timeoutNav(2050);
            setTimeout(function() {
                $fakePage.remove();
                trickyStuff(futurePage);
            }, 2000);
        } else {
            magicStuff(futurePage);
            timeoutNav();
        }
    });

    $(window).resize(function() {
        maxScroll = $navEl.length * $navEl.height() - $(window).height();
        $sidebar.css("transform", "translateY(0)");
    });

});