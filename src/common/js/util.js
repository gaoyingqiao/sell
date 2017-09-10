/**
 * Created by gaoyingqiao on 2017/9/5.
 */
/**
 * 解析url参数
 * @example ?id=123456&name=panda
 * @return Object {id: 123456, name: panda}
 */

export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=123456', '&name=panda']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    })
  }
  return obj;
}
