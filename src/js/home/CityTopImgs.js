/**
 * 首页 - 城市商品店铺列表 - 头部轮播图
 * @auther linzeyong
 * @date   2017.06.12
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import { Size, Color, pixel, PX } from '../public/globalStyle';

export default class CityTopImgs extends Component {
    // 默认参数
    static defaultProps = {
        cityImgs: [],
    };
    // 参数类型
    static propTypes = {
        cityImgs: PropTypes.array.isRequired,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.cityImgs && this.props.cityImgs.length != nextProps.cityImgs.length) {
            return true;
        }else {
            return false;
        }
    }

    render() {
        let { cityImgs, width, height, navigation } = this.props;
        if(!cityImgs) return null;
        let emptyImg = require('../../images/empty.jpg');
        let imgStyle = {
            width: width,
            height: height,
        };
        if(cityImgs.length < 1) {
            return <Image style={imgStyle} source={emptyImg} />;
        }else {
            return (
                <Swiper
                    width={width}
                    height={height}
                    horizontal={true}
                    showsPagination={true}
                    paginationStyle={styles.paginationStyle}
                    dot={(<View 
                        style={{
                            backgroundColor:'rgba(255, 255, 255, .4)',
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            margin: 5,
                        }}
                    />)}
                    activeDot={(<View 
                        style={{
                            backgroundColor:'rgba(255, 255, 255, .85)',
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            margin: 5,
                        }}
                    />)}
                    autoplay={false}
                    showsButtons={false}
                >
                    {cityImgs.map(function(item, index) {
                        let gid = item.region_id || 0;
                        let gimg = item.griImg || item.adImg;
                        let img = gimg ? {uri: gimg} : emptyImg;
                        let adUrl = item.adUrl || null;
                        return (
                            <TouchableOpacity activeOpacity={1} key={index} onPress={()=>{
                                if(adUrl) {

                                }
                            }}>
                                <Image style={imgStyle} source={img} />
                            </TouchableOpacity>
                        );
                    })}
                </Swiper>
            );
        }
    }
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    paginationStyle: {
        position: 'absolute',
        left: 0,
        right: 0, 
        bottom: 0,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});