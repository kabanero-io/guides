---
permalink: /guides/pipeline-build-deploy-app/
layout: guide-markdown
title: Build and deploy applications with pipelines
duration: 30 minutes
releasedate: 2020-05-01
description: Explore how to use pipelines to build and deploy applications
tags: ['Pipelines, Application stacks']
guide-category: pipelines
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

## Introduction

This guide will walk you through the steps needed to run a pipeline to build your application, publish the image to a registry, and optionally deploy the application on your cluster.

For this guide, we will use one of the default pipelines, `java-openliberty-build-deploy-pl`, which is activated by the Kabanero operator. You can replace this with any of the other `build-deploy` pipelines or your custom pipeline.

## Steps

1. Clone the `https://github.com/kabanero-io/kabanero-pipelines/` repository.
   * Change into the `pipelines/sample-helper-files` directory
2. Make sure you have the appropriate storage necessary to drive pipelines. If you have a dynamic storage provisioner available on your cluster, you can proceed to the next step. If not, you can set up a simple NFS-based persistent volume (PV) using the `nfs-pv.yaml` sample provided. You must update the IP address before applying the file.
   * Run `oc apply nfs-pv.yaml`
3. If you are using a private GitHub repo, create the secret for your repo. Follow the steps in the **Secrets** section of [Working with Pipelines](../working-with-pipelines/working-with-pipelines.html#getting-started).
4. Read the following information to determine whether it is necessary to create the secret for your image registry.
   * If you are using the internal route of the internal registry of your OCP cluster, you do not have to configure a secret as long as the service account you are running the pipeline with has appropriate permissions, such as the `kabanero-pipeline` service account.
   * If you are using the external route of the internal registry of your OCP cluster, you do not have to configure a secret. The pipeline will recognize the URL and translate it to the internal route of the registry.
   * If you are using a private registry, follow the steps in the **Secrets** section of [Working with Pipelines](../working-with-pipelines/working-with-pipelines.html#getting-started) to set up a secret for your registry.
5. Set up certificates or specify insecure connection for the registry access. For instructions and additional information, see **Transport layer security (TLS) verification for image registry access in pipelines** in [Working with pipelines](../working-with-pipelines/working-with-pipelines.html#transport-layer-security-tls-verification-for-image-registry-access-in-pipelines).
6. Run the pipeline. You can run pipelines from the pipelines dashboard with a webhook extension, using scripts, or by using the command line. For more information, see the appropriate sections of [Working with pipelines](../working-with-pipelines/working-with-pipelines.html).
7. Review the status of your run and log files. For more information, see **Checking the status of the pipeline run** in [Working with pipelines](../working-with-pipelines/working-with-pipelines.html#checking-the-status-of-the-pipeline-run).
8. When the pipeline run is complete, you can check your registry to see if the application image is published.
9. If you ran the pipeline using the webhook, it will only deploy the application if you initiated the run via a pull request merge. In that case, continue to the next step to access your application.
10. To see your application pod running, run `oc get apposodyapplications`, or check your pods.
11. For private registries and the external route of the internal registry, create the secret for your registry and associate it with the new service account that was created by Appsody for your application. If you are using the internal route for the internal registry, this step is not necessary, because the service account has the necessary permissions. For instructions, see [Creating a secret and linking to a service account](#cslsa).
12. If you exposed a route for your application, check the routes (for example, run `oc get routes`) and test your application.


### Creating a secret and linking to a service account
{: #cslsa}
<br>

1. Find the service account of your application.
   ```
   oc get deployments -n kabanero

   NAME                                      READY   UP-TO-DATE   AVAILABLE   AGE
   codeready-operator                        1/1     1            1           28h
   java-openliberty-0-2-26                   1/1     1            1           25h
   kabanero-cli                              1/1     1            1           28h
   kabanero-landing                          1/1     1            1           28h
   kabanero-operator                         1/1     1            1           28h
   kabanero-operator-admission-webhook       1/1     1            1           28h
   kabanero-operator-collection-controller   1/1     1            1           28h
   kabanero-operator-stack-controller        1/1     1            1           28h
   ```
  Make a note of the name of the deployment, for example, `java-openliberty-0-2-26`.

2. Use the deployment name to find the `serviceaccount`.
   ```
   oc get deployments java-openliberty-0-2-26 -o yaml --output="jsonpath={.spec.template.spec.serviceAccount}"

   java-openliberty-0-2-26
   ```
   Note the `serviceaccount`; this is the `serviceaccount` to which the secret will be linked.

3. If you are using the internal image registry external route (for example, `hostnamedefault-route-openshift-image-registry.apps.example.com`):

   Find a token using any `serviceaccount` other than the one found in the first step. Use the token as a password for the creation of the secret.
   ```
   oc get secret -o name | grep -m 1 kabanero-pipeline-token  | xargs oc describe

   Name:         kabanero-pipeline-token-7f59v
   Namespace:    kabanero
   Labels:       <none>
   Annotations:  kubernetes.io/created-by: openshift.io/create-dockercfg-secrets
                 kubernetes.io/service-account.name: kabanero-pipeline
                 kubernetes.io/service-account.uid: 26bfb3ef-1334-4033-acd6-c8bc32dd1ba4

   Type:  kubernetes.io/service-account-token

   Data
   ====
   ca.crt:          5932 bytes
   namespace:       8 bytes
   service-ca.crt:  7133 bytes
   token:           eyJhbGciOiJSUzI1NiIsImtpZCI6IkZiTVVvUkhENlJjdFJsa0ZLdF9xd2lFX0piRVVkMHh5RjVoV2JCOFhvTkEifQ.eyJpc3MiOiJrdWJlcm5ld
   ```

   **Note:** In this example, the `serviceaccount` `kabanero-pipeline` is used to generate its token, because this `serviceaccount` has the correct permissions to access the internal registry.

   Proceed to step 5.

4. If you are using a private image registry, use your password for the private registry as the password during secret creation in the following steps.

5. Create a secret for your image registry based on your registry URL.
   ```
   oc -n kabanero create secret docker-registry [name of secret] --docker-server=[your registry hostname URL] --docker-username=[your registry username] --docker-password=[your registry password]
   ```

   This example applies to an internal image registry external route:
   ```
   oc -n kabanero create secret docker-registry my-registry --docker-server=default-route-openshift-image-registry.apps.example.com --docker-username=kabanero-pipeline --docker-password=[token value found earlier]

   secret/my-registry created
   ```

   This example applies to a private registry:
   ```
   oc -n kabanero create secret docker-registry my-registry --docker-server=team-image-registry-docker-local.com --docker-username=[registry username] --docker-password=[registry password]
   ```

6. Link your secret to the application deployment `serviceaccount`.
   ```
   $oc -n kabanero secrets link [deployment serviceaccount ] [secret name] --for=pull,mount
   ```

   For example:
   ```
   $oc -n kabanero secrets link java-openliberty-0-2-26 my-registry --for=pull,mount
   ```

<!--
// =================================================================================================
// Troubleshooting
// =================================================================================================
-->

## Troubleshooting

To find solutions for common issues and troubleshoot problems with pipelines, see the [Pipelines Troubleshooting Guide](https://github.com/kabanero-io/kabanero-pipelines/blob/master/docs/Troubleshooting.md).

### Related links

- [Working with Pipelines](../working-with-pipelines/working-with-pipelines.html)
- [Pipelines repository](https://github.com/kabanero-io/kabanero-pipelines)
- [Pipeline tutorial](https://github.com/tektoncd/pipeline/blob/master/docs/tutorial.md)
