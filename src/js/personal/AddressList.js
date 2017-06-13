/**
 * 个人中心 - 我的地址
 * @auther linzeyong
 * @date   2017.06.13
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';

export default class AddressList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addresss: [],
        };
        this.mToken = null;
    }

    componentWillMount() {
        this.mToken = (this.props.navigation && 
            this.props.navigation.state &&
            this.props.navigation.state.params && 
            this.props.navigation.state.params.mToken) ?
            this.props.navigation.state.params.mToken : null;
    }

    componentDidMount() {
        this.initDatas();
    }

    initDatas = () => {
        if(this.mToken) {
            let that = this;
            Utils.fetch(Urls.getUserAddressList, 'post', {
                mToken: this.mToken,
            }, (result)=>{
                console.log(result);
                if(result && result.sTatus && result.addressAry) {
                    let addresss = result.addressAry || [];
                    that.setState({ addresss });
                }
            });
        }
    };

    addNewAddress = () => {
        let { navigation } = this.props;
        if(this.mToken && navigation) {
            navigation.navigate('AddressAdd', {
                mToken: this.mToken,
                addressNum: this.state.addresss.length,
            });
        }
    };

    setDefaultAddress = (index, said) => {
        if(said && this.mToken) {
            let addresss = this.state.addresss;
            Utils.fetch(Urls.editUserAddress, 'post', {
                mToken: this.mToken,
                saID: said,
                saSelected: 1,
            }, (result) => {
                console.log(result);
                if(result && result.sMessage) {
                    Toast.show(result.sMessage, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.CENTER,
                        hideOnPress: true,
                    });
                }
                if(result && result.sTatus == 1) {
                    for(let i in addresss) {
                        if(i == index) {
                            addresss[i].saSelected = 1;
                        }else {
                            addresss[i].saSelected = 0;
                        }
                    }
                    this.setState({ addresss });
                }
            });
        }
    };

    render() {
        let { navigation } = this.props;
        let that = this;
        let scrollref = null;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].addressList}
                    left={<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.goBack(null);
                    }} src={require("../../images/back.png")} />}
                    onPress={() => {
                        scrollref && scrollref.scrollTo({x: 0, y: 0, animated: true});
                    }}
                />
                <View style={styles.flex}>
                    <ScrollView contentContainerStyle={styles.scrollStyle} ref={(_ref)=>scrollref=_ref}>
                        {this.state.addresss.map((item, index) => {
                            let said = item.saID || null;
                            let name = item.saName || '';
                            let phone = item.saPhone || '';
                            let province = item.saProvince || '';
                            let city = item.saCity || '';
                            let regoin = item.saDistinct || '';
                            let address = item.saAddress || '';
                            let fullAddress = province + city + regoin + address;
                            let isSelect = (item.saSelected && item.saSelected != '0') ? 1 : 0;
                            let img = isSelect ? 
                                require("../../images/car/select.png") :
                                require("../../images/car/no_select.png");
                            return (
                                <View key={index} style={styles.addressItem}>
                                    <View style={styles.addressFristRow}>
                                        <Text numberOfLines={1} style={styles.defaultFont}>{name}</Text>
                                        <Text numberOfLines={1} style={styles.defaultFont}>{phone}</Text>
                                    </View>
                                    <View style={styles.addressMiddleRow}>
                                        <Text style={styles.defaultFont}>{fullAddress}</Text>
                                    </View>
                                    <View style={styles.addressFootRow}>
                                        <View>
                                            <BtnIcon 
                                                width={20}
                                                text={Lang[Lang.default].setDefault}
                                                src={img}
                                                press={()=>{
                                                    if(!isSelect && said) that.setDefaultAddress(index, said);
                                                }}
                                            />
                                        </View>
                                        <View style={styles.rowStyle}>
                                            <BtnIcon 
                                                width={20}
                                                text={Lang[Lang.default].edit}
                                                src={require("../../images/edit.png")} 
                                            />
                                            <BtnIcon 
                                                width={20}
                                                text={Lang[Lang.default].delete}
                                                src={require("../../images/login/close.png")} 
                                            />
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
                <TouchableOpacity onPress={this.addNewAddress} style={styles.btnAddAddress}>
                    <Image source={require('../../images/personal/add.png')} style={styles.addAddressImg} />
                    <Text style={styles.addAddressText}>{Lang[Lang.default].addAddress}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Color.lightGrey,
    },
    defaultFont: {
        fontSize: 13,
        color: Color.lightBack,
        lineHeight: 19,
    },
    rowStyle: {
        flexDirection: 'row',
    },
    addressItem: {
        backgroundColor: '#fff',
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        marginTop: PX.marginTB,
        paddingTop: 5,
    },
    addressFristRow: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressMiddleRow: {
        height: 65,
    },
    addressFootRow: {
        height: PX.rowHeight2,
        borderTopWidth: pixel,
        borderTopColor: Color.lavender,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btnAddAddress: {
        width: Size.width - (PX.marginLR * 2),
        height: PX.rowHeight1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: Color.mainColor,
        flexDirection: 'row',
        marginLeft: PX.marginLR,
        marginBottom: PX.marginTB,
    },
    addAddressImg: {
        width: 20,
        height: 20,
    },
    addAddressText: {
        paddingLeft: 8,
        fontSize: 13,
        color: '#fff',
    },
});