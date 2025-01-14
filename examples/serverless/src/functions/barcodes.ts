import { ALBEvent, ALBResult } from "aws-lambda";
import { PKPass } from "../../../../lib";
import { finish400WithoutModelName, createPassGenerator } from "../shared";

/**
 * Lambda for barcodes example
 */

export async function barcodes(event: ALBEvent) {
	finish400WithoutModelName(event);

	const { modelName, alt, ...passOptions } = event.queryStringParameters;

	const passGenerator = createPassGenerator(modelName, passOptions);

	const pass = (await passGenerator.next()).value as PKPass;

	if (alt === "true") {
		// After this, pass.props["barcodes"] will have support for all the formats
		pass.setBarcodes("Thank you for using this package <3");

		console.log(
			"Barcodes support is autocompleted:",
			pass.props["barcodes"],
		);
	} else {
		// After this, pass.props["barcodes"] will have support for just two of three
		// of the passed format (the valid ones);

		pass.setBarcodes(
			{
				message: "Thank you for using this package <3",
				format: "PKBarcodeFormatCode128",
			},
			{
				message: "Thank you for using this package <3",
				format: "PKBarcodeFormatPDF417",
			},
		);
	}

	return (await passGenerator.next(pass as PKPass)).value as ALBResult;
}
