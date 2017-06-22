'use strict';

const ParamCase = require('param-case');
const EventEmitter = require('events');
const DockerClient = require('docker-compose-client');
const Dockerode = require('dockerode');
const Hoek = require('hoek');
const Penseur = require('penseur');
const VAsync = require('vasync');
const Transform = require('./transform');


const internals = {
  defaults: {
    name: 'portal',
    db: {
      test: false
    },
    dockerComposeHost: 'tcp://0.0.0.0:4242'
  },
  tables: {
    'portals': { id: { type: 'uuid' }, primary: 'id', secondary: false, purge: false },
    'datacenters': { id: { type: 'uuid' }, primary: 'id', secondary: false, purge: false },
    'deployment_groups': { id: { type: 'uuid' }, primary: 'id', secondary: false, purge: false },
    'versions': { id: { type: 'uuid' }, primary: 'id', secondary: false, purge: false },
    'manifests': { id: { type: 'uuid' }, primary: 'id', secondary: false, purge: false },
    'services': { id: { type: 'uuid' }, primary: 'id', secondary: false, purge: false },
    'packages': { id: { type: 'uuid' }, primary: 'id', secondary: false, purge: false },
    'instances': { id: { type: 'uuid' }, primary: 'id', secondary: false, purge: false },
    'users': { id: { type: 'uuid' }, primary: 'id', secondary: false, purge: false }
  }
};

const resolveCb = (resolve, reject) => {
  return (err, ...args) => {
    if (err) {
      return reject(err);
    }

    resolve(...args);
  };
};

