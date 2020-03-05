---
permalink: /guides/collection-nodejs-loopback/
layout: guide-markdown
title: Developing microservice apps with the Node.js Loopback application stack
duration: 40 minutes
releasedate: 2020-01-27
description: Learn how to create, run, update, deploy, and deliver a simple cloud native application using the Node.js Loopback application stack.
tags: ['stack', 'Node.js']
guide-category: stacks
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

<!--
// =================================================================================================
// What you'll learn
// =================================================================================================
-->

## What you will learn

**NOTE: Use this guide only for Kabanero V0.5.0 and earlier releases.**

In this guide, you’ll learn how to create and run a simple cloud native microservice based on the Node.js LoopBack application stack. You’ll learn how to configure your development environment, update the microservice that you created and deploy it to Kubernetes or serverless. Deployment to serverless is optional depending on whether you want to Scale to Zero.

The Node.js LoopBack application stack enables the development and optimization of microservices.
With application stacks, developers don’t need to manage full software development stacks or be experts on underlying container
technologies or Kubernetes. Application stacks are customized for specific enterprises to incorporate their company standards
and technology choices.

Applications in this guide are written based on the LoopBack API specifications, built and run with Node.js, and deployed to Kubernetes through a modern DevOps toolchain that is triggered in Git.

<!--
// =================================================================================================
// Prerequisites
// =================================================================================================
-->

## Prerequisites

