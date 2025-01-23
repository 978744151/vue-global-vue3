
// 返回项目路径
export function getNormalPath(p: string) {
  if (p.length === 0 || !p || p == 'undefined') {
    return p
  };
  let res = p.replace('//', '/')
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1)
  }
  return res;
}

/**
 * @params back tagView 标签 
 */
export function getPageData(item, path, url) {
  return {
    path: `/g-back/iframe/${path}`, //是否展示
    name: path, //route名称
    meta: {
      menuName: item.name, //菜单名称
      link: url, //iframe 真实url
      appName: "g-back", //app key
    },
  }
}
/**
 * @params 非back tagView 标签 
 */
export function getNoBackPageData(item, path, url) {
  return {
    path: `${path}`,
    name: path,
    meta: {
      menuName: item.name,
      link: url,
      appName: "g-main",
    },
  }
}
/**
 * @params iframeView back后台iframe存储 
 */
export function getIframePageData(item, path, url) {
  return {
    path: `${import.meta.env.VITE_BACK_URL}/iframe/${path}`,
    name: path,
    meta: {
      title: item.name,
      link: url,
      appName: "g-back",
      path: `/g-back/iframe/${path}`,
    },
  }
}