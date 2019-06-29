const skeletonAbc = `X:0
T:new tune
C:composer
M:4/4
L:1/8
K:C maj
C`

const dev = {
  api: 'http://localhost:3000/api',
  skeletonAbc
}

const prod = {
  api: '/scorebase/api',
  skeletonAbc
}

export default process.env.NODE_ENV === 'development' ? dev : prod
