import * as React from 'react';

interface CascaderOptionType {
  value?: string | number;
  label?: React.ReactNode;
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  children?: CascaderOptionType[];
  [key: string]: any;
}

interface FilledFieldNamesType {
  value: string | number;
  label: string;
  children: string;
}

export function customFilter(inputValue: string, path: CascaderOptionType[]) {
  return path.some(
    (option: any) =>
      option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
}


function highlightKeyword(str: string, keyword: string, prefixCls: string | undefined) {
  const reg = new RegExp(keyword, 'ig');
  const result = str.matchAll(reg);
  const matchedArr = Array.from(result, (x: any) => x[0]);
  return str.split(reg).map((node: any, index: number) =>
    (index === 0
      ? node
      : [
        <span className={`${prefixCls}-menu-item-keyword`} key="separator">
          {matchedArr.shift()}
        </span>,
        node,
      ]));
}

export function defaultRenderFilteredOption(inputValue: string, path: CascaderOptionType[], prefixCls: string | undefined, names: FilledFieldNamesType) {
  return path.map((option: any, index: number) => {
    const label = option[names.label];
    const lowerCaseName = label.toLowerCase();
    const node =
      lowerCaseName.indexOf(inputValue.toLowerCase()) > -1
        ? highlightKeyword(label, inputValue, prefixCls)
        : label;
    return index === 0 ? node : [' / ', node];
  });
}
