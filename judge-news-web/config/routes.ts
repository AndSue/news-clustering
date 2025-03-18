export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        name: 'signup',
        path: '/user/signup',
        component: './user/Signup',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/index',
    name: '首页',
    icon: 'home',
    component: './index',
  },
  {
    path: '/admin/user',
    name: '用户管理',
    icon: 'user',
    component: './user',
    //access: 'canAdmin',
  },
  {
    path: '/test',
    name: '新闻聚类/热点定位',
    icon: 'search',
    component: './test',
  },
  {
    path: '/record',
    name: '历史记录',
    icon: 'file-text',
    component: './record',
  },
  {
    path: '/center',
    name: '个人中心',
    icon: 'edit',
    component: './user/center',
  },
  {
    path: '/',
    redirect: '/index',
  },
  {
    component: './404',
  },
];
