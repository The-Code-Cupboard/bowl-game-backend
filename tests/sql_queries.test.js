const sql_helper = require("../sql_queries");

// Selecting from table

test("test get all from table", () => {
  expect(sql_helper.select_all_from_table("words")).toBe(
    "SELECT * FROM words;"
  );
});

test("test get item from table by id", () => {
  expect(
    sql_helper.select_from_table_filter("words", "id", "test-id-123")
  ).toBe("SELECT * FROM words WHERE id='test-id-123';");
});

// Deleting from table

test("test delete all from table", () => {
  expect(sql_helper.delete_all_from_table("words")).toBe("DELETE FROM words;");
});

test("test delete item from table", () => {
  expect(
    sql_helper.delete_from_table_filter("words", "id", "test-id-123")
  ).toBe("DELETE FROM words WHERE id='test-id-123';");
});

// Inserting into table

test("test inserting item into table", () => {
  labels = ["id", "text", "userid"];
  values = ["test-id", "test-text", "test-userid"];
  expect(sql_helper.insert_into_table("words", labels, values)).toBe(
    "INSERT INTO words (id, text, userid) VALUES ('test-id', 'test-text', 'test-userid');"
  );
});
