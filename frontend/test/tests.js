const {By, Builder, Browser, logging} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const assert = require("assert");
const {Select} = require('selenium-webdriver');

// there must be a superuser created with these login credentials
// so that the selenium driver can login to the application to test the front end
const test_username = 'admin';
const test_password = 'admin';

// Sources:
// https://www.selenium.dev/documentation/overview/

describe("Admin Tests", function() {

    // setup driver, enable headless to run tests without opening browser
    let options = new firefox.Options();
    options.setLoggingPrefs(logging.Type.BROWSER, logging.Level.ALL);
    //options.addArguments('--headless'); // enable to run without browser popping up

    let driver = new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(options)
        .build();

    driver.manage().setTimeouts({implicit: 500});
    driver.manage().window().maximize();

    // close driver browser after all tests are done
    after(async () => await driver.quit());

    //// LOGIN TEST
    it('Login to dashboard', async function() {
        await Login(driver);

        // this is the URL that the user should be redirected to after logging in
        var dashboardUrlExpected = "http://localhost:3000/admin-dashboard";

        // check current url to make sure we are on dashboard/home page after logging in
        let dashboardUrl = await driver.getCurrentUrl();
        assert.strictEqual(dashboardUrl, dashboardUrlExpected);
      });

    //// CREATE ACADEMIC YEAR TEST
    it ('Create new academic year', async function(){
        // go to the add a new parent page
        await GoToPage(driver, 'http://localhost:3000/admin/settings');

        // make sure the page loaded
        let pageURLExpected = "http://localhost:3000/admin/settings";
        let currentURL = await driver.getCurrentUrl();
        assert.strictEqual(currentURL, pageURLExpected);

        // get the year field
        let year = await driver.findElement(By.id('create-year'));

        // send data to year field
        await year.sendKeys('2024');

        // click on create year button
        await driver.findElement(By.id('create-year-btn')).click();
        await driver.sleep(2000);
        await driver.navigate().refresh();

        // get select year dropdown
        let selectYearDropdown = await driver.findElement(By.id('select-year'));

        // select the new year we created
        await selectYearDropdown.click();
        await driver.findElement(By.id('year-2024')).click();
        await driver.sleep(1000);

        // click on update year button
        await driver.findElement(By.id('update-year-btn')).click();
        await driver.sleep(1000);

        // check to see if year was created
        let yearXpath = "//div[text()='2024-25']";
        let yearExists = (await driver.findElements(By.xpath(yearXpath))).length != 0;
        assert.equal(yearExists, true); 
    });


    //// ADD A NEW PARENT TEST
    it('Add a new parent', async function() {

        // go to the add a new parent page
        await GoToPage(driver, 'http://localhost:3000/parent-form');

        // make sure the page loaded
        let pageURLExpected = "http://localhost:3000/parent-form";
        let currentURL = await driver.getCurrentUrl();
        assert.strictEqual(currentURL, pageURLExpected);

        // get the parent form fields
        let username = await driver.findElement(By.id('parent-username'));
        let password = await driver.findElement(By.id('parent-password'));
        let address = await driver.findElement(By.id('address'));
        let city = await driver.findElement(By.id('city'));
        let provinceDropdown = await driver.findElement(By.id('province'));
        let postalCode = await driver.findElement(By.id('postal-code'));
        let email = await driver.findElement(By.id('parent-email'));
        let cellPhone = await driver.findElement(By.id('cell'));
        let homePhone = await driver.findElement(By.id('home'));
        let workPhone = await driver.findElement(By.id('work'));
        let firstName = await driver.findElement(By.id('parent-first-name'));
        let lastName = await driver.findElement(By.id('parent-last-name'));
        let chineseName = await driver.findElement(By.id('parent-chinese-name'));
        await driver.sleep(2000);

        // send data to the fields
        await firstName.sendKeys("TestParent");
        await lastName.sendKeys("TestParent");
        await address.sendKeys("Address");
        await city.sendKeys("City");
        await postalCode.sendKeys("A1B2C3");
        await username.sendKeys("pusername");
        await password.sendKeys("password");
        await email.sendKeys("First.Last@gmail.com");
        await chineseName.sendKeys("Test");
        await cellPhone.sendKeys("4035555555");
        await homePhone.sendKeys("4035555556");
        await workPhone.sendKeys("4035555557");
        await driver.sleep(2000);

        // click on the province dropdown and select the alberta option
        await provinceDropdown.click();
        await driver.findElement(By.id('ab')).click();
        await driver.sleep(2000);

        // click on register button
        await driver.findElement(By.id('register-parent-btn')).click();
        await driver.sleep(2000);

        // check to see if parent was added
        await GoToPage(driver, "http://localhost:3000/parent-list");
        let tableRowXpath = "//div[text()='TestParent']";
        let parentRowExists = (await driver.findElements(By.xpath(tableRowXpath))).length != 0;
        assert.equal(parentRowExists, true); 
    });

    // //// VIEW PARENT PROFILE TEST
    it('View parent profile', async function() {
        await GoToPage(driver, "http://localhost:3000/parent-list");
        let {tableRows, testRow, testRowColumns, userId} = await GetTableData(driver, "TestParent");

        // click on profile button
        await testRowColumns[1].click();
        await driver.sleep(2000);

        // check profile page is loaded
        pageURLExpected = `http://localhost:3000/parent-profile/${userId}`;
        currentURL = await driver.getCurrentUrl();
        assert.strictEqual(currentURL, pageURLExpected);
    });

    //// MODIFY A PARENT TEST
    it ('Modify a parent', async function() {
        await GoToPage(driver, "http://localhost:3000/parent-list");
        let {tableRows, testRow, testRowColumns, userId} = await GetTableData(driver, "TestParent");

        // click on profile button
        await testRowColumns[1].click();
        await driver.sleep(2000);

        // modify email field
        let email = await driver.findElement(By.id('parent-email'));
        email.clear();
        await email.sendKeys("Test.Test@gmail.com");

        // click on modify parent button
        await driver.findElement(By.className('modify-parent-btn')).click();
        await driver.sleep(1000);

        // check if email was modified
        await GoToPage(driver, "http://localhost:3000/parent-list");
        let tableRowXpath = "//div[text()='Test.Test@gmail.com']";
        let parentRowExists = (await driver.findElements(By.xpath(tableRowXpath))).length != 0;
        assert.equal(parentRowExists, true); 

    });

    //// ADD A NEW STUDENT TEST
    it('Add a new student', async function() {
        await GoToPage(driver, "http://localhost:3000/parent-list");
        let {tableRows, testRow, testRowColumns, userId} = await GetTableData(driver, "TestParent");

        // click on profile button
        await testRowColumns[1].click();
        await driver.sleep(2000);

        // click on add new child button
        await driver.findElement(By.className('add-child-btn')).click();
        await driver.sleep(2000);

        // make sure the student form page is loaded
        let pageURLExpected = "http://localhost:3000/student-form";
        let currentURL = await driver.getCurrentUrl();
        assert.strictEqual(currentURL, pageURLExpected);

        // get the student form fields
        let chineseName = await driver.findElement(By.id('student-chinese-name'));
        let firstName = await driver.findElement(By.id('student-first-name'));
        let lastName = await driver.findElement(By.id('student-last-name'));
        let genderDropdown = await driver.findElement(By.id('select-gender'));
        let address = await driver.findElement(By.id('address'));
        let city = await driver.findElement(By.id('city'));
        let provinceDropdown = await driver.findElement(By.id('province'));
        let postalCode = await driver.findElement(By.id('postal-code'));
        let dobXpath = '//*[@id="dob-picker"]/div/div/input';
        let dateOfBirth = await driver.findElement(By.xpath(dobXpath));
        await driver.sleep(2000);
        
        // send data to the fields
        await chineseName.sendKeys("TestChild");
        await firstName.sendKeys("TestChild");
        await lastName.sendKeys("TestChild");
        await address.sendKeys("Address");
        await city.sendKeys("City");
        await postalCode.sendKeys("A1B2C3");

            // click on the province dropdown and select the alberta option
        await provinceDropdown.click();
        await driver.findElement(By.id('ab')).click();
        await driver.sleep(2000);

        // click on dob and send data
        //await dateOfBirth.click();
        await dateOfBirth.sendKeys('20101010');

        // click on the gender dropdown and select the male option
        await genderDropdown.click();
        await driver.findElement(By.id('male-option')).click();
        await driver.sleep(2000);

        // accept consent 
        await driver.findElement(By.id('consent-yes-radio')).click();
        await driver.sleep(1000);

        // click on register student button
        await driver.findElement(By.id('register-student-btn')).click();
        await driver.sleep(2000);

        // check if student was created
        await GoToPage(driver, "http://localhost:3000/student-list");
        let tableRowXpath = "//div[text()='TestChild']";
        let childRowExists = (await driver.findElements(By.xpath(tableRowXpath))).length != 0;
        assert.equal(childRowExists, true); 
    });

    //// VIEW STUDENT PROFILE TEST
    it('View student profile', async function() {
        await GoToPage(driver, "http://localhost:3000/student-list");
        let {tableRows, testRow, testRowColumns, userId} = await GetTableData(driver, "TestChild");

        // click on profile button
        await testRowColumns[1].click();
        await driver.sleep(2000);

        // check profile page is loaded
        pageURLExpected = `http://localhost:3000/student-profile/${userId}`;
        currentURL = await driver.getCurrentUrl();
        assert.strictEqual(currentURL, pageURLExpected);
    });

    //// MODIFY A STUDENT TEST
    it ('Modify a student', async function() { 
        await GoToPage(driver, "http://localhost:3000/student-list");
        let {tableRows, testRow, testRowColumns, userId} = await GetTableData(driver, "TestChild");

        // click on profile button
        await testRowColumns[1].click();
        await driver.sleep(2000);

        // modify remarks field
        let remarks = await driver.findElement(By.id('remark-info'));
        remarks.clear();
        await remarks.sendKeys("test remarks");

        // click on modify student button
        await driver.findElement(By.id('update-btn')).click();
        await driver.sleep(1000);

        // check if remarks was modifed
        await GoToPage(driver, "http://localhost:3000/student-list");
        let tableRowXpath = "//div[text()='test remarks']";
        let studentRowExists = (await driver.findElements(By.xpath(tableRowXpath))).length != 0;
        assert.equal(studentRowExists, true); 
    });

    //// ADD A NEW TEACHER TEST
    it('Add a new teacher', async function() {

        // go to the add a new teacher page
        await GoToPage(driver, 'http://localhost:3000/teacher-form');
        await driver.sleep(2000);

        // make sure the page loaded
        let pageURLExpected = "http://localhost:3000/teacher-form";
        let currentURL = await driver.getCurrentUrl();
        assert.strictEqual(currentURL, pageURLExpected);

        // get the teacher form fields
        let username = await driver.findElement(By.id('username'));
        let password = await driver.findElement(By.id('password'));
        let address = await driver.findElement(By.id('address'));
        let genderDropdown = await driver.findElement(By.id('select-gender'));
        let city = await driver.findElement(By.id('city'));
        let provinceDropdown = await driver.findElement(By.id('province'));
        let postalCode = await driver.findElement(By.id('postal-code'));
        let email = await driver.findElement(By.id('email'));
        let cellPhone = await driver.findElement(By.id('cell'));
        let homePhone = await driver.findElement(By.id('home'));
        let workPhone = await driver.findElement(By.id('work'));
        let firstName = await driver.findElement(By.id('first-name'));
        let lastName = await driver.findElement(By.id('last-name'));
        await driver.sleep(2000);

        // send data to the fields
        await firstName.sendKeys("TestTeacher");
        await lastName.sendKeys("TestTeacher");
        await address.sendKeys("Address");
        await city.sendKeys("City");
        await postalCode.sendKeys("A1B2C3");
        await username.sendKeys("tusername");
        await password.sendKeys("password");
        await email.sendKeys("Test.Test@gmail.com");
        await cellPhone.sendKeys("4035555555");
        await homePhone.sendKeys("4035555556");
        await workPhone.sendKeys("4035555557");
        await driver.sleep(2000);

        // click on the province dropdown and select the alberta option
        await provinceDropdown.click();
        await driver.findElement(By.id('ab')).click();
        await driver.sleep(2000);

        // click on the gender dropdown and select the male option
        await genderDropdown.click();
        await driver.findElement(By.id('male-option')).click();
        await driver.sleep(2000);

        // click on register teacher button
        await driver.findElement(By.id('register-teacher-btn')).click();
        await driver.sleep(2000);

        // check if teacher was created
        await GoToPage(driver, "http://localhost:3000/teacher-list");
        let tableRowXpath = "//div[text()='TestTeacher']";
        let teacherRowExists = (await driver.findElements(By.xpath(tableRowXpath))).length != 0;
        assert.equal(teacherRowExists, true); 
    });

    // // VIEW TEACHER PROFILE TEST
    it('View teacher profile', async function() {
        await GoToPage(driver, "http://localhost:3000/teacher-list");
        let {tableRows, testRow, testRowColumns, userId} = await GetTableData(driver, "TestTeacher");

        // click on profile button
        await testRowColumns[1].click();
        await driver.sleep(2000);

        // check profile page is loaded
        pageURLExpected = `http://localhost:3000/teacher-profile/${userId}`;
        currentURL = await driver.getCurrentUrl();
        assert.strictEqual(currentURL, pageURLExpected);
    });

    //// MODIFY A TEACHER TEST
    it ('Modify a teacher', async function() {
        await GoToPage(driver, "http://localhost:3000/teacher-list");
        let {tableRows, testRow, testRowColumns, userId} = await GetTableData(driver, "TestTeacher");

        // click on profile button
        await testRowColumns[1].click();
        await driver.sleep(2000);

        // modify last name field
        let lastName = await driver.findElement(By.id('teacher-last-name'));
        await lastName.clear();
        await lastName.sendKeys("TestTeacherLast");

        // click on modify teacher button
        await driver.findElement(By.id('modify-btn')).click();

        // check if remarks was modifed
        await GoToPage(driver, "http://localhost:3000/teacher-list");
        let tableRowXpath = "//div[text()='TestTeacherLast']";
        let teacherRowExists = (await driver.findElements(By.xpath(tableRowXpath))).length != 0;
        assert.equal(teacherRowExists, true); 
    });

    // //// CREATE A NEW COURSE TEST
    it('Create a new course', async function() {

        // get the data for the teacher we created
        await GoToPage(driver, "http://localhost:3000/teacher-list");
        let {tableRows, testRow, testRowColumns, userId} = await GetTableData(driver, "TestTeacher");
        await driver.sleep(1000);

        // go to create course page
        await GoToPage(driver, "http://localhost:3000/course-form");
        
        // get the course form fields
        let courseLanguageDropdown = await driver.findElement(By.id('select-course-language'));
        let academicYearDropdown = await driver.findElement(By.id('select-academic-year'));
        let courseName = await driver.findElement(By.id('course-name'));
        let courseGrade = await driver.findElement(By.id('course-grade'));
        let teacherDropdown = await driver.findElement(By.id('select-teacher'));
        await driver.sleep(1000);

        // select option from course language
        await courseLanguageDropdown.click();
        await driver.findElement(By.id('course-lang-option-1')).click();
        await driver.sleep(1000);

        // select option from academic year
        await academicYearDropdown.click();
        await driver.findElement(By.id('year-2024')).click();
        await driver.sleep(1000);

        // select option from teacher
        await teacherDropdown.click();
        await driver.findElement(By.id(`teacher-id-${userId}`)).click();
        await driver.sleep(1000);

        // send data to the fields
        await courseName.sendKeys("TestCourse");
        await courseGrade.sendKeys(5);

        //click on create course button
        await driver.findElement(By.id('create-course-btn')).click();
        await driver.sleep(2000);

        //check if course was created
        await GoToPage(driver, "http://localhost:3000/course-list");
        let tableRowXpath = "//div[text()='TestCourse']";
        let courseRowExists = (await driver.findElement(By.xpath(tableRowXpath))).length != 0;
        assert.equal(courseRowExists, true); 
    });

    //// VIEW COURSE PROFILE TEST
    it('View course profile', async function() {

        // go to course list page
        await GoToPage(driver, "http://localhost:3000/course-list");
        let {tableRows, testRow, testRowColumns, userId} = await GetTableData(driver, "TestCourse");

        // click on profile button
        await testRowColumns[1].click();
        await driver.sleep(2000);

        // check profile page is loaded
        pageURLExpected = `http://localhost:3000/course/${userId}`;
        currentURL = await driver.getCurrentUrl();
        assert.strictEqual(currentURL, pageURLExpected);
    });

    // //// MODIFY A COURSE TEST
    // // it ('Modify a Course', async function() {
    // //     await Login(driver);
    // //     await GoToPage(driver, "http://localhost:3000/course-list");
    // //     let {tableRows, testRow, testRowColumns, userId} = await GetTableData(driver, "TestCourse");

    // //     // click on profile button
    // //     await testRowColumns[1].click();
    // //     await driver.sleep(2000);

    // //     // modify course name field
    // //     let courseName = await driver.findElement(By.id('course-name'));
    // //     await courseName.clear();
    // //     await courseName.sendKeys("TestCourse2");

    // //     // click on modify course button
    // //     await driver.findElement(By.className('modify-course-btn')).click();

    // //     // check if course name was modifed
    // //     await GoToPage(driver, "http://localhost:3000/course-list");
    // //     let tableRowXpath = "//div[text()='TestCourse2']";
    // //     let courseRowExists = (await driver.findElements(By.xpath(tableRowXpath))).length != 0;
    // //     assert.equal(courseRowExists, true); 
    // // });

    //// CREATE NEWSLETTER TEST
    // it('Create newsletter', async function() {
    //     // go to newsletter page
    //     await GoToPage(driver, "http://localhost:3000/create-newsletter");
    //     await driver.sleep(1000);

    //     // get newsletter fields
    //     let title = await driver.findElement(By.id('newsletter-title'));
    //     let content = await driver.findElement(By.id('newsletter-content'));

    //     // send data to fields
    //     await title.sendKeys("TestNewsletter");
    //     await content.sendKeys("TestContent");
    //     await driver.sleep(1000);

    //     await driver.findElement(By.id('create-newsletter-btn')).click();
    //     await driver.sleep(1000);

    //     // check if newsletter was created
    //     await GoToPage(driver, "http://localhost:3000/newsletter/latest/");
    //     let newsLetterXPath = "//div[text()='TestContent']";
    //     let newsLetterExists = (await driver.findElements(By.xpath(newsLetterXPath))).length != 0;
    //     //assert.equal(newsLetterExists, true); 
    // });

});

