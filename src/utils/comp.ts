/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// import { forEach, replace } from 'lodash';
import domtoimage from 'dom-to-image';
import { message as Toast } from 'antd';
import DashboardStore from '../stores/dash-board';

export const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};


class ParamsManage {
  private params: IParams | undefined;

  set(params: IParams | undefined) {
    this.params = params;
  }

  get() {
    return this.params || {};
  }
}

export const paramsManage = new ParamsManage();

// function convertUrl(url: string) {
//   let newUrl = url || '';
//   forEach(paramsManage.get(), (value, key) => {
//     const pattern = new RegExp(`{${key}}`, 'g');
//     newUrl = replace(newUrl, pattern, value);
//   });
//   return newUrl;
// }

let urlDataHandle: any;
export function registerUrlDataHandle(handle: any) {
  urlDataHandle = handle;
}
export function getData(_url: string, _query?: any) {
  return {};
  // if (!url) return {};
  // const newUrl = convertUrl(url);
  // return agent.get(newUrl)
  //   .query(query)
  //   .then((response: any) => {
  //     const data = response.body;
  //     if (urlDataHandle) {
  //       return urlDataHandle({ type: 'get', url: newUrl, data });
  //     }
  //     return data;
  //   });
}

interface IParams { [name: string]: any }

let loadingMessage: any = null;
/**
 * dom to image
 *
 * @export
 * @param {(Element | null | Text)} dom
 * @param {string} name
 * @param {{
 *     loadingMsg?: string;
 *     errorMsg?: string;
 *   }} [message]
 * @returns
 */
export function saveImage(
  dom: Element | null | Text,
  name: string,
  message?: {
    loadingMsg?: string;
    errorMsg?: string;
  },
) {
  const textMap = DashboardStore.getState((s) => s.textMap);
  if (loadingMessage) {
    return;
  }

  if (!dom) {
    Toast.error(message?.errorMsg || textMap['no chart data']);
    return;
  }

  loadingMessage = Toast.loading(message?.loadingMsg || textMap['exporting picture'], 0);
  domtoimage.toPng(dom, {
    quality: 1,
  }).then((url: string) => {
    const link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = url;
    loadingMessage();
    loadingMessage = null;
    link.click();
  });
}


export function plainArrayValidator(_rule: any, text: string, callback: any): void {
  if (!text) {
    callback();
    return;
  }
  try {
    const arrayData = strToObject(text);
    if (Array.isArray(arrayData) && arrayData.every((x) => typeof x === 'string')) {
      callback();
      return;
    }
    callback('请输入正确的字符串数组');
  } catch (e) {
    callback('请输入正确的字符串数组');
  }
}

export function strToObject(str: string) {
  // eslint-disable-next-line
  return  (new Function(`return ${str}`))();
}
