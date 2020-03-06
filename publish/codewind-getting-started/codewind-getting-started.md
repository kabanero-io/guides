---
permalink: /guides/guide-codewind/
layout: guide-markdown
title: Getting Started with Codewind and Kabanero
duration: 30 minutes 
description: Take advantage of Codewind's tools to help build high quality cloud native applications regardless of which IDE or language you use.
tags: ['kabanero', 'appsody', 'codewind', 'microservice']
projectid: guide-codewind
guide-author: Kabanero
repo-description: TBD
---

## Objectives

### Learning objectives 

In this guide you will learn how to develop a simple microservice with your chosen IDE, using Eclipse Codewind, an open source project, which provides IDE extensions for popular IDEs (VS Code and Eclipse IDE).  Eclipse Codewind provides the ability to create new projects based on application stacks that can be customized to meet your company policies and consistently deploy applications and microservices at scale.

## Overview 

Kabanero's developer experience for IDEs is provided by Eclipse Codewind.  For more information on how Kabanero and its components work, visit [Kabanero's Architecture and Development Workflows](https://kabanero.io/docs/ref/general/overview/architecture-overview.html).

Kabanero installs on OpenShift and integrates a modern DevOps toolchain and application stack hubs which enable developers to use runtimes and frameworks in pre-built container images called `Application stacks`.  

Eclipse Codewind provides the ability to create application projects from these `Application Stacks` that your company has built, enabling developers to focus on their code and not infrastructure and Kubernetes.  Application deployments to Kubernetes occur via pipelines when developers commit their local code to the correct Git repos Kabanero is managing via webhooks.    

Eclipse Codewind provides the ability to create projects based on a variety of different template types.  These include IBM Cloud starters, OpenShift Do (odo), and Appsody templates. Today, there are templates for: IBM Cloud Starters, odo, Eclipse MicroProfile/Java EE, Springboot, Node.js, Node.js with Express, Node.js with Loopback.

This guide describes developing a simple microservice using two different IDEs. Select the guide section based on your IDE of choice: 

* [Developing with VS Code](#developing-with-vs-code)
* [Developing with Eclipse](#developing-with-eclipse)

## Developing with VS Code

If you use Visual Studio Code (VS Code), you can use Codewind for VS Code to develop and debug your containerized projects from within VS Code using the workflow you already use today.

### Prerequisite 

Before you can develop a microservice with VS Code, you need to:

* [Install Docker](https://docs.docker.com/install/) 
    * **Note:** Make sure to install or upgrade to minimum Docker version 19.03. 
* [Install VS Code](https://code.visualstudio.com/download)
 
### Installing Codewind for VS Code

The Codewind installation pulls the following images that form the Codewind backend:

1. `eclipse/codewind-performance-amd64`
2. `eclipse/codewind-pfe-amd64`

The Codewind installation includes two parts:

1. The VS Code extension installs when you install Codewind from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=IBM.codewind) and click `Install`. 
    * Or, go to `View->Extensions`, search for Codewind, and click `Install`. 
2. The Codewind backend containers install after you click `Install` when you are prompted. Clicking `Install` downloads the Codewind backend containers, ~1GB. 
    * **Optional:** If you don’t click `Install` when the notification window first appears, you can access the notification again. Go to `View->Explorer`. Then click `Codewind` and hover the cursor over `Codewind` where there is a switch to turn Codewind on or off. Click the switch so that it is `On`. The notification window is displayed. 

### Configuring Codewind to use application stacks 

Configure Codewind to use Appsody templates so you can focus exclusively on your code. These templates include an Eclipse MicroProfile stack that you can use to follow this guide. Complete the following steps to select the Appsody templates:

1. Under the Explorer pane, select `Codewind`. 
2. Right-click `Local`.
3. Select `Template Source Manager`. 
4. Enable `Appsody Stacks - incubator`. 

You now have configured Codewind to Appsody templates and can proceed to develop your microservice within Codewind.

If your organization uses customized application stacks and has given you a URL that points to an `index.json` file, you can add it to Codewind: 

1. Return to  `Codewind` and right-click `Local`. 
2. Select `Template Source Manager`. 
3. Click the `Add New +` button to add your URL.
4. Add your URL in the pop up window and save your changes. 

### Creating an Appsody project

Throughout the application lifestyle, Appsody helps you develop containerized applications and leverage containers curated for your usage. If you want more context about Appsody, visit the [Appsody welcome page](https://appsody.dev/docs). 

1. Under the Explorer pane, select `Codewind`.
2. Expand `Codewind` by clicking the drop-down arrow. 
3. Hover over the `Projects` entry underneath Codewind in the Explorer pane, and press the `+` icon to create a project.
    * **Note:** Make sure Docker is running. Otherwise, you get an error. 
4. Choose the `Appsody Eclipse MicroProfile template`. 
5. Name your project `appsody-calculator`.
    * If you don't see Appsody templates, find and select `Template Source Manager` and enable `Appsody Stacks - appsodyhub`. 
** The templates are refreshed, and the Appsody templates are available. 
6. Press `Enter`. 
    * To monitor your project's progress, right-click your project, and select `Show all logs`. Then an `Output` tab is displayed where you see your project's build logs. 

Your project is complete when you see your application status is running and your build status is successful. 

### Accessing the application endpoint in a browser

1. Return to your project under the Explorer pane. 
2. Select the Open App icon next to your project's name, or right-click your project and select `Open App`. 

Your application is now opened in the browser, showing the welcome to your Appsody microservice page.

### Adding a REST service to your application

 1. Go to your project's workspace under the Explorer tab. 
 2. Navigate to `src->main->java->dev->appsody->starter`.
 3. Right-click `starter` and select `New File`.
 4. Create a file, name it `Calculator.java`, and press `Enter`. This file is your JAX-RS resource. 
 5. Populate the file with the following code then **save** the file: 

```
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
    public String aboutme(){
        return "You can add (+), subtract (-), and multiply (*) with this simple calculator.";
    }

    @GET
    @Path("/{op}/{a}/{b}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response calculate(@PathParam("op") String op, @PathParam("a") String a, @PathParam("b") String b)
    {
        int numA = Integer.parseInt(a);
        int numB = Integer.parseInt(b);

      switch(op)
      {
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
Any changes you make to your code is automatically built and re-deployed by Codewind and viewable in your browser. 

### Working with the microservice

You now can work with your calculator.

1. Use the port number you saw when you first opened the application.
2. Make sure to remove the `< >` symbol in the URL. 
3. `http://127.0.0.1:<port>/starter/calculator/aboutme` 
4. You should see the following response:

```
You can add (+), subtract (-), and multiply (*) with this simple calculator.
```

You could also try a few of the sample calculator functions: 

* `http://127.0.0.1:<port>/starter/calculator/{op}/{a}/{b}`, where you can input one of the available operations `(+, _, *)`, and an integer a, and an integer b.
* So for `http://127.0.0.1:<port>/starter/calculator/+/10/3` you should see: `10+3=13`.

### More Learning

You have created a simple microservice using the VS Code IDE. For further learning:

* Try [additional Kabanero guides](https://www.kabanero.io/guides) available for other application stacks: Eclipse MicroProfile, Springboot, Node.js.
* Learn more about [Codewind](https://www.eclipse.org/codewind/).
* Review [project commands for Codewind for VS Code](https://www.eclipse.org/codewind/mdt-vsc-commands-project.html).

## Developing with Eclipse 

If you use Eclipse, you can use Codewind for Eclipse to develop and debug your containerized projects from within a local Eclipse IDE.

### Prerequisite

Before you can develop a microservice with Eclipse, you need to:

* [Install Docker](https://docs.docker.com/install/) 
    * **Note:** Make sure to install or upgrade to minimum Docker version 19.03. 
* [Install Eclipse](https://www.eclipse.org/downloads/packages/release/)
    * **Note:** Make sure to install or upgrade to mimimum Eclipse version 2019-09 R (4.13.0). 

### Installing Codewind for Eclipse

The Codewind installation pulls the following images that form the Codewind backend:

1. `eclipse/codewind-performance-amd64`
2. `eclipse/codewind-pfe-amd64`

The Codewind installation includes two parts:

1. The Eclipse plug-in installs when you install Codewind from the [Eclipse Marketplace](https://marketplace.eclipse.org/content/codewind)or when you install by searching in the `Eclipse Extensions` view.
2. The Codewind backend containers install after you click `Install`. Clicking `Install` downloads the Codewind backend containers, ~1GB. 

### Configuring Codewind to use application stacks

Configure Codewind to use Appsody templates so you can focus exclusively on your code. These templates include an Eclipse MicroProfile stack that you can use to follow this guide. Complete the following steps to select the Appsody templates:

1. Click the `Codewind` tab. 
2. Expand `Codewind` by clicking the drop-down arrow.
3. Right-click `Local [Running]`.
4. Select `Manage Template Sources...`. 
5. Select `Appsody Stacks - incubator`.
6. Click the `OK` button. 

You now have configured Codewind to Appsody templates and can proceed to develop your microservice within Codewind.

If your organization uses customized application stacks and has given you a URL that points to an `index.json` file, you can add it to Codewind: 

1. Return to  `Codewind` and right-click `Local [Running]`. 
2. Select `Manage Template Sources...`. 
3. Click the `Add...` button to add your URL.
4. Add your URL in the `URL:` box in the pop up window and save your changes. 

### Creating an Appsody project

Appsody helps you develop containerized applications and removes the burden of managing the full software development stack. If you want more context about Appsody, visit the https://appsody.dev/docs[Appsody welcome page]. 

1. Right-click `Projects (Local)` under `Codewind` in the `Codewind` tab.
2. Select `Create New Project...`
    * **Note:** Make sure Docker is running. Otherwise, you get an error. 
3. Name your project `appsody-calculator`. 
4. Under `Template`, select `Appsody Eclipse MicroProfile template`. 
    * If you don't see an Appsody template, select the `Manage Template Sources...` link at the end of the window.
    * Select the `Appsody Stacks - appsodyhub` checkbox. 
    * Click `OK`.
    * The templates are refreshed, and the Appsody templates are available. 
5. Click `Finish`.
    * To monitor your project's progress, right-click on your project, and select `Show Log Files`.
    * Select `Show All`. Then a `Console` tab is displayed where you see your project's build logs. 

Your project is displayed in the `Projects (Local)` section. The progress for creating your project is tracked next to the project's name. 

Your project is complete when you see your project is running and its build is successful. 

### Accessing the application endpoint in a browser

1. Return to your project under the Codewind tab. 
2. Right-click your project and select `Open Application`. 

Your application is now opened in the browser, showing the welcome to your Appsody microservice page. 

### Adding a REST service to your application

1. Go to your project's workspace under the Project Explorer tab. 
2. Navigate to `Java Resources->src/main/java->dev.appsody.starter`. 
3. Right-click `dev.appsody.starter` and select `New->Class`.
4. Create a Class file, name it `Calculator.java`, and select `Finish`. This file is your JAX-RS resource. 
5. Populate the file with the following code then **save** the file: 

```
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
    public String aboutme(){
        return "You can add (+), subtract (-), and multiply (*) with this simple calculator.";
    }

    @GET
    @Path("/{op}/{a}/{b}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response calculate(@PathParam("op") String op, @PathParam("a") String a, @PathParam("b") String b)
    {
        int numA = Integer.parseInt(a);
        int numB = Integer.parseInt(b);

      switch(op)
      {
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
Any changes you make to your code is automatically built and re-deployed by Codewind and viewed in your browser.

### Working with the microservice

You now can work with your calculator. 

* Use the port number you saw when you first opened the application.
* Make sure to remove the `< >` symbol in the URL. 
* `http://127.0.0.1:<port>/starter/calculator/aboutme` 
* You should see the following response:

```
You can add (+), subtract (-), and multiply (*) with this simple calculator.
```

You could also try a few of the sample calculator functions:

* `http://127.0.0.1:<port>/starter/calculator/{op}/{a}/{b}`, where you can input one of the available operations `(+, _, *)`, and an integer a, and an integer b.
* So for `http://127.0.0.1:<port>/starter/calculator/+/10/3` you should see: `10+3=13`. 

### More Learning

You have completed a simple microservice using the Eclipse IDE. For further learning: 

* Try [additional Kabanero guides](https://www.kabanero.io/guides) available for other application stacks: Eclipse MicroProfile, Springboot, Node.js.
* Learn more about [Codewind](https://www.eclipse.org/codewind).
* Review [managing Codewind projects for Eclipse](https://www.eclipse.org/codewind/mdteclipsemanagingprojects.html). 

## What you have learned 

Now that you have completed this guide, you have:

1. Installed Codewind on your preference of VS Code or Eclipse.
2. Developed your own microservice using Codewind.
