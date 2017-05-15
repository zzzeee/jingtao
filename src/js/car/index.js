/**
 * APP购物车
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Button,
} from 'react-native';

import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import { Size, PX } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class CarsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { navigation } = this.props;
        let left = (navigation.state.params && navigation.state.params.goGoodDetails) ? 
            <BtnIcon width={PX.headIconSize} press={()=>{navigation.goBack(null);}} src={require("../../images/back.png")} />
            : null;
        return (
            <View>
                <AppHead 
                    title={Lang[Lang.default].tab_car}
                    left={left}
                />
                {/* <Button title='提交订单' onPress={()=>navigation.navigate('AddOrder')} /> */}
                {/* <Button title='空购物车' onPress={()=>navigation.navigate('EmptyCar')} /> */}
                
            </View>
        );
    }
}

var styles = StyleSheet.create({
});