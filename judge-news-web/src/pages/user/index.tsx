import { addUser, deleteUser, searchUser, selectUser, updateUser } from '@/services/servies';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Empty, Form, Input, Popconfirm, Radio, Select, Space, Typography, message } from 'antd';
import { md5 } from 'js-md5';
import React, { useRef, useState, useEffect } from 'react';
// import { FormattedMessage } from 'umi';
import { useRequest } from 'umi';

const UserList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [editOrAdd, setEditOrAdd] = useState('');
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [sqlId, setSqlId] = useState(String);
  const [role, setRole] = useState(String);
  const [pageForm, setPageForm] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框取消
  const handleCancel = () => {
    setShowDetail(false);
  };

  // 获取列表
  const get = () => {
    selectUser().then((res: any) => {
      console.log("get", res);
      const { code } = res;
      if (code == 200) {
        setData(res.data);
        setPageForm({
          current: 1,
          pageSize: 10,
          total: res.length,
        });
      }
    });
  };
  // 新增
  const { run: add } = useRequest(
    (formData) => {
      console.log("add", formData);
      return addUser(formData);
    },
    {
      manual: true,
      onSuccess: () => {
        get();
        handleCancel();
        message.success('创建成功！');
      },
    },
  );
  // 修改
  const { run: update } = useRequest(
    (formData) => {
      console.log("edit", formData);
      return updateUser(formData);
    },
    {
      manual: true,
      onSuccess: () => {
        get();
        handleCancel();
        message.success('修改成功！');
      },
    },
  );
  // 删除
  const { run: del } = useRequest(
    (delId) => {
      return deleteUser(delId);
    },
    {
      manual: true,
      onSuccess: () => {
        get();
        message.success('删除成功！');
      },
    },
  );
  // 页面初始化
  useEffect(() => {
    get();
  }, []);

  // 事件
  // 搜索按钮事件
  const onSearch = (value: any) => {
    console.log("search", value);
    value.username = value.username != '' ? value.username : undefined;
    value.groups = value.groups != '' ? Number(value.groups) : undefined;
    searchUser(value).then((res: any) => {
      console.log("result", res);
      const { code } = res;
      if (code == 200) {
        setData(res.data);
        setPageForm({
          current: 1,
          pageSize: 10,
          total: res.data?.length,
        });
      }
    });
  }

  const showModal = (type: string, item: any) => {
    if (type == 'add') {
      setEditOrAdd('add');
    } else {
      setEditOrAdd('edit');
    }
    if (item) {
      setSqlId(item.id);
      setRole(item.roles);
      form.setFieldsValue({
        name: item.name,
        real_name: item.real_name,
        sex: item.sex,
        job: item.job,
        tel: item.tel
      });
    } else {
      form.resetFields();
    }
    setShowDetail(true);
  };
  // 删除
  const delpage = (record: any) => {
    const sqlIds = parseInt(record.id);
    del({ id: sqlIds });
  };
  // 删除
  const updateRoles = (record: any) => {
    var formdata = record;
    formdata.roles = formdata.roles == '1' ? '2' : '1';
    update(formdata);
  };
  // 模态框确认
  const handleOk = async () => {
    try {
      if (editOrAdd == 'add') {
        const values = await form.validateFields();
        const reqform: any = {
          name: values.name,
          roles: '2',
          real_name: values.real_name,
          sex: values.sex,
          job: values.job,
          tel: values.tel,
          password: md5("123456")
        };
        add(reqform);
      } else {
        const values = await form.validateFields();
        const reqform = {
          id: sqlId,
          name: values.name,
          roles: role,
          real_name: values.real_name,
          sex: values.sex,
          job: values.job,
          tel: values.tel
        };
        update(reqform);
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };


  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: "用户名",
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: "真实姓名",
      dataIndex: 'real_name',
      key: 'real_name'
    },
    {
      title: "性别",
      dataIndex: 'sex',
      key: 'sex',
      valueEnum: {
        '男': {
          text: "男",
        },
        '女': {
          text: "女",
        },
      },
    },
    {
      title: "联系方式",
      dataIndex: 'tel',
      key: 'tel'
    },
    {
      title: "职业",
      dataIndex: 'job',
      key: 'job'
    },
    {
      title: "身份",
      dataIndex: 'roles',
      hideInForm: true,
      valueEnum: {
        '0': {
          text: "超级管理员",
          status: 'Success',
        },
        '1': {
          text: "管理员",
          status: 'Warning',
        },
        '2': {
          text: "普通用户",
          status: 'Processing',
        },
      },
    },
    {
      title: "操作",
      dataIndex: 'option',
      valueType: 'option',
      width: localStorage.getItem('roles') == '0' ? 200 : 150,
      render: (_, record: any) => [
        <Space size="middle">
          <a
            style={{
              margin: 0,
              display: localStorage.getItem('roles') === "0" ? 'block' : 'none',
              opacity: localStorage.getItem('roles') === "0" && record.roles !== '0' ? 1 : 0,
            }}
          >
            <Popconfirm
              title={record.roles !== '1' ? "设置管理员？" : "解除管理员？"}
              onConfirm={() => {
                updateRoles(record);
              }}
              okText="Yes"
              cancelText="No"
            >
              {record.roles !== '1' ? "设置管理员" : "解除管理员"}
            </Popconfirm>
          </a>
          <a
            onClick={() => {
              showModal('edit', record);
            }}
            style={{ opacity: parseInt(localStorage.getItem('roles') + '') >= parseInt(record.roles) ? 0 : 1 }}
          >
            编辑
          </a>
          <a style={{
            color: 'red',
            opacity: parseInt(localStorage.getItem('roles') + '') >= parseInt(record.roles) ? 0 : 1
          }}>
            <Popconfirm
              title="确认删除？"
              onConfirm={() => {
                delpage(record);
              }}
              okText="Yes"
              cancelText="No"
            >
              删除
            </Popconfirm>
          </a>
        </Space>
      ],
    },
  ];

  return (
    <PageContainer>
      {
        localStorage.getItem("roles") !== '2' ? <>
          <ProTable<API.RuleListItem, API.PageParams>
            actionRef={actionRef}
            rowKey="id"
            search={{
              labelWidth: 120,
            }}
            toolBarRender={() => [
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  showModal('add', '');
                }}
              >
                <PlusOutlined /> 添加用户
              </Button>,
            ]}
            pagination={pageForm}
            columns={columns}
            dataSource={data}
            scroll={{ y: 800 }}
            onSubmit={onSearch}
          />
        </> : <>
          <Empty
            description={
              <Typography.Text>
                您还没有管理员权限哦~
              </Typography.Text>
            }
          />
        </>
      }
      <Drawer
        width={600}
        open={showDetail}
        onClose={handleCancel}
        maskClosable={false}
        title={editOrAdd == 'add' ? '创建用户' : '编辑用户'}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          onFinish={handleOk}
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
            <Button type="primary" htmlType="submit" style={{
              marginRight: '15px'
            }}>
              提交
            </Button>
            <Button onClick={() => {
              handleCancel();
            }}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
