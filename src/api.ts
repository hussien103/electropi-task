const BASE=import.meta.env.VITE_API_URL||"http://localhost:4000";
export type User={id:string;name:string;email:string;role:"ADMIN"|"MEMBER"};
export type Project={id:string;name:string;description:string;_count?:{tasks:number;members:number}};
export type Task={id:string;title:string;description:string;status:"TODO"|"IN_PROGRESS"|"DONE";priority:"LOW"|"MEDIUM"|"HIGH"|"URGENT";dueDate:string;assignee:User|null;assigneeId?:string|null};
export async function api<T>(path:string,options:RequestInit={}):Promise<T>{
  const token=localStorage.getItem("token");
  const response=await fetch(`${BASE}/api${path}`,{...options,headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{}) ,...options.headers}});
  if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.message||`Request failed (${response.status})`);}
  return response.status===204?undefined as T:response.json();
}
export const API_URL=BASE;
