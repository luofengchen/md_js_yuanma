// 整合后的接口
// var listArr = $("#goods-list .items .con .clearfix li");
var unableArr = [];//存储所有 活动商品 活动ID的数组
var resertflag = false //是否重跑 控制器 true 为开启 false 为关闭 
var idx0 = 1;//页面的值
var idx1 = 0;//当前商品是第几个
var activity_id = "";
var callbackNum = "1"
var unablegoodsNum = 0;
var ablegoodsNum = 0;
var AllpageNum = 0;
var successNums = 0;//成功调用的次数
var successIndex = 0;//申请成功的次数
var consoleClear = 0;//因为控制台显示的信息比较冗余所以通过计时的 手段40次 清除一次
// 可以把函数分开来执行
// var qj_flag = true;
// console.log('输出获取的li的值:', listArr);
var AllArractivity_idArr = [];
//  先获取目前所有的 活动 ID 通过接口 过滤掉 已经申请过的 然后统一申请
console.log('AllpageNum.length的值:', AllpageNum);
// for (var i = 1; i <= AllpageNum; i++) {
// }
var urlGetpage = "https://try.jd.com/activity/getActivityList";
console.clear()
$.ajax({
    type: "GET",
    url: urlGetpage,
    dataType: "jsonp",
    complete: function (data) {
        AllpageNum = $(".fp-text i")[0].innerHTML || "1";
        // console.log('pagedata成功失败都有:',data.responseText);
        if (data.responseText != "") {
            var regwxp = /"pages":(\d*)/g
            var num = regwxp.exec(data.responseText);
            console.log('num页面数:', num);
            if (num != null) {
                if (num[1] != "") {
                    AllpageNum = num[1] != "" ? num[1] : AllpageNum;
                    AllpageNum = new Number(AllpageNum)
                    getactivity();
                } else {
                    getAllpageNum()
                }
            } else {
                getAllpageNum()
            }
        } else {
            getAllpageNum()
        }
    }
})
function getactivity() {
    consoleClear++;
    console.log('进入获取函数里面？？？', idx0, idx1, AllpageNum);
    if (idx0 <= AllpageNum) {
        // 电脑顶不住 那个压力 一次 只需要搞定一页就行
        // https://try.jd.com/activity/getActivityList?page=11&activityType=1
        // 首先要测试一下 整个 arr 是否能获取的到
        // var j = 15 
        // 终于找到你了 查询是否选中 接口 提交所有要查询的 activityIds 返回的 就是都已经申请过的 商品
        // https://try.jd.com/user/getApplyStateByActivityIds?activityIds=356214,364095,360123,356245,361018,360096,357457,362323,354447,354537,358363,361124,354569,357194,356233,355601,354494,359717,360991,359698
        var urlList = "https://try.jd.com/activity/getActivityList";
        var dataList = "page=" + idx0 + "&activityType=1&_=" + new Date().getTime()
        var arractivity_ids = [];
        var activity_cont = "";
        // 获取列表的数据
        $.ajax({
            type: "GET",
            url: urlList,
            data: dataList,
            dataType: "jsonp",
            complete: function (data) {
                // 成功函数调用 获取不到这个数据的值 只能在complete 里面 获取的到
                console.log('成功或失败都会调用:', data.responseText != "" ? true : false);
                // console.log('data:', data.responseText);
                var cont = data.responseText;
                var regexp = /activity_id="(\d*)" start_time/g
                // 因为 exec 函数的特性 只能这么搞了
                if (cont != "") {
                    // var arractivity_ids1 = cont.match(regexp);
                    // console.log('%c有意义:'+ arractivity_ids1, 'font-size:20px;color:blue;');
                    AllArractivity_idArr = []
                    for (var j = 0; j < 20; j++) {
                        arractivity_ids = regexp.exec(cont);
                        if (arractivity_ids != null) {
                            // console.log('%c有意义:'+ arractivity_ids, 'font-size:20px;color:blue;');
                            AllArractivity_idArr.push(arractivity_ids[1])
                            activity_cont += "," + arractivity_ids[1]
                        } else {
                            break;
                        }
                    }
                    activity_cont = activity_cont.substring(1)
                    console.log(activity_cont);
                    // activity_cont.
                    // console.log('没有进入？？不科学啊???',activity_cont);
                    // console.log('arractivity_ids:', AllArractivity_idArr, activity_cont);
                    // 最后一次停在这里了
                    urlGl = "https://try.jd.com/user/getApplyStateByActivityIds";
                    var num = [4, 5, 6, 7, 8, 9]
                    var index = num[Math.floor(Math.random() * 6)];
                    var timeout = new Number(new Date().getTime()) + index * 1000;
                    var dataGl = "activityIds=" + activity_cont + "&_=" + timeout
                    $.ajax({
                        type: "GET",
                        url: urlGl,
                        data: dataGl,
                        dataType: "jsonp",
                        success: function (data) {
                            console.log('成功获取已经申请的数据');
                            var activityId_yxzArr = []
                            // 本接口可以获取到 所有当前 20个商品里面 已申请的 activity 的ID 那么 把未申请的过滤出来即可
                            // data 本身就是一个数组
                            // console.log('data:', data);
                            ablegoodsNum += data.length;
                            for (var j = 0; j < data.length; j++) {
                                activityId_yxzArr.push((data[j].activityId).toString());
                            }
                            // console.log('能不能输出？？？:', activityId_yxzArr, AllArractivity_idArr);
                            unableArr = [];
                            for (var j = 0; j < AllArractivity_idArr.length; j++) {
                                // console.log('按顺序输出',AllArractivity_idArr[j]);
                                if (activityId_yxzArr.indexOf(AllArractivity_idArr[j]) == -1) {
                                    // console.log('可申请的值:', AllArractivity_idArr[j], j);
                                    unablegoodsNum++;
                                    unableArr.push(AllArractivity_idArr[j])
                                    // if (i == AllpageNum.length) {
                                    // }
                                }
                            }
                            console.log('%%%%%%%%%%%unableArr的长度:', unableArr.length);
                            if (consoleClear == 40) {
                                // console40次就清除一个console里面的信息 然后清零
                                consoleClear = 0;
                                console.clear()
                            }
                            if (unableArr.length == 0 || idx1 >= unableArr.length) {
                                console.log('进入这里???1');
                                idx1 = 0
                                idx0++;
                                getactivity()
                            } else {
                                console.log('进入这里？？？3');
                                postToJd()
                                // console.log('');
                            }
                        },
                        fail: function (data) {
                            console.log('失败了？？？为什么？？？:', data);
                        }
                    })
                } else {
                    getactivity()
                }
            }
        })
    } else {
        // console.log("%caaaaa","color: red; font-style: italic;font-size:20px")
        // 自定义当前样式 输出到控制台的
        console.log('%c所有申请已经申请完毕,===>总共申请' + successIndex + '次' + "申请成功" + successNums + "次", 'color: blue; font-style: italic;font-size:40px;');
        // 是否无限重跑？
        if (resertflag) {
            // 所有参数重置一下
            idx0 = 1;//页面的值
            idx1 = 0;//当前商品是第几个
            activity_id = "";
            callbackNum = "1"
            unablegoodsNum = 0;
            ablegoodsNum = 0;
            AllpageNum = 0;
            successNums = 0;//成功调用的次数
            successIndex = 0;//申请成功的次数
            // getAllpageNum()
            getactivity()
        }
    }
}
// postToJd()
function postToJd() {
    console.log('%c当前第' + idx0 + '页,第' + idx1 + "个商品", 'color: blue; font-style: italic;font-size:40px');
    // 首先获取所有页码里面的 未被申请的商品 然后 直接全部一次性调用
    // for (var i = 0; i < listArr.length; i++) {
    // var ele = listArr[i];
    // var item = $(ele).find(".try-item .try-button").text();
    // 获取的可能是文本 需要直接使用正则了
    // console.log('输出item的值:',item);
    // if (item == "我要申请") {
    // unableArr.push(listArr[i]);
    // }
    // }
    // unableArr 在这里生成
    // var ls_idx1 = idx1
    // clearTimeout(timeout)
    // var timeout =  setTimeout(function () {
    //     if (ls_idx1 == idx1) {
    //         idx1++;
    //         postToJd()
    //     }
    // }, 15000);
    startPOST();
    console.log('unableArr的内容:', unableArr);
}
function startPOST() {
    console.log('当前的idx1的值:', idx1);
    if (unableArr.length > 0) {
        if (idx1 < unableArr.length) {
            console.log('这里应该是正常的::', idx1);
            var ele = unableArr[idx1];
            activity_id = ele;
            console.log("活动ID怎么丢了::::", activity_id, unableArr, idx1);
            //  现在是有可申请的商品 所以获取 activityid获取 店铺ID
            setTimeout(function () {
                login(activity_id)
            }, 5000);
            // 一秒明显不够2秒 试试 3秒应该 够了 最短限制在 4500ms
        } else {
            console.log('不可能啊最少一次的？？？', idx1);
            idx1 = 0;
            idx0++;
            getactivity()
            // "https://try.jd.com/activity/getActivityList?page=7"
            // getactivity()
            // var path = window.location.search;
            // // 当前面有几个字符 字符的位置就是 n-1
            // var ls_regexp1 = /page=\d*/g;
            // var cont = path.match(ls_regexp1);
            // console.log('获取的页面数', cont);
            // var page = cont[0];
            // var ls_regexp2 = /\d*/g;
            // var numArrr = page.match(ls_regexp2);
            // var num = numArrr[numArrr.length - 2];
            // console.log(numArrr, num);
            // var pagenum = new Number(num) + 1;
            // window.location.href = "https://try.jd.com/activity/getActivityList?page=" + pagenum + "&activityType=1";
            // 已经提交完毕了
            console.log('提交完毕?????');
            console.log(window.location.url);
            // window.url = ""
        }
    } else {
        // 本页面 没有了 可以申请的商品 跳转到下一页
    }
}
function login(activity_id) {
    var num = [4, 5, 6, 7, 8, 9]
    var index = num[Math.floor(Math.random() * 6)];
    var timeout = new Number(new Date().getTime()) + index * 1000;
    callbackNum = "";
    var randNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var j = 0; j < 7; j++) {
        callbackNum += randNum[Math.floor(Math.random() * 9)];
    }
    // https://passport.jd.com/loginservice.aspx?callback=jQuery5690236&method=Login&_=1532855709437
    var url0 = "https://passport.jd.com/loginservice.aspx";
    var data0 = "&method=Login&_=" + timeout
    console.log('login接口怎么回事？？？', url0, data0);
    $.ajax({
        type: "GET",
        url: url0,
        data: data0,
        dataType: "jsonp",
        success: function (d) {
            console.log('登录接口成功::', d);
            // 最后一次停在这里了
            console.log('登录成功了获取活动的iD:', activity_id);
            // getone();
            getverden_Id(activity_id)
        },
        fail: function (d) {
            skipe()
            console.log('登录失败的数据？？？', d);
        }
    })
}
function getverden_Id(activity_id) {
    // var activity_id = 365899;
    var data_shopInfo_Url = "https://try.jd.com/" + activity_id + ".html";
    $.ajax({
        type: "GET",
        url: data_shopInfo_Url,
        dataType: "jsonp",
        complete: function (d) {
            // console.log('获取商品信息接口成功::', d.responseText);
            if (d != null) {
                var cont = d.responseText;
                var shopInfo_Id = ""
                var regexp = /vender_id ="(\d*)"/g
                var vender_ids = regexp.exec(cont);
                if (vender_ids != null) {
                    shopInfo_Id = vender_ids[1];
                    console.log('输出verder_id:', vender_ids);
                    if (shopInfo_Id != "") {
                        // venderId = d.data.shopInfo.venderId;
                        // 获取到了 商铺的ID 先关注 然后在申请
                        // 因为有的商品的这个参数就是找不到所有就获取整个页面来提取整个参数 明天改
                        GZgoods(shopInfo_Id);
                        SQgoods(activity_id);
                    } else {
                        GZgoods(activity_id);
                        SQgoods(activity_id);
                    }
                }else{
                    skipe()
                }
            } else {
                // 数据出错 直接跳出下一个商品
                getverden_Id()
            }
        },
    });
}
// function getShopInfo(activity_id) {
//     // https://try.jd.com/363334.html
//     console.log('获取当前商品的activity_id也是因为 查询shopinfo信息没有:', activity_id);
//     // https://try.jd.com/362125.html
//     activity_id = 362125;
//     var data_shopInfo_Url = "https://try.jd.com/" + activity_id + ".html";
//     // 直接进入商品info内部 获取 venderId 然后调用  GZgoods(venderId)
//     $.ajax({
//         type: "GET",
//         url: data_shopInfo_Url,
//         dataType: "jsonp",
//         complete: function (data) {
//             //  成功调用
//             console.log('都调用', data.responseText);
//         }
//     })
// }
function GZgoods(venderId) {
    var num = [4, 5, 6, 7, 8, 9]
    var index = num[Math.floor(Math.random() * 6)] * 1000;
    var timechuo = new Number(new Date().getTime()) + index;
    callbackNum = "";
    var randNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var j = 0; j < 7; j++) {
        callbackNum += randNum[Math.floor(Math.random() * 9)];
    }
    console.log('callbackNum:', callbackNum);
    var url = "https://follow-soa.jd.com/rpc/shardVender/follow"
    var data2 = "sysName=try.jd.com&venderId=" + venderId + "&_=" + timechuo
    $.ajax({
        type: "GET",
        url: url,
        data: data2,
        dataType: "jsonp",
        success: function (d) {
            // 关注成功然后在进行 试用申请
            console.log('关注接口成功:', d);
        },
        fail: function (d) {
            console.log('关注接口失败:', d);
            // 数据出错 直接跳出下一个商品
            skipe()
        },
        error: function (a, d) {
            console.log('关注接口出错:', d);
            // 数据出错 直接跳出下一个商品
            skipe()
        }
    })
}
function SQgoods(activity_id) {
    var data3 = "activityId=" + activity_id + "&source=0"
    $.ajax({
        type: "GET",
        url: "https://try.jd.com/migrate/apply",
        data: data3,
        success: function (d) {
            // 关注成功然后在进行 试用申请
            console.log('申请试用接口成功:', d);
            // qj_flag = false

            console.log('让我看看这里怎么回事？？？', idx1);
            // d.message
            successIndex++;
            if (d.message == "申请成功！") {
                successNums++;//成功记录一次
                idx1++;
                postToJd()
            } else if (d.message == "操作不要太快哦！") {
                postToJd()
            } else {
                idx1++;
                postToJd()
            }
            console.log('申请成功对吧？？？', idx1);
        },
        fail: function (d) {
            console.log('申请试用接口出错:', msg);
            // 数据出错 直接跳出下一个商品
            skipe()
        },
        error: function (a, d) {
            console.log('申请接口出错:', d);
            // 数据出错 直接跳出下一个商品
            skipe()
        }
    })

}
function skipe() {
    // 数据出错 直接跳出下一个商品 的函数
    idx1++;
    console.log('让我看看这里怎么回事？？？', idx1);
    postToJd()
}