// @ts-check
import { defineConfig, devices } from '@playwright/test';

const config = ({
  testDir : './tests',
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
    // baseURL : 'https://www.amazon.com/', // for test case1
    // baseURL : 'https://www.amazon.in',  // for test case 2, 3, 4 & 5
    baseURL : 'https://restful-booker.herokuapp.com', // test case 6
    browserName : 'chromium',
    headless : false,
    viewport : null,
    launchOptions : {
      args : ['--start-maximized']
    },
    screenshot : 'only-on-failure',
    video : 'retain-on-failure',
    trace : 'on-first-retry'
  }
})
module.exports = config;