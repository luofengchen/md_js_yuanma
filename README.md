js源码就是下面这部分，不用其他 直接放在控制台就可以使用 但是 有个前提就是 控制台一定是在 https://try.jd.com/activity/getActivityList 网页下的 其他网页无效，因为存在跨域 而且也是需要登录的 否则 申请给谁呢？？

还有 就是 本文章只是发出来 给前端小白学习的，大牛勿扰，学习使用，违法自行负责  本文章只是发出来 给前端小白学习的，大牛勿扰，学习使用，违法自行负责 本文章只是发出来 给前端小白学习的，大牛勿扰，学习使用，违法自行负责 重要的事情说三遍

// 整合后的接口
// var listArr = $("#goods-list .items .con .clearfix li");
var unableArr = [];//存储所有 活动商品 活动ID的数组
var idx0 = 1;//页面的值
var idx1 = 0;//当前商品是第几个
var activity_id = "";
var callbackNum = "1"
var unablegoodsNum = 0;
var ablegoodsNum = 0;
var AllpageNum = 0;
var successNums = 0;//成功调用的次数
var successIndex = 0;//申请成功的次数
// 可以把函数分开来执行
// var qj_flag = true;
// console.log('输出获取的li的值:', listArr);
var AllArractivity_idArr = [];
//  先获取目前所有的 活动 ID 通过接口 过滤掉 已经申请过的 然后统一申请
console.log('AllpageNum.length的值:', AllpageNum);
// for (var i = 1; i <= AllpageNum; i++) {
// }
getAllpageNum()
function getAllpageNum() {
 var urlGetpage = "https://try.jd.com/activity/getActivityList";
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
}
function getactivity() {
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
 var arractivity_ids1 = cont.match(regexp);
 // console.log('%c有意义:'+ arractivity_ids1, 'font-size:20px;color:blue;');
 AllArractivity_idArr = []
 for (var j = 0; j < 20; j++) {
 arractivity_ids = regexp.exec(cont);
 if (arractivity_ids != null) {
 // console.log('%c有意义:'+ arractivity_ids, 'font-size:20px;color:blue;');
 AllArractivity_idArr.push(arractivity_ids[1])
 activity_cont += arractivity_ids[1] + ","
                        } else {
 break;
                        }
                    }
 // console.log('arractivity_ids:', AllArractivity_idArr, activity_cont);
 // 最后一次停在这里了
 urlGl = "https://try.jd.com/user/getApplyStateByActivityIds";
 dataGl = {
 activityIds: activity_cont
                    }
 $.ajax({
 type: "GET",
 url: urlGl,
 data: dataGl,
 dataType: "jsonp",
 success: function (data) {
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
 console.log('可申请的值:', AllArractivity_idArr[j], j);
 unablegoodsNum++;
 unableArr.push(AllArractivity_idArr[j])
 // if (i == AllpageNum.length) {
 // }
                                }
                            }
 if (unableArr.length <= 0) {
 idx0++;
 getactivity()
                            } else {
 idx1 = 0
 postToJd()
                            }
                        },
                    })
                } else {
 getactivity()
                }
            }
        })
    } else {
 // console.log("%caaaaa","color: red; font-style: italic;font-size:20px")
 // 自定义当前样式 输出到控制台的
 console.log('%c所有申请已经申请完毕,===>总共申请' + successNums + '次' + "申请成功" + successIndex + "次", 'color: blue; font-style: italic;font-size:40px;');
    }
}
// postToJd()
function postToJd() {
 console.log('%c当前第' + idx0 + '页', 'color: blue; font-style: italic;font-size:40px');
 idx0++;
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
 //  现在是有可申请的商品 所以获取 activityid获取 店铺ID
 setTimeout(() => {
 login(activity_id)
            }, 4500);
 // 一秒明显不够2秒 试试 3秒应该 够了 最短限制在 4500ms
        } else {
 console.log('不可能啊最少一次的？？？', idx1);
 // "https://try.jd.com/activity/getActivityList?page=7"
 if (idx1 == unableArr.length) {
 getactivity()
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
            }
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
 getone(activity_id);
        },
 fail: function (d) {
 console.log('登录失败的数据？？？', d);
        }
    })
}
function getone(activity_id) {
 new Promise(function (resolve, reject) {
 var url = "https://try.jd.com/migrate/getActivityById";
 var data1 = "id=" + activity_id
 $.ajax({
 type: "GET",
 url: url,
 data: data1,
 dataType: "jsonp",
 success: function (d) {
 console.log('获取商品信息接口成功::', d);
 if (d.data != null) {
 if (d.data.shopInfo != null) {
 venderId = d.data.shopInfo.venderId;
 // 获取到了 商铺的ID 先关注 然后在申请
 GZgoods(venderId);
                    } else {
 // 数据出错 直接跳出下一个商品
 skipe()
                    }
                } else {
 // 数据出错 直接跳出下一个商品
 skipe()
                }
            },
 fail: function (d) {
 console.log('获取商品信息接口出错:', d);
            }
        });
    })
}
function GZgoods(venderId) {
 var num = [4, 5, 6, 7, 8, 9]
 var index = num[Math.floor(Math.random() * 6)];
 var timechuo = new Number(new Date().getTime()) + index * 1000;
 callbackNum = "";
 var randNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
 for (var j = 0; j < 7; j++) {
 callbackNum += randNum[Math.floor(Math.random() * 9)];
    }
 console.log('callbackNum:', callbackNum);
 var data2 = "sysName=try.jd.com&venderId=" + venderId + "&callback=jQuery" + callbackNum + "&_=" + timechuo
 $.ajax({
 type: "GET",
 url: "https://follow-soa.jd.com/rpc/shardVender/follow",
 data: data2,
 dataType: "jsonp",
 success: function (d) {
 // 关注成功然后在进行 试用申请
 console.log('关注接口成功:', d);
 SQgoods(activity_id);
        },
 fail: function (d) {
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
 successNums++;//成功记录一次
 idx1++;
 console.log('让我看看这里怎么回事？？？', idx1);
 // d.message
 if (d.message == "申请成功！") {
 successIndex++;
            }
 getAllpageNum()
        },
 fail: function (d) {
 console.log('申请试用接口出错:', msg);
 // 数据出错 直接跳出下一个商品
 skipe()
        }
    })

}
function skipe() {
 // 数据出错 直接跳出下一个商品 的函数
 idx1++;
 console.log('让我看看这里怎么回事？？？', idx1);
 getAllpageNum()
}
