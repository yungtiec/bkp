"use strict";
const rp = require("request-promise");
const Promise = require("bluebird");
const parse = require("csv-parse");
const parsePromise = Promise.promisify(parse);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const cities = await rp.get(
      "https://pkgstore.datahub.io/core/world-cities/world-cities_csv/data/6cc66692f0e82b18216a48443b6b95da/world-cities_csv.csv"
    );
    const citiesArray = await parsePromise(cities, { columns: true });
    return queryInterface.bulkInsert(
      "tags",
      citiesArray
        // .slice(0, 100)
        .map(data => ({
          name: `${data.name}, ${data.country}`.toLowerCase(),
          display_name: `${data.name}, ${data.country}`,
          city: data.name,
          country: data.country,
          type: "location",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW")
        }))
        .concat([
          {
            name: "analyst",
            display_name: "Analyst",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "data analyst",
            display_name: "Data Analyst",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "business analyst",
            display_name: "Business Analyst",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "account executive",
            display_name: "Account Executive",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "advisor",
            display_name: "Advisor",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "attorney",
            display_name: "Attorney",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "account manager",
            display_name: "Account Manager",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "software architect",
            display_name: "Software Architect",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "business development",
            display_name: "Business Development",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "backend developer",
            display_name: "Backend Developer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "manager business development",
            display_name: "Manager Business Development",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "business owner",
            display_name: "Business Owner",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "director of business development",
            display_name: "Director of Business Development",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "business operations",
            display_name: "Business Operations",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "brand strategy",
            display_name: "Brand Strategy",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "customer service",
            display_name: "Customer Service",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "content creator",
            display_name: "Content Creator",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "CEO",
            display_name: "CEO",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "CTO",
            display_name: "CTO",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "creative director",
            display_name: "Creative Director",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "COO",
            display_name: "COO",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "consultant",
            display_name: "Consultant",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "co-founder",
            display_name: "Co-founder",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "developer",
            display_name: "Developer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "designer",
            display_name: "Designer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "full stack developer",
            display_name: "Full Stack Developer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "frontend developer",
            display_name: "Frontend Developer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "data scientist",
            display_name: "Data Scientist",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "UI/UX designer",
            display_name: "UI/UX Designer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "software engineer",
            display_name: "Software Engineer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "QA engineer",
            display_name: "QA Engineer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "system engineer",
            display_name: "System Engineer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "mechanical engineer",
            display_name: "Mechanical Engineer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "engineering manager",
            display_name: "Engineering Manager",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "entrepreneur",
            display_name: "Entrepreneur",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "engineer",
            display_name: "Engineer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "senior software engineer",
            display_name: "Senior Software Engineer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "finance",
            display_name: "Finance",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "founder",
            display_name: "Founder",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "frontend engineer",
            display_name: "Frontend Engineer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "growth hacking",
            display_name: "Growth Hacking",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "graphic designer",
            display_name: "Graphic Designer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "general manager",
            display_name: "General Manager",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "senior graphic designer",
            display_name: "Senior Graphic Designer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "head of growth",
            display_name: "Head Of Growth",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "game designer",
            display_name: "Game Designer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "motion graphic designer",
            display_name: "Motion Graphic Designer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "general partner",
            display_name: "General Partner",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "human resources",
            display_name: "Human Resources",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "hardware engineer",
            display_name: "Hardware Engineer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "head of sales",
            display_name: "Head of Sales",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "head of product",
            display_name: "Head of Product",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "head of business development",
            display_name: "Head of Business Development",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "healthcare",
            display_name: "Healthcare",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "investment manager",
            display_name: "Investment Manager",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "angel investor",
            display_name: "Angel Investor",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "journalist",
            display_name: "Journalist",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "judge",
            display_name: "Judge",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "lead developer",
            display_name: "Lead Developer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "team lead",
            display_name: "Team Lead",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "marketing",
            display_name: "Marketing",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "project manager",
            display_name: "Project Manager",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "product manager",
            display_name: "Product Manager",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "operations manager",
            display_name: "Operations Manager",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "account manager",
            display_name: "Account Manager",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "sales manager",
            display_name: "Sales Manager",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "non-profit",
            display_name: "Non-profit",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "product designer",
            display_name: "Product Designer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "project management",
            display_name: "Project Management",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "recruiter",
            display_name: "Recruiter",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "research & development",
            display_name: "Research & Development",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "user researcher",
            display_name: "User Researcher",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "public relations",
            display_name: "Public Relations",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "researcher",
            display_name: "Researcher",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "real estate",
            display_name: "Real Estate",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "test engineer",
            display_name: "Test Engineer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "UX researcher",
            display_name: "UX Researcher",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "Visual Designer",
            display_name: "Visual Designer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "venture capital",
            display_name: "Venture Capital",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "VP of engineering",
            display_name: "VP of Engineering",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "VP of product",
            display_name: "VP of Product",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "VP of marketing",
            display_name: "VP of Marketing",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "VP of business development",
            display_name: "VP of Business Development",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "copy writing",
            display_name: "Copy Writing",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "writer",
            display_name: "Writer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "web designer",
            display_name: "Web Designer",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          },
          {
            name: "web design",
            display_name: "Web Design",
            type: "role",
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW")
          }
        ]),
      {},
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkDelete("tags", {}, {})
      .then(() =>
        queryInterface.sequelize.query(
          `ALTER SEQUENCE "tags_id_seq" RESTART WITH ${1};`
        )
      );
  }
};
