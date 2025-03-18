import { Settings as LayoutSettings } from '@ant-design/pro-components';


const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'dark',
  // 拂晓蓝
  //primaryColor: '#1890ff',
  primaryColor: 'brown',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '新闻文本聚类系统',
  pwa: false,
  logo: 'https://t9.baidu.com/it/u=2278062885,227755016&fm=193',
  iconfontUrl: '',
};

export default Settings;
