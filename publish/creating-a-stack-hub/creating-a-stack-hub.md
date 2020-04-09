---
permalink: /guides/creating-a-stack-hub/
layout: guide-markdown
title: Creating a stack hub
duration: 20 minutes
releasedate: 2020-03-23
description: How to create and configure an application stack hub
tags: ['Stack']
guide-category: basic
---

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

## What you'll learn

In this guide you will learn how to configure and build a stack hub that defines the application stacks that you want to use to develop containerized applications in your organization.

## Getting started

A stack hub is the central control point for application stacks that you want to use in your organization. These stacks might
be clones of public stacks or they might be customized to meet local requirements. For example, you might want to include
templates with unique starter applications, specify a different test framework, or ensure that your applications are developed on specific software levels.

Before building a stack hub you should identify the stacks that you want to use for developing your microservice applications. Clone the available stacks and make any modifications that are needed. How to customize, package, and publish stacks is covered in the [Customizing applications stacks](../working-with-stacks/) guide.

In this guide we will cover how to build a stack hub that consolidates multiple application stacks for use in your organization and how to use the assets in your deployment environment.

### Prerequisites

The following prerequisites apply to your local system:

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) must be installed
- [Docker](https://docs.docker.com/install/) must be installed
- To build assets for Codewind, [Python 3](https://www.python.org/downloads/) must be installed

## Constructing a stack hub

Stack hubs are created from a configuration file. For a suitable starting point, clone the following repository, which contains example files:

```
git clone https://github.com/kabanero-io/kabanero-stack-hub.git
```
In this repository, you can find the following key files:

- `config/default_kabanero_config.yaml`: the public stack hub configuration
- `example_config/example_repo_config.yaml`: an example configuration that shows how to define multiple repositories and application stacks
- `scripts/hub_build.sh`: a script to build stack hub index files


### Understanding the configuration format

The format of the configuration file is shown in the following example:

```
# Template for repo-tools configuration
name: <Repository name>
description: <Repository description>
version: <Repository version>
stacks:
  - name: <Repository index name>
    repos:
      - url: <Reference to index file>
      exclude:
          - <stack name>
      include:
          - <stack name>
image-org: <Organization containing images within registry>
image-registry: <Image registry hosting images>
nginx-image-name: <Image name for the generated nginx image, defaults to repo-index>
```


The options shown in the configuration file are described in the following list:

- `name:` An identifier for this particular configuration.
- `description:` A unique description for your configuration.
- `version:` A version number, which might align with a release. For example, a Git release of your stack hub.
- `stacks:`
    - `name:` The name of a repository to build, which might contain one or more application stacks.
    - `repos:` An array of URLs that point to one or more stack index files that you want to include in this repository
        - `url:` `exclude:` (Optional) An array of stack names that you want to exclude from the repository. If no filtering is required, leave blank.
        - `url:` `include:` (Optional) An array of stack names that you want to include from the repository. If no filtering is required, leave blank.
- `image-org:` (Optional) The name of the organization within the image registry where you want to store the docker images for included stacks. See **Configuring public or private repositories**.
- `image-registry:` (Optional) The URL of the image registry where you want to store the stack docker images. See **Configuring public or private repositories**.
- `nginx-image-name:` (Optional) The name assigned to the generated NGINX image. The default is `repo-index`. See **Configuring public or private repositories**.

NOTE: The `exclude:` and `include:` fields are mutually exclusive. Use only one or the other for a specific repository to avoid build errors.

**Configuring public or private repositories**

If your stacks and repositories are publicly available, leave the `image-org` and `image-registry` fields blank.

If your stacks and repositories are hosted in a private environment that your deployment environment and tools cannot access, such as GitHub Enterprise, the build can create an NGINX image. This image can serve all the resources that are needed for each stack  (including the index file) within your deployment environment without the need for authentication. Use the `image-org` and `image-registry` fields to define the organization and URL where you store your registry images. You can optionally configure a name for your NGINX image, which you must push to the registry that your deployment environment can access. When deployed, the NGINX image serves the repository index files that you create as part of the build.

### Configuring your stack hub

In this guide, you will change the example configuration file and use it build a stack hub definition. Follow these steps:

1. Edit the `example_config/example_repo_config.yaml` file to include the following values for your stack hub:

    ```
    # File: example_repo_config.yaml
    # My organization stack hub
    name: My.org Stack Hub
    description: Test configuration to build 2 index files for the default and incubator repos.
    version: 0.1.0
    stacks:
      - name: default
        repos:
          - url: https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
            exclude:
              - kitura
              - node-red
              - python-flask
              - starter
              - swift
              - java-microprofile
              - nodejs
          - url: https://github.com/kabanero-io/collections/releases/download/0.6.0/kabanero-index.yaml
            include:
              - java-microprofile
    image-org:
    image-registry:
    nginx-image-name:
    ```

    This example configuration file builds a single stack hub index file for your `default` hub. The `default` hub points to two index files, `https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml` and `https://github.com/kabanero-io/collections/releases/download/0.6.0/kabanero-index.yaml`. The `include:` and `exclude:` options are used
    to filter from the available application stacks.

2. Save your changes.

You can create as many hub index files as you need from a single configuration file by following the format in the `example_config/example_repo_config.yaml` file. For example, you might want to create an index file for your production environment with one set of application stacks and one for your development or test environments where you are building apps on different underlying software levels.

### Building stack hub assets

Build your stack hub assets from the example configuration file by running the following command:

```
./scripts/hub_build.sh example_config/example_repo_config.yaml
```

The output from the command shows how information is fetched from each index file, which the build process consolidates into a single file. Here is some sample output:

```
Config file: example_config/example_repo_config.yaml
 == Running pre_build.d scripts
 ==== Running prereq_check.sh
 == Done pre_build.d scripts
Not retrieving or modifying any assets
Creating consolidated index for default
== fetching https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
== Adding stacks from index https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
==== Adding stack nodejs-loopback 0.2.2
==== Excluding stack swift 0.2.5
==== Excluding stack node-red 0.1.1
==== Excluding stack python-flask 0.2.2
==== Excluding stack starter 0.1.2
==== Excluding stack java-microprofile 0.2.24
==== Adding stack java-spring-boot2 0.3.26
==== Excluding stack kitura 0.2.5
==== Adding stack java-openliberty 0.2.2
==== Excluding stack nodejs 0.3.4
==== Adding stack nodejs-express 0.4.3
== fetching https://github.com/kabanero-io/collections/releases/download/0.6.0/kabanero-index.yaml
== Adding stacks from index https://github.com/kabanero-io/collections/releases/download/0.6.0/kabanero-index.yaml
==== Adding stack java-microprofile 0.2.25
==== Excluding stack java-openliberty 0.2.1
==== Excluding stack java-spring-boot2 0.3.23
==== Excluding stack nodejs-express 0.2.8
==== Excluding stack nodejs-loopback 0.1.8
==== Excluding stack nodejs 0.3.1
 == Running post_build.d scripts
 ==== Running build_nginx.sh
 == Done post_build.d scripts
 ```

 Switch to the `assets` directory that is generated by the build to find the stack hub index file in two formats, `default-index.yaml` and `default-index.json`. The JSON file format is required if you are developing applications by using Codewind.

 Open the `default-index.yaml` file to view the consolidated information for each stack in your configuration. For example, the last stack in the list is `nodejs-express`:

 ```
 - default-template: simple
  description: Express web framework for Node.js
  id: nodejs-express
  image: docker.io/appsody/nodejs-express:0.4.3
  language: nodejs
  license: Apache-2.0
  maintainers:
  - email: vieuxtech@gmail.com
    github-id: sam-github
    name: Sam Roberts
  name: Node.js Express
  requirements:
    appsody-version: '>= 0.2.7'
    docker-version: '>= 17.09.0'
  src: https://github.com/appsody/stacks/releases/download/nodejs-express-v0.4.3/incubator.nodejs-express.v0.4.3.source.tar.gz
  templates:
  - id: simple
    url: https://github.com/appsody/stacks/releases/download/nodejs-express-v0.4.3/incubator.nodejs-express.v0.4.3.templates.simple.tar.gz
  - id: scaffold
    url: https://github.com/appsody/stacks/releases/download/nodejs-express-v0.4.3/incubator.nodejs-express.v0.4.3.templates.scaffold.tar.gz
  version: 0.4.3
  ```

Congratulations! You have built your first stack hub index file that defines a set of filtered application stacks from multiple source repositories. This index file should be hosted somewhere that is accessible to developers, such as a GitHub repository. Typically, you would create a release for a final version of the index file, and reference the index file from a URL that is similar to `https://github.com/myorg/my-org-repository/releases/latest/download/default-index.yaml`.


## Configuring your Kubernetes environment

Your deployment environment also needs to know about the application stacks that should be used to build deployment containers. You must update your Kabanero operator custom resource definition (CRD) file to reference your stack hub index file.


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

Applications that are developed using the stacks defined in your stack hub can now be deployed to your Kubernetes cluster.
