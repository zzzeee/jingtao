/**
 * APP分类
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    ScrollView,
    Image,
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, pixel, Color } from '../public/globalStyle';
import Utils from '../public/utils';
import Lang, {str_replace} from '../public/language';

var scrollItemHeight = 40;
var sessionRowHeight = 40;
var classItemHeight = 100;
var classItemImgHeight = 60;

export default class ClassScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            selectListID: 0,
            dataSource: new ListView.DataSource({ 
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }),
        };
        this.rowIdList = null;
        this.minHeightList = null;
        this.ref_scrollview = null;
        this.ref_listview = null;
    }

    componentDidMount() {
        let that = this;
        Utils.fetch(Urls.getProductClassify, 'get', {
            cType: 0,
        }, function(result) {
            if(result && result.classAry && result.classAry[0] && result.classAry[0].child) {
                let sessionArr = {}, 
                ret = result.classAry[0].child, 
                rowID = {},
                minHeightList = [0,];
                for(let index in ret) {
                    let name = ret[index].cName || '';
                    sessionArr[name] = ret[index].child || [];
                    rowID[name] = index;

                    let sum = index == 0 ? 0 : minHeightList[parseInt(index)];
                    minHeightList[parseInt(index) + 1] = sum + sessionRowHeight + (Math.ceil(sessionArr[name].length / 3) * classItemHeight);
                }
                console.log(minHeightList);
                that.minHeightList = minHeightList;
                that.rowIdList = rowID;
                that.setState({
                    datas: ret,
                    dataSource: that.state.dataSource.cloneWithRowsAndSections(sessionArr),
                });
            }
        });
    }

    render() {
        if(!this.state.datas) return null;
        return (
            <View style={styles.container}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollStyle}
                >
                    {this.state.datas.map((obj, i) => this.renderScrollRow(obj, i, this.state.selectListID))}
                </ScrollView>
                <ListView
                    ref={(_ref)=>this.ref_listview=_ref} 
                    onScroll={this.onScroll_List}
                    contentContainerStyle={styles.listViewStyle}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderItem}
                    renderSectionHeader={this._renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    renderScrollRow = (obj, i, selectId) => {
        let name = obj.cName || '';
        return (
            <View key={i} style={[styles.scrollRowItem, {
                borderTopWidth: (selectId == i) ? pixel : 0,
                borderBottomWidth: (selectId == i) ? pixel : 0,
                borderLeftWidth: (selectId == i) ? 4 : 0,
                backgroundColor: (selectId == i) ? '#fff' : 'rgba(243, 244, 247, 1)',
            }]}>
                <Text style={styles.leftClassifyText}>{name}</Text>
            </View>
        );
    };

    _renderItem = (obj, sessonid, rowid) => {
        let id = obj.cID || 0;
        let name = obj.cName || '';
        let imgurl = obj.cdImg || null;
        let img = imgurl ? {uri: imgurl} : require('../../images/empty.png');
        return (
            <View style={styles.classifyItem}>
                <Image source={img} style={styles.classifyImg} />
                <View style={styles.classifyNameView}>
                    <Text style={styles.classifyNameText}>{name}</Text>
                </View>
            </View>
        );
    };

    _renderSectionHeader = (sessonData, sessonID) => {
        let isSelect = (this.state.selectListID == this.rowIdList[sessonID]) ? true : false;
        return (
            <View style={styles.listSessionRow}>
                <Text style={[styles.sessionName, {
                    borderLeftWidth: isSelect ? 2 : 0,
                }]}>{sessonID}</Text>
                <View style={styles.rowRightBox}>
                    <Text style={styles.smallText}>{Lang.cn.viewAll}</Text>
                    <Image source={require('../../images/list_more.png')} style={styles.smallIcon} />
                </View>
            </View>
        );
    };

    onScroll_List = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        let hList = this.minHeightList;
        console.log(hList);
        for(let i in hList) {
            console.log('minHeightList  i' + i + ' = ' + hList[i]);
            if(hList[i] > offsetY) {
                console.log('i = ' + i);
                let sid = i - 1;
                if(sid >= 0) {
                    console.log(sid);
                    this.setState({
                        selectListID: sid,
                    });

                    return false;
                }
            }
        }
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    scrollStyle: {
        width: classItemHeight,
    },
    listViewStyle: {
        width: Size.width - classItemHeight,
        flexDirection : 'row',
		flexWrap: 'wrap',
    },
    scrollRowItem: {
        height: scrollItemHeight,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: Color.lavender,
        borderTopColor : Color.lavender,
        borderLeftColor: Color.mainColor,
    },
    leftClassifyText: {
        color: Color.lightBack,
        fontSize: 13,
    },
    listSessionRow: {
        width: Size.width - classItemHeight,
        height: sessionRowHeight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 18,
        paddingRight: 10,
    },
    sessionName: {
        color: Color.lightBack,
        fontSize: 12,
        paddingLeft: 8,
        borderLeftColor: Color.mainColor,
    },
    rowRightBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallText: {
        fontSize: 10,
        color: Color.gainsboro,
    },
    smallIcon: {
        width: 16,
        height: 16,
    },
    classifyItem: {
        width: (Size.width - classItemHeight) / 3,
        height: classItemHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    classifyImg: {
        width: classItemImgHeight,
        height: classItemImgHeight,
    },
    classifyNameView: {
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    classifyNameText: {
        color: Color.lightBack,
        fontSize: 11,
    },
});