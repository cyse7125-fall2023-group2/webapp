const db = require("../models/index");
const { v4: uuidv4 } = require("uuid");

const createNewCheck = async (req, res) => {
  try {
    if (!Object.keys(req.body).length) {
      throw new Error();
    }

    if (
      req.body.num_retries < 1 ||
      req.body.num_retries > 5 ||
      req.body.uptime_sla < 0 ||
      req.body.uptime_sla > 100 ||
      req.body.response_time_sla < 0 ||
      req.body.response_time_sla > 100 ||
      req.body.check_interval_in_seconds < 1 ||
      req.body.check_interval_in_seconds > 86400
    ) {
      throw new Error();
    }

    let data = await db["http-check"].create({
      id: uuidv4().toString(),
      ...req.body,
      check_created: new Date().toISOString(),
      check_updated: new Date().toISOString(),
    });
    return res.status(201).json(data.dataValues);
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

const getHttpCheck = async (req, res) => {
  let id = req.params.id;

  try {
    if (Object.keys(req.body).length) {
      throw new Error();
    }
    let result = await db["http-check"].findOne({ where: { id: id } });
    if (!result) {
      throw new Error();
    }
    return res.status(200).json(result);
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

const getAllHttpCheck = async (req, res) => {
  try {
    if (Object.keys(req.body).length) {
      throw new Error();
    }
    let result = await db["http-check"].findAll();

    return res.status(200).json(result);
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

const deleteHttpCheck = async (req, res) => {
  let id = req.params.id;

  try {
    if (Object.keys(req.body).length) {
      throw new Error();
    }

    await db["http-check"].destroy({
      where: {
        id: id,
      },
    });
    return res.status(204).send();
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

const updateHttpCheck = async (req, res) => {
  let id = req.params.id;

  try {
    await db["http-check"].update(
      {
        ...req.body,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return res.status(204).send();
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

module.exports = {
  createNewCheck,
  getHttpCheck,
  getAllHttpCheck,
  deleteHttpCheck,
  updateHttpCheck,
};
