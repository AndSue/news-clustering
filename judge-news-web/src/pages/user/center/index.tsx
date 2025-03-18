import { addUser, updateUser, searchUserById, updatePassword } from '@/services/servies';
import { Button, Space, message, Form, Input, Radio, Tabs, TabsProps, Avatar, Row, Col, Descriptions, DescriptionsProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import styles from './index.less';
import { UserOutlined } from '@ant-design/icons';
import { md5 } from 'js-md5';
import { PageContainer } from '@ant-design/pro-components';
import RightContent from '@/components/RightContent';

const SignupList: React.FC = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState({} as any);
  const [activeKey, setActiveKey] = useState('info');

  const { run: update } = useRequest(
    (formData) => {
      console.log("update", formData);
      return updateUser(formData);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('修改成功！');
        get();
      },
    },
  );

  const { run: updatePwd } = useRequest(
    (formData) => {
      console.log("update", formData);
      return updatePassword(formData);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('修改成功！');
        window.location.href = '/center';
      },
    },
  );

  // 获取列表
  const get = () => {
    const reform = {
      id: parseInt(localStorage.getItem("id") + "")
    }
    searchUserById(reform).then((res: any) => {
      console.log("get", res);
      const { code, data } = res;
      if (code == 200) {
        setUser(data);
        form.setFieldsValue({
          name: data.name,
          real_name: data.real_name,
          sex: data.sex,
          job: data.job,
          tel: data.tel,
          dpassword: data.password,
          password: data.password,
          orgpassword: data.password,
        });
      }
    });
  };

  // 页面初始化
  useEffect(() => {
    get();
  }, []);


  // 事件
  const handleOk = async () => {
    console.log("handleOK");
    try {
      if (activeKey === 'info') {
        const values = await form.validateFields();
        console.log(values)
        const reqform = {
          id: parseInt(localStorage.getItem('id') + ""),
          name: values.name,
          roles: user.roles,
          real_name: values.real_name,
          sex: values.sex,
          job: values.job,
          tel: values.tel,
        };
        update(reqform);
      }
      else {
        const values = await form.validateFields();
        if (user.password !== md5(values.orgpassword)) {
          message.error('原密码输入错误！');
          return;
        }
        if (values.password !== values.dpassword) {
          message.error('两次输入的密码不一致！');
          return;
        }
        const reqform = {
          id: user.id,
          password: md5(values.password),
        };
        updatePwd(reqform);
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const onChange = (key: string) => {
    setActiveKey(key);
    if (key === 'info') {
      get();
    }
    else {
      form.setFieldsValue({
        name: user.name,
        real_name: user.real_name,
        sex: user.sex,
        job: user.job,
        tel: user.tel,
        dpassword: '',
        password: '',
        orgpassword: '',
      });
    }
  };

  const items: TabsProps['items'] = [
    {
      key: 'info',
      label: '更改个人信息',
      children:
        <div>
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
            <Form.Item
              label="用户名"
              name="name"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" maxLength={100} />
            </Form.Item>
            <Form.Item
              label="真实姓名"
              name="real_name"
              rules={[{ required: true, message: '请输入真实姓名' }]}
            >
              <Input placeholder="请输入真实姓名" maxLength={100} />
            </Form.Item>
            <Form.Item
              label="性别"
              name="sex"
              rules={[{ required: true, message: '请输入性别' }]}
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
              <Input placeholder="请输入职业" maxLength={100} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
                修改
              </Button>
              <Button>
                取消
              </Button>
            </Form.Item>
          </Form>
        </div>,
    },
    {
      key: 'password',
      label: '修改密码',
      children: <Form
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
        <Form.Item
          label="原密码"
          name="orgpassword"
          rules={[{ required: true, message: '请输入原密码（6-16位）' }]}
        >
          <Input.Password placeholder="请输入原密码（6-16位）" maxLength={16} minLength={6} />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="password"
          rules={[{ required: true, message: '请输入新密码（6-16位）' }]}
        >
          <Input.Password placeholder="请输入新密码（6-16位）" maxLength={16} minLength={6} />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="dpassword"
          rules={[{ required: true, message: '请再输入一遍新密码（6-16位）' }]}
        >
          <Input.Password placeholder="请再输入一遍新密码（6-16位）" maxLength={16} minLength={6} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
            修改
          </Button>
          <Button htmlType="reset">
            取消
          </Button>
        </Form.Item>
      </Form>,
    },
  ];

  const descrip: DescriptionsProps['children'] = [
    {
      key: '1',
      label: 'UserName',
      children: 'Zhou Maomao',
    },
    {
      key: '2',
      label: 'Telephone',
      children: '1810000000',
    },
    {
      key: '3',
      label: 'Live',
      children: 'Hangzhou, Zhejiang',
    },
    {
      key: '4',
      label: 'Remark',
      children: 'empty',
    },
    {
      key: '5',
      label: 'Address',
      children: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
    },
  ];

  return (
    <PageContainer>
      <Row>
        <Col span={2}>
          <Avatar size={75} icon={<UserOutlined />} style={{ marginLeft: 20 }} />
        </Col>
        <Col span={22} style={{ paddingTop: 5 }}>
          <span style={{ fontWeight: 'bold', fontSize: 20 }}>{localStorage.getItem("username")}</span><br />
          <span style={{ color: 'gray' }}>ID：{localStorage.getItem("id")}</span>
          {/*<Descriptions title={localStorage.getItem("username")} children={descrip} />*/}
        </Col>
      </Row>
      <Tabs defaultActiveKey="info" items={items} style={{ margin: 10 }} onChange={onChange} />
    </PageContainer>
  );
};

export default SignupList;
