import axios from "axios";

var domain =
  "http://node-express-env.eba-ptsw2iac.us-east-2.elasticbeanstalk.com/api/v1";

export const login = (username, password) => {
  let payload = {
    username: username,
    password: password,
  };
  return axios.post(domain + "/login", payload);
};

export const headerData = () => {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  return axios.get(domain + "/headerData", config);
};

export const listContacts = () => {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  const userId = localStorage.getItem("userId");
  return axios.get(domain + "/listContacts/" + userId, config);
};

export const sort = (property, order) => {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  const payload = {
    attribute: property,
    order: order == "asc" ? "ASC" : "DESC",
  };
  return axios.post(domain + "/sort", payload, config);
};

export const createContact = (payload) => {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  return axios.post(domain + "/createContact", payload, config);
};

export const contactDetail = (id) => {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  return axios.get(domain + "/contact/" + id, config);
};

export const updateViewCount = (id) => {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  const payload = {
    date:
      new Date().getFullYear() +
      "-" +
      new Date().getMonth() +
      "-" +
      new Date().getDate(),
  };
  return axios.post(domain + "/updateViewCount/" + id, payload, config);
};

export const getViewCount = (id) => {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  return axios.get(domain + "/totalViews/" + id, config);
};

export const getViewCountGivenDate = (id, date) => {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  const payload = {
    date: date,
  };
  return axios.post(domain + "/viewCount/" + id, payload, config);
};

export const search = (attr, value) => {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  return axios.get(domain + "/search?attr=" + attr + "&value=" + value, config);
};
