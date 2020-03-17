---
permalink: /guides/use-appsody-cli/
layout: guide-markdown
title: Developing microservice applications with the CLI
duration: 20 minutes
releasedate: 2019-12-03
description: Learn about the common CLI commands that you'll use to develop applications
tags: ['CLI']
guide-category: basic
---

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
-->

## What you’ll learn

You will learn how to use the Command Line Interface (CLI) to configure your local development environment to access customized  application stacks. You will then learn how to use the CLI to create, run, test, and debug an application built from an application stack. Finally, you will learn how to build a deployment image that is ready to run in a Kubernetes or serverless environment.

## Prerequisites

- [Docker](https://docs.docker.com/install/) must be installed.
- [Appsody](https://appsody.dev/docs/getting-started/installation) must be installed.

## Getting started

Application stacks enable applications to be built and tested inside a container. When built, the container can be deployed into a Kubernetes or serverless environment.

When you install Appsody, the default configuration references the public open source repositories, which contain all the available application stacks from the Appsody project. Although you can use the content in a public repository, an organization typically
customizes a subset of these application stacks to suit their own requirements. To develop microservice applications from customized application stacks, you must modify your local configuration to point to these stacks before creating a project.

## Discovering repositories and stacks

**CLI command:** `appsody repo list`

To view the current repositories that you have access to, run the `appsody repo list` command. The asterisk shown in the output indicates the default repository.

```
NAME            URL
*incubator      https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
experimental    https://github.com/appsody/stacks/releases/latest/download/experimental-index.yaml
```

By default, your local development environment can access the `incubator` and `experimental` public repositories.

### Adding a customized application stack repository

**CLI command:** `appsody repo add <repo-name> <URL>`

As a developer, your enterprise architect might provide you with a URL that points to a set of customized application stacks for your organization. This configuration is defined by an `index.yaml` file.

To add this configuration information to your local development environment, use the `appsody repo add <repo-name> <URL>` command, supplying a name for the repository and the URL that contains the `index.yaml` file.

In this example, you will add a new repository `acme-stacks` that has a stack configuration URL https://github.com/acme.inc/stacks/index.yaml.

- Run the following command:

```
appsody repo add acme-stacks https://github.com/acme.inc/stacks/index.yaml
```

- Check that the repository changes are added successfully by running the `appsody repo list` command
again. The output should be similar to the following example:

```
NAME          URL
*incubator    https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
experimental  https://github.com/appsody/stacks/releases/latest/download/experimental-index.yaml
acme-stacks    https://github.com/acme.inc/stacks/index.yaml
```

### Setting your default repository

**CLI command:** `appsody repo set-default <repo-name>`

You can change the default repository by using the `appsody repo set-default <repo-name>` command.

- Set `acme-stacks` as your default repository by running the following command:

```
appsody repo set-default acme-stacks
```

- Run `appsody repo list` again to check that `acme-stacks` is now the default repository:

```
NAME            URL
*acme-stacks     https://github.com/acme.inc/stacks/index.yaml
incubator       https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
experimental    https://github.com/appsody/stacks/releases/latest/download/experimental-index.yaml
```

The asterisk indicates that `acme-stacks` is now the default repository.

### Viewing the available stacks

**CLI command:** `appsody list <repo-name>`

Now that you have set up your repository you can view the available application stacks with the `appsody list` command. To limit the output to only one repository, specify the repository name. Run the following command to limit the list of available stacks to the `acme-stacks` repository:

- Run the appsody list command:

```
appsody list acme-stacks
```

The output is similar to the following example, which provides detailed information for each stack:

```
REPO             ID                       VERSION    TEMPLATES           DESCRIPTION
acme-stacks      java-microprofile        0.2.11     *default            Eclipse MicroProfile on Open Liberty & OpenJ9 using Maven
acme-stacks      java-spring-boot2        0.3.9      *default, kotlin    Spring Boot using OpenJ9 and Maven
acme-stacks      nodejs                   0.2.5      *simple             Runtime for Node.js applications
acme-stacks      nodejs-express           0.2.5      *simple, scaffold   Express web framework for Node.js
acme-stacks      nodejs-loopback          0.1.4      *scaffold           LoopBack 4 API Framework for Node.js
```

In the output you can see multiple application stacks (IDs) in the `acme-stacks` repository. Each stack includes a version number, one or more templates (an asterisk (\*) indicates the default template), and a description.

## Developing an application

**CLI command:** `appsody init <repo-name>/<stack> <template>`

When you initialize a project by using the CLI, a containerized development environment is created with a sample application that runs with the technology stack of your choice.

- Before you create a project, create a directory for it:

```
mkdir my-project
cd my-project
```

- Then, run the `appsody init` command to set up your project, which downloads the template for your chosen stack. Because you already set `acme-stacks` as your default repository in the last section, run the following command to create a `nodejs-express` project with the default (`simple`) template:

```
appsody init nodejs-express
```

When the initialization completes you should see the following output:

```
...
Successfully initialized Appsody project
```

## Running an application

**CLI command:** `appsody run`

This command runs a project in a container, where the container is linked to the project source code on the local system. In the previous step, you initialized the `nodejs-express` stack, which created a project directory that contains a sample `app.js` application.

- Run the application now by typing the `appsody run` command.

- Navigate to `http://localhost:3000` to see the output.
    **NOTE**: The URL can be different, depending on the stack, so consult the documentation.

- Edit `app.js` so that it outputs something other than `Hello from Appsody!`. When you save the file, the change is detected and the container is automatically updated.

- Refresh `http://localhost:3000` to see the new message.

### Checking the status of your running container

**CLI command:** `appsody ps`

To list all the stack-based containers that are running in your local environment, use the `appsody ps` command. The output provides information about the container ID, name, image, and the status of each container.

- Run the `appsody ps` command to see output that is similar to the following example:

```
CONTAINER ID	NAME            IMAGE                       	STATUS
f20ec098a612	my-project-dev	acme-stacks/nodejs-express:0.2	Up 8 minutes
```

### Stopping your Appsody container

**CLI command:** `appsody stop --name <container-name>`

To stop a container you can either press `Ctrl-C` in the terminal or use the `appsody stop` command.

If you have more than one development project open, use the `appsody stop --name <container-name>` to stop a specific container. Use the `appsody ps` command to find the name of the container you want to stop.

## Testing your application

**CLI command:** `appsody test`

The `appsody test` command runs the test suite for your application in the development container. Each application stack provides a set of generic tests, which verify that the capabilities provided by the stack are working as expected. Typically, these tests check that the endpoints that are created, such as `/metrics` and `/health`, are available. In addition, you can define further tests for your application in your project `/test` folder.

In earlier sections of this guide you created a `nodejs-express` project with the default (`simple`) template, which provides a sample test as a starting point. Take a look at the sample test in the `my-project/test/test.js` file. You can update this file to suit your test requirements.

Now try running the `appsody test` command for your project. The results from the test suite are included in the output.

The testing uses constructs that are familiar to the programming language or framework on which the stack is based. You can add your own tests or switch to your preferred testing framework. Node.js application stacks use the [Mocha](https://mochajs.org/) test framework as default. If you want to use a different test framework, update the `npm test` command in your project `package.json` file.

To stop the container that is running the tests, you can quit by pressing Ctrl-C or running `appsody stop` in the terminal.

## Debugging your application

**CLI command:** `appsody debug`

The `appsody debug` command starts the development container with a debugger enabled. Typically, your IDE can connect to the debug port used by an application stack. You can then set breakpoints and step through your code as it runs in the container.

- Run the `appsody debug` command. The output shows the exposed debug port. For the `nodejs-express` stack, the debug port is 9229, by default. The debug port varies, depending on your application stack, so check the documentation.

- To stop the container running in debug mode, you can quit by pressing Ctrl-C or running `appsody stop` in the terminal.

## Building your application for deployment

**CLI command:** `appsody build`

The `appsody build` command generates an image for deployment. This image differs slightly from the development image that is generated by the CLI for running, testing, and debugging your application.

- Run the `appsody build` command. This command completes the following two actions:

    - Extracts your code and other artifacts, including a new `Dockerfile`, which are required to build the deployment image from the development image. These files are saved to the `~/.appsody/extract` directory.

    - Runs a build against the `Dockerfile` that was extracted in the previous step to produce a deployment image in your local container registry. If you want to give your image a name, specify the `-t <tag>` parameter, for example `appsody build -t my-own-project`. If you run `appsody build` with no parameters, the image is given the same name as your project.

- Now create a deployment image called **my-first-app** for your application by running the following command:

```
appsody build -t my-first-app
```

**NOTE:** If your project name includes uppercase characters, these are converted to lowercase characters in the image name because uppercase characters are not accepted in image tags. Also, if your project directory includes underscore characters, these are converted to dashes (-), because certain areas of Kubernetes are not tolerant of underscore characters.

When the build finishes, check that your image is available by running the `docker images` command. You should see your image at the beginning of the list, in a similar format to the following output:

```
REPOSITORY                                                                TAG                           IMAGE ID            CREATED             SIZE
my-first-app                                                              latest                        1a957433be51        4 seconds ago       945MB
...
```

Your deployment image can now be used to run your containerized application in a Kubernetes or serverless environment.
