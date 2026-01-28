'use client';

import { useState } from 'react';
import { Layout, Typography, Alert, Card, Input, Button, Space, message } from 'antd';
import { CopyOutlined, PlusOutlined } from '@ant-design/icons';
import PasteForm from '../components/PasteForm';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function Home() {
  const [createdPaste, setCreatedPaste] = useState(null);
  const [error, setError] = useState(null);

  const handlePasteCreated = (pasteData) => {
    setCreatedPaste(pasteData);
    setError(null);
    message.success('Paste created successfully!');
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setCreatedPaste(null);
    message.error(errorMessage);
  };

  const handleNewPaste = () => {
    setCreatedPaste(null);
    setError(null);
  };

  const handleCopyUrl = () => {
    if (createdPaste?.url) {
      navigator.clipboard.writeText(createdPaste.url);
      message.success('URL copied to clipboard!');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <Title level={1} style={{ color: 'white', margin: 0 }}>
          Pastebin-Lite
        </Title>
        <Paragraph style={{ color: 'white', margin: '0.5rem 0 0 0', opacity: 0.9 }}>
          Share text snippets easily
        </Paragraph>
      </Header>

      <Content style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: '1.5rem' }}
          />
        )}

        {createdPaste ? (
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Alert
                message="Paste Created Successfully!"
                description="Your paste has been created and is ready to share."
                type="success"
                showIcon
              />

              <div>
                <Title level={4}>Share this URL:</Title>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    readOnly
                    value={createdPaste.url}
                    onClick={(e) => e.target.select()}
                    style={{ fontFamily: 'monospace' }}
                  />
                  <Button
                    type="primary"
                    icon={<CopyOutlined />}
                    onClick={handleCopyUrl}
                  >
                    Copy
                  </Button>
                </Space.Compact>
              </div>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleNewPaste}
                block
                size="large"
              >
                Create New Paste
              </Button>
            </Space>
          </Card>
        ) : (
          <PasteForm
            onPasteCreated={handlePasteCreated}
            onError={handleError}
          />
        )}
      </Content>

      <Footer style={{ textAlign: 'center', background: '#001529', color: 'white' }}>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
          Pastebin-Lite - Share text snippets with optional expiry and view limits
        </Paragraph>
      </Footer>
    </Layout>
  );
}
