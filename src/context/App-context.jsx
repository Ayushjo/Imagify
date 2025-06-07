import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext({
  user: null,
  setUser: () => {},
  showLogin: null,
  setShowLogin: () => {},
  token: null,
  setToken: () => {},
  credit: null,
  setCredit: () => {},
  login: () => {},
  register: () => {},
  logout: () => {},
  name: null,
  generateImages: () => {},
  paymentRazorpay: () => {},
});

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")) || null
  );
  const [credit, setCredit] = useState(localStorage.getItem("credit") || null);
  const [name, setName] = useState(
    JSON.parse(localStorage.getItem("name")) || null
  );

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:4000/api/users/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", JSON.stringify(response.data.token));

      localStorage.setItem("credit", JSON.stringify(response.data.credits));
      localStorage.setItem("name", JSON.stringify(response.data.name));
      setToken(response.data.token);
      setCredit(response.data.credits);

      setUser(true);
      setName(response.data.name);

      toast(response.data.message, {
        icon: "✅",
        className:
          "bg-blue-100 border-l-4 border-blue-400 text-blue-700 rounded-md px-4 py-3",
        bodyClassName: "text-sm font-medium",
      });
      setTimeout(() => {
        setShowLogin(false);
      }, 1000);

      return response.data;
    } catch (error) {
      toast(error.response?.data?.message || "Login Failed", {
        icon: "⚠️",
        className:
          "bg-gray-100 border-l-4 border-gray-400 text-gray-800 rounded-md px-4 py-3",
        bodyClassName: "text-sm font-medium",
      });
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post("http://127.0.0.1:4000/api/users/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", JSON.stringify(res.data.token));
      localStorage.setItem("credit", JSON.stringify(res.data.credits));
      localStorage.setItem("name", JSON.stringify(res.data.name));
      setToken(res.data.token);
      setCredit(res.data.credits);
      setUser(true);
      setName(res.data.name);
      toast(res.data.message, {
        icon: "✅",
        className:
          "bg-blue-100 border-l-4 border-blue-400 text-blue-700 rounded-md px-4 py-3",
        bodyClassName: "text-sm font-medium",
      });
      setTimeout(() => {
        setShowLogin(false);
      }, 1000);
      return res.data;
    } catch (error) {
      toast(error.response?.data?.message || "Registration failed", {
        icon: "⚠️",
        className:
          "bg-gray-100 border-l-4 border-gray-400 text-gray-800 rounded-md px-4 py-3",
        bodyClassName: "text-sm font-medium",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("credit");
      localStorage.removeItem("name");
    }
  };

  const logout = async (req, res) => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("credit");
      localStorage.removeItem("name");
      setToken(null);
      setCredit(null);
      setUser(false);
      setName(null);
      toast("Logout Successfull", {
        icon: "✅",
        className:
          "bg-blue-100 border-l-4 border-blue-400 text-blue-700 rounded-md px-4 py-3",
        bodyClassName: "text-sm font-medium",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const generateImages = async (prompt) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:4000/api/images/generate-image",
        { prompt },
        { headers: { token } }
      );
      toast(response.data.message, {
        icon: "✅",
        className:
          "bg-blue-100 border-l-4 border-blue-400 text-blue-700 rounded-md px-4 py-3",
        bodyClassName: "text-sm font-medium",
      });

      localStorage.setItem(
        "credit",
        JSON.stringify(response.data.creditbalance)
      );
      setCredit(response.data.creditbalance);
      return response.data.image;
    } catch (error) {
      toast(error.response?.data?.message || "Failed to generate images", {
        icon: "⚠️",
        className:
          "bg-gray-100 border-l-4 border-gray-400 text-gray-800 rounded-md px-4 py-3",
        bodyClassName: "text-sm font-medium",
      });
      if (
        error.response.data.credits < 0 ||
        error.response.data.credits === 0
      ) {
        navigate("/buy");
      }
    }
  };

  const initPay = async (order) => {
    const options = {
      key: "rzp_test_zZCBqcMpXxWKIy",
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          console.log(response);
          
          const res = await axios.post(
            "http://127.0.0.1:4000/api/users/verify-razor",
              response
            
          );
          if(res.status==200){

            const { data } = await axios.post(
              "http://127.0.0.1:4000/api/users/credits",{},{headers:{token}}
            );

            localStorage.setItem("credit",JSON.stringify(data.credits))
            setCredit(data.credits)
            navigate("/")
            toast("Credits Added", {
              icon: "✅",
              className:
                "bg-blue-100 border-l-4 border-blue-400 text-blue-700 rounded-md px-4 py-3",
              bodyClassName: "text-sm font-medium",
            });

          }

          
        } catch (error) {
          toast(error.response?.data?.message || "Payment Failed", {
            icon: "⚠️",
            className:
              "bg-gray-100 border-l-4 border-gray-400 text-gray-800 rounded-md px-4 py-3",
            bodyClassName: "text-sm font-medium",
          });
          
        }
      },
    };

    const rzp = new window.Razorpay(options)
    rzp.open()
  };

  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true);
      }
      const response = await axios.post(
        "http://127.0.0.1:4000/api/users/pay-razor",
        { planId },
        { headers: { token } }
      );
      if (response.status == 200) {
        initPay(response.data.order);
      }
    } catch (error) {
      toast(error.response?.data?.message || "Payment Failed", {
        icon: "⚠️",
        className:
          "bg-gray-100 border-l-4 border-gray-400 text-gray-800 rounded-md px-4 py-3",
        bodyClassName: "text-sm font-medium",
      });
    }
  };

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    token,
    setToken,
    credit,
    setCredit,
    login,
    register,
    logout,
    name,
    generateImages,
    paymentRazorpay,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
