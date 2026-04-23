import {expect, test} from '@playwright/test';
test('Window handling',async({page})=>{
//Step 1. Launch Chromium in non-headless mode (done via CLI: `npx playwright test --headed`)

//Step 2. Go to leafground page   
    await page.goto("https://www.leafground.com/frame.xhtml")

//Step 3. Interact with the Click Me button inside frame
const frame1 = page.frameLocator('iframe').first();
const button1 = frame1.getByRole('button', {name: 'Click Me'}).first();
await button1.click();

//Step 4. Assert the text changed after clicking the button
const frame1TextLocator=frame1.locator('#Click');
const frame1Text=await frame1TextLocator.textContent();
console.log("frame1Text: ",frame1Text);     
await expect(frame1TextLocator).toHaveText('Hurray! You Clicked Me.'); // Assertion to verify the text change   

//Step 5. Get the total count of frames present in the page
const framesCount=page.frames().length;
console.log("Total frames in the page: ",framesCount);

//Step 6. Interact with the Click Me button present inside the nested frames
const outerFrame=page.frameLocator('iframe[src*="page.xhtml"]'); //locating outer frame using src attribute
const innerFrame=outerFrame.frameLocator('#frame2');
await innerFrame.getByRole('button', {name: 'Click Me'}).first().click();

//Step 7. Assert the text changed after clicking the button inside nested frame
const frame2TextLocator=innerFrame.locator('#Click');
const frame2text=await frame2TextLocator.textContent();
console.log("Nested frame test: ",frame2text);
await expect(frame2TextLocator).toHaveText('Hurray! You Clicked Me.'); // Assertion to verify the text change
}); 