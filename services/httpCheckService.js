const db = require("../models/index");
const { v4: uuidv4 } = require("uuid");

//Kubernetes
const k8s = require("@kubernetes/client-node");
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);
const batchV1Api = kc.makeApiClient(k8s.BatchV1Api);

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

    const webappcrs = {
      apiVersion: "crwebapp.my.domain/v1",
      kind: "WebappCR",
      metadata: {
        name: `webappcr-${data.id}`,
      },
      spec: {
        // Add your custom spec fields here
        backoffLimit: req.body.num_retries,
        uri: req.body.uri,
      },
    };

    k8sApi
      .createNamespacedCustomObject(
        "crwebapp.my.domain",
        "v1",
        "default",
        "webappcrs",
        webappcrs
      )
      .then(
        (response) => {
          console.log("WebappCRs created:", response.body);
          res.status(201).json(data.dataValues);
        },
        (err) => {
          console.error("Error creating WebappCRs:", err);
          res.status(400).send("Bad Request");
        }
      );
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
    const customResourceName = `webappcr-${id}`; // Replace with the name of your Custom Resource

    k8sApi
      .deleteNamespacedCustomObject(
        "crwebapp.my.domain",
        "v1",
        "default",
        "webappcrs",
        customResourceName,
        undefined,
        undefined,
        undefined,
        undefined
      )
      .then(
        (response) => {
          console.log("WebappCRs deleted:", response.body);
          res.status(204).send();
        },
        (err) => {
          console.error("Error deleting WebappCRs:", err);
          res.status(400).send("Bad Request");
        }
      );
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

const updateHttpCheck = async (req, res) => {
  let id = req.params.id;

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

    const customResourceName = `webappcr-${id}`; // Replace with the name of your Custom Resource
    const updatedData = {
      spec: {
        // Update your Custom Resource spec fields here
        backoffLimit: req.body.num_retries,
        uri: req.body.uri,
      },
    };

    k8sApi
      .patchNamespacedCustomObject(
        "crwebapp.my.domain",
        "v1",
        "default",
        "webappcrs",
        customResourceName,
        updatedData,
        undefined,
        undefined,
        undefined,
        {
          headers: { "Content-Type": "application/merge-patch+json" },
        }
      )
      .then(
        (response) => {
          console.log("WebappCRs updated:", response.body);
          res.status(204).send();
        },
        (err) => {
          console.error("Error updating WebappCRs:", err);
          res.status(400).send("Bad Request");
        }
      );
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
