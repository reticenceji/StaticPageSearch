obj = JSON.parse(SearchResult);

function check() {
    return false;
}

function maxfor(arr) {
    var len = arr.length;
    var max = -Infinity;
    while (len--) {
        if (arr[len] > max) {
            max = arr[len];
        }
    }
    return max;
}

let input = document.getElementById('input')
let result = document.getElementById('resultlist')
let button = document.getElementById('searchbutton')

input.addEventListener("focus", e => {
    result.id = 'active'
    result.style.overflow = 'auto'
    result.style.padding = '3px'
})
input.addEventListener("blur", e => {
    result.id = 'resultlist'
    result.style.overflow = 'hidden'
    result.style.padding = '0'
})

function searchtext() {
    result.innerHTML = input.value;
    if (input.value == '') {
        result.innerHTML = '<i>- 搜索 -</i><hr>' + '<p align="center">输入关键词以在文章标题及正文中查询</p><hr>'
    }

    // 标题搜索
    resultcount = 0;
    resultstr = '';
    var resulttitlecache = new Array()
    for (i = 0; i < obj.length; i++) {
        if (obj[i]['title'].includes(input.value) == true) {
            resulttitlecache.unshift(obj[i]['title'])
            resultcount++;
        }
    }

    // 标题搜索结果展示
    if (resultcount !== 0 && resultcount !== obj.length) {
        for (i = 0; i < resulttitlecache.length; i++) {
            for (j = 0; j < obj.length; j++) {
                if (obj[j]['title'] == resulttitlecache[i]) {
                    titlesearchresult = '<h4><a href="' + obj[j]["path"] + '" class="resulttitle">' + obj[j]['title'].replace(new RegExp(input.value, 'g'), '<mark>' + input.value + '</mark>') + '</a></h4><em>-标题匹配</em><p class="showbox">' + obj[j]['text'].substring(0, 100) + '</p>'
                    resultstr = titlesearchresult + '<hr>' + resultstr
                }
            }
            result.innerHTML = '<i>"' + input.value + '"</i><hr>' + resultstr;
        }
    }

    // 正文搜索
    var resulttextcache = new Array()
    for (i = 0; i < obj.length; i++) {
        if (obj[i]['text'].includes(input.value) == true) {
            resulttextcache.unshift(obj[i]['text'])
            resultcount++;
        }
    }

    // 正文搜索结果计数
    var targetname = new Array()
    var targetscore = new Array()
    if (resulttextcache.length !== 0 && input.value !== '') {
        for (i = 0; i < resulttextcache.length; i++) {
            for (j = 0; j < obj.length; j++) {
                if (obj[j]['text'] == resulttextcache[i]) {
                    targetname.unshift(obj[j]['title'])
                    targetscore.unshift(obj[j]['text'].match(RegExp(input.value, 'gim')).length)
                }
            }
        }
    }

    //排序相关选项
    var targetscorecache = targetscore.concat([]);
    var resultfortext = '';
    var textsearchresult = ''
    targetscorecache.sort(function (a, b) {
        return b - a
    })
    for (i = 0; i < targetscorecache.length; i++) {
        for (j = 0; j < targetscore.length; j++) {
            if (targetscorecache[i] == targetscore[j]) {
                console.log('文章排序:' + targetname[j])
                for (k = 0; k < obj.length; k++) {
                    if (obj[k]['title'] == targetname[j]) {
                        // 确认选区
                        textorder = obj[k]['text'].indexOf(input.value) - 15;
                        while (textorder < 0) {
                            textorder++
                        }

                        resultfortext = '<h4><a href="' + obj[k]["path"] + '" class="resulttitle">' + obj[k]['title'] + '</a></h4><em>-' + targetscorecache[i] + '个结果</em><p class="showbox">...' + obj[k]['text'].substring(textorder, textorder + 100).replace(new RegExp(input.value, 'g'), '<mark>' + input.value + '</mark>') + '</p>'
                        textsearchresult = textsearchresult + '<hr>' + resultfortext;
                    }
                }
            }
        }
    }

    // 无效结果安排
    if (resultcount !== obj.length) {
        if (resultcount == 0) {
            result.innerHTML = '<i>"' + input.value + '"</i><hr><p align="center">没有找到结果</p>'
        }
    }
    // 整合
    result.innerHTML = result.innerHTML.substring(0, result.innerHTML.length - 4) + textsearchresult.substring(0, textsearchresult.length - 4) + '<hr><a href="https://github.com/ravelloh/RPageSearch" class="tr">Search powered by RavelloH\'s RPageSearch</a>'
}
