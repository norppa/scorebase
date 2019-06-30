const constants = {
  siteHeader: '--- jtthaavi music database ---',
  skeletonAbc: 'X:0\nT:new tune\nC:composer\nM:4/4\nL:1/8\nK:C maj\nC'
}

const dev = {
  ...constants,
  api: 'http://localhost:3000/api',
}

const prod = {
  ...constants,
  api: '/scorebase/api',
}

export default process.env.NODE_ENV === 'development' ? dev : prod
