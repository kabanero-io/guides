---
permalink: /guides/stack-java-openliberty/
layout: guide-markdown
title: Developing cloud native microservice applications with the Open Liberty application stack
duration: 40 minutes
releasedate: 2020-03-20
description: Explore how to use the Open Liberty application stack to create, run, update, deploy, and deliver cloud native microservices.
tags: ['Java', 'Open Liberty', 'Stack']
guide-category: stacks
---

<!-- Note:
> This repository contains the guide documentation source. To view
> the guide in published form, view it on the [website](https://kabanero.io/guides/{projectid}.html).
-->

<!--
//
//	Copyright 2020 IBM Corporation and others.
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

<!--
// =================================================================================================
// What you'll learn
// =================================================================================================
-->

## What you'll learn

Application stacks enable the development and optimization of microservice applications. With application stacks, developers don’t need to manage the full software development stack or be experts on underlying container technologies or Kubernetes. Application stacks are customized for specific enterprises to incorporate their company standards and technology choices. Developers access these stacks by configuring their development environment to point to a stack configuration.

In this guide, you’ll learn how to configure your development environment, then create and run a simple cloud native microservice based on the Java&trade; Open Liberty application stack. Finally, you’ll update the microservice that you created and deploy it to Kubernetes or serverless. Deployment to serverless is optional depending on whether you want to Scale to Zero.

Applications in this guide are written based on the Jakarta EE and Eclipse MicroProfile API specifications, built and run with the [Open Liberty](https://openliberty.io/) runtime, and deployed to Kubernetes through a modern DevOps toolchain that is triggered in Git.

<!--
// =================================================================================================
// Prerequisites
// =================================================================================================
-->

## Prerequisites

- [Docker](https://docs.docker.com/get-started/) must be installed. If you are using Docker Desktop, you can enable Kubernetes from the menu by selecting *Preferences* -> *Kubernetes* -> *Enable Kubernetes*. Other options include [Minishift](https://www.okd.io/minishift/) or [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/).
- [Appsody](https://appsody.dev/docs/getting-started/installation) must be installed.


<!--
// =================================================================================================
// Getting started
// =================================================================================================
-->

## Getting started

You are going to create an application that is based on a public stack from the Kabanero project. After configuring your local development environment, you are going to initialize a new project that is based on the Open Liberty stack.

<!--
// =================================================================================================
// Configuring your development environment
// =================================================================================================
-->

### Configuring your development environment

To check the repositories that you can already access, run the following command:

```shell
appsody repo list
```

You see output similar to the following example:

```shell
NAME        URL
*incubator https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
```

Next, run the following command to add the URL for the public Kabanero stack hub:

```shell
appsody repo add kabanero https://github.com/kabanero-io/kabanero-stack-hub/releases/download/0.9.0/kabanero-stack-hub-index.yaml
```

Check the repositories again by running `appsody repo list` to see that your repository was added. The output is similar to the following example:

```shell
NAME        URL
*incubator https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
kabanero   https://github.com/kabanero-io/kabanero-stack-hub/releases/download/0.9.0/kabanero-stack-hub-index.yaml
```

In this example, the asterisk (\*) shows that `incubator` is the default repository. Run the following command to set `kabanero` as the default repository:

```shell
appsody repo set-default kabanero
```

Check the available repositories again by running `appsody repo list` to see that the default is updated:

```shell
NAME        URL
incubator https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
*kabanero   https://github.com/kabanero-io/kabanero-stack-hub/releases/download/0.9.0/kabanero-stack-hub-index.yaml
```

**Recommendation**: To avoid initializing projects that are based on the public application stacks, it's best
to remove `incubator` from the list. Run the following command to remove the `incubator` repository:

```shell
appsody repo remove incubator
```

Check the available repositories again by running `appsody repo list` to see that `incubator` is removed:

```shell
NAME        URL
*kabanero   https://github.com/kabanero-io/kabanero-stack-hub/releases/download/0.9.0/kabanero-stack-hub-index.yaml
```

Your development environment is now configured to use the Kabanero application stacks. Next, you need to initialize your project.

**Note:** If your organization has created a stack hub that contains customized application stacks, you must configure your development environment to access them. After you have completed this guide, you can step through this section again to update your configuration to point to the URL for your organization's stack hub. This configuration process is also described in [Developing microservice applications with the CLI](../use-appsody-cli).

<!--
// =================================================================================================
// Initializing your project
// =================================================================================================
-->

### Initializing your project

First, create a directory that will contain the project:

```shell
mkdir -p ~/projects/java-openliberty
cd ~/projects/java-openliberty
```

Run the following command to initialize the project with the CLI:

```shell
appsody init java-openliberty
```

The output from the command is similar to the following example:

```shell
Checking stack requirements...
Appsody requirements met
Docker requirements met
Running appsody init...
Downloading java-openliberty template project from https://github.com/kabanero-io/collections/releases/download/0.9.0/java-openliberty.v0.2.3.templates.default.tar.gz
Download complete. Extracting files from /Users/myuser/appsody/java-openliberty/java-openliberty.tar.gz
Setting up the development environment
Your Appsody project name has been set to java-openliberty
Pulling docker image docker.io/kabanerobeta/java-openliberty:0.2
Running command: docker pull docker.io/kabanerobeta/java-openliberty:0.2
0.2: Pulling from kabanerobeta/java-openliberty
..
..
[InitScript] [INFO] Scanning for projects...
[InitScript] [INFO]
[InitScript] [INFO] --------------------< dev.appsody:java-openliberty >--------------------
[InitScript] [INFO] Building java-openliberty 0.2.3
[InitScript] [INFO] --------------------------------[ pom ]---------------------------------
[InitScript] Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-enforcer-plugin/3.0.0-M3/maven-enforcer-plugin-3.0.0-M3.pom
..
..
[InitScript] [INFO]
[InitScript] [INFO] --- maven-install-plugin:2.4:install (default-install) @ java-openliberty ---
[InitScript] [INFO] Installing /Users/myuser/appsody/java-openliberty/.appsody_init/pom.xml to /Users/myuser/.m2/repository/dev/appsody/java-openliberty/0.2.3/java-openliberty-0.2.3.pom
[InitScript] [INFO] ------------------------------------------------------------------------
[InitScript] [INFO] BUILD SUCCESS
[InitScript] [INFO] ------------------------------------------------------------------------
[InitScript] [INFO] Total time:  2.556 s
[InitScript] [INFO] Finished at: 2020-05-15T13:19:45+01:00
[InitScript] [INFO] ------------------------------------------------------------------------
Successfully added your project to /Users/myuser/.appsody/project.yaml
Your Appsody project ID has been set to 20200515131945.49100100
Successfully initialized Appsody project with the java-openliberty stack and the default template.
```

**Note:** Some lines (..) are removed for clarity.

Your project is now initialized.

<!--
// =================================================================================================
// Understanding the project layout
// =================================================================================================
-->

## Understanding the project layout

For context, the following image displays the structure of the project that you're working on:

![Project structure](/img/guide/openliberty-project-layout.png)

It contains the following artifacts:

- `mvnw.cmd`, a Maven Wrapper for Windows environments
- `mvnw`, a Maven Wrapper for Unix-like environments
- `pom.xml`, a project build file
- `StarterApplication.java`, a JAX-RS Application class
- `StarterResource.java`, a JAX-RS Resource class
- `quick-start-security.xml`, a simple administrative security configuration
- `server.xml`, an Open Liberty server configuration file
- `index.html`, a static HTML file
- `beans.xml`, the CDI deployment descriptor
- `EndpointTest.java`, a test for the Starter resource endpoint
- `HealthEndpointTest.java`, tests for the readiness and liveness endpoints

<!--
// =================================================================================================
// Running the development environment
// =================================================================================================
-->

## Running the development environment

Run the following command to start the development environment:

```shell
appsody run
```

The CLI launches a local Docker image that contains an Open Liberty server that hosts the microservice. After some time, you see a message similar to the following example:

```shell
[Container] [INFO] [AUDIT   ] CWWKF0011I: The defaultServer server is ready to run a smarter planet. The defaultServer server started in 6.801 seconds.
```

This message indicates that the server is started and you are ready to begin developing your application.

<!--
// =================================================================================================
// Creating and updating the application
// =================================================================================================
-->

## Updating the application

The basic application created by the project initialization defines one API endpoint `/starter/resource`.

Browse to `http://localhost:9080/stater/resource` to call the API. You should see the output `StarterResource response`.

Edit the `StarterResource.java` class in the `src/main/java/dev/appsody/starter` directory. Open the file, modify the response from the `getRequest` method:

```java
package dev.appsody.starter;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

@Path("/resource")
public class StarterResource {
    @GET
    public String getRequest() {
        return "StarterResource response running in a microservice!";
    }
}
```

The development environment watches for file changes and automatically updates your application. After you save, the source compiles and the application updates. You see messages similar to the following example:

```shell
[Container] [INFO] [AUDIT   ] CWWKT0017I: Web application removed (default_host): http://c795e8d0b51c:9080/
[Container] [INFO] [AUDIT   ] CWWKZ0009I: The application starter-app has stopped successfully.
[Container] [INFO] [AUDIT   ] CWWKT0016I: Web application available (default_host): http://c795e8d0b51c:9080/
[Container] [INFO] [AUDIT   ] CWWKZ0003I: The application starter-app updated in 1.052 seconds.
```

Point your browser to `http://localhost:9080/starter/resource` URL to see the new output:

```shell
StarterResource response running in a microservice!
```

**Note:** Modifying the response from the Starter resource endpoint will cause an integration test failure in the test that checks the endpoint response. To ensure that the test passes, edit the `EndpointTest.java` class in the `src/test/java/it/dev/appsody/starter` directory. Modify the expected resource string in the `testResourceEndpoint` method to match the response from the `getRequest` method in the `StarterResource.java` class.

Use `Ctrl+C` to stop the development environment, or run the command `appsody stop` from another terminal.

<!--
// =================================================================================================
// Testing the application
// =================================================================================================
-->

## Testing the application

If you are building an application that is composed of microservices, you need to test within the context of the overall system. First, test your application and perform unit testing in isolation. To test the application as part of the system, deploy the system and then the new application.

You can choose how you want to deploy the system and application. If you have adequate CPU and memory to run MiniShift, the application, and the associated services, then you can deploy the application on a local Kubernetes that is running on your computer. Alternatively, you can enable Docker Desktop for Kubernetes, which is described in the Prerequisites section of the guide.

You can also deploy the system, application, and the associated services in a private namespace on a development cluster. From this private namespace, you can commit the microservices in Git repositories and deploy them through a DevOps pipeline, not directly to Kubernetes.

<!--
// =================================================================================================
// Testing locally on Kubernetes
// =================================================================================================
-->

### Testing locally on Kubernetes

After you finish writing your application code, the Appsody CLI makes it easy to deploy directly to a Kubernetes cluster for further local testing. The ability to deploy directly to a Kubernetes cluster is valuable when you want to test multiple microservices together or test with services that the application requires.

Ensure that your `kubectl` command is configured with cluster details, and run the following command to deploy your application:

```shell
appsody deploy
```

This command builds a new Docker image that is optimized for production deployment and deploys the image to your local Kubernetes cluster. After some time you see a message similar to the following example:

```shell
Deployed project running at http://localhost:31125
```

Run the following command to check the status of the application pods:

```shell
kubectl get pods
```

You see an output similar to the following example:

```shell
NAME                                    READY   STATUS    RESTARTS   AGE
appsody-operator-7ff45fd6cc-7bndv       1/1     Running   0          22m
java-openliberty-new-77558c7b7c-ss4qs   1/1     Running   0          22m
```

The pod that is related to your deployed application is similar to the following pod:

```shell
java-openliberty-new-77558c7b7c-ss4qs   1/1     Running   0          22m
```

After the `default-java-openliberty` pod starts, go to the URL that was returned after you ran the `appsody deploy` command, and you see the splash screen. To see the response from your application, point your browser to `<URL_STRING>/starter/resource`, where `<URL_STRING>` is the URL that was returned. For example, the `http://localhost:31125` URL was returned in the previous example. Go to the `http://localhost:31125/starter/resource` URL to see the deployed application response.

Use the following command to stop the deployed application:

```shell
appsody deploy delete
```

After you run this command, and the deployment is deleted, you see the following message:

```shell
Deployment deleted
```

<!--
// =================================================================================================
// Testing with serverless
// =================================================================================================
-->

### Testing with serverless

You can choose to test an application that is deployed with serverless to take advantage of Scale to Zero. Not all applications can be written to effectively take advantage of Scale to Zero. The Kabanero operator-based installation configures serverless on the Kubernetes cluster. Because of the resources that are required to run serverless and its dependencies, testing locally can be difficult. Publish to Kubernetes by using pipelines that are described later in the guide. Your operations team can configure the pipelines so that serverless is enabled for deployment.

<!--
// =================================================================================================
// Publishing to Kubernetes by using pipelines
// =================================================================================================
-->

## Publishing to Kubernetes by using pipelines

After you develop and test your application in your local environment, it’s time to publish it to your enterprise’s pipeline. From your enterprise’s pipeline, you can deploy the application to the appropriate Kubernetes cluster for staging or production. Complete this process in Git.

When Kabanero is installed, deploying applications to a Kubernetes cluster always occurs through the DevOps pipeline that is triggered in Git. Using DevOps pipelines to deploy applications ensures that developers can focus on application code, not on containers or Kubernetes infrastructure. From an enterprise perspective, this deployment process ensures that both the container image build and the deployment to Kubernetes or Knative happen in a secure and consistent way that meets company standards.

To deliver your application to the pipeline, push the project to the pre-configured Git repository that has a configured webhook. This configured webhook triggers the enterprise build and deploy pipeline. For more information, see [Working with pipelines](../working-with-pipelines).
