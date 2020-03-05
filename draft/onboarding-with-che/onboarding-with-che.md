---
permalink: /guides/eclipse-che-kabanero-ocp/
layout: guide-markdown
title: Getting started with Eclipse Che on OCP in Kabanero
duration: 40 minutes
releasedate: 2019-11-26
description: Learn how to configure Eclipse Che on OCP and use Codewind for Eclipse Che to build containerized microservices applications
tags: ['Collection', 'Codewind', 'MicroProfile']
guide-category: collections
---

<!---
>	Copyright 2019 IBM Corporation and others.
>
>	Licensed under the Apache License, Version 2.0 (the "License");
>	you may not use this file except in compliance with the License.
>	You may obtain a copy of the License at
>
>	http://www.apache.org/licenses/LICENSE-2.0
>
>	Unless required by applicable law or agreed to in writing, software
>	distributed under the License is distributed on an "AS IS" BASIS,
>	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
>	See the License for the specific language governing permissions and
>	limitations under the License.
--->

<!---
> NOTE: This repository contains the guide documentation source. To view
> the guide in published form, view it on the https:kabanero.io/guides/{projectid}.html[website].
--->

## What you will learn
You will learn how to set up Eclipse Che in a Kabanero instance that runs on Red Hat OpenShift Container Platform (OCP). You will then learn how to build a simple microservices application that is based on the Eclipse MicroProfile Kabanero Collection using Codewind for Eclipse Che as a containerized IDE.

