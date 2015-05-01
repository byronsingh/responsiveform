(function($)
{
    var $parent = null;
    var $el = null;
    var $popup = null;
    var initialized = false;
    var opt_response_width = 768;
    var opt_disable_close = false;
    var opt_viewport_selector = ".responsiveform_viewport";
    var closePopupCallbacks = [];

    var saved_scroll = 0;

    // "closed", "initial_open", open_big", "open_small", "open_animation"
    var current_popup_status = "closed";
    var is_small_screen_mode = false;

    var check_current_screen_size = function() {
        if ($(window).width() < opt_response_width) {
            is_small_screen_mode = true;
        } else {
            is_small_screen_mode = false;
        }
    };

    var calculatePopupTopPosition = function() {
        if (is_small_screen_mode) {
            return 0;
        } else {
            if ($(window).height() >= $popup.outerHeight() + 20)
                return ($(window).height() - $popup.outerHeight())/2;
            else {
                return 10;
            }
        }
    };
    var calculatePopupLeftPosition = function() {
        if (is_small_screen_mode) {
            return 0;
        } else {
            return ($(window).width() - $popup.outerWidth())/2;
        }
    };
    var calculateViewportHeight = function () {
        var bodymargin = $("body").outerHeight(true) - $("body").height();
        if (is_small_screen_mode) {
            return $popup.outerHeight() + saved_scroll - bodymargin
        } else {
            if ($(window).height() >= $popup.outerHeight() + 20) {
                return $(window).height() + saved_scroll - bodymargin;
            } else {
                return $popup.outerHeight() + 20 + saved_scroll - bodymargin;
            }
        }
    };

    var setSize = function() {
        if (current_popup_status == "closed")
            return;

        check_current_screen_size();
        
        if (is_small_screen_mode) {
            $popup.css("min-height", $(window).height());
            
            $(".respopupheader").show();
            $(".respopup .closebuttonbig").hide();
            if (opt_disable_close) {
                $(".respopupheader .closebutton").hide();
            } else {
                $(".respopupheader .closebutton").show();
            }
            current_popup_status = "open_small";
        } else {
            $popup.css("min-height", "");

            $(".respopupheader").hide();
            if (opt_disable_close) {
                $(".respopup .closebuttonbig").hide();
            } else {
                $(".respopup .closebuttonbig").show();
            }
            current_popup_status = "open_big";
        }
        $(opt_viewport_selector).css("overflow", "hidden");
        $(opt_viewport_selector).height(calculateViewportHeight());
        $popup.css("top", calculatePopupTopPosition());
        $popup.css("left", calculatePopupLeftPosition());
        $(opt_viewport_selector).css("margin-top", - saved_scroll);
        /*
        // special handling when screen changes from big to small
        if (current_popup_status == "open_big" && is_small_screen_mode) {
            adjustScreenForSmallPopup(false);
            current_popup_status = "open_small";
        }
        // special handling when screen changes from small to big
        if (current_popup_status == "open_small" && !is_small_screen_mode) {
            restoreScreenForSmallPopup();
            current_popup_status = "open_big";
            $(".respopupoverlay").show();
        }

        if (current_popup_status == "open_small") {
            $popup.css("min-height", $(window).height());
            var bodymargin = $("body").outerHeight(true) - $("body").height();
            $(opt_viewport_selector).height($popup.outerHeight() - bodymargin);
        } else if (current_popup_status == "open_big") {
            $popup.css("max-height", $(window).height() - 20);
            var bodymargin = $("body").outerHeight(true) - $("body").height();
            $(opt_viewport_selector).height($(window).height);
        }

        if (current_popup_status == "open_big") {
            $popup.css("max-height", $(window).height() - 20);
            $popup.css("top", ($(window).height() - $popup.outerHeight())/2);
            $popup.css("left", ($(window).width() - $popup.outerWidth())/2);
            $("body").css("overflow","hidden");
        } else {
            $popup.css("max-height", "");
            $popup.css("top", "");
            $popup.css("left", "");
            $("body").css("overflow","");
        }
        */
    };

    var restore_element = function() {
        $(".respopupheader").hide();
        if (!opt_disable_close)
            $(".respopup .closebuttonbig").show();

        $(opt_viewport_selector).css("overflow", "");
        $(opt_viewport_selector).css("height", "");
        $(opt_viewport_selector).css("margin-top", "");
        $popup.css("top", "");
        $popup.css("left", "");
        $popup.css("min-height", "");
        $popup.css("max-height", "");
        $(window).scrollTop(saved_scroll);
        saved_scroll = 0;

        if ($el != null) {
            $el = $el.detach();
            $parent.append($el);
            $el = null;
            $parent = null;
        }
    };

    var initialize = function() {
        $("body").prepend("<div class='respopupoverlay' style='display:none;'></div>");
        $(".respopupoverlay").click(function() {
            if (!opt_disable_close)
                closePopup();
        });

        $("body").append("<div class='respopup'><span class='closebuttonbig'>&#x2716; Close</span></div>");
        $popup = $(".respopup");

        $("body").append("<div class='respopupheader'><span class='closebutton'>&#x2716; Close</span><span class='header'>The Header</span></div>");
        $(".respopupheader .closebutton").click(function() {
            closePopup();
        });
        $(".respopup .closebuttonbig").click(function() {
            closePopup();
        });

        $(window).resize(function() {
            setSize();
        });

        // experimental feature
        $(window).on("popstate", function() {
            closePopup();
        });

        initialized = true;
    };

    var openPopup = function(target, size) {
        $(".respopupoverlay").fadeIn(600);

        $popup.show();
        $parent = target.parent();
        $el = target.detach();
        $popup.append($el);

        saved_scroll = $(window).scrollTop();

        current_popup_status = "initial_open";        
        setSize();

        $(window).scrollTop(0);

        var animateDone = function() {
            if (is_small_screen_mode)
                current_popup_status = "open_small";
            else
                current_popup_status = "open_big";
        };

        $popup.css("top", $(window).height());
        $popup.animate({ 'top': calculatePopupTopPosition()}, 600, animateDone);
        current_popup_status = "open_animation";

/*
        if (animate) {
            $popup.css("top", $(window).height());
            $popup.animate({ 'top': 0}, 300, animateDone);
            current_popup_status = "open_small_animation";
        } else {
            $popup.css("top", 0);
        }
*/
    };

    var closePopup = function() {
        if (current_popup_status == "closed")
            return

        $(".respopupoverlay").hide();
        $(".respopupheader").hide();
        restore_element();
        $popup.hide();

        current_popup_status = "closed";

        for (var i = 0; i < closePopupCallbacks.length; i++)
            closePopupCallbacks[i]();
        closePopupCallbacks = [];
    };

    $.fn.responsiveform = function(opts) {
        if (!initialized)
            initialize();
        
        closePopup();

        if (typeof opts != "undefined" && opts.response_width != null)
            opt_response_width = opts.response_width;
        else
            opt_response_width = 768;

        if (typeof opts != "undefined" && opts.header != null)
            $(".respopupheader .header").html(opts.header);
        else
            $(".respopupheader .header").html("");

        if (typeof opts != "undefined" && opts.viewport_selector != null)
            opt_viewport_selector = opts.viewport_selector;
        else
            opt_viewport_selector = ".responsiveform_viewport";

        if (typeof opts != "undefined" && opts.onClosed != null) {
            closePopupCallbacks = [];
            closePopupCallbacks.push(opts.onClosed);
        } else {
            closePopupCallbacks = [];
        }

        if (typeof opts != "undefined" && opts.popup_width != null)
            $(".respopup").css("width", opts.popup_width);
        else
            $(".respopup").css("width", opts.popup_width);

        if (typeof opts != "undefined" && opts.disable_close == true) {
            opt_disable_close = true;
            $(".respopupheader .closebutton").hide();
            $(".respopup .closebuttonbig").hide();
        } else {
            opt_disable_close = false;
            $(".respopupheader .closebutton").show();
            $(".respopup .closebuttonbig").show();
        }

        openPopup(this);

        // experimental feature
        if (history.state != null && history.state["responsiveform"] == "open") {
            history.replaceState({responsiveform:"open"}, document.title);
        } else {
            history.pushState({responsiveform:"open"}, document.title);
        }
        
    };

    $.fn.responsiveform_close = function() {
        closePopup();
    };

})(jQuery);