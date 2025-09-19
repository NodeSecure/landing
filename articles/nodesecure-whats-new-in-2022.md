---
title: NodeSecure - What's new in 2022 ?
description: TBC
author: fraxken
date: 07/02/2022
---

Hello 👋,

Back for a different article than usual. This is the opportunity for me to talk about the NodeSecure project and to tell you about what's new since the beginning of the year 💃.

The project has grown significantly and we are now several active contributors on the project 😍. This opens up great opportunities for the organization and our tools as a whole.

Above all, many thanks to all those who participate in this adventure 😘. If you also follow the project and want to contribute and learn, do not hesitate 🙌.

## Release 1.0.0 🚀
We have moved and renamed the main project. It became necessary to bring the project into the org to allow everyone to discover our other tools.

Now available on the NodeSecure github under the **cli** name. The old package has been deprecated and the new release can be downloaded with the name `@nodesecure/cli`.

Changing the name was necessary. It all started with one tool but now NodeSecure is a family of tools, contributors 👯 etc.

This also marks the beginning of the first major release 🎉.

```bash
$ npm install -g @nodesecure/cli
``` 

{% github NodeSecure/cli %}

And by the way: this new release include support for Workspaces with the `cwd` command 😎.

## NodeSecure ci 📟

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5xdmuy9dab5ggkyrkcnc.gif) 
 
A remarkable work from [Antoine](https://github.com/antoine-coulon) who has been actively working on the project for a good month 💪. This will bring a whole new dimension to the NodeSecure project and meet to at least some needs long requested by developers.

He wrote an article to present the tool and explain how to set it up 👀, I recommend you to read it:

{% link https://dev.to/antoinecoulon/make-your-javascript-project-safer-by-using-this-workflow-403a %}

There is still work to do, don't hesitate to come and contribute to this beautiful project which promises a lot for the future.

{% github NodeSecure/ci %}

## NodeSecure preview

Working on security accessibility for developers within the JavaScript ecosystem is important to us.

This is why [Tony Gorez](https://tonygo.dev/) has taken it upon himself to design the Preview project which will allow to scan online npm packages. We still have some difficulties to put it online but we are working on it.

The goal of the project is to highlight some of the benefits and metrics reported by the NodeSecure tools and why not make more developers sensitive to security subjects.

{% github NodeSecure/preview %}

## NodeSecure authors

In light of the recent events with Marak Squares it is I think quite important to have some insight on the maintainers of the packages we use.

{% link https://dev.to/fraxken/detect-marak-squires-packages-with-nodesecure-3lpo %}

We must have better tools to warn developers in case of incident like Faker. But also to highlight these maintainers who also need funding.

This could also allow some developers to realize the dependence they have on certain projects and why not encourage them to contribute to help.

That's why we are working on a new package with [Vincent Dhennin](https://github.com/Kawacrepe) to optimize and fetch additional metadata for package authors. 

{% github NodeSecure/authors %}

Our goal is to implement these improvements in future releases of Scanner. I'm excited about this because personally I like to get to know the maintainers of the packages I use.

## NodeSecure RC

We are working on adding a [runtime configuration](https://github.com/NodeSecure/rc) for our tools (especially the CI project).

```ts
import assert from "node:assert/strict";
import * as RC from "@nodesecure/rc";

const writeOpts: RC.writeOptions = {
  payload: { version: "2.0.0" },
  partialUpdate: true
};

const result = (
  await RC.write(void 0, writeOpts)
).unwrap();
assert.strictEqual(result, void 0);
```

This should improve the experience for many of our tools where we had a CLI with complex settings and commands or pseudo configuration within the project (like report).

---

That's it for this article. We continue to work and listen to your various feedbacks to improve our tools.

See you soon for another article 😉. 

Best Regards,
Thomas
