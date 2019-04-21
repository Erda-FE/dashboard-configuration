declare module 'dva' {
  export { connect } from 'react-redux';
}

declare module '*.json' {
  const value: any;
  export default value;
}
