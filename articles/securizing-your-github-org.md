---
title: Securizing your GitHub org
description: Learn hands-on strategies and real-world tips to boost the security of your GitHub organization. Perfect for open source maintainers and anyone serious about code safety!
author: fraxken
date: 19/02/2023
---

Hello 👋

I started open source a bit naively (like everyone I guess 😊).

But the more I progress and the more important/popular some of my projects become 😎. That's great, but at some point you have to **deal** with a lot of things **related to security** (like Vulnerability disclosure).

You start to hear and see a lot of **scary stories** around you 😱. Not to mention all the **acronyms** where you don't understand anything at first 😵 (VMT, CVE, SAST, SCA, CNA ...).

As I was working on an open source security project, I put pressure on myself to be ready. Also as a member of the [Node.js Security WG](https://github.com/nodejs/security-wg) I thought it was an interesting topic and that I was probably not the only one who was worried about not being up to the task 😖.

So I rolled up my sleeves and tackled the problem 💪. Here is my feedback/journey on how I improved the security of my [NodeSecure](https://github.com/NodeSecure) GitHub organization.

> 👀 We use Node.js and JavaScript (but most recommendations are valid for other ecosystems).

## Security Policy and Vulnerability Disclosure

Adding a root `SECURITY.md` file explaining how developers and security researchers should report vulnerability is important. You don't want a security threat to **be turned into a public issue** (This gives you time to analyze and possibly fix **before disclosure**).

> ⚠️ If you are a developer, never report a security threat using a public GitHub issue. **This is a serious mistake**. This could even put your business/team at **risk**.

I don't want to bullshit you, so let me share with you the **OpenSSF guide** that helped me set up my first reporting strategy: [Guide to implementing a coordinated vulnerability disclosure process for open source projects](https://github.com/ossf/oss-vulnerability-guide/blob/main/maintainer-guide.md).

I started from scratch by reading this guide and taking inspiration from [their templates](https://github.com/ossf/oss-vulnerability-guide/tree/main/templates) 🐤. As a small open source team we don't especially have DNS or mail servers (not even a defined **V**ulnerability **M**anagement **T**eam A.K.A **VMT**).

I was a bit puzzled to put my personal email as I'm not alone 😟. 

I quickly learned that Github added a new feature [to report/create private security issue](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability) 😍. You can enable it in the `Security` tab (I think it's also now possible to enable it on every repositories at once).

And this is what it finally looks like:
![NodeSecure SECURITY.md](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/imqmjdj2ewiiud0bpmbs.png)

## Use OpenSSF scorecard

![scorecard](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7kdfnqxjora14q8eil20.png)

The [OSSF scorecard](https://securityscorecards.dev/) initiative is really good to assess your project against security best practices. [I am not the first to write about this](https://devopsjournal.io/blog/2022/12/08/Adding-OSSF-scorecard-action-to-your-repo).

You can easily setup the GitHub action workflow by following those [instructions](https://github.com/ossf/scorecard-action#installation).

Once configured, you will have a set of alerts available in the `Security` tab.

![Scorecard scanning alerts](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i0tib69edbeitcsoomec.png)

This will give you an overview of the different subjects to improve (workflows, dependencies etc). Each of these alerts contains a full description of the actions to be taken to fix the problem.

![OSSF Scorecard](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/000q8acla8raunyu8kva.png)

I have personally used these recommendations to dig and train myself. The next chapters will help you improve your score.

> 📢 By the way [NodeSecure CLI](https://github.com/NodeSecure/cli) has a first-class support of the scorecard.

## 🔓 Enable branch protection
I am a bad student 😳. Almost all of my projects had no branch protection on the `main` / `master` branch 🙈.

> To set up the protection, go to `Settings` > `Branches` and edit your main branch. 

GitHub has quite a few options on the subject 😵. If you don't know what to choose in terms of options, **don't check anything** (it's **ok** to begin ✔️).

If you want to be more restrictive, be **careful** because it could block you (some options are only viable in projects with many contributors/reviewers).

As far as I am concerned I often choose:
- Require a pull request before merging
- Require conversation resolution before merging
- Require status checks to pass before merging

## 🐲 Workflows Hardening
I fell down when I saw all that it was necessary to know to secure workflows with GitHub actions 😲.

- You must pay attention to the [permissions granted to your jobs / GITHUB_TOKEN](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs)
- [Ensure your GitHub Actions are pinned to a SHA](https://michaelheap.com/ensure-github-actions-pinned-sha/)
- Hardening the runner (see the [StepSecurity HardenRunner](https://blog.stepsecurity.io/announcing-general-availability-of-harden-runner-a7597a1410da))
- Probably a lot of other stuff I haven't had time to see yet 😆

Fortunately there is a [great free online tool](https://app.stepsecurity.io/) that help you by doing all the hard work (it will open a pull-request and automatically fix issues).

{% tweet https://twitter.com/fraxken/status/1617557370728767488 %}

The tool was created by [StepSecurity](https://www.stepsecurity.io/). I had the opportunity to talk with the CEO and they listen to the maintainers which is really cool. 
Thanks to them ❤️!

## Configure Dependabot

It is recommended to use [Dependabot](https://github.blog/2020-06-01-keep-all-your-packages-up-to-date-with-dependabot/) for updating your dependencies and GitHub actions (yes, it also supports updating workflows in a secure way 😍).

You only need to add a `.github/dependabot.yml` config file. Personally I recommend a **weekly** interval (with a lot of projects **daily is a bit horrible**).

```yml
version: 2
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly

  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
```

The StepSecurity tool we have seen in the previous chapter is also capable of doing it 🚀. 

---

Also, think to enable [Dependabot alerts](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts) in the `Security` tab. This will allow the bot to open pull-request to fix known vulnerabilities by looking at your dependencies (**referenced in package.json or others**).

## 🔬 Adding CodeQL scanning

To enhance security even more you can add a [SAST](https://snyk.io/learn/application-security/static-application-security-testing/) tool like [CodeQL](https://codeql.github.com/). Like scorecard it will report security scanning alert but for your codebase.

Here an example:
![prototype-pollution](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qsycrb5ew1tztvr7rj6z.png)

A great way to make sure that newly added code does not contain vulnerabilities that were **obvious to detect**.

> 👀 Note that once again StepSecurity can set up the workflow for you.

## 📜 Enable Security advisories (and others)

Github Security tab as a lot of cool features that help you maintain the security of your project. If you have followed all my previous chapters, most of them should be enabled now.

Make sure to also enable `Secret scanning alerts`.

![Github Security](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/utrx752lf9m382tbpunn.png)

For an organization many of these parameters can be forced on all repositories. Go to `Settings` > `Code security and analysis`. You will have the options to enable/disable all.

![Github Security](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a8f5cpwva9te0m15yb0s.png)

## 💡 OpenSSF Best Pratices program

Previously known as CII-Best-Practices, this program indicates that the project uses a set of security-focused best development practices for open source software.

So I registered my first project on the [website](https://bestpractices.coreinfrastructure.org/en). It was a good surprise because it allowed me to question the quality of my documentation and tests 😬.

Seeing the different levels and questions really helps you think about what you're missing (and possibly learn about the concepts you don't know about yet.. Like [SBOM](https://snyk.io/blog/building-sbom-open-source-supply-chain-security/)).

![CII-Best-Practices](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9pn6g2gcoyelkniwopy0.png)

I am still working on completing the first step/badge for the CLI project which now has a score of **8.7** out of **10** 🎉 on the OpenSSF scorecard.

## 🎯 Conclusion

That's it for this article. I've covered what I've done/learned in the last couple of months. Here are some really cool additional links 💃:

- [Concise Guide for Evaluating Open Source Software 2023-01-03](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Concise-Guide-for-Evaluating-Open-Source-Software.md#readme)
- [Concise Guide for Developing More Secure Software 2023-01-03](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Concise-Guide-for-Developing-More-Secure-Software.md#readme)

If you work with NPM, I invite you to read our latest article about package managers:

{% link https://dev.to/nodesecure/everything-you-need-to-know-package-managers-286c %}

Obviously, I probably **still have a lot to learn**. But I hope this will help other maintainers/developers ❤️.

🙏 Thanks for reading me 🙏
