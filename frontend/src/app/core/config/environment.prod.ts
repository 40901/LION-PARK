// Ambiente de produção (contêiner Docker).
//
// apiUrl é RELATIVO: o navegador fala apenas com o nginx, que encaminha /api
// para o serviço do backend na rede interna do Docker. Como a origem é a mesma,
// não há requisição cross-origin e o CORS deixa de ser necessário.
//
// Substitui environment.ts em tempo de build via "fileReplacements" na
// configuração de produção do angular.json.
export const environment = {
  production: true,
  apiUrl: '/api'
};
