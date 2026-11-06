module.exports.getDate = function () {
  const date = new Date();
  const day = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return day;
};
