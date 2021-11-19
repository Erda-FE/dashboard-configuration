import * as React from 'react';
import FormBuilder from '../form-builder';

const { Fields } = FormBuilder;

export const DcFormBuilder = React.forwardRef(({ fields }: { fields: any }, ref) => {
  return (
    <FormBuilder size="small" ref={ref} wrappedComponentRef={ref}>
      <Fields fields={fields} />
    </FormBuilder>
  );
});
