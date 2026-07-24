import {
  addCategoryService,
  addServiceHelper,
  changeEmployeeStatusService,
  checkPassword,
  createAdmin,
  deleteCategoryService,
  deleteServiceHelper,
  fetchOrderService,
  getAdminByEmail,
  getAllCategoriesService,
  getAllOrdersService,
  getApplicationByIdAndDelete,
  getApplicationService,
  getCategory,
  getCategoryDetailsService,
  getEmployeeService,
  getSalesDataService,
  getServicesData,
  getUsers,
  serviceData,
  setEmployee,
  updateCategoryDetailsService,
  updateServiceHelper,
  userChangeStatus,
} from "../services/adminService.js";
import {
  uploadFile,
  generateAccessToken,
  generateAlphanumericValue,
  generateRefreshToken,
  getFile,
  randomName,
  removeFile,
  sendEmployeeCode,
} from "../utils/utils.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const adminRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new Error("All fields must be provided");
    }

    const admin = await createAdmin({ name, email, password });
    res.status(201).json({ name: admin.name, email: admin.email });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create admin");
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const admin = await getAdminByEmail(email);
    if (admin && (await checkPassword(admin, password))) {
      const accessToken = generateAccessToken({ id: admin._id });
      const refreshToken = generateRefreshToken({ id: admin._id });
      res.cookie("admin_refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        admin: { name: admin.name, email: admin.email },
        token: accessToken,
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: error.message });
  }
};

