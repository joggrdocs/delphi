// import axios from 'axios';
//
// interface Config {
//   url: string;
//   branch?: string;
//   commit?: string;
// }
//
// interface Service {
//   apiKey: string;
//   name: string;
// }
//
// export async function deploy (config: Config, service: Service): Promise<void> {
//   const result = await axios.post(`${config.url}/deployments`, {
//     apiKey: service.apiKey,
//     name: service.name,
//     branch: config.branch,
//     commit: config.commit
//   });
//
//   // Poll for updates aka is released?
// }
