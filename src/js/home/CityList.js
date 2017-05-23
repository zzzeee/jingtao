/**
 * 首页 - 选中省份下方 - 城市列表
 * @auther linzeyong
 * @date   2017.04.18
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
} from 'react-native';

import Util from '../public/utils';
import Urls from '../public/apiUrl';
import HeadBox from './HeadBox';
import CityItem from './CityItem';

export default class CityList extends Component {
    // 默认参数
    static defaultProps = {
        pid: 0,
        isUpdate: true,
    };
    // 参数类型
    static propTypes = {
        pid: React.PropTypes.number.isRequired,
        isUpdate: React.PropTypes.bool.isRequired,
    };
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
    }

    componentDidMount() {
        this.initList(this.props.datas);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isUpdate) {
            this.initList(nextProps.datas);
        }
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.isUpdate && nextState != this.state) {
            return true;
        }else {
            return false;
        }
    }

    initList = (datas) => {
        if(datas) {
            let list = datas.cityProduct || [];
            this.setState({
                datas: datas,
                dataSource: this.state.dataSource.cloneWithRows(list),
            });
        }
    };
    
    // 获取数据
    initDatas = (id) => {
        if(id > 0) {
            let that = this;
            Util.fetch(Urls.getCityAndProduct, 'post', {
                pID: id,
            }, function(result) {
                if(result && result.sTatus) {
                    let ret = result.provinceAry || {};
                    let list = ret.cityProduct || [];
                    that.setState({
                        datas: ret,
                        dataSource: that.state.dataSource.cloneWithRows(list),
                    });
                }
            });
        }
    };

    render() {
        if(!this.state.datas) return null;
        return (
            <ListView
                initialListSize={2}
                style={styles.listViewStyle}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={this.renderItem.bind(this)}
                renderHeader ={(props)=><HeadBox datas={this.state.datas} navigation={this.props.navigation} />}
            />
        );
    }

    // 列表的行内容
    renderItem = (obj, sectionID, rowID) => {
        if(!obj || !obj.proAdsAry || obj.proAdsAry.length == 0) return null;
        return (
            <View style={styles.itemBox}>
                <CityItem city={obj} showFloatMenu={this.props.showFloatMenu} />
            </View>
        );
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    listViewStyle : {
    },
    itemBox: {
        marginTop: 10,
        backgroundColor: '#fff',
    },
});