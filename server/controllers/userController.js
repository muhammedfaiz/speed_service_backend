import {
  addAddressService,
  addReviewHelper,
  addToCartHelper,
  cancelBookingHelper,
  clearCart,
  createUser,
  expireOtp,
  fetchAllCartsHelper,
  fetchCategoriesHelper,
  getAllUserAddress,
  getBookingDetailsHelper,
  getBookingsHelper,
  getCartDetailsUser,
  getCartHelper,
  getEmployeeByDesignation,
  getRating,
  getReviewData,
  getServiceHelper,
  getStatsOfUserHelper,
  getUserByEmail,
  getUserById,
  getUserServicesData,
  placeOrderHelper,
  serviceDataHelper,
  updatePassword,
  updateProfileImageService,
  updateProfileService,
} from "../services/userServices.js";
import bcrypt from "bcryptjs";
import {
  uploadFile,
  generateAccessToken,
  generateOtp,
  generateRefreshToken,
  getFile,
  oneTimeLink,
  randomName,
  refundPayment,
  removeFile,
  sendOtp,
  sendResetPassword,
  verifyOneTimeLink,
  verifyToken,
} from "../utils/utils.js";
import jwt from "jsonwebtoken";
import { getReceiverSocketId, io } from "../socket/socket.js";

const userRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      throw new Error("All fields must be provided");
    }

    if (await getUserByEmail(email)) {
      throw new Error("Email already exists");
    }
    const otp = generateOtp();
    const user = await createUser({ name, email, password, phone, otp });
    await sendOtp(email, otp);
    setTimeout(async () => {
      await expireOtp(user._id);
    }, 60000);
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        otpSent: true,
      },
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("All fields must be provided");
    } else {
      const user = await getUserByEmail(email);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error("Invalid email or password");
      }
      if (!user.status) {
        throw new Error("User is not active");
      }
      const accessToken = generateAccessToken({ id: user._id });
      const refreshToken = generateRefreshToken({ id: user._id });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      let url;
      if (user.image) {
        url = await getFile(user.image);
      }
      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          url,
        },
        token: accessToken,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await getUserById(userId);
    if (!user || user.otp != otp) {
      res.status(400).json({ message: "Invalid Otp" });
    }
    user.isVerified = true;
    user.otp = null;
    await user.save();
    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
      },
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const otp = generateOtp();
    user.otp = otp;
    await user.save();
    await sendOtp(user.email, otp);
    setTimeout(async () => {
      await expireOtp(user._id);
    }, 60000);
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      otpSent: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).json({ message: "Authorization failed" });
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      const newAccessToken = generateAccessToken({ id: user.id });
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const userLogout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).json({ message: "Authorization failed" });
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};

