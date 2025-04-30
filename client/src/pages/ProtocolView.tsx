import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_PROTOCOL_DETAILS } from '../queries'
import { Card, Col, Row, Statistic, Table, Tabs } from 'antd'
import { Pie, Bar } from 'react-chartjs-2'
import type { ProtocolDetail, ProtocolTransaction } from '../types'

const { TabPane } = Tabs

export default function ProtocolView() {
  const { protocolId } = useParams<{ protocolId: string }>()
  const { loading, error, data } = useQuery(GET_PROTOCOL_DETAILS, {
    variables: { protocolId }
  })
  const [activeTab, setActiveTab] = useState('overview')

  if (loading) return <div>Loading protocol details...</div>
  if (error) return <div>Error loading protocol: {error.message}</div>

  const protocol: ProtocolDetail = data.protocol

  // Chart data preparation
  const tvlData = {
    labels: ['Current TVL', 'Other Protocols'],
    datasets: [{
      data: [protocol.metrics.current.tvl, 1000000 - protocol.metrics.current.tvl],
      backgroundColor: ['#14F195', '#9945FF']
    }]
  }

  const volumeData = {
    labels: protocol.metrics.historical.volume.map(v => 
      new Date(v.timestamp).toLocaleDateString()
    ),
    datasets: [{
      label: 'Volume (USD)',
      data: protocol.metrics.historical.volume.map(v => v.value),
      backgroundColor: '#00B8FF'
    }]
  }

  const transactionsColumns = [
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Value (USD)',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      title: 'Wallet',
      dataIndex: 'wallet',
      key: 'wallet',
      render: (wallet: string) => `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
    }
  ]

  return (
    <div className="protocol-view">
      <div className="header">
        <h1>{protocol.name}</h1>
        <p>{protocol.description}</p>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Overview" key="overview">
          <Row gutter={16} className="stats-row">
            <Col span={8}>
              <Card>
                <Statistic
                  title="Total Value Locked"
                  value={protocol.metrics.current.tvl}
                  prefix="$"
                  valueStyle={{ color: '#14F195' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="24h Volume"
                  value={protocol.metrics.current.volume24h}
                  prefix="$"
                  valueStyle={{ color: '#00B8FF' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Transactions (24h)"
                  value={protocol.metrics.current.transactions24h}
                  valueStyle={{ color: '#9945FF' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="charts-row">
            <Col span={12}>
              <Card title="TVL Distribution">
                <Pie data={tvlData} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Volume History">
                <Bar data={volumeData} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Transactions" key="transactions">
          <Table
            columns={transactionsColumns}
            dataSource={protocol.recentTransactions}
            rowKey="signature"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Wallets" key="wallets">
          {/* Wallet table implementation */}
        </TabPane>
      </Tabs>
    </div>
  )
}