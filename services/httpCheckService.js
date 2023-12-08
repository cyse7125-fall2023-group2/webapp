const db = require("../models/index");
const { v4: uuidv4 } = require("uuid");

//Kubernetes
const k8s = require("@kubernetes/client-node");
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);
const batchV1Api = kc.makeApiClient(k8s.BatchV1Api);
const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);

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

    let data = {
      id: uuidv4().toString(),
      ...req.body,
      check_created: new Date().toISOString(),
      check_updated: new Date().toISOString(),
    }

    const webappcrs = {
      apiVersion: "crwebapp.my.domain/v1",
      kind: "WebappCR",
      metadata: {
        name: `webappcr-${data.id}`,
        namespace: "webapp",
      },
      spec: {
        // Add your custom spec fields here
        numRetries: req.body.num_retries,
        uri: req.body.uri,
      },
      status: {
        lastExecutionTime: new Date().toISOString()
      },
    };

    await k8sApi
      .createNamespacedCustomObject(
        "crwebapp.my.domain",
        "v1",
        "webapp",
        "webappcrs",
        webappcrs
      )
    
    await db["http-check"].create(data);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
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

    let result = await db["http-check"].findOne({ where: { id: id } });

    if (!result) {
      throw new Error();
    }

    const customResourceName = `webappcr-${id}`; // Replace with the name of your Custom Resource

    await k8sApi
      .deleteNamespacedCustomObject(
        "crwebapp.my.domain",
        "v1",
        "webapp",
        "webappcrs",
        customResourceName,
        undefined,
        undefined,
        undefined,
        undefined
      )

      await db["http-check"].destroy({
        where: {
          id: id,
        },
      });
      res.status(204).send();
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
    const customResourceName = `webappcr-${id}`; // Replace with the name of your Custom Resource
    const updatedData = {
      spec: {
        // Update your Custom Resource spec fields here
        numRetries: req.body.num_retries,
        uri: req.body.uri,
      },
    };

    await k8sApi
      .patchNamespacedCustomObject(
        "crwebapp.my.domain",
        "v1",
        "webapp",
        "webapp",
        customResourceName,
        updatedData,
        undefined,
        undefined,
        undefined,
        {
          headers: { "Content-Type": "application/merge-patch+json" },
        }
      )

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
      res.status(204).send();
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
