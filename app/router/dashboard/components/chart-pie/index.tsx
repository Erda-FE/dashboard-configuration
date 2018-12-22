/**
 * 2D 饼图
 */
import React from 'react';
import ChartSizeMe from '../chart-sizeme';
import { merge, get } from 'lodash';
import { ReactEchartsPropsTypes } from 'dashboard/types';

type IType = 'pie';

interface IProps extends ReactEchartsPropsTypes {
  names: string[]
  descHeight?: number // 图表应减少的高度
  isMock?: boolean
  chartType?: IType
}
const data = genData(50);

const ChartPie = ({ option = {}, isMock, chartType, ...others }: IProps) => {
  const source = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: data.legendData,

      selected: data.selected,
    },
    series: [
      {
        name: '姓名',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: data.seriesData,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
  return <ChartSizeMe option={merge(source, option)} isMock={isMock} {...others} />;
};

export default ChartPie;

function genData(count: number) {
  const nameList = [
    '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危',
  ];
  const legendData = [];
  const seriesData = [];
  const selected = {};
  for (let i = 0; i < count; i++) {
    const name = Math.random() > 0.65
      ? `${makeWord(4, 1)}·${makeWord(3, 0)}`
      : makeWord(2, 1);
    legendData.push(name);
    seriesData.push({
      name,
      value: Math.round(Math.random() * 100000),
    });
    selected[name] = i < 6;
  }

  return {
    legendData,
    seriesData,
    selected,
  };

  function makeWord(max: number, min: number) {
    const nameLen = Math.ceil(Math.random() * max + min);
    const name = [];
    for (let i = 0; i < nameLen; i++) {
      name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
    }
    return name.join('');
  }
}
