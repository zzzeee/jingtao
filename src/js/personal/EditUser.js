/**
 * 个人中心 - 会员资料
 * @auther linzeyong
 * @date   2017.08.11
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ScrollView,
    Switch,
    Image,
    Button,
} from 'react-native';

import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';

import Utils from '../public/utils';
import Urls from '../public/apiUrl';
import InputText from '../public/InputText';
import PickerAndroidIOS from '../other/PickerAndroidIOS';
import { Size, PX, pixel, Color, FontSize } from '../public/globalStyle';
import Lang, { str_replace, TABKEY } from '../public/language';
import AppHead from '../public/AppHead';

var maxImageSizeM = 1;  // 单位M
var maxImageSize = 1024 * 1024 * maxImageSizeM;	// 1M
var maxPX = 1600;       // 像素
// More info on all the options is below in the README...just some common use cases shown here
var options = {
    title: Lang[Lang.default].pleaseSelect,
    cancelButtonTitle: Lang[Lang.default].cancel,
    takePhotoButtonTitle: Lang[Lang.default].photograph,
    chooseFromLibraryButtonTitle: Lang[Lang.default].selectAlbum,
    quality: 0.7,
    maxWidth: maxPX,
    maxHeight: maxPX,
    allowsEditing: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
};

export default class EditUser extends Component {
    //构造
    constructor(props) {
        super(props);
        this.state = {
            userBirthday: null,
            userHeadImg: null,
            userSex: 0,
        };

        this.userInfo = null;
        this.userNewName = null;
        this.userNewMail = null;
        this.userHeadData = null;
    }

    componentWillMount() {
        this.initDatas();
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if (navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { mToken, userInfo } = params;
            this.mToken = mToken || null;
            this.userInfo = userInfo || null;
            let userSex = this.userInfo.mSex || 0;
            let userHeadImg = this.userInfo.mPicture || null;
            let userBirthday = this.userInfo.mBirthday || null;
            this.userNewName = this.userInfo.mNickName || null;
            this.userNewMail = this.userInfo.mEmail || null;
            userHeadImg = userHeadImg ? {uri: userHeadImg} : require('../../images/personal/defaultHeadImg.png');
            this.setState({
                userSex,
                userHeadImg,
                userBirthday
            });
        }
    };

    render() {
        if (!this.mToken || !this.userInfo) return null;
        let name = this.userInfo.mNickName || null;
        let mail = this.userInfo.mEmail || null;
        let mobile = this.userInfo.mPhone || null;
        let sexs = [{
            name: '请选择',
            value: 0,
        }, {
            name: '男',
            value: 1,
        }, {
            name: '女',
            value: 2,
        },];
        let { userSex, userHeadImg, userBirthday } = this.state;
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].userInfo}
                    goBack={true}
                    navigation={this.props.navigation}
                />
                <ScrollView contentContainerStyle={styles.bodyBox}>
                    <TouchableOpacity onPress={this.selectLocalImage}>
                        <View style={styles.headView}>
                            <Image
                                source={userHeadImg}
                                style={styles.headImage}
                            />
                            <Text>点击更改</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.inputView}>
                        <Text style={styles.inputText}>昵称</Text>
                        <View style={styles.inlineRight}>
                            <InputText 
                                defaultValue={name} 
                                maxLength={20}
                                onChange={(val)=>this.userNewName=val}
                            />
                        </View>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputText}>性别</Text>
                        <View style={styles.inlineRight}>
                            <PickerAndroidIOS
                                options={sexs}
                                initValue={parseInt(userSex)}
                                selectLab='name'
                                selectVal='value'
                                onValueChange={(val) => {
                                    console.log(val);
                                    this.setState({ userSex: val });
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputText}>邮箱</Text>
                        <View style={styles.inlineRight}>
                            <InputText 
                                defaultValue={mail} 
                                maxLength={30}
                                onChange={(val)=>this.userNewMail=val}
                            />
                        </View>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputText}>手机</Text>
                        <View style={[styles.inlineRight, {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                        }]}>
                            <Text style={styles.mobileText}>{mobile}</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.rowRightIcon} />
                        </View>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputText}>出生日期</Text>
                        <View style={styles.inlineRight}>
                            <DatePicker
                                date={userBirthday}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
                                minDate="1960-01-01"
                                maxDate="2012-01-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                style={{
                                    width: (Size.width - 36) * 3.5 / 4.5,
                                }}
                                onDateChange={(date) => {
                                    this.setState({ userBirthday: date });
                                }}
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        right: 0,
                                        top: 4,
                                    },
                                    dateInput: {
                                        flex: 1,
                                        height: 34,
                                        borderWidth: pixel,
                                        borderColor: Color.lavender,
                                        borderRadius: 5,
                                    }
                                }}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.btnSaveStyle} onPress={this.updateUserInfo}>
                        <Text style={styles.btnSaveText}>{Lang[Lang.default].save}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    //更新会员资料
    updateUserInfo = () => {
        let name = Utils.trim(this.userNewName) || null;
        if (!name) {
            alert('昵称不能为空');
        }
        let uName = this.userInfo.mNickName || null;
        let uMail = this.userInfo.mEmail || null;
        let uBirthday = this.userInfo.mBirthday || null;
        let uSex = this.userInfo.mSex || 0;
        //判断是否修改信息
        if (!this.userHeadData && uName == name && 
            uSex == this.state.userSex &&
            uMail == this.userNewMail && this.state.userBirthday == uBirthday) {
            alert('资料未修改，无需提交。');
            return false;
        }
        let obj = {
            mToken: this.mToken,
            mPicture: this.userHeadData,
            mNickName: name,
            mBirthday: this.state.userBirthday,
            mEmail: this.userNewMail,
            mSex: this.state.userSex,
        };
        console.log(obj);
        Utils.fetch(Urls.updateUserInfo, 'post', obj, (result)=> {
            console.log(result);
            if (result && result.sTatus == 1) {
                this.props.navigation.navigate('TabNav', {
                    PathKey: TABKEY.personal,
                });
            }else if(result.sMessage) {
                alert(result.sMessage);
            }
        });
    }

    //选择本地图片
    selectLocalImage = () => {
        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info below in README)
         */
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else if (!response.data) {
                return false;
            } else if (response.width > maxPX || response.height > maxPX) {
                alert('你上传的图片像素过大(最大' + maxPX + '*' + maxPX + ')', );
                return false;
            } else if (response.type != 'image/jpeg' &&
                response.type != 'image/png' &&
                response.type != 'image/gif' &&
                response.type != 'image/bmp') {
                alert('你上传的图片类型(' + response.type + ')不可用');
                return false;
            } else {
                this.userHeadData = response.data;
                let source = { uri: response.uri };
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    userHeadImg: source,
                });
            }
        });
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headView: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingRight: 6,
        paddingLeft: 6,
    },
    bodyBox: {
        padding: 15,
    },
    headImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    inputView: {
        height: 36,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
    },
    inputText: {
        color: '#444',
        flex: 1,
    },
    inlineRight: {
        flex: 3.5,
    },
    inlineRight2: {
        flex: 3.5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    btnAddUser: {
        height: 32,
        marginTop: 50,
        marginBottom: 30,
    },
    mobileText: {
        fontSize: 13,
        color: Color.lightBack,
        paddingRight: 10,
    },
    rowRightIcon: {
        width: 26,
        height: 26,
    },
    btnSaveStyle: {
        height: PX.rowHeight2,
        borderRadius: 5,
        backgroundColor: Color.mainColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 10,
    },
    btnSaveText: {
        fontSize: 14,
        color: '#fff',
    },
});