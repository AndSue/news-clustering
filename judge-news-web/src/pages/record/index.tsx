import { deleteRecord, getKeywords, selectNews, selectRecord } from '@/services/servies';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Col, Collapse, Drawer, Input, Modal, Popconfirm, Row, Space, Table, Tag, message } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import { useRequest } from 'umi';
import ReactEcharts from 'echarts-for-react';
import 'echarts-wordcloud'

const RecordList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState([]);
  const [sqlId, setSqlId] = useState(0);
  const [chartData, setChartData] = useState([{ name: '暂无数据', value: 1111 }]);
  const [chartLegend, setChartLegend] = useState(['暂无数据']);
  //const [typeEnum, setTypeEnum] = useState({});
  const [pageForm, setPageForm] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [detailHTML, setDetailHTML] = useState(<></>);
  const [chartHTML, setChartHTML] = useState(<></>);

  // 获取列表
  const get = () => {
    //console.log("enter");
    const uid = parseInt(localStorage.getItem("id") + "");
    selectRecord({
      user_id: uid,
      status: -1,
      start_date: null,
      end_date: null,
      id: -1,
    }).then((res: any) => {
      //console.log(res)
      if (res == undefined || res.code == undefined) {
        message.error("加载数据失败，请刷新重试！");
        return;
      }
      const { code } = res;
      if (code == 200) {
        setData(res.data);
        setPageForm({
          current: 1,
          pageSize: 10,
          total: res.data.length,
        });
      }
      else {
        message.error("加载数据失败，请刷新重试！");
      }
    });
  };

  // 获取类别列表
  /*const getType = () => {
    var list: any = {};
    list['类别1'] = '类别1';
    setTypeEnum(list);
  };*/

  // 删除
  const { run: del } = useRequest(
    (delId) => {
      return deleteRecord(delId);
    },
    {
      manual: true,
      onSuccess: () => {
        get();
        message.success('删除成功！');
      },
    },
  );

  const handleCancel = () => {
    setShowDetail(false);
  }

  const handleModalCancel = () => {
    setShowChart(false);
  }

  const showChartModal = (model: string, record_id: any, e: any) => {
    setShowChart(true);
    if (model == 'pie') {
      setTimeout(() => {
        setChartHTML(
          <ReactEcharts option={getOption(chartLegend, chartData)} style={{ marginTop: "30px", height: 400 }} />
        );
      }, 10);
    }
    else {
      var label = e.target.innerHTML.substring(2, e.target.innerHTML.length - 4);
      getKeywords({
        record_id: record_id,
        type: label,
      }).then((res: any) => {
        if (res == undefined || res.code == undefined) {
          message.error("加载数据失败，请刷新重试！");
          return;
        }
        const { code } = res;
        if (code == 200) {
          res.data = res.data.substring(1, res.data.length - 1);
          res.data = res.data.split(",");
          var a: any = [];
          for (var i = 0; i < res.data.length; i++) {
            var str = res.data[i].split("=");
            a.push({
              name: str[0],
              value: parseInt(str[1]),
            });
          }
          setTimeout(() => {
            setChartHTML(
              <ReactEcharts option={getCloud(a)} style={{ marginTop: "30px" }} />
            );
          }, 10);
        }
        else {
          message.error("加载数据失败，请刷新重试！");
        }
      })
    }
  }

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
                <Collapse.Panel header={lastlabel + "共有" + newsList.length + "条数据"} key={key}
                  extra={<Button id={lastlabel} size="small" onClick={(e) => {
                    showChartModal('cloudy', values.record_id, e)
                  }} style={{ float: 'right' }} type="link" >查看{lastlabel}的词云图</Button>}>
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
          <Collapse.Panel header={lastlabel + "共有" + newsList.length + "条数据"} key={key}
            extra={<Button id={lastlabel} size="small" onClick={(e) => {
              showChartModal('cloudy', values.record_id, e)
            }} style={{ float: 'right' }} type="link" >查看{lastlabel}的词云图</Button>}>
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

  const searchNews = (value: any) => {
    console.log(value)
    getNews({
      record_id: sqlId,
      content: value == '' ? undefined : value
    });
  }

  //查看检测记录包含的新闻
  const showModal = (record: any) => {
    setShowDetail(true);
    setSqlId(record.id);
    getNews({
      record_id: record.id
    });
  }

  // 页面初始化
  useEffect(() => {
    get();
    //getType();
  }, []);

  // 搜索按钮事件
  const onSearch = (value: any) => {
    console.log("search", value);
    value.user_id = parseInt(localStorage.getItem("id") + "");
    if (value.created_at) {
      value.start_date = moment(value.created_at[0]);
      value.end_date = moment(value.created_at[1]);
      value.created_at = undefined;
    }
    value.id = value.id ? value.id : -1;
    value.status = value.status ? value.status : -1;
    selectRecord(value).then((res: any) => {
      if (res == undefined || res.code == undefined) {
        message.error("加载数据失败，请刷新重试！");
        return;
      }
      const { code } = res;
      if (code == 200) {
        setData(res.data);
        setPageForm({
          current: 1,
          pageSize: 10,
          total: res.data.length,
        });
      }
    });
  }

  // 删除
  const delpage = (record: any) => {
    const sqlIds = parseInt(record.id);
    del({ id: sqlIds });
  };

  //饼状图
  var getOption = (legend: any, chart: any) => {
    return {
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
          name: `聚类结果`,
          type: 'pie',
          width: 350,
          height: 350,
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

  var getCloud = (data: any) => {
    return {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'none'
        },
        position: "top",
      },
      series: [{
        name: '提及次数',
        left: 'center',
        top: 'center',
        width: '100%',
        height: '100%',
        right: null,
        bottom: null,
        type: 'wordCloud',
        size: ['9%', '99%'],
        sizeRange: [20, 100],
        rotationRange: [0, 0],
        textPadding: 0,
        autoSize: {
          enable: true,
          minSize: 6
        },
        textStyle: {
          normal: {
            color: function () {
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')';
            }
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: '#FF6A00'
          }
        },
        data: data,
        label: {
          //去除饼图的指示折线label
          normal: {
            show: true,
            position: 'inside',
            formatter: '{b}',
          },
        },
      }]
    }
  }

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
  ];

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: "记录编号",
      align: 'center',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: "类别数量",
      align: 'center',
      dataIndex: 'type_num',
      key: 'type_num',
      hideInSearch: true
    },
    {
      title: "聚类算法",
      align: 'center',
      dataIndex: 'method',
      key: 'method',
      hideInSearch: true
    },
    {
      title: "聚类模式",
      align: 'center',
      dataIndex: 'model',
      key: 'model',
      valueEnum: {
        'label': '固定模式',
        'nolabel': '自定义模式'
      },
      render: (text, record: any) => [
        // eslint-disable-next-line react/jsx-key
        <Space>{record.model == 'label' ? '固定模式' : '自定义模式'}</Space>
      ],
      hideInSearch: true
    },
    {
      title: "状态",
      align: 'center',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        0: '聚类中',
        1: '聚类完毕'
      },
      render: (text, record: any) => [
        // eslint-disable-next-line react/jsx-key
        <Tag color={record.status == 0 ? 'green' : 'red'}>{record.status == 0 ? '聚类中' : '聚类完毕'}</Tag>
      ],
    },
    {
      title: "聚类时间",
      align: 'center',
      dataIndex: 'created_at',
      key: 'created_at',
      valueType: 'dateRange',
      render: (text, record: any) => [
        // eslint-disable-next-line react/jsx-key
        <Space>
          {moment(record.created_at).format('YYYY-MM-DD HH:mm:ss')}
        </Space>
      ],
    },
    {
      title: "操作",
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (_, record: any) => [
        <Space size="middle">
          <a
            onClick={() => {
              showModal(record);
            }}
            style={{
              opacity: record.status == 1 ? 1 : 0,
            }}
          >
            查看聚类结果
          </a>
          <a style={{ color: 'red' }}>
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
      <ProTable<API.RuleListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={pageForm}
        columns={columns}
        dataSource={data}
        scroll={{ y: 800 }}
        onSubmit={onSearch}
      />
      <Drawer
        width={'80%'}
        open={showDetail}
        onClose={handleCancel}
        //maskClosable={false}
        title={'历史记录详情'}
      >
        <Row style={{ marginBottom: 10 }}>
          <Col span={21}>
            <Input.Search
              placeholder="请输入要搜索的关键词"
              allowClear
              onSearch={searchNews}
            />
          </Col>
          <Col span={3}>
            <Button type="primary" style={{ marginLeft: 10, float: 'right' }} onClick={() => { showChartModal('pie', '', ''); }}>查看饼状图</Button>
          </Col>
        </Row>
        <Collapse>
          {detailHTML}
        </Collapse>
      </Drawer>
      <Modal open={showChart} title="可视化展示" onCancel={() => { handleModalCancel(); }} footer={null}>
        {chartHTML}
      </Modal>
    </PageContainer>
  );
};

export default RecordList;
