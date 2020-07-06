---
permalink: /guide/codeready-workspaces/
layout: guide-markdown
title: Getting Started with CodeReady Workspaces
duration: 30 minutes
description: Use CodeReady Workspaces to develop cloud-native applications from an OpenShift cluster. 
tags: ['codeready workspaces', 'openshift', 'codewind', 'microservice']
guide-category: basic
---

## Objectives
* Install CodeReady Workspaces and Codewind
* Develop a simple microservice that uses Eclipse Codewind on CodeReady Workspaces

## Overview
Use Eclipse Codewind to develop microservice applications from application stacks in an integrated developer environment (IDE). CodeReady Workspaces provides a containerized IDE for cloud native application development on an OpenShift cluster. 

## Developing with CodeReady Workspaces 
CodeReady Workspaces uses Kubernetes and containers to provide a preconfigured environment. Use CodeReady Workspaces to create, build, and test your code in OpenShift containers but feel like you are working on an IDE on your local computer. 

### Prerequisite
Before you can use Codewind with CodeReady Workspaces, you must have an OpenShift cluster available. To install OpenShift clusters, see [CodeReady Containers](https://code-ready.github.io/crc/). 

CodeReady Workspaces require at least two 5Gi ReadWriteOnce (RWO) persistent volumes on the cluster to install and a 5Gi RWO volume for each created workspace.

Each Codewind workspace also requires at least on 5Gi ReadWriteMany (RWX) persistent volume.

### Installing CodeReady Workspaces
To install CodeReady Workspaces, set `Spec.codeReadyWorkspaces.enable: true` in the Kabanero custom resource (Kabanero CR) instance and apply it.

To edit the Kabanero CR from the command line, run `oc edit kabanero -n kabanero`. 

The following sample shows a Kabanero CR instance configuration: 

```yaml
apiVersion: kabanero.io/v1alpha2
kind: Kabanero
metadata:
  name: kabanero
spec:
  version: "0.6.0"
  codeReadyWorkspaces:
    enable: true
    operator:
      customResourceInstance:
        tlsSupport: true
        selfSignedCert: true
  stacks:
    repositories:
    - name: central
      https:
        url: https://github.com/kabanero-io/collections/releases/download/0.6.0/kabanero-index.yaml
```

### Configuring CodeReady Workspaces
The Kabanero CR instance provides extra fields for you to configure your installation of CodeReady Workspaces.

* If you want to install CodeReady Workspaces with TLS Support, set `Spec.codeReadyWorkspaces.operator.customResourceInstance.tlsSupport` to `true`.
  **Note:** If your OpenShift cluster's router is set up with self-signed certificates, `Spec.codeReadyWorkspaces.operator.instance.selfSignedCert` must also be set to `true`.
* If you want to use your OpenShift accounts with CodeReady Workspaces, set up permanent users (accounts other than kube:admin) and then set `Spec.codeReadyWorkspaces.operator.customResourceInstance.openShiftOAuth` to `true`.
* To view the full list of configurable fields, see [Kabanero Custom Resource](https://www.ibm.com/support/knowledgecenter/SSCSJL_4.1.x/docs/ref/general/configuration/kabanero-cr-config.html). 

### Setting up Codewind
Because of its dependency on `buildah`, Codewind needs to run as root and privileged. To enable Codewind, run the following commands from your command line: 
  * `oc adm policy add-scc-to-user anyuid system:serviceaccounts:<namespace where you installed CodeReady Workspaces>:che-workspace` 
  * `oc adm policy add-scc-to-user privileged system:serviceaccounts:<namespace where you installed CodeReady Workspaces>:che-workspace` 

CodeReady Workspaces starts Codewind and installs the Codewind plug-ins. This process might take a couple of minutes for all of the necessary components to be pulled and started.

### Creating the Codewind workspace
After you set up Codewind, log in to your CodeReady Workspaces account and create a Codewind workspace from the Codewind devfile: 

1. Log in to CodeReady Workspaces. 
2. Go to **Workspaces** then click **Add Workspace**. 
3. Click **Import Devfile**. 
4. From **Source**, click **YAML**. 
5. Go to the link, [codewind-che-plugin/0.13.0/devfile.yaml](https://raw.githubusercontent.com/eclipse/codewind-che-plugin/0.13.0/devfiles/0.13.0/devfile.yaml), then copy and paste the contents into the YAML text box in your Codewind workspace. 
6. Click **Create & Open**.

### Configuring Codewind to use application stacks
Configure Codewind to use Appsody templates so you can focus exclusively on your code. Complete the following steps to select the Appsody templates:

1. Select **Codewind**.
2. Right-click **Projects**.
3. Select **Template Source Manager**.
4. Enable **Appsody Stacks - incubator** and **Default templates**. 

After you configured Codewind to use Appsody templates, continue to develop your microservice within Codewind.

### Creating an Appsody project
Throughout the application lifestyle, Appsody helps you develop containerized applications and maximize containers curated for your usage. 

1. Under the Explorer pane, select **Codewind**.
2. Expand **Codewind** by clicking the drop-down arrow.
3. Hover over the **Projects** entry underneath Codewind in the Explorer pane, and press the **+** icon to create a project.
    * **Note:** Make sure that Docker is running. Otherwise, you get an error.
4. Choose the **Appsody Open Liberty default template (Appsody Stacks - incubator)**.
5. Name your project **appsody-calculator**.
    * If you don't see Appsody templates, find and select **Template Source Manager** and enable **Appsody Stacks - incubator**.
    * The templates are refreshed, and the Appsody templates are available.
6. Press **Enter**.
    * To monitor your project's progress, right-click your project, and select **Show all logs**. Then, an **Output** tab is displayed where you see your project's build logs.

Your project is complete when you see that your application status is running and your build status is successful.

### Accessing the application endpoint in a browser
1. Return to your project under the **Explorer** pane.
2. Select the Open App icon next to your project's name, or right-click your project and select **Open App**.

Your application is now opened in a browser, showing the welcome to your Appsody microservice page.

### Adding a REST service to your application
 1. Go to your project's workspace under the **Explorer** pane.
 2. Go to `src>main>java>dev>appsody>starter`.
 3. Right-click **starter** and select **New File**.
 4. Create a file, name it `Calculator.java`, and press **Enter**. This file is your JAX-RS resource.
 5. Before you input any code, make sure that the file is empty. 
 6. Populate the file with the following code and then **save** the file:

```java
package dev.appsody.starter;
import javax.ws.rs.core.Application;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.PathParam;
@Path("/calculator")
public class Calculator extends Application {
    @GET
    @Path("/aboutme")
    @Produces(MediaType.TEXT_PLAIN)
    public String aboutme() {
        return "You can add (+), subtract (-), and multiply (*) with this simple calculator.";
    }
    @GET
    @Path("/{op}/{a}/{b}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response calculate(@PathParam("op") String op, @PathParam("a") String a, @PathParam("b") String b) {
        int numA = Integer.parseInt(a);
        int numB = Integer.parseInt(b);
        switch (op) {
            case "+":
                return Response.ok(a + "+" + b + "=" + (Integer.toString((numA + numB)))).build();
            case "-":
                return Response.ok(a + "-" + b + "=" + (Integer.toString((numA - numB)))).build();
            case "*":
                return Response.ok(a + "*" + b + "=" + (Integer.toString((numA * numB)))).build();
            default:
                return Response.ok("Invalid operation. Please Try again").build();
        }
    }
}
```

Any changes that you make to your code are automatically built and redeployed by Codewind, and you can view them in your browser.

### Working with the example calculator microservice
You now can work with the example calculator microservice.

1. Use the port number that you saw when you first opened the application.
2. Make sure to remove the `< >` symbol in the URL.
3. `http://127.0.0.1:<port>/starter/calculator/aboutme`
4. You see the following response:

```
You can add (+), subtract (-), and multiply (*) with this simple calculator.
```

You can also try a few of the sample calculator functions:

* `http://127.0.0.1:<port>/starter/calculator/{op}/{a}/{b}`, where you can input one of the available operations `(+, _, *)`, and an integer a, and an integer b.
* So for `http://127.0.0.1:<port>/starter/calculator/+/10/3` you see: `10+3=13`.

## What you have learned
Now that you have completed this guide, you have learned to:

1. Install CodeReady Workspaces and Codewind
2. Develop your own microservice that uses Codewind on CodeReady Workspaces

## Next Steps 
For more guides on developing cloud native microservice applications, see [IBM Knowledge Center's Getting Started](https://www.ibm.com/support/knowledgecenter/SSCSJL_4.1.x/guides/guides-gs.html). 