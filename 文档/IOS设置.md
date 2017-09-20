## 初始化项目
  react-native init jingtao --version 0.44.3

## 拷贝文件
> + index.ios.js
> + src目录  
> + package.json(可只复制部分内容), 查看src/index.js是否有未安装的组件

## 安装/Link 插件
先不安装`react-native-yunpeng-alipay`和`react-native-wechat`  

1. 其他的统一安装: npm install,

2. 统一link: react-native link

3. 单独安装react-native-yunpeng-alipay

> 测试通过版本为: 2.0.0 [参考地址](https://www.npmjs.com/package/react-native-yunpeng-alipay)
> + `npm install --save react-native-yunpeng-alipay`
> + `react-native link react-native-yunpeng-alipay`
> + *Build Phases -> Link Binary With Libraries* 添加4个文件
>   * `CoreMotion.framework`
>   * `CoreTelephony.framework`
>   * `libc++`
>   * `libz`

4. info -> URL Types 添加

> `identifier: alipay`  
> `URL Schemes: alipay*** (eg: alipay2016122004454914)`

5. AppDelegate.m文件添加如下内容
```
#import "AlipayModule.h"
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  [AlipayModule handleCallback:url];
  return YES;
}
```

## 单独安装react-native-wechat
测试通过版本为: 1.9.9 [参考地址](http://www.jianshu.com/p/3f424cccb888)  
1. npm install --save react-native-wechat   
`千万不要用 react-native link react-native-wechat`

2. Libraries 右键 -> Add Files to "jingtao" -> jingtao/node_modules/react-native-wechat/ios/RCTWeChat.xcodeproj  
`注: 选择期间注意一下 Options(右下角) -> Create groups`

3. Libraries -> RCTWeChat.xcodeproj -> Products -> libWechat.a --添加至--> Link Binary With Libraries

4. Build Phases -> Link Binary With Libraries 添加4个文件
> + SystemConfiguration.framework
> + CoreTelephony.framework (*添加alipay时已添加*)
> + libsqlite3.0
> + libc++  (*添加alipay时已添加*)
> + libz    (*添加alipay时已添加*)

5. info -> URL Types 添加
> identifier: weixin  
> URL Schemes: appid (eg: wxe2c2a29213e78cf7)

6. info > Custom iOS Target Properties 添加
> + LSApplicationQueriesSchemes (Array)
> + item0: wechat
> + item1: weixin

7. AppDelegate.m文件添加如下内容
```
#import <React/RCTLinkingManager.h>
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                            sourceApplication:sourceApplication annotation:annotation];
}
```
`注: 如果同时安装了支付宝和微信请使用以下内容当作回调函数`
```
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
[AlipayModule handleCallback:url];
return [RCTLinkingManager application:application openURL:url
                  sourceApplication:sourceApplication annotation:annotation];
}
```

## 安装QQ
[Git地址](https://github.com/reactnativecn/react-native-qq)

## 配置其他项
  1. 允许HTTP访问  
    Xcode -> 项目名(jingtao) -> Info -> Custom IOS Target Properties
    右键 App Transport Security Settings -> Add Row
    添加 Allow Arbitrary Loads(Boolean) : YES
  2. 需添加拍照和相册权限  
    info -> Add Row : Privacy - Camera Usage Description (string : we need use camera)  
    info -> Add Row : Privacy - Photo Library Usage Description (string : we need use Photo)

## 打包添加静态资源
  1. **react-native bundle**
> --entry-file ,ios或者android入口的js名称，比如index.ios.js  
> --platform ,平台名称(ios或者android)  
> --dev ,设置为false的时候将会对JavaScript代码进行优化处理。  
> --bundle-output, 生成的jsbundle文件的名称，比如./ios/bundle/index.ios.jsbundle  
> --assets-dest 图片以及其他资源存放的目录,比如./ios/bundle
> 
> 打包命令：  
> `react-native bundle --entry-file index.ios.js --platform ios --dev false --bundle-output ./ios/bundle/index.ios.jsbundle --assets-dest ./ios/bundle`
>
> 为了方便使用，也可以把打包命令写到npm script中:  
> `"bundle-ios": "node node_modules/react-native/local-cli/cli.js bundle --entry-file index.ios.js  --platform ios --dev false --bundle-output ./ios/bundle/index.ios.jsbundle --assets-dest ./ios/bundle"`
>
> 新建 bundle目录
>
> 然后运行命令直接打包  
> `npm run bundle-ios`

  2. **添加文件**
> 右键 Xcode左边 jingtao下的jingtao -> Add Files to "jingtao"  
> 选择 bundle目录, 并点击左下"Options" 选择 "Create folder references"

  3. **添加 jsCodeLocation**
> 在AppDelegate.m 中注释掉原 jsCodeLocation 开头的这行  
> 添加下面这行内容  
> `jsCodeLocation = [NSURL URLWithString:[[NSBundle mainBundle] pathForResource:@"index.ios.jsbundle" ofType:nil]];`

  4. **选择设备运行**(多运行几次)
  
  5. [参考地址](http://www.jianshu.com/p/ce71b4a8a246)