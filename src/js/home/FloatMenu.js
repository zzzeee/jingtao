/**
 * 首页城市隐藏菜单
 * @auther linzeyong
 * @date   2017.04.18
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    Image,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
var WeChat=require('react-native-wechat');
import ShareMoudle from '../other/ShareMoudle';
import Lang, {str_replace} from '../public/language';
import { Size, pixel, Color } from '../public/globalStyle';

var itemH = 46;
export default class FloatMenu extends Component {
    // 默认参数
    static defaultProps = {
        cityName: '',
        visible: false,
        nativeEvent: {},
    };
    // 参数类型
    static propTypes = {
        cityName: PropTypes.string,
        visible: PropTypes.bool,
        nativeEvent: PropTypes.object,
        hideMenu: PropTypes.func,
        btnSize: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            startShare: false,
        };
        this.renderObject = this.renderObject.bind(this);
        /**
         * {
            'title' : Lang[Lang.default].shareCity,
            'icon' : require('../../images/home/share.png'),
            'detail' : '',
            'press' : this.showStartShare,
            }, 
         */
        this.buttons = [{
            'title' : Lang[Lang.default].sellSpecialty,
            'icon' : require('../../images/home/partner.png'),
            'detail' : Lang[Lang.default].sellSpecialty_txt,
            'press' : ()=>{
                this.props.hideMenu();
                this.props.navigation.navigate('Join');
            },
        }, {
            'title' : Lang[Lang.default].hide,
            'icon' : require('../../images/home/hide.png'),
            'detail' : Lang[Lang.default].hide_txt,
            'press' : this.hideCity,
        }];
    }

    //显示分享选项
    showStartShare = () => this.setStartShare(true);

    //设置是否显示分享选项
    setStartShare = (isShow) => {
        if(!isShow) {
            this.props.hideMenu();
        }
        this.setState({startShare: isShow});
    };

    //分享城市
    shareCity = () => {
        let name = this.props.cityName || '';
        let img = this.props.shareObj.img || '';
        if(WeChat && name) {
            WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    WeChat.shareToSession({
                        type: 'news',
                        title: name,
                        description: str_replace(Lang[Lang.default].shareText, name),
                        thumbImage: img,
                        webpageUrl: 'http://ceshi.ub33.cn/newmap/index.html',
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                } else {
                    console.log(Lang[Lang.default].shareErrorAlert);
                    alert(Lang[Lang.default].shareErrorAlert);
                }
            });
        }
    };

    //隐藏城市
    hideCity = () => {
        let id = this.props.shareObj.cityId || null;
        if(this.props.addHideCity && id) {
            this.props.addHideCity(id);
        }
        this.props.hideMenu();
    };

    render() {
        if(!this.props.nativeEvent || !this.props.cityName) {
            return null;
        }else if(this.state.startShare) {
            let name = this.props.cityName || '';
            let img = this.props.shareObj.img || '';
            let shareInfo = [{
                to: 'shareToSession',
                name: Lang[Lang.default].wxFriends,
                icon: require('../../images/empty.jpg'),
                obj: {
                    type: 'news',
                    title: name,
                    thumbImage: img,
                    webpageUrl: 'http://ceshi.ub33.cn/newmap/index.html'
                },
            }, {
                to: 'shareToTimeline',
                name: Lang[Lang.default].circleOfFriends,
                icon: require('../../images/empty.jpg'),
                obj: {
                    type: 'news',
                    title: name,
                    thumbImage: img,
                    webpageUrl: 'http://ceshi.ub33.cn/newmap/index.html'
                },
            },];
            return <ShareMoudle shares={shareInfo} visible={true} setStartShare={this.setStartShare} />;
        }
        let localY = this.props.nativeEvent.locationY || 0;
        let pageY = this.props.nativeEvent.pageY || 0;
        let btnSize = this.props.btnSize || 0;
        let menuH = this.buttons.length * itemH;
        let sHeight = Size.height - 80;
        let top = 0, arrowUp = false;
        let offsetY = btnSize - localY;
        
        if(sHeight - pageY - offsetY > menuH) {
            top = pageY + offsetY;
        }else if(pageY - localY > menuH) {
            top = pageY - localY - menuH;
        }
        //console.log('height=' + sHeight + ', pageY=' + pageY + ', menuH=' + menuH);
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {}}
            >
                <TouchableOpacity 
                    style={styles.btnBody} 
                    activeOpacity={1} 
                    onPress={this.props.hideMenu}
                    onLongPress={this.props.hideMenu}
                >
                    <View style={[styles.shareBox, {top : top}]}>
                        {this.buttons.map((tab, i) => this.renderObject(tab, i))}
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    renderObject = (obj, i) => {
        let { cityName } = this.props;
        let title = obj.title || null;
        let detail = obj.detail || null;
        return (
            <TouchableOpacity key={i} onPress={obj.press}>
                <View style={styles.shareRow}>
                    <Image source={obj.icon} style={styles.icon} />
                    <View style={styles.textBox}>
                        {title ?
                            <Text numberOfLines={1} style={styles.bigText}>{str_replace(title, cityName)}</Text>
                            : null
                        }
                        {detail ?
                            <Text numberOfLines={1} style={styles.smallText}>{str_replace(detail, cityName)}</Text>
                            : null
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    btnBody: {
        width: Size.width,
        height: Size.height,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    shareBox: {
        position: 'absolute',
        left: 0,
        borderRadius: 5,
        width: Size.width - 20,
        marginLeft: 10,
        backgroundColor: '#fff',
    },
    shareRow: {
        flex: 1,
        height: itemH,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: pixel,
        borderColor: Color.lavender,
        borderRadius: 5,
    },
    icon: {
        width: 26,
        height: 26,
        marginLeft: 16,
        marginRight: 16,
    },
    textBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    bigText: {
        alignItems: 'center',
        fontSize: 15,
        color: Color.lightBack,
    },
    smallText: {
        fontSize: 12,
        color: Color.gainsboro,
    },
});