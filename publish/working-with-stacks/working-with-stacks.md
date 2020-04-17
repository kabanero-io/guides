---
permalink: /guides/working-with-stacks/
layout: guide-markdown
title: Customizing application stacks
duration: 40 minutes
releasedate: 2020-02-06
description: Learn how to create, update, build, test, and publish application stacks
tags: ['stack', 'Node.js']
guide-category: basic
---


<!-- Note:
> This repository contains the guide documentation source. To view
> the guide in published form, view it on the [website](https://kabanero.io/guides/{projectid}.html).
-->

<!--
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
-->

## What you'll learn

In this guide you will learn how to create a new application stack for use in your organization. Then you'll learn how to customize it and publish it to a
GitHub repository for developers to use in their local development environment. Finally you'll learn how to configure your Kubernetes custom resource definition (CRD) to initialize and deploy the containerized applications that are developed.  

## Prerequisites

- [Docker](https://docs.docker.com/get-started/) must be installed.
- [Appsody](https://appsody.dev/docs/getting-started/installation) must be installed.
- (Optional) To deploy your customized stack, you must have access to the OpenShift Container Platform (OCP) v4.3 cluster.

## Getting started

Application stacks are stored in Git repositories. How you organize the applications stacks that you intend to use in your organization is entirely up to you and might depend on a number of local requirements. For example, using a different repository for each stack gives you the flexibility to apply version control at the individual stack level. The important part to understand is that each repository you create results in a unique configuration file that a developer might use for accessing any stacks that are stored there.  

In this guide we'll assume that you are interested in using an application stack for Javascript development with the Node.js Express framework. You've taken a look at the Node.js Express application stack, which you want to use as the basis for a local customized stack.

## Cloning an existing stack

To create an application stack based on Appsody `nodejs-express`, run the following command:

`appsody stack create my-nodejs-express-stack --copy incubator/nodejs-express`

Where `my-nodejs-express-stack` is the name you give your application stack.

A new `my-nodejs-express-stack` directory is created that is based on the originating stack, which contains the following key files and directories:

- `README.md`:
    Contains detailed information about the stack and the available templates. Use this file to record any unique aspects of your stack for users.
- `stack.yaml`:
    Contains the basic definition for the stack. Here you can uniquely identify your stack, configure the default template that is used when you initialize a project, or control the versions of software components that can be used with the stack, including the Appsody CLI.
- `image/config/app-deploy.yaml`:
    Contains configuration information that is used by an operator for deploying a project to Kubernetes or serverless.
- `image/project/Dockerfile-stack`:
    Creates a stack image that is used to generate a development container. You can modify environment variables in the `Dockerfile-stack` file that change the container environment for local development. For example, you can adjust the mount points for local application code, update the files or directories that are monitored for source code changes, and configure the caching of software dependencies. These dependencies are stored in volumes that can be mounted
    when a development container is restarted to reduce the startup time.
- `image/project/Dockerfile`:
    Creates the final image that is used to generate the deployment container.
- `image/project/package.json`:
    Contains the Node.js Express project build information, such as which NPM modules and dependencies are required.
- `image/project/server.js`:
    Contains the startup configuration for the Express server application.
- `templates/simple/`:
    Files in this folder comprise a simple starter Express application and a sample test.
- `templates/scaffold/`:
    Files in this folder comprise a more complex Express application with routes and views.

You can add or remove template directories to provide different starting points for developers.

In addition to updating the files in your stack directory, you can also set file permissions to prevent user making further changes to them.


## Updating a stack

Application stacks can be customized in many different ways. In this guide we will customize the `nodejs-express` stack to improve the security for Express applications by including the
[Helmet](https://www.npmjs.com/package/helmet) package. Helmet consists of a set of functions that set security-related HTTP response headers. The first step is to add the module to the
list of `"dependencies":` in the `image/project/package.json` file. In the following example, Helmet version 3.21.0 is defined as the minimum level to be installed as a part of the project.  

```
{
  "name": "nodejs-express",
  "version": "0.4.6",
  "description": "Node.js Express Stack",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/appsody/stacks.git",
    "directory": "incubator/nodejs-express/image/project"
  },
  "scripts": {
    "debug": "node --inspect=0.0.0.0 server.js",
    "start": "node server.js",
    "test": "mocha"
  },
  "dependencies": {
    "@cloudnative/health-connect": "^2.0.0",
    "appmetrics-prometheus": "~3.1.0",
    "express": "~4.17.1",
    "express-pino-logger": "^4.0.0",
    "pino": "^5.14.0",
    "helmet": "^3.21.0"
  },
  "devDependencies": {
    "appmetrics-dash": "^5.3.0",
    "chai": "^4.2.0",
    "mocha": "~6.1.0",
    "request": "^2.88.0"
  }
}
```

Update and save the changes to your `image/project/package.json` file.

Now that Helmet is defined as a dependency, you must update your `image/project/server.js` file to import the package and instruct the Express application to use it. Make the following changes:

1. Add `const helmet = require('helmet'); ` to the list of packages that are required.
2. Add the line `app.use(helmet());` to ensure that the package is used for HTTP header security.

Here are the first few lines of the `image/project/server.js` file to show the updates:

```
const express = require('express');
const helmet = require('helmet');
const health = require('@cloudnative/health-connect');
const metrics = require('appmetrics-prometheus')
const fs = require('fs');
const http = require('http');

const app = express();
app.use(helmet());
app.use('/metrics', metrics.endpoint());
const server = http.createServer(app)
```

Save your changes.

Now that you have customized this stack to work in the way you want it to, you should also update the `stack.yaml` file to uniquely identify your stack. In particular, you should consider versioning your
stack according to [Semantic versioning best practices](https://semver.org/). Adopting these best practices can simplify the governance of your stack artifacts in your deployment environment. For more information, see [Governing stacks with semantic versioning](../../docs/ref/general/reference/semver-governance.html).

The following example shows an updated `stack.yaml`  file for Node.js  Express:  

```
name: My Node.js Express
version: 1.0.0
description: Express web framework for Node.js with Helmet
license: Apache-2.0
language: nodejs
maintainers:
  - name: My_name
    email: My_email
    github-id: My_Github_ID
default-template: simple
requirements:
  docker-version: ">= 17.09.0"
  appsody-version: ">= 0.2.7"
```

When you've configured a stack to suit your requirements, it must be packaged before it can be used for application development.

## Packaging a stack

From the `my-nodejs-express-stack` directory, run the following command:

```
appsody stack package
```

This command builds the image and creates archive files for any source code and templates that you've included. These are stored in a `.appsody/stacks/dev.local` directory and your stack is then added to the `dev.local` repository.

To view the stack in your repository, run:

```
appsody repo list
```

The output is similar to the following example:

```
NAME            URL
*incubator      https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
dev.local       file:///$HOME/.appsody/stacks/dev.local/dev.local-index.yaml
experimental    https://github.com/appsody/stacks/releases/latest/download/experimental-index.yaml
```

The asterisk (\*) indicates the default repository. To make `dev.local` your default, run:

```
appsody repo set-default dev.local
```

Now run the following command to check that the stack you packaged is showing in the repository:

```
appsody list dev.local
```

The output should be similar to the following example:

```
REPO     	ID                    	VERSION  	TEMPLATES        	DESCRIPTION                      
dev.local	my-nodejs-express-stack	0.4.6    	scaffold, *simple	Express web framework for Node.js
```


## Testing your stack

The first check is to validate your stack by running the following command:

```
appsody stack validate
```

The validation process steps through a number of test operations that check the structure of your application stack before packaging and initializing a project.
The project is then run and tested against any generic tests that are defined in the stack. Finally a production image is generated for deployment.
At the end of the validation process a summary is printed, similar to the  following example output:

```
@@@@@@@@@@@@@@@ Validate Summary Start @@@@@@@@@@@@@@@@
PASSED: Lint for stack:my-nodejs-express-stack
PASSED: Package for stack:my-nodejs-express-stack
PASSED: Init for stack:my-nodejs-express-stack template:simple
PASSED: Run for stack:my-nodejs-express-stack template:simple
PASSED: Test for stack:my-nodejs-express-stack template:simple
PASSED: Build for stack:my-nodejs-express-stack template:simple
PASSED: Init for stack:my-nodejs-express-stack template:scaffold
PASSED: Run for stack:my-nodejs-express-stack template:scaffold
PASSED: Test for stack:my-nodejs-express-stack template:scaffold
PASSED: Build for stack:my-nodejs-express-stack template:scaffold
Total PASSED: 10
Total FAILED: 0
@@@@@@@@@@@@@@@  Validate Summary End  @@@@@@@@@@@@@@@@
```


To test the changes that you made to the stack dependencies you can initialize a project based on your updated stack.

First create a directory for your new project and then initialize a new project from your updated stack. Run the commands shown in the following example:

```
mkdir my-nodejs-express-project
cd my-nodejs-express-project
appsody init my-nodejs-express-stack
```

Next, run your new project with the following command:

```
appsody run
```

The CLI launches a local Docker image that contains the Node.js Express runtime environment and starts your microservice app. You can check that the app is running by browsing to
http://localhost:3000 where you see the message "Hello from Appsody!".

To verify that Express is using Helmet to secure HTTP headers, run the following command from a different terminal window:

```
curl -v localhost:3000
```

In the response from the application you can see the `X-` security-related headers. The output looks similar to the following example:

```
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 3000 (#0)
> GET / HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.64.1
> Accept: */*
>
< HTTP/1.1 200 OK
< X-DNS-Prefetch-Control: off
< X-Frame-Options: SAMEORIGIN
< Strict-Transport-Security: max-age=15552000; includeSubDomains
< X-Download-Options: noopen
< X-Content-Type-Options: nosniff
< X-XSS-Protection: 1; mode=block
< X-Powered-By: Express
< Content-Type: text/html; charset=utf-8
< Content-Length: 19
< ETag: W/"13-0ErcqB22cNteJ3vXrBgUhlCj8os"
< Date: Wed, 15 Apr 2020 08:34:57 GMT
< Connection: keep-alive
<
* Connection #0 to host localhost left intact
Hello from Appsody!* Closing connection 0
```

Your stack changes to include the Helmet package were a success!

## Releasing your stack

Now that your stack is available in your local repository, the next step is to release your stack and make the artifacts available to other users. Follow these steps:

1. Push the stack container image to a registry, such as docker.io.
2. Upload the source code and archives from your `.appsody/stacks/dev.local` directory to a web hosting service, such as a GitHub repository. The example in this guides uses the repository `my-org-repository` in the `myorg` organization (https://github.com/myorg/my-org-repository).
3. Create a draft GitHub release for your stack, which places the source code and archives into a download folder. See [Creating releases](https://help.github.com/en/github/administering-a-repository/creating-releases).
4. From the top level directory of your stack, run the following command to add your stack to the `my-org-repository` repository, referencing the release URL:

    ```
    appsody stack add-to-repo my-org-repository --release-url https://github.com/myorg/my-org-repository/releases/latest/download/
    ```

    The output from this command is similar to the following example:

    ```
    ******************************************
    Running appsody stack add-to-repo
    ******************************************
    Creating repository index file: /Users/user1/.appsody/stacks/dev.local/my-org-repository-index.yaml
    Repository index file updated successfully
    ```

5. Upload the repository index file that is created in your `.appsody/stacks/dev.local` directory to your GitHub repository. Add it to your draft release and then publish the release.


Now that you have released your application stack you can share your URL for the index file with developers. Developers must configure their local development environment to access the stack in one of the following ways:

  - Developers who are using the CLI from the Appsody project can add it to their local repository list with the `appsody repo add` command. For more information, see [Developing microservice applications with the CLI](../use-appsody-cli/)
  - Developers who are using an IDE with the Eclipse Codewind extension can configure their template sources. For more information, see [Getting Started with Codewind and VSCode](../codewind-getting-started-vscode/) or [Getting Started with Codewind and Eclipse](../codewind-getting-started-eclipse/).

Developers can now create applications based on your customized stack in their local development environment. If you plan to make more than one  application stack available to developers, you might want to consider creating a stack hub. For more information, see [Creating a stack hub](../creating-a-stack-hub/).

## Configuring your Kubernetes environment

In order to deploy containerized applications that have been developed using your application stack, you must configure Kubernetes with information about the application stack and the deployment container that must be used. This configuration forms part of the Kabanero operator custom resource definition (CRD). The process is the same whether your URL defines a single application stack or a stack hub that contains multiple application stacks.

Follow these steps:

1. Obtain a copy of your current Kabanero CR instance configuration.

    To obtain a list of all Kabanero CR instances in the kabanero namespace, run the following command:

    ```
    oc get kabaneros -n kabanero
    ```

    To obtain the configuration for a specific CR instance, run the following command, substituting `<name>` for the instance you are targeting:

    ```
    oc get kabanero <name> -n kabanero -o yaml > kabanero.yaml
    ```

    This example assumes that you kept the default `<name>`, which is `kabanero`.

2. Edit the `kabanero.yaml` file that you generated in the last step.

    Update the following section, which shows the configuration for stack repositories:

    ```
    stacks:
      repositories:
      - name:
        https:
          url:
          skipCertVerification: [true|false]
      - name:
        https:
          url:
          skipCertVerification: [true|false]
    ```

    Where:

    - `repositories` lists the repositories to search for stacks
    - `name` is the name of your repository
    - `url` contains the URL string for the `index.yaml` file
    - `skipCertVerification` determines whether to verify the certificate before activating (default is `false`)

    To change the desired state for a repository after the instance is deployed, you must edit each resource manually.

    The following configuration can be used for the repository you created earlier:

    ```
    stacks:
      repositories:
      - name: my-org-repository
        https:
          url: https://github.com/myorg/my-org-repository/releases/latest/download/my-org-repository-index.yaml
    ```

3. Save the file.

4. Apply the changes to your Kabanero CR instance with the following command:

    ```
    oc apply -f kabanero.yaml -n kabanero
    ```

Applications that have been developed using your stack can now be deployed to your Kubernetes cluster.
