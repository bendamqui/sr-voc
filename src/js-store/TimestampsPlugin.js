import { Schema } from "./schema";

const setCreatedAt = date => document => ({
  ...document,
  createdAt: date,
  updatedAt: date
});

export const TimeStampPlugin = {
  setup: function(connection) {
    connection.addMiddleware((request, next) => {
      if (
        request.name === "insert" &&
        Schema.getTable(request.query.into).useTimestamps()
      ) {
        request.query.values = request.query.values.map(
          setCreatedAt(new Date())
        );
      }

      if (
        request.name === "update" &&
        Schema.getTable(request.query.in).useTimestamps()
      ) {
        request.query.set.updatedAt = new Date();
      }
      next();
    });
  }
};
