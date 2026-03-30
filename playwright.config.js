// @ts-check
import { defineConfig, devices } from '@playwright/test';

const config = ({
  testDir : './tests', // for ui tests
  // testDir : './api-tests', // for api tests
  // reporter : 'html',
  timeout : 40000,
  expect: {
    timeout : 10000
  },
  // reporter : 'html', // line, dot, list, junit, json, html
  reporter : [['html', {outputFolder:'playwright-report'}], ['allure-playwright']],
  // projects : [
  //   // {
  //   //   name : 'Desktop' ,
  //   //   use : {}
  //   // }
  //   // ,
  //   {
  //     name : 'Mobile',
  //     use : {...devices['iPhone 14 Pro Max']}
  //   }
  // ],
  // add base url 
  use : {
    baseURL : 'https://www.amazon.in',  // ui
    // baseURL : 'https://restful-booker.herokuapp.com', // api
    browserName : 'chromium',
    headless : false,
    viewport : null,
    launchOptions : {
      args : ['--start-maximized']
    },
    screenshot : 'only-on-failure', 
    video : 'retain-on-failure', 
    trace : 'retain-on-failure'
  }
})
module.exports = config;
