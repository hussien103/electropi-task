const configuredOrigin=process.env.CLIENT_URL;
const localFrontend=/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
export const corsOrigin=(origin:string|undefined,callback:(error:Error|null,allowed?:boolean)=>void)=>{
 const configuredHost=configuredOrigin?.replace(/^https?:\/\//,"").replace(/\/$/,"");
 const originHost=origin?.replace(/^https?:\/\//,"").replace(/\/$/,"");
 if(!origin||origin===configuredOrigin||(configuredHost&&originHost===configuredHost)||localFrontend.test(origin))return callback(null,true);
 callback(new Error("Origin is not allowed by CORS"),false);
};