const getServices = async (req, res) => {
  try {
    const data = await getUserServicesData();
    const services = [];
    for (let service of data) {
      let obj = { ...service._doc };
      let url = await getFile(service.image);
      obj.rating = await getRating(obj._id);
      obj.imageUrl = url;
      services.push(obj);
    }
    res.status(200).json({ services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const serviceData = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await serviceDataHelper(id);
    const reviews = await getReviewData(id);
    const service = { ...data._doc };
    const url = await getFile(data.image);
    service.imageUrl = url;
    res.status(200).json({ service, reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const { address, token } = req.body;
    const decode = verifyToken(token);
    if (!address) {
      throw new Error("Address field is required");
    }
    const result = await addAddressService(decode.id, address);
    if (result) {
      res.status(200).json({ message: "Address added successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const getUserAddresses = async (req, res) => {
  try {
    const { token } = req.params;
    const decode = verifyToken(token);
    const addresses = await getAllUserAddress(decode.id);
    if (!addresses) {
      throw new Error("User addresses not found");
    }
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { id, token } = req.body;
    const decode = verifyToken(token);
    const service = await getServiceHelper(id);
    const cart = await getCartDetailsUser(decode.id, service.category);
    let data = {};
    if (cart) {
      let itemExist = cart.items.find((item) => item.item._id == id);
      if (itemExist) {
        itemExist.quantity++;
        cart.totalAmount += service.price;
      } else {
        cart.items.push({ item: id, quantity: 1 });
        cart.totalAmount += service.price;
      }
      await cart.save();
    } else {
      data.user = decode.id;
      data.items = [{ item: id, quantity: 1 }];
      data.totalAmount = service.price;
      data.category = service.category;
      await addToCartHelper(data);
    }
    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

const fetchAllCarts = async (req, res) => {
  try {
    const data = await fetchAllCartsHelper(req.user.id);
    const carts = JSON.parse(JSON.stringify(data));
    for (let cart of carts) {
      const url = await getFile(cart.category.image);
      cart.imageUrl = url;
    }
    res.status(200).json({ carts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the carts" });
  }
};

const getUserCartForService = async (req, res) => {
  try {
    const { token, id } = req.params;
    const decode = verifyToken(token);
    const data = await getCartDetailsUser(decode.id, id);
    let cart = JSON.parse(JSON.stringify(data?._doc));
    for (let item of cart.items) {
      const url = await getFile(item.item.image);
      item.imageUrl = url;
    }
    if (!cart) {
      throw new Error("User cart not found");
    }
    res.status(200).json({ cart });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to access user cart" });
  }
};

const updateQuantityCart = async (req, res) => {
  try {
    const { itemId, quantity, categoryId } = req.body;
    const cart = await getCartDetailsUser(req.user.id, categoryId);
    if (cart) {
      const item = cart.items.find((item) => item.item._id == itemId);
      if (item) {
        item.quantity += quantity;
        cart.totalAmount += quantity * item.item.price;
      }
      if (item.quantity == 0) {
        cart.items = cart.items.filter((item) => item.item._id != itemId);
      }
      await cart.save();
      if (cart.items.length == 0) {
        await clearCart(cart._id);
        return res.status(200).json({ message: "Cart deleted successfully" });
      }
    }
    res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity" });
  }
};

const placeOrder = async (req, res) => {
  try {
    const data = req.body;
    if (data.cart) {
      const details = {
        user: data.cart.user,
        totalAmount: data.cart.totalAmount,
        address: data.selectedAddress,
        paymentMethod: data.paymentMethod,
        date: data.selectedDate,
        time: data.selectedTime,
        orderItems: [],
        captureId: data.captureId,
        category: data.cart.category,
      };
      for (let item of data.cart.items) {
        details.orderItems.push({
          item: item.item._id,
          quantity: item.quantity,
          price: item.item.price,
          totalPrice: item.quantity * item.item.price,
        });
      }
      const order = await placeOrderHelper(details);
      if (order) {
        await clearCart(data.cart._id);
        const employees = await getEmployeeByDesignation(data.cart.category);
        for (let employee of employees) {
          const message = `New order has been placed for your service. Order ID: ${order.orderId}`;
          const socketId = getReceiverSocketId(employee._id);
          if (socketId) {
            io.to(socketId).emit("employee_notification", {
              message,
            });
          }
        }
        res.status(200).json({ message: "Order placed successfully" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Error placing order" });
  }
};

const fetchBookings = async (req, res) => {
  try {
    const id = req.user.id;
    const data = await getBookingsHelper(id);
    const orders = JSON.parse(JSON.stringify(data));
    for (let order of orders) {
      for (let item of order.orderItems) {
        const url = await getFile(item.item.image);
        item.imageUrl = url;
      }
    }
    res.status(200).json({ bookings: orders });
  } catch (error) {
    res.status(404).json({ message: "Error getting bookings" });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getBookingDetailsHelper(id);
    const booking = JSON.parse(JSON.stringify(data));
    for (let item of booking.orderItems) {
      const url = await getFile(item.item.image);
      item.imageUrl = url;
    }
    res.status(200).json({ booking });
  } catch (error) {
    res.status(404).json({ message: "Error getting bookings" });
  }
};

const getCheckoutDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getCartHelper(id);
    const cart = JSON.parse(JSON.stringify(data));
    for (let item of cart.items) {
      const url = await getFile(item.item.image);
      item.imageUrl = url;
    }
    res.status(200).json({ cart });
  } catch (error) {
    res.status(404).json({ message: "Error getting Cart" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cancelBookingHelper(id);
    if (result) {
      if (result.paymentMethod === "paypal") {
        await refundPayment(result.captureId);
        return res.status(200).json({
          message:
            "Booking cancelled successfully and payment will be refunded shortly.",
        });
      }
      return res
        .status(200)
        .json({ message: "Booking cancelled successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error cancelling booking" });
  }
};

const addReview = async (req, res) => {
  try {
    const { id, rating, comment } = req.body;
    const result = await addReviewHelper(id, req.user.id, rating, comment);
    if (result) {
      res.status(200).json({ message: "Review added successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error adding review" });
  }
};

const fetchCategories = async (req, res) => {
  try {
    const data = await fetchCategoriesHelper();
    const categories = JSON.parse(JSON.stringify(data));
    for (let category of categories) {
      const url = await getFile(category.image);
      category.imageUrl = url;
    }
    res.status(200).json({ categories });
  } catch (error) {
    res.status(404).json({ message: "Error fetching categories" });
  }
};

const getProfileDetails = async (req, res) => {
  try {
    const data = await getUserById(req.user.id);
    const user = JSON.parse(JSON.stringify(data));
    if (user.image) {
      const url = await getFile(user.image);
      user.imageUrl = url;
    }
    res.status(200).json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      url: user.imageUrl,
    });
  } catch (error) {
    res.status(404).json({ message: "Error fetching user details" });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const { id } = req.user;
    const file = req.file;
    const fileName = randomName(req.file);
    const result = await updateProfileImageService(id, fileName);
    if (file && result) {
      if (result.image) {
        await removeFile(result.image);
      }
      await uploadFile(file, fileName);
    }
    const url = await getFile(fileName);
    res.status(200).json({ url });
  } catch (error) {
    res.status(400).json({ message: "Error updating profile image" });
  }
};

const updateProfileData = async (req, res) => {
  try {
    const { id } = req.user;
    console.log(id, req.body);
    const result = await updateProfileService(id, req.body);
    if (result) {
      res
        .status(200)
        .json({ name: result.name, email: result.email, phone: result.phone });
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating profile" });
  }
};

const getStatsOfUser = async (req, res) => {
  try {
    const { id } = req.user;
    const stats = await getStatsOfUserHelper(id);
    res.status(200).json({ stats });
  } catch (error) {
    res.status(400).json({ message: "Error getting stats" });
  }
};

const forgotPasswordDetails = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const link = await oneTimeLink(user);
    await sendResetPassword({ email: user.email, link });
    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error getting forgot password" });
  }
};

const resetPasswordDetails = async (req, res) => {
  try {
    const { id, token, password } = req.body;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const verify = verifyOneTimeLink(token, user);
    if (!verify) {
      return res.status(401).json({ message: "Invalid one-time link" });
    }
    await updatePassword(user._id, password);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

export {
  userRegister,
  userLogin,
  verifyOtp,
  resendOtp,
  userLogout,
  refreshAccessToken,
  getServices,
  serviceData,
  addAddress,
  getUserAddresses,
  addItemToCart,
  fetchAllCarts,
  getUserCartForService,
  updateQuantityCart,
  placeOrder,
  fetchBookings,
  getBookingDetails,
  getCheckoutDetails,
  cancelBooking,
  addReview,
  fetchCategories,
  getProfileDetails,
  updateProfileImage,
  updateProfileData,
  getStatsOfUser,
  forgotPasswordDetails,
  resetPasswordDetails,
};
