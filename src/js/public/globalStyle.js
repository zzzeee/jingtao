/**
 * 全局样式
 * @auther linzeyong
 * @date   2017.04.18
 */

import React from 'react';
import {
  StyleSheet,
  Dimensions,
  PixelRatio,
} from 'react-native';

//屏幕尺寸
export const Size = Dimensions.get('window');

export const pixel = 1 / PixelRatio.get();

//其他样式尺寸
export const PX = {
    productWidth: 120,
    productHeight: 180,
    productImgWidth: 120,
    productImgHeight: 120,
    headHeight: 56,
};

//APP字体大小
export const FontSize = {
    defaultFontSize: 14,
};

//APP样式颜色
export const Color = {
    mainColor : '#E55645', //主色
    yellow: '#FFCF5B',
    orange: '#FA903C',
    orangeRed: '#E55645',
    red: '#D52438',         //警告、强调
    royalBlue: '#3979F3',
    steelBlue: '#1B87F5',
    blue: '#3453DB',
    lightBack: '#4A4A4A',   //默认/正常 字体
    gainsboro: '#9097A0',   //浅色字体
    gray:'#B3B7BE',         //取消、隐藏
    lightGrey:'#CED0D4',    //主背景色
    floralWhite:'#EFEFEF',  //浅背景色
    lavender:'#E7E7E7',     //描边
};
