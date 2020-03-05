---
permalink: /guides/stack-springboot2/
layout: guide-markdown
title: Developing cloud native microservices with the Spring Boot application stack
duration: 40 minutes
releasedate: 2020-01-27
description: Explore how to use the Spring Boot application stack to create, run, update, deploy, and deliver cloud native microservices.
tags: ['Java', 'Spring Boot', 'Spring', 'Tomcat', 'Stack']
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

In this guide, you’ll learn how to create and run a simple cloud native microservice based on the Spring Boot application stack. You’ll learn how to configure your development environment, update the microservice that you created and deploy it to Kubernetes or serverless. Deployment to serverless is optional depending on whether you want to Scale to Zero.

The Spring Boot application stack enables the development and optimization of microservices. With application stacks, developers don’t need to manage full software development stacks or be experts on underlying container technologies or Kubernetes. Application stacks are customized for specific enterprises to incorporate their company standards and technology choices.

Applications in this guide are written based on the Spring Boot API specifications, built and run with [Apache Tomcat](http://tomcat.apache.org/), and deployed to Kubernetes through a modern DevOps toolchain that is triggered in Git.

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
If you are using Docker Desktop, you can enable Kubernetes from the menu by selecting *Preferences* -> *Kubernetes* -> *Enable Kubernetes*. Other options include [Minishift](https://www.okd.io/minishift/) or [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/). If you want to use remote cluster development, use Codewind.

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
for Spring Boot.

Check the repositories again by running `appsody repo list` to see that your stack hub was added. In the following examples, the stack hub is called `acme-stacks` and the URL is `https://github.com/acme.inc/stacks/index.yaml`:

```shell
NAME        URL
*incubator https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
acme-stacks https://github.com/acme.inc/stacks/index.yaml
```

In this example, the asterisk (\*) shows that `incubator` is the default repository. Run the following command to set `acme-stacks` as the default repository:

```shell
appsody repo set-default acme-stacks
```

Check the available repositories again by running `appsody repo list` to see that the default is updated:

```shell
NAME        URL
incubator   https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
*acme-stacks https://github.com/acme.inc/stacks/index.yaml
```

**Recommendation**: To avoid initializing projects that are based on the public application stacks, it's best to remove `incubator` from the list. Run the following command to remove the `incubator` repository:

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
mkdir -p ~/projects/simple-spring-boot2
cd ~/projects/simple-spring-boot2
```

Run the following command to initialize your Spring Boot project:

```shell
appsody init java-spring-boot2
```

The output from the command varies depending on whether you have an installation of Java on your system. The following output is from a system that has Java installed:

```shell
Running appsody init...
Downloading java-spring-boot2 template project from https://github.com/kabanero-io/collections/releases/download/0.5.0/incubator.java-spring-boot2.v0.3.9.templates.default.tar.gz
Download complete. Extracting files from java-spring-boot2.tar.gz
Setting up the development environment
Running command: docker[pull kabanero/java-spring-boot2:0.3]
Running command: docker[run --rm --entrypoint /bin/bash kabanero/java-spring-boot2:0.3 -c find /project -type f -name .appsody-init.sh]
Extracting project from development environment
Running command: docker[create --name my-project-extract -v /home/username/projects/simple-spring-boot2/.:/project/user-app -v /home/username/.m2/repository:/mvn/repository kabanero/java-spring-boot2:0.3]
Running command: docker[cp my-project-extract:/project /home/username/.appsody/extract/simple-spring-boot2]
Running command: docker[rm my-project-extract -f]
Project extracted to /home/username/projects/simple-spring-boot2/.appsody_init
Running command: ./.appsody-init.sh[]
Successfully initialized Appsody project
```

Your project is now initialized.

<!--
// =================================================================================================
// Understanding the project layout
// =================================================================================================
-->

### Understanding the project layout

For context, the following image displays the structure of the project that you’re working on:

![Project structure](/img/guide/collection-springboot2-spring-files.png)

This project contains the following artifacts:

- `pom.xml`, the project build file
- `LivenessEndpoint.java`, an example Liveness Endpoint
- `Main.java`, a Spring Application class
- `application.properties`, containing some configuration options for Spring
- `index.html`, a static file
- `MainTests.java`, a simple test class

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

The CLI launches a local Docker image that contains an Apache Tomcat server that hosts the microservice. After some time, you see a message similar to the following example:

```shell
[Container] 2019-09-12 17:28:44.066  INFO 171 --- [  restartedMain] o.s.b.a.e.web.EndpointLinksResolver      : Exposing 4 endpoint(s) beneath base path '/actuator'
[Container] 2019-09-12 17:28:44.205  INFO 171 --- [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
[Container] 2019-09-12 17:28:44.209  INFO 171 --- [  restartedMain] application.Main                         : Started Main in 6.051 seconds (JVM running for 6.923)
```

This message indicates that the Tomcat server is started. Browse to `http://localhost:8080` and you can see the splash screen.

![Browser showing splash screen](/img/guide/collection-springboot2-splashscreen.png)

You are now ready to begin developing your application.

<!--
// =================================================================================================
// Creating and updating the application
// =================================================================================================
-->

## Creating and updating the application

In this example, you will create a new REST endpoint and add it to the application.

Create an `ExampleEndpoint.java` class in the `src/main/java/application` directory. Open the file, add the following code, and save it:

```java
package application;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExampleEndpoint {

    @RequestMapping("/example")
    public String example() {
        return "This is an example";
    }
}
```

After you save, the source compiles and the application updates. You see messages similar to the following example:

```shell
[Container] Running: /project/java-spring-boot2-build.sh recompile
[Container] Compile project in the foreground
[Container] > mvn compile
[Container] [INFO] Scanning for projects...
[Container] [INFO]
[Container] [INFO] ----------------------< dev.appsody:application >-----------------------
[Container] [INFO] Building application 0.0.1-SNAPSHOT
[Container] [INFO] --------------------------------[ jar ]---------------------------------
[Container] [INFO]
[Container] [INFO] --- maven-resources-plugin:3.1.0:resources (default-resources) @ application ---
[Container] [INFO] Using 'UTF-8' encoding to copy filtered resources.
[Container] [INFO] Copying 2 resources
[Container] [INFO]
[Container] [INFO] --- maven-compiler-plugin:3.8.1:compile (default-compile) @ application ---
[Container] [INFO] Changes detected - recompiling the module!
[Container] [INFO] Compiling 3 source files to /project/user-app/target/classes
[Container] [INFO]
[Container] [INFO] --- maven-antrun-plugin:1.1:run (trigger-spring-restart) @ application ---
[Container] [INFO] Executing tasks
[Container]      [echo] Triggering Spring app restart.
[Container] [INFO] Executed tasks
[Container] [INFO] ------------------------------------------------------------------------
[Container] [INFO] BUILD SUCCESS
[Container] [INFO] ------------------------------------------------------------------------
[Container] [INFO] Total time:  3.585 s
[Container] [INFO] Finished at: 2019-09-12T17:34:37Z
[Container] [INFO] ------------------------------------------------------------------------
[Container] 2019-09-12 17:34:38.316  INFO 171 --- [      Thread-15] o.s.s.concurrent.ThreadPoolTaskExecutor  : Shutting down ExecutorService 'applicationTaskExecutor'
[Container]
[Container]   .   ____          _            __ _ _
[Container]  /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
[Container] ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
[Container]  \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
[Container]   '  |____| .__|_| |_|_| |_\__, | / / / /
[Container]  =========|_|==============|___/=/_/_/_/
[Container]  :: Spring Boot ::        (v2.1.6.RELEASE)
...
[Container] 2019-09-12 17:34:39.711  INFO 171 --- [  restartedMain] o.s.b.a.e.web.EndpointLinksResolver      : Exposing 4 endpoint(s) beneath base path '/actuator'
[Container] 2019-09-12 17:34:39.772  INFO 171 --- [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
[Container] 2019-09-12 17:34:39.773  INFO 171 --- [  restartedMain] application.Main                         : Started Main in 1.403 seconds (JVM running for 362.487)
[Container] 2019-09-12 17:34:39.788  INFO 171 --- [  restartedMain] .ConditionEvaluationDeltaLoggingListener : Condition evaluation unchanged
```

If you browse to the `http://localhost:8080/example` URL, the endpoint response is displayed, as shown in the following image:

![Browser showing example endpoint](/img/guide/collection-springboot2-example.png[)

Try changing the message in the `ExampleEndpoint.java` file, then save and refresh the page. You'll see that it takes only a few seconds for the change to take effect.

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

After you finish writing your application code, the CLI makes it easy to deploy directly to a Kubernetes cluster for further local testing. The ability to deploy directly to a Kubernetes cluster is valuable when you want to test multiple microservices together or test with services that the application requires.

Ensure that your `kubectl` command is configured with cluster details and run the following command to deploy the application:

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

In the following example output, you can see that a `simple-spring-boot2` pod is running:

```shell
NAME                                   READY   STATUS    RESTARTS   AGE
appsody-operator-859b97bb98-xm8nl      1/1     Running   1          8d
simple-spring-boot2-77d6868765-bhd8x   1/1     Running   0          3m21s
```

After the `simple-spring-boot2` pod starts, go to the URL that was returned when you ran the `appsody deploy` command, and you see the splash screen. To see the response from your application, point your browser to the `<URL_STRING>/example` URL, where `<URL_STRING>` is the URL that was returned. For example, `http://localhost:30262` was returned in the previous example. Go to the `http://localhost:30262/example` URL to see the deployed application response.

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
