import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
} from 'react-native';

import Util from '../public/utils';
import urls from '../public/apiUrl';
import lang from '../public/language';
import { Size } from '../public/globalStyle';
import BtnIcon from '../public/BtnIcon';

export default class HeadBox extends Component {
    // 参数类型
    static propTypes = {
        datas: React.PropTypes.object.isRequired,
    };
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
    }

    componentWillMount() {
        if(this.props.datas) {
            this.initDatas(this.props.datas);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.datas != this.props.datas) {
            this.initDatas(nextProps.datas);
        }
    }

    initDatas = (datas) => {
        let list = datas.cityProduct || [];
        this.setState({
            datas: datas,
            dataSource: this.state.dataSource.cloneWithRows(list),
        });
    };

    render() {
        if(!this.state.datas) return null;
        
        let pinfo = this.state.datas || {};
        let fimg = pinfo.griImg || null;
        let name = pinfo.region_name || null;
        let text = pinfo.griInfo || null;
        
        return (
            <View>
                <View style={{width: Size.width, height: 120,}}>
                    <Image source={{uri: fimg}} style={styles.firstRowImage}>
                        <Text style={styles.bigText} numberOfLines={1}>{name}</Text>
                        <Text style={styles.smlText} numberOfLines={3}>{text}</Text>
                    </Image>
                </View>
                <ListView
                    horizontal={true}
                    initialListSize={2}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem.bind(this)}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
    }

    renderItem = (obj, sectionID, rowID) => {
        let name = obj.region_name || '';
        let cimg = obj.griImg || null;
        let img_down = require("../../images/down.png");
        let img_enter = require("../../images/enter.png");
        let img_mark = require("../../images/market.png");
        
        return (
            <View key={rowID} style={[styles.cityItem, {
                marginLeft: this.state.datas.cityProduct.length == 1 ? 25 : 10,
            }]}>
                <View style={styles.cityHead}>
                    <Text>{name}</Text>
                    <BtnIcon width={20} src={img_down} />
                </View>
                <Image source={{uri: cimg}} style={styles.cityImage} />
                <View style={styles.cityfoot}>
                    <BtnIcon src={img_enter} text={lang['cn']['goin'] + name} />
                    <BtnIcon src={img_mark} text={lang['cn']['allSeller']} />
                </View>
            </View>
        );
    };
}

var itemW = Size.width - 50;
var itenH = 200;
var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    bigText : {
        fontSize : 22,
        color: '#fff'
    },
    smlText : {
        fontSize : 13,
        color: '#fff'
    },
    firstRowImage: {
        width: Size.width,
        height: 120,
        padding: 10,
    },
    cityItem: {
        width: itemW,
        height: itenH,
        margin: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 2,
    },
    cityHead: {
        height: 30,
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    },
    cityImage : {
        width: itemW - 2,
        height: itenH - 70,
    },
    cityfoot: {
        flexDirection : 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 4,
    },
    icon: {
        width: 22,
        height: 22,
    },
    buttonText: {
        color: '#555',
    },
});