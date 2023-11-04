export const objectToDocument = obj => ({
  _id: crypto.randomUUID(),
  created_at: Date.now(),
  ...obj,
  updated_at: Date.now()
});
