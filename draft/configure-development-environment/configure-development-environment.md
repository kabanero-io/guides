---
permalink: /guides/configure-development-environment/
layout: guide-markdown
title: Configuring your development environment
duration: 10 minutes
releasedate: 2020-02-04
description: How to configure your local development environment to use customized application stacks
tags: ['stack', 'CLI']
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
//
-->

<!--
NOTE: This repository contains the guide documentation source. To view
the guide in published form, view it on the https://kabanero.io/guides/{projectid}.html[website].
-->

<!--
// =================================================================================================
// What you'll learn
// =================================================================================================
-->

## What you will learn

Application stacks enable the development and optimization of microservice applications. With application stacks,
developers don’t need to manage the full software development stack or be experts on underlying container
technologies or Kubernetes. Stacks are available for a number of runtime environments and frameworks,
including Java (Open Liberty and Springboot) and Node.js (Express and Loopback).

Application stacks can be customized for specific enterprises to incorporate their company standards and technology choices. These
stacks can be created, stored, and referenced in a configuration file.

In this guide, you’ll learn how to configure your development environment to create microservice applications that are based
on your organizations application stacks. This guide assumes that you are using the CLI from Appsody in your local development
environment. If you are using Codewind to develop microservice applications that are based on application stacks,
you can find out how to configure Codewind to access customized stacks in <another guide>.

<!--
// =================================================================================================
// Prerequisites
// =================================================================================================
-->

## Prerequisites

- [Docker](https://docs.docker.com/get-started/) must be installed.
- [Appsody](https://appsody.dev/docs/getting-started/installation) must be installed.
- You must have a URL that points to your application stack `index.yaml` configuration file.

<!--
// =================================================================================================
// Configuring your development environment
// =================================================================================================
-->

## Configuring your development environment


To check the repositories that you can already access, run the following command:

```
appsody repo list
```

You see output similar to the following example:

```
NAME        URL
*incubator  https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
```

Next, run the following command to add the URL for your stack configuration file:

```
appsody repo add <my-org-stack> <URL>
```

where `<my-org-stack>` is a repository name and `<URL>` points to your stack configuration (`index.yaml`) file.

Check the repositories again by running `appsody repo list` to see that your repository was added. In the
following examples, the repository is called `abc-stacks` and the URL is `https://github.com/abc.inc/stacks/index.yaml`:

```
NAME        URL
*incubator  https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
abc-stacks  https://github.com/abc.inc/stacks/index.yaml
```

In this example, the asterisk (\*) shows that `incubator` is the default repository.

Run the following command to set `abc-stacks` as the default repository:

```
appsody repo set-default abc-stacks
```

Check the available repositories again by running `appsody repo list` to see that the default is updated:

```
NAME        URL
incubator   https://github.com/appsody/stacks/releases/latest/download/incubator-index.yaml
*abc-stacks https://github.com/abc.inc/stacks/index.yaml
```

**Recommendation**: To avoid initializing projects that are based on the public application stacks, it's best
to remove `incubator` from the list.

Run the following command to remove the `incubator` repository:


```
appsody repo remove incubator
```

Check the available repositories again by running `appsody repo list` to see that `incubator` is removed:


```
NAME     	  URL
*abc-stacks https://github.com/abc.inc/stacks/index.yaml
```

Your CLI is now configured to use your customized application stacks. You can now initialize your
project by using the CLI in the usual way. For more information about initializing projects to
develop applications, see [Developing microservice applications with the CLI](https://kabanero.io/guides/use-appsody-cli/).
