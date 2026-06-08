const Event = require("../models/Event");
const Registration = require("../models/Registration");

exports.registerUser =
  async (req, res) => {
    try {
      const {
        userName,
        eventId
      } = req.body;

      const existing =
        await Registration.findOne({
          userName,
          eventId,
          status: "ACTIVE"
        });

      if (existing) {
        return res.status(400).json({
          message:
            "User already registered"
        });
      }

      const event =
        await Event.findOneAndUpdate(
          {
            _id: eventId,
            availableSeats: {
              $gt: 0
            }
          },
          {
            $inc: {
              availableSeats:
                -1
            }
          },
          {
            new: true
          }
        );

      if (!event) {
        return res.status(400).json({
          message:
            "Event is full"
        });
      }

      const registration =
        await Registration.create({
          userName,
          eventId
        });

      res.status(201).json(
        registration
      );
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

exports.cancelRegistration =
  async (req, res) => {
    try {
      const registration =
        await Registration.findById(
          req.params.id
        );

      if (
        !registration ||
        registration.status ===
          "CANCELLED"
      ) {
        return res.status(404).json({
          message:
            "Registration not found"
        });
      }

      registration.status =
        "CANCELLED";

      await registration.save();

      await Event.findByIdAndUpdate(
        registration.eventId,
        {
          $inc: {
            availableSeats: 1
          }
        }
      );

      res.json({
        message:
          "Registration cancelled"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };