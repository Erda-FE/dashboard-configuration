/* https://github.com/react-dnd/react-dnd/issues/186
 * @Author: licao
 * @Date: 2021-01-28 17:53:58
 * @Last Modified by:   licao
 * @Last Modified time: 2021-01-28 17:53:58
 */
import { createDndContext, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { useRef } from 'react';

const RNDContext = createDndContext(HTML5Backend);

const useDNDProviderElement = (props: any) => {
  const manager = useRef(RNDContext);

  if (!props.children) return null;

  return <DndProvider manager={manager.current.dragDropManager}>{props.children}</DndProvider>;
};

export const DcDndProvider = (props: any) => {
  const DNDElement = useDNDProviderElement(props);
  return <React.Fragment>{DNDElement}</React.Fragment>;
};
