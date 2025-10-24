import axiosInstance from "./axiosInstance";

class UserService {
  public async getUserData(token:string) {
    try {
      const res = await axiosInstance.get("/user/get-data",{
        headers:{
            Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async createData(data: any,token:string) {
    try {
      const res = await axiosInstance.post("/user/create-data", data,
        {
                headers:{
            Authorization: `Bearer ${token}`
        }
        }
      );
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

 
}

export const userService = new UserService();
