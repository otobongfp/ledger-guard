import convict from 'convict';

export { default as schema } from './schema';

convict.addFormat({
  name: 'comma-separated-string',
  validate: function (val) {
    const emptyStringRegex = /^$/;
    const commaSeparatedStringRegex = /^\w+(\s*,\s*\w+)*$/;

    if (!emptyStringRegex.test(val) && !commaSeparatedStringRegex.test(val)) {
      throw new Error('must be a comma separated string');
    }
  },
  coerce: function (val) {
    if (!val) return [];
    return val.trim().split(/\s*,\s*/);
  },
});