async function Login(driver) {
    // go to login page
    await driver.get('http://localhost:3000/');

    // get the login fields
    let usernameBox = await driver.findElement(By.id('username'));
    let passwordBox = await driver.findElement(By.id('password'));
    let loginButton = await driver.findElement(By.id('sign-in-button'));

    // send data to the fields
    await usernameBox.sendKeys(test_username);
    await passwordBox.sendKeys(test_password);

    // click on sign in button
    await loginButton.click();
    await driver.sleep(2000);
}

async function GoToPage(driver, url) {
    // go to the url specified
    await driver.navigate().to(url);
    await driver.sleep(2000);

    // check if correct page is loaded
    let currentURL = await driver.getCurrentUrl();
    assert.strictEqual(currentURL, url);
}

async function GetTableData(driver, testName) {
    // get the rows from the table
    let tableRows =  await driver.findElements(By.className('rdt_TableRow'));

    // check if user is created by checking for first name
    // find the new row we added (should always be the last one)
    let testRow = tableRows[tableRows.length - 1];
    let testRowColumns = await testRow.findElements(By.className('rdt_TableCell'));

    assert.equal(await testRowColumns[3].getText(), testName);

    // get id of new user from id column
    let id = await testRowColumns[2].getText();

    return {tableRows: tableRows, testRow: testRow, testRowColumns: testRowColumns, userId: id };
}