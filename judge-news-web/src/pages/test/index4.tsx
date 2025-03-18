import { addUser } from '@/services/servies';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, Input, InputNumber, Popconfirm, Space, Table, Typography, message } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { useRequest } from 'umi';

interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const CollectionDataList: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(localStorage.getItem('data') !== undefined ? JSON.parse(localStorage.getItem('data') + "") : []);
  const [editingKey, setEditingKey] = useState('');
  const [count, setCount] = useState(2);

  // 新增
  const { run: add } = useRequest(
    (formData) => {
      console.log("add", formData);
      return addUser(formData);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('创建成功！');
      },
    },
  );

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', type: '', remark: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const handleAdd = () => {
    const newData: any = {
      key: count,
      name: '',
      type: '',
      remark: '',
    };
    setData([newData, ...data]);
    localStorage.setItem('data', JSON.stringify(data));
    setCount(count + 1);
  };

  const handleTest = () => {
    console.log(data);
    add(data);
    message.success('检测成功！');
    window.location.href = './record'
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        localStorage.setItem('data', JSON.stringify(newData));
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        localStorage.setItem('data', JSON.stringify(newData));
        setEditingKey('');
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
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '样本编号/名称',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: '类别',
      dataIndex: 'type',
      width: '15%',
      editable: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '40%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              保存
            </Typography.Link>
            <Popconfirm title="确定取消更改的内容?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} style={{ marginRight: 8 }}>
              编辑
            </Typography.Link>
            <Popconfirm title="确定删除?" disabled={editingKey !== ''} onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <PageContainer>
      <Button onClick={handleTest} type="primary" style={{ marginRight: 20, marginBottom: 10, marginLeft: 10 }}>开始检测</Button>
      <Button onClick={handleAdd} >添加新数据</Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </PageContainer>
  );
};

export default CollectionDataList;
