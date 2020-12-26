// @todo use jsStore required schema as schema for the models
import { connection } from "@/js-store";

const createBaseModel = connection => {
  return schema => ({
    connection,
    findById(id) {
      return connection
        .select({ from: schema.name, where: { id } })
        .then(([row]) => row);
    },
    update(data, query) {
      return connection.update({ in: schema.name, set: data, ...query });
    },
    insert(data) {
      return connection.insert({
        into: schema.name,
        values: Array.isArray(data) ? data : [data]
      });
    },
    select(query) {
      return connection.select({ from: schema.name, ...query });
    },
    count(query) {
      return connection.count({ from: schema.name, ...query });
    },
    remove(query) {
      return connection.remove({ from: schema.name, ...query });
    }
  });
};

export const model = createBaseModel(connection);
