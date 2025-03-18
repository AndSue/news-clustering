import Footer from '@/components/Footer';
import { login } from '@/services/servies';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
import { md5 } from 'js-md5';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      console.log("login", values);
      values.password = md5(values.password + '');
      console.log("pw", values.password);
      login(values).then((res: any) => {
        console.log(res)
        const { msg, data, success } = res;
        if (success === true) {
          message.success('登录成功！');
          window.localStorage.setItem('id', data?.id);
          window.localStorage.setItem('username', data?.name);
          window.localStorage.setItem('roles', data?.roles);
          window.localStorage.setItem('created_at', data?.created_at);
          history.push('/');
        }
        else {
          message.error(msg);
        }
      });
    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          //logo={<img alt="logo" src="https://img0.baidu.com/it/u=1932392998,2339457832&fm=253&fmt=auto&app=138&f=JPEG?w=380&h=380" />}
          title="新闻文本聚类系统"
          subTitle="用户登录"
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab='账户密码登录'
            />
          </Tabs>
          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content='账户或密码错误！'
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="name"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder='请输入用户名'
                rules={[
                  {
                    required: true,
                    message: "请输入用户名!",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder='请输入密码'
                rules={[
                  {
                    required: true,
                    message: "请输入密码！",
                  },
                ]}
              />
            </>
          )}

          {<div
            style={{
              paddingBottom: 30,
              //marginTop: 24,
            }}
          >
            {/* <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox> 
            <a
              style={{
                float: 'left',
                //color: 'gray'
              }}
              href='/user/signup'
            >
              忘记密码
            </a>*/}
            <span
              style={{
                float: 'right',
                color: 'gray',
              }}
            >
              还没有账号？<a href='/user/signup'>点击此处注册</a>
            </span>
          </div>}
        </LoginForm>

      </div>

    </div>
  );
};

export default Login;
