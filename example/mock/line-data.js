// import { map } from 'lodash';
import * as React from 'react';

const randomValue = () => Math.round(Math.random() * 1000);

const data = {
  // legendData: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
  metricData: [

    // {
    //   name: '访问来源',
    //   data: [
    //     { value: 335, name: '直接访问' },
    //     { value: 310, name: '邮件营销' },
    //     { value: 234, name: '联盟广告' },
    //     { value: 135, name: '视频广告' },
    //     { value: 1548, name: '搜索引擎' },
    //   ],
    // },
  ],
};

// const staticData = {
//   xData: [
//     '不满意',
//     '满不满意',
//     '可容忍',
//     '不可忍',
//     '13:哈哈',
//     '1r:哈哈',
//     '13rr:哈哈',
//     '1r32:哈哈',
//     '13:哈ew哈',
//   ],
//   metricData: [
//     {
//       name: 'tset1',
//       stack: 'a',
//       data: [
//         '0.33',
//         '0.33',
//         '0.33',
//         '0.33',
//         '0.33',
//         '0.33',
//         '0.33',
//         '0.33',
//         '0.33',
//       ],
//     },
//     {
//       name: 'tset2',
//       stack: 'a',
//       data: [
//         '0.78',
//         '0.78',
//         '0.78',
//         '0.78',
//         '0.77',
//         '0.33',
//         '0.33',
//         '0.33',
//         '0.33',
//       ],
//     }, {
//       name: 'tset3',
//       data: [
//         '0',
//         '0.03',
//         '0.03',
//         '0.03',
//         '0.03',
//         '0.33',
//         '0.33',
//         '0.33',
//         '0.33',
//       ],
//     },
//   ],
// };

export default [
  {
    w: 8,
    h: 9,
    x: 0,
    y: 9,
    i: 'view-1',
    moved: false,
    static: false,
    view: {
      name: 'test',
      chartType: 'chart:bar',
      hideReload: true,
      title: () => <div>tti</div>,
      staticData: { metricData: [] },
      config: {
        option: {
          tooltip: {
          },
          legend: {
            bottom: 0,
            align: 'left',
          },
          // yAxis: [
          //   {
          //     type: 'value',
          //     name: '水量',
          //     min: 0,
          //     max: 1,
          //     interval: 0.1,
          //     axisLabel: {
          //       formatter: '{value} ml',
          //     },
          //   },
          //   {
          //     type: 'value',
          //     name: '温度',
          //     min: 0,
          //     max: 2,
          //     interval: 0.2,
          //     axisLabel: {
          //       formatter: '{value} °C',
          //     },
          //   },
          // ],
          xAxis: [{
            triggerEvent: true,
          }],
        },
      },
      chartProps: {
        onEvents: {
          click: (params) => {
            console.log(1, params);
          },
        },
      },
      customRender: chartNode => <div className="SASA" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>{chartNode}</div>,
    },
  },
  // {
  //   w: 8,
  //   h: 9,
  //   x: 8,
  //   y: 9,
  //   i: 'view-3',
  //   moved: false,
  //   static: false,
  //   view: {
  //     name: 'test',
  //     chartType: 'table',
  //     title: '表格图',
  //     description: 'sasasa',
  //     staticData: {
  //       metricData: [
  //         { id: 1, modelType: 'ods', score: 1 },
  //       ],
  //       cols: [
  //         { title: '模型名称', dataIndex: 'modelType' },
  //         { title: '质量分', dataIndex: 'score' },
  //       ],
  //     },
  //   },
  // },
  // {
  //   w: 8,
  //   h: 4,
  //   x: 16,
  //   y: 9,
  //   i: 'view-2',
  //   moved: false,
  //   static: false,
  //   view: {
  //     name: 'test',
  //     chartType: 'card',
  //     hideHeader: true,
  //     hideReload: true,
  //     staticData: {
  //       metricData: [
  //         { name: '数据1', value: 820, unit: 'MB', status: 'rise', color: 'error' },
  //         { name: '数据2', value: 932, color: 'warning' },
  //         { name: '数据3', value: 24, unit: 'KB', status: 'fall', color: 'cancel' },
  //       ],
  //       proportion: [[1, 1, 1, 1], [1, 1]],
  //     },
  //   },
  // },
  {
    w: 12,
    h: 9,
    x: 0,
    y: 0,
    i: 'view-pie',
    moved: false,
    static: false,
    view: {
      title: '访问来源',
      chartType: 'chart:pie',
      staticData: data,
      loadData() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(data);
          }, 1000);
        });
      },
      // dataConvertor: 'ajax',
      controls: ['input'],
      config: {
        option: {
          legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'bottom',
          },
          series: [{
            radius: ['50%', '70%'],
            label: {
              normal: {
                formatter: '{b}:  {c}  {d}%',
              },
            },
          }],
        },
      },
    },
  },
  {
    w: 12,
    h: 12,
    x: 0,
    y: 16,
    i: 'view-map',
    moved: false,
    static: false,
    view: {
      name: 'test',
      chartType: 'chart:map',
      title: 'map',
      // staticData: {
      //   metricData: [
      //     {
      //       name: 'iphone12',
      //       data: [
      //         { name: '哈密市', value: randomValue() },
      //         { name: '天津', value: randomValue() },
      //         { name: '上海', value: randomValue() },
      //         { name: '重庆', value: randomValue() },
      //         { name: '河北', value: randomValue() },
      //         { name: '河南', value: randomValue() },
      //         { name: '云南', value: randomValue() },
      //         { name: '辽宁', value: randomValue() },
      //         { name: '黑龙江', value: randomValue() },
      //         { name: '湖南', value: randomValue() },
      //         { name: '安徽', value: randomValue() },
      //         { name: '山东', value: randomValue() },
      //         { name: '新疆维吾尔自治区', value: randomValue() },
      //         { name: '江苏', value: randomValue() },
      //       ],
      //     },
      //   ],
      // },
      loadData: (curMapTypes = []) => {
        const level = ['province', 'city', 'district'];
        return Promise.resolve({
          metricData: [
            {
              name: 'iphone12',
              data: [
                { name: '哈密市', value: randomValue() },
                { name: '天津', value: randomValue() },
                { name: '上海', value: randomValue() },
                { name: '重庆', value: randomValue() },
                { name: '河北', value: randomValue() },
                { name: '河南', value: randomValue() },
                { name: '云南', value: randomValue() },
                { name: '辽宁', value: randomValue() },
                { name: '黑龙江', value: randomValue() },
                { name: '湖南', value: randomValue() },
                { name: '安徽', value: randomValue() },
                { name: '山东', value: randomValue() },
                { name: '新疆维吾尔自治区', value: randomValue() },
                { name: '江苏', value: randomValue() },
              ],
            },
            {
              name: 'iphone11',
              data: [
                { name: '哈密市', value: randomValue() },
                { name: '天津', value: randomValue() },
                { name: '上海', value: randomValue() },
                { name: '重庆', value: randomValue() },
                { name: '河北', value: randomValue() },
                { name: '河南', value: randomValue() },
                { name: '云南', value: randomValue() },
                { name: '辽宁', value: randomValue() },
                { name: '黑龙江', value: randomValue() },
                { name: '湖南', value: randomValue() },
                { name: '安徽', value: randomValue() },
                { name: '山东', value: randomValue() },
                { name: '新疆维吾尔自治区', value: randomValue() },
                { name: '江苏', value: randomValue() },
              ],
            },
          ],
        });
      },
    },
  },
];
