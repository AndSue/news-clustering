import { addUser, spider } from '@/services/servies';
import { FieldRangePicker, PageContainer } from '@ant-design/pro-components';
import { Button, Form, Input, InputNumber, Popconfirm, Radio, Space, Table, Typography, message, Drawer, DatePicker, DatePickerProps, Modal, Spin, Steps, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { RangePickerProps } from 'antd/lib/date-picker';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useRef, useState, useEffect } from 'react';
import { render } from 'react-dom';
import { useRequest } from 'umi';

const CollectionDataList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState(localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') + "") : []);
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [sqlId, setSqlId] = useState(String);
  const [editOrAdd, setEditOrAdd] = useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [current, setCurrent] = useState(0);
  const [noLabel, setNoLabel] = React.useState<boolean>(false);
  const [loadingTip, setLoadingTip] = useState('');

  // 获取列表
  const spiderfunction = (values: any) => {
    const reform = {
      start_date: moment(values.daterange[0]).format("YYYY-MM-DD"),
      end_date: moment(values.daterange[1]).format("YYYY-MM-DD"),
      source: values.source
    }
    spider(reform).then((res: any) => {
      //console.log("get", res);
      const { code } = res;
      const newData = res.data;
      if (code == 200) {
        var n = count;
        for (var i = 0; i < newData.length; i++, n++) {
          newData[i].key = n;
        }
        setTotal(data.length + newData.length);
        setCount(n);
        setData([...newData, ...data]);
        console.log("data", data);
        localStorage.setItem('data', JSON.stringify([...newData, ...data]));
        setLoading(false);
        message.success('爬取成功！');
      }
    });
  };

  // 爬取新闻
  const newsSpider = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      spiderfunction(values);
      setLoading(true);
      setLoadingTip('爬取数据中，请耐心等待……');
      modalCancel();
      console.log(values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  // 模态框取消
  const modalCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };


  const showSpider = () => {
    form.setFieldsValue({
      //daterange: [moment(new Date().setDate(new Date().getDate() - 6)), moment(new Date())],
      daterange: [moment(new Date()), moment(new Date())],
      source: "sina",
      title: "1",
      content: "2",
      publish_at: moment(new Date()),
    });
    setIsModalOpen(true);
  };

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
      title: values.title,
      publish_at: values.publish_at,
      content: values.content,
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
    setTotal(total + 1);
    message.success('添加成功！');
  };

  const classifyNews = () => {
    console.log(data);
    message.success('检测成功！');

  };

  //编辑
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
        message.success('修改成功！');
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
        setTotal(total - 1);
        message.success('删除成功！');
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
        title: item.title,
        publish_at: moment(item.publish_at),
        content: item.content,
      });
    } else {
      form.resetFields();
    }
    setShowDetail(true);
  };

  // 模态框取消
  const handleCancel = () => {
    setShowDetail(false);
    form.resetFields();
  };

  // 模态框确认
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editOrAdd == 'spider') {
        newsSpider();
      }
      const reqform: any = {
        title: values.title,
        content: values.content,
        publish_at: values.publish_at,
        source: "sina",
        daterange: [moment(new Date()), moment(new Date())],
      };
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

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '发布时间',
      dataIndex: 'publish_at',
      key: 'publish_at',
      width: 150,
      render: (_: any, record: any) => [
        <Space size="middle">
          {moment(record.publish_at).format('YYYY-MM-DD')}
        </Space>
      ],
    },
    {
      title: '新闻内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
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

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current > dayjs().endOf('day');
  };

  const onSelectChange = (newSelectedRowKeys: any) => {
    //console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: any = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const modelChange = (e: any) => {
    console.log('radio checked', e.target.value);
    if (e.target.value == 'nolabel') {
      setNoLabel(true);
    }
    else {
      setNoLabel(false);
    }
  };


  const changeMethod = (e: any) => {
    //console.log('radio checked', e.target.value);
    if (e.target.value == 'spider') {
      setEditOrAdd('spider');
    }
    else {
      setEditOrAdd('add');
    }
  };

  //分步骤展示界面
  const steps = [
    {
      title: '数据导入',
      content: <>
        <Button onClick={() => next()} disabled={total == 0} type="primary" style={{ marginRight: 10, marginBottom: 10, marginLeft: 10 }}>
          下一步
        </Button>
        {/*<Button onClick={() => {
          showSpider();
        }} style={{ marginRight: 10, marginBottom: 10 }}>
          爬取数据
        </Button>*/}
        <Button style={{ marginRight: 10, marginBottom: 10 }} onClick={() => {
          showModal('spider', '');
        }} >
          添加新数据
        </Button>
        <Button type="dashed" disabled={!hasSelected} style={{ marginRight: 10, marginBottom: 10 }} onClick={() => {
          removeAll();
        }} >
          删除选中
        </Button>
        <Button type="dashed" disabled={total == 0} style={{ marginRight: 10, marginBottom: 10 }} onClick={() => {
          removeElse();
        }} >
          删除未选中
        </Button>
        <Table
          bordered
          dataSource={data}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.content}</p>,
          }}
          rowSelection={rowSelection}
          footer={() => '总计:' + total + '条数据'}
        />
        {/*<Modal title="爬取数据" open={isModalOpen} footer={null} onCancel={modalCancel}>
          <Form
            name="basic"
            form={form}
            autoComplete="off"
            onFinish={newsSpider}
          >
            <Form.Item
              label="时间范围"
              name="daterange"
              rules={[{ required: true, message: '请选择爬取的时间范围' }]}
            >
              <DatePicker.RangePicker disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item
              label="数据源"
              name="source"
              rules={[{ required: true, message: '请选择爬取的数据源' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={"sina"}>新浪新闻当日热度前一百排行榜</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" style={{
                marginRight: '15px'
              }}>
                爬取
              </Button>
              <Button onClick={() => {
                modalCancel();
              }}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>*/}
        <Drawer
          width={600}
          open={showDetail}
          onClose={handleCancel}
          maskClosable={false}
          title={editOrAdd !== 'edit' ? '添加新数据' : '编辑数据'}
        >
          <Form
            name="basic"
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
            onFinish={handleOk}
          >
            {
              editOrAdd == 'spider' || editOrAdd == 'add' ? <>
                <Form.Item
                  label="添加方式"
                  name="addMethod"
                  rules={[{ required: true, message: '请选择添加数据的方式' }]}
                >
                  <Radio.Group defaultValue={'spider'} onChange={changeMethod}>
                    <Radio value={"spider"}>爬取新闻</Radio>
                  </Radio.Group>
                  <Radio.Group>
                    <Radio value={"add"}>自定义新闻</Radio>
                  </Radio.Group>
                </Form.Item>
              </> : <></>
            }
            {
              editOrAdd == 'add' || editOrAdd == 'update' ? <>
                <Form.Item
                  label="新闻标题"
                  name="title"
                  rules={[{ required: true, message: '请输入新闻标题' }]}
                >
                  <Input placeholder="请输入新闻标题" maxLength={40} />
                </Form.Item>
                <Form.Item
                  label="发布时间"
                  name="publish_at"
                  rules={[{ required: true, message: '请选择发布时间' }]}
                >
                  <DatePicker onChange={onChange} />
                </Form.Item>
                <Form.Item
                  label="文章内容"
                  name="content"
                  rules={[{ required: true, message: '请输入文章内容' }]}
                >
                  <TextArea rows={16} placeholder="请输入文章内容（5000字以内）" maxLength={5000} />
                </Form.Item>
              </> : <></>
            }
            {
              editOrAdd == 'spider' ? <>
                <Form.Item
                  label="时间范围"
                  name="daterange"
                  rules={[{ required: true, message: '请选择爬取的时间范围' }]}
                >
                  <DatePicker.RangePicker disabledDate={disabledDate} />
                </Form.Item>
                <Form.Item
                  label="数据源"
                  name="source"
                  rules={[{ required: true, message: '请选择爬取的数据源' }]}
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value={"sina"}>新浪新闻当日热度前一百排行榜</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </> : <></>
            }
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
      </>,
    },
    {
      title: '选择聚类模式',
      content: <div style={{ width: 500, margin: '0 auto' }}>
        <Form
          name="basic"
          form={form}
          autoComplete="off"
          onFinish={classifyNews}
        //size={'large'}
        >
          <Form.Item
            label="聚类模式"
            name="model"
            rules={[{ required: true, message: '请选择聚类模式' }]}
          >
            <Radio.Group size="large" onChange={modelChange} defaultValue={'label'}>
              <Space direction="vertical">
                <Radio value={"label"}>
                  <Card
                    hoverable
                    style={{ width: 400 }}
                  >
                    <Meta title="固定模式" description="将新闻分为10个领域：体育、财经、房产、家居、教育、科技、时尚、时政、游戏、娱乐" />
                  </Card>
                </Radio>
                <Radio value={"nolabel"} disabled={total < 100}>
                  <Card
                    hoverable
                    style={{ width: 400 }}
                  >
                    <Meta title="自定义模式" description="由用户自定义类别数，每个类别不会给出具体的标签名称，数据总量超过100条可选择此项" />
                  </Card>
                  {
                    noLabel ? <>
                      <Form.Item
                        label="类别数量"
                        name="source"
                        rules={[{ required: true, message: '请选择爬取的数据源' }]}
                      >
                        <InputNumber min={2} max={total / 5} placeholder='请输入类别数量（2-数据总量/5）' style={{ width: 300 }} />
                      </Form.Item>
                    </> : <></>
                  }
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button onClick={() => {
              prev();
            }} style={{ marginRight: '15px' }}>
              上一步
            </Button>
            <Button type="primary" htmlType="submit">
              开始检测
            </Button>
          </Form.Item>
        </Form>
      </div>,
    },
    {
      title: '查看聚类结果',
      content: 'Last-content',
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const removeAll = async () => {
    try {
      Modal.confirm({
        title: '您真的要删除所有选中的内容吗？删除后不能恢复！',
        onOk() {
          const newData = [...data];
          var index;
          for (var i = 0; i < selectedRowKeys.length; i++) {
            index = newData.findIndex((item) => selectedRowKeys[i] === item.key);
            newData.splice(index, 1);
          }
          setData(newData);
          localStorage.setItem('data', JSON.stringify(newData));
          setTotal(total - selectedRowKeys.length);
          setSelectedRowKeys([]);
          message.success('删除成功！');
        },
      });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const removeElse = async () => {
    try {
      Modal.confirm({
        title: '您真的要删除所有未选中的内容吗？删除后不能恢复！',
        onOk() {
          const newData = [];
          var index;
          for (var i = 0; i < selectedRowKeys.length; i++) {
            index = data.findIndex((item: any) => selectedRowKeys[i] === item.key);
            newData.push(data[index]);
          }
          setData(newData);
          localStorage.setItem('data', JSON.stringify(newData));
          setTotal(selectedRowKeys.length);
          message.success('删除成功！');
        },
      });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  return (
    <PageContainer>
      <Steps current={current} items={items} />
      <Spin spinning={loading} tip={loadingTip}>
        <div style={{ marginTop: 20 }} >
          {steps[current].content}
        </div>
      </Spin>
    </PageContainer>
  );
};

export default CollectionDataList;
