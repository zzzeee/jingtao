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

export const Size = Dimensions.get('window');

export const pixel = 1 / PixelRatio.get();

export const PX = {
    defaultFontSize: 14,
    productWidth: 120,
    productHeight: 180,
    productImgWidth: 120,
    productImgHeight: 120,
};

export const Color = {
    statusBarColor : '#E55645',
    appColor1: '#FFCF5B',
    appColor2: '#FA903C',
    appColor3: '#E55645',
    appColor4: '#D52438',
    appColor5: '#3979F3',
    appColor6: '#1B87F5',
    appColor7: '#3453DB',
    appColor8: '#4A4A4A',
    appColor9: '#9097A0',
    appColor10:'#B3B7BE',
    appColor11:'#CED0D4',
    appColor12:'#EFEFEF',
    appColor13:'#E7E7E7',
};