module.exports = class Data extends EventEmitter {
  constructor (options) {
    super();

    const settings = Hoek.applyToDefaults(internals.defaults, options || {});

    // Penseur will assert that the options are correct
    this._db = new Penseur.Db(settings.name, settings.db);
    this._dockerCompose = new DockerClient(settings.dockerComposeHost);
    this._docker = new Dockerode(settings.docker);

    this._dockerCompose.on('error', (err) => {
      this.emit('error', err);
    });
  }

  connect (cb) {
    this._db.establish(internals.tables, cb);
  }

  reconnectCompose (dockerComposeHost) {
    this._dockerCompose.close();
    this._dockerCompose = new DockerClient(dockerComposeHost);

    this._dockerCompose.on('error', (err) => {
      this.emit('error', err);
    });
  }


  // portals

  createPortal (clientPortal, cb) {
    const portal = Transform.toPortal(clientPortal);
    this._db.portals.insert(portal, (err, key) => {
      if (err) {
        return cb(err);
      }

      portal.id = key;
      cb(null, Transform.fromPortal({ portal }));
    });
  }

  getPortal (options, cb) {
    this._db.portals.all((err, portals) => {
      if (err) {
        return cb(err);
      }

      if (!portals) {
        return cb();
      }

      const portal = portals.shift();

      // Sub query/filter for deploymentGroups
      const deploymentGroups = (args) => {
        return new Promise((resolve, reject) => {
          this.getDeploymentGroups(args, resolveCb(resolve, reject));
        });
      };

      // Sub query/filter for user
      const user = () => {
        return new Promise((resolve, reject) => {
          this.getUser({}, resolveCb(resolve, reject));
        });
      };

      // Sub query/filter for datacenter
      const datacenter = () => {
        return new Promise((resolve, reject) => {
          this.getDatacenter({ id: portal.datacenter_id }, resolveCb(resolve, reject));
        });
      };

      cb(null, Transform.fromPortal({
        portal,
        deploymentGroups,
        datacenter,
        user
      }));
    });
  }


  // datacenters

  createDatacenter (datacenter, cb) {
    this._db.datacenters.insert(datacenter, (err, key) => {
      if (err) {
        return cb(err);
      }

      datacenter.id = key;
      cb(null, datacenter);
    });
  }

  getDatacenters (cb) {
    this._db.datacenters.all(cb);
  }

  getDatacenter ({ id, region }, cb) {
    Hoek.assert(id || region, 'id or region are required to retrieve a datacenter');

    if (region) {
      return this._db.datacenters.query({ region }, (err, datacenters) => {
        if (err) {
          return cb(err);
        }

        return cb(null, datacenters && datacenters.length ? datacenters[0] : null);
      });
    }

    this._db.datacenters.get(id, cb);
  }


  // users

  createUser (clientUser, cb) {
    const user = Transform.toUser(clientUser);
    this._db.users.insert(user, (err, key) => {
      if (err) {
        return cb(err);
      }

      user.id = key;
      cb(null, Transform.fromUser(user));
    });
  }

  getUser (options, cb) {
    this._db.users.all((err, users) => {
      if (err) {
        return cb(err);
      }

      if (!users || !users.length) {
        return cb();
      }

      cb(null, Transform.fromUser(users[0]));
    });
  }


  // deployment_groups

  createDeploymentGroup (clientDeploymentGroup, cb) {
    const deploymentGroup = Transform.toDeploymentGroup(clientDeploymentGroup);
    this._db.deployment_groups.query({
      slug: deploymentGroup.slug
    }, (err, deploymentGroups) => {
      if (err) {
        return cb(err);
      }

      if (deploymentGroups && deploymentGroups.length) {
        return cb(new Error(`DeploymentGroup "${deploymentGroup.slug}" already exists (${deploymentGroups[0].id})`));
      }

      this._db.deployment_groups.insert(deploymentGroup, (err, key) => {
        if (err) {
          return cb(err);
        }

        deploymentGroup.id = key;
        cb(null, Transform.fromDeploymentGroup(deploymentGroup));
      });
    });
  }

  updateDeploymentGroup ({ id, name }, cb) {
    this._db.deployment_groups.update([{ id, name }], (err) => {
      if (err) {
        return cb(err);
      }

      cb(null, Transform.fromDeploymentGroup({ id, name }));
    });
  }

  getDeploymentGroups ({ ids, name, slug }, cb) {
    const finish = (err, deploymentGroups) => {
      if (err) {
        return cb(err);
      }

      const getServices = (deploymentGroupId) => {
        return (args) => {
          args = args || {};
          args.deploymentGroupId = deploymentGroupId;

          return new Promise((resolve, reject) => {
            this.getServices(args, resolveCb(resolve, reject));
          });
        };
      };

      // todo getVersion
      // todo getHistory

      const convertedGroups = deploymentGroups ? deploymentGroups.map((deploymentGroup) => {
        return Transform.fromDeploymentGroup(deploymentGroup, getServices(deploymentGroup.id));
      }) : [];

      cb(null, convertedGroups);
    };

    if (ids) {
      return this._db.deployment_groups.get(ids, finish);
    }

    if (name) {
      return this._db.deployment_groups.query({ name }, finish);
    }

    if (slug) {
      return this._db.deployment_groups.query({ slug }, finish);
    }

    return this._db.deployment_groups.all(finish);
  }

  getDeploymentGroup (query, cb) {
    query = query || {};

    this._db.deployment_groups.query(query, (err, deploymentGroups) => {
      if (err) {
        return cb(err);
      }

      if (!deploymentGroups || !deploymentGroups.length) {
        return cb(null, {});
      }

      const deploymentGroup = deploymentGroups[0];

      const getServices = (args) => {
        console.log(args);
        args = args || {};
        args.deploymentGroupId = deploymentGroup.id;
        console.log(args);

        return new Promise((resolve, reject) => {
          this.getServices(args, resolveCb(resolve, reject));
        });
      };

      // todo getVersion
      // todo getHistory

      cb(err, Transform.fromDeploymentGroup(deploymentGroup, getServices));
    });
  }


  // versions

  createVersion (clientVersion, cb) {
    Hoek.assert(clientVersion, 'version is required');
    Hoek.assert(clientVersion.manifestId, 'manifestId is required');
    Hoek.assert(clientVersion.deploymentGroupId, 'deploymentGroupId is required');

    console.log(`-> creating new Version for DeploymentGroup ${clientVersion.deploymentGroupId}`);

    const version = Transform.toVersion(clientVersion);
    this._db.versions.insert(version, (err, key) => {
      if (err) {
        return cb(err);
      }

      console.log(`-> new Version for DeploymentGroup ${clientVersion.deploymentGroupId} created: ${key}`);

      const changes = {
        id: clientVersion.deploymentGroupId,
        version_id: key,
        history_version_ids: this._db.append(key)
      };

      if (clientVersion.serviceIds) {
        changes['service_ids'] = clientVersion.serviceIds;
      }

      console.log(`-> updating DeploymentGroup ${clientVersion.deploymentGroupId} to add Version ${key}`);

      this._db.deployment_groups.update([changes], (err) => {
        if (err) {
          return cb(err);
        }

        version.id = key;
        cb(null, Transform.fromVersion(version));
      });
    });
  }

  updateVersion (clientVersion, cb) {
    this._db.versions.update([Transform.toVersion(clientVersion)], (err, versions) => {
      if (err) {
        return cb(err);
      }

      cb(null, versions && versions.length ? Transform.fromVersion(versions[0]) : {});
    });
  }

  getVersion ({ id, manifestId }, cb) {
    const query = id ? { id } : { manifest_id: manifestId };
    this._db.versions.single(query, (err, version) => {
      if (err) {
        return cb(err);
      }

      cb(null, Transform.fromVersion(version));
    });
  }

  getVersions ({ manifestId, deploymentGroupId }, cb) {
    const finish = (err, versions) => {
      if (err) {
        return cb(err);
      }

      versions = versions || [];
      cb(null, versions.map(Transform.fromVersion));
    };

    // ensure the data is in sync
    this._db.versions.sync(() => {
      if (manifestId) {
        return this._db.versions.query({ manifest_id: manifestId }, finish);
      }

      this.getDeploymentGroup({ id: deploymentGroupId }, (err, deploymentGroup) => {
        if (err) {
          return finish(err);
        }

        this._db.versions.get(deploymentGroup.history, finish);
      });
    });
  }

  scale ({ id, replicas }, cb) {
    Hoek.assert(id, 'service id is required');
    Hoek.assert(typeof replicas === 'number' && replicas >= 0, 'replicas must be a number no less than 0');

    // get the service then get the deployment group
    // use the deployment group to find the current version and manifest
    // scale the service
    // maybe update the machine ids and instances

    console.log('-> scale request received');

    console.log(`-> fetching Service ${id}`);

    this._db.services.single({ id }, (err, service) => {
      if (err) {
        return cb(err);
      }

      if (!service) {
        return cb(new Error(`service not found for id: ${id}`));
      }

      console.log(`-> fetching DeploymentGroup ${service.deployment_group_id}`);

      this._db.deployment_groups.single({ id: service.deployment_group_id }, (err, deployment_group) => {
        if (err) {
          return cb(err);
        }

        if (!deployment_group) {
          return cb(new Error(`deployment group not found for service with service id: ${id}`));
        }

        console.log(`-> fetching Version ${deployment_group.version_id}`);

        this._db.versions.single({ id: deployment_group.version_id }, (err, version) => {
          if (err) {
            return cb(err);
          }

          if (!version) {
            return cb(new Error(`version not found for service with service id: ${id}`));
          }

          console.log(`-> fetching Manifest ${version.manifest_id}`);

          this._db.manifests.single({ id: version.manifest_id }, (err, manifest) => {
            if (err) {
              return cb(err);
            }

            if (!manifest) {
              return cb(new Error(`manifest not found for service with service id: ${id}`));
            }

            this._scale({ service, deployment_group, version, manifest, replicas }, cb);
          });
        });
      });
    });
  }

  _scale ({ service, deployment_group, version, manifest, replicas }, cb) {
    let isFinished = false;

    const finish = () => {
      if (isFinished) {
        return;
      }

      isFinished = true;

      console.log(`-> docker-compose scaled "${service.name}" from DeploymentGroup ${deployment_group.id} to ${replicas} replicas`);

      if (!version.service_scales || !version.service_scales.length) {
        console.log(`-> no scale data found for service "${service.name}" from DeploymentGroup ${deployment_group.id} in current Version (${version.id})`);

        version.service_scales = [{
          service_name: service.name
        }];
      }

      const clientVersion = {
        deploymentGroupId: deployment_group.id,
        manifestId: manifest.id,
        plan: version.plan,
        scale: version.service_scales.map((scale) => {
          if (scale.service_name !== service.name) {
            return scale;
          }

          return {
            serviceName: service.name,
            replicas
          };
        })
      };

      console.log(`-> creating new Version for DeploymentGroup ${deployment_group.id}`);

      // createVersion updates the deployment group
      this.createVersion(clientVersion, (...args) => {
        isFinished = true;
        cb(...args);
      });
    };

    console.log(`-> requesting docker-compose to scale "${service.name}" from DeploymentGroup ${deployment_group.id} to ${replicas} replicas`);

    this._dockerCompose.scale({
      projectName: deployment_group.name,
      services: {
        [service.name]: replicas
      },
      manifest: manifest.raw
    }, (err, res) => {
      if (err) {
        return cb(err);
      }

      finish();
    });
  }


  // manifests

  provisionManifest (clientManifest, cb) {
    // 1. check that the deploymentgroup exists
    // 2. create a new manifest
    // 3. create a new version
    // 4. return said version
    // 5. request docker-compose-api to provision manifest
    // 6. create/update/prune services by calling provisionServices with the respose from docker-compose-api
    // 7. update version with the provision plan and new service ids

    // todo we are not doing anything with the action plans right now
    // but if we were, we would do that in portal-watch. with that said, we might
    // run into a race condition where the event happens before we update the
    // new version with the plan

    console.log('-> provision request received');

    const provision = ({ deploymentGroup, manifestId, newVersion }) => {
      let isHandled = false;

      console.log(`-> requesting docker-compose provision for DeploymentGroup ${deploymentGroup.name}`);

      this._dockerCompose.provision({
        projectName: deploymentGroup.name,
        manifest: clientManifest.raw
      }, (err, provisionRes) => {
        if (err) {
          this.emit('error', err);
          return;
        }

        // callback can execute multiple times, ensure responses are only handled once
        if (isHandled) {
          return;
        }

        isHandled = true;

        console.log('-> update/create/remove services based on response from docker-compose');

        // create/update services based on hashes
        // return the new set of service ids
        this.provisionServices({
          deploymentGroup,
          manifestId,
          provisionRes
        }, (err, newServiceIds) => {
          if (err) {
            this.emit('error', err);
            return;
          }

          console.log(`-> update Version ${newVersion.id} based on docker-compose response and new service ids`);

          const actions = Object.keys(provisionRes).map((serviceName) => {
            return ({
              type: provisionRes[serviceName].plan.action,
              service: serviceName,
              machines: provisionRes[serviceName].plan.containers.map(({ id }) => { return id; })
            });
          });

          // create new version
          this.updateVersion({
            id: newVersion.id,
            manifestId,
            newServiceIds,
            plan: {
              running: true,
              actions: actions
            }
          }, (err) => {
            if (err) {
              this.emit('error', err);
              return;
            }

            console.log(`-> updated Version ${newVersion.id}`);
            console.log('-> provisionManifest DONE');
          });
        });
      });
    };

    const createVersion = ({ deploymentGroup, currentVersion, manifestId }) => {
      // create new version
      this.createVersion({
        manifestId,
        deploymentGroupId: deploymentGroup.id,
        scale: currentVersion.scale,
        plan: {
          running: true,
          actions: []
        }
      }, (err, newVersion) => {
        if (err) {
          return cb(err);
        }

        console.log(`-> new Version created with id ${newVersion.id}`);
        console.log('newVersion', newVersion);

        setImmediate(() => {
          provision({ deploymentGroup, manifestId, newVersion });
        });

        cb(null, newVersion);
      });
    };

    this.getDeploymentGroup({
      id: clientManifest.deploymentGroupId
    }, (err, deploymentGroup) => {
      if (err) {
        return cb(err);
      }

      if (!deploymentGroup) {
        return cb(new Error('Deployment group not found for manifest'));
      }

      console.log(`-> new DeploymentGroup created with id ${deploymentGroup.id}`);

      const newManifest = Transform.toManifest(clientManifest);
      this._db.manifests.insert(newManifest, (err, manifestId) => {
        if (err) {
          return cb(err);
        }

        console.log(`-> new Manifest created with id ${manifestId}`);

        if (!deploymentGroup.version) {
          console.log(`-> detected first provision for DeploymentGroup ${deploymentGroup.id}`);
          return createVersion({
            deploymentGroup,
            manifestId,
            currentVersion: {}
          });
        }

        // get current version for because we need current scale
        this.getVersion({
          id: deploymentGroup.version
        }, (err, currentVersion) => {
          if (err) {
            return cb(err);
          }

          console.log(`-> creating new Version based on old version ${currentVersion.id}`);

          return createVersion({
            deploymentGroup,
            manifestId,
            currentVersion
          });
        });
      });
    });
  }

  getManifest ({ id }, cb) {
    this._db.manifests.single({ id }, (err, manifest) => {
      if (err) {
        return cb(err);
      }

      cb(null, Transform.fromManifest(manifest || {}));
    });
  }

  getManifests ({ type, deploymentGroupId }, cb) {
    const query = type ? { type } : { deployment_group_id: deploymentGroupId };
    this._db.manifests.query(query, (err, manifests) => {
      if (err) {
        return cb(err);
      }

      manifests = manifests || [];
      cb(null, manifests.map(Transform.fromManifest));
    });
  }


  // services

  provisionServices ({ deploymentGroup, manifestId, provisionRes }, cb) {
    // 1. get current set of services
    // 2. compare names and hashes
    // 3. if name doesn't exist anymore, disable service
    // 4. if hash is new, update service
    // 5. compare previous services with new ones
    // 6. deactivate pruned ones

    console.log('-> provision services in our data layer');

    const createService = ({ provision, serviceName }, cb) => {
      console.log(`-> creating Service "${serviceName}" from DeploymentGroup ${deploymentGroup.id}`);

      this.createService({
        hash: provision.hash,
        deploymentGroupId: deploymentGroup.id,
        name: serviceName,
        slug: ParamCase(serviceName)
      }, (err, service) => {
        if (err) {
          return cb(err);
        }

        cb(null, service.id);
      });
    };

    const updateService = ({ provision, service }, cb) => {
      console.log(`-> updating Service "${service.name}" from DeploymentGroup ${deploymentGroup.id}`);

      this.updateService({
        id: service.id,
        hash: provision.hash
      }, (err) => {
        if (err) {
          return cb(err);
        }

        cb(null, service.id);
      });
    };

    const resolveService = (serviceName, next) => {
      console.log(`-> fetching Service "${serviceName}" from DeploymentGroup ${deploymentGroup.id}`);

      const provision = provisionRes[serviceName];

      this.getServices({
        name: serviceName,
        deploymentGroupId: deploymentGroup.id
      }, (err, services) => {
        if (err) {
          return cb(err);
        }

        // no services for given name
        if (!services || !services.length) {
          return createService({ provision, serviceName }, next);
        }

        const service = services.shift();

        VAsync.forEachPipeline({
          inputs: services,
          // disable old services
          func: ({ id }, next) => {
            console.log(`-> deactivating Service ${id} from DeploymentGroup ${deploymentGroup.id}`);
            this.updateService({ active: false, id }, next);
          }
        }, (err) => {
          if (err) {
            return cb(err);
          }

          // service changed
          if (service.hash !== provision.hash) {
            return updateService({ provision, service }, next);
          }

          console.log(`-> no changes for Service "${serviceName}" from DeploymentGroup ${deploymentGroup.id}`);
          return next(null, service.id);
        });
      });
    };

    const pruneService = ({ id, instances }, next) => {
      // if it has instances, just mark as inactive
      console.log(`-> pruning Service ${id} from DeploymentGroup ${deploymentGroup.id}`);

      const update = () => { return this.updateService({ active: false, id }, next); };
      const remove = () => { return this.deleteServices({ ids: [id] }, next); };

      return (instances && instances.length) ?
        update() :
        remove();
    };

    // deactivate pruned servcies
    const pruneServices = (err, result) => {
      if (err) {
        return cb(err);
      }

      console.log(`-> pruning Services from DeploymentGroup ${deploymentGroup.id}`);

      const new_service_ids = result.successes;

      this.getServices({
        deploymentGroupId: deploymentGroup.id
      }, (err, oldServices) => {
        if (err) {
          return cb(err);
        }

        const servicesToPrune = oldServices
          .filter(({ id }) => { return new_service_ids.indexOf(id) < 0; });

        VAsync.forEachPipeline({
          inputs: servicesToPrune,
          func: pruneService
        }, (err) => { return cb(err, new_service_ids); });
      });
    };

    VAsync.forEachPipeline({
      inputs: Object.keys(provisionRes),
      func: resolveService
    }, pruneServices);
  }

  createService (clientService, cb) {
    const newService = Object.assign(Transform.toService(clientService), {
      active: true
    });

    this._db.services.insert(newService, (err, key) => {
      if (err) {
        return cb(err);
      }

      clientService.id = key;
      cb(null, clientService);
    });
  }

  updateService (clientService, cb) {
    this._db.services.update([Transform.toService(clientService)], (err, services) => {
      if (err) {
        return cb(err);
      }

      cb(null, services && services.length ? Transform.fromService(services[0]) : {});
    });
  }

  getService ({ id, hash }, cb) {
    const query = id ? { id } : { version_hash: hash };
    this._db.services.query(query, (err, service) => {
      if (err) {
        return cb(err);
      }

      if (!service) {
        return cb(null, null);
      }

      this._db.packages.single({ id: service.package_id }, (err, packages) => {
        if (err) {
          return cb(err);
        }

        cb(null, Transform.fromService({ service, instances: this._instancesFilter(service.instance_ids), packages }));
      });
    });
  }

  _getDeploymentGroupServices (deploymentGroupSlug, cb) {
    this.getDeploymentGroup({ slug: deploymentGroupSlug }, (err, deploymentGroup) => {
      if (err) {
        return cb(err);
      }

      if (!deploymentGroup) {
        return cb(null, {});
      }

      return this.getServices({ deploymentGroupId: deploymentGroup.id }, cb);
    });
  }

  getServices (options, cb) {
    if (options.deploymentGroupSlug) {
      return this._getDeploymentGroupServices(options.deploymentGroupSlug, cb);
    }

    const query = {};
    if (options.ids && options.ids.length) {
      query.id = this._db.or(options.ids);
    }

    if (options.name) {
      query.name = options.name;
    }

    if (options.slug) {
      query.slug = options.slug;
    }

    if (options.parentId) {
      query.parent_id = options.parentId;
    }

    if (options.deploymentGroupId) {
      query.deployment_group_id = options.deploymentGroupId;
    }

    this._db.services.query(query, (err, services) => {
      if (err) {
        return cb(err);
      }

      if (!services || !services.length) {
        return cb();
      }

      return cb(null, services.map((service) => {
        return Transform.fromService({ service, instances: this._instancesFilter(service.instance_ids) });
      }));
    });
  }

  _instancesFilter (instanceIds) {
    return (query) => {
      query = query || {};

      return new Promise((resolve, reject) => {
        query.ids = instanceIds;

        this.getInstances(query, resolveCb(resolve, reject));
      });
    };
  }

  stopServices ({ ids }, cb) {
    this._db.services.get(ids, (err, services) => {
      if (err) {
        return cb(err);
      }

      if (!services || !services.length) {
        return cb();
      }

      const instanceIds = services.reduce((instanceIds, service) => {
        return instanceIds.concat(service.instance_ids);
      }, []);

      VAsync.forEachParallel({
        func: (instanceId, next) => {
          this._db.instances.get(instanceId, (err, instance) => {
            if (err) {
              return next(err);
            }

            const container = this._docker.getContainer(instance.machine_id);
            container.stop(next);
          });
        },
        inputs: instanceIds
      }, (err, results) => {
        if (err) {
          return cb(err);
        }

        this.getServices({ ids }, cb);
      });
    });
  }

  startServices ({ ids }, cb) {
    this._db.services.get(ids, (err, services) => {
      if (err) {
        return cb(err);
      }

      if (!services || !services.length) {
        return cb();
      }

      const instanceIds = services.reduce((instanceIds, service) => {
        return instanceIds.concat(service.instance_ids);
      }, []);

      VAsync.forEachParallel({
        func: (instanceId, next) => {
          this._db.instances.get(instanceId, (err, instance) => {
            if (err) {
              return next(err);
            }

            const container = this._docker.getContainer(instance.machine_id);
            container.start(next);
          });
        },
        inputs: instanceIds
      }, (err, results) => {
        if (err) {
          return cb(err);
        }

        this.getServices({ ids }, cb);
      });
    });
  }

  restartServices ({ ids }, cb) {
    this._db.services.get(ids, (err, services) => {
      if (err) {
        return cb(err);
      }

      if (!services || !services.length) {
        return cb();
      }

      const instanceIds = services.reduce((instanceIds, service) => {
        return instanceIds.concat(service.instance_ids);
      }, []);

      VAsync.forEachParallel({
        func: (instanceId, next) => {
          this._db.instances.get(instanceId, (err, instance) => {
            if (err) {
              return next(err);
            }

            const container = this._docker.getContainer(instance.machine_id);
            container.restart(next);
          });
        },
        inputs: instanceIds
      }, (err, results) => {
        if (err) {
          return cb(err);
        }

        this.getServices({ ids }, cb);
      });
    });
  }

  deleteServices ({ ids }, cb) {
    // todo could this be done with scale = 0?

    this._db.services.get(ids, (err, services) => {
      if (err) {
        return cb(err);
      }

      if (!services || !services.length) {
        return cb();
      }

      const instanceIds = services.reduce((instanceIds, service) => {
        return instanceIds.concat(service.instance_ids);
      }, []);

      VAsync.forEachParallel({
        func: (instanceId, next) => {
          this._db.instances.get(instanceId, (err, instance) => {
            if (err) {
              return next(err);
            }

            const container = this._docker.getContainer(instance.machine_id);
            // Use force in case the container is running. TODO: should we keep force?
            container.remove({ force: true }, next);
          });
        },
        inputs: instanceIds
      }, (err, results) => {
        if (err) {
          return cb(err);
        }

        VAsync.forEachParallel({
          inputs: ids,
          func: (serviceId, next) => {
            this.updateService({
              id: serviceId,
              active: false
            });
          }
        }, (err) => {
          if (err) {
            return cb(err);
          }

          this.getServices({ ids }, cb);
        });
      });
    });
  }


  // instances

  createInstance (clientInstance, cb) {
    this._db.instances.insert(Transform.toInstance(clientInstance), (err, key) => {
      if (err) {
        return cb(err);
      }

      clientInstance.id = key;
      cb(null, clientInstance);
    });
  }

  getInstance ({ id }, cb) {
    this._db.instances.single({ id }, (err, instance) => {
      if (err) {
        return cb(err);
      }

      cb(null, instance ? Transform.fromInstance(instance) : {});
    });
  }

  getInstances ({ ids, name, machineId, status }, cb) {
    const query = {};

    if (ids) {
      query.id = this._db.or(ids);
    }

    if (name) {
      query.name = name;
    }

    if (machineId) {
      query.machine_id = machineId;
    }

    if (status) {
      query.status = status;
    }

    this._db.instances.query(query, (err, instances) => {
      if (err) {
        return cb(err);
      }

      if (!instances || !instances.length) {
        return cb(null, []);
      }

      cb(null, instances.map(Transform.fromInstance));
    });
  }

  updateInstance ({ id, status }, cb) {
    this._db.instances.update([{ id, status }], (err, instances) => {
      if (err) {
        return cb(err);
      }

      cb(null, instances && instances.length ? Transform.fromInstance(instances[0]) : {});
    });
  }

  stopInstances ({ ids }, cb) {
    this._db.instances.get(ids, (err, instances) => {
      if (err) {
        return cb(err);
      }

      if (!instances || !instances.length) {
        return cb();
      }

      VAsync.forEachParallel({
        func: (instance, next) => {
          const container = this._docker.getContainer(instance.machine_id);
          container.stop(next);
        },
        inputs: instances
      }, (err, results) => {
        if (err) {
          return cb(err);
        }

        this.getInstances({ ids }, cb);
      });
    });
  }

  startInstances ({ ids }, cb) {
    this._db.instances.get(ids, (err, instances) => {
      if (err) {
        return cb(err);
      }

      if (!instances || !instances.length) {
        return cb();
      }

      VAsync.forEachParallel({
        func: (instance, next) => {
          const container = this._docker.getContainer(instance.machine_id);
          container.start(next);
        },
        inputs: instances
      }, (err, results) => {
        if (err) {
          return cb(err);
        }

        this.getInstances({ ids }, cb);
      });
    });
  }

  restartInstances ({ ids }, cb) {
    this._db.instances.get(ids, (err, instances) => {
      if (err) {
        return cb(err);
      }

      if (!instances || !instances.length) {
        return cb();
      }

      VAsync.forEachParallel({
        func: (instance, next) => {
          this.updateInstance({ id: instance.id, status: 'RESTARTING' }, () => {
            const container = this._docker.getContainer(instance.machine_id);
            container.restart(next);
          });
        },
        inputs: instances
      }, (err, results) => {
        if (err) {
          return cb(err);
        }

        this.getInstances({ ids }, cb);
      });
    });
  }


  // packages

  createPackage (clientPackage, cb) {
    this._db.packages.insert(Transform.toPackage(clientPackage), (err, key) => {
      if (err) {
        return cb(err);
      }

      clientPackage.id = key;
      cb(null, clientPackage);
    });
  }

  getPackage ({ id }, cb) {
    this._db.packages.single({ id }, (err, dbPackage) => {
      if (err) {
        return cb(err);
      }

      cb(null, dbPackage ? Transform.fromPackage(dbPackage) : {});
    });
  }

  getPackages ({ name, type }, cb) {
    const query = name ? { name } : { type };
    this._db.packages.query(query, (err, dbPackages) => {
      if (err) {
        return cb(err);
      }

      cb(null, dbPackages ? dbPackages.map(Transform.fromPackage) : []);
    });
  }
};
