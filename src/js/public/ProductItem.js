import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import { PX, Color } from './globalStyle';
import Lang, { str_replace } from './language';

export default class ProductItem extends Component {
    // 默认参数
    static defaultProps = {
        width: PX.productWidth,
        product: null,
        showDiscount: false,
    };
    // 参数类型
    static propTypes = {
        width: React.PropTypes.number,
        product: React.PropTypes.object,
        showDiscount: React.PropTypes.bool,
    };

    render() {
        if(!this.props.product) return null;
        let obj = this.props.product;
        let type = obj.num || 0;
        let gimg = obj.gThumbPic || '';
        let name = obj.gName || '';
        let gPrice = parseFloat(obj.gPrices) || '';
        let dPrice = parseFloat(obj.gDiscountPrice) || '';
        let discount = (gPrice && dPrice && gPrice > 0 && dPrice > 0) ? (dPrice / gPrice).toFixed(2) : null;
        if(type == 0) {
            let aimg = obj.adImg || '';
            if(aimg) gimg = aimg;
        }

        return (
            <View key={this.props._key} style={[styles.productBox, {width: this.props.width},this.props.boxStyle]}>
                <View style={styles.gImageBox}>
                    {gimg ?
                        <Image source={{uri: gimg}} style={{
                            width: this.props.width - 2,
                            height: this.props.width - 2,
                        }} /> : null
                    }
                </View>
                <View>
                    <Text style={[styles.goodNameText, this.props.goodNameStyle]} numberOfLines={2}>{name}</Text>
                </View>
                <View style={[styles.gPriceBox, this.props.goodPriceStyle]}>
                    {dPrice ?
                        <Text style={styles.priceFH}>¥</Text>
                        : null
                    }
                    <Text style={styles.gprice1}>{dPrice}</Text>
                    <Text style={styles.gprice2}>{gPrice}</Text>
                    {(this.props.showDiscount && discount && discount > 0 && discount < 1) ?
                        <View style={styles.discountView}>
                            <Text style={styles.discountText}>{str_replace(Lang['cn']['discount'], (discount * 10).toFixed(1))}</Text>
                        </View>
                        : null
                    }
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    productBox: {
        borderWidth : 1,
        borderColor : Color.lavender,
    },
    gImageBox: {
        borderBottomColor : Color.lavender,
        borderBottomWidth : 1,
    },
    goodNameText: {
        padding: 2,
        fontSize: 11,
        height: 30,
    },
    gPriceBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    discountView: {
        height: 18,
        position: 'absolute',
        right: 2,
        top: 5,
    },
    discountText: {
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 4,
        paddingRight: 4,
        backgroundColor: Color.red,
        color: '#fff',
        borderRadius: 3,
        fontSize: 10,
    },
    priceFH: {
        fontSize : 12,
        color : Color.red,
        paddingLeft: 5,
    },
    gprice1: {
        fontSize: 16,
        color: Color.red,
    },
    gprice2: {
        fontSize: 11,
        color: Color.gainsboro,
        paddingLeft: 5,
        textDecorationLine: 'line-through',
    },
});