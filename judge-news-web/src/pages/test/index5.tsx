import { addUser } from '@/services/servies';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, Input, InputNumber, Popconfirm, Radio, Space, Table, Typography, message, Drawer } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { useRequest } from 'umi';

const CollectionDataList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [data, setData] = useState(localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') + "") : []);
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [sqlId, setSqlId] = useState(String);
  const [editOrAdd, setEditOrAdd] = useState('');
  const [pageForm, setPageForm] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 页面初始化
  useEffect(() => {
    var max = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].key > max) {
        max = data[i].key;
      }
    }
    setCount(max + 1);
    setTotal(data.length);
    console.log("count", max + 1);
  }, []);

  const handleAdd = (values: any) => {
    console.log(values)
    const newData: any = {
      key: count,
      name: values.name,
      type: values.type,
      remark: values.remark,
    };
    console.log(data)
    if (data.length > 0) {
      setData([newData, ...data]);
      localStorage.setItem('data', JSON.stringify([newData, ...data]));
    }
    else {
      setData([newData]);
      localStorage.setItem('data', JSON.stringify([newData]));
    }
    setCount(count + 1);
    setPageForm({
      current: 1,
      pageSize: 20,
      total: total + 1,
    })
    setTotal(total + 1);
  };

  const handleTest = () => {
    console.log(data);
    message.success('检测成功！');
    window.location.href = './record'
  };

  const save = async (key: React.Key, values: any) => {
    try {
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        newData.splice(index, 1, {
          ...values,
          key: key,
        });
        console.log("newdata", newData);
        setData(newData);
        localStorage.setItem('data', JSON.stringify(newData));
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const remove = async (key: React.Key) => {
    try {
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        newData.splice(index, 1);
        setData(newData);
        localStorage.setItem('data', JSON.stringify(newData));
        setPageForm({
          current: 1,
          pageSize: 20,
          total: total - 1,
        })
        setTotal(total - 1);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const showModal = (type: string, item: any) => {
    if (type == 'add') {
      setEditOrAdd('add');
    } else {
      setEditOrAdd('edit');
    }
    if (item) {
      setSqlId(item.key);
      form.setFieldsValue({
        name: item.name,
        type: item.type,
        remark: item.remark,
      });
    } else {
      form.resetFields();
    }
    setShowDetail(true);
  };

  const columns = [
    {
      title: '样本编号/名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '类别',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 150,
      render: (_: any, record: any) => [
        <Space size="middle">
          <a
            onClick={() => {
              showModal('edit', record);
            }}
          >
            编辑
          </a>
          <a style={{
            color: 'red',
          }}>
            <Popconfirm
              title="确认删除？"
              onConfirm={() => {
                remove(record.key);
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

  // 模态框取消
  const handleCancel = () => {
    setShowDetail(false);
  };

  // 模态框确认
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const reqform: any = {
        name: values.name,
        type: values.type,
        remark: values.remark,
      };
      console.log(values)
      if (editOrAdd == 'add') {
        handleAdd(reqform);
      } else {
        save(sqlId, reqform);
      }
      handleCancel();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <PageContainer>
      <Button onClick={handleTest} type="primary" style={{ marginRight: 20, marginBottom: 10, marginLeft: 10 }}>开始检测</Button>
      <Button onClick={() => {
        showModal('add', '');
      }} >
        添加新数据
      </Button>
      <Table
        bordered
        dataSource={data}
        columns={columns}
        pagination={pageForm}
      />
      <Drawer
        width={600}
        open={showDetail}
        onClose={handleCancel}
        maskClosable={false}
        title={editOrAdd == 'add' ? '添加新数据' : '编辑数据'}
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
            label="样本编号/名称"
            name="name"
            rules={[{ required: true, message: '请输入样本编号/名称' }]}
          >
            <Input placeholder="请输入样本编号/名称" maxLength={100} />
          </Form.Item>
          <Form.Item
            label="类别"
            name="type"
            rules={[{ required: true, message: '请输入类别' }]}
          >
            <Input placeholder="请输入类别" maxLength={100} />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remark"
          >
            <Input placeholder="请输入备注" maxLength={100} />
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

export default CollectionDataList;
