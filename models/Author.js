const connection = require("./connection");

const getNewAuthor = (authorData) => {
const { id, firstName, middleName, lastName, birthday, nationality } = authorData;

const fullName = [firstName, middleName, lastName]
  .filter((name) => name)
  .join(' ');

return {
  id,
  firstName,
  middleName,
  lastName,
  birthday,
  nationality,
  name: fullName,
 };
};

const serialize = (authorData) => ({
  id: authorData.id,
  firstName: authorData.first_name,
  middleName: authorData.middle_name,
  lastName: authorData.last_name,
  birthday: authorData.birthday,
  nationality: authorData.nationality,
});

const getAll = async () => {
  const [authors] = await connection.execute(
    "SELECT id, first_name, middle_name, last_name, birthday, nationality FROM authors;"
  );

  const result = authors.map(serialize).map(getNewAuthor);
  console.log(result);
  return result;
}

const findById = async (id) => {
  const [authorData] = await connection.execute(
    "SELECT id, first_name, middle_name, last_name, birthday, nationality FROM authors WHERE id = ?;",
    [id]
  );

  if (!authorData.length) return null;

  const { firstName, middleName, lastName, birthday, nationality } = authorData.map(serialize)[0];

  return getNewAuthor({
    id,
    firstName,
    middleName,
    lastName,
    birthday,
    nationality,
  });
}

const isValid = (firstName, middleName, lastName) => {
  if (!firstName || typeof firstName !== "string") return false;
  if (!lastName || typeof lastName !== "string") return false;
  if (middleName && typeof middleName !== "string") return false;

  return true;
}

const create = async (firstName, middleName, lastName, birthday, nationality) => {
  const [result] = await connection.execute(
    "INSERT INTO authors (first_name, middle_name, last_name, birthday, nationality) VALUES (?, ?, ?, ?, ?);",
    [firstName, middleName, lastName, birthday, nationality]
  );

  return { id: result.insertId, firstName, middleName, lastName, birthday, nationality };
}

const update = async (id, firstName, middleName, lastName, birthday, nationality) => {
  await connection.execute(
    "UPDATE authors SET first_name = ?, middle_name = ?, last_name = ?, birthday = ?, nationality = ? WHERE id = ?;",
    [firstName, middleName, lastName, birthday, nationality, id]
  );

  return { id, firstName, middleName, lastName, birthday, nationality };
}

const exclude = async (id) => {
  await connection.execute(
    "DELETE FROM authors WHERE id = ?;",
    [id]
  );
}

module.exports = {
  getAll,
  findById,
  isValid,
  create,
  update,
  exclude,
};
