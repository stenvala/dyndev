export function subsToUrl(
  url: string,
  params?: { [key: string]: string | number | boolean },
  queryParams?: { [key: string]: string | number | boolean }
): string {
  if (params) {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const regex = new RegExp(':' + key + '($|/)');
        url = url.replace(regex, params[key] + '$1');
      }
    }
  }
  if (queryParams) {
    const qs = Object.keys(queryParams)
      .map((key) => {
        const value = encodeURIComponent(queryParams[key]);
        return `${key}=${value}`;
      })
      .join('&');
    if (qs.length > 0) {
      url += '?' + qs;
    }
  }
  return url;
}
