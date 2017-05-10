/**
 * 购物车 - 空购物车
 * @auther linzeyong
 * @date   2017.05.02
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Button,
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {Rule, str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import { NavigationActions } from 'react-navigation';

export default class AddOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let {router, navigation} = this.props;
        console.log('---------------------');
        console.log(router);
        console.log(navigation.state);
        console.log('---------------------');
        return (
            <View style={styles.flex}>
                <AppHead 
                    title='空购物车'
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                        //  let action = router.getActionForPathAndParams('car', null);
                        //  let resetAction = NavigationActions.reset({
                        //      index: 0,
                        //      actions: [
                        //         NavigationActions.navigate({ routeName: 'TabNav' }),
                        //     ]
                        //  });
                        //  this.props.navigation.dispatch(resetAction);
                        // this.props.navigation.navigate('Car');
                        let backAction = NavigationActions.back({key: navigation.state.params.key_car});
                        this.props.navigation.dispatch(backAction);
                        // const setParamsAction = NavigationActions.setParams({
                        //     params: { title: 'Hello' },
                        //     key: 'TabNav',
                        // })
                        // this.props.navigation.dispatch(setParamsAction)
                    }} src={require("../../images/back.png")} />)}
                />
                <Button title="跳转到购物车" onPress={()=>{
                    let action = router.getActionForPathAndParams('car', null);
                    this.props.navigation.navigate('TabNav', {}, action);
                    // this.props.navigation.navigate('Car');
                }} />
                <Button title="跳转到个人中心" onPress={()=>{
                    let action = router.getActionForPathAndParams('personal', null);
                    this.props.navigation.navigate('TabNav', {}, action);
                    // this.props.navigation.navigate('Personal');
                }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        backgroundColor: Color.lightGrey,
        paddingBottom: 10,
    },
    defaultFont: {
        color: Color.lightBack,
        fontSize: 14,
    },
});