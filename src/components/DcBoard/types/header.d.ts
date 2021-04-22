declare namespace DC_BOARD_HEADER {
  interface Tool {
    icon: DcIconType;
    text?: string;
    btnType?: 'primary' | 'text' | 'warning' | 'secondary' | 'normal';
    customRender?: () => JSX.Element;
    onClick?: () => any;
  }
}
