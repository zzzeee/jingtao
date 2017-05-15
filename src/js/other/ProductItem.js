import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import { PX, Color, pixel } from '../public/globalStyle';
import Lang, { str_replace } from '../public/language';

export default class ProductItem extends Component {
    // 默认参数
    static defaultProps = {
        width: PX.productWidth1,
        product: null,
        showDiscount: false,
    };
    // 参数类型
    static propTypes = {
        width: React.PropTypes.number,
        bottomHeight: React.PropTypes.number,
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
        let dPrice = this.props.panicBuying ? parseFloat(obj.pbgPrice) : parseFloat(obj.gDiscountPrice);
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
                            width: this.props.width,
                            height: this.props.width,
                        }} /> : null
                    }
                </View>
                <View style={styles.goodNameView}>
                    <Text style={[styles.goodNameText, this.props.goodNameStyle]} numberOfLines={1}>
                        {name}
                    </Text>
                </View>
                <View style={[styles.gPriceBox, this.props.goodPriceStyle]}>
                    {dPrice ?
                        <Text style={styles.priceFH}>{Lang[Lang.default].RMB}</Text>
                        : null
                    }
                    <Text style={styles.gprice1}>{dPrice}</Text>
                    <Text style={styles.gprice2}>{gPrice}</Text>
                    {(this.props.showDiscount && discount && discount > 0 && discount < 1) ?
                        <View style={styles.discountView}>
                            <Text style={styles.discountText}>{str_replace(Lang[Lang.default].discount, (discount * 10).toFixed(1))}</Text>
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
        // borderWidth : pixel,
        // borderColor : Color.lavender,
        backgroundColor: '#fff',
        borderRadius: 2,
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: {'height': 0.5,},
        elevation: 3,
    },
    gImageBox: {
        // borderBottomColor : Color.lavender,
        // borderBottomWidth : pixel,
    },
    goodNameView: {
        height: 30,
        justifyContent: 'center',
    },
    goodNameText: {
        paddingLeft: 10,
        paddingRight: 2,
        fontSize: 11,
    },
    gPriceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        height: 35,
    },
    discountView: {
        height: 18,
        position: 'absolute',
        right: 5,
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
        paddingLeft: 2,
    },
    gprice1: {
        fontSize: 15,
        color: Color.red,
    },
    gprice2: {
        fontSize: 12,
        color: Color.gainsboro,
        paddingLeft: 6,
        paddingTop: 3,
        textDecorationLine: 'line-through',
    },
});