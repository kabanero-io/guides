---
permalink: /guides/stack-microprofile/
layout: guide-markdown
title: Developing cloud native microservice applications with the Eclipse MicroProfile application stack
duration: 40 minutes
releasedate: 2020-01-27
description: Explore how to use the Eclipse MicroProfile application stack to create, run, update, deploy, and deliver cloud native microservices.
tags: ['Java', 'MicroProfile', 'Stack']
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

## What you'll learn

Application stacks enable the development and optimization of microservice applications. With application stacks, developers don’t need to manage the full software development stack or be experts on underlying container technologies or Kubernetes. Application stacks are customized for specific enterprises to incorporate their company standards and technology choices. Developers access these stacks by configuring their development environment to point to a stack configuration.

In this guide, you’ll learn how to configure your development environment, then create and run a simple cloud native microservice based on the Eclipse MicroProfile application stack. Finally, you’ll update the microservice that you created and deploy it to Kubernetes or serverless. Deployment to serverless is optional depending on whether you want to Scale to Zero.

Applications in this guide are written based on the Eclipse MicroProfile API specifications, built and run with the [Open Liberty](https://openliberty.io/) runtime, and deployed to Kubernetes through a modern DevOps toolchain that is triggered in Git.

<!--
// =================================================================================================
// Prerequisites
// =================================================================================================
-->

## Prerequisites

- [Docker](https://docs.docker.com/get-started/) must be installed. If you are using Docker Desktop, you can enable Kubernetes from the menu by selecting *Preferences* -> *Kubernetes* -> *Enable Kubernetes*.
Other options include [Minishift](https://www.okd.io/minishift/) or [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/).
- [Appsody](https://appsody.dev/docs/getting-started/installation) must be installed.

<!--
// =================================================================================================
// Getting started
// =================================================================================================
-->

## Getting started

You are going to create an application that is based on a public stack from the Kabanero project. After configuring your local development environment, you are going to initialize a new project that is based on the Eclipse Microprofile stack.

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
appsody repo add kabanero https://github.com/kabanero-io/kabanero-stack-hub/releases/download/0.8.0/kabanero-stack-hub-index.yaml
```

Check the repositories again by running `appsody repo list` to see that your repository was added. The output is similar to the following example:

```shell
NAME        URL
*incubator https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
kabanero   https://github.com/kabanero-io/kabanero-stack-hub/releases/download/0.8.0/kabanero-stack-hub-index.yaml
```

In this example, the asterisk (\*) shows that `incubator` is the default repository. Run the following command to set `kabanero` as the default repository:

```shell
appsody repo set-default kabanero
```

Check the available repositories again by running `appsody repo list` to see that the default is updated:

```shell
NAME        URL
incubator https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
*kabanero   https://github.com/kabanero-io/kabanero-stack-hub/releases/download/0.8.0/kabanero-stack-hub-index.yaml
```

**Recommendation**: To avoid initializing projects that are based on the public application stacks, it's best
to remove `incubator` from the list. Run the following command to remove the `incubator` repository:

```shell
appsody repo remove incubator
```

Check the available repositories again by running `appsody repo list` to see that `incubator` is removed:

```shell
NAME        URL
*kabanero   https://github.com/kabanero-io/kabanero-stack-hub/releases/download/0.8.0/kabanero-stack-hub-index.yaml
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
mkdir -p ~/projects/simple-microprofile
cd ~/projects/simple-microprofile
```

Run the following command to initialize the project with the CLI:

```shell
appsody init java-microprofile
```

The output from the command varies depending on whether you have an installation of Java and Maven on your system. If Java and Maven are installed on your system, you see an output similar to the following example:

```shell
Checking stack requirements...
Appsody requirements met
Running appsody init...
Downloading java-microprofile template project from https://github.com/kabanero-io/collections/releases/download/0.6.4/java-microprofile.v0.2.26.templates.default.tar.gz
Download complete. Extracting files from /Users/myuser/appsody/simple-microprofile/java-microprofile.tar.gz
Setting up the development environment
Your Appsody project name has been set to simple-microprofile
Pulling docker image docker.io/kabanerobeta/java-microprofile:0.2
Running command: docker pull docker.io/kabanerobeta/java-microprofile:0.2
0.2: Pulling from kabanerobeta/java-microprofile
..
..
Status: Downloaded newer image for kabanero/java-microprofile:0.2
docker.io/kabanero/java-microprofile:0.2
Running command: docker run --rm --entrypoint /bin/bash docker.io/kabanero/java-microprofile:0.2 -c "find /project -type f -name .appsody-init.sh"
Extracting project from development environment
Running command: docker create --name java-microprofile-extract -v /Users/myuser/appsody/java-microprofile/:/project/user-app -v /Users/myuser/.m2/repository:/mvn/repository docker.io/kabanero/java-microprofile:0.2
Running command: docker cp java-microprofile-extract:/project /Users/myuser/.appsody/extract/java-microprofile
Project extracted to /Users/myuser/appsody/java-microprofile/.appsody_init
Running command: docker rm java-microprofile-extract -f
Running command: ./.appsody-init.sh
[InitScript] [INFO] Scanning for projects...
[InitScript] Downloading from central: https://repo.maven.apache.org/maven2/net/wasdev/wlp/maven/parent/liberty-maven-app-parent/2.7/liberty-maven-app-parent-2.7.pom
..
..
[InitScript] [INFO]
[InitScript] [INFO] -------------------< dev.appsody:java-microprofile >--------------------
[InitScript] [INFO] Building java-microprofile 0.2.26
[InitScript] [INFO] --------------------------------[ pom ]---------------------------------
[InitScript] [INFO]
[InitScript] [INFO] --- maven-enforcer-plugin:3.0.0-M2:enforce (enforce-versions) @ java-microprofile ---
[InitScript] [INFO] Skipping Rule Enforcement.
[InitScript] [INFO]
[InitScript] [INFO] --- maven-install-plugin:2.4:install (default-install) @ java-microprofile ---
[InitScript] [INFO] Installing /Users/myuser/appsody/java-microprofile/.appsody_init/pom.xml to /Users/myuser/.m2/repository/dev/appsody/java-microprofile/0.2.26/java-microprofile-0.2.26.pom
[InitScript] [INFO] ------------------------------------------------------------------------
[InitScript] [INFO] BUILD SUCCESS
[InitScript] [INFO] ------------------------------------------------------------------------
[InitScript] [INFO] Total time:  1.385 s
[InitScript] [INFO] Finished at: 2020-04-07T14:38:29+01:00
[InitScript] [INFO] ------------------------------------------------------------------------
Successfully added your project to /Users/myuser/.appsody/project.yaml
Your Appsody project ID has been set to 20200407143830.02524700
Successfully initialized Appsody project with the java-microprofile stack and the default template.
```

If Java and Maven are not installed on your system, you see an output similar to the following example:

```shell
[InitScript] Unable to find any JVMs matching version "(null)".
[InitScript] No Java runtime present, try --request to install.
[InitScript] Unable to find a $JAVA_HOME at "/usr", continuing with system-provided Java...
[InitScript] No Java runtime present, requesting install.
[Warning] The stack init script failed: exit status 1
[Warning] Your local IDE may not build properly, but the Appsody container should still work.
[Warning] To try again, resolve the issue then run `appsody init` with no arguments.
```

Your project is now initialized.

<!--
// =================================================================================================
// Understanding the project layout
// =================================================================================================
-->

## Understanding the project layout

For context, the following image displays the structure of the project that you're working on:

![Project structure](/img/guide/microprofile-project-layout.png)

It contains the following artifacts:

- `StarterApplication.java`, a JAX-RS Application class
- `server.xml`, an Open Liberty server configuration file
- `index.html`, a static HTML file
- `pom.xml`, a project build file

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
[Container] [INFO] [AUDIT   ] CWWKF0011I: The defaultServer server is ready to run a smarter planet. The defaultServer server started in 20.235 seconds.
```

This message indicates that the server is started and you are ready to begin developing your application.

<!--
// =================================================================================================
// Creating and updating the application
// =================================================================================================
-->

## Creating and updating the application

Now you can create your business logic. Typically, you put your business logic in a JAX-RS resource. First, you need to add a REST endpoint.

Create a `StarterResource.java` class in the `src/main/java/dev/appsody/starter` directory. Open the file, populate it with the following code, and save it:

```java
package dev.appsody.starter;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
@Path("/resource")
public class StarterResource {
    @GET
    public String getRequest() {
        return "StarterResource response";
    }
}
```

After you save, the source compiles and the application updates. You see messages similar to the following example:

```shell
[Container] [INFO] [AUDIT   ] CWWKT0017I: Web application removed (default_host): http://85862d8696be:9080/
[Container] [INFO] [AUDIT   ] CWWKZ0009I: The application starter-app has stopped successfully.
[Container] [INFO] [AUDIT   ] CWWKT0016I: Web application available (default_host): http://85862d8696be:9080/
[Container] [INFO] [AUDIT   ] CWWKZ0003I: The application starter-app updated in 0.988 seconds.
```

The resource that you just added is available at the `starter/resource` URL path. Go to the http://localhost:9080/starter/resource URL to see the following resource response:

```shell
StarterResource response
```

Try changing the message in the `StarterResource.java` file, saving, and refreshing the page. You'll see that it takes only a few seconds for the change to take effect.

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
Deployed project running at http://localhost:30262
```

Run the following command to check the status of the application pods:
```shell
kubectl get pods
```

You see an output similar to the following example:

```shell
NAME                                  READY    STATUS   RESTARTS   AGE
appsody-operator-859b97bb98-htpgw      1/1     Running   0         3m2s
simple-microprofile-77d6868765-xkcpk   1/1     Running   0         31s
```

The pod that is related to your deployed application is similar to the following pod:

```shell
simple-microprofile-77d6868765-xkcpk   1/1     Running   0         31s
```

After the `simple-microprofile` pod starts, go to the URL that was returned after you ran the `appsody deploy` command, and you see the splash screen. To see the response from your application, point your browser to `<URL_STRING>/starter/resource`, where `<URL_STRING>` is the URL that was returned. For example, the http://localhost:30262 URL was returned in the previous example. Go to the http://localhost:30262/starter/resource URL to see the deployed application response.

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
