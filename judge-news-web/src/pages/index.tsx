import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, Carousel, Col, message, Row, Space, Statistic, Tabs, TabsProps, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';
import ScrollTable from './ScrollTable';
import { selectNews, selectRecord, selectUser } from '@/services/servies';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import Meta from 'antd/lib/card/Meta';

const Welcome: React.FC = () => {
  const [data, setData] = useState([]);
  const [newsNum, setNewsNum] = useState(0);
  const [recordNum, setRecordNum] = useState(0);
  const [newsNum7days, setNewsNum7days] = useState();
  const [chartHTML, setChartHTML] = useState(<></>);

  // 获取列表
  const get = () => {
    selectUser().then((res: any) => {
      if (res == undefined || res.code == undefined) {
        message.error("加载数据失败，请刷新重试！");
        return;
      }
      const { code } = res;
      if (code == 200) {
        var index = -1;
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id == parseInt(localStorage.getItem("id") + "")) {
            index = i;
            continue;
          }
          var codename = "";
          for (var j = 0; j < res.data[i].name.length; j++) {
            if (j == 0) {
              codename = codename + res.data[i].name[j];
            }
            else {
              codename = codename + "*";
            }
          }
          res.data[i].name = codename;
        }
        res.data.splice(index, 1);
        setData(res.data);
      }
      else {
        message.error("加载数据失败，请刷新重试！");
      }
    });
  };

  const getNews = () => {
    selectNews({ record_id: 0 }).then((res: any) => {
      if (res == undefined || res.code == undefined) {
        message.error("加载数据失败，请刷新重试！");
        return;
      }
      const { code } = res;
      if (code == 200) {
        setNewsNum(res.data.length);
        var news7days: any = [0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < res.data.length; i++) {
          var days = moment(moment().add(1, 'day').format('YYYY-MM-DD')).diff(moment(res.data[i].created_at), 'day');
          if (days <= 6) {
            news7days[6 - days] = news7days[6 - days] + 1;
          }
        }
        setNewsNum7days(news7days);
        console.log(news7days);
        //setTimeout(() => {
        setChartHTML(
          <ReactEcharts option={getOption(news7days)} style={{ marginTop: "30px" }} />
        );
        //}, 10);
      }
      else {
        message.error("加载数据失败，请刷新重试！");
      }
    });
  };


  // 获取列表
  const getRecord = () => {
    //console.log("enter");
    const uid = parseInt(localStorage.getItem("id") + "");
    selectRecord({
      user_id: uid,
      status: -1,
      start_date: null,
      end_date: null,
      id: -1,
    }).then((res: any) => {
      if (res == undefined || res.code == undefined) {
        message.error("加载数据失败，请刷新重试！");
        return;
      }
      const { code } = res;
      if (code == 200) {
        setRecordNum(res.data.length);
      }
      else {
        message.error("加载数据失败，请刷新重试！");
      }
    });
  };

  // 页面初始化
  useEffect(() => {
    get();
    getNews();
    getRecord();
  }, []);

  const COLUMNS = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '昵称',
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: '使用时长',
      dataIndex: 'time',
      key: 'time',
      render: (_: any, record: any) => [
        <Space>
          已使用本站{moment().diff(moment(record.created_at), "day") + 1}天
        </Space>
      ],
    },
  ];

  //饼状图
  var getOption = (news7days: any) => {
    var dayList = []
    for (var i = 6; i >= 0; i--) {
      dayList.push(moment().subtract(i, 'days').format("YYYY-MM-DD"));
    }
    return {
      xAxis: {
        type: 'category',
        data: dayList
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: `聚类结果`,
          type: 'bar',
          width: 600,
          height: 600,
          //top: 8,
          left: 'center',
          data: news7days,
          //clockwise: false, //是否顺时针
          label: {
            //去除饼图的指示折线label
            normal: {
              show: true,
              formatter: function (params: any) {
                if (params.value > 0) {
                  return params.value;
                } else {
                  return ''
                }
              }
            },
          },
        },
      ],
    }
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '本站功能',
      children:
        <div>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>
              <a href='/test'>
                <Card
                  hoverable
                  style={{ width: '100%' }}
                  cover={<img alt="spider" src="https://p8.itc.cn/q_70/images03/20231104/8b926f66afb74cba9c8898aaa07cd98b.jpeg" />}
                >
                  <Meta title="数据爬取" description="爬取新闻网站上的时事热点新闻，可自定义日期范围" />
                </Card>
              </a>
            </Col>
            <Col span={2}></Col>
            <Col span={4}>
              <a href='/test'>
                <Card
                  hoverable
                  style={{ width: '100%' }}
                  cover={<img alt="classify" src="https://q0.itc.cn/q_70/images03/20240309/a2b719342f7b478c8633c0ade4792e46.jpeg" />}
                >
                  <Meta title="新闻聚类/热点定位" description="对新闻或其他文本进行聚类，快速定位目前热点话题领域" />
                </Card>
              </a>
            </Col>
            <Col span={2}></Col>
            <Col span={4}>
              <a href='/record'>
                <Card
                  hoverable
                  style={{ width: '100%' }}
                  cover={<img alt="history record" src="https://q6.itc.cn/q_70/images03/20240126/4eaa7950e4214e8e83965f851318a03d.jpeg" />}
                >
                  <Meta title="历史记录查看" description="支持查看以往的历史聚类记录，并对其进行模糊搜索" />
                </Card>
              </a>
            </Col>
          </Row>

        </div>,
    }
  ];

  return (
    <PageContainer>
      <Card bordered={false}>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={12}>
                <Row>
                  <Col span={12}>
                    <Statistic title="你已经使用本站" value={(moment().diff(moment(localStorage.getItem("created_at")), "day") + 1) + '天'} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="你使用本站进行过聚类" value={recordNum + '次'} />
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={12}>
                    <Statistic title="本站已有用户" value={data.length + 1 + '名'} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="本站已处理数据" value={newsNum + '条'} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Space style={{ color: 'gray', marginBottom: 10, marginTop: 30 }}>本站近7天处理数据</Space>
            {chartHTML}
          </Col>
          <Col span={12}>
            <Space style={{ color: 'gray', marginBottom: 10 }}>这些用户也在使用本站</Space>
            <ScrollTable dataSource={data} columns={COLUMNS} />
          </Col>
        </Row>
      </Card>
      <Tabs
        defaultActiveKey="1"
        centered
        items={items}
        size="large"
      />
    </PageContainer>
  );
};

export default Welcome;
