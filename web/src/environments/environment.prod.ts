export const environment = {
  production: true,
  apiBaseUrl: process.env["ENV"] && process.env["ENV"] === 'PROD' ? "https://eno-erp-api.vercel.app/api/v1" : "https://eno-erp-api-stage.vercel.app/api/v1",
};
