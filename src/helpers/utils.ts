import _ from 'lodash';

export const getParameterByName = (
  name: string,
  url = window.location.href
) => {
  // eslint-disable-next-line no-useless-escape
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export function replaceTokens<T>(
  obj: T,
  context: { [key: string]: unknown }
): T {
  if (typeof obj === 'string') {
    return obj.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_original, key) =>
      String((_.get(context, key, '') as string) ?? '')
    ) as unknown as T;
  }
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map((item) => replaceTokens(item, context)) as unknown as T;
    }
    //@ts-ignore
    return Object.entries(obj).reduce((acc: any, [key, value]) => {
      acc[key] = replaceTokens(value, context);
      return acc;
    }, {} as T);
  }
  return obj;
}

export const defaultFunc = () => {};

export const getSelfIdCookie = () => {
  const cookieName = 'self.id-local-id';
  const b = document.cookie.match(
    '(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)'
  );
  return b ? b.pop() : '';
};

export const hideAddress = (address: string) => {
  return (
    address.substring(0, 6) + '...' + address.substring(address.length - 4)
  );
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
