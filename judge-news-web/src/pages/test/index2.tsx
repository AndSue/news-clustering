
import { uploadTable } from '@/services/servies';
import { DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Form, Input, Modal, Popconfirm, Space, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import React, { useRef, useState, useEffect } from 'react';

const LineList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // 模态框取消
  const handleCancel = () => {
    setFileList([]);
    setShowDetail(false);
  };

  // 获取列表
  const get = () => {
    // selectLine().then((res: any) => {
    //   const { code, data, perm } = res;
    //   if (code == 200) {
    //     setData(data);
    //     setPageForm({
    //       current: 1,
    //       pageSize: 50,
    //       total: data.length,
    //     });
    //     if (perm.add_linebtn) {
    //       setCanAdd(true);
    //     }
    //     if (perm.update_linebtn) {
    //       setCanUpdate(true);
    //     }
    //     if (perm.delete_linebtn) {
    //       setCanDelete(true);
    //     }
    //   }
    //   else {
    //     message.error("获取数据失败！")
    //   }
    // });
  };
  // 检测
  // const { run: add } = useRequest(
  //   (formData) => {
  //     console.log("add", formData);
  //     return addLine(formData);
  //   },
  //   {
  //     manual: true,
  //     onSuccess: () => {
  //       get();
  //       handleCancel();
  //       message.success('创建成功！');
  //     },
  //   },
  // );

  // 页面初始化
  useEffect(() => {
    get();
  }, []);
  // 事件
  const showModal = () => {
    setShowDetail(true);
  };

  const download = () => {
    var el = document.createElement('a');
    el.style.display = 'none';
    el.setAttribute('target', '_blank');
    el.download = '模板.csv';
    var model = "title,content"
    var blob = new Blob([model]);
    var objectURL = URL.createObjectURL(blob);
    el.href = objectURL
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
    URL.revokeObjectURL(objectURL)
  };

  const handleOk = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file as any);
    });
    formData.append('uid', JSON.stringify(localStorage.getItem("id")));
    setUploading(true);
    uploadTable(formData)
      .then((res: any) => {
        if (res.success == true) {
          setFileList([]);
          message.success('上传成功！');
        }
        else {
          message.error('上传失败，请重试！');
        }
      })
      .catch(() => {
        message.error('上传失败，请重试！');
      })
      .finally(() => {
        setUploading(false);
      });
    handleCancel();
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      console.log(file.type);
      const isTable = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' || file.type === 'text/csv');
      if (!isTable) {
        message.error(`${file.name}不是表格，请重试！`);
      }
      else {
        setFileList([file] as any)
      }
      return false;
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };

  return (
    <PageContainer>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{
          marginRight: '15px'
        }}
        onClick={() => {
          showModal();
        }}
      >
        检测新数据
      </Button>
      <Button
        type="dashed"
        icon={<DownloadOutlined />}
        style={{
          marginRight: '15px'
        }}
        onClick={() => {
          download();
        }}
      >
        下载模板
      </Button>
      <Modal
        open={showDetail}
        onCancel={handleCancel}
        maskClosable={false}
        title={'检测新数据'}
        footer={[
          <Button key="back" onClick={handleCancel}>
            关闭
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} disabled={fileList.length === 0}>
            检测
          </Button>,
        ]}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={handleOk}
        >
          <Form.Item
            label="需要检测的数据"
            name="data"
          >
            <Upload {...props}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>点击此处上传表格</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default LineList;
