/*! QNickSvgAutoFit.JS - v1.0.3 - 2017-04-01
 * http://nickspace.cn/
 *
 * Copyright (c) 2017 Nick Quan;
 * Licensed under the MIT license */
;(function ( $, w, d, Snap, Hammer, undefined ) {
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
        ,defendSize:50
        ,defendRange:50
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
            this._width = $(e).width();
            this._height = $(e).height();
            this._map = this._svg.paper.g();
            this.setMap();

            this.eventType = false;


            // var myElement = document.getElementById('map');
            var mc = new Hammer.Manager(e);
            var pinch = new Hammer.Pinch();
            var singleTap = new Hammer.Tap({ event: 'singletap' });
            mc.add([pinch,singleTap]);

            mc.on("pinchstart", function(ev) {
                eventType = 'pinch';
            });
            mc.on("pinchend", function(ev) {
                eventType = false;
                // console.log('pinchend');
            });
            mc.on("pinchcancel", function(ev) {
                eventType = false;
                // console.log('pinchcancel');
            });
            var pinscale = tempscale = 0;   //减少缩放事件发生变量
            mc.on("pinchmove", function(ev) {
                var scale = thisObj.numRound(ev.scale);
                if(pinscale == scale){
                    return false;
                }else{
                    pinscale = scale;
                }

                var o = thisObj.options
                s = thisObj._status;

                var v = s.mapScale * ((scale-1)*0.3+1)-s.mapScale;
                if(Math.abs(tempscale) < 0.2){
                    tempscale += v;
                    return false;
                }else{
                    tempscale = 0;
                }

                scale = s.mapScale + v;
                scale = thisObj.numRound((scale>o.maxScale)?o.maxScale:scale);
                scale = thisObj.numRound((scale>o.minScale)?scale:o.minScale);
                thisObj.scaleMap(scale,{scaleDuration:0});
            });
            mc.on("singletap", function(ev) {
                var o = thisObj.options;
                try {
                    var p = thisObj.getEventPosition(ev,'layer');
                    thisObj._status.clickX = p.x;
                    thisObj._status.clickY = p.y;

                    if(o.debugMode){
                        thisObj.addCircleOnMap(thisObj.getRelativePoint(p),{
                            fill:'#00bd00'
                            ,stroke:'#6aff2c'
                        });
                    }
                    
                    var target = thisObj.fillterTarget(ev.srcEvent);
                    if(target){
                        thisObj.onClick(target,thisObj._status.clickX,thisObj._status.clickY);
                    }else{
                        console.error('no target!');
                    }
                } catch (e) {
                    console.error('singletap error:'+e.message);
                }

            });


            this.setCenter();
            if(typeof(this.options.onLoad)==='function'){
                this.options.onLoad(this);
            }
            this.debug();
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
            // ,e = $(this.element)
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


            this.setDrag(map);


            //** 设置防止拖拽到外边区域
            var ll = o.defendRange 
            ,x = o.defendSize
            ,y = o.defendSize
            ,w = this._width
            ,h = this._height
            ,r = w-o.defendSize
            ,b = h-o.defendSize;
            var al = s.paper.path('M'+(x)+' '+(ll/2)+'L'+(x)+' '+(h-ll/2));
            var ar = s.paper.path('M'+(r)+' '+(ll/2)+'L'+(r)+' '+(h-ll/2));
            var at = s.paper.path('M'+(ll/2)+' '+(y)+'L'+(w-ll/2)+' '+(y));
            var ab = s.paper.path('M'+(ll/2)+' '+(b)+'L'+(w-ll/2)+' '+(b)); 

            var outline = s.paper.path(mapData.outline).attr({
                'opacity':0
                ,'class':'outline'
            });

            // var test = s.paper.path('M232.364,176.175C232.364,176.175,432.764,176.175,432.764,176.175').attr({

            //         stroke: "#bbf"
            //         ,strokeWidth: 2  
            //         ,'opacity':0.5
            //         ,'class':'test'
            // });
            // map.add(test);
            // var testV = this.checkOutside(test,outline);
            // console.log(testV);
            // var testInside = Snap.path.isPointInside(outline, 232.364,176.175);
            // var testInside2 = Snap.path.isPointInside(outline, 432.764,176.175);

            // var p1 = {x:228.16,y:185.07}
            // var p2 = {x:294.56,y:185.07}
            // var p3 = {x:360.96,y:185.07}
            // var circle = s.paper.circle(p1.x, p1.y, 2).attr({
            //     fill:'#f00'
            //     ,"stroke": '#f00'
            //     ,"strokeWidth": 3
            //     ,'opacity':0.5
            //     }); //中心点
            // map.add(circle);
            // var circle = s.paper.circle(p3.x, p3.y, 2).attr({
            //     fill:'#f00'
            //     ,"stroke": '#f00'
            //     ,"strokeWidth": 3
            //     ,'opacity':0.5
            //     }); //中心点
            // map.add(circle);

            // console.log(Snap.path.isPointInside(outline, p1.x,p1.y));
            // console.log(Snap.path.isPointInside(outline, p2.x,p2.y));
            // console.log(Snap.path.isPointInside(outline, p3.x,p3.y));

            // outline2 = Snap.path.toAbsolute(outline);
            // console.log(Snap.path.isPointInside(outline2, p1.x,p1.y));
            // console.log(Snap.path.isPointInside(outline2, p2.x,p2.y));
            // console.log(Snap.path.isPointInside(outline2, p3.x,p3.y));


            // console.log('testInside');
            // console.log(testInside);
            // console.log(testInside2);

            if(o.debugMode){
                var lineOption = {
                    stroke: "#f0f"
                    ,strokeWidth: 2  
                    ,'opacity':0.5
                };
                al = al.attr(lineOption);
                ar = ar.attr(lineOption);
                at = at.attr(lineOption);
                ab = ab.attr(lineOption);

                outline.attr({
                    'opacity':0.5
                });
            }
            country.before(outline);

            this.paddingObj = {
                outline:outline
                ,al:al
                ,ar:ar
                ,at:at
                ,ab:ab
            }
            /**/
        }
        ,setDrag: function(svgObj){
            
            var l,mx,my;
            var thisObj = this;
            eventType = this.eventType;
            pointerPush = 0;
            pointerUp = 0
            var touchEventId = 0;

            svgObj.drag(function(dx,dy,x,y,event){
                if(pointerPush > 1){    //防止pinch的时候触发移动事件；
                    return false;
                }
                if(event.identifier != undefined){
                    if(touchEventId != event.identifier){
                        return false;
                    }
                }
                // console.log(dx, dy,event);

                //onMove
                this.attr({transform: l + (l ? "T" : "t") + [dx, dy]});
            }
            ,function(x,y,event){
                //onStart
                // console.log('onStart');
                // console.log(event);
                if(eventType){  //防止多个手指触屏时拖拽
                    pointerPush = 1;
                }
                pointerPush++;

                if(event.identifier != undefined){  //修复区域外边pinch的时候颤抖Bug
                    touchEventId = event.identifier;
                }

                // console.log('dragStart:'+pointerPush);
                l = this.transform().local;
                mx = x;
                my = y;
            }
            ,function(event){
                pointerUp++;
                if(pointerPush == 1){
                    var p = thisObj.getEventPosition(event);
                    // console.log('my:'+my);
                    // console.log(event);
                    // console.log(p);
                    // console.log('p.y:'+p.y);
                    mx = mx - p.x;
                    my = my - p.y;
                    if(mx !=0 && my !=0){
                        thisObj.onDragend(mx,my);
                    }
                    pointerPush = 0;
                    pointerUp = 0;
                }else if(pointerPush != pointerUp) {
                    pointerPush = 0;
                    pointerUp = 0;
                }
            });
        }
        ,getEventPosition: function(event,type){
            type = (type == undefined)?'page':type;
            var p = {
                x : NaN
                ,y : NaN
            }
            try {
                if(event[type+'X'] != undefined){   //通常是用这个可以获取
                    p.x = event[type+'X'];
                    p.y = event[type+'Y'];
                }else if(event.changedTouches != undefined && event.changedTouches[0][type+'X'] != undefined){   //安卓
                    p.x = event.changedTouches[0][type+'X'];
                    p.y = event.changedTouches[0][type+'Y'];                
                }else if(event.changedPointers != undefined && event.changedPointers[0][type+'X'] != undefined){  
                    p.x = event.changedPointers[0][type+'X'];
                    p.y = event.changedPointers[0][type+'Y'];                
                }else if(event.srcEvent != undefined && event.srcEvent[type+'X'] != undefined){  
                    p.x = event.srcEvent[type+'X'];
                    p.y = event.srcEvent[type+'Y'];                
                }else{
                    console.error('getEventPosition:can not get event position!');
                }
            } catch (e) {
                console.error('can not get event position:'+e.message);
            }
            return p;
        }
        ,setPositionStatus: function(mapSize){
            var st = this._status
            ,el = this.element;
            if(typeof(st.moveX) == 'string'){
                switch(st.moveX) {
                    case 'center':
                        st.moveX = this.numRound((this._width - mapSize.width)/2);
                        break;
                    case 'right':
                        st.moveX = this.numRound(this._width - mapSize.width);
                        break;
                    default:
                        st.moveX = 0;
                }
            }
            if(typeof(st.moveY) == 'string'){
                switch(st.moveY) {
                    case 'center':
                        st.moveY = this.numRound((this._height - mapSize.height)/2);
                        break;
                    case 'bottom':
                        st.moveY = this.numRound(this._height - mapSize.height);
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
                width:this._width
                ,height:this._height
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
                width:this._width
                ,height:this._height
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
            // var scale = toScale/s.mapScale;
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
            // if(!this.eventType){
            //     this.defendOutside();                
            // }
            this.onScale(toScale);
            this.debug();
        }
        ,moveMap: function(x,y){
            var s = this._status;
            this._status.moveX = this._status.moveX + this.numRound(x,3);
            this._status.moveY = this._status.moveY + this.numRound(y,3);
            // this.scaleMap(this._status.mapScale);
            // console.log('moveMap');
            // console.log(s);
            this.setCenter();
            this.defendOutside(x,y);
            this.debug();
        }
        ,defendOutside: function(x,y){
            // console.log('defendOutside');

            var s = this._status
            ,o = this.options
            ,al = this.paddingObj.al
            ,ar = this.paddingObj.ar
            ,at = this.paddingObj.at
            ,ab = this.paddingObj.ab
            ,outline = this.paddingObj.outline;

            var isAl = this.checkOutside(al,outline);
            var isAr = this.checkOutside(ar,outline);
            var isAt = this.checkOutside(at,outline);
            var isAb = this.checkOutside(ab,outline);
            

            if(o.debugMode){
                var lineOption = {stroke: "#bfb"};
                this.paddingObj.al.attr({stroke: isAl?"#d99":"#f0f"});
                this.paddingObj.ar.attr({stroke: isAr?"#d99":"#f0f"});
                this.paddingObj.at.attr({stroke: isAt?"#d99":"#f0f"});
                this.paddingObj.ab.attr({stroke: isAb?"#d99":"#f0f"});
            }

            // console.log('x:'+x+ ' y:'+y);
            // console.log('isAl:'+isAl);
            // console.log('isAr:'+isAr);
            // console.log('isAt:'+isAt);
            // console.log('isAb:'+isAb); 

            var distAl = distAr = distAt = distAb = 0;

            var dist = {x:0,y:0};

            if(x>0){    //检测左侧
                // console.log('left');
                if(isAl && isAr) {
                    dist.x = x;
                }else if(isAl){
                    dist.x = distAl = this.getDistance(x,0,al,outline).x; 
                }
            }else if(x<0){    //检测右侧
                // console.log('right');  
                if(isAl && isAr) {
                    dist.x = x;
                }else if(isAr){
                    dist.x = distAr = this.getDistance(x,0,ar,outline).x; 
                }
            }
            if(y>0){    //检测上侧
                // console.log('top');                  
                if(isAt && isAb) {
                    dist.y = y;
                }else if(isAt){
                    dist.y = distAt = this.getDistance(0,y,at,outline).y; 
                }
            }else if(y<0){    //检测下侧
                // console.log('bottom');                 
                if(isAt && isAb) {
                    dist.y = y;
                }else if(isAb){
                    dist.y = distAb = this.getDistance(0,y,ab,outline).y;
                }
            }
            
            // console.log('distAl:'+distAl);
            // console.log('distAr:'+distAr);
            // console.log('distAt:'+distAt);
            // console.log('distAb:'+distAb);
            dist.x = this.numRound(dist.x/s.mapScale);
            dist.y = this.numRound(dist.y/s.mapScale);
            // console.log(dist);
            // console.log('renderDefend');
            // console.log(s);
            if(dist.x != 0 || dist.y != 0){
                var moveX = s.moveX-dist.x*s.mapScale;
                var moveY = s.moveY-dist.y*s.mapScale;
                m = new Snap.Matrix();
                m.add(1,0,0,1,moveX,moveY);
                m.scale(s.mapScale, s.mapScale,s.centerX,s.centerY);
                this._map.animate({'transform':m}, 500, mina.backout);
                
                this._status.moveX = moveX;
                this._status.moveY = moveY; 
                this.setCenter();
            }
            
        }
        ,getAbsolutePathOnMap: function(obj){
            var s = this._status
            ,m = new Snap.Matrix();

            m.translate(-s.moveX/s.mapScale, -s.moveY/s.mapScale);
            m.scale(1/s.mapScale, 1/s.mapScale,s.centerX,s.centerY);
            
            return Snap.path.map(obj,m);
        }
        ,checkOutside: function(line,outline){

            var absLine = this.getAbsolutePathOnMap(line);
            var svg = this._svg 
            ,map = this._map;

            mapline = svg.paper.path(absLine.toString()).attr({
                stroke: "#f0f",
                strokeWidth: 1  
            });
            map.add(mapline);

            var box = Snap.path.getBBox(absLine);
            // console.log(box);
            if(!this.isBoxInside(outline, box)){ //判断某个点在不在里边
                var points = Snap.path.intersection(absLine, outline);
                if(points.length == 0){
                    // console.log('box');
                    // console.log(box);
                    // console.log(typeof(line));
                    // console.log(line);
                    // console.log(points.length);
                    // console.log(absLine.toString());
                    // console.log(line.toString());
                    // console.log(this._status);
                    mapline.remove();
                    return true;
                }                
            }
            mapline.remove();
            return false;
        }
        ,isBoxInside: function(outline,box){ 
            //isPointInside有bug,下面语句应该返回true,实际测试返回false
            //  Snap.path.isPointInside(outline, 232.364,176.175)
            //
            if(Snap.path.isPointInside(outline, this.numRound(box.x,2),this.numRound(box.y,2))){
                return true;
            }else if(Snap.path.isPointInside(outline, this.numRound(box.x2,2),this.numRound(box.y2,2))){
                return true;                
            }else if(Snap.path.isPointInside(outline, this.numRound(box.cx,2),this.numRound(box.cy,2))){
                return true;                
            }
            return false;
        }
        ,getDistance: function(x,y,line,outline){ //移动的距离范围内测量距离
            var m,line2
            ,map = this._map
            ,svg = this._svg;
            var x2 = y2 = 0; 

            for (var i = 0; i < 15; i++) {
                if(Math.abs(x/2) < 0.05 && Math.abs(y/2) < 0.05) break;
                x = x/2;
                y = y/2;
               
                m = new Snap.Matrix();
                m.translate(x2+x, y2+y);
                line2 = Snap.path.map(line,m).toString();
                if(this.checkOutside(line2,outline)){
                    x2 += x;
                    y2 += y;
                }
            } 
            // console.log('x2:' + x2 + ' y2:' + y2);
            return {x:this.numRound(x2),y:this.numRound(y2)};
        }

        ,onDragend: function(x,y){
            // console.log('dargEnd');
            // console.log(x,y);
            if((!isNaN(x) && x!=0) || (!isNaN(y) && y !=0)){
                this.moveMap(-x,-y);
                // console.log('DragMove');
            }
            // else{
            //     // console.log('notDrag');
            // }
        }
        //触发单击事件
        ,onClick: function(target,clickX,clickY){

            // console.log('onClick');
            // console.log('clickX:'+clickX+'clickY:'+clickY);
            // console.log(this._status);
            var point = {x:clickX,y:clickY};
            var o = this.options;
            this.setScaleCenterPoint(point);

            // this.debug({fill:'#00bd00',stroke:'#6aff2c'});
            var status = this.autoScale(target, null);
            if(typeof(o.onClick)==='function'){
                o.onClick(status);
            }
            $(this.element).trigger('onClick',status);
            this.debug();
        }
        ,onScale: function(scale){
            var o = this.options;
            if(typeof(o.onScale)==='function'){
                o.onScale(scale);
            }
            $(this.element).trigger('onScale',scale);
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
            var point = {x:this._width/2,y:this._height/2};
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
            if(x == undefined){
                x = 0;
            }
            var n = Math.pow(10,num);
            return Math.round(x*n)/n;
        }
        ,getRelativePoint: function(point){ //找出地图上的点
            // 1.先找中心点
            // 2.计算离中心点位置
            // 3.计算缩放距离    
            var s = this._status;
            var center = {
                x:this._width/2
                ,y:this._height/2
            }
            var gap = {
                x:point.x - center.x
                ,y:point.y - center.y
            }

            point.x = s.centerX + gap.x/s.mapScale;
            point.y = s.centerY + gap.y/s.mapScale;
            return point;
        }
        ,addCircleOnMap: function(point,color){            
            var svg = this._svg
            ,map = this._map
            ,s = this._status
            ,defaultColor = {
                fill:'#f00'
                ,stroke:'#ff0'
            };
            
            var color = $.extend({}, defaultColor, color); 
            
            var circle = svg.paper.circle(point.x, point.y, 2).attr({
                fill:color.fill
                ,"stroke": color.stroke
                ,"strokeWidth": 1
                ,'opacity':0.5
                }); //中心点
            map.add(circle);
            this.debug();
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
                // console.log('debug');
                // console.log(status);
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
})(jQuery, window, document, Snap, Hammer);