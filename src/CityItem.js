import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ListView,
  WebView,
  ScrollView,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class CityItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cityObj: this.props.city,
            datas: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
    }

    componentDidMount() {
        this.initDatas(this.props.city.region_id);
    }

    initDatas = (id) => {
        if(id && id > 0)
        {
            let that = this;
            let data_url = 'http://vpn.jingtaomart.com/api/ProductController/getProductListByParameter?pCity=' + id;
            fetch(data_url, {})
            .then((response) => response.json())
            .then((ret) => {
                if(ret && ret.sTatus) {
                    that.setState({
                        datas: ret,
                        dataSource: that.state.dataSource.cloneWithRows(ret.proAry)
                    });
                }
            })
            .catch((error) => {
                console.warn(error);
            });
        }
    };

    render() {
        if(!this.state.cityObj || !this.state.datas) return null;
        let city = this.state.cityObj;
        return (
            <View style={{backgroundColor: '#fff'}}>
                <View style={styles.cityNameRow}>
                    <Text style={styles.cityNameText} numberOfLines={1}>{city.region_name}</Text>
                    <TouchableHighlight style={{padding: 10}} onPress={(e)=>{
                        this.props.showModal(true, e.nativeEvent.pageY, false);
                    }}>
                        <Icon name="chevron-down" size={12} color="#666" />
                    </TouchableHighlight>
                </View>
                <View style={styles.cityTitleRow}>
                    <Text style={styles.cityTitleText} numberOfLines={3}>{city.griInfo}</Text>
                    <Image source={{uri: city.griImg}} style={styles.cityImage} />
                </View>
                <ListView
                    horizontal={true}
                    enableEmptySections={true} 
                    style={styles.listViewStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem.bind(this)}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={styles.cityItemFootBox}>
                    <Icon.Button name="sign-in" size={16} color="#555" backgroundColor="transparent">
                        <Text style={styles.buttonText}>{'进入' + city.region_name}</Text>
                    </Icon.Button>
                    <Icon.Button name="building" size={16} color="#555" backgroundColor="transparent">
                        <Text style={styles.buttonText}>所有商家</Text>
                    </Icon.Button>
                    <Icon.Button name="share-square-o" size={16} color="#555" backgroundColor="transparent">
                        <Text style={styles.buttonText}>分享特产</Text>
                    </Icon.Button>
                </View>
            </View>
        );
    }

    renderItem = (obj, sectionID, rowID) => {
        let gimg = obj.gThumbPic || '';

        return (
            <View key={rowID} style={styles.productBox}>
                <View style={styles.gImageBox}>
                    <Image source={{uri: gimg}} style={styles.gImageStyle} />
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
        width: width - 30,
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