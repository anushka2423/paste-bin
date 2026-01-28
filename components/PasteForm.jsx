'use client';

import { useState } from 'react';
import { Form, Input, InputNumber, Button, Card, Typography, Space, Divider } from 'antd';
import { CopyOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function PasteForm({ onPasteCreated, onError }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    onError(null);

    try {
      const body = {
        content: values.content.trim(),
      };

      if (values.ttl_seconds) {
        body.ttl_seconds = values.ttl_seconds;
      }

      if (values.max_views) {
        body.max_views = values.max_views;
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create paste');
      }

      onPasteCreated(data);
      form.resetFields();
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label={
            <span>
              Paste Content <Text type="danger">*</Text>
            </span>
          }
          name="content"
          rules={[
            { required: true, message: 'Please enter paste content' },
            { whitespace: true, message: 'Content cannot be empty' },
          ]}
        >
          <TextArea
            rows={15}
            placeholder="Enter your text here..."
            showCount
            style={{ fontFamily: 'Monaco, Menlo, Courier New, monospace' }}
          />
        </Form.Item>

        <Divider orientation="left">
          <Title level={5} style={{ margin: 0 }}>
            Optional Constraints
          </Title>
        </Divider>

        <Space direction="horizontal" size="large" style={{ width: '100%' }} wrap>
          <Form.Item
            label={
              <span>
                Time to Live (seconds)
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Leave empty for no expiry
                </Text>
              </span>
            }
            name="ttl_seconds"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (Number.isInteger(value) && value >= 1) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Must be an integer >= 1'));
                },
              },
            ]}
          >
            <InputNumber
              placeholder="e.g., 3600 (1 hour)"
              min={1}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Maximum Views
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Leave empty for unlimited
                </Text>
              </span>
            }
            name="max_views"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (Number.isInteger(value) && value >= 1) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Must be an integer >= 1'));
                },
              },
            ]}
          >
            <InputNumber
              placeholder="e.g., 10"
              min={1}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Space>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<PlusOutlined />}
            size="large"
            block
          >
            Create Paste
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
