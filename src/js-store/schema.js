import { DATA_TYPE } from "jsstore";

const version = 1;
export const schema = {
  name: "sr_voc",
  tables: [
    {
      name: "lessons",
      timestamps: true,
      version,
      columns: {
        id: { primaryKey: true, autoIncrement: true },
        name: { notNull: true, dataType: DATA_TYPE.String },
        completed: { dataType: DATA_TYPE.Number, default: 0 },
        updatedAt: { notNull: true, dataType: DATA_TYPE.DateTime },
        createdAt: { notNull: true, dataType: DATA_TYPE.DateTime }
      }
    },
    {
      name: "words",
      timestamps: true,
      version,
      columns: {
        id: { primaryKey: true, autoIncrement: true },
        lessonId: {
          notNull: true,
          dataType: DATA_TYPE.Number,
          enableSearch: true
        },
        source: { dataType: DATA_TYPE.String },
        target: { dataType: DATA_TYPE.String },
        pronunciation: { dataType: DATA_TYPE.String },
        level: { notNull: true, dataType: DATA_TYPE.Number, default: 0 },
        lastAttempt: { dataType: DATA_TYPE.DateTime, default: null },
        updatedAt: { notNull: true, dataType: DATA_TYPE.DateTime },
        createdAt: { notNull: true, dataType: DATA_TYPE.DateTime }
      }
    },
    {
      name: "results",
      timestamps: true,
      version,
      columns: {
        id: { primaryKey: true, autoIncrement: true },
        wordId: { notNull: true, dataType: DATA_TYPE.Number },
        result: { notNull: true, dataType: DATA_TYPE.Number },
        type: { notNull: true, dataType: DATA_TYPE.String }, // learn, review, overStudy
        updatedAt: { notNull: true, dataType: DATA_TYPE.DateTime },
        createdAt: { notNull: true, dataType: DATA_TYPE.DateTime }
      }
    }
  ]
};

const Table = table => ({
  ...table,
  useTimestamps() {
    return this.timestamps === true;
  }
});

const wrapper = schema => {
  const accessor = Object.assign({}, schema);
  accessor.tables = schema.tables.reduce(
    (hash, { name, ...table }) => ({
      ...hash,
      [name]: Table(table)
    }),
    {}
  );
  return {
    ...accessor,
    getTable(name) {
      return this.tables[name];
    }
  };
};

export const Schema = wrapper(schema);
