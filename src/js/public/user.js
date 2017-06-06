/**
 * 读取/存储 用户信息(会员/游客)
 * @auther linzeyong
 * @date   2017.06.06
 */

import { AsyncStorage, } from 'react-native';

export default class User {
    constructor(key1 = 'mToken', key2 = 'tTourist') {
        this.keyMember = key1;
        this.keyTourist = key2;
    }

    //获取会员/游客ID
    getUserID = (key) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(key, (error, result) => {
                if(error) {
                    reject(error);
                }else {
                    resolve(result);
                }
            });
        });
    };

    //保存会员/游客ID
    saveUserID = (key, id) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(key, id, (error) => {
                if(error) {
                    reject(error);
                }else {
                    resolve();
                }
            });
        });
    };

    //删除会员/游客ID
    delUserID = (key) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(key, (error) => {
                if(error) {
                    reject(error);
                }else {
                    resolve();
                }
            });
        });
    };

    //获取会员ID如果没有则返回游客ID，如果也没有返回null
    getUserInfo = () => {
        let that = this;
        return new Promise((resolve, reject) => {
            that.getUserID(that.keyMember)
            .then((result) => {
                if(result) {
                    let obj = {};
                    obj[that.keyMember] = result;
                    resolve(obj);
                }else {
                    that.getUserID(that.keyTourist)
                    .then((result2) => {
                        if(result2) {
                            let obj = {};
                            obj[that.keyTourist] = result2;
                            resolve(obj);
                        }else {
                            resolve(null);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(error);
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    };
}