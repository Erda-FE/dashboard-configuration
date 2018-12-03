import React from 'react';
import { find, includes, startsWith } from 'lodash';

interface IProps {
  src: string,
  style?: object,
  className?: string,
  width?: number,
  height?: number,
  alt?: string,
  quality?: number,
  onClick?: () => void,
  role?: string,
}

const isSupportWebp = (() => {
  try {
    return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
  } catch (err) {
    return false;
  }
})();

const _format = isSupportWebp ? '/format,webp' : '';
const supportTypes = ['jpeg', 'jpg', 'png', 'bmp', 'gif', 'webp', 'tiff', 'JPG', 'JPEG', 'PNG'];
const gerCdnInfo = ({ src = '', width = 20, height = 0, quality = 100 }: IProps) => {
  const _w = width ? `,w_${width}` : '';
  const _h = height ? `,h_${height}` : '';
  const _resize = !(_w || _h) ? '' : `/resize${_w}${_h}`;
  return `${src}?x-oss-process=image${_resize}/quality,Q_${quality}${_format}`;
};
const formatCdn = (props: IProps) => {
  const { src } = props;
  return !startsWith(src, '/images') && !!find(supportTypes, type => includes(src, type)) ? gerCdnInfo(props) : src;
};
const Image = (props: IProps) => {
  const { style = {}, className = '', alt = '', role, onClick } = props;
  return (
    <img
      src={formatCdn(props)}
      style={style}
      className={className}
      alt={alt}
      onClick={onClick}
      role={role}
    />
  );
};

export default Image;
