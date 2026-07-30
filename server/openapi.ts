export const openapi={
  openapi:"3.0.3",info:{title:"TeamFlow API",version:"1.0.0",description:"JWT-secured team task board API"},
  servers:[{url:"http://localhost:4000/api"}],
  components:{securitySchemes:{bearerAuth:{type:"http",scheme:"bearer",bearerFormat:"JWT"}},schemas:{
    Auth:{type:"object",required:["email","password"],properties:{email:{type:"string",format:"email"},password:{type:"string",minLength:8}}},
    Project:{type:"object",required:["name"],properties:{name:{type:"string"},description:{type:"string"}}},
    Task:{type:"object",required:["title","dueDate"],properties:{title:{type:"string"},description:{type:"string"},status:{enum:["TODO","IN_PROGRESS","DONE"]},priority:{enum:["LOW","MEDIUM","HIGH","URGENT"]},dueDate:{type:"string",format:"date-time"},assigneeId:{type:"string",nullable:true}}}
  }},
  paths:{
    "/auth/register":{post:{summary:"Register",requestBody:{content:{"application/json":{schema:{allOf:[{$ref:"#/components/schemas/Auth"},{type:"object",properties:{name:{type:"string"}}}]}}},responses:{"201":{description:"Created"}}}},
    "/auth/login":{post:{summary:"Login",requestBody:{content:{"application/json":{schema:{$ref:"#/components/schemas/Auth"}}}},responses:{"200":{description:"Authenticated"}}}},
    "/projects":{get:{summary:"Accessible projects",security:[{bearerAuth:[]}],responses:{"200":{description:"OK"}}},post:{summary:"Create project (Admin)",security:[{bearerAuth:[]}],responses:{"201":{description:"Created"}}}},
    "/projects/{projectId}/tasks":{get:{summary:"List/filter/search tasks",security:[{bearerAuth:[]}],responses:{"200":{description:"OK"}}},post:{summary:"Create task",security:[{bearerAuth:[]}],responses:{"201":{description:"Created"}}}},
    "/projects/{projectId}/tasks/{taskId}":{get:{summary:"Task and audit log",security:[{bearerAuth:[]}],responses:{"200":{description:"OK"}}},patch:{summary:"Update task",security:[{bearerAuth:[]}],responses:{"200":{description:"OK"}}},delete:{summary:"Delete task",security:[{bearerAuth:[]}],responses:{"204":{description:"Deleted"}}}}
  }
};