- [Docker](https://docs.docker.com/get-started/) must be installed.
- [Appsody](https://appsody.dev/docs/getting-started/installation) must be installed.
- *Optional:* If your organisation has customized application stacks, you need the URL that points to the `index.yaml` configuration file.
- *Optional*: If you are testing multiple microservices together, you must have access to a local Kubernetes cluster for local development.
If you are using Docker Desktop, you can enable Kubernetes from the menu by selecting *Preferences* -> *Kubernetes* -> *Enable Kubernetes*.
Other options include [Minishift](https://www.okd.io/minishift/) or [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/).
If you want to use remote cluster development, use Codewind.

<!--
// =================================================================================================
// Getting started
// =================================================================================================
-->

## Getting started

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

Next, run the following command to add the URL for your stack configuration file:

```shell
appsody repo add <my-org-stack> <URL>
```

where `<my-org-stack>` is the repository name for your stack hub and `<URL>` is the URL for
your stack hub index file.

**Note:** If you do not have a stack hub that contains customized, pre-configured application stacks, you can skip to
[Initializing your project](#initializing-your-project) and develop your app based on the public application stack
for Node.js Loopback.

Check the repositories again by running `appsody repo list` to see that your stack hub was added. In the
following examples, the stack hub is called `acme-stacks` and the URL is `https://github.com/acme.inc/stacks/index.yaml`:

```shell
NAME        URL
*incubator https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
acme-stacks https://github.com/acme.inc/stacks/index.yaml
```

In this example, the asterisk (\*) shows that `incubator` is the default repository. Run the following command to set `acme-stacks`
as the default repository:

```shell
appsody repo set-default acme-stacks
```

Check the available repositories again by running `appsody repo list` to see that the default is updated:

```shell
NAME        URL
incubator   https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
*acme-stacks https://github.com/acme.inc/stacks/index.yaml
```

**Recommendation**: To avoid initializing projects that are based on the public application stacks, it's best
to remove `incubator` from the list. Run the following command to remove the `incubator` repository:

```shell
appsody repo remove incubator
```

Check the available repositories again by running `appsody repo list` to see that `incubator` is removed:

```shell
NAME        URL
*acme-stacks https://github.com/acme.inc/stacks/index.yaml
```

Your development environment is now configured to use your customized application stacks. Next, you need to initialize your project.

<!--
// =================================================================================================
// Initializing your project
// =================================================================================================
-->

### Initializing your project

First, create a directory that will contain the project:

```shell
mkdir -p ~/projects/simple-nodejs-loopback
cd ~/projects/simple-nodejs-loopback
```

Run the following command to initialize your Node.js LoopBack project:

```shell
appsody init nodejs-loopback
```

The output from the command is similar to the following example:

```shell
Running appsody init...
Downloading nodejs-loopback template project from https://github.com/kabanero-io/collections/releases/download/0.5.0/incubator.nodejs-loopback.v0.1.6.templates.scaffold.tar.gz
Download complete. Extracting files from /Users/user1/appsody/simple-nodejs-loopback/nodejs-loopback.tar.gz
Setting up the development environment
Your Appsody project name has been set to simple-nodejs-loopback
Pulling docker image kabanero/nodejs-loopback:0.1.6
Running command: docker pull kabanero/nodejs-loopback:0.1.6
0.1.6: Pulling from kabanero/nodejs-loopback
..
26ad3cb5cc5c: Pull complete
Digest: sha256:cca31a10f825c0ae7785681b21189921b12c88b4260ff17558f39c0093e1625d
Status: Downloaded newer image for kabanero/nodejs-loopback:0.1.6
docker.io/kabanero/nodejs-loopback:0.1.6
[Warning] The stack image does not contain APPSODY_PROJECT_DIR. Using /project
Running command: docker run --rm --entrypoint /bin/bash kabanero/nodejs-loopback:0.1 -c find /project -type f -name .appsody-init.sh
Successfully initialized Appsody project
```

Your new project is created, built, and started inside a container.

<!--
// =================================================================================================
// Understanding the project layout
// =================================================================================================
-->

## Understanding the project layout

For context, the following image displays the structure of the project that you’re working on:

![Project structure](/img/guide/collection-nodejs-loopback-project-layout.png)

This project contains the following artifacts:

- `DEVELOPING.md`, a short guide for developing LoopBack applications in an IDE
- `README.md`, an overview of how the project was generated
- `index.js`, a top level file file used by Node.js
- `index.ts`, a top level file used by Typescript
- `package-lock.json`, the application's npm dependency tree
- `package.json`, the application's package manifest
- `public`, folder, containing static assets
- `src`, folder, containing application source code
- `tsconfig.json`, a Typescript configuration file

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

The CLI launches a local Docker image that contains the Node.js Loopback runtime environment that hosts the microservice.
After some time, you see a message similar to the following example:

```shell
[Container] Running command:  npm start
[Container]
[Container] > nodejs-loopback@0.1.6 start /project
[Container] > node -r source-map-support/register .
[Container]
[Container] Server is running at http://[::1]:3000
[Container] Try http://[::1]:3000/ping
```

This message indicates that the project is started. Browse to `http://localhost:3000` and you can see the LoopBack splash screen,
as shown in the following image:

![Browser showing Loopback splash screen](/img/guide/collection-nodejs-loopback-splashscreen.png)

<!--
// =================================================================================================
// Creating and updating the application
// =================================================================================================
-->

## Updating the application

The basic application created by the project initialization defines one API endpoint `/ping`.

Browse to `http://localhost:3000/ping/` to call the ping API. You should see the greeting `Hello from LoopBack` at the beginning of the content, in a similar format to the following output:

```shell
{"greeting":"Hello from LoopBack","date":"2019-12-18T15:59:18.118Z","url":"/ping","headers": ...
```

Edit the `src/controllers/ping.controller.ts` file. Change the text of the greeting in the `ping` object in the `PingController` class from `Hello from LoopBack` to `Hello from LoopBack running in a microservice!`

Save the change.

The development environment watches for file changes and automatically updates your application. Point your browser to `http://localhost:3000/ping` to see the new output, which displays the greeting **Hello from LoopBack running in a microservice!**.

If your application is currently running, you can stop it with `Ctrl+C`, or by running the command `appsody stop` from another terminal.

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

After you finish writing your application code, the CLI makes it easy to deploy directly to a Kubernetes cluster for further local testing.
 The ability to deploy directly to a Kubernetes cluster is valuable when you want to test multiple microservices together or test with services that the application requires.

Ensure that your `kubectl` command is configured with cluster details and run the following command to deploy the application:

```shell
appsody deploy
```

This command builds a new Docker image that is optimized for production deployment and deploys the image to your local Kubernetes cluster.
After some time you see a message similar to the following example:

```shell
Deployed project running at http://localhost:30262
```

Run the following command to check the status of the application pods:

```shell
kubectl get pods
```

In the following example output, you can see that a `simple-nodejs-loopback` pod is running:

```shell
NAME                                    READY   STATUS    RESTARTS   AGE
appsody-operator-6bbddbd455-nfhnm        1/1     Running   0          26d
simple-nodejs-loopback-775b655768-lqn6q  1/1     Running   0          3m10s
```

After the `simple-nodejs-loopback` pod starts, go to the URL that was returned when you ran the `appsody deploy` command,
and you see the splash screen. To see the response from your application, point your browser to
the `<URL_STRING>/example` URL, where `<URL_STRING>` is the URL that was returned. For example, `http://localhost:30262`
was returned in the previous example. Go to the `http://localhost:30262/example` URL to see the deployed application response.

Use the following command to stop the deployed application:

```shell
appsody deploy delete
```

After you run this command and the deployment is deleted, you see the following message:

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

To deliver your application to the pipeline, push the project to the pre-configured Git repository that has a configured webhook. This configured webhook triggers the enterprise build and deploy pipeline.
