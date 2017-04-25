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
    TouchableOpacity,
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, pixel, PX, Color } from '../public/globalStyle';
import Utils from '../public/utils';
import Lang, {str_replace} from '../public/language';

var scrollItemHeight = 40;
var sessionRowHeight = 40;
var classItemHeight = 100;
var classItemImgHeight = 60;
var bodyHeight = Size.height - PX.statusHeight - PX.headHeight - PX.tabHeight;

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

        this.lockOffsetY = null;
        this.lockScrollView = false;
        this.rowIdList = null;
        this.minHeightList = null;
        this.ref_scrollview = null;
        this.ref_listview = null;
        this.renderScrollRow = this.renderScrollRow.bind(this);
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
                // console.log(minHeightList);
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
                    ref={(_ref)=>this.ref_scrollview=_ref}
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
            <TouchableOpacity key={i} onPress={()=>{
                let offsetY = this.minHeightList[i];
                this.ref_listview.scrollTo({x: 0, y: offsetY, animated: true});
                this.lockScrollView = true;
                this.lockOffsetY = offsetY;
                this.setState({selectListID: i,});
            }}>
                <View style={[styles.scrollRowItem, {
                    borderTopWidth: (selectId == i) ? pixel : 0,
                    borderBottomWidth: (selectId == i) ? pixel : 0,
                    borderLeftColor: (selectId == i) ? Color.mainColor : 'transparent',
                    backgroundColor: (selectId == i) ? '#fff' : 'rgba(243, 244, 247, 1)',
                }]}>
                    <Text style={styles.leftClassifyText}>{name}</Text>
                </View>
            </TouchableOpacity>
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
        let rIdList = this.rowIdList;
        // console.log(offsetY);

        if(this.lockScrollView) {
            if(offsetY == this.lockOffsetY) this.lockScrollView = false;
        }else {
            if(offsetY > (hList[hList.length - 1] - bodyHeight - sessionRowHeight)) {
                let session_count = this.state.dataSource.getSectionLengths().length;
                this.ref_scrollview.scrollToEnd({animated: true});
                this.setState({selectListID: session_count - 1,});
            }else {
                for(let i in hList) {
                    if(hList[i] > offsetY) {
                        let sid = i - 1;
                        if(sid >= 0 && sid < (hList.length - 1)) {
                            let offset = (sid + 1) * scrollItemHeight;
                            if(sid == 0) {
                                this.ref_scrollview.scrollTo({x: 0, y: 0, animated: true});
                            }else if(offset > bodyHeight) {
                                this.ref_scrollview.scrollTo({x: 0, y: (offset - bodyHeight), animated: true});
                            }
                            this.setState({selectListID: sid,});
                            return false;
                        }
                    }
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
        borderLeftWidth: 4,
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