// Selecting from table

exports.select_all_from_table = (table) => {
  return `SELECT * FROM ${table};`;
};

exports.select_from_table_filter = (table, label, value) => {
  return `SELECT * FROM ${table} WHERE ${label}='${value}';`;
};

// Deleting from table

exports.delete_all_from_table = (table) => {
  return `DELETE FROM ${table};`;
};

exports.delete_from_table_filter = (table, label, value) => {
  return `DELETE FROM ${table} WHERE ${label}='${value}';`;
};

// Inserting into table

exports.insert_into_table = (table, labels, values) => {
  return `INSERT INTO ${table} (${labels.join(", ")}) VALUES ('${values.join(
    "', '"
  )}');`;
};
