import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class ShareModal extends Component {
    constructor(props) {
        super(props);

        this.renderObject = this.renderObject.bind(this);
        this.buttons = [{
            'title' : '分享到微信',
            'icon' : 'share-square-o',
            'press' : null,
        }, {
            'title' : '分享到微博',
            'icon' : 'share-square-o',
            'press' : null,
        }, {
            'title' : '收藏',
            'icon' : 'star',
            'press' : null,
        }];
    }

    render() {
        let pageY = this.props.pageY || 0;
        let menuH = this.buttons.length * 40 + 10;
        let top = 0, arrowUp = false, arrowDown = false;
        if(height - pageY > menuH) {
            top = pageY;
            arrowUp = true;
        }else if(pageY > menuH) {
            top = pageY - menuH;
            arrowDown = true;
        }


        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {}}
            >
                <TouchableHighlight style={styles.btnBody} underlayColor='transparent' onPress={()=>{
                    this.props.showModal(false, 0, false);
                }} >
                    <View style={[styles.shareBox, {top : top}]}>
                        {arrowUp ? 
                        <View style={[styles.smallIconBox, {marginBottom : -5, justifyContent: 'flex-start'}]}>
                            <Icon name="sort-up" size={14} color="#fff" />
                        </View>
                        : null}
                        {this.buttons.map((tab, i) => this.renderObject(tab, i))}
                        {arrowDown ? 
                        <View style={[styles.smallIconBox, {marginTop : -5, justifyContent: 'flex-end'}]}>
                            <Icon name="sort-down" size={14} color="#fff" />
                        </View>
                        : null}
                    </View>
                </TouchableHighlight>
            </Modal>
        );
    }

    renderObject = (obj, i) => {
        return (
            <TouchableHighlight key={i} underlayColor='transparent' onPress={()=>{return false;}} >
                <View style={styles.shareRow}>
                    <Icon.Button name={obj.icon} size={16} color="#555" backgroundColor="transparent" onPress={obj.press}>
                        <Text style={styles.buttonText}>{obj.title}</Text>
                    </Icon.Button>
                </View>
            </TouchableHighlight>
        );
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    btnBody: {
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    shareBox: {
        width: width,
        position: 'absolute',
        left: 0,
    },
    shareRow: {
        height: 40,
        paddingLeft: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    smallIconBox: {
        height: 10,
        alignItems: 'flex-end',
        paddingRight : 20,
    },
});