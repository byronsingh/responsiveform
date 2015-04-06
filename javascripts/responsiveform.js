(function($)
{
    var $parent = null;
    var $el = null;
    var $popup = null;
    var initialized = false;
    var opt_response_width = 768;
    var opt_viewport_selector = ".responsiveform_viewport";

    var saved_scroll = 0;

    // "closed", "open_big", "open_small", "open_small_animation"
    var current_popup_status = "closed";
    var is_small_screen_mode = false;

    var check_current_screen_size = function() {
        if ($(window).width() < opt_response_width) {
            is_small_screen_mode = true;
        } else {
            is_small_screen_mode = false;
        }
    };

    var setSize = function() {
        check_current_screen_size();

        // special handling when screen changes from big to small
        if (current_popup_status == "open_big" && is_small_screen_mode) {
            adjustScreenForSmallPopup(false);
            current_popup_status = "open_small";
        }
        // special handling when screen changes from small to big
        if (current_popup_status == "open_small" && !is_small_screen_mode) {
            restoreScreenForSmallPopup();
            current_popup_status = "open_big";
        }

        if (current_popup_status == "open_small") {
            $popup.css("min-height", $(window).height());
            var bodymargin = $("body").outerHeight(true) - $("body").height();
            $(opt_viewport_selector).height($popup.outerHeight() - bodymargin);
        }
    };

    var restore_element = function() {
        if ($el != null) {
            $el = $el.detach();
            $parent.append($el);
            $el = null;
            $parent = null;
        }
    };

    var initialize = function() {
        $("body").prepend("<div class='respopupoverlay'></div>");
        $(".respopupoverlay").click(function() {
            closePopup();
        });

        $("body").append("<div class='respopup'></div>");
        $popup = $(".respopup");

        $("body").append("<div class='respopupheader'><span class='closebutton'>Close</span><span class='header'>The Header</span></div>");
        $(".respopupheader .closebutton").click(function() {
            closePopup();
        });

        $(window).resize(function() {
            setSize();
        });

        initialized = true;
    };

    var openPopup = function(target) {
        $(".respopupoverlay").show();

        $popup.show();
        $parent = target.parent();
        $el = target.detach();
        $popup.append($el);

        current_popup_status = "open_big";
    };

    var closePopup = function() {
        if (current_popup_status == "open_small") {
            restoreScreenForSmallPopup();
        }
        
        $(".respopupoverlay").hide();
        $(".respopupheader").hide();
        restore_element();
        $popup.hide();

        current_popup_status = "closed";
    };

    var restoreScreenForSmallPopup = function() {
        $(".respopupheader").hide();
//        $(opt_viewport_selector).css("margin-top", "");
        $(opt_viewport_selector).css("overflow", "");
        $(opt_viewport_selector).css("height", "");
        $popup.css("top", "");
        $popup.css("min-height", "");
        $(window).scrollTop(saved_scroll);
        saved_scroll = 0;
    };
    var adjustScreenForSmallPopup = function(animate) {
        saved_scroll = $(window).scrollTop();

        var adjustViewport = function() {
            $popup.css("top", 0);
            $(window).scrollTop(0);
            var bodymargin = $("body").outerHeight(true) - $("body").height();
            $(opt_viewport_selector).height($popup.outerHeight() - bodymargin);
            $(opt_viewport_selector).css("overflow", "hidden");
            $(".respopupheader").show();
            current_popup_status = "open_small";
        };

        $popup.css("min-height", $(window).height());
        if (animate) {
            $popup.css("top", saved_scroll + $(window).height());
            $popup.animate({ 'top': saved_scroll}, 300, adjustViewport);
            current_popup_status = "open_small_animation";
        } else {
            adjustViewport();
        }

/*
        $("#responsiveform_viewport").css("margin-top", - saved_scroll);
        $("#responsiveform_viewport").css("overflow", "hidden");

        $popup.css("min-height", $(window).height());
        var bodymargin = $("body").outerHeight(true) - $("body").height();
        $("#responsiveform_viewport").height($popup.outerHeight() + saved_scroll - bodymargin);

        $(window).scrollTop(0);

        if (animate) {
            $popup.css("top", saved_scroll + $(window).height());
            $popup.animate({ 'top': 0}, 300);
        } else {
            $popup.css("top", 0);
        }
*/
    };

    var openPopupSmall = function(target) {
        openPopup(target);
        adjustScreenForSmallPopup(true);
        //current_popup_status = "open_small";
    };

    $.fn.responsiveform = function(opts) {
        if (!initialized)
            initialize();

        if (typeof opts != "undefined") {
            if (opts.response_width != null)
                opt_response_width = opts.response_width;
            if (opts.header != null)
                $(".respopupheader .header").html(opts.header);
            if (opts.viewport_selector != null)
                opt_viewport_selector = opts.viewport_selector;
        }

        check_current_screen_size();

        if (is_small_screen_mode)
            openPopupSmall(this);
        else
            openPopup(this);

        setSize();
    };

    $.fn.responsiveform_close = function() {
        closePopup();
    };

})(jQuery);