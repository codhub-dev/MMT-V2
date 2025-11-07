import { DualAxes } from '@ant-design/plots';
import React from 'react';
import { createRoot } from 'react-dom/client';

const MonthlyChart = () => {
    const expensesData = [
        { time: 'Mar', value: 350, type: 'Fuel' },
        { time: 'Apr', value: 900, type: 'Fuel' },
        { time: 'May', value: 300, type: 'Fuel' },
        { time: 'Jun', value: 450, type: 'Fuel' },
        { time: 'Jul', value: 470, type: 'Fuel' },
        { time: 'Aug', value: 470, type: 'Fuel' },
        { time: 'Mar', value: 220, type: 'Def' },
        { time: 'Apr', value: 300, type: 'Def' },
        { time: 'May', value: 250, type: 'Def' },
        { time: 'Jun', value: 220, type: 'Def' },
        { time: 'Jul', value: 362, type: 'Def' },
        { time: 'Aug', value: 470, type: 'Def' },
        { time: 'Mar', value: 220, type: 'Other' },
        { time: 'Apr', value: 300, type: 'Other' },
        { time: 'May', value: 250, type: 'Other' },
        { time: 'Jun', value: 220, type: 'Other' },
        { time: 'Jul', value: 362, type: 'Other' },
        { time: 'Aug', value: 470, type: 'Other' },
    ];

    const transformData = [
        { time: 'Mar', Income: 1000 },
        { time: 'Apr', Income: 1200 },
        { time: 'May', Income: 1300 },
        { time: 'Jun', Income: 900 },
        { time: 'Jul', Income: 1500 },
        { time: 'Aug', Income: 1300 },
    ];

    const config = {
        xField: 'time',
        legend: true,
        title: "Monthly Expenses Overview",
        children: [
            {
                data: expensesData,
                type: 'interval',
                yField: 'value',
                stack: true,
                colorField: 'type',
                style: {
                    maxWidth: 50,
                    radiusTopLeft: 20,
                    radiusTopRight: 20,
                    radiusBottomLeft: 0,
                    radiusBottomRight: 0,
                },
                scale: {
                    color: {
                        domain: ['Fuel', 'Def', 'Other'],
                        range: ['#13452d', '#5fbd92', '#227d53'],
                    },
                    y: { domainMax: 1500, key: 'key1', independent: false }
                },
                interaction: { elementHighlight: { background: true } },
            },
            {
                data: transformData,
                type: 'line',
                yField: 'Income',
                style: { lineWidth: 2, stroke: '#39793e' },
                scale: { y: { key: 'key1', independent: false } },
            },
        ],
    };
    return <div className='bg-white p-3 rounded-4' style={{height: 400}}><DualAxes {...config} /></div>;
};

export default MonthlyChart;