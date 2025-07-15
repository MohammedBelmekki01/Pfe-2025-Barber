// import axios from 'axios';

// const axiosClient = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL,
//   withCredentials : true,
// });

// axiosClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosClient;



import axios from 'axios';
import Cookies from 'js-cookie'; // ✅ Install this if you haven't: npm i js-cookie

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true
});

axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const xsrfToken = Cookies.get('XSRF-TOKEN'); // ✅ Read cookie manually

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken); // ✅ Add CSRF header manually
  }

  return config;
});

export default axiosClient;
