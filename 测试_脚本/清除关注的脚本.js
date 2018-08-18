getverderIds()

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
        // console.log('输出错误的信息', d.responseText);
        if (d.responseText != "") {
            let str = d.responseText;
            let regexp = /id=.vender_\d+./g;
            // str.match(regexp)
            let vender_id = [];
            for (let i = 0; i < 50; i++) {
                // vender_id.push(regexp.exec(str));
                console.log('输出匹配的信息:',regexp.exec(str),i);
            }
        }
    })

}
// unshiftGZ()
// https://t.jd.com/follow/vender/batchUnfollow.do
function unshiftGZ() {
    let query = {};
    query.url = "https://t.jd.com/follow/vender/batchUnfollow.do";
    query.data = "venderIds=633365";
    query.resoletype = "success";
    query.rejecttype = "error";
    query.method = "POST";
    request(query).then(d => {
        console.log('输出我要的信息,成功的 信息:', d);
    }).catch(d => {
        console.log('失败的信息:',d);
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