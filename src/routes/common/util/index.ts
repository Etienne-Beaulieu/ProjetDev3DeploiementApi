import { parseObject, TSchema } from 'jet-validators/utils';

import { ValidationError } from '@src/common/util/route-errors';

export function parseReq<U extends TSchema>(schema: U) {
  return parseObject(schema, errors => {
    throw new ValidationError(errors);
  });
}
