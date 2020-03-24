# Contributing to the Kabanero.io Guides
Each guide resides in its own directory in this repository. This repository is dynamically pulled into kabanero.io via the build process. The content of the guide can be written in HTML, markdown, or AsciiDoc formats.  Markdown is preferred; use asciidoc only if you will be using features that you cannot do in markdown.

## Get Started

1. Fork this repo and clone your fork to your machine.
1. Create a directory for your guide under the `drafts` section of this repo. Name the directory the same name as your guide.
   - Keep this name in mind. It must mach the `permalink` in the front matter explained below

### Front Matter

The following front matter variables must be set as the first thing in each AsciiDoc:
```
---
permalink: /guides/appsody-getting-started/
---
:page-layout: guide
:page-duration: 40 minutes
:page-releasedate: 2019-09-19
:page-description: Explore how to use the Appsody CLI to create, run, update, deploy, and deliver cloud native microservices.
:page-tags: ['Appsody', 'Java', 'MicroProfile', 'Stack']
:page-guide-category: stacks
= Your Guide Title
```

If using markdown the same front matter would look like:
```
---
permalink: /guides/appsody-getting-started/
layout: guide-markdown
title: Your Guide Title
duration: 40 minutes
releasedate: 2019-09-19
description: Explore how to use the Appsody CLI to create, run, update, deploy, and deliver cloud native microservices.
tags: ['Appsody', 'Java', 'MicroProfile', 'Stack']
guide-category: stacks
---
```

* **permalink**
   * The naming convention for `permalink` is `/guides/` followed by the same name of the directory you created (your guides name). The trailing slash `/` is needed, double check it's added.
      * For example, the appropriate `permalink` for a guide in the directory `draft/appsody-get-started` would be `/guides/appsody-get-started/`
* **page-layout / layout**
   * The layout for the content of the guide. `guide` is the normal layout.
   * To use a layout that includes a code column on the side, use `guide-multipane` (supported only with AsciiDoc).
* **page-duration / duration**
   * The expected time it would take a reader to complete the guide.
* **page-releasedate / releasedate**
   * The expected release date of the guide. Do not put this date in the future, its okay if the guide doesn't go out exactly on that date.
* **page-description / description**
   * A description of your guide. What the user would expect to learn upon completing this guide.
* **page-tags / tags**
   * Tags related to the guide. See approved tags below.
* **page-guide-category / guide-category**
   * A single category for this guide. The categories map to the headers/rows on the /guides page.
* **= / title**
   * A title for your guide.
* (Optional) **page-related-guides / related-guides**
   * An array of strings that are a portion of the `permalink` of other related guides. Guides added in this way will be linked in the `Where to next?` section that can be found at the bottom of every guide. To link a guide, use its `permalink` value without the leading `/guides/` and the trailing `/`. For example, if you want to link to the guide with permalink `/guides/appsody-getting-started/` then on your guide's front matter you would append `:page-related-guides: ['appsody-getting-started']`. A maximum of six related guides can be displayed for any given guide.
   * For markdown source, the front matter requires a `yaml` array, for example:

   ```yaml
      related-guides:
      - guide1
      - guide2
   ```

#### Approved Tags
* Stack
* Nodejs
* Express
* Java
* MicroProfile
* Spring
* Spring Boot
* Tomcat
* Appsody
* CLI

#### Approved Categories
* basic
* stacks
* none

More categories will be added here

### Add Images to your Guide

If you want to add images to your guide you can put them in your guide repository.

* Image Location
   * Create a directory in your guide repository called `assets` and put them in there.
      * These images get copied over to the sites `src/main/content/img/guide/` directory during build.

* Image Naming
   * You should include the name of your guide in the name your image to prevent image naming conflicts from other guide repositories.

* Image Reference
   * You can reference the images in your guides, as shown in the following examples:
      * AsciiDoc format: `image::/img/guide/name_of_your_image.png[link="/img/guide/name_of_your_image.png" alt="Your image alt text"]`
      * Markdown format:`![Your image alt text](/img/guide/name_of_your_image.png)`

# Render a Guide locally

Once you have your local development environment setup you can render guides as your write them.

## Prereqs
* [Local development setup](https://github.com/kabanero-io/kabanero-website/blob/master/CONTRIBUTING.md#local-development-setup)

## Render your guide

1. Create a new dir called `guides` under `src/main/content/`
1. Inside the new `guides` dir, make a new folder and name it the same as the name for your guide.
1. Create the `name_of_your_guide.adoc` (or .md) in that newly created folder and place your content in there.
1. Copy any images that you are using in your guide to the `src/main/content/img/guide` directory.
   * Note- this is done automatically during website build, but is needed during local development.
1. Start your local dev server and go to `https://localhost:4000/guides` to see all the guides rendered.
