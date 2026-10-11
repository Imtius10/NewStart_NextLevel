export interface IRegister { 
     name: string,
  email: string,
  password: string,
  role?: "TENANT" | "LANDLORD" | "ADMIN",
  
}


export interface ILoggedIn { 
  email: string,
  password:string
}