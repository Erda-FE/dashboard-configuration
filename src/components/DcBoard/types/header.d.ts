declare namespace DC_BOARD_HEADER {
  interface Tool {
    icon: DcIconType;
    text?: string;
    btnType?: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text';
    customRender?: () => JSX.Element;
    onClick?: () => any;
  }
}
