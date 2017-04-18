import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  StatusBar,
  ListView,
  WebView,
  ScrollView,
  Dimensions,
} from 'react-native';

import HeadBox from './HeadBox';
import CityList from './CityList';
import ShareModal from './ShareModal';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var h = height * 0.68;
var h1 = height * 0.2;
var h2 = h > 100 ? 100 : h;
var itemW = width - 50;
var itenH = 200;

export default class APP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            pageY: 0,
            updateAll : true,
            modalVisible : false,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
        this.url = 'http://vpn.jingtaomart.com/chinamap/index.html';
    }

    componentDidMount() {

    }

    render() {
        return (
            <CityList pid={31} showModal={this.showModal} updateAll={this.state.updateAll} />
        );
    }

    // 设置遮罩层是否显示
    showModal = (s, y, u) => {
        this.setState({
            modalVisible : s,
            pageY : y,
            updateAll: u,
        });
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    scrollViewBox : {
        backgroundColor: '#ccc',
    },
    listViewStyle : {
        marginTop: 5,
    },
});