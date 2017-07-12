/**
 * APP店铺 - 推荐版块
 * @auther linzeyong
 * @date   2017.06.21
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import { Size, pixel, Color, PX, errorStyles } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

var bigImgSize = Size.width * 0.661;
var smallImgSize = Size.width * 0.323;
export default class Recommend extends Component {
    // 默认参数
    static defaultProps = {
        recommends: [],
    };
    // 参数类型
    static propTypes = {
        recommends: PropTypes.array.isRequired,
    };

    render() {
        let { style, navigation, recommends, } = this.props;
        if(!recommends || !recommends[0]) return null;
        let p1 = null, p2 = null, p3 = null;
        let gid1 = gid2 = gid3 = 0;
        //第一张
        let _img1 = recommends[0].gThumBPic ? {uri: recommends[0].gThumBPic} : require('../../images/empty.png');
        gid1 = recommends[0].gID || 0;
        p1 = <Image source={_img1} style={styles.bigImg} />;
        //第二张
        if(!recommends[1]) recommends[1] = recommends[0];
        let _img2 = recommends[1].gThumBPic ? {uri: recommends[1].gThumBPic} : require('../../images/empty.png');
        gid2 = recommends[1].gID || 0;
        p2 = <Image source={_img2} style={styles.smallImg} />;
        //第三张
        if(!recommends[2]) recommends[2] = recommends[1];
        let _img3 = recommends[2].gThumBPic ? {uri: recommends[2].gThumBPic} : require('../../images/empty.png');
        gid3 = recommends[2].gID || 0;
        p3 = <Image source={_img3} style={styles.smallImg} />;

        return (
            <View style={[styles.shopProductBox, style]}>
                <View>
                    <TouchableOpacity onPress={()=>this.linkProduct(gid1)}>
                        {p1}
                    </TouchableOpacity>
                </View>
                <View style={{marginLeft: 6}}>
                    <TouchableOpacity style={[styles.shopProductSmall, {
                        marginBottom: 6,
                    }]}  onPress={()=>this.linkProduct(gid2)}>
                        {p2}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.linkProduct(gid3)} style={styles.shopProductSmall}>
                        {p3}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    linkProduct = (id) => {
        if(id && id > 0) {
            this.props.navigation.navigate('Product', {gid: id});
        }
    };
}

var styles = StyleSheet.create({
    shopProductBox: {
        flexDirection: 'row',
    },
    bigImg: {
        width: bigImgSize,
        height: bigImgSize,
    },
    smallImg: {
        width: smallImgSize,
        height: smallImgSize
    },
});