## Prerequisites
1. You must install [Red Hat OpenShift Container Platform (OCP) 4.2](https://docs.openshift.com/container-platform/4.2/welcome/index.html). If your cluster does not use dynamic provisioning for storage (e.g. glusterfs), you must set up NFS volumes. We recommend that you set up a dynamic NFS persistent volume by using the `nfs-client` from the kubernetes-incubator project as documented in this [guide](https://medium.com/faun/openshift-dynamic-nfs-persistent-volume-using-nfs-client-provisioner-fcbb8c9344e). The process can be automated, as shown in this example [NFS provisioner script](https://github.ibm.com/dacleyra/ocp-on-fyre/blob/master/nfs-storage-provisioner.sh).
1. You must install [Kabanero Foundation 0.3.0 or later](https://kabanero.io/docs/ref/general/installing-kabanero-foundation.html)

## Getting started
Eclipse Codewind and Eclipse Che combine to simplify and enhance online development in containers, with features to write, debug, and deploy cloud-native applications. Eclipse Codewind provides the ability to create new projects based on Kabanero Collections. Kabanero Collections can be customized to include Application stacks that meet your company policies and allow you to consistently deploy applications and microservices at scale.

Kabanero installs on OpenShift Container Platform (OCP) and integrates a modern DevOps toolchain with Kabanero Collections that enable developers to use runtimes and frameworks in pre-built container images. Eclipse Codewind provides the ability to create application projects from Kabanero Collections that have a variety of different template types.

In this guide, you will install and configure Codewind for Eclipse Che on OCP and verify your implementation by using Codewind to develop and deploy a simple microservice application.

## Enable Che in Kabanero
Eclipse Che is installed on your cluster when you install Kabanero Foundation v0.3.0. When Kabanero is installed, you can use one of the following methods to enable Che in the Kabanero Custom Resource Definition (CRD):

**Using the `oc` CLI**
1. Open a terminal and run the command: `oc edit kabanero -n kabanero -o yaml`
1. Set the `spec.che.enable` attribute to `true`.
1. Save the file.

**Using the OpenShift Console**
1. Switch the project to `kabanero`.
1. Under **Administration**, click **Custom Resource Definitions**.
1. Open the `kabanero` CRD and click on the **Instances** tab.
1. Open the `kabanero` name and click on the **YAML** tab.
1. Edit the `spec.che.enable` attribute to `true`.
1. Click the **Save** button.

After a short wait, check the Kabanero custom resource by running the following command:
```
oc get kabanero -n kabanero -o yaml
```
The output is similar to the following example, which shows that Che is available and ready:
```yaml
status:
    appsody:
      ready: "True"
      version: 0.2.2
    che:
      cheOperator:
        version: 7.3.1
      kabaneroChe:
        version: 0.6.0
      kabaneroCheInstance:
        cheImage: kabanero/kabanero-che
        cheImageTag: 0.6.0
        cheWorkspaceClusterRole: eclipse-codewind
      ready: "True"
```

## Launch the Che dashboard through the OCP console.

1. Ensure that the Project is set to `kabanero`.
1. Under **Networking** select the **Routes** menu item. The list of routes includes a new entry named `che`.
1. Click on the link in the **Location** column to open the Che dashboard running in Kabanero. The default userid is `admin` and the default password is `admin`.

![Che route location](/img/guide/eclipse-che-kabanero-ocp-kabanero-route-location.png)

The Kabanero Landing page opens in a new browser tab, inviting you to create a new workspace.
However, before proceeding, Kabanero and Codewind require some further configuration.

## Enabling privileged and root containers to run
In order to build container images, Codewind must run as [privileged and root](https://www.eclipse.org/codewind/mdt-che-installinfo.html#enabling-privileged-and-root-containers-to-run).

Run the following commands:

```
oc project kabanero
oc adm policy add-scc-to-group privileged system:serviceaccounts:kabanero
oc adm policy add-scc-to-group anyuid system:serviceaccounts:kabanero
```

## Adding the OpenShift internal registry with Codewind

**Note:** Parts of the following instructions are adapted from [Adding the OpenShift internal registry with Codewind](https:www.eclipse.org/codewind/openshiftregistry.html).

### Setting up a service account

In order to move container images in OpenShift you must [create or identify a service account with sufficient access rights](https:www.eclipse.org/codewind/openshiftregistry.html#setting-up-a-service-account). Run the following commands:

```
oc new-project svt-che-proj1
oc create serviceaccount pusher
oc policy add-role-to-user system:image-builder system:serviceaccount:svt-che-proj1:pusher
oc describe sa pusher
oc describe secret pusher-token-5cl44
```

You must know the *service account name* and *token value* from the **secret** to add to the OpenShift registry.  

### Adding the OpenShift registry in Che

From the Kabanero Landing Page, under the **Administration** menu item, click on the **Add Registry** button.

[Add the OpenShift registry in Che](https:www.eclipse.org/codewind/openshiftregistry.html#adding-the-openshift-registry-in-che) by using the `pusher` service account that you set up previously and the token secret for the service account listed by the `oc describe secret` command. For OCP4.x use the registry address `image-registry.openshift-image-registry.svc:5000`.

![Add the OpenShift registry in Che](/img/guide/eclipse-che-kabanero-ocp-add-openshift-registry-in-che.png)

## Create the Codewind workspace
Create the Codewind workspace by using the latest CodeWind `devfile.yaml` file. The general format for creating a Che workspace by using a factory is `http://<che ingress domain>/f?url=<hosted devfile URL>`.

Use the [devfile.yaml file](https://raw.githubusercontent.com/eclipse/codewind-che-plugin/0.6.0/devfiles/0.6.0/devfile.yaml) with your Che ingress domain.
For example

```
http://che-kabanero.apps.scrunch.os.fyre.ibm.com/f?url=https://raw.githubusercontent.com/eclipse/codewind-che-plugin/0.6.0/devfiles/0.6.0/devfile.yaml
```

**NOTE:**
1. A known issue on Chrome can cause the [workspace initialization to hang](https:github.com/eclipse/che/issues/15188). Use another web browser to complete this step, for example, Firefox.
1. You can have only one workspace running at a time per `devfile.yaml` file. However, you can have multiple workspaces based on unique `devfile.yaml` files.

![Create the Codewind workspace](/img/guide/eclipse-che-kabanero-ocp-create-codewind-workspace.png)

When the installation completes, make sure the Codewind workspace is running. Use the following commands to check that the Codewind persistent volume claim and replica set are created:

```
oc project kabanero
oc get pv
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                                    STORAGECLASS          REASON   AGE
pvc-1e2cb2be-0be4-11ea-b124-00000a100f85   1Gi        RWX            Delete           Bound    kabanero/codewind-workspacea5ez8brm1mymf0hq              managed-nfs-storage            72m
pvc-2e91bba8-0bdd-11ea-8d16-00000a100f83   100Gi      RWX            Delete           Bound    openshift-image-registry/image-registry-storage          managed-nfs-storage            122m
pvc-9bc9b075-0bdd-11ea-8d16-00000a100f83   1Gi        RWO            Delete           Bound    kabanero/postgres-data                                   managed-nfs-storage            119m
pvc-eb627784-0be3-11ea-abb1-00000a100f84   1Gi        RWO            Delete           Bound    kabanero/claim-che-workspace-workspacea5ez8brm1mymf0hq   managed-nfs-storage            74m

oc get rs
NAME                                                        DESIRED   CURRENT   READY   AGE
che-7697b8dbc7                                              1         1         1       114m
che-operator-668d455c5d                                     1         1         1       3h28m
codewind-performance-workspacea5ez8brm1mymf0hq-569b87c7d4   1         1         1       47s
codewind-workspacea5ez8brm1mymf0hq-55b6499654               1         1         1       47s
devfile-registry-7bd4c9fb7d                                 1         1         1       115m
kabanero-cli-65c8b4cc99                                     1         1         1       3h19m
kabanero-landing-7d9dd576c                                  1         1         1       3h19m
kabanero-operator-7d8bd865bd                                1         1         1       3h28m
keycloak-574f64d4dd                                         1         1         1       117m
plugin-registry-6db6d5654d                                  1         1         1       115m
postgres-84c48594c                                          1         1         1       117m
tiller-deploy-7c5cc49fb9                                    1         1         1       70m
workspacea5ez8brm1mymf0hq.che-jwtproxy-7b99c9c65c           1         1         1       75s
workspacea5ez8brm1mymf0hq.che-workspace-pod-7dbfdddf8c      1         1         1       75s
```

## Add the OpenShift registry in Codewind

**Note:** The following instructions are based on the Codewind guide [Adding the OpenShift registry in Codewind](https://www.eclipse.org/codewind/openshiftregistry.html#adding-the-openshift-registry-in-codewind).

On the right-hand side of the Kabanero Landing Page, click on the Codewind logo to open the Codewind project explorer. If you have not already done so, interacting with the project explorer prompts you to set a deployment registry.

![Check that Codewind is running in Che](/img/guide/eclipse-che-kabanero-ocp-check-codewind-running.png)

For OCP4.x, enter `image-registry.openshift-image-registry.svc:5000/<project name>` as the deployment registry. For example:

![Adding the OpenShift registry in Codewind](/img/guide/eclipse-che-kabanero-ocp-add-openshift-registry-in-codewind.png)

When asked if you want to deploy a test image to the registry, click **Yes** to push the sample Hello World image, as show in the following image.

![Push the sample image](/img/guide/eclipse-che-kabanero-ocp-push-sample-image.png)

A confirmation message indicates that the test has succeeded and the deployment registry is saved.

![Deployment registry test succeeded](/img/guide/eclipse-che-kabanero-ocp-save-registry-success-msg.png)

## Add Kabanero Collection templates to Codewind
Open the Codewind project explorer by clicking on the Codewind logo on the right side of the workspace.
Right click on **Projects** > **Manage Template Sources**.

![Manage template sources](/img/guide/eclipse-che-kabanero-ocp-manage-template-sources.png)

Click on the **Add New** button to create a new template.

Add the following Kabanero Collection URL in the pop up window and provide a name and description:

```
https:github.com/kabanero-io/collections/releases/download/0.3.0/kabanero-index.json
```


![Add the Kabanero template source](/img/guide/eclipse-che-kabanero-ocp-add-kabanero-template-source.png)

Enable only the Kabanero template source and disable any other templates sources shown.

![Enable only the Kabanero template collection](/img/guide/eclipse-che-kabanero-ocp-enable-only-kabanero-template.png)

Now that you have installed and enabled Che, you can create and run a microservice application to verify your development environment.

## Create a microservices application
From the Codewind project explorer click on the `+` sign next to **Projects** to create a new project with the Kabanero Collection.

Select the `Kabanero Eclipse MicroProfile` template and enter a name for your application.

![Kabanero select template](/img/guide/eclipse-che-kabanero-ocp-select-template.png)

Your new project is created, built, and compiled inside a container.
The project overview shows that the build was successful and that the application has started.
To view the project logs, right click on your project name, and select `Show all logs`. An `Output` tab
is displayed containing the project's build logs.

![Kabanero project status](/img/guide/eclipse-che-kabanero-ocp-kabanero-project-status.png)

Launch the application by clicking on the Application Endpoint. This opens a new browser window showing
the *Welcome to your Appsody Microservice* page.

![Eclipse MicroProfile sample application](/img/guide/eclipse-che-kabanero-ocp-mp-app.png)

You can view the application pod in the `kabanero` namespace. The pod name starts with `cw-`.
To see an example, run the following command:

```
# oc get pods  -n kabanero | grep cw-
cw-javampapp-607e7be0-0bf0-11ea-823b-7867f86f7c-zdfcc             1/1     Running   0          103m

# oc get routes -n kabanero | grep cw-
cw-javampapp-607e7be0-0bf0-11ea-823b-service-74tg4          cw-javampapp-607e7be0-che-kabanero.apps.scrunch.os.fyre.ibm.com                /      cw-javampapp-607e7be0-0bf0-11ea-823b-service          9080                                  None
```

View the deployment by running the following commands:
```
# oc get deployments -n kabanero | grep cw-
cw-javampapp-f6ce4550-0ca2-11ea-8e85             1/1     1            1           170m

# oc describe deployment cw-javampapp-f6ce4550-0ca2-11ea-8e85 -n kabanero
Name:                   cw-javampapp-f6ce4550-0ca2-11ea-8e85
Namespace:              kabanero
CreationTimestamp:      Fri, 22 Nov 2019 07:31:33 -0800
Labels:                 projectID=f6ce4550-0ca2-11ea-8e85-91aa2bd1fcf5
Annotations:            deployment.kubernetes.io/revision: 1
                        kubectl.kubernetes.io/last-applied-configuration:
                          {"apiVersion":"apps/v1","kind":"Deployment","metadata":{"annotations":{},"labels":{"projectID":"f6ce4550-0ca2-11ea-8e85-91aa2bd1fcf5"},"na...
Selector:               app=cw-javampapp-f6ce4550-0ca2-11ea-8e85
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:           app=cw-javampapp-f6ce4550-0ca2-11ea-8e85
                    release=cw-javampapp-f6ce4550-0ca2-11ea-8e85
  Service Account:  che-workspace
  Containers:
   cw-javampapp-f6ce4550-0ca2-11ea-8e85:
    (/img/guide/eclipse-che-kabanero-ocp-       kabanero/java-microprofile:0.2
    Ports:       7777/TCP, 9080/TCP, 9443/TCP
    Host Ports:  0/TCP, 0/TCP, 0/TCP
    Command:
      /.appsody/appsody-controller
    Environment:  <none>
    Mounts:
      /.appsody from appsody-workspace (rw,path="workspacedzdx0zspsm82cwzk/projects/.extensions/codewind-appsody-extension/bin")
      /project/user-app/pom.xml from appsody-workspace (rw,path="workspacedzdx0zspsm82cwzk/projects/java-mp-app/pom.xml")
      /project/user-app/src from appsody-workspace (rw,path="workspacedzdx0zspsm82cwzk/projects/java-mp-app/src")
  Volumes:
   dependencies:
    Type:       EmptyDir (a temporary directory that shares a pod's lifetime)
    Medium:
    SizeLimit:  <unset>
   appsody-workspace:
    Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
    ClaimName:  codewind-workspacedzdx0zspsm82cwzk
    ReadOnly:   false
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  cw-javampapp-f6ce4550-0ca2-11ea-8e85-68ff9f555d (1/1 replicas created)
NewReplicaSet:   <none>
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  167m  deployment-controller  Scaled up replica set cw-javampapp-f6ce4550-0ca2-11ea-8e85-68ff9f555d to 1
  Normal  ScalingReplicaSet  135m  deployment-controller  Scaled up replica set cw-javampapp-f6ce4550-0ca2-11ea-8e85-68ff9f555d to 1
```

Congratulations! You have successfully installed and enabled Eclipse Che in your Kabanero cluster and verified that you can create and run a microservice application.
