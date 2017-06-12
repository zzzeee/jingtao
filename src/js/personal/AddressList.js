/**
 * 个人中心 - 我的地址
 * @auther linzeyong
 * @date   2017.06.12
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';

export default class AddressList extends Component {

    render() {
        let { navigation } = this.props;
        let scrollref = null;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].addressList}
                    left={<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.goBack(null);
                    }} src={require("../../images/back.png")} />}
                    onPress={() => {
                        scrollref && scrollref.scrollTo({x: 0, y: 0, animated: true});
                    }}
                />
                <ScrollView ref={(_ref)=>scrollref = _ref}>
                </ScrollView>
                <TouchableOpacity style={styles.btnAddAddress} onPress={()=>{
                    navigation.navigate('AddressAdd');
                }}>
                    <Text style={styles.addAddressText}>{Lang[Lang.default].addAddress}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Color.lightGrey,
    },
    scrollStyle: {
        padding: PX.marginLR,
        marginTop: PX.marginTB,
        backgroundColor: '#fff',
    },
    LoginWordText: {
        fontSize: 13,
        color: Color.lightBack,
        lineHeight: 18,
    },
    btnAddAddress: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: PX.rowHeight1,
        backgroundColor: Color.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAddressText: {
        fontSize: 14,
        color: '#fff',
    },
});