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
    Button,
} from 'react-native';

import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import { Size, pixel, PX, Color } from '../public/globalStyle';
import Utils from '../public/utils';
import Lang, {str_replace} from '../public/language';

var scrollItemHeight = 40;
var sessionRowHeight = 40;
var classItemHeight = 100;
var classItemImgHeight = 60;
var bodyHeight = Size.height - PX.statusHeight - PX.headHeight - PX.tabHeight - 5;

export default class ClassScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            _dataSource: null,
            selectListID: 0,
            load_or_error: null,
            dataSource: new ListView.DataSource({ 
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }),
        };

        this.isScrollEnd = false;
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
                // console.log(ret);
                // console.log(minHeightList);
                that.minHeightList = minHeightList;
                that.rowIdList = rowID;
                that.setState({
                    datas: ret,
                    _dataSource: sessionArr,
                    load_or_error: null,
                    dataSource: that.state.dataSource.cloneWithRowsAndSections(sessionArr),
                });
            }
        }, function(view) {
            that.setState({load_or_error: view});
        });
    }

    render() {
        let rightList = (
            <ScrollView 
                ref={(_ref)=>this.ref_listview=_ref}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollStyle2}
                onScroll={this.onScroll_List}
            >
                {this.state.datas && this.state.datas.map(this.renderScrollRight)}
            </ScrollView>
        );

        // let rightList = (
        //     <ListView
        //         initialListSize={50}
        //         ref={(_ref)=>this.ref_listview=_ref}
        //         onScroll={this.onScroll_List}
        //         contentContainerStyle={styles.listViewStyle}
        //         enableEmptySections={true}
        //         dataSource={this.state.dataSource}
        //         renderRow={this._renderItem}
        //         renderSectionHeader={this._renderSectionHeader}
        //         showsVerticalScrollIndicator={false}
        //     />
        // );
        
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].tab_class}
                    right={(<BtnIcon 
                        style={styles.btnRight} 
                        width={PX.headIconSize} 
                        src={require("../../images/search.png")}
                        press={()=>this.props.navigation.navigate('Search')}
                    />)}
                />
                {this.state.load_or_error ? 
                    this.state.load_or_error : 
                    <View style={styles.container}>
                        <View style={{backgroundColor: Color.floralWhite}}>
                            <ScrollView 
                                ref={(_ref)=>this.ref_scrollview=_ref}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollStyle}
                            >
                                {this.state.datas && this.state.datas.map(this.renderScrollRow)}
                            </ScrollView>
                        </View>
                        <View style={styles.flex}>
                            {rightList}
                        </View>
                    </View>
                }
            </View>
        );
    }

    renderScrollRow = (obj, i) => {
        let selectId = this.state.selectListID;
        let name = obj.cName || '';
        return (
            <TouchableOpacity key={i} onPress={()=>{
                if(this.ref_listview) {
                    let offsetY = this.minHeightList[i];
                    if(!this.isScrollEnd || offsetY < this.minHeightList[this.minHeightList.length - 1] - bodyHeight) {
                        this.lockScrollView = true;
                    }
                    this.lockOffsetY = offsetY;
                    this.ref_listview.scrollTo({x: 0, y: offsetY, animated: true});
                    this.setState({selectListID: i,});
                }
            }}>
                <View style={[styles.scrollRowItem, {
                    borderTopWidth: (selectId == i) ? pixel : 0,
                    borderBottomWidth: (selectId == i) ? pixel : 0,
                    borderLeftColor: (selectId == i) ? Color.mainColor : 'transparent',
                    backgroundColor: (selectId == i) ? '#fff' : 'transparent',
                }]}>
                    <Text style={styles.leftClassifyText}>{name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    renderScrollRight = (obj, i) => {
        let { navigation } = this.props;
        let selectId = this.state.selectListID;
        let cID = obj.cID || 0;
        let title = obj.cName || '';
        let child = obj.child || [];

        return (
            <View key={i}>
                <View style={styles.listSessionRow}>
                    <Text style={[styles.sessionName, {
                        borderLeftColor: selectId == i ? Color.mainColor : Color.floralWhite,
                    }]}>{title}</Text>
                    <View style={styles.rowRightBox}>
                        <Text style={styles.smallText}>{Lang[Lang.default].viewAll}</Text>
                        <Image source={require('../../images/list_more.png')} style={styles.smallIcon} />
                    </View>
                </View>
                <View style={styles.sessionItemBox}>
                {child.map((item, index) => {
                    let id = item.cID || 0;
                    let name = item.cName || '';
                    let imgurl = item.cdImg || null;
                    let img = imgurl ? {uri: imgurl} : require('../../images/empty.png');
                    return (
                        <TouchableOpacity key={i + '-' + index} onPress={()=>{
                            if(navigation && id) {
                                navigation.navigate('ProductList', {
                                    cId: id,
                                    cName: name,
                                });
                            }
                        }} style={styles.classifyItem}>
                            <Image source={img} style={styles.classifyImg} />
                            <View style={styles.classifyNameView}>
                                <Text style={styles.classifyNameText}>{name}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
                </View>
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
                    borderLeftColor: isSelect ? Color.mainColor : Color.floralWhite,
                }]}>{sessonID}</Text>
                <View style={styles.rowRightBox}>
                    <Text style={styles.smallText}>{Lang[Lang.default].viewAll}</Text>
                    <Image source={require('../../images/list_more.png')} style={styles.smallIcon} />
                </View>
            </View>
        );
    };

    onScroll_List = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        let hList = this.minHeightList;
        let canScrollHeight = hList[hList.length - 1] - bodyHeight;

        if(offsetY >= canScrollHeight) {
            this.isScrollEnd = true;
        }else {
            this.isScrollEnd = false;
        }

        if(this.lockScrollView) {
            if(offsetY == this.lockOffsetY || offsetY >= canScrollHeight) {
                this.lockScrollView = false;
                return false;
            }
        }else if(offsetY <= canScrollHeight) {
            for(let i in hList) {
                if(hList[i] >= offsetY) {
                    let sid = i - 1;
                    if(sid >= 0 && sid < (hList.length - 1)) {
                        let offset = (sid + 1) * scrollItemHeight;
                        if(sid == 0) {
                            this.ref_scrollview.scrollTo({x: 0, y: 0, animated: true});
                        }else if(offset > bodyHeight) {
                            this.ref_scrollview.scrollTo({x: 0, y: (offset - bodyHeight), animated: true});
                        }
                        this.state.dataSource.sectionHeaderShouldUpdate(sid);
                        this.setState({selectListID: sid,});
                        return false;
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
    btnRight: {
        paddingRight: 12,
    },
    scrollStyle: {
        width: classItemHeight,
    },
    scrollStyle2: {
        width: Size.width - classItemHeight,
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
        borderTopWidth: pixel,
        borderTopColor: Color.lavender
    },
    sessionName: {
        color: Color.lightBack,
        fontSize: 12,
        paddingLeft: 8,
        borderLeftWidth: 2,
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
    sessionItemBox: {
        flexDirection : 'row',
		flexWrap: 'wrap',
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