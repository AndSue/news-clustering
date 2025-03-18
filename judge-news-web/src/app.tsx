import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { PageLoading } from '@ant-design/pro-components';
import { message } from 'antd';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';

const loginPath = '/user/login';
const signupPath = '/user/signup';
const adminPath = '/admin/user';
const indexPath = '/index';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = () => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!window.localStorage.getItem("username") && location.pathname !== loginPath && location.pathname !== signupPath) {
        history.push(loginPath);
      }
      /*if (location.pathname == adminPath && localStorage.getItem("roles") == "2") {
        window.location.href = indexPath;
        message.warning('您目前尚无管理员权限，无法进入用户管理界面！');
      }*/
      /*if (location.pathname == "/") {
        window.location.reload();
      }*/
    },
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <div>unAccessible</div>,
  };
};
