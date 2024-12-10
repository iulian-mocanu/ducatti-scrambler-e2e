import { test, expect } from "@playwright/test";
import * as helper from "./helperFunctions";
import sharp from "sharp"; //Requires node version to be above 18.17.0

test("Navigate to Ducati website", async ({ page }) => {
	// Arrange
	await helper.navigateToPage(page);

	// Act
	await helper.startCreationProcess(page);

	// Assert
	const textOnForm = await page.getByRole("heading", {
		name: "Create Your Custom Scrambler Ducati",
	});
	await expect(textOnForm).toBeVisible();
});

test("Generate Ducati images", async ({ page }) => {
	// Arrange
	test.setTimeout(helper.TIMEOUT);
	await helper.navigateToPage(page);
	await helper.startCreationProcess(page);

	// Act
	await helper.generateImages(page);

	// Assert
	const generatedImageButton = await page.getByRole("button", {
		name: "generated image",
	});
	await expect(generatedImageButton).toHaveCount(4);
});

test("Fill details and download a 2056 x 1368 image", async ({ page }) => {
	// Arrange
	test.setTimeout(helper.TIMEOUT);
	await helper.navigateToPage(page);
	await helper.startCreationProcess(page);
	await helper.generateImages(page);

	//Act
	await helper.fillDetailsAndSubmit(page);

	//Assert
	const savedPath = await helper.selectImageAndDownload(page);
	const metadata = await sharp(savedPath).metadata();

	await expect(metadata.width).toBe(2056);
	await expect(metadata.height).toBe(1368);
});
