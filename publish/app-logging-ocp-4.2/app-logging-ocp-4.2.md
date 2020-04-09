---
permalink: /guides/app-logging-ocp-4-2/
layout: guide-markdown
title: Application Logging on Red Hat OpenShift Container Platform (RHOCP) 4.3 with Elasticsearch, Fluentd, and Kibana
duration: 30 minutes
releasedate: 2020-04-09
description: Learn how to do application logging on RHOCP 4.2 or RHOCP 4.3 with Elasticsearch, Fluentd, and Kibana.
tags: ['logging', 'Elasticsearch', 'Fluentd', 'Kibana']
guide-category: manage
---

<!-- Note:
> This repository contains the guide documentation source. To view
> the guide in published form, view it on the [website](https://kabanero.io/guides/{projectid}.html).
-->

<!--
//
//	Copyright 2019, 2020 IBM Corporation and others.
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//	http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//
-->

**The following guide has been tested with Red Hat OpenShift Container Platform (RHOCP) 4.2/Kabanero 0.3.0 and RHOCP 4.3/Kabanero 0.6.0.**

Pod processes running in Kubernetes frequently produce logs. To effectively manage this log data and ensure no loss of log data occurs when a pod terminates, a log aggregation tool should be deployed on the Kubernetes cluster. Log aggregation tools help users persist, search, and visualize the log data that is gathered from the pods across the cluster. Log aggregation tools in the market today include:  EFK, LogDNA, Splunk, Datadog, IBM Operations Analytics, etc.  When considering log aggregation tools, enterprises will make choices that are inclusive of their journey to cloud, both new cloud native applications running in Kubernetes and their existing traditional IT choices.

One choice for application logging with log aggregation, based on open source, is **EFK (Elasticsearch, Fluentd, and Kibana)**. This guide describes the process of deploying EFK using the Elasticsearch Operator and the Cluster Logging Operator. Use this preconfigured EFK stack to aggregate all container logs. After a successful installation, the EFK pods should reside inside the *openshift-logging* namespace of the cluster.

<!--
// =================================================================================================
// Install cluster logging
// =================================================================================================
-->

## Install cluster logging

To install the cluster logging component, follow the OpenShift guide [Deploying cluster logging](https://docs.openshift.com/container-platform/4.3/logging/cluster-logging-deploying.html)

After the installation completes without any error, you can see the following pods that are running in the *openshift-logging* namespace. The exact number of pods running for each of the EFK components can vary depending on the configuration specified in the ClusterLogging Custom Resource (CR).

```shell
[root@rhel7-ocp ~]# oc get pods -n openshift-logging

NAME                                            READY   STATUS      RESTARTS   AGE
cluster-logging-operator-874597bcb-qlmlf        1/1     Running     0          150m
curator-1578684600-2lgqp                        0/1     Completed   0          4m46s
elasticsearch-cdm-4qrvthgd-1-5444897599-7rqx8   2/2     Running     0          9m6s
elasticsearch-cdm-4qrvthgd-2-865c6b6d85-69b4r   2/2     Running     0          8m3s
fluentd-rmdbn                                   1/1     Running     0          9m5s
fluentd-vtk48                                   1/1     Running     0          9m5s
kibana-756fcdb7f-rw8k8                          2/2     Running     0          9m6s
```

The cluster logging also exposes a route for external access to the Kibana console.

```shell
[root@rhel7-okd ~]# oc get routes -n openshift-logging

NAME     HOST/PORT                                               PATH   SERVICES   PORT    TERMINATION          WILDCARD
kibana   kibana-openshift-logging.apps.host.kabanero.com                kibana     <all>   reencrypt/Redirect   None
```

<!--
// =================================================================================================
// Configure Fluentd to merge JSON log message body
// =================================================================================================
-->

## Configure Fluentd to merge JSON log message body

If there are application pods outputting logs in JSON format, then it is recommended to set Fluentd to parse the JSON fields from the message body and merge the parsed objects with the JSON payload document posted to Elasticsearch.

This feature is disabled by default. To enable this feature, first set the cluster logging instance's **managementState** field from **"Managed"** to **"Unmanaged"**. Setting the cluster logging instance to unmanaged state gives the administrator full control of the components managed by the Cluster Logging Operator, and is the prerequisite for many cluster logging configurations.

```shell
[root@rhel7-ocp ~]# oc edit ClusterLogging instance

apiVersion: "logging.openshift.io/v1"
kind: "ClusterLogging"
metadata:
  name: "instance"

....

spec:
  managementState: "Unmanaged"
```

Then, set the environment variable **MERGE_JSON_LOG** to **true** with the following command:

```shell
[root@rhel7-ocp ~]# oc set env ds/fluentd MERGE_JSON_LOG=true
```

<!--
// =================================================================================================
// View application logs in Kibana
// =================================================================================================
-->

## View application logs in Kibana

In cases where the application server provides the option, output application logs in JSON format. This will let you fully take advantage of Kibana's dashboard functions. Kibana is then able to process the data from each individual field of the JSON object to create customized visualizations for that field.

See the Kibana dashboard page by using the routes URL <https://kibana-openshift-logging.apps.host.kabanero.com>. Log in using your Kubernetes user and password, then the browser should redirect you to Kibana's **Discover** page where the newest logs of the selected index are being streamed. Select the **project.\*** index to view the application logs generated by the deployed application.

![Kibana page with the application log entries](/img/guide/app-logging-ocp-app.png)

The **project.\*** index contains only a set of default fields at the start, which does not include all of the fields from the deployed application's JSON log object. Therefore, the index needs to be refreshed to have all the fields from the application's log object available to Kibana.

To refresh the index, click the **Management** option from the Kibana menu.

Click **Index Pattern**, and find the **project.pass:[*]**  index in Index Pattern. Then, click the refresh fields button. After Kibana is updated with all the available fields in the **project.pass:[*]** index, import any preconfigured dashboards to view the application's logs.

![Index refresh button on Kibana](/img/guide/app-logging-ocp-refresh-index.png)

To import the dashboard and its associated objects, navigate back to the **Management** page and click **Saved Objects**. Click **Import** and select the dashboard file. When prompted, click the **Yes, overwrite all** option

Head back to the **Dashboard** page and enjoy navigating logs on the newly imported dashboard.

![Kibana dashboard for Open Liberty application logs](/img/guide/app-logging-ocp-open-liberty-dashboard.png)

<!--
// =================================================================================================
// Configuring and uninstalling cluster logging
// =================================================================================================
-->

## Configuring and uninstalling cluster logging

If changes need to be made for the installed EFK stack, edit the ClusterLogging Custom Resource (CR) of the deployed cluster logging instance. Make sure to set the managementState to **"Unmanaged"** first before making any changes to the existing configuration. If the EFK stack is no longer needed, remove the cluster logging instance from Cluster Logging Operator Details page.
