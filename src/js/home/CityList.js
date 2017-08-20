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
    FlatList,
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
            dataSource: null,
        };
    }

    componentWillMount() {
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
                dataSource: list,
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
        if(!this.state.dataSource) return null;
        let { dataSource, datas } = this.state;
        return (
            <FlatList
                initialListSize={2}
                style={styles.listViewStyle}
                enableEmptySections={true}
                data={dataSource}
                keyExtractor={(item, index)=>index}
                renderItem={this._renderItem}
                ListHeaderComponent={()=>(
                    <HeadBox datas={datas} navigation={this.props.navigation} />
                )}
                ListFooterComponent={()=>{
                    if(dataSource && dataSource.length > 0) {
                        return <EndView />;
                    }else {
                        return <View />;
                    }
                }}
            />
        );
    }

    // 列表的行内容
    _renderItem = ({ item, index }) => {
        if(!item || !item.proAdsAry || item.proAdsAry.length == 0) return <View />;
        let banner = item.bannerAds || [];
        let { navigation, showFloatMenu, setStartShare } = this.props;
        return (
            <View style={styles.itemBox}>
                {banner.length > 0 ?
                    <TouchableOpacity onPress={()=>{
                        let type = banner[0].adType || 0;
                        let id = banner[0].adUrl || null;
                        if(navigation && id && type == 1) {
                            navigation.navigate('Product', {gid: id});
                        }else if(navigation && id && type == 0) {
                            navigation.navigate('Shop', {shopID: id});
                        }
                    }}>
                        <Image source={{uri: banner[0].adImg || null}} style={styles.bannerStyle} />
                    </TouchableOpacity>
                    : null
                }
                    <CityItem 
                        city={item} 
                        showFloatMenu={showFloatMenu} 
                        navigation={navigation}
                        setStartShare={setStartShare}
                    />
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