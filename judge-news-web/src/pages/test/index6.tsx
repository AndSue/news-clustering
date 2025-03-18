import { classify, selectNews, spider } from '@/services/servies';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, Input, InputNumber, Popconfirm, Radio, Space, Table, message, Drawer, DatePicker, DatePickerProps, Modal, Spin, Steps, Card, Collapse, CollapseProps, Row, Col } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { RangePickerProps } from 'antd/lib/date-picker';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';

const CollectionDataList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [data, setData] = useState(localStorage.getItem('data' + localStorage.getItem("id")) ? JSON.parse(localStorage.getItem('data' + localStorage.getItem("id")) + "") : []);
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [sqlId, setSqlId] = useState(String);
  const [editOrAdd, setEditOrAdd] = useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [current, setCurrent] = useState(0);
  const [noLabel, setNoLabel] = React.useState<boolean>(false);
  const [loadingTip, setLoadingTip] = useState('');
  const [detailHTML, setDetailHTML] = useState(<></>);
  const [chartHTML, setChartHTML] = useState(<></>);
  const [chartData, setChartData] = useState([{ name: '暂无数据', value: 1111 }]);
  const [chartLegend, setChartLegend] = useState(['暂无数据']);
  const [recordId, setRecordId] = useState(0);

  // 获取列表
  const spiderfunction = (values: any) => {
    const reform = {
      start_date: moment(values.daterange[0]).format("YYYY-MM-DD"),
      end_date: moment(values.daterange[1]).format("YYYY-MM-DD"),
      source: values.source
    }
    spider(reform).then((res: any) => {
      if (res == undefined || res.code == undefined) {
        message.error("爬取数据失败，请重试！");
        return;
      }
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
        localStorage.setItem('data' + localStorage.getItem("id"), JSON.stringify([...newData, ...data]));
        setLoading(false);
        message.success('爬取成功！');
      }
      else {
        message.error("爬取数据失败，请重试！");
      }
    });
  };

  // 爬取新闻
  const newsSpider = async (values: any) => {
    try {
      spiderfunction(values);
      setLoading(true);
      setLoadingTip('爬取数据中，请耐心等待……');
      handleCancel();
      console.log(values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
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

  const classifyNews = async () => {
    const values = await form.validateFields();
    next();
    console.log("class:", values);
    const reform = {
      data: data,
      model: values.model,
      type_num: values.type_num,
      uid: parseInt(localStorage.getItem("id") + ""),
      method: values.method,
    }
    setLoading(true);
    setLoadingTip("数据分类中，若中途关闭过页面，请点击检测记录查看结果")
    classify(reform).then((res: any) => {
      if (res == undefined || res.data == undefined || res.data.length == 0) {
        message.error("获取分类数据失败，请点击检测记录查看结果！");
        return;
      }
      //console.log("get", res);
      const { code } = res;
      if (code == 200) {
        var lastlabel = '';
        var newsList: any = [];
        var key = 0;
        var html = (<></>);
        var chartList: any = [];
        var legendList: any = [];
        for (var i = 0; i < res.data.length; i++) {
          if (lastlabel != res.data[i].type) {
            if (key >= 1) {
              html = (<>
                {html}
                <Collapse.Panel header={lastlabel + "共有" + newsList.length + "条数据"} key={key}>
                  <Table
                    columns={newscolumns}
                    expandable={{
                      expandedRowRender: (record: any) => <p style={{ margin: 0 }}>{record.content}</p>,
                    }}
                    dataSource={newsList}
                  />
                </Collapse.Panel>
              </>)
              chartList.push({
                name: lastlabel,
                value: newsList.length,
                label: {
                  show: true,
                  //自定义内容
                  formatter: lastlabel,
                  color: '#fff',
                },
              });
              legendList.push(lastlabel);
            }
            lastlabel = res.data[i].type;
            key++;
            newsList = [];
          }
          res.data[i].key = res.data[i].id;
          newsList.push(res.data[i]);
        }
        html = (<>
          {html}
          <Collapse.Panel header={lastlabel + "共有" + newsList.length + "条数据"} key={key}>
            <Table
              columns={newscolumns}
              expandable={{
                expandedRowRender: (record: any) => <p style={{ margin: 0 }}>{record.content}</p>,
              }}
              dataSource={newsList}
            />
          </Collapse.Panel>
        </>)
        chartList.push({
          name: lastlabel,
          value: newsList.length,
          label: {
            show: true,
            //自定义内容
            formatter: lastlabel,
            color: '#fff',
          },
        });
        legendList.push(lastlabel);
        setRecordId(res.data[0].record_id);
        setChartData(chartList);
        setChartLegend(legendList);
        setDetailHTML(html);
        setLoading(false);
        //localStorage.removeItem("data");
      }
    });
  };

  const getNews = (values: any) => {
    selectNews({
      record_id: values.record_id,
      content: values.content
    }).then((res: any) => {
      if (res == undefined || res.code == undefined) {
        message.error("加载数据失败，请刷新重试！");
        return;
      }
      const { code } = res;
      if (code == 200) {
        var lastlabel = '';
        var newsList: any = [];
        var key = 0;
        var html = (<></>);
        var chartList: any = [];
        var legendList: any = [];
        for (var i = 0; i < res.data.length; i++) {
          if (lastlabel != res.data[i].type) {
            if (key >= 1) {
              html = (<>
                {html}
                <Collapse.Panel header={lastlabel + "共有" + newsList.length + "条数据"} key={key}>
                  <Table
                    columns={newscolumns}
                    expandable={{
                      expandedRowRender: (record: any) => <p style={{ margin: 0 }}>{record.content}</p>,
                    }}
                    dataSource={newsList}
                  />
                </Collapse.Panel>
              </>)
              chartList.push({
                name: lastlabel,
                value: newsList.length,
                label: {
                  show: true,
                  //自定义内容
                  formatter: lastlabel,
                  color: '#fff',
                },
              });
              legendList.push(lastlabel);
            }
            lastlabel = res.data[i].type;
            key++;
            newsList = [];
          }
          res.data[i].key = res.data[i].id;
          newsList.push(res.data[i]);
        }
        html = (<>
          {html}
          <Collapse.Panel header={lastlabel + "共有" + newsList.length + "条数据"} key={key}>
            <Table
              columns={newscolumns}
              expandable={{
                expandedRowRender: (record: any) => <p style={{ margin: 0 }}>{record.content}</p>,
              }}
              dataSource={newsList}
            />
          </Collapse.Panel>
        </>)
        chartList.push({
          name: lastlabel,
          value: newsList.length,
          label: {
            show: true,
            //自定义内容
            formatter: lastlabel,
            color: '#fff',
          },
        });
        legendList.push(lastlabel);
        setChartData(chartList);
        setChartLegend(legendList);
        setDetailHTML(html);
      }
    })
  }
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
    setEditOrAdd(type);
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

  const handleModalCancel = () => {
    setShowChart(false);
  }

  const searchNews = (value: any) => {
    console.log(value)
    getNews({
      record_id: recordId,
      content: value == '' ? undefined : value
    });
  }

  const showChartModal = () => {
    setShowChart(true);
    setTimeout(() => {
      setChartHTML(
        <ReactEcharts option={getOption(chartLegend, chartData)} style={{ marginTop: "30px" }} />
      );
    }, 10);
  }

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
        newsSpider(values);
      }
      if (editOrAdd == 'add') {
        handleAdd(values);
      } else {
        save(sqlId, values);
      }
      handleCancel();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  const newscolumns = [
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
          {record.publish_at != null && record.publish_at != undefined ? moment(record.publish_at).format('YYYY-MM-DD') : ''}
        </Space>
      ],
    },
    {
      title: '新闻内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
  ]

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
          {record.publish_at != null && record.publish_at != undefined ? moment(record.publish_at).format('YYYY-MM-DD') : ''}
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

  //下一步
  const next = () => {
    if (data.length > 1000) {
      message.warning("数据数量不得超过1000条，请删除部分数据！")
    }
    setCurrent(current + 1);
  };

  //上一步
  const prev = () => {
    setCurrent(current - 1);
  };

  //切换模式
  const modelChange = (e: any) => {
    console.log('radio checked', e.target.value);
    if (e.target.value == 'nolabel') {
      setNoLabel(true);
    }
    else {
      setNoLabel(false);
    }
  };

  //切换添加方式
  const changeMethod = (e: any) => {
    console.log('radio checked', e.target.value);
    if (e.target.value == "spider") {
      form.setFieldsValue({
        addMethod: 'spider',
        daterange: [moment(new Date()), moment(new Date())],
        source: "sina",
      });
      setEditOrAdd('spider');
    }
    else {
      form.setFieldsValue({
        addMethod: 'add',
      });
      setEditOrAdd('add');
    }
  };

  const download = () => {
    var str: any = "新闻标题,发布时间,新闻内容\n";
    for (var i = 0; i < data.length; i++) {
      str = str + '"' + data[i].title + '",';
      str = str + '"' + moment(data[i].publish_at).format("YYYY-MM-DD") + '",';
      str = str + '"' + data[i].content.split("\n").join("") + '"\n';
    }
    const blob = new Blob([str]);
    //let date=new Date();
    const fileName = 'data.csv'
    const link = document.createElement('a') // 创建a标签
    link.download = fileName // a标签添加属性
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    document.body.appendChild(link)
    link.click() // 执行下载
    URL.revokeObjectURL(link.href) // 释放url
    document.body.removeChild(link) // 释放标签
  }

  //饼状图
  var getOption = (legend: any, chart: any) => {
    return {
      title: {
        text: `分类结果`,
        x: 'center',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.9)',
          fontWeight: 400,
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'item',
        //提示框浮层内容格式器，支持字符串模板和回调函数形式。
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 5,
        data: legend,
        itemWidth: 8,
        itemHeight: 8,
        icon: 'circle',
        borderRadius: 16,
      },
      series: [
        {
          name: `分类结果`,
          type: 'pie',
          width: 300,
          height: 300,
          //top: 8,
          left: 'center',
          data: chart,
          clockwise: false, //是否顺时针
          label: {
            //去除饼图的指示折线label
            normal: {
              show: true,
              position: 'inside',
              formatter: '{b}:{d}%',
            },
          },
        },
      ],
    }
  };

  //分步骤展示界面
  const steps = [
    /*
    第一步：数据导入
    */
    {
      title: '数据导入',
      content: <>
        <Button onClick={() => next()} disabled={total == 0} type="primary" style={{ marginRight: 10, marginBottom: 10, marginLeft: 10 }}>
          下一步
        </Button>
        <Button style={{ marginRight: 10, marginBottom: 10 }} onClick={() => {
          showModal('', '');
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
        <Button style={{ marginRight: 10, marginBottom: 10 }} onClick={() => {
          download();
        }} >
          下载数据
        </Button>
        <Table
          bordered
          dataSource={data}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.content}</p>,
          }}
          rowSelection={rowSelection}
          footer={() => '共有' + total + '条数据，当前选中' + selectedRowKeys.length + "条"}
        />
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
              editOrAdd !== 'edit' ? <>
                <Form.Item
                  label="添加方式"
                  name="addMethod"
                  rules={[{ required: true, message: '请选择添加数据的方式' }]}
                >
                  <Radio.Group onChange={changeMethod}>
                    <Radio value={"spider"}>爬取新闻</Radio>
                    <Radio value={"add"}>自定义新闻</Radio>
                  </Radio.Group>
                </Form.Item>
              </> : <></>
            }
            {
              editOrAdd == 'add' || editOrAdd == 'edit' ? <>
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
                  <DatePicker onChange={onChange} disabledDate={disabledDate} />
                </Form.Item>
                <Form.Item
                  label="文章内容"
                  name="content"
                  rules={[{ required: true, message: '请输入文章内容' }]}
                >
                  <TextArea rows={16} placeholder="请输入文章内容（5000字以内）" maxLength={5000} />
                </Form.Item>
              </> :
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
    /*
    第二步：选择分类方式
    */
    {
      title: '选择分类模式',
      content: <div style={{ width: 500, margin: '0 auto' }}>
        <Form
          name="basic"
          form={form}
          autoComplete="off"
          onFinish={classifyNews}
        //size={'large'}
        >
          <Form.Item
            label="分类算法"
            name="method"
            rules={[{ required: true, message: '请选择分类算法' }]}
          >
            <Radio.Group>
              <Radio value={"DiMvSCGE"}>
                DiMvSCGE
              </Radio>
              <Radio value={"JSMCFC"}>
                JSMCFC
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="分类模式"
            name="model"
            rules={[{ required: true, message: '请选择分类模式' }]}
          >
            <Radio.Group size="large" onChange={modelChange}>
              <Space direction="vertical">
                <Radio value={"label"}>
                  <Card
                    hoverable
                    style={{ width: 400 }}
                  >
                    <Meta title="固定模式" description="将新闻分为10个领域：体育、财经、房产、家居、教育、科技、时尚、时政、游戏、娱乐，适合仅有少量数据的情况" />
                  </Card>
                </Radio>
                <Radio value={"nolabel"} disabled={total < 50}>
                  <Card
                    hoverable
                    style={{ width: 400 }}
                  >
                    <Meta title="自定义模式" description="由用户自定义类别数，每个类别不会给出具体的标签名称，数据总量超过50条可选择此项，适合数据量较多的情况" />
                  </Card>
                  {
                    noLabel ? <>
                      <Form.Item
                        label="类别数量"
                        name="type_num"
                        rules={[{ required: true, message: '请选择爬取的数据源' }]}
                      >
                        <InputNumber min={2} max={total / 5} placeholder='请输入类别数量（2~数据总量/5）' style={{ width: 300 }} />
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
    /*
    第三步：输出分类结果
    */
    {
      title: '查看分类结果',
      content: <>
        <Row style={{ marginBottom: 10 }}>
          <Col span={21}>
            <Input.Search
              placeholder="请输入要搜索的关键词"
              allowClear
              onSearch={searchNews}
            />
          </Col>
          <Col span={3}>
            <Button type="primary" style={{ marginLeft: 10, float: 'right' }} onClick={() => { showChartModal(); }}>查看饼状图</Button>
          </Col>
        </Row>
        <Collapse>
          {detailHTML}
        </Collapse>
        <Modal open={showChart} title="可视化展示" onCancel={() => { handleModalCancel(); }} footer={null}>
          {chartHTML}
        </Modal>
      </>,
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
        <div style={{ marginTop: 20, minHeight: 300 }} >
          {steps[current].content}
        </div>
      </Spin>
    </PageContainer>
  );
};

export default CollectionDataList;
