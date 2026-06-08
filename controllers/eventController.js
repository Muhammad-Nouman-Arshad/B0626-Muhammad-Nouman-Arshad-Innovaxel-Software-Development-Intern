const Event = require("../models/Event");
const Registration = require("../models/Registration");

exports.createEvent = async (
  req,
  res
) => {
  try {
    const {
      name,
      totalSeats,
      eventDate
    } = req.body;

    if (totalSeats <= 0) {
      return res.status(400).json({
        message:
          "Total seats must be greater than 0"
      });
    }

    if (
      new Date(eventDate) <=
      new Date()
    ) {
      return res.status(400).json({
        message:
          "Event date must be in future"
      });
    }

    const exists =
      await Event.findOne({ name });

    if (exists) {
      return res.status(400).json({
        message:
          "Event name already exists"
      });
    }

    const event =
      await Event.create({
        name,
        totalSeats,
        availableSeats:
          totalSeats,
        eventDate
      });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getEvents = async (
  req,
  res
) => {
  try {
    let query = {};

    if (
      req.query.upcoming ===
      "true"
    ) {
      query.eventDate = {
        $gte: new Date()
      };
    }

    const events =
      await Event.find(query).sort({
        eventDate: 1
      });

    const result =
      await Promise.all(
        events.map(
          async (event) => {
            const totalRegistrations =
              await Registration.countDocuments(
                {
                  eventId:
                    event._id,
                  status:
                    "ACTIVE"
                }
              );

            return {
              ...event.toObject(),
              totalRegistrations
            };
          }
        )
      );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};