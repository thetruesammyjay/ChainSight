import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { Button, Input, Modal, Table, Tag } from 'antd'
import type { Investigation } from '../types'
import { ExportOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'

export default function InvestigationView() {
  const { investigations, createInvestigation, deleteInvestigation } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newInvestigationName, setNewInvestigationName] = useState('')
  const navigate = useNavigate()

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Investigation) => (
        <a onClick={() => navigate(`/investigations/${record.id}`)}>{text}</a>
      )
    },
    {
      title: 'Wallets',
      dataIndex: 'wallets',
      key: 'wallets',
      render: (wallets: any[]) => (
        <span>{wallets.length} wallets</span>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Investigation) => (
        <div className="action-buttons">
          <Button 
            icon={<ExportOutlined />} 
            onClick={() => exportInvestigation(record)}
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => editInvestigation(record.id)}
          />
          <Button 
            danger
            icon={<DeleteOutlined />} 
            onClick={() => deleteInvestigation(record.id)}
          />
        </div>
      )
    }
  ]

  const handleCreateInvestigation = () => {
    if (!newInvestigationName.trim()) return
    
    createInvestigation({
      id: crypto.randomUUID(),
      name: newInvestigationName,
      wallets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    setIsModalOpen(false)
    setNewInvestigationName('')
  }

  const exportInvestigation = (investigation: Investigation) => {
    // Implementation would generate PDF/CSV
    console.log('Exporting:', investigation)
  }

  const editInvestigation = (id: string) => {
    navigate(`/investigations/edit/${id}`)
  }

  return (
    <div className="investigation-view">
      <div className="header">
        <h1>Investigations</h1>
        <Button 
          type="primary" 
          onClick={() => setIsModalOpen(true)}
        >
          New Investigation
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={investigations} 
        rowKey="id"
        pagination={false}
      />

      <Modal
        title="Create New Investigation"
        open={isModalOpen}
        onOk={handleCreateInvestigation}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="Investigation name"
          value={newInvestigationName}
          onChange={(e) => setNewInvestigationName(e.target.value)}
          onPressEnter={handleCreateInvestigation}
        />
      </Modal>
    </div>
  )
}