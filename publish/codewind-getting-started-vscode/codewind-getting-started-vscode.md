---
permalink: /guide/codewind-getting-started-vscode/
layout: guide-markdown
title: Getting Started with Codewind and VS Code
duration: 30 minutes
description: Take advantage of Codewind's tools to help build high quality cloud native applications with the VS Code IDE.
tags: ['kabanero', 'appsody', 'codewind', 'microservice']
guide-category: basic
---

## Objectives

### Learning objectives

In this guide, you will learn how to develop a simple microservice with Visual Studio Code (VS Code), using Eclipse Codewind, an open source project, which provides IDE extensions. Codewind provides the ability to create new projects based on application stacks that can be customized to meet your company's policies and consistently deploy applications and microservices at scale.

## Overview   

Application stacks enable the development and optimization of containerized microservice applications. Public stacks for Open Liberty, Springboot, Node.js, and Node.js with Express can be customized to suit local requirements. Codewind provides the ability to create application projects from these stacks, enabling developers to focus on their code and not infrastructure and Kubernetes.

## Developing with VS Code

You can use Codewind for VS Code to develop and debug your containerized projects, using the workflow you already use today.

### Prerequisite

Before you can develop a microservice with VS Code, you need to:

* [Install Docker](https://docs.docker.com/install/)
    * **Note:** Make sure to install or upgrade to minimum Docker version 19.03.
* [Install VS Code](https://code.visualstudio.com/download)
* [Install Codewind for VS Code](https://kabanero.io/docs/ref/general/installation/installing-dev-tools.html#installing-codewind-for-vs-code)

### Configuring Codewind to use application stacks

Configure Codewind to use Appsody templates so you can focus exclusively on your code. These templates include stacks that you can use to follow this guide. Complete the following steps to select the Appsody templates:

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
4. Choose the `Open Liberty (Default templates)`.
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

* Learn more about [Codewind](https://www.eclipse.org/codewind/).
* Review [project commands for Codewind for VS Code](https://www.eclipse.org/codewind/mdt-vsc-commands-project.html).

## What you have learned

Now that you have completed this guide, you have:

1. Installed Codewind on VS Code.
2. Developed your own microservice using Codewind.
