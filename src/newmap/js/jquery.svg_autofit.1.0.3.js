/*! QNickSvgAutoFit.JS - v1.0.3 - 2017-04-01
 * http://nickspace.cn/
 *
 * Copyright (c) 2017 Nick Quan;
 * Licensed under the MIT license */
;(function ( $, w, d, Snap, undefined ) {
    var pluginName = 'QNickSvgAutoFit'
    , methods = ['customScale','scaleMap','autoScale','autoFit','getStatus']
    , defaults = {
        maxScale: 3
        ,minScale: 0.6
        ,mapData : {}
        ,shapesColor:'#FF4239'
        ,strokeColor:'#fff'
        ,shapesColorOn:'#FF4239'
        ,strokeColorOn:'#fff'
        ,FontColorOn:'#fff'
        ,lightFontColor:'#fff'
        ,darkFontColor:'#6f3838'
        ,scaleDuration:500
        ,debugMode:false
        ,selectClassName:'sheng'
        ,selectShapeClassName:'shengShape'
        ,selectTextClassName:'shengText'
        ,scalePadding:30
        ,fitPadding:10
    }
    , status = {
        'mapScale' : 1      //放大比例
        ,'centerX' : 'center'    //缩放中心点x坐标
        ,'centerY' : 'center'    //缩放中心点y坐标
        ,'moveX' : 'center'    //横向移动x坐标
        ,'moveY' : 'center'    //纵向移动y坐标
        ,'target' : null    //指向的对象
        ,'eventLock' : true    //防止手势冲突
    };
    
    function QNickPlugin( e, options, user_status ) { 
        this.element = e; 
        this.options = $.extend({}, defaults, options); 
        this._defaults = defaults;  
        this._status = $.extend({}, status, user_status); 
        this._name = pluginName;
        this._svg = null;
        this.init();
        $(this.element).trigger('onLoad',this);

    }

    QNickPlugin.prototype = {
        //初始化
        init : function () {
            var e = this.element
            thisObj = this;

            this._svg = Snap(e);
            this._map = this._svg.paper.g();
            this.setMap();

            $(d).on('touchstart',function(e){
                if(!thisObj._status.touchstart){
                    thisObj.docTouchstart = e;
                    thisObj._status.eventLock = true;
                }
            });
            $(d).on('mousedown',function(e){
                if(!thisObj._status.mousedown){
                    thisObj.docMousedown = e;
                    thisObj._status.eventLock = true;
                }
            });
            //单击事件逻辑
            this._svg.mousedown(function(e) {
                if(thisObj.getEventTypeName(e) == 'MouseEvent'){
                    var docEvent = thisObj._status.docMousedown;
                    if(docEvent){
                        if(docEvent.layerX != undefined && docEvent.layerX == e.layerX && docEvent.layerY == e.layerY){
                            thisObj._status.eventLock = false;
                        }
                    }else{
                        thisObj._status.eventLock = false;
                    }
                    thisObj._status.mousedown = e;
                }
            });
            this._svg.mouseup(function(e2) {
                if(!thisObj._status.eventLock){
                    if(thisObj.getEventTypeName(e2) == 'MouseEvent'){
                        var e1 = thisObj._status.mousedown;
                        thisObj.clickEvent(e1,e2);
                    }
                }else{
                    console.log('EventLocked');
                }
            });

            //触屏事件逻辑
            this._svg.touchstart(function(e) {
                if(thisObj.getEventTypeName(e) == 'TouchEvent'){
                    var docEvent = thisObj._status.docTouchstart;
                    if(docEvent){
                        if(docEvent.layerX != undefined && docEvent.layerX == e.layerX && docEvent.layerY == e.layerY){
                            thisObj._status.eventLock = false;
                        }
                    }else{
                        thisObj._status.eventLock = false;
                    }
                    thisObj._status.touchstart = e;
                }
            });
            this._svg.touchend(function(t2) {
                if(!thisObj._status.eventLock){
                    if(thisObj.getEventTypeName(t2) == 'TouchEvent'){
                        var t1 = thisObj._status.touchstart;
                        thisObj.clickEvent(t1,t2);
                    }
                }else{
                    console.log('EventLocked');
                }
            });

            // this.setCenter();
            if(typeof(this.options.onLoad)==='function'){
                this.options.onLoad(this);
            }
            this.debug();
        }
        ,clickEvent: function(e1,e2){
            var thisObj = this;
            if(e2.pageX && e2.pageY && e1.layerX != undefined){
                var dragX = e2.layerX - e1.layerX;
                var dragY = e2.layerY - e1.layerY;

                if(dragX == 0, dragY == 0){
                    this._status.clickX = e2.layerX;
                    this._status.clickY = e2.layerY;
                    
                    var target = thisObj.fillterTarget(e2);
                    if(target){
                        thisObj.onClick(target,e2.layerX,e2.layerY);
                    }
                }else{
                    thisObj.onDragend(dragX,dragY);
                }
            }else {
                var _e1 = e1.changedTouches || null;
                var _e2 = e2.changedTouches || null;
                if(_e1 && _e2 && _e1.length > 0 && _e2.length > 0) {
                    var ex1 = _e1[0].pageX || 0;
                    var ey1 = _e1[0].pageY || 0;
                    var ex2 = _e2[0].pageX || 0;
                    var ey2 = _e2[0].pageY || 0;
                    var dragX = ex2 - ex1;
                    var dragY = ey2 - ey1;

                    if(dragX == 0, dragY == 0){
                        this._status.clickX = ex2;
                        this._status.clickY = ey2;

                        var target = $(e2.target).parents('g.'+ this.options.selectClassName);
                        if(target[0]) {
                            thisObj.onClick(target[0], ex2 - 15, ey2 - 15);
                        }

                        // var target = thisObj.fillterTarget(e2);
                        // if(target){
                        //     thisObj.onClick(target, ex2 - 15, ey2 - 15);
                        // }
                    }else{
                        thisObj.onDragend(dragX,dragY);
                    }
                }
            }
        }
        //选择省模块
        ,fillterTarget: function(e){
            var o = this.options;
            var clickEl = e.path;
            if(clickEl == undefined){   //touchEvent时候
                clickEl = e.target;
                var t = $(clickEl).parents('g.'+o.selectClassName);
                if(t[0] != undefined){
                    return t[0];
                }
            }else{  //mouseEvent的时候
                for(i=0;i<clickEl.length;i++){
                    if($(clickEl[i]).attr('class') == o.selectClassName){
                        return clickEl[i];
                    }
                }
                return undefined;
            }
        }
        //画地图
        ,setMap : function() {
            var mapData = this.options.mapData
            ,o = this.options
            ,s = this._svg
            ,map = this._map
            ,plugin = this
            ,country = s.paper.g().attr({class:'country'});
            if(mapData.shapes && mapData.counts && mapData.names){
                $.each(mapData.shapes,function(name,path){
                    var percent = mapData.counts[name]/100;
                    if(!percent || percent < 0.05){
                        percent = 0.05;
                    }else if(percent > 1){
                        percent = 1;
                    }
                    var  pid= mapData.pids[name];
                    fillColor = plugin.opacityColor(o.shapesColor, percent);
                    var sheng = s.paper.g().attr({
                        class:o.selectClassName
                        ,name:name
                        ,id:pid
                    });
                    var shengShape = sheng.add(s.paper.path(path).attr({
                        fill: fillColor,
                        stroke: o.strokeColor,
                        strokeWidth: 1.2
                        ,class:o.selectShapeClassName
                    }));
                    info = shengShape.getBBox();
                    info['name'] = mapData.names[name];
                    if(percent>0.3){
                        fontColor = o.lightFontColor;
                    }else{
                        fontColor = o.darkFontColor;
                    }
                    t= s.text(info.name[0], info.name[1], info.name[2]).attr(
                        $.extend({}, {
                            fill:fontColor
                            ,class:o.selectTextClassName
                        },info.name[3])
                    );
                    sheng.add(t);
                    country.add(sheng);
                });
            }
            var mapSize = country.getBBox();
            var bg = s.paper.rect(-mapSize.width, -mapSize.height, mapSize.width*3, mapSize.height*3);
            bg.attr({
                'opacity':0
                ,'class':'background'
            });

            this.setPositionStatus(mapSize);
            var m = new Snap.Matrix()
            ,st = this._status;

            map.add(bg);
            map.add(country);
            m.add(1,0,0,1,st.moveX,st.moveY);
            m.scale(st.mapScale, st.mapScale,st.centerX,st.centerY);
            map.transform(m);
            map.drag();
        }
        ,setPositionStatus: function(mapSize){
            var st = this._status
            ,el = this.element;
            if(typeof(st.moveX) == 'string'){
                switch(st.moveX) {
                    case 'center':
                        st.moveX = this.numRound(($(el).width() - mapSize.width)/2);
                        break;
                    case 'right':
                        st.moveX = this.numRound(($(el).width() - mapSize.width));
                        break;
                    default:
                        st.moveX = 0;
                }
            }
            if(typeof(st.moveY) == 'string'){
                switch(st.moveY) {
                    case 'center':
                        st.moveY = this.numRound(($(el).height() - mapSize.height)/2);
                        break;
                    case 'bottom':
                        st.moveY = this.numRound($(el).height() - mapSize.height);
                        break;
                    default:
                        st.moveY = 0;
                }
            }
            if(typeof(st.centerX) == 'string'){
                switch(st.centerX) {
                    case 'center':
                        st.centerX = this.numRound(mapSize.width/2);
                        break;
                    case 'right':
                        st.centerX = this.numRound(mapSize.width);
                        break;
                    default:
                        st.centerX = 0;
                }
            }
            if(typeof(st.centerY) == 'string'){
                switch(st.centerY) {
                    case 'center':
                        st.centerY = this.numRound(mapSize.height/2);
                        break;
                    case 'bottom':
                        st.centerY = this.numRound(mapSize.height);
                        break;
                    default:
                        st.centerY = 0;
                }
            }
            this._status = st;
        }
        ,customScale: function(scale,center,position,opt) {
            this._status.moveX = this.numRound(position.x,3);
            this._status.moveY = this.numRound(position.y,3);  
            this._status.centerX = this.numRound(center.x,3);
            this._status.centerY = this.numRound(center.y,3);                 
            
            this.scaleMap(scale,opt);
            this.debug();
        }
        ,autoScale: function(e,opt) {
            var o = this.options
            ,thisObj = this.element;

            if(typeof(e) === 'string'){
                e = $(thisObj).find("g."+o.selectClassName+"[name='"+e+"']")[0];
            }
            this.setTarget(e);
            var wraper = {
                width:$(this.element).width()
                ,height:$(this.element).height()
            }
            ,thisBox = e.getBBox()
            ,center = {
                x:thisBox.x + thisBox.width/2
                ,y:thisBox.y + thisBox.height/2
            }
            ,position = {
                x: wraper.width/2 - center.x
                ,y: wraper.height/2 - center.y
            }
            ,scaleWidth = wraper.width - o.scalePadding*2
            ,scaleHeight = wraper.height - o.scalePadding*2
            ,scaleHorizon = this.numRound(scaleWidth / thisBox.width)
            ,scaleVertical = this.numRound(scaleHeight / thisBox.height)
            ,autoScale = (scaleHorizon>scaleVertical)?scaleVertical:scaleHorizon;
            
            autoScale = this.numRound((autoScale>o.maxScale)?o.maxScale:autoScale);
            autoScale = this.numRound((autoScale>o.minScale)?autoScale:o.minScale);
            this.customScale(autoScale,center,position,opt);
            return {
                'mapScale' : autoScale      //放大比例
                ,'centerX' : center.x    //缩放中心点x坐标
                ,'centerY' : center.y    //缩放中心点y坐标
                ,'moveX' : position.x    //横向移动x坐标
                ,'moveY' : position.y    //纵向移动y坐标
                ,'target' : e    //指向的对象
            }
        }
        ,autoFit: function(opt){
            var o = this.options
            ,thisObj = this.element;

            var e = $(thisObj).find("g.country")[0];

            var wraper = {
                width:$(this.element).width()
                ,height:$(this.element).height()
            }
            ,thisBox = e.getBBox()
            ,center = {
                x:thisBox.x + thisBox.width/2
                ,y:thisBox.y + thisBox.height/2
            }
            ,position = {
                x: wraper.width/2 - center.x
                ,y: wraper.height/2 - center.y
            }
            ,scaleWidth = wraper.width - o.fitPadding*2
            ,scaleHeight = wraper.height - o.fitPadding*2
            ,scaleHorizon = this.numRound(scaleWidth / thisBox.width)
            ,scaleVertical = this.numRound(scaleHeight / thisBox.height)
            ,autoScale = (scaleHorizon>scaleVertical)?scaleVertical:scaleHorizon;
            
            autoScale = this.numRound((autoScale>o.maxScale)?o.maxScale:autoScale);
            autoScale = this.numRound((autoScale>o.minScale)?autoScale:o.minScale);
            this.customScale(autoScale,center,position,opt);
            return {
                'mapScale' : autoScale      //放大比例
                ,'centerX' : center.x    //缩放中心点x坐标
                ,'centerY' : center.y    //缩放中心点y坐标
                ,'moveX' : position.x    //横向移动x坐标
                ,'moveY' : position.y    //纵向移动y坐标
                ,'target' : e    //指向的对象
            };
        }

        //放大缩小SVG
        ,scaleMap: function(toScale,opt) {

            var s = this._status;
            var o = $.extend({}, this.options, opt);
            var scale = toScale/s.mapScale;
            s.mapScale = toScale;

            var m_s = new Snap.Matrix();
            m_s.add(1,0,0,1,s.moveX,s.moveY);

            var duration = o.scaleDuration;
            
            m_s.scale(s.mapScale, s.mapScale,s.centerX,s.centerY);
            if(duration == 0){
                this._map.transform(m_s);
            }else{
                this._map.animate({'transform':m_s}, duration, mina.easeinout);
            }
            this.debug();
        }
        ,moveMap: function(x,y){
            var s = this._status;
            this._status.moveX = this._status.moveX + this.numRound(x,3);
            this._status.moveY = this._status.moveY + this.numRound(y,3);
            // this.scaleMap(this._status.mapScale);
            this.setCenter();
            this.debug();
        }

        ,onDragend: function(x,y){
            this.moveMap(x,y);
        }
        //触发单击事件
        ,onClick: function(target,clickX,clickY){
            var point = {x:clickX,y:clickY};
            var o = this.options;
            this.setScaleCenterPoint(point);
            this.debug({fill:'#00bd00',stroke:'#6aff2c'});
            var status = this.autoScale(target, null);
            if(typeof(o.onClick)==='function'){
                o.onClick(status);
            }
            $(this.element).trigger('onClick',status);
            this.debug();
        }
        ,setTarget: function(e){
            var o = this.options
            ,s = this._status;
            $(s.target).find('.'+o.selectShapeClassName).css({
                'fill': ''
            });
            $(s.target).find('.'+o.selectTextClassName).css({
                'fill':''
            });
            $(e).find('.'+o.selectShapeClassName).css({
                'fill':'#FFCF5B'
            });
            $(e).find('.'+o.selectTextClassName).css({
                'fill':'#6f3838'
            });
            this._status.target = e;
        }
        ,setScaleCenterPoint: function(point){
            var s = this._status;
            // var screen_move = {}; //单击点与中心点距离
            var map_point = {};  //按单击点坐标画在缩放图上的点

            var svg_move = {};  //已经拖拽的距离
            var add_move = {};  //要移动的距离

            svg_move.x = s.moveX;
            svg_move.y = s.moveY;

            
            map_point.x = this.numRound(s.centerX+(point.x-s.centerX)/s.mapScale - s.moveX / s.mapScale);
            map_point.y = this.numRound(s.centerY+(point.y-s.centerY)/s.mapScale - s.moveY / s.mapScale);

            add_move.x = point.x - map_point.x-s.moveX;
            add_move.y = point.y - map_point.y-s.moveY;
            this._status.moveX = this.numRound(s.moveX + add_move.x);
            this._status.moveY = this.numRound(s.moveY + add_move.y); 
            this._status.centerX = this.numRound(map_point.x,3);
            this._status.centerY = this.numRound(map_point.y,3);       
        }

        ,setCenter: function(){
            var e = this.element;
            var point = {x:$(e).width()/2,y:$(e).height()/2};
            this.setScaleCenterPoint(point);
        }

        ,getEventTypeName: function(obj){
            return Object.prototype.toString.call(obj).slice(8, -1);
        }


        // 获取（透明颜色+白底）颜色值
        ,opacityColor: function(color, percent) {  
            percent = 1 - percent;
            var f=parseInt(color.slice(1),16)
            ,t=percent<0?0:255
            ,p=percent<0?percent*-1:percent
            ,R=f>>16
            ,G=f>>8&0x00FF
            ,B=f&0x0000FF;
            return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
        }
        // 获取小数点3位数字
        ,numRound: function(x,num){
            if(num == undefined){
                num = 3;
            }
            var n = Math.pow(10,num);
            return Math.round(x*n)/n;
        }
        ,debug: function(color){

            var o = this.options
            ,svg = this._svg
            ,status = this._status
            ,map = this._map
            ,defaultColor = {
                fill:'#f00'
                ,stroke:'#ff0'
            };
            var color = $.extend({}, defaultColor, color); 

            if(o.debugMode){
                var scale_center = svg.paper.circle(status.centerX, status.centerY, 2).attr({
                    fill:color.fill
                    ,"stroke": color.stroke
                    ,"strokeWidth": 1
                    ,'opacity':0.5
                    }); //中心点
                map.add(scale_center);

                var html = '';
                $.each(status,function(i,e){
                    if(i != 'mousedown' && i != 'touchstart'){
                        if(i == 'target' ){
                            var text = ($(e).attr('name'))?'[object]'+$(e).attr('name'):e;
                            
                            html += '<p>'+i+':'+text+'</p>';
                        }else{
                            html += '<p>'+i+':'+e+'</p>';
                        }
                    }
                });

                if($('#'+pluginName+'_debug').length == 0){
                    var text = this.appendDebugTag()
                    $('body').append(text);
                }
                $('#'+pluginName+'_debug').html(html);
            }
        }
        ,appendDebugTag: function(){
            var tag = '';
            tag += '<div id="'+pluginName+'_debug" style="position: absolute;top: 0;right: 0;padding: 20px;background: rgba(255,255,255,0.7);line-height: 5px;">';      
            tag += '</div>';   
            return tag;   
        
        }
    };

    
    $.fn[pluginName] = function ( options, status ) { //플러그인 함수 
        return this.each(function () { 
            if (!$.data(this, 'plugin_' + pluginName)) { 
                $.data(this, 'plugin_' + pluginName, new QNickPlugin( this, options, status )); 
            } 
        }); 
    }
    // console.log(new QNickPlugin());
    // $.fn.extend({
    //     QNickSvgAutoFit: function ( options, status ) {
    //         return this.each(function () { 
    //             if (!$.data(this, 'plugin_' + pluginName)) { 
    //                 $.data(this, 'plugin_' + pluginName, new QNickPlugin( this, options, status )); 
    //             }
    //         });
    //     },
    // });

    $(methods).each(function(k,v){
        var return_val = undefined;
        $.fn[v] = function(a,b,c,d,e,f,g,h,i,j){
            this.each(function (k,e) {
                if ($.data(this, 'plugin_' + pluginName)) { 
                    thisObj = $.data(this, 'plugin_' + pluginName);
                    if(typeof(thisObj[v]) === 'function'){
                        return_val = thisObj[v](a,b,c,d,e,f,g,h,i,j);
                    }else{
                        console.error(pluginName+': ['+v+'] method not defined!');
                    }
                } 
            }); 
            return return_val;
        }
    });
})(jQuery, window, document, Snap);