import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
} from 'react-native';

import Util from '../public/utils';
import urls from '../public/apiUrl';
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
        this.initDatas(this.props.pid);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.isUpdate && nextState != this.state) {
            return true;
        }else {
            return false;
        }
    }
    
    // 获取数据
    initDatas = (id) => {
        let that = this;
        if(id > 0) {
            Util.fetch(urls.getCityAndProduct, 'post', {
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
                style={styles.listViewStyle}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={this.renderItem.bind(this)}
                renderHeader ={(props)=><HeadBox datas={this.state.datas} />}
            />
        );
    }

    // 列表的行内容
    renderItem = (obj, sectionID, rowID) => {
        if(!obj || !obj.proAdsAry || obj.proAdsAry.length == 0) return null;
        return (
            <View style={styles.itemBox}>
                <CityItem city={obj} />
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