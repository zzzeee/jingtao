/**
 * APP主页面 - 导航菜单
 * @auther linzeyong
 * @date   2017.05.27
 */

import React, { Component } from 'react';
import {
	StyleSheet,
	Text, 
	View, 
    Image,
	TouchableOpacity, 
} from 'react-native';

import { Color, Size, PX, pixel, FontSize } from './public/globalStyle';

export default class TabMenu extends Component {

    renderTabOption(tab, i) {
        let color = this.props.activeTab == i ? Color.mainColor : Color.gray;
        let img = this.props.activeTab == i ? tab.selIcon : tab.icon;
        return (
            <TouchableOpacity 
                key={i} 
                onPress={()=>this.props.goToPage(i)} 
                style={styles.tabItem}
            >
                <Image source={img} style={styles.tabImg} />
                <Text style={[styles.tabName, {color: color}]}>{tab.name}</Text>
            </TouchableOpacity>
        );
    }

	render() {
        const { Menus } = this.props;
        if(Menus) {
            return (
                <View style={styles.tabs}>
                    {Menus.map((tab, i) => this.renderTabOption(tab, i))}
                </View>
            );
        }else {
            return null;
        }
	}
}

var styles = StyleSheet.create({
    tabs : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        height: PX.tabHeight,
        borderTopWidth: pixel,
        borderTopColor: Color.floralWhite,
    },
    tabItem : {
        flex : 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabImg: {
        width: PX.tabIconSize,
        height: PX.tabIconSize,
    },
    tabName: {
        marginTop: 2,
        fontSize: 10,
    },
});