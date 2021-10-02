exports.setLocalStorage = (token, name, id) => {
  localStorage.setItem("token", token);
  localStorage.setItem("name", name);
  localStorage.setItem("userId", id);
};

exports.emptyLocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("userId");
};
