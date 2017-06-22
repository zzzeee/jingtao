/**
 * 读取/存储 店铺搜索记录(不同于全站搜索)
 * @auther linzeyong
 * @date   2017.06.22
 */

import { AsyncStorage, } from 'react-native';

export default class SearchData {
    constructor(sid) {
        this.key = 'key_shop_search' + sid;
    }

    //获取数据
    getDatas = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.key, (error, result) => {
                if(error) {
                    reject(error);
                }else {
                    resolve(JSON.parse(result));
                }
            });
        });
    };

    //保存数据
    saveDatas = (str) => {
        let that = this;
        return new Promise((resolve, reject) => {
            that.getDatas().then((result) => {
                let datas = result || [];
                if(str) {
                    let _str = str.replace(/(^\s*)|(\s*$)/g, "");
                    let arr = [].concat(_str, datas);
                    let set = new Set(arr);
                    let newDates = [...set];
                    AsyncStorage.setItem(that.key, JSON.stringify(newDates), (err) => {
                        if(err) {
                            reject(err);
                        }else {
                            resolve(newDates);
                        }
                    });
                }else {
                    resolve(datas);
                }
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    };

    //删除数据
    delDatas = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(this.key, (error) => {
                if(error) {
                    reject(error);
                }else {
                    resolve();
                }
            });
        });
    };
}