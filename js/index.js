var data = data;

// 类似JQ的$
function g(selector) {
    var method = selector.substr(0,1) == '#' ? "getElementById" : 'getElementsByClassName';
    return document[method](selector.substr(1));
}

// 取得两者之间的随机数
function random(range) {
    var max = Math.max( range[0], range[1] );
    var min = Math.min( range[0], range[1] );
    var diff = max-min;
    var result = Math.ceil(Math.random()*diff+min);
    return result;
}


// 模板输出
function addPhotos() {
    var warpObj = g('#warp');
    var template = warpObj.innerHTML;
    var html = [];  // 制作图片
    var nav = [];   // 制作导航
    for ( i in data ) {
        var _html = template.replace('{{id}}',      i)
                            .replace('{{img}}',     data[i].img)
                            .replace('{{caption}}', data[i].caption)
                            .replace('{{desc}}',    data[i].desc);
        html.push(_html);
        nav.push('<span id="nav_'+i+'" class="i" onclick="turn( g(\'#photo_'+i+'\') )"></span>')
    }
    html.push('<div class="nav">' + nav.join('') + '</div>');
    warpObj.innerHTML = html.join('');
    
    rsort(random([0, data.length-1]));
}
addPhotos();

// 排序海报, 将选中的放置在中间
function rsort(n) {
    var _photos = g('.photo'); // 注意这里获取的是一个DOM集合，不是一个数组
    var photos = [];  // 定义一个数组来存放_photos的DOM

    // 这里不能使用for(var i in _photos)因为_photos里面还有一些属性如.length等
    for ( var i=0; i<_photos.length; i++) {
        /* 清除掉一些样式(特别是上一次居中图片的样式) */
        _photos[i].className = _photos[i].className.replace(/\s*photo-center\s*/, ' ');
        _photos[i].className = _photos[i].className.replace(/\s*photo-front\s*/, ' ');
        _photos[i].className = _photos[i].className.replace(/\s*photo-back\s*/, ' ');
        _photos[i].className += ' photo-front ';
        _photos[i].style.left = '';
        _photos[i].style.top = '';
        _photos[i].style['transform'] = 'rotate(360deg)  scale(1.2)';

        photos.push(_photos[i]);
    }
    g('#photo_'+n).className += ' photo-center ';

    photo_center = photos.splice(n ,1)[0]; // splice()返回被截掉的元素(是一个数组)
    
    // 把海报分成左右两个部分
    var photo_left = photos.splice(0, Math.ceil(photos.length/2)); //左边为0~长度的一半
    var photo_right = photos;
    var ranges = range();

    for ( var i in photo_left ) {
        photo_left[i].style.left = random(ranges.left.x) + 'px';
        photo_left[i].style.top = random(ranges.left.y) + 'px';
        photo_left[i].style['transform'] = 'rotate(' + random([-150, 150]) + 'deg) scale(0.95)';
    }
    for ( var i in photo_right ) {
        photo_right[i].style.left = random(ranges.right.x) + 'px';
        photo_right[i].style.top = random(ranges.right.y) + 'px';
        photo_right[i].style['transform'] = 'rotate(' + random([-150, 150]) + 'deg) scale(0.95)';
    }

    /* 导航的处理 */
    var navs = g('.i');
    for ( var i=0; i<navs.length; i++ ) {
        navs[i].className = navs[i].className.replace(/\s*i_current\s*/,' '); //去掉当前状态
        navs[i].className = navs[i].className.replace(/\s*i_back\s*/,' '); //去掉背面向上状态
    }
    g('#nav_'+n).className += ' i_current ';// 将导航制定的设置为选中状态

}

// 3D翻转
function turn(elm) {
    var cls = elm.className;
    var n = elm.id.split('_')[1];

    if ( !/photo-center/.test(cls) ) {
        return rsort(n);
    }

    if ( /photo-front/.test(cls) ) {
        cls = cls.replace(/photo-front/, 'photo-back');
        g('#nav_'+n).className += ' i_back ';
    } else {
        cls = cls.replace(/photo-back/, 'photo-front');
        g('#nav_'+n).className = g('#nav_'+n).className.replace(/\s*i_back\s*/,' ');
    }
    elm.className = cls;
    return false;
}

// 计算左右分区的坐标范围
function range() {
    // 左侧 warp.width/2-photo.width/2 > x > 0-photo.width
    //                     warp.height > y > 0-photo.height
    // 右侧 warp.width/2+photo.width/2 > x > warp.width+photp.width
    //                     warp.height > y > 0-photo.height
    var range = {
        left: {
            x: [],
            y: []
        },
        right: {
            x: [],
            y: []
        }
    };

    var warp = {
        w: g('#warp').clientWidth,
        h: g('#warp').clientHeight
    };
    var photo = {
        w: g('.photo')[0].clientWidth,
        h: g('.photo')[0].clientHeight
    };

    range.left.x = [0-photo.w, warp.w/2-photo.w/2];
    range.left.y = [0-photo.h, warp.h];
    range.right.x = [warp.w+photo.w, warp.w/2+photo.w/2];
    range.right.y = range.left.y;
    return range;
}
