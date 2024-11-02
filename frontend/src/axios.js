import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useIndexedDB from "./hooks/useIndexedDb";
import config from "./config";

const URL =
  config.REACT_APP_PROJECT_STATE === "production"
    ? `${config.REACT_APP_PRODUCTION_BACKEND_BASE_URL}/api`
    : `${config.REACT_APP_DEVELOPMENT_BACKEND_BASE_URL}/api`;
const api = axios.create({
  baseURL: URL,
});

let cancelTokenSource = null;

const createCancelToken = () => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel("Operation canceled due to new request.");
  }
  cancelTokenSource = axios.CancelToken.source();
};

const RefreshAccessToken = async (accessToken) => {
  const { updateItem } = useIndexedDB();
  try {
    const decodedToken = jwtDecode(accessToken);
    const response = await axios.post(
      `${URL}/authToken`,
      { username: decodedToken.username },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
        secure: true,
      }
    );
    const newAccessToken = response.data.accessToken;
    await updateItem("tokens", "accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    return console.error("Unable to refresh token", error);
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { getAllItems } = useIndexedDB();
    if (error.response?.status !== 401) {
      const originalRequest = error.config;
      try {
        const tokens = await getAllItems("tokens");
        if (tokens && tokens.accessToken) {
          const exp = jwtDecode(tokens?.accessToken).exp;
          const curr = Math.floor(Date.now() / 1000);
          if (exp < curr) {
            const { data } = await axios.post(
              `${URL}/authToken`,
              { username: jwtDecode(tokens?.accessToken).username },
              {
                headers: { Authorization: `Bearer ${tokens?.accessToken}` },
                withCredentials: true,
              }
            );
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${data.accessToken}`;
          }
        }
        return axios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(async (conf) => {
  const { getAllItems } = useIndexedDB();
  createCancelToken();
  conf.cancelToken = cancelTokenSource.token;
  const { accessToken } = await getAllItems("tokens");
  if (accessToken) {
    const decodedToken = jwtDecode(accessToken);
    if (decodedToken.exp * 1000 < Date.now()) {
      const newToken = await RefreshAccessToken(accessToken);
      conf.headers["Authorization"] = `Bearer ${newToken}`;
    } else {
      conf.headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }
  return conf;
});

export default api;
