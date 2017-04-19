import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
} from 'react-native';

import { Size } from '../public/globalStyle';
import lang from '../public/language';
import BtnIcon from '../public/BtnIcon';
import FloatMenu from './FloatMenu';

export default class CityItem extends Component {
    // 参数类型
    static propTypes = {
        city: React.PropTypes.object.isRequired,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            visible: false,
            nativeEvent: null,
            cityName: null,
        };
    }

    componentWillMount() {
        if(this.props.city) {
            let list = this.props.city.proAdsAry || [];
            this.setState({
                datas: this.props.city,
                dataSource: this.state.dataSource.cloneWithRows(list),
            });
        }
    }

    render() {
        if(!this.state.datas) return null;
        let city = this.state.datas || {};
        let name = city.region_name || '';
        let info = city.griInfo || '';
        let img = city.griImg || '';
        let img_down = require("../../images/down.png");
        let img_enter = require("../../images/enter.png");
        let img_mark = require("../../images/market.png");
        let img_share = require("../../images/share.png");
        
        return (
            <View style={{backgroundColor: '#fff'}}>
                <View style={styles.cityNameRow}>
                    <Text style={styles.cityNameText} numberOfLines={1}>{name}</Text>
                    <BtnIcon width={20} src={img_down} style={{padding: 5}} press={(e)=>{
                        console.log(e.nativeEvent);
                        this.setState({
                            visible: true,
                            nativeEvent: e.nativeEvent,
                            cityName: name,
                        });
                    }} />
                </View>
                <View style={styles.cityTitleRow}>
                    <Text style={styles.cityTitleText} numberOfLines={3}>{info}</Text>
                    <Image source={{uri: img}} style={styles.cityImage} />
                </View>
                <ListView
                    horizontal={true}
                    enableEmptySections={true} 
                    style={styles.listViewStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderItem}
                />
                <View style={styles.cityItemFootBox}>
                    <BtnIcon 
                        width={16}
                        color="#555"
                        src={img_enter}
                        text={lang['cn']['goin'] + name}
                    />
                    <BtnIcon
                        width={16}
                        color="#555"
                        src={img_mark}
                        text={lang['cn']['allSeller']}
                    />
                    <BtnIcon
                        width={16}
                        color="#555"
                        src={img_share}
                        text={lang['cn']['sharePruduct']}
                    />
                </View>
                <FloatMenu 
                    visible={this.state.visible} 
                    nativeEvent={this.state.nativeEvent} 
                    cityName={this.state.cityName}
                    btnSize={20}
                    hideMenu={()=>this.setState({
                        visible: false,
                        nativeEvent: null,
                        cityName: null,
                    })}
                />
            </View>
        );
    }

    _renderItem = (obj, sessonid, rowid) => {
        let gimg = obj.gThumbPic || '';

        return (
            <View key={rowid} style={styles.productBox}>
                <View style={styles.gImageBox}>
                    {gimg ?
                        <Image source={{uri: gimg}} style={styles.gImageStyle} /> : null
                    }
                </View>
                <View>
                    <Text style={styles.goodNameText} numberOfLines={1}>{obj.gName}</Text>
                </View>
                <View style={styles.gPriceBox}>
                    <Text style={styles.priceFH}>¥</Text>
                    <Text style={styles.gprice1}>{obj.gDiscountPrice}</Text>
                    <Text style={styles.gprice2}>{obj.gPrices}</Text>
                </View>
            </View>
        );
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    listViewStyle : {
        backgroundColor: '#fff',
        marginTop : 10,
        marginBottom: 10,
    },
    cityNameRow: {
        height: 40,
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    },
    cityNameText: {
        fontSize: 20,
    },
    cityTitleRow: {
        height: 60,
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    },
    cityTitleText: {
        flex: 3,
        fontSize: 13,
        paddingRight: 10,
    },
    headDownIcon: {
        width: 22,
        height: 22,
    },
    cityImage: {
        flex: 1,
        height: 40,
    },
    productBox: {
        width: 120,
        height: 180,
        margin: 10,
        borderWidth : 1,
        borderColor : '#ccc',
    },
    gImageBox: {
        borderBottomColor : '#ccc',
        borderBottomWidth : 1,
    },
    gImageStyle: {
        width : 118,
        height: 118,
    },
    goodNameText: {
        padding: 5,
        fontSize: 13,
    },
    gPriceBox: {
        height: 27,
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceFH: {
        fontSize : 12,
        color : 'red',
        paddingLeft: 5,
    },
    gprice1: {
        fontSize: 18,
        color: 'red',
    },
    gprice2: {
        fontSize: 12,
        color: '#888',
        paddingLeft: 5,
        textDecorationLine: 'line-through',
    },
    cityItemFootBox: {
        width: Size.width - 30,
        height: 36,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 15,
        borderTopWidth: 1,
        borderTopColor : '#ddd',
    },
    buttonText: {
        fontSize: 14,
        color: '#555',
    },
});