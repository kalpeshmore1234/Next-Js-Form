"use strict";

const { subDays } = require("date-fns"); // Import date utility

module.exports = {
  async create(ctx) {
    try {
      const { name, email, mobile } = ctx.request.body;

      // Validate that the mobile number starts with 6, 7, 8, or 9 and is 10 digits long
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(mobile)) {
        return ctx.badRequest("Invalid mobile number.");
      }

      // Calculate the date 7 days ago
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();

      // Check if the mobile number exists in the past 7 days
      const existingEntry = await strapi.entityService.findMany("api::contact.contact", {
        filters: {
          mobile: mobile,
          createdAt: { $gte: sevenDaysAgo }, // Check last 7 days
        },
      });

      if (existingEntry.length > 0) {
        return ctx.badRequest("This mobile number has already been used in the past week.");
      }

      // Create new contact entry if no duplicate is found
      const newContact = await strapi.entityService.create("api::contact.contact", {
        data: { name, email, mobile },
      });

      return ctx.send(newContact);
    } catch (error) {
      console.error("Error saving contact:", error);
      return ctx.internalServerError("Something went wrong.");
    }
  },
};
