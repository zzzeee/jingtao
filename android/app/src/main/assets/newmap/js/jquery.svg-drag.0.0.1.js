;(function ( $, w, d, undefined ) { 
  
    var pluginName = 'dargBar' //관습적으로 플러그인 이름과 기본옵션이 존재.
    
    , methods = ['setPosition'] 
    , defaults = { 
        btn_r: 6 
        ,btn_area: 20
        ,btn_color: '#4A4A4A'
        ,bar_color: '#4A4A4A'
    }
    ,thisObj = null; 
  
    function QNickPlugin(element, options ) { 
        this.element = element; 
  
        this.options = $.extend({}, defaults, options); 
        this._defaults = defaults;  
        this._name = pluginName; 
        this.isDragging = 0; 
        this.barWidth = 0; 
        this.btnBar = null; 
        thisObj = this;
        this.init();
    } 
     QNickPlugin.prototype = {
        init : function(){
            //生成缩放控制器
            var el = this.element
            ,o = this.options
            ,svg_bar = Snap(el)
            ,box_width = $(el).width()
            ,box_height = $(el).height()

            ,btn_bar = svg_bar.paper.g()
            ,btn_circle = svg_bar.paper.circle(o.btn_r, box_height/2, o.btn_r)
                .attr({
                    fill:o.btn_color
                })
            ,btn_circle_area = svg_bar.paper.rect(-o.btn_area, 0, (o.btn_area+o.btn_r)*2, box_height, 0).attr({'opacity':0})
            ,bar_bg = svg_bar.paper.line(o.btn_r,box_height/2,box_width-o.btn_r,box_height/2).attr({
                stroke: o.bar_color,
                strokeWidth: 1 
            });

            this.barWidth = box_width-o.btn_r*2;

            btn_bar.add(btn_circle_area);
            btn_bar.add(btn_circle);

            this.btnBar = btn_bar;

            var btn_info = btn_bar.getBBox();

            btn_bar.drag(function(dx,dy,x,y){   //move Event
                var m = new Snap.Matrix();
                var mx = btn_info.cx-o.btn_r+dx;
                if(0 > mx){
                    mx = 0;
                }else if(mx > thisObj.barWidth){
                    mx = thisObj.barWidth;
                }
                m.add(1,0,0,1,mx,0);
                btn_bar.transform(m);
                $(el).trigger('onMove');
                var interval = 0;
                var now = thisObj.getTime();
                if(now - thisObj.time > interval){
                    thisObj.time = now;
                    $(el).trigger('onDrag',thisObj.getPercent());
                }
            },function(x,y,e){  //start Event
                btn_info = btn_bar.getBBox();   //update btnInfo数据
                thisObj.time = thisObj.getTime();
                $(el).trigger('dragStart');
            },function(e){  //end Event
                btn_info = btn_bar.getBBox();   //update btnInfo数据
                $(el).trigger('dragEnd',thisObj.getPercent());
            });
        }
        ,getTime:function(){
            var time = new Date();
            return time = Date.parse(time)+time.getMilliseconds();
        },getPercent:function(btn){
            var el = this.element
            ,o = this.options
            ,box_width = $(el).width()
            ,btn_info = this.btnBar.getBBox();

            var val = Math.round(btn_info.cx)-o.btn_r;
            val = Math.round(val/(this.barWidth)*10000)/100;
            return val;
        }
        ,setPosition:function(val){
            var m = new Snap.Matrix()
            ,mx = Math.round(this.barWidth*val*100)/10000;
            m.add(1,0,0,1,mx,0);
            // this.btnBar.transform(m);
            this.btnBar.animate({'transform':m}, 300, mina.easeinout);
        }
    }; //initialization 

  
    $.fn[pluginName] = function (options) { //플러그인 함수 
        return this.each(function () { 
            if (!$.data(this, 'plugin_' + pluginName)) { 
                $.data(this, 'plugin_' + pluginName, new QNickPlugin(this, options )); 
            } 
        });
    } 

    $(methods).each(function(k,v){
        $.fn[v] = function(a,b,c,d,e,f,g){
            this.each(function () { 
                if ($.data(this, 'plugin_' + pluginName)) { 
                    thisObj = $.data(this, 'plugin_' + pluginName);
                    if(typeof(thisObj[v]) === 'function'){
                        thisObj[v](a,b,c,d,e,f,g);
                    }else{
                        console.log(pluginName+': ['+v+'] method not defined!');
                    }
                } 
            }); 
        }
    });

})(jQuery,window,document); //익명함수 즉시호출