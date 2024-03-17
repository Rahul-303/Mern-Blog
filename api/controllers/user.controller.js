export const test = (req, res) => {
  res.json({ message: "api is working" });
};

export const signout = (req, res, next) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "logged out successfully!" });
};
