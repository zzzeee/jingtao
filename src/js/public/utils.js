/**
 * 常用工具
 * @auther linzeyong
 * @date   2017.04.18
 */

var Util = {
    /* fetch 网络请求数据
     * @param String url  请求地址
     * @param String type 请求方式： get / post
     * @param Object data 请求参数
     * @param Funtion callback 回调函数
     */
    fetch: function (url, type, data, callback) {
        var fetchOptions = {};
        var str_data = '';

        //data参数格式化
        for (let key in data) {
            var val = data[key] ? data[key] : '';

            if (val) {
                str_data += key + '=' + val + '&';
            }
        }

        if (str_data.length > 0) {
            str_data = str_data.substring(0, str_data.length - 1);
            str_data = str_data.replace(/\+/g,"%2B");
        }

        //判断请求方式
        if (type.toUpperCase() == 'POST') {
            fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: str_data
            };
        }
        else {
            url += '?' + str_data;
            url = encodeURI(url);
        }

        fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((responseText) => {
                callback(responseText);
            })
            .catch((error) => {
                console.warn(error);
            });
    },

    //网络请求出错
    fetchError: function (err, data) {
        if (err) {
            console.log(err);
        }
    },

    //去除前后空格
    trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    // 格式“yyyy-MM-dd HH:MM:SS”
    /*
     * 获取指定的日期时间
     * type = 1 时，返回  yyyy-MM-dd HH:MM:SS
     * type = 2 时，返回 yyyy-MM-dd
     */
    getFormatDate: function (date, type) {
        if (date) {
            date = new Date(date);
        }
        else {
            date = new Date();
        }

        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var currentdate;
        var DD = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        month = month < 10 ? DD[month] : month;
        day = day < 10 ? DD[day] : day;
        hour = hour < 10 ? DD[hour] : hour;
        minute = minute < 10 ? DD[minute] : minute;
        second = second < 10 ? DD[second] : second;

        if (type == 1) {
            currentdate = date.getFullYear() + seperator1 + month + seperator1
                + day + " " + hour + seperator2 + minute + seperator2 + second;
        }
        else if (type == 2) {
            currentdate = date.getFullYear() + seperator1 + month + seperator1 + day;
        }
        else {
            currentdate = '';
        }

        return currentdate;
    },
};

export default Util;