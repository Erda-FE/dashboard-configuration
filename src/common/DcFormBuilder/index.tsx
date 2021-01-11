import * as React from 'react';
import { FormBuilder } from '@terminus/nusi';

const { Fields } = FormBuilder;

export const DcFormBuilder = React.forwardRef(({ fields }: { fields: any }, ref) => {
  return (
    <FormBuilder
      size="small"
      fieldSize="small"
      wrappedComponentRef={ref}
    >
      <Fields numOfRowsLimit={1} fields={fields} />
    </FormBuilder>
  );
});
