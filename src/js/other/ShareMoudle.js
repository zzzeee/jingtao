/**
 * 分享选项菜单
 * @auther linzeyong
 * @date   2017.05.02
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

var WeChat=require('react-native-wechat');
import Toast from 'react-native-root-toast';
import Lang, {str_replace} from '../public/language';
import { Size, pixel, Color } from '../public/globalStyle';

var itemMargin = 30;
var rowItemNumber = 4;
var itemWidth = (Size.width - ((rowItemNumber + 1) * itemMargin)) / rowItemNumber;

export default class ShareMoudle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible || false,
        };

        this.shareList = ['shareToTimeline', 'shareToSession'];
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.visible) {
            this.setState({visible: true});
        }
    }

    hideModal = () => {
        this.props.setStartShare && this.props.setStartShare(false);
        this.setState({visible: false});
    };

    createShareList = (datas) => {
        let slist = this.shareList;
        let _list = [];
        if(typeof(datas) == 'object' && datas.length > 0) {
            for(let i in datas) {
                if(typeof(datas[i]) == 'object' && datas[i].to) {
                    let isok = false;
                    for(let s of slist) {
                        if(s == datas[i].to) {
                            isok = true;
                            break;
                        }
                    }
                    isok && _list.push(datas[i]);
                }
            }
        }
        return _list;
    };

    render() {
        let that = this;
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => {}}
            >
                <View style={styles.bodyStyle}>
                    <TouchableOpacity style={styles.flex} onPress={this.hideModal} onLongPress={this.hideModal} />
                    <View style={styles.shareBox}>
                        <ScrollView contentContainerStyle={styles.scrollviewStyle} horizontal={true}>
                            {this.createShareList(this.props.shares).map(function(item, index) {
                                let name = item.name || '';
                                let icon = item.icon || {};
                                return (
                                    <View key={index} style={styles.shareItemStyle}>
                                        <TouchableOpacity style={styles.shareImageBox} activeOpacity={1} onPress={()=>{
                                            that.hideModal();
                                            if(typeof(item.obj) == 'object' && item.to && item.obj.type && item.obj.webpageUrl) {
                                                WeChat.isWXAppInstalled()
                                                .then((isInstalled) => {
                                                    if (isInstalled) {
                                                        WeChat[item.to](item.obj)
                                                        .then((result) => {
                                                            console.log(result);
                                                        })
                                                        .catch((error) => {
                                                            console.log(error);
                                                        });
                                                    } else {
                                                        Toast.show(Lang[Lang.default].shareErrorAlert, {
                                                            duration: Toast.durations.LONG,
                                                            position: Toast.positions.CENTER,
                                                            hideOnPress: true,
                                                        });
                                                    }
                                                });
                                            }else {
                                                Toast.show(Lang[Lang.default].missParam, {
                                                    duration: Toast.durations.LONG,
                                                    position: Toast.positions.CENTER,
                                                    hideOnPress: true,
                                                });
                                            }
                                        }}>
                                            <Image source={icon} style={styles.shareImageStyle} />
                                        </TouchableOpacity>
                                        <Text style={styles.shareItemTextStyle} numberOfLines={1}>{name}</Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <View style={styles.btnCancelBox}>
                            <Text style={styles.btnCancel} onPress={this.hideModal}>{Lang[Lang.default].cancel}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    bodyStyle: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'flex-end',
    },
    shareBox: {
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    scrollviewStyle: {
        paddingLeft: itemMargin / 2,
        paddingRight: itemMargin / 2,
    },
    shareItemStyle: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: itemWidth,
        margin: itemMargin / 2,
    },
    shareImageBox: {
        width: itemWidth,
        height: itemWidth,
    },
    shareImageStyle: {
        width: itemWidth - 1,
        height: itemWidth - 1,
        borderRadius: (itemWidth - 1) / 2,
        borderWidth: pixel,
        borderColor: Color.lavender,
    },
    shareItemTextStyle: {
        fontSize: 12,
        color: Color.lightBack,
        paddingTop: 6,
    },
    btnCancelBox: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: pixel,
        borderTopColor: Color.lavender,
    },
    btnCancel: {
        fontSize: 14,
        color: Color.steelBlue,
        paddingTop: 8,
        paddingBottom: 8,
    },
});