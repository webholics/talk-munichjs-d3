var onYouTubePlayerAPIReady;

jQuery(function() {

    // YouTube iFrame API
    var tag = document.createElement('script');
    tag.src = "http://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // syntax highlighting
    jQuery("pre").addClass("cm-s-monokai").each(function() {
        var mode = jQuery(this).data("mode");
        CodeMirror.runMode(
            jQuery(this).text(), 
            mode,
            this);
    });
      
    // == TED Talk player ======================================
      
    var player;
    var player_playing = false;
    onYouTubePlayerAPIReady = function() {
        player = new YT.Player("player", {
            width: jQuery(document.body).width(),
            height: jQuery(document.body).height(),
            videoId: "fTznEIZRkLg",
            playerVars: { controls: 1, start: 390, html5: 1 }
        });
    };
    
    jQuery("#slide-ted-talk").on("show-slide", function() {
        if(player && player.playVideo && !!+Dz.params.autoplay) {
            player_playing = true;
            player.playVideo();
        }
    });
    jQuery("#slide-ted-talk").on("hide-slide", function() {
        if(player && player.pauseVideo) {
            player_playing = false;
            player.pauseVideo();
        }
    });
    jQuery("#slide-ted-talk").on("toggle-content", function() {
        if(player && player.pauseVideo) {
            if(player_playing) {
                player.pauseVideo();
            }
            else {
                player.playVideo();
            }
            player_playing = !player_playing;
        }
    });
    
    // == TED Code ======================================
    
    var ted_code_initialized = false;
    var ted_code_editor = null;
    jQuery("#slide-ted-code").on("show-slide", function() {
        if(!ted_code_initialized) {
            ted_code_initialized = true;
            ted_code_editor = CodeMirror.fromTextArea(jQuery("#slide-ted-code textarea").get(0), {
                lineNumbers: true,
                mode: "text/javascript",
                keyMap: "vim",
                theme: "monokai",
                indentUnit: 4,
                lineWrapping: true,
                onCursorActivity: function() {
                    ted_code_editor.setLineClass(hlLine, null);
                    hlLine = ted_code_editor.setLineClass(ted_code_editor.getCursor().line, "activeline");
                }
            });
            var hlLine = ted_code_editor.setLineClass(0, "activeline");
        }
    });
    jQuery("#slide-ted-code .button.solution").click(function() {
        if(ted_code_editor) {
            ted_code_editor.setValue(jQuery("#slide-ted-code div.solution").text());
        }
    });
    
    // == TED D3 Demo ======================================
    
    var global_timer;
    jQuery("#slide-ted-demo").on("show-slide", function() {
        if(ted_code_editor) {
            // yeah this is evil ;)
            eval(ted_code_editor.getValue());
        }
        /*var m = [10, 30, 40, 40],
            w = jQuery(document.body).width()-m[1]-m[3],
            h = jQuery(document.body).height()-m[0]-m[2],
            x = d3.scale.linear().range([0, w]),
            y = d3.scale.linear().range([h, 0]),
            r = d3.scale.linear().range([3, 50]);
        
        // An SVG element with a bottom-right origin.
        var svg = d3.select("#slide-ted-demo").append("svg")
            .attr("width", w+m[1]+m[3])
            .attr("height", h+m[0]+m[2])
        .append("g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
        
        var title = svg.append("text")
            .attr("class", "title")
            .attr("dy", "1em")
            .attr("dx", ".5em")
            .text("");
    
        d3.csv("data/ted.csv", function(data) {
            data.forEach(function(d) {
                d.year = +d.year;
                d.fertility = +d.fertility;
                d.mortality = +d.mortality;
            });
        
            var extent = d3.extent(data, function(d) { return +d.year; });
            var start_year = extent[0];
            var end_year = extent[1];
            
            x.domain([d3.min(data, function(d) { return +d.mortality; }), 1]);
            y.domain([0, d3.max(data, function(d) { return +d.fertility; })]);
            r.domain(d3.extent(data, function(d) { return +d.population; }));
            
            var x_axis = d3.svg.axis()
                .scale(x)
                .ticks(5)
                .tickFormat(function(d) { return Math.floor(d*100) + "%"; });
        
            var y_axis = d3.svg.axis()
                .scale(y);
            
            svg.append("g")
                .attr("class", "y axis")
                .call(y_axis.orient("left"));
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + h + ")")
                .call(x_axis.orient("bottom"));
            
            data = d3.nest()
              .key(function(d) { return d.year; })
              .map(data);
            
            var ted_demo_year = extent[0];
            var ted_demo_timer = setInterval(function() {
                var circle = svg.selectAll("circle")
                    .data(data[ted_demo_year], function(d) { return d.country });
                    
                circle.enter().append("circle")
                    .attr("cx", function(d) { return x(d.mortality); })
                    .attr("cy", function(d) { return y(d.fertility); })
                    .attr("r", function(d) { return r(d.population); })
                    .style("opacity", 1e-6);
                    
                circle.transition()
                    .duration(500)
                    .ease("linear")
                    .style("opacity", 1)
                    .attr("cx", function(d) { return x(d.mortality); })
                    .attr("cy", function(d) { return y(d.fertility); })
                    .attr("r", function(d) { return r(d.population); });
                    
                title.text(ted_demo_year);
                    
                ted_demo_year++;
                if(ted_demo_year > end_year) {
                    clearInterval(ted_demo_timer);
                }
            }, 500);
        });*/
    });
    jQuery("#slide-ted-demo").on("hide-slide", function() {
        jQuery("svg", this).remove();
        clearInterval(global_timer);
    });
    
    // == Slides with class iframe ======================================
    
    jQuery("section.iframe").on("show-slide", function() {
        jQuery(this).html('<iframe src="' + jQuery(this).data("href") + '" frameborder="0" scrolling="no"></iframe>');
    });
    jQuery("section.iframe").on("hide-slide", function() {
        jQuery(this).empty();
    });
    
    // == DzSlides Extension ======================================
    
    // hook in to some Dz functions
    Dz._setSlide = Dz.setSlide;
    Dz.setSlide = function(aIdx) {
        // send custom events
        jQuery("section[aria-selected]").trigger("hide-slide");
        Dz._setSlide(aIdx);
        jQuery("section[aria-selected]").trigger("show-slide");
    };
    
    Dz._toggleContent = Dz.toggleContent;
    Dz.toggleContent = function() {
        Dz._toggleContent();
        
        // send custom events
        jQuery("section[aria-selected]").trigger("toggle-content");
    };
    
    // prevent key events when focus is on a textarea
    window.onkeydown = function(e) {
        if(!document.activeElement || document.activeElement.nodeName !== "TEXTAREA") {
            return Dz.onkeydown(e);
        }
    };
    
    // this bindings gets lost somewhere (some kind of weird chrome bug)
    setTimeout(function() {
        window.onresize = Dz.onresize;
    }, 1000);
});