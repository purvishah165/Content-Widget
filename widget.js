(function(window, document) {
    "use strict";

    var jQuery, $; // Localize jQuery variables

    function loadScript(url, callback) {
        /* Load script from url and calls callback once it's loaded */
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute("type", "text/javascript");
        scriptTag.setAttribute("src", url);
        if (typeof callback !== "undefined") {
            if (scriptTag.readyState) {
                /* For old versions of IE */
                scriptTag.onreadystatechange = function () {
                    if (this.readyState === 'complete' || this.readyState === 'loaded') {
                        callback();
                    }
                };
            } else {
                scriptTag.onload = callback;
            }
        }
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
    }

    function main() {
        /* The main logic of our widget */
        var widget = $('#widget'),
            wrapperTemplate = '<div class="content-wrapper">' +
                '<div class="title"></div>' +
                '<div class="content">' +
                '</div>' +
                '<div class="buttons">' +
                '<button class="previous">Previous</button>' +
                '<button class="next">Next</button>' +
                '</div>' +
                '</div>';

        widget.append(wrapperTemplate);

        var contentTemplate = '<div class="content">' +
                '<div class="left-column">' +
                '<img class="thumbnail" src="http://placehold.it/50x50" >' +
                '</div>' +
                '<div class="right-column">' +
                '<div class="title-wrapper"><span class="content-title"></span></div>' +
                '<div class="description-wrapper"><span class="content-description"></span></div>' +
                '</div>' +
                '</div>',
            title = $('.title'),
        // the previous button
            previousBtn = widget.find('.previous'),
        // the next button
            nextBtn = widget.find('.next'),
            dataJSON,
            counter = 0,
            itemsCount = 0,
        // Create alerts elements (Display Success or Failure)
            alerts = {
                requestEmpty : $('<div class="error">No data</div>'),
                requestFailure : $('<div class="error">Could not get the data. Try again!</div>')
            };

        function contentHandler(content){
            // insert childrens at the end of the content element
            // Clone the content template
            var $content = $(contentTemplate).clone();
            if (content.thumbnail) {
                $content.find('img').attr('src', content.thumbnail);
            } else {
                $content.find('img').remove();
            }
            $content.find('.content-title').html(content.title);
            $content.find('.content-description').html(content.description);
            $('.content').replaceWith($content);
        }

        $.getJSON("content.json").done(function success (data) {
            if (data && data.content){
                dataJSON = data;
                itemsCount = dataJSON.content.length;
                title.html(dataJSON.title);
                //Initialise the content
                contentHandler(dataJSON.content[counter]);
            } else {
                $('.content').append(alerts.requestEmpty);
                nextBtn.remove();
                previousBtn.remove();
                title.remove();
            }
        }).fail(function error () {
            $('.content').append(alerts.requestFailure);
            nextBtn.remove();
            previousBtn.remove();
            title.remove();
        });

        // add the click event to the buttons
        previousBtn.click(function(){
            if (counter === 0) {
                counter = itemsCount;
            }
            contentHandler(dataJSON.content[--counter])
        });
        nextBtn.click(function(){
            if (counter === itemsCount - 1) {
                counter = -1;
            }
            contentHandler(dataJSON.content[++counter]);
        });
    }

    function includeCSS () {
        var css_link = $('<link>',{
            rel: 'stylesheet',
            type: 'text/css',
            href: 'widget.css'
        });
        css_link.appendTo('head');
    }

    /* Load jQuery */
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js", function() {
        /* Restore $ and window.jQuery to their previous values and store the
         new jQuery in our local jQuery variables. */
        $ = jQuery = window.jQuery.noConflict(true);
        //Add CSS to the head.
        includeCSS();
        main(); /* Execute the main logic of our widget once jQuery is loaded */
    });
})(window, document);