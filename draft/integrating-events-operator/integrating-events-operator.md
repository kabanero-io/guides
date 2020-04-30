---
permalink: /guides/integrating-events-operator/
layout: guide-markdown
title: Integrating the events operator
duration: 30 minutes
releasedate: 2020-04-26
description: Explore how to manage the flow of GitHub events to multiple pipelines
tags: ['Pipelines', 'Stack']
guide-category: pipelines
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

## What you'll learn

The events operator supports GitHub organization webhooks. Because you only need one webhook for all the repositories in
an organization, you can avoid creating webhooks for every repository individually. The events operator can also filter events from application stack repositories based on semantic versioning and determine which pipeline to trigger. This capability allows you to configure
which events target which Kubernetes deployments.  

In this guide, you will learn how to integrate the events operator to manage the flow of GitHub organization events through multiple pipelines.  By setting up the webhook mediator, you will manage event flow based on the semantic versioning of your application stack projects.


## Prerequisites

- Install [OpenShift  4.2 or later](https://www.openshift.com/products/container-platform)
- Install [Kabanero  Foundation](../../docs/ref/general/installation/installing-kabanero-foundation.html)


## Introduction

The events operator allows users to define an event mediation flow for Kubernetes deployments. By using custom resource definitions (CRD),
users can quickly construct mediation logic to receive, transform, and route JSON data structures. The transformation logic
is based on the Common Expression Language (CEL).

To integrate the events operator with Kabanero, you might use an event mediator to process events from a GitHub organization webhook. The event mediator is configured to filter and direct the flow of these events from different application stack repositories to the appropriate semantically-versioned pipeline. This process enables you to configure which events trigger which pipelines for making updates to different Kubernetes deployments.

The following diagram shows the relationship between a GitHub organization, the webhook mediator, and pipeline event listeners.

![This architecture diagram is explained in the surrounding text](/img/guide/integrating-events-operator-webhook-mediator.jpg)

The GitHub organization contains repositories for different development projects that use application stacks. The following
projects are used as examples:

- **project1** is based on the Node.js v0.2 stack
- **project2** is based on the Node.js v0.3 stack
- **project3** is based on  the Java OpenLiberty  v1.0 stack

Pipelines are configured to process events for different stack versions. The following pipeline event listeners are used as examples:

- **Listener 0.3.3** is waiting for events that run pipelines to update deployments that are based on v0.3 stacks.
- **Listener 1.0.1** is waiting for events that run pipelines to update deployments that are based on v1.0 stacks.

A webhook is configured for the Git organization that sends all webhook events to the webhook mediator. The
webhook mediator completes the following processing steps to target the appropriate pipeline:

1. Determines that the repository contains an application stack project.
2. Finds the best matching event listener based on the semantic version of the stack.
3. Generates parameters required for the event listener and pipeline trigger bindings.
4. Forwards the request to the event listener.

In the diagram, the Webhook mediator processes the following steps when it receives a pull request for **project2**:

1. Determines that the repository contains an application stack project and that the requested stack version is 0.3.
2. Locates the event listener that best matches the stack, which is the event listener for stack version 0.3.3.
3. Adds the pipeline parameters to the message body.
4. Forwards the webhook message with the added parameters to the event listener.

Note that in this example, the match for the Java OpenLiberty project (**project3**) is the event **listener 1.0.1**. However, no match exists for the Node.js project (**project1**).

## Getting started

When following this guide, use the configuration files provided inline. Ensure that you create and edit each `yaml` file when directed.


### Create Kabanero CRD with events-operator enabled

Create the file `kabanero-example.yaml` with the following content:

```yaml
apiVersion: kabanero.io/v1alpha2
kind: Kabanero
metadata:
  name: kabanero
spec:
  version: "0.8.0"
  governancePolicy:
    stackPolicy: none
  events:
    enable: true
  stacks:
    repositories:
    - name: central
      https:
        url: https://github.com/kabanero-io/kabanero-stack-hub/releases/download/0.9.0/kabanero-stack-hub-index.yaml    
    pipelines:
    - id: default
      sha256: 307976f51bb8fc5b8ca0fa5d7478e7fb1c722811a2135f9c0d1cf900fc27269f
      https:
        url: https://github.com/kabanero-io/kabanero-pipelines/releases/download/0.9.0/eventing-kabanero-pipelines.tar.gz
```

Change the `sha256` value to the correct value. The correct value is stored in: https://github.com/kabanero-io/kabanero-pipelines/releases/download/0.9.0/eventing-kabanero-pipelines-tar-gz-sha256.

Apply the file with the following command:

```
oc apply -f kabanero-example.yaml
```

### Create GitHub related secrets

#### API token

The mediator needs an API token to access GitHub to read configuration files such as `.appsody-config.yaml`. If you have an existing secret that is configured for pipelines, you can skip this step. Otherwise, create the file `my-githubsecret.yaml` with the following content:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ghe-https-secret
  namespace: kabanero
  annotations:
    tekton.dev/git-0: https://github.com
type: kubernetes.io/basic-auth
stringData:
  username: <user name>
  password:  <API token>
```

- `tekton.dev/git-0: https://github.ibm.com`: Change the location of the GitHub repository to your organization's GitHub repository.
- `username`: Update the user name to log in to GitHub. If you are using an organizational webhook, the user must have permissions to access all repositories in the organization.
-  `password`: Add the GitHub API token for the specified user.

If you want to use this secret for your pipeline, you might want to associate it with the service account `kabahero-pipeline` by running
the following command:

```
oc edit sa kabanero-pipeline githubsecret.yaml
```

Apply the file with the following command:

```
oc apply -f my-githubsecret.yaml
```

#### Webhook secret

The webhook secret is the secret you configure on GitHub and embed in each message received from GitHub, which allows the mediator to
verify its origin.

Create the file `my-webhooksecret.yaml` with the following entries:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ghe-webhook-secret
stringData:
  secretToken: <my GitHub secret>
  ```
Change `<my GitHub secret>` to a string of your choice. You'll provide the same string when you configure the webhook secret on GitHub.

Apply the file with the following command:

```
oc apply -f my-webhooksecret.yaml
```

### Create webhook event listener

To create a webhook listener, create a file called `webhook.yaml` with the following content:

```yaml
apiVersion: events.kabanero.io/v1alpha1
kind: EventMediator
metadata:
  name: webhook
spec:
  createListener: true
  createRoute: true
  repositories:
    - github:
        secret: my-githubsecret
        webhookSecret: my-webhooksecret
    - name: webhook
      selector:
        urlPattern: "webhook"
        repositoryType:
          newVariable: body.webhooks-appsody-config
          file: .appsody-config.yaml
      variables:
        - name: body.webhooks-tekton-target-namespace
          value: kabanero
        - name: body.webhooks-tekton-service-account
          value: kabanero-pipeline
        - name: body.webhooks-tekton-docker-registry
          value: <my-docker-registry> docker.io/<myorg>
        - name: body.webhooks-tekton-ssl-verify
          value: "false"
        - name: body.webhooks-tekton-insecure-skip-tls-verify
          value: "true"
      sendTo: [ "dest"  ]
      body:
        - = : "sendEvent(dest, body, header)"
```

- Ensure `secret`  matches the name of your GitHub secret if you did not need to create the `my-githubsecret.yaml` file earlier.
- Change `<my-docker-registry>` to the value of the docker registry for your organization, such as `docker.io/myorg`.

Apply the file with the following command:

```
oc apply -f webhook.yaml
```

### Create event connections

Create a file called `connections.yaml` with the following content:

```yaml
apiVersion: events.kabanero.io/v1alpha1
kind: EventConnections
metadata:
  name: connections
spec:
  connections:
    - from:
        mediator:
            name: webhook
            mediation: webhook
            destination: dest
      to:
        - https:
            - urlExpression:  body["webhooks-kabanero-tekton-listener"]
              insecure: true
```

Note that `body["webhooks-kabanero-tekton-listner"]` is a variable that is generated by the mediator. The value is the pipeline event listener that best matches the semantic version of the incoming application stack.

Apply the file with the following command:

```
oc apply -f connections.yaml
```

### Configure the webhook on your source repository

Use the commmand `oc get route webhook` to find the external hostname of the route that was created. Use this host when creating a webhook
for your GitHub organization.

To create an organization webhook, follow the instructions here for
[Configuring webhooks for organization events in your enterprise account](https://help.github.com/en/github/setting-up-and-managing-your-enterprise-account/configuring-webhooks-for-organization-events-in-your-enterprise-account).

If you are not working within an enterprise, you can also create webhooks for each repository.


Now that your webhook is configured, you have successfully integrated the events operator in your environment. Provided that you
have pipelines in place that are semantically versioned to listen for specific events, you can go ahead and test your webhook. To
learn how to configure your pipelines, see the [Build and deploy applictions with pipelines](../working-with-pipelines/) guide.


## Test the webhook

In the GitHub organization where you configured your webhook, make a change to an application stack project. Follow these steps:

- Initiate a pull request
- Initiate a merge
- Initiate a tag on the master branch


## Webhook processing flow for projects

Let's illustrate the flow with a sample application stack project that has the following `.appsody-config.yaml` file:

```yaml
project-name: test1
stack: docker.io/kabanero/nodejs:0.3
```

The name of this project is `test1`, and the name of the stack is `docker.io/kabanero/nodejs`. The version of the stack
is `0.3`. The project might be built with any build pipeline that is semantically matched to version 0.3.

The association between a stack and its corresponding build pipelines is specified in the Kabanero CRD. In the following example, you can see the following configuration:

- pipeline release 0.3.0-rc1 is used to build application stacks in release 0.3.0-rc1.
- pipeline release 1.0.0.-rc1 is used to build the application stacks in release 1.0.0-rc1.

```yaml
apiVersion: kabanero.io/v1alpha2
kind: Kabanero
metadata:
  name: kabanero
  namespace: kabanero
  resourceVersion: "244275"
  selfLink: /apis/kabanero.io/v1alpha2/namespaces/kabanero/kabaneros/kabanero
  uid: b217411a-480b-41e4-b01b-8e2aabec165d
spec:
  stacks:
    repositories:
    - gitRelease: {}
      name: central
      https:
        url: https://github.com/kabanero-io/kabanero-stack-hub/releases/download/0.3.0-rc.1/kabanero-stack-hub-index.yaml
      pipelines:
      - gitRelease: {}
        https:
          url: https://github.com/kabanero-io/kabanero-pipelines/releases/download/0.3.0-rc.1/default-kabanero-pipelines.tar.gz
        id: default
        sha256: 12345678eef31fea470abc860909b407f0af54016acb79b723c04c711350d344
    - gitRelease: {}
      name: central
      https:
        url: https://github.com/kabanero-io/kabanero-stack-hub/releases/download/1.0.0-rc.1/kabanero-stack-hub-index.yaml
      pipelines:
      - gitRelease: {}
        https:
          url: https://github.com/kabanero-io/kabanero-pipelines/releases/download/1.0.0-rc.1/default-kabanero-pipelines.tar.gz
        id: default
        sha256: 87654321eef31fea470abc860909b407f0af54016acb79b723c04c711350d344
  version: 0.7.0
```

After you apply the kabanero CRD, the Stack CRD is created to track the pipeline resources associated with the stack release. For example,

```yaml
apiVersion: kabanero.io/v1alpha2
kind: Stack
metadata:
  name: nodejs
  namespace: kabanero
  ...
spec:
  name: nodejs
  versions:
  - images:
    - id: Node.js
      image: docker.io/kabanero/nodejs
    pipelines:
    - gitRelease: {}
      https:
        url: https://github.com/kabanero-io/kabanero-pipelines/releases/download/0.3.0/default-kabanero-pipelines.tar.gz
      id: default
      sha256: 876543221af21540f0d0dac8caf0a2d805e8d90f174cb912a31831f700d049bb1
    version: 0.3.3
  - images:
    - id: Node.js
      image: docker.io/kabanero/nodejs
    pipelines:
    - gitRelease: {}
      https:
        url: https://github.com/kabanero-io/kabanero-pipelines/releases/download/1.0.0/default-kabanero-pipelines.tar.gz
      id: default
      sha256: 12345678af21540f0d0dac8caf0a2d805e8d90f174cb912a31831f700d049bb1
    version: 1.0.0
status:
  summary: '[ 0.3.3: active ] [ 1.0.0: active ]'
  versions:
  - images:
    - id: Node.js
      image: docker.io/kabanero/nodejs
    pipelines:
    - activeAssets:
      - assetDigest: ...
        version: v1alpha1
        status: active
        group: tekton.dev
        kind: EventListener
        namespace: kabanero
        assetName: listener-12345678
      - assetDigest: 12345678601fbb577ce2fdf3557261ef5c3915bb15d5ea5f9423191e2366bb0b
        assetName: build-push-pl-12345678
        group: tekton.dev
        kind: Pipeline
        namespace: kabanero
        status: active
        version: v1alpha1a
    status: active
    version: 0.3.3
  - images:
    - id: Node.js
      image: docker.io/kabanero/nodejs
    pipelines:
    - activeAssets:
      - assetDigest: ...
        version: v1alpha1
        status: active
        group: tekton.dev
        kind: EventListener
        namespace: kabanero
        assetName: listener-87654321
      - assetDigest: 87654321601fbb577ce2fdf3557261ef5c3915bb15d5ea5f9423191e2366bb0b
        assetName: build-push-pl-87654321
        group: tekton.dev
        kind: Pipeline
        namespace: kabanero
        status: active
        version: v1alpha1a
    status: active
    version: 1.0.0
...
```

**Notes:**

- The version of the stack is `0.3.3`.
- The pipeline event listener for driving the pipelines for this stack is `listener-12345678`.

When a new webhook message is received, the event mediator uses the `selector` in the mediator to find a matching mediation. It verifies the URL pattern of the webhook request, the GitHub secret, and reads `.appsody-config.yaml`. These steps associate the webhook event with the mediation `appsody`.

The event mediator applies the following additional logic for application stack projects:

1. The best matching active stack is selected by matching `.spec.images[i].name` to the stack name as defined in `appsody-config.yaml`.
2. The value of `.spec.images[i].version` is used to find the best semantically matched version.
3. The value of `.status` is checked to ensure that the version is active.

Then, the Event mediator creates the variable `message.body.webhooks-kabanero-tekton-listener` to be `listener-12345678`. All the default variables and user-defined variables that need to be passed downstream to the pipeline event listener are created.

When sending the message downstream, the following URL is defined in the `EventConnection`:
`https://${message.body.webhooks-kabanero-tekton-listener}`. This URL resolves to: `https://listener-12345678`.

The pipeline event listener is configured to trigger the correct pipeline based on input parameters. In the following example, a separate pipeline is called depending on whether it is a push or pull request. In addition, a separate monitor task is created when the event mediator decides that one is needed.

```yaml
apiVersion: tekton.dev/v1alpha1
kind: EventListener
metadata:
  name: listener-12345678
  namespace: kabanero
spec:
  serviceAccountName: tekton-webhooks-extension-eventlistener
  triggers:
  - bindings:
    name: kabanero-push-event
    template:
      apiversion: v1alpha1
      name: build-deploy-pl-template-12345678
    - apiversion: v1alpha1
      name: build-deploy-pl-push-binding-12345678
    - interceptor:
      - cel:
          filter: 'has(body.wehbooks-event-type) && body.webhooks-event-type == "push" '
  - bindings:
    name: kabanero-pullrequest-event
    - apiversion: v1alpha1
      name: build-deploy-pl-pullrequest-binding-12345678
    template:
      apiversion: v1alpha1
      name: build-deploy-pl-template-12345678
    interceptors:
      - cel:
          filter: 'has(body.webhooks-event-type) && body.webhooks-event-type == "pull_request" '
  - bindings:
    name: kabanero-monitor-task-event
    - apiversion: v1alpha1
      name: monitor-task-github-binding-12345678
    template:
     apiversion: v1alpha1
     name: monitor-task-template-12345678
     interceptors:
      - cel:
          filter: 'has(body.webhooks-tekton-monitor) && body.webhooks-tekton-monitor" '
```

Congratulations! You have successfully integrated the events operator and can successfully manage events through your pipelines based on the semantic versioning of your application stack projects.
