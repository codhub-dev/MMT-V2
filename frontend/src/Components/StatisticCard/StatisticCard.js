import { Card, Statistic } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowUpRightIcon } from '@primer/octicons-react';

const StatisticCard = (props) => {

  const nav = useNavigate()

  return (
    <Card hoverable bordered={false} className={props.cardType === "primary" ? "primary rounded-4" : "rounded-3"} onClick={() => { props.route && nav(props.route) }}>
      <div className='d-flex align-items-center justify-content-between'>
        <Statistic
          title={
            <div className='w-100 d-flex justify-content-between align-items-center'>
              <div>{props.title}</div>
              <div className='d-flex align-items-center justify-content-center bg-white' style={{ height: 30, width: 30, borderRadius: "100%" }}>
                <ArrowUpRightIcon size={16} fill='#158141' />
              </div>
            </div>
          }
          value={props.value}
          className='w-100'
          precision={2}
          formatter={(value) => {
            if (value >= 10000000) {
              // 1 crore or more
              return `${(value / 10000000).toFixed(2)}Cr`;
            } else if (value >= 100000) {
              // 1 lakh or more
              return `${(value / 100000).toFixed(2)}L`;
            } else {
              return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
            }
          }}
          valueStyle={{
            color: '#fff',
            fontWeight: 460,
            fontSize: 46
          }}
        />
        {/* <Statistic
        //   title={props.title}
          value={props.thisMonth}
          prefix={<ArrowUpOutlined />}
          precision={0}
          valueStyle={{
            color: '#fff',
            fontWeight: 800,
            fontSize:16
          }}
          /> */}
      </div>
    </Card>
  )
}

export default StatisticCard