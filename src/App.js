import React, { Component } from 'react'
import {
  Table,
  Button,
} from 'antd'
import { compose, map } from 'lodash/fp'

import generateData, { dateBetween, generateItem } from './libs/generateData'
import './App.css'

const config = {
  count: 400,
  end: new Date(2017, 1, 26),
  start: new Date(2017, 1, 15),
}

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
  },
]

class App extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      selectedRowKeys: [],
    }
  }

  componentWillMount() {
    this.setState({
      data: this.fetchData()
    })
  }

  fetchData() {
    let rawData = generateData(config)
    rawData.sort((item1, item2) => 
      new Date(item2.timestamp) - new Date(item1.timestamp)
    ).map(item => {
      item.key = item.id
      item.timestamp = item.timestamp.toString()
      return item
    })
    return rawData
  }

  onRefreshClick() {
    this.setState({
      data: this.fetchData()
    })
  }

  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys })
  }

  onDeleteClick() {
    const { data, selectedRowKeys } = this.state
    const filteredData = data.filter(item => !selectedRowKeys.includes(item.key))
    this.setState({
      data: filteredData,
      selectedRowKeys: []
    })
  }

  onAddClick() {
    const { start, end } = config
    const genDate = dateBetween(start, end)
    const genDates = map(genDate)
    const genItems = map(generateItem)
    const newItem = compose(genItems, genDates)(Array(1).map(item => {
      item.key = item.id
      item.timestamp = item.timestamp.toString()
      return item
    }))
    let newData = this.state.data.concat(newItem)
    newData.sort((item1, item2) => 
      new Date(item2.timestamp) - new Date(item1.timestamp)
    )
    this.setState({
      data: newData
    }, () => {
      const { id, name, timestamp } = newItem[0]
      alert('A new record is added: <' + id + ' - ' + name + ' - ' + timestamp + '>')
    })
  }

  render() {
    const { data, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    }
    const hasSelected = selectedRowKeys.length > 0
    return (
      <div>
        <Button type="primary" onClick={this.onRefreshClick.bind(this)}>Refresh</Button>
        <Button type="primary" onClick={this.onDeleteClick.bind(this)} disabled={!hasSelected}>Delete</Button>
        <Button type="primary" onClick={this.onAddClick.bind(this)}>Add</Button>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    )
  }
}

export default App
