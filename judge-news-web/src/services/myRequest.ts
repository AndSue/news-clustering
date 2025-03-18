import axios from 'axios';
import { history } from 'umi';
import { message } from 'antd';

// const token = localStorage.getItem("token");
const request = axios.create({
  baseURL: '/api', // 请求的公共地址部分
  timeout: 600 * 60 * 30, // 请求超时时间 当请求时间超过5秒还未取得结果时 提示用户请求超时
  // headers: { 'Authorization': token },
});

// 请求拦截
request.interceptors.request.use(
  (config) => {
    let token: any = window.localStorage.getItem('token');
    // config 请求的信息
    if (config.url !== '/user/login') {
      config.headers.Authorization = token;
    }
    return config; // 将配置完成的config对象返回出去 如果不返回 请求则不会进行
  },
  (err) => {
    // 请求发生错误时的处理 抛出错误
    Promise.reject(err);
  },
);

// 响应拦截
request.interceptors.response.use(
  (response) => {
    // 我们一般在这里处理，请求成功后的错误状态码 例如状态码是500，404，403
    // response 是所有相应的信息
    let res = response.data;
    if (res.code == 11001 || res.code == 11002) {
      window.localStorage.removeItem('username');
      history.push('/login');
      message.error(res.message);
    }
    return Promise.resolve(res);
  },
  (err) => {
    console.log(err);
    message.error('错误信息:' + err.response?.data?.message);
    // 服务器响应发生错误时的处理
    Promise.reject(err);
  },
);

export default request;
