import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Picker,
    PickerIOS,
    Modal,
    Platform,
    TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Size, PX, pixel, Color, } from '../public/globalStyle';

export default class PickerAndroidIOS extends Component {

    //构造
    constructor(props) {
        super(props);
        this.state = {
            //...props,
            modalVisible: false,
            selectValIOS: null,
        };
    }

    render() {
        let { options, initValue, selectLab, selectVal, onValueChange } = this.props;
        let _initValue = initValue ? 
            initValue : 
            (options && options[0] && options[0][selectVal] ? options[0][selectVal] : null);

        return (
            <View style={styles.PickerBox}>
                {Platform.OS === 'ios' ?
                    <TouchableHighlight underlayColor='transparent' style={[styles.btnBox, {
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }]} onPress={()=>{ this.setState({ modalVisible: true })}}>
                            <Text numberOfLines={1} style={[styles.btnText, {
                                color: '#555',
                            }]}>{_initValue}</Text>
                            <Icon name="caret-down" size={18} color='#555' />
                    </TouchableHighlight> :
                    <Picker
                        selectedValue={_initValue}
                        onValueChange={(value) => onValueChange(value)}
                        style={styles.pickerStyle}
                    >
                        {options.map((obj, i) => this.readOptionAndroid(obj, i, selectLab, selectVal))}
                    </Picker>
                }
                {Platform.OS === 'ios' ?
                    <Modal
                        animationType={"none"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { }}
                    >
                        <View style={styles.modalBody}>
                            <View style={styles.pickerContralBox}>
                                <TouchableHighlight underlayColor='transparent' 
                                    style={[styles.btnBox, styles.btnModal]} 
                                    onPress={()=>{ this.setState({ modalVisible: false })}}>
                                    <Text numberOfLines={1} style={[styles.btnText, styles.btnModal]}>取消</Text>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor='transparent' 
                                    style={[styles.btnBox, styles.btnModal]} 
                                    onPress={()=>{
                                        this.setState({
                                            modalVisible: false,
                                        }, onValueChange(this.state.selectValIOS));
                                    }}>
                                    <Text numberOfLines={1} style={[styles.btnText, styles.btnModal]}>确定</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.pickerBottomBox}>
                                <PickerIOS
                                    selectedValue={this.state.selectValIOS ? this.state.selectValIOS : _initValue}
                                    onValueChange={(value) => this.setState({ selectValIOS: value })}
                                >
                                    {options.map((obj, i) => this.readOptionIOS(obj, i, selectLab, selectVal))}
                                </PickerIOS>
                            </View>
                        </View>
                    </Modal>
                    : null}
            </View>
        );
    }

    // 加载所有子项 安卓
    readOptionAndroid = (obj, i, lab, val) => {
        let _lab = lab ? obj[lab] : obj;
        let _val = val ? obj[val] : obj;
        return <Picker.Item key={i} label={_lab} value={_val} />;
    };

    // 加载所有子项 苹果
    readOptionIOS = (obj, i, lab, val) => {
        let _lab = lab ? obj[lab] : obj;
        let _val = val ? obj[val] : obj;
        return <PickerIOS.Item key={i} label={_lab} value={_val} />;
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    PickerBox: {
        height: 34,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Color.lavender,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    pickerIOSStyle: {
        flex: 1,
        width: Size.width,
    },
    modalBody: {
        height: 200,
        backgroundColor: '#aaa',
        borderTopWidth: 2,
        borderColor: '#222',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    pickerContralBox: {
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#444',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btnModal: {
        minWidth: 60,
        height: 26,
        padding: 2,
        backgroundColor: '#0088cc',
        borderColor: '#222',
        borderRadius: 3,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerBottomBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerStyle: {
        color: '#666',
    },
    btnBox : {
		minWidth : 100,
		height : 42,
		borderRadius : 8,
		backgroundColor : 'green',
		flexDirection : 'row',
		justifyContent: 'center',
		alignItems: 'center',
		margin : 5,
		padding : 5,
	},
	btnText : {
		color : '#fff',
	},
});
