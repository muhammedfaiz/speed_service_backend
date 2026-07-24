import {
  acceptRequestService,
  addService,
  applicationService,
  changeTaskCompleteService,
  declineService,
  fetchEmployee,
  getCategoriesService,
  getCompletionRate,
  getEarnings,
  getEmployeeDetails,
  getEmployeeProfileDetails,
  getHistoryService,
  getOrderRequests,
  getRecentActivitiesService,
  getRequestsCount,
  getServiceHelper,
  getTaskCompleted,
  getTasksService,
  updateEmployeeProfileService,
} from "../services/employeeServices.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import {
  uploadFile,
  generateAccessToken,
  generateRefreshToken,
  getFile,
  randomName,
  verifyToken,
} from "../utils/utils.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesService();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const application = async (req, res) => {
  try {
    const { name, email, phone, designation, experience } = req.body;

    if (!name || !email || !phone || !designation || !experience) {
      throw new Error("All fields must be provided");
    }
    if (!req.file) {
      throw new Error("Proof document is required");
    }
    const fileName = randomName(req.file);

    await applicationService({
      name,
      email,
      phone,
      designation,
      experience,
      proof: fileName,
    });
    await uploadFile(req.file, fileName);
    res.status(200).json({ message: "Application submitted" });
  } catch (error) {
    console.log(error);
    res.staus(400).json({ message: error.message });
  }
};

export const employeeLogin = async (req, res) => {
  try {
    const { email, code } = req.body;
    const employee = await fetchEmployee(email);
    if (!employee || employee.code != code) {
      throw new Error("Invalid credentials");
    }
    const accessToken = generateAccessToken({ id: employee._id });
    const refreshToken = generateRefreshToken({ id: employee._id });
    res.cookie("employee_refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
      },
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const employeeLogout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).json({ message: "Authorization failed" });
    }
    res.clearCookie("employee_refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const employeeRefreshToken = async (req, res) => {
  try {
    const { employee_refreshToken } = req.cookies;
    if (!employee_refreshToken) {
      return res.status(403).json({ message: "Authorization failed" });
    }
    jwt.verify(
      employee_refreshToken,
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

export const getServiceData = async (req, res) => {
  try {
    const { token } = req.params;
    const { id } = verifyToken(token);
    const { services, acceptedServices } = await getServiceHelper(id);
    let data = [];
    let accepted = [];
    for (let service of services) {
      let obj = { ...service._doc };
      let url = await getFile(service.image);
      obj.imageUrl = url;
      data.push(obj);
    }
    for (let service of acceptedServices) {
      let obj = { ...service._doc };
      let url = await getFile(service.image);
      obj.imageUrl = url;
      accepted.push(obj);
    }
    res.status(200).json({ services: data, acceptedServices: accepted });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const acceptService = async (req, res) => {
  try {
    const { token, id } = req.body;
    const decode = verifyToken(token);
    const result = await addService(id, decode.id);
    if (result) {
      res.status(200).json({ message: "Accepted service successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectService = async (req, res) => {
  try {
    const { token, id } = req.body;
    const decode = verifyToken(token);
    const result = await declineService(id, decode.id);
    if (result) {
      res.status(200).json({ message: "Rejected service successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { token } = req.params;
    const decode = verifyToken(token);
    const employee = await getEmployeeDetails(decode.id);
    const bookings = await getOrderRequests(employee);
    if (bookings) {
      res.status(200).json({ bookings });
    }
  } catch (error) {
    res.status(400).json({ message: "Bookings not found" });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { token, id } = req.body;
    const decode = verifyToken(token);
    const result = await acceptRequestService({
      employee: decode.id,
      orderId: id,
    });
    if (result) {
      const socketId = getReceiverSocketId(result.user);
      if(socketId){
        const message = "Your service provider has been fixed for the booking #" + result.orderId;
        io.to(socketId).emit("user_notification",{message});
      }
      res.status(200).json({ message: "Request accepted successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCommitedTasks = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const data = await getTasksService(employeeId);
    if (data) {
      res.status(200).json({ tasks: data });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const changeTaskComplete = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await changeTaskCompleteService(id);
    if (result) {
      const socketId = getReceiverSocketId(result.user);
      if(socketId){
        const message = "Your service has been completed for the booking #" + result.orderId;
        io.to(socketId).emit("user_notification",{message});
      }
      res.status(200).json({ message: "Order completed successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to change status" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await getHistoryService(req.user.id);
    res.status(200).json({ history });
  } catch (error) {
    res.status(404).json({ message: "Failed to get history" });
  }
};

export const getStats = async (req, res) => {
  try {
    const id = req.user.id;
    const completed = await getTaskCompleted(id);
    const pendingRequest = await getRequestsCount(id);
    const earnings = await getEarnings(id);
    const completionRate = await getCompletionRate(id);
    res
      .status(200)
      .json({ completed, pendingRequest, earnings, completionRate });
  } catch (error) {
    res.status(404).json({ message: "Failed to get stats" });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const id = req.user.id;
    const activities = await getRecentActivitiesService(id);
    if (activities) {
      res.status(200).json({ activities });
    }
  } catch (error) {
    res.stats(404).json({ message: "Failed to get recent activities" });
  }
};

export const getEmployeeProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const employee = await getEmployeeProfileDetails(id);
    res
      .status(200)
      .json({ ...employee._doc, designation: employee.designation.name });
  } catch (error) {
    res.status(400).json({ message: "Failed to get employee profile" });
  }
};

export const updateEmployeeProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const update = await updateEmployeeProfileService(id, req.body);
    const employee = await getEmployeeProfileDetails(id);
    res
      .status(200)
      .json({ ...employee._doc, designation: employee.designation.name });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to update employee profile" });
  }
};
