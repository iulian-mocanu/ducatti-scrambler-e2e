import { Page } from "@playwright/test";
import path from "path";

const BASE_URL = "https://hacktheicon.scramblerducati.com/";
export const TIMEOUT = 60000;

export async function navigateToPage(page: Page) {
	await page.goto(BASE_URL);
	await handleCookiesDialog(page); //Accept cookies as soon as the modal is displayed
}

export async function handleCookiesDialog(page: Page) {
	const cookieButton = await page.getByRole("button", {
		name: "Accept All Cookies",
	});
	await cookieButton.click();
}

export async function startCreationProcess(page: Page) {
	const startButton = await page.getByRole("link", { name: "Start to create" });
	await startButton.click();
}

export async function generateImages(page: Page, text = "blue") {
	const textBox = await page.getByRole("textbox", { name: "Scrambler Ducati" });
	const generateButton = await page.getByRole("button", {
		name: "Generate",
		exact: true,
	});
	await textBox.fill(text);
	await generateButton.click();
}

export async function fillDetailsAndSubmit(page: Page) {
	const firstNameBox = await page.getByRole("textbox", { name: "First Name" });
	const lastNameBox = await page.getByRole("textbox", { name: "Last Name" });
	const emailBox = await page.getByRole("textbox", { name: "Email" });
	const countryDropdown = await page.getByRole("combobox", {
		name: "Select Country",
	});
	const country = await page
		.getByLabel("American Samoa") // To be randomized
		.getByText("American Samoa"); // Same here
	const termsAndConditionsBox = await page.getByLabel("to understand your");
	const submitButton = await page.getByRole("button", { name: "Submit" });

	await firstNameBox.fill("Test");
	await lastNameBox.fill("Name");
	await emailBox.fill("test@testing.com"); // Can be replaced with an authentic email address if needed
	await countryDropdown.click();
	await country.click();
	await termsAndConditionsBox.click();
	await submitButton.click();
}

export async function selectImageAndDownload(
	page: Page,
	selectedImageIndex = 2 // To be randomized
) {
	const selectedImage = await page
		.getByRole("button", { name: "generated image" })
		.nth(selectedImageIndex);
	const nextButton = await page.getByRole("button", { name: "Next" });
	const downloadButton = await page.getByRole("button", { name: "Download" });

	await selectedImage.click();
	await nextButton.click();
	const downloadPromise = page.waitForEvent("download", { timeout: TIMEOUT });
	await downloadButton.click();

	const download = await downloadPromise;
	const savedPath = path.join("test-results", download.suggestedFilename()); // Path to be confirmed
	await download.saveAs(savedPath);

	return savedPath;
}
