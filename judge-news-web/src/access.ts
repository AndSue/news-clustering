/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */

import { history, Link } from 'umi';

export default function access() {
  const roles = parseInt(window.localStorage.getItem("roles") + "");
  return {
    canAdmin: parseInt(window.localStorage.getItem("roles") + "") != 2 ? true : false,
    isCenter: history.location.pathname.lastIndexOf('/center') != -1,
    isnotCenter: history.location.pathname.lastIndexOf('/center') === -1,
  };
}
