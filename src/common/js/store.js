/**
 * Created by gaoyingqiao on 2017/9/5.
 */
export function saveToLocal(id, key, value) {
  if (!window.localStorage) {
    return false;
  } else {
    // 保证私有化
    let store = window.localStorage.__store__;
    if (!store) {  // 第一次存储
      store = {};
      store[id] = {};
    } else {
      store = JSON.parse(store);
      if (!store[id]) {
        store[id] = {};
      }
    }
    store[id][key] = value;
    window.localStorage.__store__ = JSON.stringify(store);
  }
}

//                       交互的id，存储的key，default
export function loadFromLocal(id, key, def) {
  if (!window.localStorage) {
    return false;
  } else {
    let store = window.localStorage.__store__;
    if (!store) {
      return def;
    }
    store = JSON.parse(store)[id];
    if (!store) {
      return def;
    }
    let ret = store[key];
    return ret || def;
  }
}
