import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  Image,
  Dimensions,
  ScrollView,
  ListView,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var h = height * 0.5;
var h1 = height * 0.2;
var h2 = h > 100 ? 100 : h;
var itemW = width - 50;
var itenH = 200;

export default class HeadBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: this.props.datas,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }).cloneWithRows(this.props.datas.cInfo),
        };
        this.url = 'http://vpn.jingtaomart.com/chinamap/index.html';
    }

    componentWillMount() {
    }

    render() {
        if(!this.state.datas || !this.state.datas.pInfo || !this.state.datas.cInfo) return null;
        
        let pinfo = this.state.datas.pInfo || {};
        let cinfo = this.state.datas.cInfo || [];
        let fimg = pinfo.griImg || null;
        let name = pinfo.region_name || null;
        let text = pinfo.griInfo || null;
        
        return (
            <View>
                <View style={{height: h}}>
                    <WebView
                        automaticallyAdjustContentInsets={false}
                        source={{uri: this.url}}
                        style={{height: h}}
                        startInLoadingState ={true}
                        onNavigationStateChange={(navState) => {
                            console.log(navState);
                        }}
                        onMessage={(e)=>{
                            console.log(JSON.parse(e.nativeEvent.data));
                        }}
                    />
                </View>
                <View style={{width: width, height: 120,}}>
                    <Image source={{uri: fimg}} style={styles.firstRowImage}>
                        <Text style={styles.bigText} numberOfLines={1}>{name}</Text>
                        <Text style={styles.smlText} numberOfLines={3}>{text}</Text>
                    </Image>
                </View>
                <ListView
                    horizontal={true}
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

        return (
            <View key={rowID} style={styles.cityItem}>
                <View style={styles.cityHead}>
                    <Text>{name}</Text>
                    <Icon name="chevron-down" size={12} color="#666" />
                </View>
                <Image source={{uri: cimg}} style={styles.cityImage} />
                <View style={styles.cityfoot}>
                    <Icon.Button name="sign-in" size={16} color="#555" backgroundColor="transparent" onPress={(e)=>{
                        console.log('icon button');
                        console.log(e.nativeEvent);
                    }}>
                        <Text style={styles.buttonText}>{'进入' + name}</Text>
                    </Icon.Button>
                    <Icon.Button name="building" size={16} color="#555" backgroundColor="transparent">
                        <Text style={styles.buttonText}>所有商家</Text>
                    </Icon.Button>
                </View>
            </View>
        );
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    contentBox : {
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
        width: width,
        height: 120,
        padding: 10,
    },
    ScrollViewStyle : {
        width: width,
        height: itenH + 40,
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
    },
    buttonText: {
        color: '#555',
    },
});