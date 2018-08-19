// setInterval(() => {
getverderIds()
// }, 5000)

function getverderIds() {
    // https://t.jd.com/follow/vender/list.do?index=2
    let query = {};
    query.url = "https://t.jd.com/follow/vender/list.do";
    query.data = "index=1";
    query.resoletype = "complete";
    query.rejecttype = "fail";
    query.method = "GET";
    // request(query).then(d => {
    //     // let str = JSON.stringify(d)
    //     console.log('获取返回的信息:', d);
    // }).catch(msg => {
    //     console.log('输出msg的信息:', msg);
    // })
    request(query).then(d => {
        // console.log('输出我要的信息',d);
    }).catch(d => {
        // // console.log('输出错误的信息', d.responseText);
        if (d.responseText != "") {
            let str = d.responseText;
            let regexp = /id=.vender_\d+./g;
            let venders_list = [];
            venders_list.push(...str.match(regexp))
            if (venders_list.length > 0) {
                console.log(str.match(regexp));
                let vender_id = [];
                for (let i = 0; i < venders_list.length; i++) {
                    let val = venders_list[i];
                    let reg = /\d+/g;
                    vender_id.push(reg.exec(val)[0]);
                }
                console.log('输出匹配的信息:', venders_list, vender_id);
                let venderIds = ""
                for (let i = 0; i < vender_id.length; i++) {
                    venderIds += "," + vender_id[i];
                }
                venderIds = venderIds.slice(1);
                console.log('输出封装的vender', venderIds);
                unshiftGZ(venderIds)
            }else{
                return
            }
        }
    })
}
// unshiftGZ()
// https://t.jd.com/follow/vender/batchUnfollow.do
function unshiftGZ(venderIds) {
    let query = {};
    query.url = "https://t.jd.com/follow/vender/batchUnfollow.do";
    query.data = "venderIds=" + venderIds;
    query.resoletype = "success";
    query.rejecttype = "error";
    query.method = "POST";
    request(query).then(d => {
        console.log('输出我要的信息,成功的 信息:', d);
        getverderIds()
    }).catch(d => {
        console.log('失败的信息:', d);
        getverderIds()
    })
}
function request(query) {
    return new Promise(function (resole, reject) {
        $.ajax({
            type: query.method,
            url: query.url,
            data: query.data,
            dataType: "jsonp",
            success: function (d) {
                if (query.resoletype == "success" || query.resoletype == "") {
                    resole(d)
                }
            },
            fail: function (d) {
                // console.log('输出失败的信息:',d);
                if (query.rejecttype == "fail" || query.rejecttype == "") {
                    reject(d)
                }
            },
            error: function (a, d) {
                // console.log('输出出错的信息:',d);
                if (query.rejecttype == "error") {
                    reject(d)
                }
            },
            complete: function (d) {
                if (query.resoletype == "complete") {
                    resole(d)
                }
            }
        })
    })
}