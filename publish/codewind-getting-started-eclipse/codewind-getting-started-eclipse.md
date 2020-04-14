---
permalink: /guide/codewind-getting-started-eclipse/
layout: guide-markdown
title: Getting Started with Codewind and Eclipse
duration: 30 minutes
description: Take advantage of Codewind's tools to help build high quality cloud native applications with the Eclipse IDE.
tags: ['kabanero', 'appsody', 'codewind', 'microservice']
guide-category: basic
---

## Objectives

### Learning objectives

In this guide, you will learn how to develop a simple microservice with Eclipse, using Eclipse Codewind, an open source project, which provides IDE extensions. Codewind provides the ability to create new projects based on application stacks that can be customized to meet your company's policies and consistently deploy applications and microservices at scale.

## Overview   

Application stacks enable the development and optimization of containerized microservice applications. Public stacks for Open Liberty, Springboot, Node.js, and Node.js with Express can be customized to suit local requirements. Codewind provides the ability to create application projects from these stacks, enabling developers to focus on their code and not infrastructure and Kubernetes.

## Developing with Eclipse

You can use Codewind for Eclipse to develop and debug your containerized projects, using the workflow you already use today.

### Prerequisite

Before you can develop a microservice with Eclipse, you need to:

* [Install Docker](https://docs.docker.com/install/)
    * **Note:** Make sure to install or upgrade to minimum Docker version 19.03.
* [Install Eclipse](https://www.eclipse.org/downloads/packages/release/)
    * **Note:** Make sure to install or upgrade to mimimum Eclipse version 2019-09 R (4.13.0).
* [Install Codewind for Eclipse](https://kabanero.io/docs/ref/general/installation/installing-dev-tools.html#installing-codewind-for-eclipse)

### Configuring Codewind to use application stacks

Configure Codewind to use Appsody templates so you can focus exclusively on your code. These templates include stacks that you can use to follow this guide. Complete the following steps to select the Appsody templates:

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

1. Right-click `Local [Running]` under `Codewind` in the `Codewind` tab.
2. Select `+ Create New Project...`
    * **Note:** Make sure Docker is running. Otherwise, you get an error.
3. Name your project `appsody-calculator`.
4. Under `Template`, select `Appsody Open Liberty template`. 
    * If you don't see an Appsody template, select the `Manage Template Sources...` link at the end of the window.
    * Select the `Appsody Stacks - appsodyhub` checkbox.
    * Click `OK`.
    * The templates are refreshed, and the Appsody templates are available.
5. Click `Finish`.
    * To monitor your project's progress, right-click on your project, and select `Show Log Files`.
    * Select `Show All`. Then a `Console` tab is displayed where you see your project's build logs.

Your project is displayed in the `Local [Running]` section. The progress for creating your project is tracked next to the project's name.

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

* Learn more about [Codewind](https://www.eclipse.org/codewind).
* Review [managing Codewind projects for Eclipse](https://www.eclipse.org/codewind/mdteclipsemanagingprojects.html).

## What you have learned

Now that you have completed this guide, you have:

1. Installed Codewind on Eclipse.
2. Developed your own microservice using Codewind.
