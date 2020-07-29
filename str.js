var a = '# 666\n## 777\n';

var regex = /\`(.+?)\`/g;

var title = '';

function markdown_html(markdown) {


    array_md = markdown.split('\n');

    array_md = delete_head(array_md);

    //titele = title_f(array_md);


    to_h(array_md);
    c(array_md);
    code(array_md);

    markdown_h = array_md.join('\n');
    console.log(markdown_h);
    return markdown_h;
}

function to_h(array_md) {
    for (let i = 0; i < array_md.length; i++) {
        if (array_md[i].substr(0, 1) == '#') {
            h_number = count_h(array_md[i]);     //计算#的数量
            array_md[i] = array_md[i].substring((h_number + 1));
            array_md[i] = '<h' + h_number + ' id =' + i + ' style="padding-top:10%;margin-top:-10%;">' + array_md[i] + '</h' + h_number + '>';
        }
    }
    return array_md;
}

function count_h(line) {
    let h;
    for (h = 0; line.substr(h, 1) == '#'; h++) {
    }
    return h;
}

function code(array_md) {
    let code;
    var section_s = '<pre><p class="a" >';
    var section_e = '</p></pre>';

    var section = section_s;

    for (var i = 0; i < array_md.length; i++) {
        console.log(array_md[i]);
        if (array_md[i].substr(0, 1) == '`') {
            if (array_md[i].substr(1, 2) == '``') {

                if (section == section_s) {
                    array_md[i + 1] = section + array_md[i + 1];
                    array_md.splice(i, 1);
                    section = section_e;
                }
                else {
                    array_md[i + 1] = section + array_md[i + 1];
                    array_md.splice(i, 1);
                    section = section_s;

                }

            }
            // else {
            //     console.log(i);
            //     array_md[i] = array_md[i].match(regex);
            //     array_md[i] = array_md[i].toString();
            //     array_md[i] = array_md[i].substr(1, array_md[i].length - 2);
            //     array_md[i] = '<pre><p class="a" >' + array_md[i] + '</p></pre>';


            //     /*
            //     array_md[i] = array_md[i].substr(1,array_md[i].length-1);
            //     array_md[i] = '<pre><p class="a" >' + array_md[i] + '</p></pre>';
            //     code = array_md[i];
            //     */

            // }
        }
    }


    return array_md;
}

//markdown_html('# 666\n## 777');

//删除读取文件的最前面的空行
function delete_head(array_md) {
    array_md.splice(0, 1);
    array_md[0] = array_md[0].substr(8,);
    console.log(array_md[0]);
    return array_md;
}


function title_f(array_md) {
    array_md = array_md.split('\n');
    array_md = delete_head(array_md);

    for (let i = 0; i < array_md.length; i++) {

        if (array_md[i].substr(0, 1) == '#') {
            h_number = count_h(array_md[i]);     //计算#的数量
            temp = '';
            temp = array_md[i].substring((h_number + 1));

            for (let j = 0; j < h_number - 1; j++) {
                temp = '&nbsp&nbsp&nbsp&nbsp' + temp;
            }

            temp = '<a href="#' + i + '" class = "t" >' + temp + '</a><br>'
            title = title + temp;
        }
    }

    return title;

}


function c(array_md) {
    var code_s = 's';
    var code_e = 'e';
    var code = code_s;
    for (let i = 0; i < array_md.length; i++) {

        if (array_md[i].substr(0, 3) == '```') {
            do {
                i++
            } while (array_md[i].substr(0, 3) != '```' && i < array_md.length);
        }
        else {
            var m = array_md[i].split('');
            for (let j = 0; j < array_md[i].length; j++) {
                if (m[j] == '`') {
                    if (code == code_s) {
                        console.log(m.join(''));
                        m.splice(j, 1, '<font class="c" >');
                        //md[i] = code;
                        //console.log(m.join(''));
                        code = code_e;
                    }
                    else {
                        m.splice(j, 1, '</font>');
                        code = code_s;

                    }
                }

            }
            array_md.splice(i, 1, m.join(''));
            console.log(array_md[i]);

        }
    }
    console.log(m.join(''));
    console.log(array_md[1]);
    return array_md;
}


var md_get;

// 绑定点击事件
function get() {
    // 发送ajax 请求 需要 五步

    // （1）创建异步对象
    var ajaxObj = new XMLHttpRequest();

    // （2）设置请求的参数。包括：请求的方法、请求的url。
    ajaxObj.open('get', 'md/test.txt');

    // （3）发送请求
    ajaxObj.send();

    //（4）注册事件。 onreadystatechange事件，状态改变时就会调用。
    //如果要在数据完整请求回来的时候才调用，我们需要手动写一些判断的逻辑。
    ajaxObj.onreadystatechange = function () {
        // 为了保证 数据 完整返回，我们一般会判断 两个值
        if (ajaxObj.readyState == 4 && ajaxObj.status == 200) {
            // 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
            // 5.在注册的事件中 获取 返回的 内容 并修改页面的显示
            console.log('数据返回成功');

            // 数据是保存在 异步对象的 属性中
            console.log(ajaxObj.responseText);

            // 修改页面的显示
            // document.getElementById("markdown").innerHTML = ajaxObj.responseText;
        }
    }
    md_get = ajaxObj.responseText;
    console.log(md_get);
    return md_get;
}


function HTMLEncode(str) {   
    
    {    
        str = str.replace(/&/g, '&amp;');  
        str = str.replace(/</g, '&lt;');  
        str = str.replace(/>/g, '&gt;');  
        str = str.replace(/"/g, '&quot;');  
        str = str.replace(/'/g, '&#039;');  
        return str;  
    }  
}

function get_menu(filename) {
    // 发送ajax 请求 需要 五步

    // （1）创建异步对象
    var ajaxObj = new XMLHttpRequest();

    // （2）设置请求的参数。包括：请求的方法、请求的url。
    ajaxObj.open('get', filename+'.txt');

    // （3）发送请求
    ajaxObj.send();

    //（4）注册事件。 onreadystatechange事件，状态改变时就会调用。
    //如果要在数据完整请求回来的时候才调用，我们需要手动写一些判断的逻辑。
    ajaxObj.onreadystatechange = function () {
        // 为了保证 数据 完整返回，我们一般会判断 两个值
        if (ajaxObj.readyState == 4 && ajaxObj.status == 200) {
            // 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
            // 5.在注册的事件中 获取 返回的 内容 并修改页面的显示
            console.log('数据返回成功');

            // 数据是保存在 异步对象的 属性中
            console.log(ajaxObj.responseText);

            // 修改页面的显示
            // document.getElementById("markdown").innerHTML = ajaxObj.responseText;
        }
    }
    var response = ajaxObj.responseText;
    console.log(response);
    return response;
}