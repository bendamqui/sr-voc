import { format } from "date-fns";

export const formatDate = value => {
  return value === "" || value === null
    ? value
    : format(new Date(value), "yyyy-MM-dd HH:ii:ss");
};
