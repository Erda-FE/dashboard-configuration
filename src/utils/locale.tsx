import React from 'react';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/es/locale-provider/en_US';
import { ConfigProvider } from 'antd';

export const localeMap = {
  zh: zhCN,
  en: enUS,
};

export const Wrapper: React.FC<{ locale: keyof typeof localeMap }> = ({ children, locale }) => {
  if (process.env.NODE_ENV === 'production') {
    return <>{children}</>;
  } else {
    return <ConfigProvider locale={localeMap[locale]}> {children}</ConfigProvider>;
  }
};
