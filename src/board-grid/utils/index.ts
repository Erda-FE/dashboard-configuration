import { message } from 'antd';
import domtoimage from 'dom-to-image';

let loadingMessage: any = null;

export function saveImage(dom: Element | null | Text, name: string) {
  if (loadingMessage) {
    return;
  }
  if (!dom) {
    message.error('页面为空,没有图表数据');
    return;
  }
  loadingMessage = message.loading('正在导出图片...', 0);
  domtoimage.toJpeg(dom, {
    quality: 1,
  }).then((url: string) => {
    const link = document.createElement('a');
    link.download = `${name}.jpeg`;
    link.href = url;
    loadingMessage();
    loadingMessage = null;
    link.click();
  });
}
