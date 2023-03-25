const { sqlForPartialUpdate, combineWhereClauses } = require("./sql");
const { BadRequestError } = require("../expressError");

const companyJsToSQL = {
  numEmployees: "num_employees",
  logoUrl: "logo_url",
}

const userJsToSQL = {
  firstName: "first_name",
  lastName: "last_name",
  isAdmin: "is_admin",
}

describe("Test sqlForPartialUpdate", function () {
  test("Creates correct output for valid input", function () {
    const data = {numEmployees: 75, name: "Tressel Industries"};
    const sqlData = sqlForPartialUpdate(data, companyJsToSQL);
    expect(sqlData).toEqual({
      setCols: `"num_employees"=$1, "name"=$2`,
      values: [75, "Tressel Industries"]
    });
  });

  test("Throws correct error for empty data", function () {
    const data = {};
    expect(() => {
      sqlForPartialUpdate(data, companyJsToSQL);
    }).toThrow(new BadRequestError("No data"));
  });
});

describe("Test combineWhereClauses", function () {
  test("Correctly constructs WHERE clause string with multiple clauses", function () {
    const clauseArray = [`name = 'Claudia'`, `num_employees >= 100`, `num_employees <= 500`];
    const whereString = combineWhereClauses(clauseArray);
    expect(whereString).toEqual(
      `WHERE name = 'Claudia' AND num_employees >= 100 AND num_employees <= 500`
    );
  });

  test("Correctly constructs WHERE clause string with single clause", function () {
    const whereString = combineWhereClauses([`name = 'John'`]);
    expect(whereString).toEqual(`WHERE name = 'John'`);
  });

  test("Correctly returns empty string when passed an empty array", function () {
    const whereString = combineWhereClauses([]);
    expect(whereString).toEqual('');
  });
});