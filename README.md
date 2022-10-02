# gist: AI Web Page Summary

## Description

**gist** is a Safari Extension that uses OpenAI GPT3 AI to create a summary of the webpage you are browsing.

**gist** is not "production" ready and it will not be published on the App Store.

Goal of the project was to get familiar with the Apple development ecosystem, as well as learn Swift and web programming.

## Limitations

- GPT3 summary can be hit or miss.
- GPT3 parameters are hardcoded.
- There is no consideration for the text length so prompts can fail if they exceed maximum allowed limit.
- Mozilla Readability does not do a great job in extracting main text body from the web page.
- Loading Mozilla Readability on the fly from Skypack can fail on certain websites due to their Content Security Policy.
- Extracted webpages are not sanitized.
- No error communication unless in debug mode.
