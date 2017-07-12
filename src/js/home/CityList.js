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
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import Util from '../public/utils';
import Urls from '../public/apiUrl';
import HeadBox from './HeadBox';
import CityItem from './CityItem';
import { EndView } from '../other/publicEment';
import { Size, Color } from '../public/globalStyle';

export default class CityList extends Component {
    // 默认参数
    static defaultProps = {
        pid: 0,
        isUpdate: true,
    };
    // 参数类型
    static propTypes = {
        pid: PropTypes.number.isRequired,
        isUpdate: PropTypes.bool.isRequired,
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
                renderHeader ={(props)=>(
                    <HeadBox datas={this.state.datas} navigation={this.props.navigation} />
                )}
                renderFooter={()=>{
                    let list = this.state.dataSource || null;
                    if(list && list._cachedRowCount) {
                        return <EndView />;
                    }else {
                        return <View />;
                    }
                }}
            />
        );
    }

    // 列表的行内容
    renderItem = (obj, sectionID, rowID) => {
        if(!obj || !obj.proAdsAry || obj.proAdsAry.length == 0) return null;
        let banner = obj.bannerAds || [];
        let { navigation } = this.props;
        return (
            <View style={styles.itemBox}>
                {banner.length > 0 ?
                    <TouchableOpacity onPress={()=>{
                        let gid = banner[0].adUrl || null;
                        if(navigation && gid) {
                            navigation.navigate('Product', {gid: gid});
                        }
                    }}>
                        <Image source={{uri: banner[0].adImg || null}} style={styles.bannerStyle} />
                    </TouchableOpacity>
                    : null
                }
                <CityItem city={obj} showFloatMenu={this.props.showFloatMenu} navigation={this.props.navigation} />
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
    bannerStyle: {
        width: Size.width,
        height: Size.width * 0.361,
    },
});