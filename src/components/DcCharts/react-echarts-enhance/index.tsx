import React from 'react';
import ReactEcharts, { ReactEchartsPropsTypes } from 'echarts-for-react';
import { getConfig } from 'src/config';

class ReactEchartsEnhance extends ReactEcharts {
  echartsLib: {
    registerTheme: (theme: string, themeObj: object) => void;
  };

  registerTheme = () => {
    const { theme } = this.props;
    const themeMap = getConfig('theme');
    let themeObj = themeMap[theme as string];
    if (!themeObj) {
      // eslint-disable-next-line no-console
      console.info(`theme ${theme} not registered yet`);
      themeObj = themeMap.dice;
    }
    this.echartsLib.registerTheme(theme as string, themeObj);
  };

  componentDidMount() {
    super.componentDidMount?.();
    this.registerTheme();
  }

  componentDidUpdate(prevProps: Readonly<ReactEchartsPropsTypes>, prevState: Readonly<any>, snapshot?: any) {
    super.componentDidUpdate?.(prevProps, prevState, snapshot);
    this.registerTheme();
  }

  render() {
    return <>{super.render()}</>;
  }
}

export default ReactEchartsEnhance;