export const adminRefreshToken = async (req, res) => {
  try {
    const { admin_refreshToken } = req.cookies;
    if (!admin_refreshToken) {
      return res.status(403).json({ message: "Authorization failed" });
    }
    jwt.verify(
      admin_refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }
        const newAccessToken = generateAccessToken({ id: user.id });
        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const adminLogout = async (req, res) => {
  try {
    const { admin_refreshToken } = req.cookies;
    if (!admin_refreshToken) {
      return res.status(403).json({ message: "Authorization failed" });
    }
    res.clearCookie("admin_refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    const data = users.map((user) => {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        createdAt: new Date(user.createdAt).toLocaleDateString(),
      };
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const changeUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const user = await userChangeStatus(userId, status);
    res.status(200).json({ message: `status updated` });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const addCategory = async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;
    const fileName = randomName(file);
    const category = await addCategoryService(data, fileName);
    if (file && category) {
      await uploadFile(file, fileName);
    }
    res.status(200).json({ message: "Added Category" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    for (let category of categories) {
      const url = await getFile(category.image);
      category.imageUrl = url;
    }
    res.status(200).json({ categories });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await getCategory(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }
    await removeFile(category.image);
    const response = await deleteCategoryService(category._id);
    if (response) {
      res.status(200).json({ message: "deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const data = await getApplicationService();
    const applications = [];
    for (let application of data) {
      const obj = { ...application._doc };
      const url = await getFile(application.proof);
      obj.proofUrl = url;
      applications.push(obj);
    }
    res.status(200).json({ applications });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const acceptApplication = async (req, res) => {
  try {
    const { id } = req.body;
    const application = await getApplicationByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    const code = generateAlphanumericValue(5);
    await sendEmployeeCode({ email: application.email, code });
    const employee = await setEmployee(application, code);
    res.status(200).json({
      message:
        "Employee added successfully, employee code has been sent to email",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await getApplicationByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    await removeFile(application.proof);
    res.status(200).json({ message: "Application rejected successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await getEmployeeService();
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    let data = [];
    for (let item of employee) {
      data.push({
        id: item._id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        experience: item.experience,
        status: item.status,
        joined: new Date(item.createdAt).toLocaleDateString(),
        designation: item.designation.name,
      });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const changeEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await changeEmployeeStatusService(id, req.body.status);
    if (result) {
      res.status(200).json({ message: result });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addNewService = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    if (!req.file) {
      throw "Image required";
    }
    const fileName = randomName(req.file);
    const data = {
      name,
      price,
      category,
      description,
      image: fileName,
    };
    const result = await addServiceHelper(data);
    if (result && result.image) {
      await uploadFile(req.file, fileName);
    }
    if (result) {
      res.status(200).json({ message: "Service added successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const data = await getServicesData();
    const services = [];
    for (let service of data) {
      const obj = { ...service._doc };
      const url = await getFile(service.image);
      obj.imageUrl = url;
      services.push(obj);
    }
    res.status(200).json({ services });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteServiceHelper(id);
    if (result.image) {
      await removeFile(result.image);
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getServiceData = async (req, res) => {
  try {
    const data = await serviceData(req.params.id);
    const url = await getFile(data.image);
    const service = { ...data._doc };
    service.imageUrl = url;
    res.status(200).json({ service });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateServiceData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description } = req.body;
    let fileName;
    if (req.file) {
      fileName = randomName(req.file);
      await uploadFile(req.file, fileName);
    }
    const data = {
      name,
      price,
      category,
      description,
    };
    if (fileName) {
      data.image = fileName;
    }
    const result = await updateServiceHelper(id, data);
    if (data.image && result.image) {
      await removeFile(result.image);
    }
    res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrdersService = async (req, res) => {
  try {
    const orders = await getAllOrdersService();
    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json({ message: "Couldn't get orders" });
  }
};

export const fetchOrderDetails = async (req, res) => {
  try {
    const data = await fetchOrderService(req.params.id);
    const order = JSON.parse(JSON.stringify(data));
    for (let item of order.orderItems) {
      const url = await getFile(item.item.image);
      item.item.imageUrl = url;
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch order details" });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const orders = await getSalesDataService();
    let totalRevenue = 0;
    let totalSales = 0;
    const totalOrders = orders.length;
    const salesPerDay = [];

    orders.forEach((order) => {
      totalRevenue += order.totalAmount;

      if (order.status === "Completed") {
        totalSales++;
      }
      const day = new Date(order.createdAt).toISOString().split("T")[0];
      const existingData = salesPerDay.find((data) => data.day == day);
      if (existingData) {
        existingData.totalSales += order.status === "Completed" ? 1 : 0;
        existingData.totalOrders += 1;
        existingData.totalRevenue += order.totalAmount;
      } else {
        salesPerDay.push({
          day,
          totalSales: order.status === "Completed" ? 1 : 0,
          totalOrders: 1,
          totalRevenue: order.totalAmount,
        });
      }
    });

    const salesData = {
      totalRevenue,
      totalSales,
      totalOrders,
      salesPerDay,
    };
    res.status(200).json({ salesData });
  } catch (error) {
    res.status(404).json({ message: "Failed to get sales data" });
  }
};

export const getDashboard = async(req,res)=>{
  try {
    const orders = await getSalesDataService();
    const totalOrders = orders.length;
    let totalSales = 0;
    let totalRevenue = 0;
    const sales = [];
    const orderData = [];
    orders.forEach((item) => {
      const day = new Date(item.createdAt).toLocaleDateString();
      if(item.status==="Completed") {
        totalSales++;
        totalRevenue += item.totalAmount;
      }
      const existingSalesData = sales.find((data) => data.day === day);
      const existingOrderData = orderData.find((data) => data.day === day);
      if(existingSalesData) {
        existingSalesData.revenue += 1;
      } else {
        sales.push({day,revenue:1})
      }
      if(existingOrderData){
        existingOrderData.count += 1;
      }else{
        orderData.push({day,count:1});
      }
    });
   res.status(200).json({totalSales,totalRevenue,totalOrders,sales,orders:orderData})
  } catch (error) {
    res.status(400).json({message:"Failed to fetch details"})
  }
}

export const getCategoryDetails = async(req,res)=>{
  try {
    const data = await getCategoryDetailsService(req.params.id);
    const category = JSON.parse(JSON.stringify(data));
    if(data){
      const url = await getFile(category.image);
      category.image = url;
    }
    res.status(200).json({category});
  } catch (error) {
    res.status(404).json({message:"Failed to fetch details"});
  }
}

export const updateCategoryDetails = async(req,res)=>{
  try {
    const {id}=req.params;
    const {name}=req.body;
    let fileName;
    if(req.file){
      fileName = randomName(req.file);
      await uploadFile(req.file,fileName);
    }
    const result = await updateCategoryDetailsService(id, {name,image:fileName});
    if(fileName && result.image){
      await removeFile(result.image);
    }
    res.status(200).json({message:"Category details updated successfully"});
  } catch (error) {
    res.status(400).json({message:"Failed to update details"});
  }
}