import * as React from 'react';
import { FormBuilder } from '@terminus/nusi';

const { Fields } = FormBuilder;

export const DcFormBuilder = ({ fields }: { fields: any }) => {
  return (
    <FormBuilder
      size="small"
      fieldSize="small"
    >
      <Fields numOfRowsLimit={1} fields={fields} />
    </FormBuilder>
  );
}