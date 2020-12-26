const { format, addHours } = require("date-fns");

console.log(format(addHours(new Date(), 8), "yyyy-mm-dd HH:m:s"));
