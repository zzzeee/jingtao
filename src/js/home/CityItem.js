import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
} from 'react-native';

import { Size, Color } from '../public/globalStyle';
import lang from '../public/language';
import BtnIcon from '../public/BtnIcon';
import ProductItem from '../public/ProductItem';
import FloatMenu from './FloatMenu';

export default class CityItem extends Component {
    // 默认参数
    static defaultProps = {
        city: {},
    };
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
            this.initDatas(this.props.city);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.city != this.props.city) {
            this.initDatas(nextProps.city);
        }
    }

    initDatas = (city) => {
        if(typeof(city) == 'object') {
            let list = city.proAdsAry || [];
            this.setState({
                datas: city,
                dataSource: this.state.dataSource.cloneWithRows(list),
            });
        }
    };

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
                    initialListSize={2}
                    enableEmptySections={true} 
                    style={styles.listViewStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderItem}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={styles.cityItemFootBox}>
                    <BtnIcon 
                        width={16}
                        size={13}
                        color={Color.lightBack}
                        src={img_enter}
                        text={lang['cn']['goin'] + name}
                    />
                    <BtnIcon
                        width={16}
                        size={13}
                        color={Color.lightBack}
                        src={img_mark}
                        text={lang['cn']['allSeller']}
                    />
                    <BtnIcon
                        width={16}
                        size={13}
                        color={Color.lightBack}
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
        return <ProductItem product={obj} _key={rowid} boxStyle={{margin: 10}} />
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
        fontSize: 17,
        color: Color.lightBack,
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
        fontSize: 11,
        paddingRight: 8,
        color: Color.gainsboro,
        lineHeight: 20,
    },
    headDownIcon: {
        width: 22,
        height: 22,
    },
    cityImage: {
        flex: 1,
        height: 60,
    },
    cityItemFootBox: {
        width: Size.width - 30,
        height: 36,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 15,
        borderTopWidth: 1,
        borderTopColor : Color.lavender,
    },
    buttonText: {
        fontSize: 14,
        color: Color.lightBack,
    },
});