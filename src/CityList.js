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
} from 'react-native';

import HeadBox from './HeadBox';
import CityItem from './CityItem';

export default class CityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
        this.url = 'http://vpn.jingtaomart.com/chinamap/index.html';
    }

    componentDidMount() {
        this.initDatas(this.props.pid);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.updateAll;
    }

    initDatas = (id) => {
        let that = this;
        let data_url = 'http://vpn.jingtaomart.com/api/RegionController/getCityListByProvinceID?pID=' + id;
        fetch(data_url, {})
        .then((response) => response.json())
        .then((ret) => {
            if(ret && ret.sTatus) {
                that.setState({
                    datas: ret,
                    dataSource: that.state.dataSource.cloneWithRows(ret.cInfo)
                });
            }
        })
        .catch((error) => {
            console.warn(error);
        });
    };

    render() {
        if(!this.state.datas) return null;
        
        return (
            <ListView
                style={styles.listViewStyle}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={this.renderItem.bind(this)}
                renderHeader ={(props)=><HeadBox datas={this.state.datas} showModal={this.props.showModal} />}
            />
        );
    }

    renderItem = (obj, sectionID, rowID) => {
        return (
            <View style={styles.itemBox}>
                <CityItem city={obj} showModal={this.props.showModal} />
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
    },
    itemBox: {
        paddingTop : 5,
        paddingBottom: 5,
        backgroundColor : '#ccc',
    },
});