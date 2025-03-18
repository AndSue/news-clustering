import { addUser } from '@/services/servies';
import { Button, Space, message, Form, Input, Radio } from 'antd';
import React from 'react';
import { useRequest } from 'umi';
import styles from './index.less';
import { UserOutlined } from '@ant-design/icons';
import { md5 } from 'js-md5';

const SignupList: React.FC = () => {
  const [form] = Form.useForm();

  const { run: add } = useRequest(
    (formData) => {
      console.log("add", formData);
      return addUser(formData);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('注册成功！');
        window.location.href = '/user/login'
      },
    },
  );

  // 事件
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (values.password !== values.dpassword) {
        message.error('两次输入的密码不一致！');
        return;
      }
      const reqform = {
        name: values.name,
        roles: '2',
        real_name: values.real_name,
        sex: values.sex,
        job: values.job,
        tel: values.tel,
        password: md5(values.password)
      };
      add(reqform);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 12 }}
          autoComplete="off"
          onFinish={handleOk}
          style={{
            width: 600,
            margin: '0 auto'
          }}
        >
          <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 35, marginTop: 30 }}>
            新闻文本聚类系统
          </h1>
          <p style={{ textAlign: 'center', color: 'gray', fontSize: 14, marginBottom: 50 }}>用户注册</p>
          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" maxLength={20} />
          </Form.Item>
          <Form.Item
            label="真实姓名"
            name="real_name"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" maxLength={20} />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码（6-16位）" maxLength={16} minLength={6} />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="dpassword"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码（6-16位）" maxLength={16} minLength={6} />
          </Form.Item>
          <Form.Item
            label="性别"
            name="sex"
            rules={[{ required: true, message: '请输入性别' }]}
            initialValue={'男'}
          >
            <Radio.Group>
              <Radio value={'男'}>男</Radio>
              <Radio value={'女'}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="联系方式"
            name="tel"
          >
            <Input placeholder="请输入联系方式" maxLength={11} />
          </Form.Item>
          <Form.Item
            label="职业"
            name="job"
          >
            <Input placeholder="请输入职业" maxLength={255} />
          </Form.Item>
          <div style={{
            textAlign: 'right',
            marginRight: 130,
            marginBottom: 5
          }}>
            <a
              href='http://localhost:8000/user/login'
            >
              已有账号？点击此处返回登录界面
            </a>
          </div>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" style={{
              width: 340,
              height: 40,
              fontSize: 18,
              marginLeft: -70
            }}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignupList;
