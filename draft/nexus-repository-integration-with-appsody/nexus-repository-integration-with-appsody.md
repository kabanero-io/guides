---
permalink: /guides/nexus-repository-integration-with-appsody/
layout: guide-markdown
title: Nexus Repository integration
duration: 40 minutes
releasedate: 2020-02-21
description: Learn how to use Nexus Repository in Codewind
tags: ['Codewind', 'Java', 'Nodejs']
guide-category: manage
---
<!-- # Nexus Repository Integration -->
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
-->
## What you will learn


Nexus Repository is a popular repository manager that provides a single source of truth for all of the software components used by the applications in an enterprise. It provides a single access and control point for Maven (for Java&trade;), Node Package Manager (NPM) (for Node.js), and other software dependencies. It can also be used to manage or govern dependencies, or reduce the build dependencies on multiple external repositories and internet access.

With an application stack, the owner of each stack can provide a default repository manager, force the use of a specific repository manager instance, or block the use of a repository manager. The current Java Microprofile and Node.js Express stacks restrict repository access, so if you want to use Nexus Repository you'll need to create your own stack. You can start by copying and customizing an existing stack rather than starting from scratch.

The remainder of this guide walks you through the steps required to configure a Nexus Repository for both a Java and Node.js stack. If you are not familiar with customizing stacks, read the [Working with stacks](https://kabanero.io/guides/working-with-stacks) guide that provides some background and takes you through the required steps. If you're already familiar with customizing stacks and have your own, you might want to skip some of the process steps and focus just on the Nexus Repository configuration. Following these steps creates an application stack that uses Nexus Repository management for both development and build time of your applications.

## Integration with Maven

Creating an application stack that pulls from a Maven proxy requires a number of prerequisite tasks. The following tasks must be completed:

- Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Install [Nexus Repository Manager 3](https://help.sonatype.com/repomanager3/installation)
- Set up a [Maven proxy on Nexus Repository Manager 3](https://help.sonatype.com/repomanager3/formats/maven-repositories)
- Install [Appsody](https://appsody.dev/docs/getting-started/installation)
- Install [Codewind](https://www.eclipse.org/codewind/gettingstarted.html) on either VS Code or Eclipse
- Install [Docker](https://docs.docker.com/install/)
- Install [Maven](https://maven.apache.org/install.html)
   - The `settings.xml` file contains server credentials that are passed to various Maven calls. However, on the final application stack image, when processing is complete, the `settings.xml` file is removed to ensure that the credentials are not shared outside of development.
- Download and extract the files in [`code.zip`](code/code.zip). This archive contains examples that are referenced in this guide. The example for Maven integration can be found in the `code/my-java-microprofile` directory.


### Maven example


In this example, the following assumptions are made:

- The IP address of your Nexus Repository Manager is `http://9.108.127.66:8081` and your Maven public proxy URL is `http://9.108.127.66:8081/repository/maven-public/`. Do not use `localhost` because some Maven commands are run in a Docker container and `localhost` does not resolve correctly.
- Your Nexus Repository Manager is using the default credentials with the user name `admin` and password `admin123`.
- You are creating a Maven project based on the `java-microprofile` stack.

The complete example can be found in the `code.zip` file that you downloaded earlier. See the `/code/my-java-microprofile` directory and `stack.yaml` configuration file.


### Process for Maven integration


Follow these steps:

1. Create a new Application Stack by running `appsody stack create my-java-microprofile --copy incubator/java-microprofile` on your operating system terminal.

1. Ensure that the `settings.xml` file is in your Maven home directory, for example `~/.m2`. You can find an example `settings.xml` file in the `code/my-java-microprofile/image/project/` directory.

1. Go to the generated `my-java-microprofile` directory.

1. For every `pom.xml`, add the Maven proxy as a `<repository>`. You must update three files, which are provided as examples in the guide repository: `code/my-java-microprofile/image/project/pom.xml`, `code/my-java-microprofile/image/project/pom-dev.xml`, and `code/my-java-microprofile/image/templates/default/pom.xml`.

1. For any mention of `mvn` or `mvnw`, the `settings.xml` must be passed in to ensure that the correct `settings.xml` configuration is used. 
**Note:** Because the `.appsody-init.bat` and `.appsody-init-sh` scripts call from your operating system, `~/.m2/settings.xml` is referenced, not `/.m2/settings.xml`. See the following example files for all the changes:
- `code/my-java-microprofile/image/project/.appsody-init.bat`
- `code/my-java-microprofile/image/project/.appsody-init.sh`
- `code/my-java-microprofile/image/project/Dockerfile`
- `code/my-java-microprofile/image/project/install-dev-deps.sh`
- `code/my-java-microprofile/image/project/validate.sh`
- `code/my-java-microprofile/image/Dockerfile-stack`
     - `io.takari:maven:wrapper` is changed to `io.takari:maven:0.6.1:wrapper` due to an authentication issue with the latest wrapper ([takari/maven-wrapper/issues/142](https://github.com/takari/maven-wrapper/issues/142))

1. Go to the root directory of your stack and run `appsody stack package`.  For the purpose of this example, the stacks are published to `dev.local` on your local filesystem and the images are not pushed to Docker hub. To push to Docker hub, see [Publishing Stacks](https://appsody.dev/docs/stacks/publish)in the Appsody documentation.

1. The development environment command line produces log files. Make sure you look only at the proxy you are using and not the official Maven repository (https://repo1.maven.org/maven2). For example, you want to see logs similar to `[Docker] [INFO] Downloading from nexus: http://9.108.127.66:8081/repository/maven-public/org/apache/maven/maven-model/3.2.3/maven-model-3.2.3.jar`.

1. Run `appsody stack add-to-repo sghung --release-url https://github.com/sghung/appsodystacks/releases/latest/download/` in your Appsody stack root directory. Replace the repository with your own GitHub repository:

1. Go to `~/.appsody/stacks/dev.local`, which is the default Appsody location for generated files. The important files are:
    - `my-java-microprofile.v0.2.21.templates.default.tar.gz`
    - `sghung-index.yaml`

1. For Codewind to pick up the stacks, a `sghung-index.json` file must be generated. The format of the JSON format is of the form: `code/sghung-index.json`
    - Copy your `displayName` and description from `sghung-index.yaml`.
    - Update the language to Java.
    - Configure the location where you plan to upload the stack on GitHub.
    - Leave the link in place, which is required by Codewind but not used.

1. Upload your files as a release onto GitHub. For example: `https://github.com/sghung/appsodystacks/releases/tag/0.1.0`

1. Open Codewind and go to **Manage Template Sources**.

1. Add your JSON file. For example: `https://github.com/sghung/appsodystacks/releases/download/0.1.0/sghung-index.json`

1. Create a new Codewind project and select your repository and the `my-java-microprofile` stack.

1. Choose a directory to install the files into.

1. Check the project logs to ensure that files are downloading from your Maven proxy.

The application is now running and can be used for development.


## Integration with NPM

Creating an application stack that pulls from an NPM proxy requires a number of prerequisite tasks. The following tasks must be completed:

- Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Install [Nexus Repository Manager 3](https://help.sonatype.com/repomanager3/installation)
- Set up an [NPM proxy on Nexus Repository Manager 3](https://help.sonatype.com/repomanager3/formats/npm-registry)
- Install [Appsody](https://appsody.dev/docs/getting-started/installation)
- Install [Codewind](https://www.eclipse.org/codewind/gettingstarted.html) on either VS Code or Eclipse
- Install [Docker](https://docs.docker.com/install/)
- Install [npm](https://www.npmjs.com/get-npm)
- Download and extract the files in [`code.zip`](code/code.zip). This archive contains examples that are referenced in this guide. The example used for NPM integration can be found in the `code/my-nodejs-express` directory.


### NPM example


In this example, the following assumptions are made:

- The IP address of your Nexus Repository Manager is `http://9.108.127.66:8081` and your NPM public proxy URL is `http://9.108.127.66:8081/repository/npm-all/`. Do not use `localhost` as some Maven commands are run in a Docker container and `localhost` will not resolve correctly.
- Your Nexus Repository Manager is using the default credentials with user name `admin` and password `admin123`
- You are creating a project based on the `nodejs-express` application stack.

The complete example can be found in the cloned repository under `code/my-nodejs-express`. For the NPM proxy, the logs do not show output from the NPM proxy. Instead, browse the NPN proxy to ensure that it is being populated. The `sampleCredentials` file included in this example should not be checked into a repository. This file is an example for this guide to show the format.


### Process for NPM integration


Follow these steps:

1. Create a new application stack by running `appsody stack create my-nodejs-express --copy incubator/nodejs-express` on your operating system terminal.

1. By following the NPM proxy prerequisites, you already have encrypted authentication set up. For the default password of `admin123`, the value is `_auth=YWRtaW46YWRtaW4xMjM=`. Create a credentials file in `image/project` and add the server credentials for the registry. An example of the final file is `code/my-nodejs-express/image/project/sampleCredentials`. Do not check your credentials file into your repository to avoid the credentials being stored inappropriately.

1. Search for and remove all instances of "npm audit" to avoid [NEXUS-16954 issue](https://issues.sonatype.org/browse/NEXUS-16954).

1. Modify the `Dockerfile-stack` and `Dockerfile` to use `.npmrc` before calling any `npm install` commands.
- `code/my-nodejs-express/image/Dockerfile-stack`
- `code/my-nodejs-express/image/project/Dockerfile`
- In these files, `.npmrc` is removed after `npm install` to avoid the credentials showing in the Docker image.

1. Go to the root directory of your stack and run `appsody stack package`.  For the purpose of this example, the stacks are published to `dev.local` on your local filesystem and the images are not pushed to Docker hub. To push to Docker hub, see [Publishing Stacks](https://appsody.dev/docs/stacks/publish)in the Appsody documentation.

1. Run `appsody stack add-to-repo sghung2 --release-url https://github.com/sghung/appsodystacks/releases/latest/download/` in your Appsody stack root directory. Replace the repository with your own GitHub repository.

1. Upload your files as a release to GitHub. For example: `https://github.com/sghung/appsodystacks/releases/tag/0.1.1`

1. Open Codewind and go to **Manage Template Sources**.

1. Add your JSON file. For example: `https://github.com/sghung/appsodystacks/releases/download/0.1.1/sghung2-index.json`

1. Create a new Codewind project and select your repository and the `my-nodejs-express` stack.

1. Choose the directory to install the files into.

1. The application developer must put the `.npmrc` file into the root directory of the project. It should not be packaged with the stack  template or checked into the repository. For security in an  organisation, the stack owner must inform the application developer that credentials are needed and securely share the credentials. The contents of the `.npmrc` file are the same as `code/my-nodejs-express/image/project/sampleCredentials`

The application is now running and can be used for development.
