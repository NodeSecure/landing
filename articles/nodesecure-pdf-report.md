---
title: NodeSecure PDF Report
description: TBC
author: fraxken
date: 30/07/2020
---

Hello,

I had promised a little while ago to write an article about a [SlimIO project](https://github.com/SlimIO/Security) that allows the generation of HTML & PDF security reports. It uses the [Node-secure](https://github.com/ES-Community/nsecure) project API under the hood to fetch security data of npm packages and git repositories!

The initial objective was obviously to be able to automate the regular sending of a report on a set of projects (especially for our SlimIO agent packages and git). This provides an overview of the status of several projects on a regular basis.

The project is completely open-source and works with any npm/github organization. The git support has only been tested with github but it most likely works for gitlab as well.

What's the report look like?

![](https://i.imgur.com/EBFE3d4.jpg)
![](https://i.imgur.com/zmymlke.jpg)
![](https://i.imgur.com/MbTssTg.jpg)

# Data

All the data displayed in the report comes from Node-secure. The analysis is separated into two parts: npm packages and git repositories.

For each of them, the report will give you an assessment of:
- The size (external, internal, all).
- The dependency list.
- The list of dependency with [transitive (deep)](https://snyk.io/blog/78-of-vulnerabilities-are-found-in-indirect-dependencies-making-remediation-complex/) dependencies.
- The list of Node.js core modules used in these projects.
- The list of authors (with their gravatar if available).
- Charts about extensions, licenses, warnings and flags.

> At the moment I am not satisfied with the granularity of the information in graphics. I will work in the future to get a more accurate overview...

# Configuration

You just need to edit the configuration at `data/config.json` and run the project with the `npm start` command to go!

```json
{
    "theme": "dark",
    "report_title": "SlimIO Security Report",
    "report_logo": "https://avatars0.githubusercontent.com/u/29552883?s=200&v=4",
    "npm_org_prefix": "@slimio",
    "npm_packages": [
        "@slimio/addon",
        "@slimio/scheduler",
        "@slimio/config",
        "@slimio/core",
        "@slimio/arg-parser",
        "@slimio/profiles",
        "@slimio/queue",
        "@slimio/sqlite-transaction",
        "@slimio/alert",
        "@slimio/metrics",
        "@slimio/units",
        "@slimio/ipc",
        "@slimio/safe-emitter"
    ],
    "git_url": "https://github.com/SlimIO",
    "git_repositories": [
        "Aggregator",
        "Alerting",
        "Socket",
        "Gate",
        "ihm"
    ],
    "charts": [
        {
            "name": "Extensions",
            "display": true,
            "interpolation": "d3.interpolateRainbow"
        },
        {
            "name": "Licenses",
            "display": true,
            "interpolation": "d3.interpolateCool"
        },
        {
            "name": "Warnings",
            "display": true,
            "type": "horizontalBar",
            "interpolation": "d3.interpolateInferno"
        },
        {
            "name": "Flags",
            "display": true,
            "type": "horizontalBar",
            "interpolation": "d3.interpolateSinebow"
        }
    ]
}
```
 The theme can be either `dark` or `light`. Themes are editable/extendable at **public/css/themes**. (feel free to PR new themes etc).

The `npm_org_prefix` is only useful to determine whether or not the package is internal or external.

---

Charts only have four properties: `name`, `display`, `type` and `interpolation`. Interpolation is the function used for the chart background colors (all possible interpolation can be found [on the D3 doc](https://github.com/d3/d3-scale-chromatic/blob/master/README.md)).

The `type` is by default equal to **bar**. You can configure it at **horizontalBar** or **pie**. (note: not worked much on pie support).

# What's next?

I'm already pretty happy with the initial result but there's still a lot of work to be done. Some of the improvements I have in mind include:

- A more complete and flexible configuration.
- A better PDF generation (There are a lot of problems between the HTML and PDF versions).
- Continue to improve the design of the report (both UI and UX).
- Enhance the GIT config (allow local path and complete GIT url).
- Add some modules to forward the report to an email or anything else (slack, discord etc.).

All contributions are of course welcome!

# Conclusion

![](https://s7.gifyu.com/images/nsecure_report.gif)

As usual a great pleasure for me to extend the use of Node-secure and to be able to collect a set of statistics on my projects (it's always exciting to discover hidden things.).

I'm also quite happy that this project can be used by different companies (even if for the moment there is still some work to be done).

https://github.com/SlimIO/Security

Thank you for taking the time to read!

Best Regards,
Thomas
