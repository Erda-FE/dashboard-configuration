import React from 'react';
import FormBuilder from 'src/common/form-builder';

const { Fields } = FormBuilder;

export const DcFormBuilder = React.forwardRef<any, { fields: any }>(({ fields }, ref) => {
  return (
    <FormBuilder size="small" ref={ref}>
      <Fields fields={fields} />
    </FormBuilder>
  );
});
