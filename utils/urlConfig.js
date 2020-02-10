const domain = "https://enigmatic-island-47099.herokuapp.com";
const interfaces = {
  homepage: domain + '/api/profiles/homepage',
  productions: domain + '/api/profiles/productions',
  productionsList: domain + '/api/profiles/productionsList',
  productionDetail: domain + '/api/profiles/productionDetail'
}

// 导出
module.exports = interfaces;