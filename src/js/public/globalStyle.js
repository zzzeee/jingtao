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
};