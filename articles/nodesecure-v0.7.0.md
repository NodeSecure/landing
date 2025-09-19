---
title: NodeSecure v0.7.0 and v0.8.0@next
description: TBC
author: fraxken
date: 12/09/2020
---

Hi,

I'm writing this article a bit late because version 0.7.0 has already been published 3 months ago. So I'm going to take this opportunity to make the link with the next version already testable with the **@next** tag.

For those who don't know the tool yet: https://github.com/ES-Community/nsecure#about

# Version 0.7.0
Let's discover the new features of version 0.7.0

## verify command CLI output
The command now work with CLI. Although it will certainly require some iteration and long-term work to improve the stdout.

> As a reminder, this command allows you to have a much more complete report of the result of the AST analysis for a given npm package.

![](https://i.imgur.com/pdSXZS5.png)

## Popups improvement

Warnings and licenses popups design has been enhanced. Also the tables in these popups will now by default be filterable when clicking on a column name.

## Warnings popup new features

The warnings popup has been greatly improved with:
- New top buttons to allow you to quickly browse the sources on npm and unpkg.
- A search input when there a lot of warnings.
- Clicking on the name of the file now opens it on unpkg..

![](https://i.imgur.com/oYcARuk.png)

## New way to walk the tree with cwd command

Before the **cwd** command was walking the tree in the same way as the **from** command. It was however impossible to get the tree from the package-lock.json file.

This release will now read and walk with the local package-lock.json by default (can always be disabled using an option).

## Lot of hotfix and code refactoring
This version includes a lot of bugfixes and code improvements of all kinds.

---

# Version @next (v0.8.0)

This version is still under development but brings important improvements.

## @npmcli/arborist
In the previous version we used a home-made implementation to browse package-lock.json. But now we use one of the new npm packages: [@npmcli/arborist](https://www.npmjs.com/package/@npmcli/arborist).

The implementation of this version is much faster and accurate.

## It never end
We corrected an issue that caused CLI in some cases to never complete the analysis. The process was blocked indefinitely and the counters stopped moving.

## JS-X-Ray 2.0

😱😱😱! This new version of Node-secure includes the latest version of JS-X-Ray.

I wrote a whole article recently about this new version that I highly recommend you to read if you haven't already done so: https://dev.to/fraxken/js-x-ray-2-0-1mk0

---

# What's next ?

- New `:size` filter for the searchbar (already implemented on master).
- Verify command now work for local project too (already implemented on master).
- I'm working on the possibility to draw the network tree with D3.js instead of Vis.js (The idea is to achieve a much more complete experience).
- Maybe a new flag to identify native addon.
- Continue to iterate on all current features.

> Don't hesitate to provide us feedbacks which are precious to us to improve or invent functionalities.

# Conclusion

The project continues to move forward little by little and I'm still very satisfied with the tool.. And I hope that the people who follow and use it are are also satisfied.

Thanks for reading !

Best Regards,
Thomas
